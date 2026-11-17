import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import { pathToFileURL } from 'node:url';

import {
  SOURCES,
  SCHEMA_VERSION,
  buildSourceRecord,
  detectSoftFailure,
  fetchSource,
  fetchSourceWithBody,
  fetchSourceWithFallback,
  persistSourceRecord,
  readSourceRecords,
  renderHealthTable,
  summariseHealth,
} from '../scripts/market-signals-fetch.mjs';

const tempDirs = [];
function tempDir() {
  const dir = mkdtempSync(join(tmpdir(), 'signal-fetch-'));
  tempDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

const source = { id: 'test-source', url: 'https://example.gov.bw/page' };

function htmlResponse(body, { status = 200, statusText = 'OK' } = {}) {
  const buf = Buffer.from(body, 'utf8');
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  };
}

describe('market signal fetcher — pure record construction', () => {
  it('1. builds a deterministic FETCHED record with a stable sha256', () => {
    const now = new Date('2026-11-09T05:17:00.000Z');
    const a = buildSourceRecord({ ...source, html: '<html>ok</html>', now });
    const b = buildSourceRecord({ ...source, html: '<html>ok</html>', now });

    assert.equal(a.schema, SCHEMA_VERSION);
    assert.equal(a.status, 'FETCHED');
    assert.equal(a.source, source.url);
    assert.equal(a.retrieved_utc, '2026-11-09T05:17:00.000Z');
    assert.match(a.sha256, /^[a-f0-9]{64}$/);
    assert.equal(a.sha256, b.sha256, 'same bytes must hash identically');
    assert.equal(a.bytes, 15);
    assert.equal(a.error, undefined);
  });

  it('2. builds an ERROR record from an exception and records no hash', () => {
    const now = new Date('2026-11-09T05:17:00.000Z');
    const r = buildSourceRecord({ ...source, error: new Error('HTTP 503 Service Unavailable'), now });

    assert.equal(r.status, 'ERROR');
    assert.equal(r.error, 'HTTP 503 Service Unavailable');
    assert.equal(r.sha256, undefined);
    assert.equal(r.attempted_utc, '2026-11-09T05:17:00.000Z');
    assert.equal(r.retrieved_utc, undefined);
  });

  it('3. different bodies never collide on sha256', () => {
    const one = buildSourceRecord({ ...source, html: 'a' });
    const two = buildSourceRecord({ ...source, html: 'b' });
    assert.notEqual(one.sha256, two.sha256);
  });
});

describe('market signal fetcher — network failure handling', () => {
  it('4. treats a non-2xx response as ERROR, not as an empty success', async () => {
    const record = await fetchSource(source, {
      fetchImpl: async () => htmlResponse('unavailable', { status: 503, statusText: 'Service Unavailable' }),
    });
    assert.equal(record.status, 'ERROR');
    assert.match(record.error, /HTTP 503/);
  });

  it('5. captures an expired certificate error verbatim so it stays visible', async () => {
    const tlsError = new Error(
      'certificate verify failed: certificate has expired (unable to get local issuer certificate)',
    );
    const record = await fetchSource(source, {
      fetchImpl: async () => {
        throw tlsError;
      },
    });
    assert.equal(record.status, 'ERROR');
    assert.match(record.error, /certificate has expired/);
  });

  it('6. turns an abort/timeout into a readable ERROR rather than hanging', async () => {
    const record = await fetchSource(source, {
      timeoutMs: 5,
      fetchImpl: async (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => {
            const err = new Error('aborted');
            err.name = 'AbortError';
            reject(err);
          });
        }),
    });
    assert.equal(record.status, 'ERROR');
    assert.match(record.error, /timed out after 5ms/);
  });
});

describe('market signal fetcher — snapshots and health', () => {
  it('7. returns the body so the caller can persist a snapshot in one request', async () => {
    const { record, body } = await fetchSourceWithBody(source, {
      fetchImpl: async () => htmlResponse('<html><h1>Investment areas</h1></html>'),
    });
    assert.equal(record.status, 'FETCHED');
    assert.ok(body instanceof Buffer);
    assert.match(body.toString('utf8'), /Investment areas/);
  });

  it('8. a failed fetch never deletes the last good snapshot', async () => {
    const dir = tempDir();
    const dirUrl = pathToFileURL(dir + '/');
    writeFileSync(join(dir, 'test-source.html'), '<html>last good copy</html>');
    writeFileSync(
      join(dir, 'test-source.json'),
      JSON.stringify({ status: 'FETCHED', sha256: 'deadbeef', retrieved_utc: '2026-11-01T00:00:00.000Z' }),
    );

    const failed = await fetchSource(source, {
      fetchImpl: async () => {
        throw new Error('HTTP Error 503: Service Unavailable');
      },
    });
    persistSourceRecord(failed, 'test-source', dirUrl);

    assert.ok(existsSync(join(dir, 'test-source.html')), 'snapshot must survive a failed fetch');
    assert.equal(readFileSync(join(dir, 'test-source.html'), 'utf8'), '<html>last good copy</html>');
    assert.equal(JSON.parse(readFileSync(join(dir, 'test-source.json'), 'utf8')).status, 'ERROR');
  });

  it('9. summariseHealth flags a partial run and an all-failed run distinctly', () => {
    const partial = summariseHealth([
      { id: 'a', status: 'FETCHED' },
      { id: 'b', status: 'ERROR' },
    ]);
    assert.deepEqual(
      { total: partial.total, fetched: partial.fetched, failed: partial.failed, allFailed: partial.allFailed, complete: partial.complete },
      { total: 2, fetched: 1, failed: 1, allFailed: false, complete: false },
    );
    assert.deepEqual(partial.failedIds, ['b']);

    const down = summariseHealth([
      { id: 'a', status: 'ERROR' },
      { id: 'b', status: 'ERROR' },
    ]);
    assert.equal(down.allFailed, true, 'an all-failed run must be treated as a failure');

    const healthy = summariseHealth([{ id: 'a', status: 'FETCHED' }]);
    assert.equal(healthy.complete, true);
    assert.equal(healthy.allFailed, false);
  });

  it('10. renders a health table that escapes pipe characters in errors', () => {
    const table = renderHealthTable([
      { id: 'a', status: 'FETCHED', retrieved_utc: '2026-11-09T05:17:00.000Z' },
      { id: 'b', status: 'ERROR', attempted_utc: '2026-11-09T05:17:01.000Z', error: 'HTTP 503 | down' },
    ]);
    assert.match(table, /\| Source \| Status \| Timestamp \(UTC\) \| Note \|/);
    assert.match(table, /\| b \| ERROR \| 2026-11-09T05:17:01.000Z \| HTTP 503 \/ down \|/);
  });

  it('11. readSourceRecords ignores the digest and returns ids', () => {
    const dir = tempDir();
    const dirUrl = pathToFileURL(dir + '/');
    writeFileSync(join(dir, 'alpha.json'), JSON.stringify({ status: 'FETCHED', source: 'https://x' }));
    writeFileSync(join(dir, 'SIGNAL-DIGEST.json'), JSON.stringify({ schema: 'africa-market-signal-digest/v1' }));
    const records = readSourceRecords(dirUrl);
    assert.equal(records.length, 1);
    assert.equal(records[0].id, 'alpha');
    assert.equal(records[0].status, 'FETCHED');
  });

  it('12. the configured source list uses canonical https hosts only', () => {
    assert.equal(SOURCES.length, 3);
    for (const s of SOURCES) {
      assert.match(s.url, /^https:\/\/www\./, `${s.id} must use the canonical www. https host`);
      assert.ok(s.id && s.label, `${s.url} needs an id and label`);
    }
    assert.equal(new Set(SOURCES.map((s) => s.id)).size, SOURCES.length, 'source ids must be unique');
  });
});

describe('market signal fetcher — soft failures and fallbacks', () => {
  const MAINTENANCE_PAGE =
    '<!DOCTYPE html><html><head><title>Site under maintenance | Government of Botswana</title></head>' +
    '<body><h1>Site under maintenance</h1><p>Government of Botswana is currently under scheduled ' +
    'maintenance for updates. We should be back shortly.</p></body></html>';

  it('13. treats a maintenance page served with HTTP 200 as ERROR, not FETCHED', async () => {
    const record = await fetchSource(source, {
      fetchImpl: async () => htmlResponse(MAINTENANCE_PAGE),
    });
    assert.equal(record.status, 'ERROR', 'a 200 maintenance page must never count as fetched');
    assert.match(record.error, /maintenance\/unavailable page served with HTTP 200/);
  });

  it('14. detects the outage signatures the live sites actually returned', () => {
    assert.ok(detectSoftFailure(MAINTENANCE_PAGE));
    assert.ok(detectSoftFailure('<h1>503 Service Unavailable</h1>'));
    assert.ok(detectSoftFailure('<title>503 Service Unavailable</title>'));
    assert.ok(detectSoftFailure('   '), 'an empty body is not usable evidence');
    assert.equal(detectSoftFailure('<html><body><h1>Investment areas</h1></body></html>'), null);
  });

  it('15. falls back to the documented alternative and records that it did', async () => {
    const withFallback = { ...source, fallback: 'https://www.gov.bw/taxonomy/term/153' };
    const calls = [];
    const { record, body } = await fetchSourceWithFallback(withFallback, {
      fetchImpl: async (url) => {
        calls.push(url);
        if (url === withFallback.url) return htmlResponse(MAINTENANCE_PAGE);
        return htmlResponse('<html><body><h1>Identified Possible Business Opportunities</h1></body></html>');
      },
    });

    assert.deepEqual(calls, [withFallback.url, withFallback.fallback], 'primary must be tried first');
    assert.equal(record.status, 'FETCHED');
    assert.equal(record.fallback_used, true);
    assert.equal(record.source, withFallback.fallback, 'record must show the URL that actually worked');
    assert.equal(record.primary_source, withFallback.url);
    assert.match(record.primary_error, /maintenance/);
    assert.match(body.toString('utf8'), /Identified Possible Business Opportunities/);
  });

  it('16. reports both errors when the fallback also fails', async () => {
    const withFallback = { ...source, fallback: 'https://www.gov.bw/taxonomy/term/153' };
    const { record, body } = await fetchSourceWithFallback(withFallback, {
      fetchImpl: async () => {
        throw new Error('HTTP 503 Service Unavailable');
      },
    });
    assert.equal(record.status, 'ERROR');
    assert.equal(body, null);
    assert.match(record.error, /HTTP 503 .*fallback .*also failed.*HTTP 503/);
  });

  it('17. does not invent a fallback for a source with no reachable mirror', () => {
    for (const s of SOURCES) {
      if (s.fallbackStatus === 'no-mirror') {
        assert.equal(s.fallback, null, `${s.id} must not carry a fabricated fallback`);
      }
      if (s.fallback) {
        assert.match(s.fallback, /^https:\/\/www\./, `${s.id} fallback must be an official https host`);
      }
      assert.ok(['standby', 'no-mirror'].includes(s.fallbackStatus), `${s.id} needs a documented fallbackStatus`);
    }
  });

  it('18. health table surfaces a fallback instead of reporting a clean success', () => {
    const table = renderHealthTable([
      {
        id: 'government-business-opportunities',
        status: 'FETCHED',
        retrieved_utc: '2026-11-09T05:17:00.000Z',
        fallback_used: true,
        source: 'https://www.gov.bw/taxonomy/term/153',
        primary_source: 'https://www.gov.bw/doing-business/identified-possible-business-opportunities',
        primary_error: 'maintenance page served with HTTP 200',
      },
    ]);
    assert.match(table, /FALLBACK/);
    assert.match(table, /primary .* failed/);
  });
});
