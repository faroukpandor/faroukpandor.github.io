#!/usr/bin/env node
// Portfolio Operator CLI — intake conversion, GH-68 qualification routing,
// Botswana landed economics & schema validation.
//
// Usage:
//   node scripts/opportunity-cli.mjs route --need "..." --requirement "..." --location "..." --timing "..."
//   node scripts/opportunity-cli.mjs intake-to-record <intake.json> [--seq 1]
//   node scripts/opportunity-cli.mjs landed --origin SACU --qty 100 --unit-cost 50 --fx 0.76 --price 6000 [--markdown]
//   node scripts/opportunity-cli.mjs validate-schemas

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { calculateLandedEconomics, formatLandedQuoteMarkdown } from '../assets/js/landed-economics.mjs';
import { buildCanonicalIds, qualifyAndRouteDemand } from '../assets/js/demand-router.mjs';
import { RECORD_TEMPLATE_HEADERS, parseCsv } from '../assets/js/opportunity-ops.mjs';

const ROOT = new URL('..', import.meta.url);
const pathFor = (rel) => new URL(rel, ROOT);

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) flags[key] = true;
      else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

export function intakeToCanonicalRecord(intake, seq = 1) {
  assert.equal(intake.schema, 'portable-opportunity-intake/v1', 'expected portable-opportunity-intake/v1');
  const routing = qualifyAndRouteDemand({
    need: intake.need,
    requirement: intake.requirement,
    location: intake.location,
    timing: intake.timing,
    captured_utc: intake.captured_utc,
    source_asset: intake.source_asset,
    sequence: seq,
  });
  const dateReceived = String(intake.captured_utc || '2026-11-09').slice(0, 10);
  const ids = buildCanonicalIds(dateReceived, seq);

  const record = {
    opportunity_id: ids.opportunity_id,
    date_received: dateReceived,
    source_channel: intake.source_channel || 'Website',
    source_asset: intake.source_asset || 'index.html',
    customer_id: ids.customer_id,
    customer_type: '',
    location: intake.location || '',
    problem: intake.requirement || '',
    requirement: intake.requirement || '',
    category: routing.category,
    urgency: intake.timing || '',
    quantity_frequency: intake.budget_quantity || '',
    budget_signal: intake.budget_quantity || '',
    current_solution: '',
    desired_outcome: '',
    capability_route: routing.commercial_mode,
    enterprise_route: routing.destination.label,
    ownership_status: routing.destination.ownership_status,
    commercial_mode: routing.commercial_mode,
    provider_id: '',
    evidence_ids: [ids.evidence_id],
    quote_id: '',
    cost_id: '',
    compliance_id: '',
    commitment: 'Interest',
    status: routing.confidence === 'QUALIFIED-FOR-TRIAGE' ? 'PROBLEM-VERIFIED' : 'SIGNAL',
    next_action: routing.handoff_package.next_action,
    owner: 'Farouk Pandor',
    last_verified: dateReceived,
    review_due: dateReceived,
    outcome_id: '',
    learning: '',
  };

  return { record, routing };
}

export function validateSchemasOffline() {
  const schemasDir = pathFor('templates/SCHEMAS/');
  const files = readdirSync(schemasDir.pathname).filter((f) => f.endsWith('.schema.json')).sort();
  assert.equal(files.length, 6, 'expected 6 core schema files under templates/SCHEMAS');
  for (const f of files) {
    const s = JSON.parse(readFileSync(new URL(f, schemasDir), 'utf8'));
    assert.ok(s.$schema && s.$id && s.title, `${f} missing JSON Schema metadata`);
  }

  // Validate real repo records against schema contracts
  const queue = JSON.parse(readFileSync(pathFor('data/next-actions/NEXT-ACTION-QUEUE.json'), 'utf8'));
  const queueSchema = JSON.parse(readFileSync(new URL('next-action-queue.schema.json', schemasDir), 'utf8'));
  assert.equal(queue.schema, queueSchema.properties.schema.const);
  const allowedStates = new Set(queueSchema.properties.actions.items.properties.state.enum);
  for (const a of queue.actions) {
    for (const req of queueSchema.properties.actions.items.required) {
      assert.ok(a[req] !== undefined, `queue action ${a.opportunity_id} missing ${req}`);
    }
    assert.ok(allowedStates.has(a.state), `invalid state ${a.state}`);
  }

  const register = JSON.parse(readFileSync(pathFor('data/portfolio-opportunity-register.json'), 'utf8'));
  const regSchema = JSON.parse(readFileSync(new URL('portfolio-opportunity-register.schema.json', schemasDir), 'utf8'));
  assert.equal(register.schema_version, regSchema.properties.schema_version.const);
  const allowedOwn = new Set(regSchema.properties.records.items.properties.ownership_status.enum);
  for (const r of register.records) {
    for (const req of regSchema.properties.records.items.required) {
      assert.ok(r[req] !== undefined, `register record ${r.opportunity_id} missing ${req}`);
    }
    assert.ok(allowedOwn.has(r.ownership_status), `invalid ownership_status ${r.ownership_status}`);
  }

  const tplRec = JSON.parse(readFileSync(pathFor('templates/OPPORTUNITY-RECORD-TEMPLATE.json'), 'utf8'));
  assert.deepEqual(Object.keys(tplRec), RECORD_TEMPLATE_HEADERS);

  const ws = JSON.parse(readFileSync(pathFor('templates/LANDED-ECONOMICS-WORKSHEET.json'), 'utf8'));
  const wsCalc = calculateLandedEconomics(ws);
  assert.equal(wsCalc.quote_controls.status, 'ESTIMATE');

  const ledgerCsv = parseCsv(readFileSync(pathFor('templates/AFRICA-OPPORTUNITY-LEDGER-TEMPLATE.csv'), 'utf8'));
  const africaSchema = JSON.parse(readFileSync(new URL('africa-opportunity-ledger.schema.json', schemasDir), 'utf8'));
  assert.deepEqual(ledgerCsv[0], africaSchema.required);

  const provCsv = parseCsv(readFileSync(pathFor('templates/PROVIDER-NETWORK-TEMPLATE.csv'), 'utf8'));
  assert.equal(provCsv[0].length, 20);
  const ordCsv = parseCsv(readFileSync(pathFor('templates/GENERAL-DEALER-ORDER-LEDGER-TEMPLATE.csv'), 'utf8'));
  assert.equal(ordCsv[0].length, 19);

  return { schemasChecked: files.length, queueItems: queue.actions.length, registerItems: register.records.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, ...rest] = process.argv.slice(2);
  const { positional, flags } = parseArgs(rest);

  if (cmd === 'route') {
    const result = qualifyAndRouteDemand({
      need: flags.need || '',
      requirement: flags.requirement || '',
      location: flags.location || '',
      timing: flags.timing || '',
      is_client_or_employer_asset: Boolean(flags.client),
      is_regulated_specialty: Boolean(flags.regulated),
      sequence: Number(flags.seq || 1),
    });
    console.log(JSON.stringify(result, null, 2));
  } else if (cmd === 'intake-to-record') {
    const filePath = positional[0];
    if (!filePath) {
      console.error('usage: node scripts/opportunity-cli.mjs intake-to-record <intake.json> [--seq 1]');
      process.exit(2);
    }
    const intake = JSON.parse(readFileSync(filePath, 'utf8'));
    console.log(JSON.stringify(intakeToCanonicalRecord(intake, Number(flags.seq || 1)), null, 2));
  } else if (cmd === 'landed') {
    const res = calculateLandedEconomics({
      opportunity_id: flags.id || 'OPP-2026-0001',
      product_or_service: flags.product || 'Unspecified item',
      origin_scope: flags.origin || 'SACU',
      quantity: flags.qty || 1,
      fx_rate: flags.fx || 1,
      supplier_unit_cost: flags['unit-cost'] || 0,
      freight: flags.freight || 0,
      insurance: flags.insurance || 0,
      customs_duty_pct: flags['duty-pct'] || 0,
      clearing_handling: flags.clearing || 0,
      coordination_cost: flags.coord || 0,
      proposed_customer_price: flags.price || 0,
      supplier_deposit_pct: flags['sup-dep'] || 100,
      customer_deposit_pct: flags['cust-dep'] || 0,
      evidence_refs: flags.evidence || '',
      all_material_costs_verified: Boolean(flags.verified),
    });
    console.log(flags.markdown ? formatLandedQuoteMarkdown(res) : JSON.stringify(res, null, 2));
  } else if (cmd === 'validate-schemas') {
    const summary = validateSchemasOffline();
    console.log(
      `${summary.schemasChecked} JSON schemas & ${summary.queueItems}/${summary.registerItems} records validated cleanly (offline)`,
    );
  } else {
    console.error('usage: node scripts/opportunity-cli.mjs <route|intake-to-record|landed|validate-schemas>');
    process.exit(2);
  }
}
