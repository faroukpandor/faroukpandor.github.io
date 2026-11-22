// Pure, deterministic Botswana Landed Economics & Working-Capital Calculation Engine.
// Implements docs/BOTSWANA-LANDED-ECONOMICS-CALCULATION-SCHEMA.md &
// docs/GENERAL-DEALER-OPPORTUNITY-ORDER-FULFILMENT-SCHEMA.md (Sections 3 & 4).

export const LANDED_STATUS_VOCAB = [
  'ESTIMATE',
  'VERIFIED-COST',
  'CUSTOMER-QUOTED',
  'CUSTOMER-COMMITTED',
  'PROCUREMENT',
  'DELIVERED',
  'RECONCILED',
];

function num(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Compute full Botswana landed cost, gross contribution and working-capital obligation.
 * Never treats customer deposit as profit and never marks unverified inputs as VERIFIED-COST.
 */
export function calculateLandedEconomics(input = {}) {
  const quantity = num(input.quantity, 1);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new RangeError('quantity must be a positive number');
  }

  const fxRate = num(input.fx_rate, 1);
  if (!Number.isFinite(fxRate) || fxRate <= 0) {
    throw new RangeError('fx_rate must be a positive number');
  }

  const unitCostForeign = num(input.supplier_unit_cost, 0);
  const freightForeign = num(input.freight, 0);
  const insuranceForeign = num(input.insurance, 0);
  const packagingForeign = num(input.packaging, 0);

  // Convert supplier goods, freight, insurance and packaging into reporting currency (default BWP)
  const supplierTotalBwp = round2(unitCostForeign * quantity * fxRate);
  const freightBwp = round2(freightForeign * fxRate);
  const insuranceBwp = round2(insuranceForeign * fxRate);
  const packagingBwp = round2(packagingForeign * fxRate);
  const cifValueBwp = round2(supplierTotalBwp + freightBwp + insuranceBwp);

  // Botswana BURS rule helper:
  // - Inside SACU general rule: 0% customs duty, 12% VAT (when VAT enabled)
  // - Outside SACU general rule: applicable tariff rate + 12% VAT on customs value + duty
  // Actual HS tariff code & exemptions remain product-specific and must be verified on BURS eTariff.
  const originScope = input.origin_scope || 'SACU'; // 'LOCAL' | 'SACU' | 'NON_SACU'
  const dutyRatePct = originScope === 'NON_SACU' ? num(input.customs_duty_pct, 0) : 0;
  const vatRatePct =
    input.vat_applicable === false
      ? 0
      : num(input.vat_pct, originScope === 'LOCAL' ? 0 : 12);

  const customsDutyBwp =
    input.customs_duty_override !== undefined && input.customs_duty_override !== ''
      ? round2(num(input.customs_duty_override, 0))
      : round2(cifValueBwp * (dutyRatePct / 100));

  const exciseLeviesBwp = round2(num(input.excise_levies, 0));
  const vatBaseBwp = cifValueBwp + customsDutyBwp + exciseLeviesBwp;
  const vatBwp =
    input.vat_override !== undefined && input.vat_override !== ''
      ? round2(num(input.vat_override, 0))
      : round2(vatBaseBwp * (vatRatePct / 100));

  const clearingHandlingBwp = round2(num(input.clearing_handling, 0));
  const localTransportBwp = round2(num(input.local_transport, 0));
  const permitsCertificatesBwp = round2(num(input.permits_certificates, 0));
  const paymentTransactionCostsBwp = round2(num(input.payment_transaction_costs, 0));
  const coordinationCostBwp = round2(num(input.coordination_cost, 0));
  const contingencyAllowanceBwp = round2(num(input.contingency_allowance, 0));

  const componentValues = [
    supplierTotalBwp,
    freightBwp,
    insuranceBwp,
    packagingBwp,
    customsDutyBwp,
    exciseLeviesBwp,
    vatBwp,
    clearingHandlingBwp,
    localTransportBwp,
    permitsCertificatesBwp,
    paymentTransactionCostsBwp,
    coordinationCostBwp,
    contingencyAllowanceBwp,
  ];
  for (const val of componentValues) {
    if (!Number.isFinite(val) || val < 0) {
      throw new RangeError('Cost inputs must be finite non-negative numbers');
    }
  }

  const totalLandedCost = round2(componentValues.reduce((acc, v) => acc + v, 0));
  const unitLandedCost = round2(totalLandedCost / quantity);

  const proposedCustomerPrice = round2(num(input.proposed_customer_price, 0));
  if (!Number.isFinite(proposedCustomerPrice) || proposedCustomerPrice < 0) {
    throw new RangeError('proposed_customer_price must be a non-negative number');
  }

  const grossContribution = round2(proposedCustomerPrice - totalLandedCost);
  const contributionPct =
    proposedCustomerPrice > 0 ? round2((grossContribution / proposedCustomerPrice) * 100) : 0;
  const markupOnCostPct =
    totalLandedCost > 0 ? round2((grossContribution / totalLandedCost) * 100) : 0;

  // Working-capital & deferred obligation tracker (Section 3 deferred-arrival rule)
  const supplierDepositPct = Math.min(100, Math.max(0, num(input.supplier_deposit_pct, 100)));
  const supplierDepositAmount = round2(supplierTotalBwp * (supplierDepositPct / 100));
  const supplierDeferredBalance = round2(supplierTotalBwp - supplierDepositAmount);

  const customerDepositPct = Math.min(100, Math.max(0, num(input.customer_deposit_pct, 0)));
  const customerDepositAmount = round2(proposedCustomerPrice * (customerDepositPct / 100));
  const customerBalanceDue = round2(proposedCustomerPrice - customerDepositAmount);

  // Peak cash outlay before customer final payment: supplier deposit + upfront freight/clearance/taxes - customer deposit received
  const upfrontNonGoodsOutlay = round2(
    freightBwp +
      insuranceBwp +
      packagingBwp +
      customsDutyBwp +
      exciseLeviesBwp +
      vatBwp +
      clearingHandlingBwp +
      localTransportBwp +
      permitsCertificatesBwp +
      paymentTransactionCostsBwp +
      coordinationCostBwp,
  );
  const peakCashBeforeBalance = round2(supplierDepositAmount + upfrontNonGoodsOutlay - customerDepositAmount);
  const workingCapitalRequired = round2(Math.max(0, peakCashBeforeBalance));
  const totalCashNeededForCycle = round2(Math.max(0, totalLandedCost - customerDepositAmount));

  // Cost verification gate: any unverified material cost keeps status strictly ESTIMATE.
  const allMaterialCostsVerified = Boolean(input.all_material_costs_verified);
  const hasEvidenceRefs = Array.isArray(input.evidence_refs)
    ? input.evidence_refs.some((x) => String(x).trim())
    : Boolean(String(input.evidence_refs || '').trim());

  const computedStatus =
    allMaterialCostsVerified && hasEvidenceRefs ? 'VERIFIED-COST' : 'ESTIMATE';

  const warnings = [];
  if (computedStatus === 'ESTIMATE') {
    warnings.push('One or more material costs or evidence references remain unverified — status stays ESTIMATE.');
  }
  if (supplierDeferredBalance > 0) {
    warnings.push(
      `Deferred supplier obligation of ${supplierDeferredBalance.toFixed(2)} remains payable even after arrival.`,
    );
  }
  if (proposedCustomerPrice > 0 && grossContribution <= 0) {
    warnings.push('Proposed customer price does not cover total landed cost.');
  }
  if (originScope !== 'LOCAL' && vatRatePct === 0) {
    warnings.push('Import VAT set to 0%; confirm valid BURS exemption/rebate before quoting.');
  }

  return {
    opportunity_id: input.opportunity_id || 'OPP-UNASSIGNED',
    product_or_service: input.product_or_service || '',
    specification: input.specification || '',
    quantity,
    supplier: input.supplier || '',
    supplier_location: input.supplier_location || '',
    supplier_currency: input.supplier_currency || 'ZAR',
    reporting_currency: input.reporting_currency || 'BWP',
    fx_rate: fxRate,
    origin_scope: originScope,
    breakdown: {
      supplier_total_cost: supplierTotalBwp,
      freight: freightBwp,
      insurance: insuranceBwp,
      packaging: packagingBwp,
      cif_value: cifValueBwp,
      customs_duty: customsDutyBwp,
      excise_levies: exciseLeviesBwp,
      vat: vatBwp,
      clearing_handling: clearingHandlingBwp,
      local_transport: localTransportBwp,
      permits_certificates: permitsCertificatesBwp,
      payment_transaction_costs: paymentTransactionCostsBwp,
      coordination_cost: coordinationCostBwp,
      contingency_allowance: contingencyAllowanceBwp,
    },
    totals: {
      total_landed_cost: totalLandedCost,
      unit_landed_cost: unitLandedCost,
      proposed_customer_price: proposedCustomerPrice,
      gross_contribution: grossContribution,
      contribution_percentage: contributionPct,
      markup_on_cost_percentage: markupOnCostPct,
    },
    working_capital: {
      supplier_deposit_pct: supplierDepositPct,
      supplier_deposit_amount: supplierDepositAmount,
      supplier_deferred_balance: supplierDeferredBalance,
      customer_deposit_pct: customerDepositPct,
      customer_deposit_amount: customerDepositAmount,
      customer_balance_due: customerBalanceDue,
      working_capital_required: workingCapitalRequired,
      total_cash_before_final_settlement: totalCashNeededForCycle,
    },
    quote_controls: {
      status: computedStatus,
      lead_time: input.lead_time || 'To be confirmed with supplier',
      validity_date: input.validity_date || 'Unspecified',
      customer_payment_terms: input.customer_payment_terms || `${customerDepositPct}% deposit / balance prior to release`,
      supplier_payment_terms: input.supplier_payment_terms || `${supplierDepositPct}% deposit / ${100 - supplierDepositPct}% balance`,
      evidence_refs: input.evidence_refs || '',
      assumptions: input.assumptions || 'Subject to tariff/FX verification against supplier pro-forma invoice.',
      exclusions: input.exclusions || 'Unstated permits, storage demurrage and force majeure delays.',
    },
    warnings,
  };
}

export function formatLandedQuoteMarkdown(result) {
  const cur = result.reporting_currency;
  const b = result.breakdown;
  const t = result.totals;
  const wc = result.working_capital;
  const q = result.quote_controls;

  const lines = [
    `# Landed Economics & Quote Worksheet (${result.opportunity_id})`,
    '',
    `- **Status:** ${q.status}`,
    `- **Product / Service:** ${result.product_or_service || 'Unspecified'}`,
    `- **Specification:** ${result.specification || 'Unspecified'}`,
    `- **Quantity:** ${result.quantity}`,
    `- **Origin Scope:** ${result.origin_scope} (Supplier: ${result.supplier || 'Unspecified'}, ${result.supplier_location || 'Location pending'})`,
    `- **FX Rate:** 1 ${result.supplier_currency} = ${result.fx_rate} ${cur}`,
    '',
    '## Cost Breakdown (' + cur + ')',
    '',
    `| Component | Amount (${cur}) |`,
    '|---|---:|',
    `| Supplier goods cost | ${b.supplier_total_cost.toFixed(2)} |`,
    `| Freight | ${b.freight.toFixed(2)} |`,
    `| Insurance | ${b.insurance.toFixed(2)} |`,
    `| Packaging | ${b.packaging.toFixed(2)} |`,
    `| Customs duty | ${b.customs_duty.toFixed(2)} |`,
    `| Excise / levies | ${b.excise_levies.toFixed(2)} |`,
    `| VAT | ${b.vat.toFixed(2)} |`,
    `| Clearing & handling | ${b.clearing_handling.toFixed(2)} |`,
    `| Local transport | ${b.local_transport.toFixed(2)} |`,
    `| Permits / certificates / testing | ${b.permits_certificates.toFixed(2)} |`,
    `| Payment / transaction costs | ${b.payment_transaction_costs.toFixed(2)} |`,
    `| Coordination cost | ${b.coordination_cost.toFixed(2)} |`,
    `| Contingency allowance | ${b.contingency_allowance.toFixed(2)} |`,
    `| **Total Landed Cost** | **${t.total_landed_cost.toFixed(2)}** |`,
    `| Unit Landed Cost | ${t.unit_landed_cost.toFixed(2)} |`,
    '',
    '## Pricing & Working Capital',
    '',
    `- **Proposed Customer Price:** ${cur} ${t.proposed_customer_price.toFixed(2)}`,
    `- **Gross Contribution:** ${cur} ${t.gross_contribution.toFixed(2)} (${t.contribution_percentage.toFixed(2)}% of price / ${t.markup_on_cost_percentage.toFixed(2)}% on cost)`,
    `- **Supplier Terms:** ${q.supplier_payment_terms} (Deposit: ${cur} ${wc.supplier_deposit_amount.toFixed(2)}; Deferred Balance Obligation: ${cur} ${wc.supplier_deferred_balance.toFixed(2)})`,
    `- **Customer Terms:** ${q.customer_payment_terms} (Deposit: ${cur} ${wc.customer_deposit_amount.toFixed(2)}; Balance Due: ${cur} ${wc.customer_balance_due.toFixed(2)})`,
    `- **Peak Upfront Working Capital Required:** ${cur} ${wc.working_capital_required.toFixed(2)}`,
    '',
    '## Quote Controls & Evidence',
    '',
    `- **Lead Time:** ${q.lead_time}`,
    `- **Valid Until:** ${q.validity_date}`,
    `- **Assumptions:** ${q.assumptions}`,
    `- **Exclusions:** ${q.exclusions}`,
    `- **Evidence Refs:** ${Array.isArray(q.evidence_refs) ? q.evidence_refs.join('; ') : q.evidence_refs || 'None attached yet'}`,
  ];

  if (result.warnings.length) {
    lines.push('', '## Warnings', '');
    for (const w of result.warnings) lines.push(`- ${w}`);
  }
  return lines.join('\n') + '\n';
}
