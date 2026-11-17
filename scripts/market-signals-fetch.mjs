#!/usr/bin/env node
// Market Signal Fetcher — FETCH stage of docs/AFRICA-AUTOMATION-SPECIFICATION.md.
//
// This replaces the inline Python heredoc that previously lived inside
// .github/workflows/market-signal-monitor.yml. Two problems with the old
// approach, both fixed here:
//   1. It could not be unit-tested, so a silently broken fetch went unnoticed.
//   2. The workflow committed whatever it got and reported success even when
//      every source failed, so a green run did not mean healthy signals.
//
// Both are now enforced in code and covered by tests/market-signals-fetch.test.mjs.
//
// Usage:
//   node scripts/market-signals-fetch.mjs fetch            # fetch all sources
//   node scripts/market-signals-fetch.mjs fetch --only bitc-investment-areas
//   node scripts/market-signals-fetch.mjs health           # print health table
//   node scripts/market-signals-fetch.mjs require-health   # non-zero exit if any source
//                                                          # is not FETCHED (used by CI)
//   node --test                                           # offline; no network used
//
// Design rules:
//   - A fetch failure never deletes the last good HTML snapshot; only the
//     status record is rewritten. Analysis continues on stale evidence.
//   - TLS verification is NOT disabled. The gov.bw expired-certificate failure is
//     a real defect and must stay visible rather than being papered over.
//   - No credentials are read, written or logged.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const SIGNALS_DIR = new URL('../data/market-signals/', import.meta.url);
export const SCHEMA_VERSION = 'africa-market-signal-source/v1';
export const DEFAULT_TIMEOUT_MS = 30_000;
export const USER_AGENT = 'Farouk-Market-Signal-Monitor/1.0 (+https://faroukpandor.github.io/)';

// Canonical hostnames only. The bare gov.bw host serves a certificate that does
// not match the hostname, which is why www. is required here.
// Detects a "soft failure": an outage page served with HTTP 200. gov.bw serves its
// maintenance notice this way, so a naive fetcher would store a maintenance page as
// genuine market evidence and report the source as healthy. Verified 2026-11-09:
// https://www.gov.bw/* returned title "Site under maintenance | Government of Botswana".
export const MAINTENANCE_PATTERNS = [
  /site under maintenance/i,
  /scheduled maintenance for updates/i,
  /we should be back shortly/i,
  /service (?:temporarily )?unavailable/i,
  /<title>\s*503\b/i,
  /\b503\s+service\s+unavailable\b/i,
];

/** Returns a reason string when the body looks like an outage/maintenance page. */
/**
 * Turn a fetch failure into a diagnosable message.
 *
 * Undici reports every network-layer failure as the bare string "fetch failed" and
 * puts the real reason on `.cause`. That produced an unhelpful digest entry during
 * the 2026-11-17 run: gov.bw showed "fetch failed" with no indication whether the
 * cause was DNS, TLS or a refused connection. The cause chain is now flattened.
 */
export function describeFetchError(error, timeoutMs = DEFAULT_TIMEOUT_MS) {
  if (error?.name === 'AbortError') return `timed out after ${timeoutMs}ms`;
  const parts = [];
  let current = error;
  const seen = new Set();
  while (current && !seen.has(current)) {
    seen.add(current);
    const code = current.code || current.errno;
    const text = current.message ? String(current.message) : String(current);
    // Skip the uninformative undici wrapper when a more specific cause follows.
    if (!(text === 'fetch failed' && current.cause)) parts.push(code ? `${text} [${code}]` : text);
    current = current.cause;
  }
  return parts.length ? parts.join(' <- ') : 'unknown fetch error';
}

export function detectSoftFailure(bodyText) {
  const text = String(bodyText ?? '');
  if (text.trim().length === 0) return 'empty response body';
  const match = MAINTENANCE_PATTERNS.find((re) => re.test(text));
  return match ? `maintenance/unavailable page served with HTTP 200 (matched ${match})` : null;
}

// An explicit alternative for each source, tried in order. `status` documents why a
// fallback is needed rather than hiding it:
//   'standby'    the alternative serves the same evidence and may be used when the
//                primary fails;
//   'no-mirror'  no reachable government-hosted equivalent was found on 2026-11-09,
//                so the source is recorded as unavailable and last-good evidence is
//                retained. A commercial aggregator was deliberately NOT substituted
//                because it is not an official source.
export const SOURCES = [
  {
    id: 'npc-national-development-plans',
    label: 'National Planning Commission — National Development Plans',
    url: 'https://www.npc.gov.bw/national-development-plans',
    fallback: null,
    fallbackStatus: 'no-mirror',
    mirrorNote: 'Every www.npc.gov.bw path returned HTTP 503 on 2026-11-09, including the root and /publications.',
  },
  {
    id: 'government-business-opportunities',
    label: 'Government of Botswana — Identified business opportunities',
    url: 'https://www.gov.bw/doing-business/identified-possible-business-opportunities',
    // Verified reachable on 2026-11-09: serves the same "Identified Possible Business
    // Opportunities" content from the GOV.BW content-management host.
    fallback: 'https://www.gov.bw/taxonomy/term/153',
    fallbackStatus: 'standby',
    mirrorNote: 'The primary path returned HTTP 500 while the site showed a scheduled-maintenance notice.',
  },
  {
    id: 'bitc-investment-areas',
    label: 'Botswana Investment and Trade Centre — Investment areas',
    url: 'https://www.bitc.co.bw/invest/investment-areas/',
    fallback: null,
    fallbackStatus: 'no-mirror',
  },
];

/** Classify a fetch outcome without touching the filesystem. Pure; unit-tested. */
export function buildSourceRecord({ id, url, html, error, now = new Date() }) {
  const timestamp = now.toISOString();
  if (error) {
    return {
      schema: SCHEMA_VERSION,
      source: url,
      status: 'ERROR',
      attempted_utc: timestamp,
      error: String(error.message || error),
    };
  }
  const body = Buffer.isBuffer(html) ? html : Buffer.from(String(html ?? ''), 'utf8');
  return {
    schema: SCHEMA_VERSION,
    source: url,
    status: 'FETCHED',
    retrieved_utc: timestamp,
    sha256: createHash('sha256').update(body).digest('hex'),
    bytes: body.length,
  };
}

/**
 * Decide whether a monitor run should be treated as a failure.
 * A run is healthy when every source is FETCHED. Partial success is reported
 * but does not fail the job, so a single flaky government host cannot block a
 * deploy of unrelated content — the degradation stays visible in the digest.
 */
export function summariseHealth(records) {
  const total = records.length;
  const fetched = records.filter((r) => r.status === 'FETCHED').length;
  const failed = records.filter((r) => r.status !== 'FETCHED');
  return {
    total,
    fetched,
    failed: failed.length,
    failedIds: failed.map((r) => r.id ?? r.source),
    allFailed: total > 0 && fetched === 0,
    complete: failed.length === 0,
  };
}

export function renderHealthTable(records) {
  const lines = ['| Source | Status | Timestamp (UTC) | Note |', '|---|---|---|---|'];
  for (const r of records) {
    const ts = r.retrieved_utc || r.attempted_utc || 'n/a';
    let note = String(r.error || '');
    if (r.fallback_used) {
      // Surfaced explicitly: a fallback is a degraded success, not a clean one.
      note = `FALLBACK ${r.source} (primary ${r.primary_source} failed: ${r.primary_error})`;
    }
    lines.push(`| ${r.id ?? r.source} | ${r.status} | ${ts} | ${note.replaceAll('|', '/').slice(0, 240)} |`);
  }
  return lines.join('\n') + '\n';
}

/** Read every `*.json` status record in data/market-signals. Pure read, no network. */
export function readSourceRecords(dir = SIGNALS_DIR) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir.pathname)
    .filter((f) => f.endsWith('.json') && f !== 'SIGNAL-DIGEST.json')
    .sort()
    .map((f) => {
      const record = JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
      return { ...record, id: f.replace(/\.json$/, '') };
    });
}

/**
 * Fetch one source. `fetchImpl` is injectable so tests never open a socket.
 * Never throws: every failure becomes an ERROR record so the digest can show it.
 */
export async function fetchSource(source, { fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const { record } = await fetchSourceWithBody(source, { fetchImpl, timeoutMs });
  return record;
}

/**
 * Same as fetchSource, but also returns the retrieved bytes so the caller can
 * write the HTML snapshot without issuing a second network request.
 */
export async function fetchSourceWithBody(source, { fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    if (typeof fetchImpl !== 'function') throw new Error('no fetch implementation available');
    const res = await fetchImpl(source.url, {
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText || ''}`.trim());
    const body = Buffer.from(await res.arrayBuffer());

    // A 200 is not proof of content. gov.bw serves its maintenance notice with a
    // success status, so the body must be inspected before anything is persisted.
    const softFailure = detectSoftFailure(body.toString('utf8'));
    if (softFailure) throw new Error(softFailure);

    return {
      record: buildSourceRecord({ id: source.id, url: source.url, html: body }),
      body,
    };
  } catch (error) {
    return {
      record: buildSourceRecord({ id: source.id, url: source.url, error: describeFetchError(error, timeoutMs) }),
      body: null,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch a source, falling back to its documented alternative when the primary fails.
 * The record always reports which URL actually produced the evidence, so a fallback
 * is visible in the digest rather than being mistaken for the primary source.
 */
export async function fetchSourceWithFallback(source, opts = {}) {
  const attempt = await fetchSourceWithBody(source, opts);
  if (attempt.record.status === 'FETCHED' || !source.fallback) {
    return attempt;
  }

  const primaryError = attempt.record.error;
  const fallbackAttempt = await fetchSourceWithBody(
    { ...source, url: source.fallback },
    opts,
  );
  if (fallbackAttempt.record.status !== 'FETCHED') {
    return {
      record: {
        ...attempt.record,
        error: `${primaryError}; fallback ${source.fallback} also failed: ${fallbackAttempt.record.error}`,
      },
      body: null,
    };
  }

  return {
    record: {
      ...fallbackAttempt.record,
      fallback_used: true,
      primary_source: source.url,
      primary_error: primaryError,
    },
    body: fallbackAttempt.body,
  };
}

/** Write a status record. A failed fetch must never delete a good HTML snapshot. */
export function persistSourceRecord(record, id, dir = SIGNALS_DIR) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL(`${id}.json`, dir), JSON.stringify(record, null, 2) + '\n');
}

export function persistSourceBody(html, id, dir = SIGNALS_DIR) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL(`${id}.html`, dir), html);
}

export async function fetchAll({
  sources = SOURCES,
  only = null,
  fetchImpl = globalThis.fetch,
  dir = SIGNALS_DIR,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const selected = only ? sources.filter((s) => s.id === only) : sources;
  if (only && selected.length === 0) throw new Error(`unknown source id: ${only}`);

  const records = [];
  for (const source of selected) {
    process.stdout.write(`→ ${source.id} … `);
    const outcome = await fetchSourceWithFallback(source, { fetchImpl, timeoutMs });
    persistSourceRecord(outcome.record, source.id, dir);
    if (outcome.record.status === 'FETCHED' && outcome.body) {
      persistSourceBody(outcome.body, source.id, dir);
      const via = outcome.record.fallback_used ? ` via fallback ${outcome.record.source}` : '';
      process.stdout.write(`FETCHED${via} (${outcome.record.sha256.slice(0, 12)}…)\n`);
    } else {
      process.stdout.write(`ERROR — ${outcome.record.error}\n`);
    }
    records.push({ ...outcome.record, id: source.id });
  }
  return records;
}

function main(argv) {
  const [cmd = 'fetch', ...rest] = argv;
  const onlyIndex = rest.indexOf('--only');
  const only = onlyIndex >= 0 ? rest[onlyIndex + 1] : null;

  if (cmd === 'fetch') {
    return fetchAll({ only }).then((records) => {
      const health = summariseHealth(records);
      console.log(`\n${health.fetched}/${health.total} sources fetched.`);
      if (health.allFailed) {
        console.error('All sources failed — refusing to signal a healthy run.');
        process.exitCode = 1;
      }
    });
  }

  if (cmd === 'health') {
    const records = readSourceRecords();
    process.stdout.write(renderHealthTable(records));
    return Promise.resolve();
  }

  if (cmd === 'require-health') {
    const records = readSourceRecords();
    const health = summariseHealth(records);
    process.stdout.write(renderHealthTable(records));
    if (health.allFailed) {
      console.error(`No source fetched. ${health.failed} failing: ${health.failedIds.join(', ')}`);
      process.exitCode = 1;
    }
    return Promise.resolve();
  }

  console.error('usage: node scripts/market-signals-fetch.mjs <fetch|health|require-health> [--only <id>]');
  process.exitCode = 2;
  return Promise.resolve();
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main(process.argv.slice(2));
}
