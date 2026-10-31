import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = ['index.html', 'portfolio.html'];
const manifest = JSON.parse(readFileSync(new URL('../data/public-projects.json', import.meta.url), 'utf8'));
assert.equal(manifest.schema_version, 1, 'public project manifest version must be explicit');
assert.equal(manifest.entries.length, 3, 'only separately verified public destinations are currently approved');
const publicDestinations = manifest.entries.map(({public_url}) => public_url);
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
let count=0;
for (const path of files) {
  const html = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
  for (const url of prohibited) {
    assert.equal(html.includes('href="https://' + url + '"'), false, path + ' must not link customers to a private repository: ' + url);
    count++;
  }
  for (const url of publicDestinations) {
    assert.ok(html.includes('href="' + url + '"'), path + ' must link to public project ' + url);
    count++;
  }
  assert.equal((html.match(/<a(?:\s|>)/g) || []).length, (html.match(/<\/a>/g) || []).length, path + ' anchor tags must balance');
  count++;
  assert.equal((html.match(/<div(?:\s|>)/g) || []).length, (html.match(/<\/div>/g) || []).length, path + ' div tags must balance');
  count++;
  assert.ok(!/href\s*=\s*["']javascript:/i.test(html), path + ' must not include javascript URL destinations');
  count++;
}
console.log(count + ' public portfolio routing checks passed (static HTML only)');
