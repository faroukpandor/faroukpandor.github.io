import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TAXONOMY_CATEGORIES,
  normalizeCategoryFromNeed,
  qualifyAndRouteDemand,
} from '../assets/js/demand-router.mjs';
import { intakeToCanonicalRecord } from '../scripts/opportunity-cli.mjs';

test('routes digital website health work to Mokoro without claiming client ownership', () => {
  const res = qualifyAndRouteDemand({
    need: 'A business problem or workflow',
    requirement: 'Need website audit and broken enquiry form check on SME site',
    location: 'Gaborone, Botswana',
    timing: 'This week',
  });

  assert.equal(res.destination.id, 'MOKORO');
  assert.equal(res.confidence, 'QUALIFIED-FOR-TRIAGE');
  assert.equal(res.handoff_package.ownership_status, 'FAROUK-OWNED');
});

test('never forces routing when requirement detail is insufficient', () => {
  const res = qualifyAndRouteDemand({
    need: 'Buy or source something',
    requirement: 'Need price',
    location: '',
    timing: '',
  });
  assert.equal(res.destination.id, 'CLARIFY');
  assert.equal(res.confidence, 'NEEDS-CLARIFICATION');
  assert.ok(res.missing_fields.length >= 2);
});

test('enforces employer/client boundary segregation and regulated specialist referral', () => {
  const emp = qualifyAndRouteDemand({
    need: 'Business help',
    requirement: 'White City Discount POS and VAT margin reconciliation',
    location: 'Gaborone',
    timing: 'This month',
    is_client_or_employer_asset: true,
    is_employer_owned: true,
  });
  assert.equal(emp.destination.id, 'CLIENT_BOUNDARY');
  assert.equal(emp.handoff_package.ownership_status, 'EMPLOYER-OWNED');

  const reg = qualifyAndRouteDemand({
    need: 'Service or specialist',
    requirement: 'Need clinical veterinary diagnosis and prescription for herd',
    location: 'Lobatse',
    timing: 'Urgent',
  });
  assert.equal(reg.destination.id, 'PROVIDER_NETWORK');
  assert.equal(reg.commercial_mode, 'COORDINATED-REFERRAL');
});

test('converts portable-opportunity-intake/v1 JSON to canonical opportunity record', () => {
  const { record, routing } = intakeToCanonicalRecord({
    schema: 'portable-opportunity-intake/v1',
    captured_utc: '2026-11-09T10:00:00.000Z',
    source_channel: 'whatsapp',
    source_asset: 'index.html',
    consent_acknowledged: true,
    need: 'Agricultural need or project',
    name: 'Synthetic Tester',
    contact: 'test@example.org',
    requirement: 'Sourcing poultry feed supply quotes for 500 layers',
    location: 'Molepolole',
    timing: 'Next 2 weeks',
  }, 4);

  assert.equal(record.opportunity_id, 'OPP-2026-0004');
  assert.equal(record.customer_id, 'CUS-2026-0004');
  assert.equal(routing.destination.id, 'AGRISAGE360');
  assert.equal(record.status, 'PROBLEM-VERIFIED');
});

// Regression: single-line CLI/WhatsApp input used to route to CLARIFY because the
// free-text `need` was ignored whenever `requirement` was absent.
test('routes a free-text need with no formal requirement field', () => {
  const res = qualifyAndRouteDemand({ need: 'I need a supplier for cleaning chemicals in Gaborone' });
  assert.equal(res.category, 'Buy or source something');
  assert.equal(res.destination.id, 'GENERAL_DEALER');
  assert.equal(res.missing_fields.includes('specific requirement / problem description'), false);
});

test('supplier and procurement vocabulary maps to sourcing, not "Something else"', () => {
  assert.equal(normalizeCategoryFromNeed('need a supplier'), 'Buy or source something');
  assert.equal(normalizeCategoryFromNeed('requesting quotations from vendors'), 'Buy or source something');
  assert.equal(normalizeCategoryFromNeed('procure 500 units'), 'Buy or source something');
  assert.equal(normalizeCategoryFromNeed('raise an RFQ'), 'Buy or source something');
});

test('homepage intent-card labels remain keyword-only and are never treated as descriptions', () => {
  for (const label of TAXONOMY_CATEGORIES) {
    assert.equal(normalizeCategoryFromNeed(label), label);
  }
  // A bare taxonomy label must not unlock an actionable route on its own.
  const res = qualifyAndRouteDemand({ need: 'Buy or source something' });
  assert.equal(res.destination.id, 'CLARIFY');
});
