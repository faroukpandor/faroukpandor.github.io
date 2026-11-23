import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const files = ['index.html', 'portfolio.html'];
const allPages = [
  'index.html',
  'portfolio.html',
  'portfolio-map.html',
  'professional-record.html',
  'website-health-check.html',
  'sourcing-economics.html',
  'portfolio-control.html',
  'privacy.html',
  'affiliate-disclosure.html',
  '404.html',
];
const manifest = JSON.parse(readFileSync(new URL('../data/public-projects.json', import.meta.url), 'utf8'));
assert.equal(manifest.schema_version, 1, 'public project manifest version must be explicit');
assert.equal(manifest.entries.length, 3, 'only separately verified public destinations are currently approved');
const publicDestinations = manifest.entries.map(({ public_url }) => public_url);
assert.equal(new Set(publicDestinations).size, publicDestinations.length, 'public destinations must be unique');
for (const entry of manifest.entries) {
  assert.match(entry.public_url, /^https:\/\/[a-z0-9-]+\.pages\.dev\/$/, 'public destination must be an approved Cloudflare Pages hostname');
  assert.equal(entry.deployment_status, 'production-succeeded', 'no preview-only URL should be presented as production');
  assert.equal(entry.customer_erp_ready, false, 'do not imply customer ERP availability');
  assert.equal(entry.identity_ready, false, 'do not imply customer identity is ready');
}
const prohibited = [
  'github.com/faroukpandor/FAROUKPANDORCONSULTANT',
  'github.com/faroukpandor/AnimalHealth',
  'github.com/faroukpandor/EVERYTHING-CITY',
  'github.com/faroukpandor/AGRISAGE360',
  'github.com/faroukpandor/AGRISAGE',
  'github.com/faroukpandor/MOKORO-ENTERPRISE-OS',
];

let count = 0;
for (const path of files) {
  const html = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
  for (const url of publicDestinations) {
    assert.ok(html.includes('href="' + url + '"'), path + ' must link to public project ' + url);
    count++;
  }
}

const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');

for (const path of allPages) {
  const html = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
  for (const url of prohibited) {
    assert.equal(html.includes(url), false, path + ' must not expose private repository URL: ' + url);
    count++;
  }
  assert.equal((html.match(/<a(?:\s|>)/g) || []).length, (html.match(/<\/a>/g) || []).length, path + ' anchor tags must balance');
  count++;
  assert.equal((html.match(/<div(?:\s|>)/g) || []).length, (html.match(/<\/div>/g) || []).length, path + ' div tags must balance');
  count++;
  assert.ok(!/href\s*=\s*["']javascript:/i.test(html), path + ' must not include javascript URL destinations');
  count++;
  assert.ok(html.includes('rel="canonical"'), path + ' must declare a canonical URL');
  count++;
  assert.ok(html.includes('property="og:image"'), path + ' must declare a social preview image');
  count++;
  assert.ok(html.includes('name="viewport"'), path + ' must declare a mobile viewport');
  count++;
  assert.ok(html.includes('name="description"'), path + ' must declare a meta description');
  count++;
  assert.ok(html.includes('http-equiv="Content-Security-Policy"'), path + ' must declare a Content-Security-Policy meta header');
  count++;
  assert.ok(html.includes('name="referrer"'), path + ' must declare a strict referrer policy');
  count++;
  assert.equal(/\son[a-z]+\s*=/i.test(html), false, path + ' must not contain inline event handlers');
  count++;
  assert.equal(/\sstyle\s*=/i.test(html), false, path + ' must not contain inline style= attributes under strict CSP');
  count++;
  assert.ok(html.includes('class="skip" href="#main"'), path + ' must provide skip-to-content link');
  count++;
  assert.ok(html.includes('<header class="site-header">') && html.includes('class="wrap nav"'), path + ' must use unified .site-header and .wrap.nav layout');
  count++;
  assert.ok(html.includes('<main id="main">'), path + ' must provide <main id="main"> landmark');
  count++;
  assert.ok(html.includes('<footer>'), path + ' must provide footer landmark');
  count++;
  // 404.html is intentionally noindex and deliberately excluded from sitemap.xml.
  if (path !== '404.html') {
    const expectedLoc = path === 'index.html' ? 'https://faroukpandor.github.io/' : 'https://faroukpandor.github.io/' + path;
    assert.ok(sitemap.includes('<loc>' + expectedLoc + '</loc>'), 'sitemap.xml missing ' + expectedLoc);
    count++;
  }
  if (path === '404.html') {
    assert.ok(html.includes('name="robots" content="noindex'), '404.html must declare noindex');
    count++;
  }

  // Verify local relative hrefs point to actual files in the repository.
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(raw) || raw === './') continue;
    const target = raw.replace(/#.*$/, '').replace(/^\.\//, '');
    if (!target) continue;
    assert.ok(existsSync(new URL('../' + target, import.meta.url)), path + ' references missing local file: ' + target);
    count++;
  }

  // Verify every JSON-LD block and external ES module script dependency (inline scripts prohibited by CSP).
  for (const m of html.matchAll(/<script(?:\s+([^>]*))?>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1] || '';
    if (attrs.includes('application/ld+json')) {
      JSON.parse(m[2]);
    } else if (attrs.includes('type="module"') && /\ssrc="(assets\/js\/[^"]+)"/.test(attrs)) {
      const src = attrs.match(/\ssrc="(assets\/js\/[^"]+)"/)[1];
      assert.ok(existsSync(new URL('../' + src, import.meta.url)), path + ' references missing script: ' + src);
    } else {
      assert.fail(path + ' contains inline script prohibited by strict script-src \'self\' CSP');
    }
    count++;
  }
}

for (const jsFile of readdirSync(new URL('../assets/js', import.meta.url).pathname).filter((f) => f.endsWith('.mjs'))) {
  execFileSync(process.execPath, ['--check', new URL('../assets/js/' + jsFile, import.meta.url).pathname]);
  count++;
}

console.log(count + ' public portfolio routing & parity checks passed (static HTML only)');
