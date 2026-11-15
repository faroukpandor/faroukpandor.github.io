#!/usr/bin/env node
// Portfolio Operations Engine — Stage 1/2 static register, queue & dashboard generator.
//
// Usage:
//   node scripts/portfolio-ops.mjs generate   # syncs CSV/JSON register + builds portfolio-control.html
//   node scripts/portfolio-ops.mjs verify     # offline deterministic validation (CI guard)

import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import {
  REGISTER_HEADERS,
  VALID_ACTION_STATES,
  computeAgeing,
  hasSensitiveLeak,
  parseCsv,
  toCsv,
} from '../assets/js/opportunity-ops.mjs';

const ROOT = new URL('..', import.meta.url);
const pathFor = (rel) => new URL(rel, ROOT);

const QUEUE_JSON_PATH = pathFor('data/next-actions/NEXT-ACTION-QUEUE.json');
const QUEUE_CSV_PATH = pathFor('data/next-actions/NEXT-ACTION-QUEUE.csv');
const REGISTER_JSON_PATH = pathFor('data/portfolio-opportunity-register.json');
const REGISTER_CSV_PATH = pathFor('data/portfolio-opportunity-register.csv');
const SUMMARY_JSON_PATH = pathFor('data/portfolio-dashboard-summary.json');
const DASHBOARD_HTML_PATH = pathFor('portfolio-control.html');
const INVENTORY_JSON_PATH = pathFor('data/repository-inventory.json');
const PUBLIC_PROJECTS_PATH = pathFor('data/public-projects.json');
const KPI_CATALOG_PATH = pathFor('templates/PORTFOLIO-DASHBOARD-KPI-CATALOG.csv');
const TEMPLATE_REGISTER_CSV_PATH = pathFor('templates/PORTFOLIO-OPPORTUNITY-REGISTER.csv');
const TEMPLATE_REGISTER_JSON_PATH = pathFor('templates/PORTFOLIO-OPPORTUNITY-REGISTER.json');
const TEMPLATE_RECORD_CSV_PATH = pathFor('templates/OPPORTUNITY-RECORD-TEMPLATE.csv');
const TEMPLATE_RECORD_JSON_PATH = pathFor('templates/OPPORTUNITY-RECORD-TEMPLATE.json');
const SIGNAL_DIGEST_PATH = pathFor('data/market-signals/SIGNAL-DIGEST.json');

const REGISTER_METADATA = {
  'GH-136': {
    created: '2026-10-22',
    source_channel: 'Institutional signal',
    source_asset: 'GitHub issue #136 / Supabase changelog',
    customer_type: 'Internal governance',
    geography: 'Global / Portfolio',
    category: 'Digital',
    problem: 'Vendor Data API grant change requires checking exposure across static and database-backed assets.',
    requirement: 'Audit this repository and escalate database grant/RLS checklist to Supabase-using product.',
    capability_route: 'Governance & technical audit',
    enterprise_destination: 'faroukpandor.github.io (N/A) -> Khaie OS (#79)',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Internal risk control',
    evidence_level: 'E4 - Operationally evidenced audit',
    provider_supplier: 'Supabase',
    economics_status: 'Not applicable',
    compliance_status: 'Verified (static site N/A)',
    customer_commitment: 'None',
    pipeline_status: 'DELIVERED',
    enterprise_record: 'docs/evidence/SUPABASE-DATA-API-GRANT-CHANGE-AUDIT-2026-10-27.md',
  },
  'GH-79': {
    created: '2026-10-12',
    source_channel: 'Existing relationship',
    source_asset: 'GitHub issue #79 / khaie-os.pages.dev',
    customer_type: 'Transport operator',
    geography: 'Botswana',
    category: 'Digital',
    problem: 'Transit operator needs shift close-out, ticketing and tenant-isolated Supabase operations.',
    requirement: 'Confirm source repository, verify grants/RLS and complete operator discovery before pilot.',
    capability_route: 'Digital systems & product delivery',
    enterprise_destination: 'Khaie OS (repo unconfirmed)',
    ownership_status: 'UNKNOWN',
    commercial_mode: 'Pilot validation',
    evidence_level: 'E1 - Designed prototype',
    provider_supplier: 'Supabase / Cloudflare',
    economics_status: 'Not started',
    compliance_status: 'Review required (grants/RLS & passenger data)',
    customer_commitment: 'None',
    pipeline_status: 'REQUIREMENT-VERIFIED',
    enterprise_record: 'issue #79',
  },
  'GH-125': {
    created: '2026-10-18',
    source_channel: 'Website',
    source_asset: 'faroukpandor.github.io / Free-first income plan',
    customer_type: 'Botswana SMEs',
    geography: 'Botswana',
    category: 'Digital',
    problem: 'Local SME websites lose enquiries through broken links, unclear offers and poor mobile UX.',
    requirement: 'Deliver bounded Website Health Check leading into optional Monthly Care Plan + free self-check tool.',
    capability_route: 'Digital systems & website QA',
    enterprise_destination: 'MOKORO / faroukpandor.github.io',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Fixed-scope service -> retainer',
    evidence_level: 'E2 - Checklist & self-check tool implemented',
    provider_supplier: 'Internal free stack',
    economics_status: 'Estimated (unvalidated hypothesis)',
    compliance_status: 'Review required (Tier 2 commercial terms)',
    customer_commitment: 'None',
    pipeline_status: 'PROBLEM-VERIFIED',
    enterprise_record: 'docs/FREE-FIRST-RECURRING-INCOME-PLAN-2026-10-27.md',
  },
  'GH-69': {
    created: '2026-10-04',
    source_channel: 'Institutional signal',
    source_asset: '.github/workflows/market-signal-monitor.yml',
    customer_type: 'Internal pipeline',
    geography: 'Botswana',
    category: 'Research',
    problem: 'One of three official Botswana opportunity feeds failed silently due to bare gov.bw SSL mismatch.',
    requirement: 'Use canonical www.gov.bw host and verify manual workflow_dispatch run.',
    capability_route: 'Market intelligence automation',
    enterprise_destination: 'Research & Intelligence',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Internal intelligence flywheel',
    evidence_level: 'E2 - Workflow fix merged; verification pending',
    provider_supplier: 'gov.bw / bitc.co.bw / npc.gov.bw',
    economics_status: 'Zero-cost CI',
    compliance_status: 'Verified (public official feeds)',
    customer_commitment: 'None',
    pipeline_status: 'SIGNAL',
    enterprise_record: '.github/workflows/market-signal-monitor.yml',
  },
  'GH-67': {
    created: '2026-10-04',
    source_channel: 'WhatsApp',
    source_asset: 'WhatsApp Business -> index.html#enquire',
    customer_type: 'Prospective clients',
    geography: 'Botswana',
    category: 'Commercial',
    problem: 'Inbound enquiries lack measurable source attribution and structured consent-aware capture.',
    requirement: 'Verify live intake handoff, consent fields and private manual tracker before building backend CRM.',
    capability_route: 'Client acquisition & routing',
    enterprise_destination: 'MOKORO / faroukpandor.github.io',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Acquisition infrastructure',
    evidence_level: 'E2 - Consent-aware static intake implemented',
    provider_supplier: 'GitHub Pages / manual tracker',
    economics_status: 'Zero-cost manual first',
    compliance_status: 'Review required (privacy & consent wording)',
    customer_commitment: 'None',
    pipeline_status: 'PROBLEM-VERIFIED',
    enterprise_record: 'issue #67',
  },
  'GH-148': {
    created: '2026-10-31',
    source_channel: 'Other',
    source_asset: 'GitHub issue #148',
    customer_type: 'Public visitors & buyers',
    geography: 'Botswana / Global',
    category: 'Digital',
    problem: 'Public portfolio needed verified destination routing, ownership separation and disclosure parity.',
    requirement: 'Maintain verified catalogue, UI/a11y parity, disclosures and private-token audit follow-up.',
    capability_route: 'Portfolio governance & presentation',
    enterprise_destination: 'faroukpandor.github.io',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Trust & routing hub',
    evidence_level: 'E3 - Tested static guards & catalogue',
    provider_supplier: 'GitHub Pages / Cloudflare / Vercel',
    economics_status: 'Zero-cost static',
    compliance_status: 'Verified public boundaries',
    customer_commitment: 'None',
    pipeline_status: 'REQUIREMENT-VERIFIED',
    enterprise_record: 'docs/OWNERSHIP-STATUS-REGISTER.md',
  },
  'GH-130': {
    created: '2026-10-18',
    source_channel: 'Research',
    source_asset: 'Self-Reliance validation sprint docs',
    customer_type: 'Southern African households',
    geography: 'Botswana / Southern Africa',
    category: 'Research',
    problem: 'Hypothesis on practical household growing/stock readiness tools lacks interview validation.',
    requirement: 'Complete 7-day validation interviews or record an explicit continue/revise/stop decision.',
    capability_route: 'Research & product validation',
    enterprise_destination: 'Research & Intelligence',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Free guide + gated MVP',
    evidence_level: 'E0 - Proposed hypothesis',
    provider_supplier: 'Internal',
    economics_status: 'Not started',
    compliance_status: 'Not started',
    customer_commitment: 'None',
    pipeline_status: 'SIGNAL',
    enterprise_record: 'docs/SELF-RELIANCE-MVP-DECISION-SPEC.md',
  },
  'AGRISOLUTIONS-8': {
    created: '2026-10-14',
    source_channel: 'Existing relationship',
    source_asset: 'AGRISOLUTIONS issue #8',
    customer_type: 'Poultry buyer / integrator',
    geography: 'Botswana',
    category: 'Agriculture',
    problem: 'Potential agricultural/poultry buyer brief awaiting confirmed specification and farm profile.',
    requirement: 'Follow up once cleanly and log verified requirement and capacity.',
    capability_route: 'Agricultural sourcing & production',
    enterprise_destination: 'AgriSolutions / AgriSage360',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Commercial supply / brokerage',
    evidence_level: 'E0 - Signal awaiting customer reply',
    provider_supplier: 'Local producers (unverified)',
    economics_status: 'Not started',
    compliance_status: 'Not started',
    customer_commitment: 'Enquiry',
    pipeline_status: 'SIGNAL',
    enterprise_record: 'AGRISOLUTIONS#8',
  },
  'WCD-4': {
    created: '2026-10-20',
    source_channel: 'Existing relationship',
    source_asset: 'WCD issue #4',
    customer_type: 'Retail employer',
    geography: 'Botswana',
    category: 'Commercial',
    problem: 'Retail profitability baseline requires authorised POS/COGS/VAT analysis.',
    requirement: 'Confirm written employer scope/authorisation before inspecting or proposing changes.',
    capability_route: 'Operations & financial baseline',
    enterprise_destination: 'Employer / client segregated track',
    ownership_status: 'EMPLOYER-OWNED',
    commercial_mode: 'Employer operations',
    evidence_level: 'E0 - Gated on written authorisation',
    provider_supplier: 'Employer internal systems',
    economics_status: 'Not started',
    compliance_status: 'Review required (employer authorisation)',
    customer_commitment: 'None',
    pipeline_status: 'HOLD',
    enterprise_record: 'WCD#4',
  },
  'GH-132': {
    created: '2026-10-19',
    source_channel: 'Research',
    source_asset: 'GitHub issue #132',
    customer_type: 'Agricultural buyers & growers',
    geography: 'Botswana',
    category: 'Agriculture',
    problem: 'Buyer-producer matching platform should not be built ahead of confirmed buyer demand.',
    requirement: 'Obtain one verified written buyer brief before recruiting growers or building software.',
    capability_route: 'Buyer-producer orchestration',
    enterprise_destination: 'AgriSage360',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Market coordination',
    evidence_level: 'E1 - Designed architecture only',
    provider_supplier: 'Pending buyer brief',
    economics_status: 'Not started',
    compliance_status: 'Not started',
    customer_commitment: 'None',
    pipeline_status: 'HOLD',
    enterprise_record: 'docs/BUYER-PRODUCER-DISCOVERY-MATCHING-ORCHESTRATION-PLATFORM.md',
  },
  'BACKLOG-001': {
    created: '2026-10-27',
    source_channel: 'Other',
    source_asset: 'GitHub issue tracker audit',
    customer_type: 'Internal portfolio ops',
    geography: 'Portfolio-wide',
    category: 'Other',
    problem: '56 open issues compete for attention against P0 commercial execution.',
    requirement: 'Consolidate into <=10 canonical opportunities and record HOLD/ARCHIVE reasons.',
    capability_route: 'Portfolio operations',
    enterprise_destination: 'faroukpandor.github.io',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Internal operating discipline',
    evidence_level: 'E2 - Queue & dashboard tooling implemented',
    provider_supplier: 'Internal',
    economics_status: 'Not applicable',
    compliance_status: 'Verified',
    customer_commitment: 'None',
    pipeline_status: 'REQUIREMENT-VERIFIED',
    enterprise_record: 'docs/OPERATIONAL-NEXT-ACTION-CONTRACT.md',
  },
  'GH-131': {
    created: '2026-10-19',
    source_channel: 'Research',
    source_asset: 'GitHub issue #131',
    customer_type: 'Growers & buyers',
    geography: 'Botswana',
    category: 'Agriculture',
    problem: 'Localised organic assurance requires regulatory clarification before any pilot.',
    requirement: 'Obtain written clarification from Botswana standards authority.',
    capability_route: 'Standards research & coordination',
    enterprise_destination: 'AgriSage360 / Specialist network',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Gated pilot',
    evidence_level: 'E0 - Desk research only',
    provider_supplier: 'Standards authority (uncontacted)',
    economics_status: 'Not started',
    compliance_status: 'Blocked (standards Gate 1)',
    customer_commitment: 'None',
    pipeline_status: 'HOLD',
    enterprise_record: 'docs/BOTSWANA-BUYER-LED-GROWER-AGGREGATION-ORGANIC-ASSURANCE-BRIEF-2026-10-19.md',
  },
  'GH-70': {
    created: '2026-10-12',
    source_channel: 'Other',
    source_asset: 'GitHub issue #70',
    customer_type: 'Internal treasury',
    geography: 'Botswana',
    category: 'Commercial',
    problem: 'Cross-border payment rail eligibility and fee schedule unverified for Botswana.',
    requirement: 'Owner-only verification from official/account documentation before any integration.',
    capability_route: 'Payment-rail assessment',
    enterprise_destination: 'Farouk Pandor Consultant',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Treasury infrastructure',
    evidence_level: 'E0 - Unverified',
    provider_supplier: 'Jeton',
    economics_status: 'Not started',
    compliance_status: 'Review required (owner-only)',
    customer_commitment: 'None',
    pipeline_status: 'HOLD',
    enterprise_record: 'issue #70',
  },
  'GH-68': {
    created: '2026-10-04',
    source_channel: 'Website',
    source_asset: 'GitHub issue #68',
    customer_type: 'Prospective clients',
    geography: 'Botswana',
    category: 'Digital',
    problem: 'AI lead routing should not precede proven manual funnel evidence.',
    requirement: 'Draft paper rubric and keep automated routing paused until #67 generates repeatable volume.',
    capability_route: 'AI qualification & routing',
    enterprise_destination: 'MOKORO',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Operational automation',
    evidence_level: 'E1 - Routing taxonomy designed',
    provider_supplier: 'Internal',
    economics_status: 'Not started',
    compliance_status: 'Review required (human oversight)',
    customer_commitment: 'None',
    pipeline_status: 'HOLD',
    enterprise_record: 'docs/DEMAND-ROUTING-TAXONOMY.md',
  },
  'GH-115': {
    created: '2026-10-15',
    source_channel: 'Other',
    source_asset: 'GitHub issue #115',
    customer_type: 'Internal portfolio ops',
    geography: 'Portfolio-wide',
    category: 'Digital',
    problem: 'Multiple repositories across portfolio require Stage 0 code/deployment/duplicate review.',
    requirement: 'Produce dated reuse / upgrade / new-repo / authorisation matrix with private-repo access.',
    capability_route: 'Repository governance',
    enterprise_destination: 'MOKORO-ENTERPRISE-OS / faroukpandor.github.io',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Internal portfolio governance',
    evidence_level: 'E2 - Public inventory & Vercel linkage verified',
    provider_supplier: 'GitHub / Vercel',
    economics_status: 'Not applicable',
    compliance_status: 'Review required (client boundaries)',
    customer_commitment: 'None',
    pipeline_status: 'REQUIREMENT-VERIFIED',
    enterprise_record: 'docs/ULTIMATE-IDEAL-COMPETITOR-APPS.md',
  },
  'ANALYTICS-001': {
    created: '2026-10-21',
    source_channel: 'Website',
    source_asset: 'docs/ANALYTICS-REFERLY-INTEGRATION.md',
    customer_type: 'Website visitors',
    geography: 'Global',
    category: 'Digital',
    problem: 'No privacy-reviewed analytics measurement exists on public portfolio pages yet.',
    requirement: 'Owner supplies Measurement ID and approves consent wording before inserting any tag.',
    capability_route: 'Web analytics',
    enterprise_destination: 'faroukpandor.github.io',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Acquisition measurement',
    evidence_level: 'E1 - Setup checklist ready',
    provider_supplier: 'GA4 / Referly',
    economics_status: 'Free tier',
    compliance_status: 'Review required (consent notice)',
    customer_commitment: 'None',
    pipeline_status: 'HOLD',
    enterprise_record: 'docs/ANALYTICS-REFERLY-INTEGRATION.md',
  },
  'PERS-001': {
    created: '2026-10-27',
    source_channel: 'Institutional signal',
    source_asset: 'documents/personal/beekeeping-circular-3-of-2026-page-1.jpeg',
    customer_type: 'Public sector vacancy',
    geography: 'Botswana',
    category: 'Other',
    problem: 'Public vacancy circular contains conflicting closing date (3 Oct vs 21 Oct 2026 issue date).',
    requirement: 'Call listed Administration Officer directly to confirm status and qualification fit.',
    capability_route: 'Personal career admin',
    enterprise_destination: 'Personal (non-enterprise)',
    ownership_status: 'FAROUK-OWNED',
    commercial_mode: 'Salaried employment notice',
    evidence_level: 'E2 - Source circular archived',
    provider_supplier: 'Public government circular',
    economics_status: 'Published scale notice',
    compliance_status: 'Keep personal CV/ID private',
    customer_commitment: 'None',
    pipeline_status: 'SIGNAL',
    enterprise_record: 'documents/personal/README.md',
  },
};

function escHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function badgeClass(value) {
  const key = String(value ?? '').toLowerCase();
  if (['today', 'overdue', 'error', 'data-quality'].includes(key)) return 'badge-today';
  if (['due', 'stale', 'pending-evidence', 'unknown'].includes(key)) return 'badge-due';
  if (['waiting', 'blocked', 'client-employer'].includes(key)) return 'badge-waiting';
  if (['hold', 'declared-private-unverified', 'private', 'upstream-fork', 'archived'].includes(key)) return 'badge-hold';
  return 'badge-ok';
}

function buildState() {
  const queue = JSON.parse(readFileSync(QUEUE_JSON_PATH, 'utf8'));
  const inventory = JSON.parse(readFileSync(INVENTORY_JSON_PATH, 'utf8'));
  const publicProjects = JSON.parse(readFileSync(PUBLIC_PROJECTS_PATH, 'utf8'));
  const signalDigest = JSON.parse(readFileSync(SIGNAL_DIGEST_PATH, 'utf8'));
  const kpiCsvRows = parseCsv(readFileSync(KPI_CATALOG_PATH, 'utf8'));
  const referenceDate = queue.generated_utc.slice(0, 10);

  const signalFiles = signalDigest.sources;

  const actionsWithAgeing = queue.actions.map((item) => ({
    ...item,
    ageing: computeAgeing(item, referenceDate),
  }));

  const registerRecords = actionsWithAgeing.map((item) => {
    const meta = REGISTER_METADATA[item.opportunity_id];
    assert.ok(meta, `Missing REGISTER_METADATA mapping for ${item.opportunity_id}`);
    return {
      opportunity_id: item.opportunity_id,
      created: meta.created,
      source_channel: meta.source_channel,
      source_asset: meta.source_asset,
      opportunity_title: item.title,
      customer_id: 'REDACTED-PUBLIC',
      customer_type: meta.customer_type,
      geography: meta.geography,
      category: meta.category,
      problem: meta.problem,
      requirement: meta.requirement,
      capability_route: meta.capability_route,
      enterprise_destination: meta.enterprise_destination,
      ownership_status: meta.ownership_status,
      commercial_mode: meta.commercial_mode,
      evidence_level: meta.evidence_level,
      provider_supplier: meta.provider_supplier,
      economics_status: meta.economics_status,
      compliance_status: meta.compliance_status,
      customer_commitment: meta.customer_commitment,
      status: meta.pipeline_status,
      next_action: item.next_action,
      owner: item.owner,
      exposure: item.commercial_exposure,
      last_verified: item.last_verified,
      review_due: item.review_date,
      outcome: meta.pipeline_status === 'DELIVERED' ? 'Static repo audit completed (N/A)' : 'Pending',
      learning: item.priority_basis,
      enterprise_record: meta.enterprise_record,
    };
  });

  const countBy = (arr, keyFn) => {
    const map = {};
    for (const x of arr) {
      const k = keyFn(x);
      map[k] = (map[k] ?? 0) + 1;
    }
    return map;
  };

  const activeRecords = registerRecords.filter((r) => !['DELIVERED', 'HOLD', 'ARCHIVED'].includes(r.status));
  const staleOrOverdue = actionsWithAgeing.filter((a) => ['OVERDUE', 'STALE', 'DATA-QUALITY'].includes(a.ageing));
  const customerValidatedCount = registerRecords.filter((r) =>
    ['CUSTOMER-VERIFIED', 'QUOTED', 'CUSTOMER-COMMITTED', 'PAID/PILOT', 'DELIVERED', 'REPEATABLE', 'RECURRING'].includes(r.status),
  ).length;
  const paidCount = registerRecords.filter((r) => ['PAID/PILOT', 'REPEATABLE', 'RECURRING'].includes(r.status)).length;
  const qualifiedCount = registerRecords.filter((r) =>
    ['PROBLEM-VERIFIED', 'CUSTOMER-VERIFIED', 'REQUIREMENT-VERIFIED', 'QUOTED', 'CUSTOMER-COMMITTED', 'PAID/PILOT', 'DELIVERED'].includes(r.status),
  ).length;

  const kpiCatalog = kpiCsvRows.slice(1).map((cols) => ({
    metric_id: cols[0],
    metric_name: cols[1],
    definition: cols[2],
    privacy_class: cols[8],
    decision_use: cols[9],
  }));

  const kpiValues = {
    'KPI-001': { value: String(activeRecords.length), note: `${registerRecords.length} indexed total; ${registerRecords.length - activeRecords.length} HOLD/DELIVERED` },
    'KPI-002': { value: String(customerValidatedCount), note: 'Honest baseline — no customer-validated commercial sale recorded yet' },
    'KPI-003': { value: `${paidCount} / ${qualifiedCount}`, note: '0% paid conversion across currently qualified internal/pilot records' },
    'KPI-004': { value: '0 / 0', note: 'No completed commercial transactions yet' },
    'KPI-005': { value: 'Private', note: 'Restricted metric — working-capital amounts stay outside this public repo' },
    'KPI-006': {
      value: `${staleOrOverdue.length} / ${actionsWithAgeing.length}`,
      note: `${Math.round((staleOrOverdue.length / Math.max(1, actionsWithAgeing.length)) * 100)}% past due or review date vs ${referenceDate}`,
    },
  };

  const summary = {
    schema_version: 1,
    generated_on: referenceDate,
    generated_utc: queue.generated_utc,
    privacy_boundary:
      'Public aggregate index only. Customer identities, supplier pricing, quotes, payments and private working-capital figures are excluded per docs/PORTFOLIO-DASHBOARD-SPECIFICATION.md Section 12.',
    kpis: kpiCatalog.map((k) => ({ ...k, ...(kpiValues[k.metric_id] ?? { value: 'n/a', note: '' }) })),
    counts: {
      indexed_opportunities: registerRecords.length,
      active_opportunities: activeRecords.length,
      by_action_state: countBy(actionsWithAgeing, (a) => a.state),
      by_ageing: countBy(actionsWithAgeing, (a) => a.ageing),
      by_pipeline_status: countBy(registerRecords, (r) => r.status),
      by_source_channel: countBy(registerRecords, (r) => r.source_channel),
      by_enterprise_destination: countBy(registerRecords, (r) => r.enterprise_destination),
      by_ownership_status: countBy(registerRecords, (r) => r.ownership_status),
    },
    repositories: {
      generated_on: inventory.generated_on,
      counts: inventory.counts,
      duplicate_families: inventory.duplicate_families,
    },
    public_destinations: publicProjects.entries,
    market_signals: signalFiles,
  };

  return { queue, actionsWithAgeing, registerRecords, summary, inventory, publicProjects, signalFiles };
}

function renderDashboardHtml(state) {
  const { actionsWithAgeing, registerRecords, summary, inventory, publicProjects, signalFiles } = state;
  const errorSignals = signalFiles.filter((s) => s.status !== 'FETCHED');
  const pipelineOrder = [
    'SIGNAL',
    'PROBLEM-VERIFIED',
    'CUSTOMER-VERIFIED',
    'REQUIREMENT-VERIFIED',
    'SUPPLIER/PROVIDER-VERIFIED',
    'QUOTED',
    'CUSTOMER-COMMITTED',
    'PAID/PILOT',
    'DELIVERED',
    'REPEATABLE',
    'HOLD',
  ];

  const kpiCards = summary.kpis
    .map(
      (k) =>
        `<article class="kpi-card"><span class="kpi-id">${escHtml(k.metric_id)} · ${escHtml(k.privacy_class.toUpperCase())}</span><strong>${escHtml(k.value)}</strong><h3>${escHtml(k.metric_name)}</h3><p>${escHtml(k.note)}</p></article>`,
    )
    .join('\n');

  const funnelStages = pipelineOrder
    .map(
      (stage) =>
        `<div class="funnel-stage"><span>${escHtml(stage)}</span>${summary.counts.by_pipeline_status[stage] ?? 0}</div>`,
    )
    .join('\n');

  const queueRows = actionsWithAgeing
    .map((item) => {
      const reg = registerRecords.find((r) => r.opportunity_id === item.opportunity_id);
      return `<tr data-state="${escHtml(item.state)}" data-ageing="${escHtml(item.ageing)}" data-route="${escHtml(reg.enterprise_destination)}" data-owner-class="${escHtml(reg.ownership_status)}">
<td><strong>${escHtml(item.opportunity_id)}</strong><small>${escHtml(reg.ownership_status)}</small></td>
<td><strong>${escHtml(item.title)}</strong><small>${escHtml(reg.source_channel)} · ${escHtml(reg.enterprise_destination)}</small></td>
<td><span class="badge ${badgeClass(item.state)}">${escHtml(item.state)}</span> <span class="badge ${badgeClass(item.ageing)}">${escHtml(item.ageing)}</span></td>
<td>${escHtml(item.next_action)}<small>Blocker: ${escHtml(item.blocker)}</small></td>
<td>${escHtml(item.due_date)}<small>Verified ${escHtml(item.last_verified)}</small></td>
</tr>`;
    })
    .join('\n');

  const routeRows = Object.entries(summary.counts.by_enterprise_destination)
    .sort((a, b) => b[1] - a[1])
    .map(([route, count]) => `<tr><td>${escHtml(route)}</td><td>${count}</td></tr>`)
    .join('\n');

  const sourceRows = Object.entries(summary.counts.by_source_channel)
    .sort((a, b) => b[1] - a[1])
    .map(([src, count]) => `<tr><td>${escHtml(src)}</td><td>${count}</td></tr>`)
    .join('\n');

  const classRows = Object.entries(inventory.counts.by_classification)
    .map(([cls, count]) => `<tr><td><code>${escHtml(cls)}</code></td><td>${count}</td></tr>`)
    .join('\n');

  const publicRepoRows = inventory.repositories
    .filter((r) => r.visibility === 'public-verified')
    .map(
      (r) =>
        `<tr><td><code>${escHtml(r.name)}</code></td><td><span class="badge ${badgeClass(r.classification)}">${escHtml(r.classification)}</span></td><td>${r.fork ? 'Fork' : 'Non-fork'}</td><td>${escHtml(r.license ?? '—')}</td><td>${escHtml((r.pushed_at ?? '').slice(0, 10) || '—')}</td></tr>`,
    )
    .join('\n');

  const dupRows = inventory.duplicate_families
    .map(
      (d) =>
        `<tr><td><strong>${escHtml(d.family)}</strong></td><td>${escHtml(d.members.join(', '))}</td><td><span class="badge ${badgeClass(d.canonical)}">${escHtml(d.canonical)}</span></td><td>${escHtml(d.note)}</td></tr>`,
    )
    .join('\n');

  const signalRows = signalFiles
    .map(
      (s) =>
        `<tr><td><strong>${escHtml(s.id)}</strong><small>${escHtml(s.source)}</small></td><td><span class="badge ${badgeClass(s.classification || s.status)}">${escHtml(s.classification || s.status)}</span></td><td>${escHtml((s.timestamp_utc ?? 'n/a').slice(0, 19))}<small>Age: ${s.age_days ?? '—'}d</small></td><td>${escHtml(s.error ? s.error : (s.sample_headings?.length ? s.sample_headings.slice(0, 3).join(' · ') : (s.page_title || 'Snapshot SHA verified')))}</td></tr>`,
    )
    .join('\n');

  const destRows = publicProjects.entries
    .map(
      (e) =>
        `<tr><td><strong>${escHtml(e.label)}</strong></td><td><a href="${escHtml(e.public_url)}" target="_blank" rel="noopener noreferrer">${escHtml(e.public_url)} ↗</a></td><td><span class="badge badge-ok">${escHtml(e.deployment_status)}</span></td><td>ERP ready: ${e.customer_erp_ready ? 'Yes' : 'No'} · Identity ready: ${e.identity_ready ? 'Yes' : 'No'}</td></tr>`,
    )
    .join('\n');

  const alertHtml = errorSignals.length
    ? `<div class="alert-banner" role="alert"><strong>Safe-failure notice:</strong> ${errorSignals.length} of ${signalFiles.length} official market-signal source(s) currently report <code>ERROR</code> (<code>${escHtml(errorSignals.map((e) => e.id).join(', '))}</code>) and ${inventory.counts.declared_private_unverified} private repositories remain <code>registry-declared-unverified</code> (HTTP 403 to public token). No unverified metadata is inferred.</div>`
    : `<div class="alert-banner"><strong>Safe-failure boundary:</strong> ${inventory.counts.declared_private_unverified} private repositories remain <code>registry-declared-unverified</code> until inspected with private repository access.</div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Stage 1 static portfolio control dashboard and read-only verified repository catalogue for Farouk Pandor, generated from CSV/JSON governance records.">
<meta name="author" content="Farouk Pandor">
<meta name="robots" content="index,follow">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' mailto:">
<meta name="theme-color" content="#f7f6f2">
<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%3E%3Crect%20width='64'%20height='64'%20rx='10'%20fill='%23263b31'/%3E%3Ctext%20x='32'%20y='45'%20font-family='Georgia,serif'%20font-size='32'%20fill='%23e9dfcc'%20text-anchor='middle'%3EFP%3C/text%3E%3C/svg%3E">
<link rel="canonical" href="https://faroukpandor.github.io/portfolio-control.html">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Farouk Pandor">
<meta property="og:title" content="Portfolio Control Dashboard &amp; Read-Only Catalogue — Farouk Pandor">
<meta property="og:description" content="Static Stage 1 portfolio dashboard, one-next-action queue, ageing view, market signal health and read-only repository catalogue.">
<meta property="og:url" content="https://faroukpandor.github.io/portfolio-control.html">
<meta property="og:image" content="https://faroukpandor.github.io/assets/img/og-cover.jpg">
<meta property="og:image:alt" content="Forest-green circle with gold orbit rings on a warm paper background">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://faroukpandor.github.io/assets/img/og-cover.jpg">
<title>Portfolio Control Dashboard — Farouk Pandor</title>
<link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="./" aria-label="Farouk Pandor home"><span class="brand-mark">FP</span><span>FAROUK PANDOR</span></a>
    <nav aria-label="Main navigation">
      <a href="./">Home</a>
      <a href="portfolio.html">Portfolio</a>
      <a href="portfolio-map.html">Portfolio Map</a>
      <a href="professional-record.html">Professional Record</a>
      <a href="website-health-check.html">Health Check</a>
      <a class="nav-cta" href="./#enquire">Enquire <span aria-hidden="true">↗</span></a>
    </nav>
  </div>
</header>
<main id="main">
  <section class="hero compact wrap">
    <div class="eyebrow">STAGE 1 STATIC CONTROL TOWER · GENERATED ${escHtml(summary.generated_on)}</div>
    <h1>Portfolio control &amp; verified catalogue.</h1>
    <p class="lead">Generated deterministically from non-sensitive CSV/JSON governance data (<code>scripts/portfolio-ops.mjs</code> and <code>scripts/repository-inventory.mjs</code>). Private customer records, supplier prices and working-capital amounts stay outside this public repository.</p>
    ${alertHtml}
    <div class="action-row no-print">
      <a class="button primary small" href="sourcing-economics.html">Open Sourcing &amp; Demand Router</a>
      <a class="button secondary small" href="data/portfolio-opportunity-register.json" download>Download Register JSON</a>
      <a class="button secondary small" href="data/portfolio-opportunity-register.csv" download>Download Register CSV</a>
      <a class="button secondary small" href="data/next-actions/NEXT-ACTION-QUEUE.csv" download>Download Action Queue CSV</a>
      <a class="button secondary small" href="data/repository-inventory.json" download>Download Repo Inventory JSON</a>
    </div>
  </section>

  <section class="section wrap" id="kpis">
    <div class="kicker">01 — PORTFOLIO KPI CATALOGUE</div>
    <h2>Minimum viable decision metrics.</h2>
    <div class="kpi-grid">
      ${kpiCards}
    </div>
    <div class="funnel-strip" aria-label="Pipeline stage distribution">
      ${funnelStages}
    </div>
  </section>

  <section class="section pale" id="action-queue">
    <div class="wrap">
      <div class="kicker">02 — ONE-NEXT-ACTION &amp; AGEING QUEUE</div>
      <h2>Every active opportunity has one explicit next action.</h2>
      <p>Reference date: <strong>${escHtml(summary.generated_on)}</strong>. Ageing follows <code>CURRENT → DUE → STALE → OVERDUE</code> without arbitrary priority scores.</p>
      <div class="filter-bar no-print">
        <label>State <select id="filter-state"><option value="">All</option><option value="TODAY">TODAY</option><option value="DUE">DUE</option><option value="WAITING">WAITING</option><option value="STALE">STALE</option><option value="HOLD">HOLD</option></select></label>
        <label>Ageing <select id="filter-ageing"><option value="">All</option><option value="OVERDUE">OVERDUE</option><option value="STALE">STALE</option><option value="DUE">DUE</option><option value="CURRENT">CURRENT</option><option value="HOLD">HOLD</option></select></label>
        <label>Search <input id="filter-search" type="search" placeholder="ID, title, route…"></label>
      </div>
      <div class="table-wrap">
        <table class="data-table" id="queue-table">
          <thead><tr><th>ID / Ownership</th><th>Opportunity &amp; Route</th><th>State / Ageing</th><th>Single Next Action</th><th>Due / Verified</th></tr></thead>
          <tbody>${queueRows}</tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section wrap" id="routing-sources">
    <div class="kicker">03 — ENTERPRISE ROUTES &amp; SOURCE CHANNELS</div>
    <h2>Where indexed opportunities sit.</h2>
    <div class="cards">
      <article>
        <h3>By enterprise destination</h3>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Destination</th><th>Count</th></tr></thead><tbody>${routeRows}</tbody></table></div>
      </article>
      <article>
        <h3>By acquisition source</h3>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Channel</th><th>Count</th></tr></thead><tbody>${sourceRows}</tbody></table></div>
      </article>
      <article>
        <h3>Verified public destinations</h3>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Project</th><th>Destination</th><th>Status</th><th>Boundary</th></tr></thead><tbody>${destRows}</tbody></table></div>
      </article>
    </div>
  </section>

  <section class="section pale" id="repository-catalogue">
    <div class="wrap">
      <div class="kicker">04 — READ-ONLY REPOSITORY CATALOGUE (FRESHNESS ${escHtml(inventory.generated_on)})</div>
      <h2>${inventory.counts.total} repositories catalogued safely.</h2>
      <p>${inventory.counts.public_verified} public repositories verified via GitHub API; ${inventory.counts.declared_private_unverified} private repositories retained conservatively as <code>registry-declared-unverified</code>. Private GitHub repository links are intentionally omitted from public pages.</p>
      <div class="cards">
        <article>
          <h3>Classification counts</h3>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>Class</th><th>Count</th></tr></thead><tbody>${classRows}</tbody></table></div>
        </article>
        <article>
          <h3>Duplicate families (no premature merge)</h3>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>Family</th><th>Members</th><th>Canonical</th><th>Rule</th></tr></thead><tbody>${dupRows}</tbody></table></div>
        </article>
      </div>
      <details class="optional-details mt-22">
        <summary>Inspect all ${inventory.counts.public_verified} GitHub-verified public repositories</summary>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Repository</th><th>Classification</th><th>Fork status</th><th>Licence</th><th>Last push</th></tr></thead><tbody>${publicRepoRows}</tbody></table></div>
      </details>
    </div>
  </section>

  <section class="section wrap" id="signals">
    <div class="kicker">05 — MARKET SIGNAL MONITOR HEALTH</div>
    <h2>Official source snapshot status.</h2>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Feed &amp; Source URL</th><th>Status</th><th>Timestamp (UTC)</th><th>Observation</th></tr></thead>
        <tbody>${signalRows}</tbody>
      </table>
    </div>
  </section>

  <section class="section pale no-print" id="local-inspector">
    <div class="wrap">
      <div class="kicker">06 — OFFLINE PRIVATE REGISTER INSPECTOR</div>
      <h2>Inspect a private CSV or JSON register locally.</h2>
      <div class="local-inspector">
        <p>Load an offline <code>PORTFOLIO-OPPORTUNITY-REGISTER.json</code> or <code>.csv</code> file from your computer to inspect full private records in your browser. Files stay 100% on your device and are never uploaded.</p>
        <input id="private-register-file" type="file" accept=".json,.csv" aria-label="Load local CSV or JSON opportunity register">
        <div id="private-register-output" aria-live="polite"></div>
      </div>
    </div>
  </section>
</main>
<footer>
  <div class="wrap footer-inner">
    <a class="brand footer-brand" href="./"><span class="brand-mark">FP</span><span>FAROUK PANDOR</span></a>
    <span>Independent business support · Botswana</span>
    <div>
      <a href="professional-record.html">Professional record</a>
      <a href="portfolio.html">Portfolio</a>
      <a href="portfolio-map.html">Portfolio map</a>
      <a href="website-health-check.html">Health checklist</a>
      <a href="sourcing-economics.html">Sourcing &amp; routing</a>
      <a href="portfolio-control.html" aria-current="page">Control dashboard</a>
      <a href="privacy.html">Privacy &amp; disclosures</a>
      <a href="mailto:faroukpandor@gmail.com">Contact</a>
    </div>
  </div>
  <div class="wrap footer-note">
    <span>© Farouk Pandor</span>
    <span>Clear needs. Honest evidence. Practical action.</span>
  </div>
</footer>
<script type="module" src="assets/js/portfolio-control.mjs"></script>
</body>
</html>
`;
}

function generate() {
  const state = buildState();
  const queueCsv = toCsv(state.queue.fields, state.queue.actions);
  const registerJson = {
    schema_version: '1.0',
    register_type: 'portfolio-opportunity-index',
    generated_on: state.summary.generated_on,
    privacy_rule:
      'Public-safe portfolio index only. Private customer IDs, quotes, confidential supplier prices and payment figures are excluded.',
    records: state.registerRecords,
  };
  const registerCsv = toCsv(REGISTER_HEADERS, state.registerRecords);
  const dashboardHtml = renderDashboardHtml(state);

  writeFileSync(QUEUE_CSV_PATH, queueCsv);
  writeFileSync(REGISTER_JSON_PATH, JSON.stringify(registerJson, null, 2) + '\n');
  writeFileSync(REGISTER_CSV_PATH, registerCsv);
  writeFileSync(SUMMARY_JSON_PATH, JSON.stringify(state.summary, null, 2) + '\n');
  writeFileSync(DASHBOARD_HTML_PATH, dashboardHtml);

  console.log(
    `generated Stage 1 portfolio register & control dashboard (${state.registerRecords.length} opportunities, ${state.summary.repositories.counts.total} repos, dated ${state.summary.generated_on})`,
  );
}

function verify() {
  const checks = [];
  const t = (fn) => {
    fn();
    checks.push(fn.name || 'check');
  };

  const state = buildState();

  t(function queue_contract_fields_and_states_valid() {
    assert.ok(state.queue.actions.length >= 10, 'queue must track active portfolio items');
    const seen = new Set();
    for (const item of state.queue.actions) {
      assert.ok(item.opportunity_id && !seen.has(item.opportunity_id), `duplicate or empty ID ${item.opportunity_id}`);
      seen.add(item.opportunity_id);
      assert.ok(VALID_ACTION_STATES.includes(item.state), `invalid action state ${item.state}`);
      assert.ok(item.next_action && item.next_action.trim().length > 10, `${item.opportunity_id} missing one explicit next_action`);
      assert.match(item.due_date, /^\d{4}-\d{2}-\d{2}$/, `${item.opportunity_id} invalid due_date`);
      assert.match(item.review_date, /^\d{4}-\d{2}-\d{2}$/, `${item.opportunity_id} invalid review_date`);
      assert.match(item.last_verified, /^\d{4}-\d{2}-\d{2}$/, `${item.opportunity_id} invalid last_verified`);
    }
  });

  t(function queue_csv_matches_json() {
    const expected = toCsv(state.queue.fields, state.queue.actions);
    const actual = readFileSync(QUEUE_CSV_PATH, 'utf8');
    assert.equal(actual, expected, 'NEXT-ACTION-QUEUE.csv out of sync with NEXT-ACTION-QUEUE.json');
  });

  t(function template_files_preserve_29_column_contract() {
    const tplHeaders = parseCsv(readFileSync(TEMPLATE_REGISTER_CSV_PATH, 'utf8'))[0];
    assert.deepEqual(tplHeaders, REGISTER_HEADERS, 'template register CSV headers changed unexpectedly');
    const tplJson = JSON.parse(readFileSync(TEMPLATE_REGISTER_JSON_PATH, 'utf8'));
    assert.equal(tplJson.schema_version, '1.0');
    assert.ok(Array.isArray(tplJson.records));
    const recJson = JSON.parse(readFileSync(TEMPLATE_RECORD_JSON_PATH, 'utf8'));
    const recHeaders = parseCsv(readFileSync(TEMPLATE_RECORD_CSV_PATH, 'utf8'))[0];
    assert.deepEqual(Object.keys(recJson), recHeaders, 'OPPORTUNITY-RECORD-TEMPLATE JSON and CSV keys must match');
  });

  t(function register_json_and_csv_in_sync() {
    const regJson = JSON.parse(readFileSync(REGISTER_JSON_PATH, 'utf8'));
    assert.equal(regJson.schema_version, '1.0');
    assert.equal(regJson.records.length, state.queue.actions.length);
    const expectedCsv = toCsv(REGISTER_HEADERS, regJson.records);
    const actualCsv = readFileSync(REGISTER_CSV_PATH, 'utf8');
    assert.equal(actualCsv, expectedCsv, 'data/portfolio-opportunity-register.csv out of sync with JSON');
  });

  t(function privacy_and_secret_guard_on_register_and_queue() {
    const combined =
      readFileSync(QUEUE_JSON_PATH, 'utf8') +
      readFileSync(REGISTER_JSON_PATH, 'utf8') +
      readFileSync(DASHBOARD_HTML_PATH, 'utf8');
    const leak = hasSensitiveLeak(combined);
    assert.equal(leak.hasSecretPattern, false, 'must never embed secrets');
    assert.equal(leak.hasLocalPhoneNumber, false, 'must not publish personal phone numbers in register/queue');
  });

  t(function summary_json_in_sync() {
    const actual = JSON.parse(readFileSync(SUMMARY_JSON_PATH, 'utf8'));
    assert.deepEqual(actual, state.summary, 'data/portfolio-dashboard-summary.json drifted; rerun generate');
  });

  t(function dashboard_html_in_sync_and_safe() {
    const actualHtml = readFileSync(DASHBOARD_HTML_PATH, 'utf8');
    const expectedHtml = renderDashboardHtml(state);
    assert.equal(actualHtml, expectedHtml, 'portfolio-control.html drifted; rerun node scripts/portfolio-ops.mjs generate');
    const prohibited = [
      'github.com/faroukpandor/FAROUKPANDORCONSULTANT',
      'github.com/faroukpandor/AnimalHealth',
      'github.com/faroukpandor/EVERYTHING-CITY',
      'github.com/faroukpandor/AGRISAGE360',
      'github.com/faroukpandor/AGRISAGE',
      'github.com/faroukpandor/MOKORO-ENTERPRISE-OS',
    ];
    for (const url of prohibited) {
      assert.equal(actualHtml.includes(url), false, 'dashboard must not leak private repository URL: ' + url);
    }
  });

  console.log(checks.length + ' portfolio operations & Stage 1 dashboard checks passed (offline)');
}

const mode = process.argv[2];
if (mode === 'generate') {
  generate();
} else if (mode === 'verify') {
  verify();
} else {
  console.error('usage: node scripts/portfolio-ops.mjs <generate|verify>');
  process.exit(2);
}
