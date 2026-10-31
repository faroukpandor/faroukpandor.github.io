import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = ['index.html', 'portfolio.html'];
const publicDestinations = [
  'https://mokoro-dge.pages.dev/',
  'https://agrisage.pages.dev/',
  'https://everythingcity.pages.dev/',
];
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
