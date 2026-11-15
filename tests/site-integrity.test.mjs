import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const PAGES = [
  'index.html',
  'portfolio.html',
  'portfolio-map.html',
  'professional-record.html',
  'website-health-check.html',
  'sourcing-economics.html',
  'portfolio-control.html',
  'privacy.html',
];

test('all 8 public HTML pages pass CSS class coverage and balanced landmark parity', () => {
  const css = readFileSync(new URL('../assets/css/site.css', import.meta.url), 'utf8');
  for (const page of PAGES) {
    const html = readFileSync(new URL('../' + page, import.meta.url), 'utf8');
    const classes = new Set([...html.matchAll(/(?:^|[\s<])class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));
    const missing = [...classes].filter((c) => c && !css.includes('.' + c));
    assert.deepEqual(missing, [], `${page} uses unstyled CSS classes: ${missing.join(', ')}`);

    for (const tag of ['header', 'nav', 'main', 'footer', 'section']) {
      const open = (html.match(new RegExp(`<${tag}(?:\\s|>)`, 'g')) || []).length;
      const close = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
      assert.equal(open, close, `${page} has unbalanced <${tag}> tags`);
    }

    for (const m of html.matchAll(/<script(?:\s+([^>]*))?>([\s\S]*?)<\/script>/g)) {
      const attrs = m[1] || '';
      if (attrs.includes('application/ld+json')) {
        JSON.parse(m[2]);
      } else {
        assert.match(attrs, /type="module"[\s\S]*\ssrc="assets\/js\//, `${page} must use external ESM script under assets/js/`);
        assert.equal(m[2].trim(), '', `${page} must have zero inline script body`);
      }
    }
  }
});
