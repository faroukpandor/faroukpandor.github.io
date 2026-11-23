# Portfolio Audit Handover Addendum — 19 November 2026

**Status:** Evidence-backed audit addendum; repository-level classification remains in progress.  
**Canonical portfolio repository:** `faroukpandor/faroukpandor.github.io`  
**Purpose:** Preserve the latest repository-count reconciliation, current MOKORO security verification, ownership boundaries and connector handover so work can resume without relying on chat history.

> This addendum does not replace the full repository inventory or certify ownership, intellectual-property title, licences, security, deployment, product readiness, customer validation or revenue. It records what was actually checked and what remains unresolved.

## 1. Repository count reconciliation

### Current snapshot — VERIFIED

As of the 19 November 2026 audit pass:

- GitHub owner search returned **289 unique repositories** under `faroukpandor`.
- Visibility in that snapshot: **42 public and 247 private**.
- A separate GitHub installation index returned **291 entries**. Of these, 289 belong to `faroukpandor`; two entries belong to separate GitHub owners and are excluded from the account-owned total. Push access to another owner's repository is not proof of ownership or administrative control.
- The previous canonical `data/repository-inventory.json` was generated on 9 November 2026 and contains **116 entries**.
- After reconciling known aliases/renames, the current snapshot contains **173 net additional repository names** not represented in the old register.

### Alias and identity reconciliation

- `Publii` is an old name/alias resolving to the current `fpcc` repository; do not count it as a separate current product.
- `PipTick` resolves to `piptick`; do not count both as separate products.
- `MOKORO-ENTERPRISE-OS` and `MOKORO-ENTEPRISE-OS` are distinct repositories despite the spelling similarity. Their purpose and technical architecture differ; do not merge or silently treat one as an alias of the other.

### Limitations

This is a current owner-search count, not a complete legal/IP ownership audit, collaborator inventory, organisation inventory or product-readiness assessment. The old 287-count exports are superseded. Any inventory generated from the earlier 287 snapshot must be regenerated before being treated as current.

## 2. Portfolio classification corrections and known boundaries

The following are evidence-backed working classifications, not blanket ownership certifications:

| Asset / group | Current working classification | Required treatment |
|---|---|---|
| `faroukpandor.github.io` | Portfolio presentation and relationship-register control point | Keep public discovery separate from private operational data |
| `fpcc` | Farouk Pandor Command Centre | Current FPCC identity; `Publii` is an alias/old name |
| `MOKORO-ENTERPRISE-OS` | Group governance / enterprise operating-system repository | Separate from client-facing MOKORO DGE; security controls remain under verification |
| `MOKORO-ENTEPRISE-OS` | Separate back-office application prototype | Keep separate; README cautions against using local mode with real data |
| `FAROUKPANDOR-AXIOM` | Purpose not yet established as an authoritative portfolio control system | README resembles a generic Google AI Studio starter; inspect source and governance before relying on it |
| `NEXUS-WORKSPACE` | Legacy prototype per README | Do not treat as the active workspace without further evidence |
| Research and biodiversity repositories | Research assets / organism dossiers, maturity varies | Do not infer endemicity, rarity, conservation status or microbial coverage from repository names alone |
| `YELLOW-BLUE-CARGO`, `WCD`, `identity-concept` | Client or third-party business boundaries | No changes, deployments, policy changes or reuse without the appropriate owner's approval |
| `GK-DESIGNS` and other partner businesses | Partner boundary unless ownership evidence says otherwise | Record the partner's IP and decision authority; GitHub access is not ownership |
| Remaining unclassified repositories | Unknown / pending evidence | Inspect README, source, licence, fork status, activity, deployment and owner authority before assigning a product role |

A README is evidence of a repository's stated purpose, not proof that the described product works, is deployed, is compliant, has customers or earns revenue. Generic AI Studio starter templates must not be counted as separate functioning products without source-level differentiation.

## 3. MOKORO EOS security re-verification — 19 November 2026

### Current anonymous request results

Read-only HEAD and GET requests were made to:

- `https://mokoro-eos.pages.dev/os/`
- `https://mokoro-eos.pages.dev/os/books/`
- `https://mokoro-eos.pages.dev/os/hire/`

All six requests returned **HTTP 403**. The three GET responses were short generic denial responses; the known incident-specific sensitive markers were not present. No confidential response content or business figures are reproduced in this addendum.

**Interpretation:** the previous cached-content exposure was not reproduced in this test. Anonymous access is currently denied at those three paths from the test environment. A 403 response alone does not prove Cloudflare Access is the control responsible.

### Cloudflare control-plane evidence

- Pages project `mokoro-eos` is connected to `faroukpandor/MOKORO-ENTERPRISE-OS`, with `main` as the production branch.
- Pages project metadata lists `mokoro-eos.pages.dev` as its configured hostname.
- The Cloudflare account-level Access application list returned **zero applications**. No matching account-level Access application is evidenced by this check.
- Canonical production deployment `da2e2727-7ef0-4a54-9b35-fa7c74f6a576` was created 12 November 2026; build and deployment succeeded on commit `4cb77d148fa74a0dbfa98ce9b129493e2be3dcda`.
- The latest deployment record is a preview deployment, not production: `0129e43f-410c-4f8d-9867-ad26893e1873`, created 16 November 2026 from `strategy/conversational-market-landscape-20261116`. Its build failed and its deploy stage remained idle. This does not establish that production is failing.
- Cloudflare account metadata reports account-level `enforce_twofactor=false`. The account owner should review MFA enforcement and recovery controls.

### Outstanding security acceptance gates

- Identify and document the exact control producing the 403 (Access policy, Worker/routing rule, static-build exclusion or another edge control).
- Verify the same paths on preview deployment URLs and any future custom domains.
- Confirm authenticated founder access, MFA and account recovery without risking lockout.
- Inspect other private routes and stale deployment aliases for exposure.
- Keep real founder/customer records out of static bundles, preview deployments and browser-only unprotected persistence until the protection model is independently demonstrated.

**No cache purge, Access policy change, deployment, DNS change or repository-content change was performed during the security re-check.**

## 4. Connector and issue handover

The GitHub connector is the durable source of truth for this audit. The following handover comments were successfully recorded:

- [MOKORO EOS issue #108 — P0 private-route security](https://github.com/faroukpandor/MOKORO-ENTERPRISE-OS/issues/108): current anonymous 403 checks, Access-app count, deployment state and remaining acceptance gates.
- [Portfolio issue #148 — repository reconciliation](https://github.com/faroukpandor/faroukpandor.github.io/issues/148): updated 289 count, visibility split, alias reconciliation and classification limits.
- [Portfolio issue #115 — Stage 0 source/deployment/ownership audit](https://github.com/faroukpandor/faroukpandor.github.io/issues/115): updated source baseline and next audit sequence.

Cloudflare was used read-only for account and Pages metadata and the anonymous HTTP checks. No Cloudflare settings were changed.

Todoist was inspected to avoid creating duplicate or competing tasks. It already contains an unrelated P1 immediate task in the Inbox; no new Todoist task was added. No email, Slack message, client communication or third-party notification was sent. No client or partner connector was modified.

## 5. Next work sequence

Keep the work in small, resumable stages:

1. **Immediate security follow-through:** identify the exact reason for the current 403 and test authenticated access/recovery. Do not purge cache or change Access settings until the owner has reviewed the exact proposed action and lockout risk.
2. Complete repository purpose, ownership, fork, licence, activity, duplicate and deployment classification in manageable batches.
3. Regenerate `data/repository-inventory.json` and companion Markdown/CSV outputs from a complete, paginated current source. Preserve provenance and distinguish unknowns from verified facts.
4. Reconcile `docs/REPOSITORY-RELATIONSHIP-REGISTRY.md`, public-project listings and handover documentation only after the new inventory has passed validation.
5. Maintain explicit client/partner approval gates. Do not reuse client code, credentials, data, branding or deployment access without written authorization.

## 6. Evidence labels

- **VERIFIED:** directly checked in GitHub or Cloudflare during this audit.
- **USER-PROVIDED:** supplied in prior project context; not independently verified here.
- **INFERRED:** a working interpretation based on available evidence; must not be represented as fact.
- **UNVERIFIED:** insufficient evidence; keep classification open.

## 7. Change log

| Date | Change |
|---|---|
| 2026-11-19 | Reconciled owner-search count to 289; recorded 42 public / 247 private; documented 291 installation-index entries including two external-owner repositories; resolved known aliases; recorded current MOKORO anonymous-route checks and deployment metadata; updated GitHub issues #108, #148 and #115. |
| 2026-11-19 | Created this addendum on a separate documentation branch for review. No production settings, client systems or deployments were changed. |
