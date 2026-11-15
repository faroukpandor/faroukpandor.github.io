import { parseCsv } from './opportunity-ops.mjs';

const stateSelect = document.getElementById('filter-state');
const ageingSelect = document.getElementById('filter-ageing');
const searchInput = document.getElementById('filter-search');
const rows = [...document.querySelectorAll('#queue-table tbody tr')];

function applyFilters() {
  const s = stateSelect?.value || '';
  const a = ageingSelect?.value || '';
  const q = (searchInput?.value || '').trim().toLowerCase();
  for (const tr of rows) {
    const okS = !s || tr.dataset.state === s;
    const okA = !a || tr.dataset.ageing === a;
    const okQ = !q || tr.textContent.toLowerCase().includes(q);
    tr.hidden = !(okS && okA && okQ);
  }
}

stateSelect?.addEventListener('change', applyFilters);
ageingSelect?.addEventListener('change', applyFilters);
searchInput?.addEventListener('input', applyFilters);

const fileInput = document.getElementById('private-register-file');
const output = document.getElementById('private-register-output');
fileInput?.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file || !output) return;
  const text = await file.text();
  try {
    let records = [];
    if (file.name.toLowerCase().endsWith('.json')) {
      const parsed = JSON.parse(text);
      records = Array.isArray(parsed) ? parsed : (parsed.records || parsed.actions || []);
    } else {
      const rowsOut = parseCsv(text);
      const headers = (rowsOut[0] || []).map((h) => h.trim());
      records = rowsOut
        .slice(1)
        .filter((r) => r.some(Boolean))
        .map((vals) => Object.fromEntries(headers.map((h, idx) => [h, (vals[idx] || '').trim()])));
    }
    const p = document.createElement('p');
    p.textContent = 'Loaded ' + records.length + ' local record(s) from ' + file.name + ' (stays in browser memory only).';
    output.replaceChildren(p);
    if (records.length) {
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      const tbl = document.createElement('table');
      tbl.className = 'data-table';
      const keys = Object.keys(records[0]).slice(0, 6);
      const thead = tbl.createTHead();
      const hr = thead.insertRow();
      for (const k of keys) {
        const th = document.createElement('th');
        th.textContent = k;
        hr.appendChild(th);
      }
      const tbody = tbl.createTBody();
      for (const r of records.slice(0, 50)) {
        const tr = tbody.insertRow();
        for (const k of keys) {
          const td = tr.insertCell();
          td.textContent = String(r[k] ?? '');
        }
      }
      wrap.appendChild(tbl);
      output.appendChild(wrap);
    }
  } catch (err) {
    output.textContent = 'Could not parse file: ' + String(err);
  }
});
