# Missing & Pending Code — Delivery Record (2026-11-09)

This records the code that was **referenced, implied or silently broken** but not
present, and what was generated to close each gap. Every item below is verified
offline by `npm test && npm run verify`.

## 1. Market signal fetch stage — was not code at all

**Gap.** The FETCH stage lived as an inline Python heredoc inside
`.github/workflows/market-signal-monitor.yml`. Three consequences:

- It could not be unit-tested, imported or linted.
- It committed whatever it retrieved and the job still reported **success while
  all sources were down** (observed state: `1/3 fetched, 2 error` and a green run).
- A TLS failure and an HTTP 503 were indistinguishable from a healthy no-op.

**Generated.** `scripts/market-signals-fetch.mjs`

| Command | Behaviour |
|---|---|
| `fetch` | Fetches each source; writes a status record and an HTML snapshot. Never throws — every failure becomes an `ERROR` record. |
| `health` | Prints the markdown health table (also appended to the CI step summary). |
| `require-health` | Exits non-zero only when **every** source failed, so one flaky government host cannot block unrelated deploys. |

Design decisions preserved deliberately:

- TLS verification is **not** disabled. The `gov.bw` expired-certificate error is a
  real defect and must stay visible.
- A failed fetch **never deletes the last good snapshot**; only the status record
  is rewritten, so analysis continues on stale-but-real evidence.
- Canonical `www.` hostnames only — the bare `gov.bw` host serves a mismatched
  certificate.

**Tests.** `tests/market-signals-fetch.test.mjs` — 12 tests, zero sockets
(`fetchImpl` is injectable): hash determinism, non-2xx handling, expired
certificate capture, timeout/abort, single-request body return, snapshot
survival on failure, health summarisation, pipe escaping, id uniqueness.

## 2. No CI ran on pull requests

**Gap.** Only `pages.yml` (push to `main`) and the signal monitor existed. A
reviewer could approve a pull request and merge it **before any check ran** —
which is how a failing test reached `main`.

**Generated.** `.github/workflows/validate.yml`

Gates on every pull request and every non-`main` push:

1. Assert zero runtime and dev dependencies (keeps the offline suite trustworthy).
2. `npm test`.
3. `npm run verify`.
4. Assert `npm run generate` is idempotent — a diff means committed artifacts
   drifted from their source data.
5. Build `_site/` and assert the allowlist: `docs/`, `documents/`, `scripts/`,
   `tests/`, `templates/` and raw `data/market-signals/*.html` must not leak.

## 3. `LICENSE` was missing while the site claimed CC BY 4.0

**Gap.** `privacy.html` and `README.md` both state the health-check method is
CC BY 4.0, but the repository declared no licence. A licence claim with no
licence file is not enforceable and is confusing for anyone reusing the material.

**Generated.** `LICENSE`, scoped in four explicit parts:

1. Health Check method and its report text → **CC BY 4.0** (with the exact
   attribution string to use).
2. Everything else authored for the site → **all rights reserved** (no implicit
   licence from public availability).
3. Third-party vendor/supplier material → **not licensed here**, no endorsement.
4. Personal, client and employer data → **excluded** entirely.

Plus a no-warranty clause stating that calculators and market signals are
illustrative working tools, not financial, legal, tax, engineering, veterinary
or medical advice.

## 4. `opportunity-record` and `portable-opportunity-intake` contracts were never enforced

**Gap.** `validateSchemasOffline()` confirmed each schema file *had* metadata and
checked the queue and register records against `required`, but the two schemas
that govern the intake → record pipeline were never exercised against real data.
A field could vanish from that pipeline with no test failing.

**Generated.** `validateRecordContracts()` in `scripts/opportunity-cli.mjs`,
now run by `validate-schemas`:

- Every schema-required field must exist on `OPPORTUNITY-RECORD-TEMPLATE.json`,
  and the template keys must match the required list exactly.
- `ownership_status` must come from the schema enum, never free text.
- A synthetic intake is pushed through `intakeToCanonicalRecord()` and must
  satisfy the full record contract, including generated `OPP-`/`CUS-` ids.

Hand-rolled rather than a JSON-Schema dependency, so the suite still runs with
zero installs.

## 5. Router dropped the free-text need, and did not know "supplier"

**Gap (two defects, both user-visible).**

1. `opportunity-cli.mjs route "…"` accepted the text as a positional argument and
   **silently discarded it**, routing an empty need to `CLARIFY`.
2. `qualifyAndRouteDemand()` only used `input.requirement`, ignoring a free-text
   `input.need`. Any single-line input (CLI, WhatsApp, one-field enquiry) routed
   to `CLARIFY` regardless of content.
3. `normalizeCategoryFromNeed()` matched `source`/`supply` but **not `supplier`**,
   so the single most common sourcing phrase — "I need a supplier for …" — fell
   through to `Something else`.

**Fixed.** `assets/js/demand-router.mjs`, `scripts/opportunity-cli.mjs`

- Positional `route` text is used when `--need` is absent.
- A non-taxonomy `need` acts as the requirement description.
- Sourcing vocabulary now includes `supplier`, `vendor`, `procure`, `rfq`,
  `quotation`, `quote`, `purchase`, `goods`, `materials`.
- Homepage intent-card labels remain keyword-only and still route to `CLARIFY`,
  so a bare label cannot unlock an actionable route.

**Tests.** Three regression tests in `tests/demand-router.test.mjs`.

## 6. A test could not fail honestly

**Gap.** `buildSignalDigest` read the committed snapshots and the test asserted
`npc.sha256_verified === true` against whatever the last live fetch left behind.
It failed on a clean checkout of `main` the moment that government host went
down — a flaky test that reported a code problem when the real cause was an
external outage, and would equally have passed a genuine regression.

**Fixed.** `buildSignalDigest(referenceDate, signalsDir)` now accepts an injected
directory. `tests/market-signals.test.mjs` uses fixtures and covers: hash
verification, `ERROR` reporting, `STALE` reclassification past the threshold,
and **tamper detection** (a snapshot changed after its hash was recorded must
fail verification).

## 7. Negative staleness ages

**Gap.** `daysBetweenIso()` returned a negative number when a snapshot was
timestamped later than the reference date — observed as `age_days: -7` in the
generated dashboard after a weekly fetch. A negative age defeats staleness
checks entirely.

**Fixed.** Clamped at `Math.max(0, …)`. `age_days: 0` now means "not yet aged".

## Verification

```
npm test    → 30/30 passing (was 14, one of them failing)
npm run verify
  ├─ 74  static security, CSP & privacy checks
  ├─ 359 public portfolio routing & parity checks
  ├─ 16  repository inventory reconciliation checks
  ├─ 3   market-signal integrity & digest checks
  ├─ 7   portfolio operations & dashboard checks
  ├─ 6   JSON schemas, 17/17 records
  └─ record contract: 32 required fields, intake contract: 8 required fields
```

Artifact check: `30` files staged, zero private-path leaks, `9` public HTML pages.
`npm run generate` is idempotent — no drift on regeneration.

## Deliberately not done

- **No history rewrite.** `docs/evidence/SECURITY-AND-SECRETS-AUDIT-2026-11-09.md`
  documents the 14 historical paths and a `git-filter-repo` runbook, but rewriting
  published history is an owner decision with irreversible consequences.
- **No analytics tag.** `docs/ANALYTICS-REFERLY-INTEGRATION.md` requires a
  Measurement ID from the owner; no placeholder `G-` id was invented.
- **No new content claims.** No testimonials, certifications, client names,
  revenue figures or partnership claims were added.
