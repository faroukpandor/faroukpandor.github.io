// Deterministic Rule-Based Demand Qualification & Enterprise Routing Engine (GH-68).
// Implements docs/DEMAND-ROUTING-TAXONOMY.md, docs/DEMAND-TO-ENTERPRISE-ROUTING-CONTRACT.md,
// and docs/PORTFOLIO-OPPORTUNITY-RECORD-SPECIFICATION.md without third-party AI APIs.

export const TAXONOMY_CATEGORIES = [
  'Buy or source something',
  'Service or specialist',
  'Business help',
  'Agricultural help',
  'Research or information',
  'Idea or opportunity',
  'Something else',
];

export const DESTINATION_DEFINITIONS = {
  GENERAL_DEALER: {
    id: 'GENERAL_DEALER',
    label: 'Farouk Pandor Consultant / General Dealer Sourcing',
    ownership_status: 'FAROUK-OWNED',
    public_url: 'https://faroukpandor.github.io/#enquire',
    default_mode: 'SOURCE-TO-ORDER',
  },
  MOKORO: {
    id: 'MOKORO',
    label: 'Mokoro — Digital Systems & Growth',
    ownership_status: 'FAROUK-OWNED',
    public_url: 'https://mokoro-dge.pages.dev/',
    default_mode: 'SERVICE',
  },
  AGRISAGE360: {
    id: 'AGRISAGE360',
    label: 'AgriSage360 — Agriculture & AgTech',
    ownership_status: 'FAROUK-OWNED',
    public_url: 'https://agrisage.pages.dev/',
    default_mode: 'SERVICE',
  },
  EVERYTHINGCITY: {
    id: 'EVERYTHINGCITY',
    label: 'EverythingCity — Discovery & Commercial Intent',
    ownership_status: 'FAROUK-OWNED',
    public_url: 'https://everythingcity.pages.dev/',
    default_mode: 'REFERRAL',
  },
  RESEARCH: {
    id: 'RESEARCH',
    label: 'Research & Market Intelligence Layer',
    ownership_status: 'FAROUK-OWNED',
    public_url: 'https://faroukpandor.github.io/portfolio-map.html',
    default_mode: 'SERVICE',
  },
  PROVIDER_NETWORK: {
    id: 'PROVIDER_NETWORK',
    label: 'Provider & Qualified Specialist Referral Network',
    ownership_status: 'THIRD-PARTY',
    public_url: null,
    default_mode: 'COORDINATED-REFERRAL',
  },
  CLIENT_BOUNDARY: {
    id: 'CLIENT_BOUNDARY',
    label: 'Segregated Client / Employer Track (Authorisation Required)',
    ownership_status: 'CLIENT-OWNED',
    public_url: null,
    default_mode: 'SERVICE',
  },
  CLARIFY: {
    id: 'CLARIFY',
    label: 'Clarification Queue (Insufficient Evidence — No Forced Routing)',
    ownership_status: 'UNKNOWN',
    public_url: null,
    default_mode: 'CLARIFY',
  },
};

function norm(s) {
  return String(s ?? '').trim().toLowerCase();
}

export function normalizeCategoryFromNeed(rawNeed) {
  const t = norm(rawNeed);
  if (!t) return 'Something else';
  if (t.includes('buy') || t.includes('source') || t.includes('product') || t.includes('equipment') || t.includes('import')) {
    return 'Buy or source something';
  }
  if (t.includes('specialist') || t.includes('service') || t.includes('trade') || t.includes('plumber') || t.includes('electric')) {
    return 'Service or specialist';
  }
  if (t.includes('business') || t.includes('workflow') || t.includes('website') || t.includes('seo') || t.includes('digital') || t.includes('process') || t.includes('tender')) {
    return 'Business help';
  }
  if (t.includes('agri') || t.includes('farm') || t.includes('poultry') || t.includes('livestock') || t.includes('crop') || t.includes('animal')) {
    return 'Agricultural help';
  }
  if (t.includes('research') || t.includes('information') || t.includes('market') || t.includes('data')) {
    return 'Research or information';
  }
  if (t.includes('idea') || t.includes('opportunity') || t.includes('partner')) {
    return 'Idea or opportunity';
  }
  return 'Something else';
}

export function buildCanonicalIds(dateIso = '2026-11-09', seq = 1) {
  const year = String(dateIso).slice(0, 4) || '2026';
  const padded = String(Math.max(1, Number(seq) || 1)).padStart(4, '0');
  return {
    opportunity_id: `OPP-${year}-${padded}`,
    customer_id: `CUS-${year}-${padded}`,
    requirement_id: `REQ-${year}-${padded}`,
    evidence_id: `EVD-${year}-${padded}`,
    quote_id: `QTE-${year}-${padded}`,
  };
}

/**
 * Qualify an enquiry and route it conservatively.
 * Enforces:
 * 1. No forced routing when requirement or location/context is insufficient -> CLARIFY
 * 2. Client/employer boundaries never absorbed into Farouk-owned assets
 * 3. Regulated/licensed work routed to qualified Provider Network with clear boundary note
 */
export function qualifyAndRouteDemand(input = {}) {
  const requirement = String(input.requirement ?? '').trim();
  const location = String(input.location ?? '').trim();
  const timing = String(input.timing ?? '').trim();
  const category = input.category && TAXONOMY_CATEGORIES.includes(input.category)
    ? input.category
    : normalizeCategoryFromNeed(input.need || requirement);

  const combinedText = norm([input.need, requirement, input.desired_outcome, input.notes].join(' '));
  const missingFields = [];
  if (requirement.length < 12) missingFields.push('specific requirement / problem description');
  if (!location) missingFields.push('location / geography');
  if (!timing) missingFields.push('timing / urgency');

  const clientBoundary = Boolean(input.is_client_or_employer_asset) || /\b(employer|client[- ]owned|white city|wcd)\b/.test(combinedText);
  const employerOwned = Boolean(input.is_employer_owned) || /\b(employer|wcd|white city discount)\b/.test(combinedText);
  const regulatedWork =
    Boolean(input.is_regulated_specialty) ||
    /\b(legal|attorney|lawyer|medical|doctor|clinical|veterinary|diagnos|prescription|structural engineer|audit sign-off|licensed)\b/.test(combinedText);

  let routeKey = 'CLARIFY';
  let commercialMode = 'CLARIFY';
  const complianceQuestions = [];
  const nextActions = [];

  if (clientBoundary) {
    routeKey = 'CLIENT_BOUNDARY';
    commercialMode = 'SERVICE';
    complianceQuestions.push('Confirm written client/employer authorisation before accessing or changing third-party assets.');
    nextActions.push('Obtain written scope and access authorisation while keeping evidence strictly segregated.');
  } else if (regulatedWork) {
    routeKey = 'PROVIDER_NETWORK';
    commercialMode = 'COORDINATED-REFERRAL';
    complianceQuestions.push('Regulated or licensed execution must be performed by an appropriately qualified provider.');
    nextActions.push('Clarify coordination-only scope and verify provider licence/registration before introduction.');
  } else if (requirement.length < 12) {
    routeKey = 'CLARIFY';
    commercialMode = 'CLARIFY';
    nextActions.push('Send short clarification message to establish exact requirement, quantity, location and timing.');
  } else if (category === 'Buy or source something') {
    routeKey = 'GENERAL_DEALER';
    commercialMode = /\b(import|china|south africa|sa\b|yiwu|cif)\b/.test(combinedText) ? 'IMPORT-TO-ORDER' : 'SOURCE-TO-ORDER';
    complianceQuestions.push('Verify product specification, customs/VAT applicability (BURS) and supplier legitimacy before quoting.');
    nextActions.push('Define exact specification, quantity and delivery location, then run Landed Economics worksheet.');
  } else if (category === 'Service or specialist') {
    if (/\b(directory|list|compare|discover|event|local business)\b/.test(combinedText)) {
      routeKey = 'EVERYTHINGCITY';
      commercialMode = 'REFERRAL';
      nextActions.push('Verify listing/discovery requirement and check EverythingCity scope fit.');
    } else {
      routeKey = 'PROVIDER_NETWORK';
      commercialMode = 'COORDINATED-REFERRAL';
      complianceQuestions.push('Obtain customer consent before sharing contact details and confirm provider verification level.');
      nextActions.push('Check category coverage and verify primary/alternate qualified provider before introduction.');
    }
  } else if (category === 'Business help') {
    if (/\b(website|seo|audit|health check|pwa|automation|workflow|whatsapp|crm|digital|app)\b/.test(combinedText)) {
      routeKey = 'MOKORO';
      commercialMode = 'SERVICE';
      complianceQuestions.push('Confirm site/system ownership or written authorisation before any inspection or change.');
      nextActions.push('Run Website Health Check or 1-workflow discovery with clear exclusions and written scope.');
    } else if (/\b(tender|procurement|supplier|sourcing|operations)\b/.test(combinedText)) {
      routeKey = 'GENERAL_DEALER';
      commercialMode = 'ORCHESTRATED-PROCUREMENT';
      complianceQuestions.push('Verify current issuing notice/requirements; never guarantee tender awards.');
      nextActions.push('Confirm buyer documents, timeline and bounded checklist scope in writing.');
    } else {
      routeKey = 'MOKORO';
      commercialMode = 'SERVICE';
      nextActions.push('Clarify whether operational workflow, website QA or procurement support is the primary bottleneck.');
    }
  } else if (category === 'Agricultural help') {
    if (/\b(organic|certif|standard)\b/.test(combinedText)) {
      complianceQuestions.push('No organic certification or legal recognition claim allowed without written standards authority confirmation.');
    }
    if (/\b(feed|chicks|inputs|buy|supply|buyer|offtake)\b/.test(combinedText) && !/\b(software|app|system|record)\b/.test(combinedText)) {
      routeKey = 'AGRISAGE360';
      commercialMode = 'BROKERED';
      nextActions.push('Capture buyer specification, volume, delivery frequency and farm capacity before matching producers.');
    } else {
      routeKey = 'AGRISAGE360';
      commercialMode = 'SERVICE';
      nextActions.push('Clarify farm enterprise type, planning constraint and current record workaround.');
    }
  } else if (category === 'Research or information') {
    routeKey = 'RESEARCH';
    commercialMode = 'SERVICE';
    complianceQuestions.push('Separate primary verified sources from unverified assumptions and desk hypotheses.');
    nextActions.push('Confirm decision question, acceptable sources and delivery format before research begins.');
  } else if (category === 'Idea or opportunity') {
    routeKey = 'RESEARCH';
    commercialMode = 'CLARIFY';
    complianceQuestions.push('Require customer discovery evidence (Gate 0) before committing software build time.');
    nextActions.push('Write problem hypothesis and identify 5–8 real prospective users for validation.');
  } else {
    routeKey = 'CLARIFY';
    commercialMode = 'CLARIFY';
    nextActions.push('Manual triage: clarify desired outcome and constraints before assigning an enterprise route.');
  }

  const dest = { ...DESTINATION_DEFINITIONS[routeKey] };
  if (employerOwned) dest.ownership_status = 'EMPLOYER-OWNED';

  const dateIso = (input.captured_utc || input.date_received || '2026-11-09').slice(0, 10);
  const ids = buildCanonicalIds(dateIso, input.sequence || 1);
  const opportunityId = input.opportunity_id || ids.opportunity_id;

  const handoffPackage = {
    opportunity_id: opportunityId,
    requirement_summary: requirement || '(Insufficient detail — needs clarification)',
    customer_reference: input.customer_id || ids.customer_id,
    location: location || 'Unspecified',
    timing: timing || 'Unspecified',
    evidence_references: input.evidence_refs || (input.source_asset ? `Intake from ${input.source_asset}` : 'Unverified inbound intake'),
    provider_or_supplier_reference: input.provider_reference || 'None assigned',
    economics_status: 'Not started',
    compliance_questions: complianceQuestions.length ? complianceQuestions : ['Confirm written scope, exclusions and consent before work starts.'],
    next_action: nextActions[0],
    destination_enterprise: dest.label,
    destination_id: dest.id,
    ownership_status: dest.ownership_status,
    commercial_mode: commercialMode,
    return_outcome_requirement: 'Log qualification outcome, evidence updates and next action in private register.',
  };

  return {
    category,
    destination: dest,
    commercial_mode: commercialMode,
    missing_fields: missingFields,
    confidence: missingFields.length === 0 && routeKey !== 'CLARIFY' ? 'QUALIFIED-FOR-TRIAGE' : 'NEEDS-CLARIFICATION',
    handoff_package: handoffPackage,
  };
}
