import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLandedEconomics, formatLandedQuoteMarkdown } from '../assets/js/landed-economics.mjs';

test('SACU import computes 0% duty, 12% VAT on CIF, and keeps unverified costs as ESTIMATE', () => {
  const res = calculateLandedEconomics({
    opportunity_id: 'OPP-2026-0001',
    product_or_service: 'Poultry drinkers',
    origin_scope: 'SACU',
    quantity: 100,
    supplier_currency: 'ZAR',
    fx_rate: 0.76,
    supplier_unit_cost: 50,
    freight: 1000,
    insurance: 200,
    clearing_handling: 500,
    proposed_customer_price: 8000,
    supplier_deposit_pct: 50,
    customer_deposit_pct: 40,
  });

  // supplier = 100*50*0.76 = 3800; freight = 760; insurance = 152; CIF = 4712
  assert.equal(res.breakdown.supplier_total_cost, 3800);
  assert.equal(res.breakdown.cif_value, 4712);
  assert.equal(res.breakdown.customs_duty, 0);
  assert.equal(res.breakdown.vat, 565.44);
  assert.equal(res.totals.total_landed_cost, 5777.44);
  assert.equal(res.totals.gross_contribution, 2222.56);
  // 50% supplier deposit (1900) leaves 1900 deferred obligation payable after arrival
  assert.equal(res.working_capital.supplier_deposit_amount, 1900);
  assert.equal(res.working_capital.supplier_deferred_balance, 1900);
  assert.equal(res.quote_controls.status, 'ESTIMATE');
  assert.ok(res.warnings.some((w) => w.includes('Deferred supplier obligation')));
});

test('NON_SACU import applies duty before VAT and upgrades to VERIFIED-COST only when verified + evidenced', () => {
  const res = calculateLandedEconomics({
    opportunity_id: 'OPP-2026-0002',
    origin_scope: 'NON_SACU',
    quantity: 10,
    supplier_currency: 'USD',
    fx_rate: 13.5,
    supplier_unit_cost: 100,
    freight: 200,
    insurance: 50,
    customs_duty_pct: 15,
    proposed_customer_price: 30000,
    evidence_refs: 'Supplier PI #99 + BURS eTariff lookup',
    all_material_costs_verified: true,
  });

  // CIF = 13500 + 2700 + 675 = 16875; duty 15% = 2531.25; VAT 12% of 19406.25 = 2328.75
  assert.equal(res.breakdown.cif_value, 16875);
  assert.equal(res.breakdown.customs_duty, 2531.25);
  assert.equal(res.breakdown.vat, 2328.75);
  assert.equal(res.quote_controls.status, 'VERIFIED-COST');
  const md = formatLandedQuoteMarkdown(res);
  assert.ok(md.includes('OPP-2026-0002') && md.includes('VERIFIED-COST'));
});

test('rejects invalid zero quantity or negative costs', () => {
  assert.throws(() => calculateLandedEconomics({ quantity: 0 }), RangeError);
  assert.throws(() => calculateLandedEconomics({ fx_rate: -1 }), RangeError);
  assert.throws(() => calculateLandedEconomics({ quantity: 5, supplier_unit_cost: -10 }), RangeError);
});
