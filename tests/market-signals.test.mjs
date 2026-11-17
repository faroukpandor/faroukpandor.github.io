import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { pathToFileURL } from 'node:url';

import { buildSignalDigest, extractHtmlSignals } from '../scripts/market-signals.mjs';

const tempDirs = [];
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

/**
 * The digest reads committed evidence snapshots. Asserting against whatever the
 * last live fetch happened to leave behind made this test fail the moment a
 * government host went down — a flaky test that hid real behaviour instead of
 * proving it. These fixtures pin the behaviour deterministically.
 */
function fixtureDir() {
  const dir = mkdtempSync(join(tmpdir(), 'signal-digest-'));
  tempDirs.push(dir);
  return dir;
}

function writeSource(dir, id, { html, status, retrieved, error }) {
  const record = { source: `https://www.example.gov.bw/${id}`, status };
  if (retrieved) record.retrieved_utc = retrieved;
  if (error) record.error = error;
  if (html) {
    writeFileSync(join(dir, `${id}.html`), html);
    record.sha256 = createHash('sha256').update(Buffer.from(html, 'utf8')).digest('hex');
  }
  writeFileSync(join(dir, `${id}.json`), JSON.stringify(record, null, 2));
}

test('extractHtmlSignals strips scripts/styles and reads meta description fallback', () => {
  const sample = `<!doctype html><html><head>
    <title>Test Portal</title>
    <meta name="description" content="Botswana horticulture &amp; agro-processing opportunities">
    <style>body{color:red}</style><script>alert("x")</script>
  </head><body><a href="/invest/agro">Agro Sector</a></body></html>`;
  const extracted = extractHtmlSignals(sample, 'https://example.org/page');
  assert.equal(extracted.title, 'Test Portal');
  assert.deepEqual(extracted.headings, ['Botswana horticulture & agro-processing opportunities']);
  assert.equal(extracted.links[0].url, 'https://example.org/invest/agro');
});

test('buildSignalDigest verifies hashes, classifies STALE/ERROR honestly and prevents silent failures', () => {
  const dir = fixtureDir();
  writeSource(dir, 'healthy-source', {
    status: 'FETCHED',
    retrieved: '2026-11-09T05:17:00.000Z',
    html: '<html><head><title>Healthy Portal</title></head><body><h1>Investment areas</h1></body></html>',
  });
  writeSource(dir, 'failing-source', {
    status: 'ERROR',
    error: 'HTTP Error 503: Service Unavailable',
  });

  const digest = buildSignalDigest('2026-11-09', pathToFileURL(dir + '/'));

  // 1. Both sources are represented; a failure is never dropped from the digest.
  assert.equal(digest.summary.total_sources, 2);
  assert.equal(digest.summary.fetched_count, 1);
  assert.equal(digest.summary.error_count, 1);

  // 2. A successful fetch is hash-verified against its snapshot and classified FETCHED.
  const healthy = digest.sources.find((s) => s.id === 'healthy-source');
  assert.equal(healthy.status, 'FETCHED');
  assert.equal(healthy.has_html_snapshot, true);
  assert.equal(healthy.sha256_verified, true, 'stored sha256 must match the snapshot bytes');
  assert.equal(healthy.classification, 'FETCHED');
  assert.equal(healthy.page_title, 'Healthy Portal');

  // 3. A failed fetch is reported as ERROR with its message intact.
  const failing = digest.sources.find((s) => s.id === 'failing-source');
  assert.equal(failing.status, 'ERROR');
  assert.match(failing.error, /HTTP Error 503/);
  assert.equal(failing.classification, 'ERROR');

  // 4. Ageing past the threshold reclassifies a healthy source as STALE.
  const staleDigest = buildSignalDigest('2026-11-17', pathToFileURL(dir + '/'));
  const staleHealthy = staleDigest.sources.find((s) => s.id === 'healthy-source');
  assert.equal(staleHealthy.classification, 'STALE');
  assert.ok(staleHealthy.age_days >= 7);
});

test('a tampered snapshot fails hash verification instead of being trusted', () => {
  const dir = fixtureDir();
  writeSource(dir, 'tampered-source', {
    status: 'FETCHED',
    retrieved: '2026-11-09T05:17:00.000Z',
    html: '<html><head><title>Original</title></head><body></body></html>',
  });
  // Overwrite the snapshot after the hash was recorded.
  writeFileSync(join(dir, 'tampered-source.html'), '<html><head><title>Tampered</title></head></html>');

  const digest = buildSignalDigest('2026-11-09', pathToFileURL(dir + '/'));
  const source = digest.sources.find((s) => s.id === 'tampered-source');
  assert.equal(source.sha256_verified, false, 'a changed snapshot must not verify');
  assert.notEqual(source.sha256_expected, source.sha256_actual);
});
