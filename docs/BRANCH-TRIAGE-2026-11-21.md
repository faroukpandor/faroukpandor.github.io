# Portfolio-wide GitHub Branch Triage — 21 November 2026

**Scope:** 289 repositories owned by the `faroukpandor` GitHub account; branch references and open pull requests enumerated read-only.  
**Canonical evidence index:** [branch-triage-index.json](./branch-audit/2026-11-21/branch-triage-index.json)  
**Open PR register:** [open-pull-requests.json](./branch-audit/2026-11-21/open-pull-requests.json)  
**Fork register:** [verified-fork-register.json](./branch-audit/2026-11-21/verified-fork-register.json)

> This is a first-pass branch inventory and routing triage, not a branch deletion, merge, full code review or legal ownership audit. An unlinked branch is a non-default branch with no currently open PR; it is not automatically stale, abandoned, safe to delete or safe to merge.

## 1. Executive result

| Measure | Verified count |
|---|---:|
| Account-owned repositories enumerated | **289** |
| Branch references enumerated | **2,251** |
| Repositories identified by GitHub as forks | **36** |
| Branch references inside those upstream forks | **1,124** |
| Non-fork account repositories | **253** |
| Branch references in non-fork repositories | **1,127** |
| Default branches in non-fork repositories | **253** |
| Open pull requests | **182** |
| Draft pull requests | **131** |
| Ready-for-review pull requests | **51** |
| Repositories with open PRs | **47** |
| Non-default, non-fork branches without an open PR | **692** |

All 182 open PR head branches matched an existing branch reference in the inventory. No open PR was found in the 36 repositories classified by GitHub as forks.

The 2,251 total includes upstream branches in forks. For first-party work prioritisation, the more useful baseline is **1,127 branch references across 253 non-fork repositories**. This is still not a legal ownership determination: non-fork repositories include client and partner repositories.

### Branch classification

| Classification | Count | Meaning |
|---|---:|---|
| Upstream-fork branch | 1,124 | Branch reference in a repository GitHub identifies as a fork |
| Default branch | 253 | One default branch for each non-fork account repository |
| Open-PR branch | 182 | Branch is the head of a currently open PR |
| Unlinked non-default branch | 692 | Non-default, non-fork branch with no currently open PR |

The 692 unlinked branches are a review queue, not a deletion queue. Their commit dates, differences from the default branch, merged ancestry, deployment use and owner intent still need to be checked before disposition.

## 2. Verified upstream forks — separate from original work

GitHub search using the `fork:only` qualifier identified **36 fork repositories**. Together they account for **1,124 of the 2,251 branch references**.

Largest fork branch collections:

| Fork | Branch references |
|---|---:|
| `openclaw` | 743 |
| `equifix-tina-cloud-starter` | 116 |
| `rea` | 104 |
| `hummingbot` | 48 |
| `pwa-starter` | 22 |
| `opensourcepos` | 15 |
| `faroukpandor` | 11 |
| `jenetics` | 9 |
| `next-on-pages` | 9 |
| `bolt.diy` | 7 |

The `openclaw` repository is a verified fork of `openclaw/openclaw`; its 743 branches are upstream branch references, not 743 original Farouk workstreams. `equifix-tina-cloud-starter`, `rea`, `hummingbot`, `pwa-starter`, `opensourcepos`, `jenetics` and `odoo` are also verified forks.

**Disposition:** retain forks only where they serve a documented purpose. Audit local commits and required upstream contributions separately. Do not merge upstream branch refs into the founder's product backlog or treat fork volume as original product output.

The full 36-repository list and per-repository branch counts are in `verified-fork-register.json`.

## 3. Open pull requests — concentration and ageing

| Repository | Open PRs | Draft | Ready |
|---|---:|---:|---:|
| `MOKORO---Digital-Growth-Engine` | 26 | 23 | 3 |
| `AGRISAGE` | 23 | 18 | 5 |
| `YELLOW-BLUE-CARGO` | 18 | 12 | 6 |
| `EVERYTHINGCITY` | 12 | 7 | 5 |
| `WCD` | 12 | 9 | 3 |
| `MOKORO-ENTERPRISE-OS` | 11 | 9 | 2 |
| `Nurture` | 5 | 1 | 4 |
| `GK-DESIGNS` | 4 | 3 | 1 |
| `fpcc` | 4 | 1 | 3 |
| `piptick` | 4 | 3 | 1 |
| `identity-concept` | 4 | 4 | 0 |
| `AGRISOLUTIONS` | 4 | 3 | 1 |
| `BRANDCRAFT-ALCHEMIST` | 4 | 2 | 2 |
| `faroukpandor.github.io` | 3 | 2 | 1 |
| `PANDOR-ESTATES` | 3 | 3 | 0 |

Across all 182 open PRs:
- **121** were last updated before 10 November 2026.
- **101** were last updated before 7 November 2026.
- Of the PRs last updated before 10 November, **96 are drafts and 25 are ready for review**.

A ready-for-review state is not proof of passing CI, conflict-free status, client approval or permission to merge. Mergeability and CI were checked only for selected PRs in this pass.

## 4. Selected repository branch queues

The counts below exclude fork branches. “Unlinked” means no open PR and excludes the default branch.

| Repository | Non-fork branches | Open PRs | Unlinked non-default branches | Notes |
|---|---:|---:|---:|---|
| MOKORO DGE | 105 | 26 | 78 | Largest first-party commercial work queue |
| Portfolio site | 100 | 3 | 96 | Many historical research, bioresource and opportunity branches |
| AGRISAGE | 81 | 23 | 57 | Agricultural product, research and quality work |
| MOKORO EOS | 71 | 11 | 59 | Governance, security, commercialisation and ERP work |
| Yellow Blue Cargo | 63 | 18 | 44 | Client-owned; 33 unlinked branches use `arena/` |
| Pandor Estates | 56 | 3 | 52 | Large property evidence and recurring-service feature families |
| EverythingCity | 41 | 12 | 28 | Commerce, sourcing and service-provider work |
| WCD | 40 | 12 | 27 | Client-owned; 12 unlinked branches use `arena/` |
| Research Exchange | 24 | 0 | 23 | Reconcile scope with Global Research Exchange |
| FPCC | 23 | 4 | 18 | Default branch is `master`; PRs target `master` |
| BFLD | 21 | 0 | 20 | All 20 unlinked branches are `arena/` branches |
| Nurture | 19 | 5 | 13 | 13 unlinked branches use `arena/` |
| AGRISOLUTIONS | 17 | 4 | 12 | Keep distinct from AGRISAGE and MOKORO Agri |
| Timbuktu Forensics | 15 | 1 | 13 | Verify branch purpose and relation to SCPA |
| GK Designs | 8 | 4 | 3 | Partner-owned boundary; stacked PRs need ordered review |
| identity-concept | 10 | 4 | 5 | Shaffi Pandor's client/business boundary |

### Branch-name pattern

Across non-fork repositories, `arena/` is the largest branch family: 225 refs. Of these, **198 are not currently the head of an open PR**. The full account-wide listing contains 232 `arena/` branches, with the remainder in forks.

Other notable non-fork unlinked prefixes include `feat/` (73), `docs/` (62), `fix/` (47), `research/` (30), `strategy/` (24), `security/` (20), `feature/` (16), and `audit/` (12).

These labels indicate naming conventions only. A `fix/` branch is not necessarily a valid fix, and a `docs/` branch is not necessarily obsolete. The next pass must inspect branch tips and diffs.

## 5. Client and partner safeguards

The following repositories contain **38 open PRs** in total and must remain in a separate approval lane:

- `YELLOW-BLUE-CARGO`: 18 open PRs (12 draft, 6 ready).
- `WCD`: 12 open PRs (9 draft, 3 ready).
- `identity-concept`: 4 open PRs (all draft).
- `GK-DESIGNS`: 4 open PRs (3 draft, 1 ready).

No PR was merged, closed, edited or approved in these repositories during this audit. No client branch was deleted or changed.

### Specific review notes

- **Yellow Blue Cargo:** open security work includes admin-session primitives, preview-storage isolation, dependency remediation and session reconciliation. These are client-controlled changes; obtain client approval before implementation or deployment.
- **WCD:** PR #38 is ready for review but is not mergeable and its Firestore Emulator rules test failed. The failing job reports a Firestore rules subtest with `PERMISSION_DENIED` around rules lines 293, 295 and 319. Other setup, unit tests and frontend/server build steps passed. Do not merge.
- **GK Designs:** PR #2 (“Ship current GK Designs site onto main”) is ready and marked mergeable, but it changes 261 files (+15,037 / −1,455) over 22 commits. PRs #3 and #5 are based on the same `arena/01a0234a-gk-designs` branch used as PR #2's head, so they appear to form a stacked sequence. Review #2 first, then review dependent work; obtain the business owner's approval before any merge or deployment.
- **identity-concept:** all four open PRs are drafts. Preserve Shaffi's ownership and decision authority.

## 6. Selected founder-work PR checks

| Repository / PR | Current evidence | Triage |
|---|---|---|
| AGRISAGE #99 | Ready; mergeable; 4/4 reported checks succeeded; 84 commits, 21 files, +1,777 / −52 | Strong review candidate, but inspect the full diff and August branch history before any merge |
| Portfolio #160 | Ready; mergeable; tests/offline verification succeeded; one review check skipped | Review diff and confirm intended scope before merge |
| EverythingCity #48 | Ready; mergeable; Cloudflare Pages and Vercel preview checks succeeded | Review vendor/source handling and user-facing claims before merge |
| FPCC #22 | Ready; mergeable; only one Cloudflare Pages check was returned | Insufficient test evidence for a sync/auth change; the existing FPCC specification says Phase 2 must not start without owner approval |
| MOKORO DGE #138 | Ready; not mergeable; two test jobs failed | Do not merge until the competitive-claims/route-truth assertion is reconciled and checks pass |
| WCD #38 | Ready; not mergeable; Firestore Emulator rules test failed | Client review and rules/test reconciliation required |
| GK Designs #2 | Ready; mergeable; Cloudflare Pages check succeeded | Client/partner approval required; large 261-file change set |

### Failed checks investigated

**MOKORO DGE #138**
- TypeScript and most regression suites passed.
- The competitive-claims/route-truth test failed on the assertion: `tswanadomains section states what we will not do`.
- A second specification/safety job failed on the same assertion; later build stages were skipped.
- The PR is not mergeable. Fix the mismatch between the documented claim boundary and the test expectation only after confirming the intended commercial/legal position.

**WCD #38**
- Standard npm tests, frontend/server build and Java/emulator prerequisites passed.
- The Firestore Emulator rules test failed one subtest. Logs report write `PERMISSION_DENIED` and evaluation failures around rules lines 293, 295 and 319.
- The PR is not mergeable. Keep this in the client approval lane.

## 7. Stacked and dependent PRs

- **MOKORO DGE:** PR #58 is based on the branch used by PR #57. Review the base PR before its dependent PR; do not treat them as independent merge candidates.
- **GK Designs:** PR #3 and PR #5 target the branch used by PR #2. Review the base PR first and preserve partner approval.
- Other branches may contain dependencies that are not evident from names alone; compare base/head histories before changing PR targets or merging.

## 8. Branch protection and governance caveat

The branch-list response marked only one branch as protected: `medical-center/preview`, which is inside an upstream fork. No branch in the 253 non-fork repositories was returned with `protected=true`.

However, direct branch-protection endpoint requests for sampled first-party repositories returned HTTP 403 (“Resource not accessible by integration”). Repository rulesets and branch-protection settings therefore remain **unverified**, not proven absent.

**Owner follow-up:** inspect branch protection and repository rulesets in GitHub settings for the canonical first-party repositories, beginning with the portfolio control point, FPCC, MOKORO EOS, MOKORO DGE and AGRISAGE. Do not change protections until existing workflows and collaborators have been reviewed.

## 9. Recommended disposition and work sequence

1. **Preserve all client/partner boundaries.** No merges, branch deletions or deployment actions in Yellow Blue Cargo, WCD, identity-concept or GK Designs without the respective owner's approval.
2. **Review high-value green founder PRs:** AGRISAGE #99, Portfolio #160 and EverythingCity #48. Review complete diffs and branch ancestry; do not merge merely because CI passed.
3. **Resolve failed founder PR checks:** MOKORO DGE #138. Keep WCD #38 with the client until the Firestore rules failure is understood.
4. **Consolidate MOKORO DGE / MOKORO EOS / AGRISAGE branch families:** identify duplicate commercialisation, buyer-requirement, opportunity-routing, security and CI work before choosing canonical branches.
5. **Reconcile the portfolio and PANDOR ESTATES backlogs:** many branches are historical research or alternative feature designs. Compare branch tips with default branches and identify already-merged work before disposition.
6. **Review the 198 unlinked non-fork `arena/` branches first as a generated-branch cohort.** Confirm last commit, ancestry and whether a preview or PR references each branch before proposing deletion.
7. **Inspect all remaining 692 unlinked non-default non-fork branches** in priority batches, recording last commit date, ahead/behind counts, unique files, PR/deployment references and recommended action.
8. **Keep forks separate:** document why each fork is retained, whether local commits exist, and whether an upstream PR or clean replacement is appropriate.

## 10. Evidence and limitations

- **VERIFIED:** repository and branch listings, branch-tip SHAs, GitHub fork search results, open PR list and selected PR/check-run/log results returned during this audit.
- **INFERRED:** possible branch families or stacked work based on branch names and PR base/head relationships. Confirm by commit comparison.
- **UNVERIFIED:** branch age for all 692 unlinked branches, full ahead/behind relationships, deployment usage, repo rulesets, branch protection settings, legal ownership and client permission.
- GitHub branch enumeration was read-only. No branch was deleted, renamed, merged or pushed. No PR was approved, merged, closed or retargeted. No deployment, cache purge, client system or Cloudflare setting was changed.

## 11. Supporting machine-readable evidence

- `branch-audit/2026-11-21/branch-triage-index.json` — all 2,251 branch refs with repository, tip SHA, protected flag, default branch, fork status, open PR link and first-pass classification.
- `branch-audit/2026-11-21/verified-fork-register.json` — 36 fork repositories and branch counts.
- `branch-audit/2026-11-21/open-pull-requests.json` — all 182 open PR search results.
- `branch-audit/2026-11-21/open-pr-branches-01.json` through `open-pr-branches-03.json` — PR head/base branch mapping and selected PR metadata.
- `branch-audit/2026-11-21/batch-01.json` through `batch-18.json` — per-batch raw branch listing evidence.
- `branch-audit/2026-11-21/overflow-page-2.json` and `openclaw-overflow-pages-03-08.json` — paginated branch records beyond the first 100 entries.

**Change record:** 21 November 2026 — complete first-pass branch enumeration and open-PR mapping for all 289 account-owned repositories. Read-only audit only.
