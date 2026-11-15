import { calculateLandedEconomics, formatLandedQuoteMarkdown } from './landed-economics.mjs';
import { qualifyAndRouteDemand } from './demand-router.mjs';

const $ = (id) => document.getElementById(id);

function triggerDownload(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

let lastEconomics = null;
function recalc() {
  const origin = $('le-origin').value;
  if (origin === 'LOCAL' && Number($('le-vat-pct').value) === 12) $('le-vat-pct').value = '0';
  try {
    const res = calculateLandedEconomics({
      opportunity_id: $('le-opp').value.trim(),
      product_or_service: $('le-prod').value.trim(),
      origin_scope: origin,
      quantity: $('le-qty').value,
      supplier_currency: $('le-cur').value.trim(),
      fx_rate: $('le-fx').value,
      supplier_unit_cost: $('le-unit-cost').value,
      freight: $('le-freight').value,
      insurance: $('le-insurance').value,
      customs_duty_pct: $('le-duty-pct').value,
      vat_pct: $('le-vat-pct').value,
      clearing_handling: $('le-clearing').value,
      coordination_cost: $('le-coord').value,
      proposed_customer_price: $('le-price').value,
      supplier_deposit_pct: $('le-sup-dep').value,
      customer_deposit_pct: $('le-cust-dep').value,
      evidence_refs: $('le-evid').value.trim(),
      all_material_costs_verified: $('le-verified').checked,
    });
    lastEconomics = res;
    $('out-status').textContent = res.quote_controls.status;
    $('out-warnings').textContent = res.warnings.length ? res.warnings.join(' | ') : 'Material costs backed by evidence.';
    $('out-total').textContent = `BWP ${res.totals.total_landed_cost.toFixed(2)}`;
    $('out-unit').textContent = `Unit landed cost: BWP ${res.totals.unit_landed_cost.toFixed(2)}`;
    $('out-cif').textContent = `CIF basis: BWP ${res.breakdown.cif_value.toFixed(2)} · Duty + VAT: BWP ${(res.breakdown.customs_duty + res.breakdown.vat).toFixed(2)}`;
    $('out-contrib').textContent = `BWP ${res.totals.gross_contribution.toFixed(2)}`;
    $('out-margin').textContent = `${res.totals.contribution_percentage.toFixed(2)}% on price (${res.totals.markup_on_cost_percentage.toFixed(2)}% markup on cost)`;
    $('out-wc').textContent = `Peak upfront working capital: BWP ${res.working_capital.working_capital_required.toFixed(2)} · Deferred supplier obligation: BWP ${res.working_capital.supplier_deferred_balance.toFixed(2)}`;
  } catch (err) {
    $('out-warnings').textContent = String(err.message || err);
  }
}

$('landed-form').addEventListener('input', recalc);
$('landed-form').addEventListener('change', recalc);

$('btn-load-example').addEventListener('click', () => {
  $('le-opp').value = 'OPP-2026-DEMO';
  $('le-prod').value = 'Synthetic example — 200 poultry drinkers (SACU import, 50/50 terms)';
  $('le-origin').value = 'SACU';
  $('le-qty').value = '200';
  $('le-cur').value = 'ZAR';
  $('le-fx').value = '0.76';
  $('le-unit-cost').value = '85';
  $('le-freight').value = '1400';
  $('le-insurance').value = '250';
  $('le-duty-pct').value = '0';
  $('le-vat-pct').value = '12';
  $('le-clearing').value = '950';
  $('le-coord').value = '600';
  $('le-price').value = '24000';
  $('le-sup-dep').value = '50';
  $('le-cust-dep').value = '40';
  $('le-evid').value = 'Synthetic benchmark worksheet (not a live supplier quote)';
  $('le-verified').checked = false;
  recalc();
});

$('btn-dl-quote-md').addEventListener('click', () => {
  if (!lastEconomics) return;
  triggerDownload(`${lastEconomics.opportunity_id}-landed-quote.md`, formatLandedQuoteMarkdown(lastEconomics), 'text/markdown;charset=utf-8');
});
$('btn-dl-quote-json').addEventListener('click', () => {
  if (!lastEconomics) return;
  triggerDownload(`${lastEconomics.opportunity_id}-landed-economics.json`, JSON.stringify(lastEconomics, null, 2) + '\n', 'application/json;charset=utf-8');
});

let lastRouting = null;
function reroute() {
  const res = qualifyAndRouteDemand({
    category: $('rt-cat').value,
    requirement: $('rt-req').value,
    location: $('rt-loc').value,
    timing: $('rt-time').value,
    is_client_or_employer_asset: $('rt-client').checked,
    is_regulated_specialty: $('rt-reg').checked,
  });
  lastRouting = res;
  const hp = res.handoff_package;
  const box = $('rt-output');
  box.replaceChildren();
  const h = document.createElement('h3');
  h.textContent = hp.destination_enterprise;
  const pMeta = document.createElement('p');
  pMeta.textContent = `Confidence: ${res.confidence} · Mode: ${res.commercial_mode} · Ownership: ${hp.ownership_status}`;
  const pNext = document.createElement('p');
  pNext.textContent = `Next action: ${hp.next_action}`;
  const ul = document.createElement('ul');
  for (const q of hp.compliance_questions) {
    const li = document.createElement('li');
    li.textContent = q;
    ul.appendChild(li);
  }
  box.append(h, pMeta, pNext, ul);
}

$('router-form').addEventListener('input', reroute);
$('router-form').addEventListener('change', reroute);
$('rt-file').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.requirement) $('rt-req').value = data.requirement;
    if (data.location) $('rt-loc').value = data.location;
    if (data.timing) $('rt-time').value = data.timing;
    if (data.need) {
      const r = qualifyAndRouteDemand(data);
      $('rt-cat').value = r.category;
    }
    reroute();
  } catch {}
});
$('btn-dl-handoff').addEventListener('click', () => {
  if (!lastRouting) return;
  triggerDownload(`${lastRouting.handoff_package.opportunity_id}-handoff.json`, JSON.stringify(lastRouting.handoff_package, null, 2) + '\n', 'application/json;charset=utf-8');
});

recalc();
reroute();
