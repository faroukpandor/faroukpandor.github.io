import test from 'node:test';
import assert from 'node:assert/strict';
import { computeAgeing, hasSensitiveLeak, parseCsv, toCsv } from '../assets/js/opportunity-ops.mjs';
import { validateSchemasOffline } from '../scripts/opportunity-cli.mjs';

test('computes ageing states accurately per OPPORTUNITY-AGEING-AND-FOLLOW-UP-CONTRACT', () => {
  assert.equal(computeAgeing({ state: 'TODAY', next_action: '' }, '2026-11-09'), 'DATA-QUALITY');
  assert.equal(computeAgeing({ state: 'DONE', next_action: 'Closed', due_date: '2026-10-01' }, '2026-11-09'), 'DONE');
  assert.equal(computeAgeing({ state: 'TODAY', next_action: 'Call buyer', due_date: '2026-11-05', review_date: '2026-11-09' }, '2026-11-09'), 'OVERDUE');
  assert.equal(computeAgeing({ state: 'HOLD', next_action: 'Wait gate', due_date: '2026-11-10', review_date: '2026-11-10' }, '2026-11-09'), 'HOLD');
  assert.equal(computeAgeing({ state: 'HOLD', next_action: 'Wait gate', due_date: '2026-11-15', review_date: '2026-11-06' }, '2026-11-09'), 'STALE');
  assert.equal(computeAgeing({ state: 'DUE', next_action: 'Check status', due_date: '2026-11-12', review_date: '2026-11-09' }, '2026-11-09'), 'DUE');
  assert.equal(computeAgeing({ state: 'WAITING', next_action: 'Monitor reply', due_date: '2026-11-15', review_date: '2026-11-12' }, '2026-11-09'), 'CURRENT');
});

test('RFC-4180 CSV roundtrip preserves commas, embedded quotes and newlines', () => {
  const headers = ['id', 'note', 'owner'];
  const rows = [
    { id: 'OPP-1', note: 'Need "food-grade" crates, qty 50\nGaborone delivery', owner: 'Farouk' },
  ];
  const csv = toCsv(headers, rows);
  const parsed = parseCsv(csv);
  assert.deepEqual(parsed[0], headers);
  assert.deepEqual(parsed[1], ['OPP-1', 'Need "food-grade" crates, qty 50\nGaborone delivery', 'Farouk']);
});

test('privacy guard detects secret tokens and local phone numbers', () => {
  assert.equal(hasSensitiveLeak('clean text').hasSecretPattern, false);
  assert.equal(hasSensitiveLeak('ghp_1234567890abcdef').hasSecretPattern, true);
  assert.equal(hasSensitiveLeak('+267 71234567').hasLocalPhoneNumber, true);
});

test('all 6 JSON Schemas validate repository artifacts cleanly', () => {
  const res = validateSchemasOffline();
  assert.equal(res.schemasChecked, 6);
  assert.ok(res.queueItems >= 16);
  assert.equal(res.queueItems, res.registerItems);
});
