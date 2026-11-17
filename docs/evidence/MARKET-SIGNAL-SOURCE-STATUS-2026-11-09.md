# Market Signal Source Status — 2026-11-09

Diagnosis of why the digest reports `1/3 fetched, 2 error`, and what was changed as a
result. Verified from a network location with general internet access (the agent
sandbox has none, so those results would have been meaningless).

## Findings

### 1. `gov.bw` — scheduled maintenance served as HTTP 200

```
GET https://www.gov.bw/doing-business/identified-possible-business-opportunities  → HTTP 500
GET https://www.gov.bw/taxonomy/term/153                                          → HTTP 200 (maintenance page)
GET https://www.gov.bw/trade-and-industry                                         → HTTP 200 (maintenance page)
```

Body of the "200" responses:

> **Site under maintenance**
> Government of Botswana is currently under scheduled maintenance for updates.
> We should be back shortly.

This is the most important finding. **A maintenance notice was being served with a
success status.** The original fetcher only checked the HTTP status code, so on a day
when the path returned 200 it would have stored the maintenance page as genuine
market evidence and reported the source as `FETCHED`. That is a silent data-integrity
failure, not an availability problem, and it was never visible in the digest.

**Second observation:** the bare host returns `HTTP 500` while the `www.` host serves
the CMS. The original code comment blamed a certificate mismatch on the bare host;
that is no longer the failure mode. The comment has been corrected rather than
repeating a wrong diagnosis.

### 2. `npc.gov.bw` — genuinely unavailable

Every path returned `HTTP 503 Service Unavailable`, including the root:

```
/publications                             → 503
/national-development-plans               → 503
/national-transformation-strategy          → 503
/                                          → 503
```

No reachable government-hosted mirror was found. The National Development Plan
content exists (`NDP 12`, `National Transformation Strategy`) but is unreachable
from this location at this time.

### 3. `bitc.co.bw` — healthy

Confirmed working; the committed 107 KB snapshot matches its recorded hash.

## Changes made

### Soft-failure detection (the real bug)

`detectSoftFailure()` inspects the response body before anything is persisted. An
outage page served with HTTP 200 is recorded as `ERROR` with the reason
`maintenance/unavailable page served with HTTP 200`, never as `FETCHED`. Signatures
covered: site maintenance, scheduled maintenance, "we should be back shortly",
"service unavailable", `<title>503`, and empty bodies.

This also protects against a future replication of the same pattern from any source.

### Documented fallbacks

Each source now declares a `fallback` and a `fallbackStatus`:

| Source | Fallback | Status |
|---|---|---|
| `npc-national-development-plans` | none | `no-mirror` — no reachable official equivalent |
| `government-business-opportunities` | `https://www.gov.bw/taxonomy/term/153` | `standby` — same "Identified Possible Business Opportunities" content, verified reachable |
| `bitc-investment-areas` | none | `no-mirror` |

When a fallback is used the record carries `fallback_used: true`, `primary_source`
and `primary_error`, and the health table prints `FALLBACK … primary … failed: …`.
A degraded success is therefore never indistinguishable from a clean one.

### What was deliberately not done

- **No commercial aggregator substituted for an official source.** A third-party
  opportunity feed is not the Government of Botswana's procurement signal, and
  presenting it as such would misrepresent provenance.
- **TLS verification was not disabled.** Suppressing a certificate error to make a
  build green would hide a real security condition.
- **No source deleted.** Both failing sources remain configured, so recovery is
  detected automatically on the next weekly run with no code change.

## Expected behaviour on the next scheduled run

- `bitc-investment-areas` → `FETCHED`.
- `government-business-opportunities` → `FETCHED` **via the fallback** while the
  primary path remains in maintenance, or straight from the primary once it recovers.
- `npc-national-development-plans` → remains `ERROR` with the 503 recorded, and the
  last good 33 KB snapshot is retained for analysis. The run as a whole stays green
  because not all sources failed, which is the intended design.

## Owner action, if the outage persists

No code fix can restore an origin. If `npc.gov.bw` is still down after a week:

1. Check whether it resolves from a Botswana network (regional filtering is possible).
2. Confirm the NDP 12 and National Transformation Strategy documents are still
   published at an alternative official location.
3. If a stable alternative exists, add it as the `fallback` for
   `npc-national-development-plans` with `fallbackStatus: 'standby'` and re-run
   `node scripts/market-signals-fetch.mjs fetch --only npc-national-development-plans`.

## Result of the first live run (2026-11-17, `workflow_dispatch`, 29s, success)

| Source | Result | Detail |
| --- | --- | --- |
| `bitc-investment-areas` | `FETCHED` | 107,021 bytes, sha256 `90e49de9…` |
| `government-business-opportunities` | `ERROR` | primary **and** fallback both unreachable from the GitHub runner |
| `npc-national-development-plans` | `ERROR` | `HTTP 503 Service Unavailable` |

The run stayed **green** as designed (not every source failed) and both failing
sources kept their last-good snapshots. Two things this run exposed:

1. **The fallback does not help while the whole domain is unreachable.** The
   fallback for `government-business-opportunities` lives on the same host
   (`gov.bw`), so it only protects against a bad *path*, not an outage of the
   host. That is now stated plainly rather than implied.
2. **Errors were not diagnosable.** undici reports every network-layer failure as
   the bare string `fetch failed` and puts the real reason on `error.cause`. The
   digest therefore recorded `"fetch failed; fallback … also failed: fetch failed"`,
   which cannot distinguish DNS from TLS from a refused connection. `fetchSource`
   now flattens the cause chain via `describeFetchError()`, so the next run records
   the underlying code (for example `getaddrinfo EAI_AGAIN www.gov.bw`) instead.

## Verification

```
npm test  → 38/38 passing (8 new tests: soft-failure detection, fallback use,
             dual-failure reporting, no fabricated mirrors, degraded-success display,
             cause-chain flattening, plain-message passthrough, timeout mapping)
npm run verify → all suites green
```
