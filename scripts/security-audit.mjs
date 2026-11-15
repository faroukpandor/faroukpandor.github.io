#!/usr/bin/env node
// Task 020 / GH-85 Offline Public Static Security & Privacy Guard
// Runs purely against local files with zero secrets or network calls.
// Usage: node scripts/security-audit.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { hasSensitiveLeak } from '../assets/js/opportunity-ops.mjs';

const ROOT = new URL('..', import.meta.url);

const PUBLIC_HTML_PAGES = [
  'index.html',
  'portfolio.html',
  'portfolio-map.html',
  'professional-record.html',
  'website-health-check.html',
  'sourcing-economics.html',
  'portfolio-control.html',
  'privacy.html',
  '404.html',
];

const PUBLIC_DATA_FILES = [
  'data/public-projects.json',
  'data/repository-inventory.json',
  'data/portfolio-opportunity-register.json',
  'data/portfolio-opportunity-register.csv',
  'data/portfolio-dashboard-summary.json',
  'data/next-actions/NEXT-ACTION-QUEUE.json',
  'data/next-actions/NEXT-ACTION-QUEUE.csv',
  'data/market-signals/SIGNAL-DIGEST.json',
  'data/market-signals/SIGNAL-DIGEST.md',
];

const FORBIDDEN_TRACKED_EXTENSIONS = /\.(env|pem|key|p12|pfx|pkcs12|jks|keystore|sqlite|db|docx|pdf)$/i;
const TRACKED_PERSONAL_EXCEPTIONS = new Set([
  'documents/personal/README.md',
  'documents/personal/beekeeping-circular-3-of-2026-page-1.jpeg',
  'documents/personal/beekeeping-circular-3-of-2026-page-2.jpeg',
]);

let checks = 0;
function pass(fn) {
  fn();
  checks++;
}

for (const page of PUBLIC_HTML_PAGES) {
  const html = readFileSync(new URL(page, ROOT), 'utf8');

  pass(() => {
    const csp = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
    assert.ok(csp, `${page}: missing <meta http-equiv="Content-Security-Policy">`);
    const policy = csp[1];
    assert.ok(policy.includes("default-src 'self'"), `${page}: CSP missing default-src 'self'`);
    assert.ok(policy.includes("script-src 'self'"), `${page}: CSP missing script-src 'self'`);
    assert.ok(policy.includes("style-src 'self'"), `${page}: CSP missing style-src 'self'`);
    assert.ok(policy.includes("object-src 'none'"), `${page}: CSP missing object-src 'none'`);
    assert.ok(policy.includes("base-uri 'self'"), `${page}: CSP missing base-uri 'self'`);
    assert.equal(policy.includes("'unsafe-inline'"), false, `${page}: CSP must not allow 'unsafe-inline'`);
    assert.equal(policy.includes("'unsafe-eval'"), false, `${page}: CSP must not allow 'unsafe-eval'`);
  });

  pass(() => {
    assert.match(
      html,
      /<meta\s+name=["']referrer["']\s+content=["']strict-origin-when-cross-origin["']/i,
      `${page}: missing strict Referrer-Policy meta tag`,
    );
  });

  pass(() => {
    for (const m of html.matchAll(/<script(\s+[^>]*)?>([\s\S]*?)<\/script>/gi)) {
      const attrs = m[1] || '';
      const body = m[2].trim();
      if (/type=["']application\/ld\+json["']/i.test(attrs)) {
        JSON.parse(body);
        continue;
      }
      assert.match(attrs, /\bsrc=["']assets\/js\/[a-z0-9-]+\.mjs["']/i, `${page}: inline or unapproved script detected`);
      assert.equal(body, '', `${page}: <script src="..."> must not contain inline code`);
    }
  });

  pass(() => {
    assert.equal(/\son[a-z]+\s*=/i.test(html), false, `${page}: inline event handler attribute (on*=) is forbidden`);
    assert.equal(/\sstyle\s*=/i.test(html), false, `${page}: inline style= attribute is forbidden under strict CSP`);
    assert.equal(/href\s*=\s*["']\s*(javascript:|data:text\/html)/i.test(html), false, `${page}: dangerous URI scheme in href`);
  });

  pass(() => {
    for (const m of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
      assert.match(m[0], /rel=["'][^"']*noopener[^"']*["']/i, `${page}: target="_blank" link missing rel="noopener": ${m[0]}`);
    }
  });

  pass(() => {
    const leak = hasSensitiveLeak(html);
    assert.equal(leak.hasSecretPattern, false, `${page}: potential credential pattern found`);
    assert.equal(leak.hasLocalPhoneNumber, false, `${page}: local phone number pattern found`);
  });
}

const jsFiles = readdirSync(new URL('assets/js', ROOT)).filter((f) => f.endsWith('.mjs'));
for (const file of jsFiles) {
  const code = readFileSync(new URL(`assets/js/${file}`, ROOT), 'utf8');
  pass(() => {
    assert.equal(/\.(innerHTML|outerHTML)\s*=/.test(code), false, `assets/js/${file}: DOM HTML sink assignment forbidden`);
    assert.equal(/insertAdjacentHTML\s*\(/.test(code), false, `assets/js/${file}: insertAdjacentHTML forbidden`);
    assert.equal(/\b(eval|new\s+Function)\s*\(/.test(code), false, `assets/js/${file}: dynamic code evaluation forbidden`);
    if (file !== 'opportunity-ops.mjs') {
      const leak = hasSensitiveLeak(code);
      assert.equal(leak.hasSecretPattern, false, `assets/js/${file}: secret pattern detected`);
    }
  });
}

for (const relPath of PUBLIC_DATA_FILES) {
  const text = readFileSync(new URL(relPath, ROOT), 'utf8');
  pass(() => {
    const leak = hasSensitiveLeak(text);
    assert.equal(leak.hasSecretPattern, false, `${relPath}: secret pattern detected`);
    assert.equal(leak.hasLocalPhoneNumber, false, `${relPath}: personal phone number pattern detected`);
  });
}

pass(() => {
  const pagesYml = readFileSync(new URL('.github/workflows/pages.yml', ROOT), 'utf8');
  assert.equal(/^\s*path:\s*\.\s*$/m.test(pagesYml), false, '.github/workflows/pages.yml must stage an allowlisted _site directory, not "."');
  assert.match(pagesYml, /path:\s*_site\b/, '.github/workflows/pages.yml must upload path: _site');
});

pass(() => {
  const robots = readFileSync(new URL('robots.txt', ROOT), 'utf8');
  assert.match(robots, /^Disallow:\s*\/documents\/\s*$/m, 'robots.txt must disallow /documents/');
});

pass(() => {
  if (existsSync(new URL('.git', ROOT))) {
    const tracked = execFileSync('git', ['ls-files'], { cwd: ROOT.pathname, encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
    for (const f of tracked) {
      assert.equal(FORBIDDEN_TRACKED_EXTENSIONS.test(f), false, `Forbidden tracked secret/document file: ${f}`);
      if (f.startsWith('documents/personal/')) {
        assert.ok(TRACKED_PERSONAL_EXCEPTIONS.has(f), `Unexpected tracked personal file outside verified allowlist: ${f}`);
      }
    }
  }
});

console.log(`${checks} static security, CSP & privacy audit checks passed (GH-85 / Task 020)`);
