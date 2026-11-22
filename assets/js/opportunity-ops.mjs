// Pure, browser- and Node-compatible opportunity operations helpers.
// Implements docs/OPPORTUNITY-AGEING-AND-FOLLOW-UP-CONTRACT.md & RFC-4180 CSV portability.

export const VALID_ACTION_STATES = ['TODAY', 'DUE', 'WAITING', 'BLOCKED', 'STALE', 'HOLD', 'DONE'];

export const REGISTER_HEADERS = [
  'opportunity_id',
  'created',
  'source_channel',
  'source_asset',
  'opportunity_title',
  'customer_id',
  'customer_type',
  'geography',
  'category',
  'problem',
  'requirement',
  'capability_route',
  'enterprise_destination',
  'ownership_status',
  'commercial_mode',
  'evidence_level',
  'provider_supplier',
  'economics_status',
  'compliance_status',
  'customer_commitment',
  'status',
  'next_action',
  'owner',
  'exposure',
  'last_verified',
  'review_due',
  'outcome',
  'learning',
  'enterprise_record',
];

export const RECORD_TEMPLATE_HEADERS = [
  'opportunity_id',
  'date_received',
  'source_channel',
  'source_asset',
  'customer_id',
  'customer_type',
  'location',
  'problem',
  'requirement',
  'category',
  'urgency',
  'quantity_frequency',
  'budget_signal',
  'current_solution',
  'desired_outcome',
  'capability_route',
  'enterprise_route',
  'ownership_status',
  'commercial_mode',
  'provider_id',
  'evidence_ids',
  'quote_id',
  'cost_id',
  'compliance_id',
  'commitment',
  'status',
  'next_action',
  'owner',
  'last_verified',
  'review_due',
  'outcome_id',
  'learning',
];

export const OWNERSHIP_STATUSES = [
  'FAROUK-OWNED',
  'CLIENT-OWNED',
  'EMPLOYER-OWNED',
  'THIRD-PARTY',
  'PARTNER',
  'UNKNOWN',
];

export const COMMERCIAL_MODES = [
  'RESELL',
  'SOURCE-TO-ORDER',
  'IMPORT-TO-ORDER',
  'REFERRAL',
  'COORDINATED-REFERRAL',
  'BROKERED',
  'PARTNER-SUPPLIED',
  'CUSTOM-TO-ORDER',
  'DELIVERY-ONLY',
  'ORCHESTRATED-PROCUREMENT',
  'SERVICE',
  'CLARIFY',
];

export function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\r\n]/.test(str)) return '"' + str.replaceAll('"', '""') + '"';
  return str;
}

export function toCsv(headers, rows) {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h] ?? '')).join(','));
  }
  return lines.join('\n') + '\n';
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\r') {
      // ignore CR
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function computeAgeing(item, referenceDate) {
  if (!item || !item.next_action || !String(item.next_action).trim()) return 'DATA-QUALITY';
  if (item.state === 'DONE') return 'DONE';
  if (item.state === 'HOLD') {
    return item.review_date && item.review_date < referenceDate ? 'STALE' : 'HOLD';
  }
  if (item.due_date && item.due_date < referenceDate) return 'OVERDUE';
  if (item.state === 'STALE' || (item.review_date && item.review_date < referenceDate)) return 'STALE';
  if (item.state === 'DUE' || item.due_date === referenceDate) return 'DUE';
  return 'CURRENT';
}

export function daysBetween(isoStart, isoEnd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(isoStart || '')) || !/^\d{4}-\d{2}-\d{2}$/.test(String(isoEnd || ''))) {
    return null;
  }
  const t1 = Date.parse(isoStart + 'T00:00:00Z');
  const t2 = Date.parse(isoEnd + 'T00:00:00Z');
  return Math.round((t2 - t1) / 86400000);
}

export function hasSensitiveLeak(text) {
  const s = String(text ?? '');
  return {
    hasSecretPattern: /(ghp_|github_pat_|AKIA[0-9A-Z]{16}|BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY)/.test(s),
    hasLocalPhoneNumber: /\+267\s?\d{7,8}/.test(s),
  };
}
