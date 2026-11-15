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
  const gov = digest.sources.find((s) => s.id === 'government-business-opportunities');
  assert.equal(gov.status, 'ERROR');
  const npc = digest.sources.find((s) => s.id === 'npc-national-development-plans');
  assert.equal(npc.sha256_verified, true);
  assert.equal(npc.classification, 'FETCHED');

  const eightDaysLater = new Date(Date.parse(npc.timestamp_utc.slice(0, 10) + 'T00:00:00Z') + 8 * 86400000)
    .toISOString()
    .slice(0, 10);
  const staleDigest = buildSignalDigest(eightDaysLater);
  const staleNpc = staleDigest.sources.find((s) => s.id === 'npc-national-development-plans');
  assert.equal(staleNpc.classification, 'STALE');
});
