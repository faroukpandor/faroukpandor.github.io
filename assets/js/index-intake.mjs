const form = document.getElementById('enquiry-form');
const needSelect = document.getElementById('f-need');
const confirmBox = document.getElementById('form-confirmation');
const copyBtn = document.getElementById('btn-copy-intake');
const downloadBtn = document.getElementById('btn-download-intake');
const retryLink = document.getElementById('btn-mailto-retry');
const params = new URLSearchParams(window.location.search);
const utm = {
  utm_source: params.get('utm_source') || '',
  utm_medium: params.get('utm_medium') || '',
  utm_campaign: params.get('utm_campaign') || '',
  source_page: 'index.html',
};

for (const card of document.querySelectorAll('.intent-card[data-need]')) {
  card.addEventListener('click', () => {
    if (needSelect) needSelect.value = card.dataset.need;
  });
}
const focusParam = params.get('focus');
if (focusParam && needSelect) {
  const match = [...needSelect.options].find((o) => o.text.toLowerCase().includes(focusParam.toLowerCase()));
  if (match) needSelect.value = match.value;
}

if (form) {
  let lastPayload = null;
  let lastText = '';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const need = String(values.get('need') || 'General enquiry');
    const subject = 'Enquiry: ' + need;
    const labels = {
      need: 'What they need',
      name: 'Name',
      contact: 'Preferred contact',
      requirement: 'Requirement',
      location: 'Location',
      timing: 'Timing',
      budget_quantity: 'Budget or quantity',
    };
    const lines = [...values.entries()]
      .filter(([key, value]) => String(value).trim() && labels[key])
      .map(([key, value]) => labels[key] + ': ' + String(value).trim());
    if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
      lines.push('Attribution: ' + [utm.utm_source, utm.utm_medium, utm.utm_campaign].filter(Boolean).join(' / '));
    }
    lastText = lines.join('\n\n');
    lastPayload = {
      schema: 'portable-opportunity-intake/v1',
      captured_utc: new Date().toISOString(),
      source_channel: utm.utm_source || 'Website',
      source_asset: utm.source_page,
      attribution: utm,
      consent_acknowledged: Boolean(values.get('consent')),
      need,
      name: String(values.get('name') || '').trim(),
      contact: String(values.get('contact') || '').trim(),
      requirement: String(values.get('requirement') || '').trim(),
      location: String(values.get('location') || '').trim(),
      timing: String(values.get('timing') || '').trim(),
      budget_quantity: String(values.get('budget_quantity') || '').trim(),
    };
    const mailtoUrl = 'mailto:faroukpandor@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lastText);
    if (retryLink) retryLink.href = mailtoUrl;
    if (confirmBox) confirmBox.hidden = false;
    window.location.href = mailtoUrl;
  });

  copyBtn?.addEventListener('click', async () => {
    if (!lastText) return;
    try {
      await navigator.clipboard.writeText(lastText);
      copyBtn.textContent = 'Copied!';
    } catch {
      copyBtn.textContent = 'Copy unavailable';
    }
  });

  downloadBtn?.addEventListener('click', () => {
    if (!lastPayload) return;
    const blob = new Blob([JSON.stringify(lastPayload, null, 2) + '\n'], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'portable-opportunity-intake-' + lastPayload.captured_utc.slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  });
}
