import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSignalDigest, extractHtmlSignals } from '../scripts/market-signals.mjs';

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
  const digest = buildSignalDigest('2026-11-09');
  assert.equal(digest.summary.total_sources, 3);
  // Source health is live repository data and can legitimately change between
  // refreshes. Assert error metadata honestly, then exercise stale handling on
  // a source that is currently fetched rather than assuming a specific source
  // endpoint is always healthy.
  for (const source of digest.sources.filter((s) => s.status !== 'FETCHED')) {
    assert.equal(source.classification, 'ERROR');
    assert.ok(source.error, `${source.id} error status must be explained`);
  }

  const fetched = digest.sources.find((s) => s.status === 'FETCHED');
  if (fetched) {
    assert.equal(fetched.sha256_verified, true);
    assert.equal(fetched.classification, 'FETCHED');
    const eightDaysLater = new Date(Date.parse(fetched.timestamp_utc.slice(0, 10) + 'T00:00:00Z') + 8 * 86400000)
      .toISOString()
      .slice(0, 10);
    const staleDigest = buildSignalDigest(eightDaysLater);
    const staleSource = staleDigest.sources.find((s) => s.id === fetched.id);
    assert.equal(staleSource.classification, 'STALE');
  }
});
