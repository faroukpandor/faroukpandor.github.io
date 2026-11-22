const STORAGE_KEY = 'fp-website-health-check-v1';
const SECTIONS = [
  {
    id: 'reachability',
    title: '1. Reachability and navigation',
    items: [
      ['R1', 'Homepage responds and renders cleanly', 'Confirm primary URL returns HTTP 200 and visible content.'],
      ['R2', 'Key service/product pages respond', 'Inspect core offering pages linked from navigation.'],
      ['R3', 'Internal navigation and primary CTA destinations work', 'Confirm primary buttons go to intended destinations.'],
      ['R4', 'Broken links and redirect loops checked', 'Verify no dead 404 internal links or redirect chains.'],
      ['R5', 'Unknown path (404) behaviour checked where appropriate', 'Confirm typos show helpful recovery links rather than blank pages.'],
      ['R6', 'Mobile layout checked at a narrow viewport (~375px)', 'Verify zero horizontal overflow and readable text on mobile.'],
    ],
  },
  {
    id: 'enquiry',
    title: '2. Enquiry and conversion path',
    items: [
      ['E1', 'Primary offer and intended audience are clear', 'Visitor understands what is offered and for whom within seconds.'],
      ['E2', 'Contact route is visible and consistent', 'Main contact action stays predictable across pages.'],
      ['E3', 'Email/telephone/WhatsApp links point to expected destinations', 'Check href schemes (mailto:, tel:, wa.me) carefully.'],
      ['E4', 'Forms inspected for required fields, validation, consent and errors', 'Verify inputs, consent disclosure and clear error prompts.'],
      ['E5', 'Delivery/storage verified only with explicit owner permission', 'Never claim live form delivery unless tested with authorisation.'],
      ['E6', 'No test enquiry submitted without authorisation', 'Keep unapproved production forms untouched.'],
    ],
  },
  {
    id: 'trust',
    title: '3. Content and trust',
    items: [
      ['T1', 'Business name, address, contact details and hours are consistent', 'Ensure footer, header and contact details agree.'],
      ['T2', 'Claims, prices, availability, certifications and testimonials have support', 'Remove or verify unsupported guarantees or vague social proof.'],
      ['T3', 'Content is current enough for the service offered', 'Check outdated promotions, dates or discontinued items.'],
      ['T4', 'Images and logos appear authorised and appropriate', 'Confirm assets match the brand and load reliably.'],
      ['T5', 'Privacy notice and terms are discoverable where relevant', 'Provide a clear public privacy/contact disclosure.'],
      ['T6', 'No false scarcity or deceptive urgency', 'Keep messaging honest and grounded.'],
    ],
  },
  {
    id: 'search',
    title: '4. Basic search and metadata',
    items: [
      ['S1', 'Page title and meta description are present and relevant', 'Each public page has a descriptive title and summary.'],
      ['S2', 'Heading structure is understandable', 'One clear H1 with logical H2/H3 subsections.'],
      ['S3', 'Canonical, robots.txt and sitemap.xml inspected when applicable', 'Ensure public pages are indexable and private areas excluded.'],
      ['S4', 'Images have useful alternative text where meaningful', 'Check non-decorative images describe content clearly.'],
      ['S5', 'Link text is understandable out of context', 'Avoid ambiguous "click here" labels.'],
    ],
  },
  {
    id: 'accessibility',
    title: '5. Basic accessibility and usability',
    items: [
      ['A1', 'Keyboard navigation and visible focus spot-checked', 'Tab through header, links and buttons without getting trapped.'],
      ['A2', 'Form fields have visible labels', 'Verify programmatic label/id association, not placeholder-only text.'],
      ['A3', 'Contrast and text scaling spot-checked', 'Flag faint grey-on-light text; never claim a full WCAG audit.'],
      ['A4', 'Buttons and links are distinguishable and usable', 'Ensure sufficient tap target spacing on mobile screens.'],
      ['A5', 'Error messages explain how to recover', 'State clearly what field needs correction.'],
    ],
  },
  {
    id: 'technical',
    title: '6. Basic performance and technical signals',
    items: [
      ['P1', 'Page load behaviour noted under stated conditions', 'Record device, network and observed responsiveness honestly.'],
      ['P2', 'Large images or heavy blocking scripts noted', 'Flag uncompressed multi-megabyte media slowing mobile users.'],
      ['P3', 'HTTPS/certificate status checked safely in browser', 'Verify valid padlock and canonical HTTPS redirect.'],
      ['P4', 'Third-party scripts, cookies and external embeds noted', 'Identify third-party widgets or tracking tags visible on load.'],
      ['P5', 'Automated observations list tool name, date, URL and limits', 'Never extrapolate partial checks into broad security guarantees.'],
    ],
  },
];

const state = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') return saved;
  } catch {}
  return {
    meta: { url: '', scope: '', reviewer: '', date: new Date().toISOString().slice(0, 10) },
    items: {},
  };
})();

const urlInput = document.getElementById('hc-url');
const scopeInput = document.getElementById('hc-scope');
const revInput = document.getElementById('hc-reviewer');
const dateInput = document.getElementById('hc-date');
const feedback = document.getElementById('hc-feedback');
const container = document.getElementById('checklist-container');

urlInput.value = state.meta.url || '';
scopeInput.value = state.meta.scope || '';
revInput.value = state.meta.reviewer || '';
dateInput.value = state.meta.date || new Date().toISOString().slice(0, 10);

function save() {
  state.meta = {
    url: urlInput.value.trim(),
    scope: scopeInput.value.trim(),
    reviewer: revInput.value.trim(),
    date: dateInput.value,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  updateScorecard();
}

function updateScorecard() {
  const allIds = SECTIONS.flatMap((s) => s.items.map((i) => i[0]));
  let assessed = 0;
  let fixes = 0;
  let urgent = 0;
  for (const id of allIds) {
    const rec = state.items[id] || { status: 'Not checked', severity: 'Medium', confidence: 'Unverified', note: '' };
    if (rec.status && rec.status !== 'Not checked') assessed++;
    if (rec.status === 'Needs fix') {
      fixes++;
      if (rec.severity === 'Critical' || rec.severity === 'High') urgent++;
    }
  }
  document.getElementById('stat-checked').textContent = `${assessed} / ${allIds.length}`;
  document.getElementById('stat-fixes').textContent = String(fixes);
  document.getElementById('stat-urgent').textContent = String(urgent);
}

function renderChecklist() {
  container.replaceChildren();
  for (const sec of SECTIONS) {
    const box = document.createElement('section');
    box.className = 'checklist-group';
    const h3 = document.createElement('h3');
    h3.textContent = sec.title;
    box.appendChild(h3);

    for (const [id, title, hint] of sec.items) {
      const cur = state.items[id] || { status: 'Not checked', severity: 'Medium', confidence: 'Unverified', note: '' };
      const row = document.createElement('div');
      row.className = 'check-item';

      const left = document.createElement('div');
      const label = document.createElement('label');
      label.className = 'check-label';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = cur.status === 'Pass';
      cb.setAttribute('aria-label', `${id} ${title}`);
      const span = document.createElement('span');
      span.textContent = `${id}. ${title}`;
      label.append(cb, span);

      const meta = document.createElement('p');
      meta.className = 'check-meta';
      meta.textContent = hint;

      const note = document.createElement('input');
      note.type = 'text';
      note.className = 'check-notes';
      note.placeholder = 'Observed evidence, exact URL, impact or recommended next action…';
      note.value = cur.note || '';
      note.setAttribute('aria-label', `Notes for ${id}`);

      left.append(label, meta, note);

      const right = document.createElement('div');
      right.className = 'check-controls no-print';

      const selStatus = document.createElement('select');
      selStatus.setAttribute('aria-label', `Status for ${id}`);
      for (const opt of ['Not checked', 'Pass', 'Needs fix', 'Not applicable']) {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        if (cur.status === opt) o.selected = true;
        selStatus.appendChild(o);
      }

      const selSev = document.createElement('select');
      selSev.setAttribute('aria-label', `Severity for ${id}`);
      for (const opt of ['Critical', 'High', 'Medium', 'Low', 'Informational']) {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        if (cur.severity === opt) o.selected = true;
        selSev.appendChild(o);
      }

      const selConf = document.createElement('select');
      selConf.setAttribute('aria-label', `Confidence for ${id}`);
      for (const opt of ['Confirmed', 'Likely', 'Unverified']) {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        if (cur.confidence === opt) o.selected = true;
        selConf.appendChild(o);
      }

      const commit = () => {
        state.items[id] = {
          status: selStatus.value,
          severity: selSev.value,
          confidence: selConf.value,
          note: note.value.trim(),
        };
        cb.checked = selStatus.value === 'Pass';
        save();
      };

      cb.addEventListener('change', () => {
        selStatus.value = cb.checked ? 'Pass' : 'Not checked';
        commit();
      });
      selStatus.addEventListener('change', commit);
      selSev.addEventListener('change', commit);
      selConf.addEventListener('change', commit);
      note.addEventListener('input', commit);

      right.append(selStatus, selSev, selConf);
      row.append(left, right);
      box.appendChild(row);
    }
    container.appendChild(box);
  }
}

function buildReportObject() {
  const findings = [];
  let passed = 0;
  let total = 0;
  for (const sec of SECTIONS) {
    for (const [id, title] of sec.items) {
      total++;
      const rec = state.items[id] || { status: 'Not checked', severity: 'Medium', confidence: 'Unverified', note: '' };
      if (rec.status === 'Pass') passed++;
      if (rec.status === 'Needs fix' || rec.note) {
        findings.push({ id, section: sec.title, check: title, ...rec });
      }
    }
  }
  return {
    tool: 'Farouk Pandor — Website & Digital Presence Health Check (CC BY 4.0)',
    generated_at: new Date().toISOString(),
    meta: state.meta,
    summary: { total_checks: total, passed, flagged_items: findings.filter((f) => f.status === 'Needs fix').length },
    findings,
    exclusions: 'Not a penetration test, legal compliance certification, full WCAG accessibility audit or ranking guarantee.',
  };
}

function buildMarkdown() {
  const rep = buildReportObject();
  const lines = [
    '# Website & Digital Presence Health Check Report',
    '',
    `- **Website / Target:** ${rep.meta.url || 'Not specified'}`,
    `- **Pages / Scope:** ${rep.meta.scope || 'Not specified'}`,
    `- **Reviewer / Owner:** ${rep.meta.reviewer || 'Self-review'}`,
    `- **Review Date:** ${rep.meta.date || 'Unspecified'}`,
    `- **Passed Checks:** ${rep.summary.passed} / ${rep.summary.total_checks}`,
    `- **Flagged Fixes:** ${rep.summary.flagged_items}`,
    '',
    '## Findings & Observations',
    '',
    '| ID | Area | Check | Status | Severity | Confidence | Notes / Evidence |',
    '|---|---|---|---|---|---|---|',
  ];
  for (const f of rep.findings) {
    const safeNote = (f.note || '—').replaceAll('|', '\\|');
    lines.push(`| ${f.id} | ${f.section} | ${f.check} | ${f.status} | ${f.severity} | ${f.confidence} | ${safeNote} |`);
  }
  if (!rep.findings.length) {
    lines.push('| — | — | No findings flagged yet | — | — | — | Complete checks in tool before exporting. |');
  }
  lines.push(
    '',
    '## Explicit Exclusions',
    '',
    '- This review is **not** a penetration test, exploit check, load test, legal compliance certification, full WCAG accessibility audit or search-ranking guarantee.',
    '- Template attribution: Farouk Pandor (`https://faroukpandor.github.io/website-health-check.html`), licensed CC BY 4.0.',
  );
  return lines.join('\n') + '\n';
}

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

[urlInput, scopeInput, revInput, dateInput].forEach((el) => el.addEventListener('input', save));

document.getElementById('btn-export-md').addEventListener('click', () => {
  triggerDownload(`website-health-check-${state.meta.date || 'report'}.md`, buildMarkdown(), 'text/markdown;charset=utf-8');
  feedback.textContent = 'Markdown report downloaded.';
});

document.getElementById('btn-export-json').addEventListener('click', () => {
  triggerDownload(
    `website-health-check-${state.meta.date || 'report'}.json`,
    JSON.stringify(buildReportObject(), null, 2) + '\n',
    'application/json;charset=utf-8',
  );
  feedback.textContent = 'JSON report downloaded.';
});

document.getElementById('btn-copy-summary').addEventListener('click', async () => {
  const md = buildMarkdown();
  try {
    await navigator.clipboard.writeText(md);
    feedback.textContent = 'Report summary copied to clipboard.';
  } catch {
    feedback.textContent = 'Clipboard unavailable — use Download Markdown Report instead.';
  }
});

document.getElementById('btn-print').addEventListener('click', () => window.print());

document.getElementById('btn-reset').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  state.items = {};
  urlInput.value = '';
  scopeInput.value = '';
  revInput.value = '';
  dateInput.value = new Date().toISOString().slice(0, 10);
  renderChecklist();
  updateScorecard();
  feedback.textContent = 'Local draft cleared.';
});

renderChecklist();
updateScorecard();
