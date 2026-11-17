#!/usr/bin/env node
// Market Signal Normaliser, Deduplicator, Stale Checker & Weekly Digest Generator.
// Implements docs/AFRICA-AUTOMATION-SPECIFICATION.md (NORMALISE -> HASH -> COMPARE -> CLASSIFY -> DEDUPLICATE -> STORE -> ALERT).
//
// Usage:
//   node scripts/market-signals.mjs process
//   node scripts/market-signals.mjs verify

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url);
const SIGNALS_DIR = new URL('../data/market-signals/', import.meta.url);
const DIGEST_JSON_PATH = new URL('../data/market-signals/SIGNAL-DIGEST.json', import.meta.url);
const DIGEST_MD_PATH = new URL('../data/market-signals/SIGNAL-DIGEST.md', import.meta.url);
const QUEUE_JSON_PATH = new URL('../data/next-actions/NEXT-ACTION-QUEUE.json', import.meta.url);

const STALE_DAYS_THRESHOLD = 7;

function decodeEntities(str) {
  return str
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&nbsp;', ' ');
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

export function extractHtmlSignals(html, sourceUrl) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) : '';
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const metaDescription = descMatch ? decodeEntities(descMatch[1]).trim() : '';

  const headings = [];
  for (const m of html.matchAll(/<(h[1-5])[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = stripTags(m[2]);
    if (text.length >= 4 && text.length <= 160) headings.push(text);
  }
  if (!headings.length && metaDescription) headings.push(metaDescription);

  const links = [];
  let baseOrigin = '';
  try {
    baseOrigin = new URL(sourceUrl).origin;
  } catch {}
  for (const m of html.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const rawHref = m[1].trim();
    const label = stripTags(m[2]);
    if (!label || label.length < 4 || /^(javascript:|mailto:|tel:)/i.test(rawHref)) continue;
    let resolved = rawHref;
    if (rawHref.startsWith('/') && baseOrigin) resolved = baseOrigin + rawHref;
    if (!/^https?:\/\//i.test(resolved)) continue;
    links.push({ label: label.slice(0, 120), url: resolved });
  }

  return { title, headings, links };
}

/**
 * Whole days from `tsA` to `dateIsoB`.
 *
 * Clamped at 0: a snapshot timestamped later than the reference date (clock skew
 * on the runner, or a digest rebuilt for an earlier reference date — which is the
 * normal case after a weekly fetch) used to produce a negative age such as
 * `age_days: -7`. A negative age is meaningless and would defeat staleness
 * checks, so "not yet aged" is reported as 0.
 */
function daysBetweenIso(tsA, dateIsoB) {
  if (!tsA) return null;
  const msA = Date.parse(String(tsA).slice(0, 10) + 'T00:00:00Z');
  const msB = Date.parse(dateIsoB + 'T00:00:00Z');
  if (Number.isNaN(msA) || Number.isNaN(msB)) return null;
  return Math.max(0, Math.round((msB - msA) / 86400000));
}

export function buildSignalDigest(referenceDateOverride, signalsDir = SIGNALS_DIR) {
  const queue = JSON.parse(readFileSync(QUEUE_JSON_PATH, 'utf8'));
  const referenceDate = referenceDateOverride || queue.generated_utc.slice(0, 10);
  const jsonFiles = readdirSync(signalsDir.pathname)
    .filter((f) => f.endsWith('.json') && f !== 'SIGNAL-DIGEST.json')
    .sort();

  const sources = [];
  const seenKeys = new Set();
  const deduplicatedSignals = [];
  let duplicateDropped = 0;

  for (const file of jsonFiles) {
    const id = file.replace(/\.json$/, '');
    const meta = JSON.parse(readFileSync(join(signalsDir.pathname, file), 'utf8'));
    const htmlPath = join(signalsDir.pathname, `${id}.html`);
    const hasHtml = existsSync(htmlPath);
    let actualSha = null;
    let hashVerified = false;
    let extracted = { title: '', headings: [], links: [] };

    if (hasHtml) {
      const buf = readFileSync(htmlPath);
      actualSha = createHash('sha256').update(buf).digest('hex');
      hashVerified = Boolean(meta.sha256 && meta.sha256 === actualSha);
      extracted = extractHtmlSignals(buf.toString('utf8'), meta.source);
    }

    const ts = meta.retrieved_utc || meta.attempted_utc || null;
    const ageDays = daysBetweenIso(ts, referenceDate);
    let classification = meta.status || 'UNKNOWN';
    if (meta.status === 'FETCHED' && ageDays !== null && ageDays >= STALE_DAYS_THRESHOLD) {
      classification = 'STALE';
    }

    for (const h of extracted.headings) {
      const key = 'heading:' + h.toLowerCase();
      if (seenKeys.has(key)) {
        duplicateDropped++;
      } else {
        seenKeys.add(key);
        deduplicatedSignals.push({
          source_id: id,
          kind: 'heading',
          text: h,
          url: meta.source,
          classification,
        });
      }
    }

    sources.push({
      id,
      source: meta.source,
      status: meta.status,
      classification,
      timestamp_utc: ts,
      age_days: ageDays,
      has_html_snapshot: hasHtml,
      sha256_expected: meta.sha256 || null,
      sha256_actual: actualSha,
      sha256_verified: hashVerified,
      error: meta.error || null,
      page_title: extracted.title || null,
      heading_count: extracted.headings.length,
      link_count: extracted.links.length,
      sample_headings: extracted.headings.slice(0, 8),
    });
  }

  const healthyCount = sources.filter((s) => s.status === 'FETCHED').length;
  const errorCount = sources.filter((s) => s.status !== 'FETCHED').length;
  const staleCount = sources.filter((s) => s.classification === 'STALE').length;

  return {
    schema: 'africa-market-signal-digest/v1',
    reference_date: referenceDate,
    stale_threshold_days: STALE_DAYS_THRESHOLD,
    summary: {
      total_sources: sources.length,
      fetched_count: healthyCount,
      error_count: errorCount,
      stale_count: staleCount,
      unique_signal_headings: deduplicatedSignals.length,
      duplicates_dropped: duplicateDropped,
    },
    sources,
    signals: deduplicatedSignals.slice(0, 40),
  };
}

function renderDigestMarkdown(digest) {
  const lines = [
    '# Botswana Market Signal Digest',
    '',
    `- **Reference date:** ${digest.reference_date}`,
    `- **Sources:** ${digest.summary.fetched_count}/${digest.summary.total_sources} fetched, ${digest.summary.error_count} error, ${digest.summary.stale_count} stale (> ${digest.stale_threshold_days} days)`,
    `- **Extracted unique headings:** ${digest.summary.unique_signal_headings} (${digest.summary.duplicates_dropped} duplicates filtered)`,
    '',
    '## Source Health & Integrity',
    '',
    '| Feed ID | Source URL | Status | Classification | Age (days) | SHA-256 Verified | Notes |',
    '|---|---|---|---|---:|---|---|',
  ];

  for (const s of digest.sources) {
    const note = s.error ? s.error.replaceAll('|', '/') : s.page_title || 'OK';
    lines.push(
      `| ${s.id} | ${s.source} | ${s.status} | ${s.classification} | ${s.age_days ?? '—'} | ${s.sha256_verified ? 'Yes' : 'No'} | ${note} |`,
    );
  }

  lines.push('', '## Extracted Headings (Normalised, Deduplicated)', '');
  for (const s of digest.sources) {
    lines.push(`### ${s.id}`);
    if (!s.sample_headings.length) {
      lines.push('- _No cached HTML snapshot headings available._');
    } else {
      for (const h of s.sample_headings) lines.push(`- ${h}`);
    }
    lines.push('');
  }
  lines.push(
    '> **Human-in-the-loop boundary:** Official listings and planning portals are directional intelligence signals only — never proof of customer demand or government endorsement.',
  );
  return lines.join('\n') + '\n';
}

function processSignals() {
  const digest = buildSignalDigest();
  const md = renderDigestMarkdown(digest);
  writeFileSync(DIGEST_JSON_PATH, JSON.stringify(digest, null, 2) + '\n');
  writeFileSync(DIGEST_MD_PATH, md);
  console.log(
    `wrote data/market-signals/SIGNAL-DIGEST.{json,md}: ${digest.summary.fetched_count}/${digest.summary.total_sources} fetched, ` +
      `${digest.summary.error_count} error, ${digest.summary.stale_count} stale, ${digest.summary.unique_signal_headings} headings`,
  );
}

function verifySignals() {
  const expected = buildSignalDigest();
  const actual = JSON.parse(readFileSync(DIGEST_JSON_PATH, 'utf8'));
  assert.deepEqual(actual, expected, 'SIGNAL-DIGEST.json out of sync; run node scripts/market-signals.mjs process');
  const actualMd = readFileSync(DIGEST_MD_PATH, 'utf8');
  assert.equal(actualMd, renderDigestMarkdown(expected), 'SIGNAL-DIGEST.md out of sync');

  for (const s of expected.sources) {
    if (s.status === 'FETCHED') {
      assert.equal(s.has_html_snapshot, true, `${s.id} reports FETCHED without HTML snapshot`);
      assert.equal(s.sha256_verified, true, `${s.id} HTML snapshot fails SHA-256 check`);
    } else {
      assert.ok(s.error, `${s.id} non-FETCHED feed must carry explicit error message`);
    }
  }
  console.log(`${expected.sources.length} market-signal integrity & digest checks passed (offline)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2];
  if (mode === 'process') processSignals();
  else if (mode === 'verify') verifySignals();
  else {
    console.error('usage: node scripts/market-signals.mjs <process|verify>');
    process.exit(2);
  }
}
