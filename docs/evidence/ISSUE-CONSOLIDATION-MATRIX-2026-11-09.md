# Issue Consolidation Matrix — `faroukpandor/faroukpandor.github.io` (2026-11-09)

**Baseline inspected:** 57 open GitHub issues (`#67`–`#148`) retrieved live via `gh issue list --state open --limit 100`.
**Goal (`BACKLOG-001`):** Collapse fragmented/duplicate/completed issues from 57 down to a clean, enforceable backlog (12 canonical open tracks, or 9 once `#93`/`#94`/`#114` fold cleanly into `#91`/`#95`/`#115`) without executing irreversible closes behind the owner's back.

---

## Summary Counts

| Action Category | Issue Count | Issues | Rationale |
|---|---:|---|---|
| **A. Close after PR merge (Delivered on current branch)** | 3 | `#68`, `#125`, `#148` | Directly implemented by Stage 1/2 portfolio architecture, `demand-router.mjs`, `portfolio-control.html`, and verified 116-repo/17-queue reconciliation. (`#85` closes once Section 3 history purge + 4 private repo audits complete.) |
| **B. Close after owner history purge + private repo checks** | 1 | `#85` | Working-tree/CI/CSP audit & fixes complete (`scripts/security-audit.mjs`); keep tracked strictly until owner executes remote `git-filter-repo` purge of `314b95b`/`42a4477` + 4 `403` private repos. |
| **C. Close 20 Redundant Sub-Issues & Exact Duplicates** | 20 | `#96`–`#113` (18 sub-issues of `#95`), `#92` (dup of `#91`), `#117` (dup of `#116`) | `#96`–`#113` are Task 028.01–028.18 micro-tasks under `#95`; `#91`/`#92` are both Task 025 OpenCare HIV; `#116`/`#117` are both Task 031 customer discovery. |
| **D. Close as Superseded / Folded R&D Evaluations (`#70`–`#90`)** | 18 | `#70`, `#71`, `#72`, `#73`, `#74`, `#75`, `#76`, `#77`, `#78`, `#80`, `#81`, `#82`, `#83`, `#84`, `#87`, `#88`, `#89`, `#90` | Strategy/governance/continuity (`#71`–`#77`) are already delivered in `docs/` + `README.md`; tooling/AI-model/pen-test R&D notes (`#70`, `#78`, `#80`–`#84`, `#87`–`#90`) fold under `#95` / `#114` / `#118`. |
| **E. Merge into Canonical Parent Tracks** | 3 | `#93` (→ `#91`), `#94` (→ `#95` / `portfolio-control.html`), `#114` (→ `#95` / `#115`) | Overlap directly with `#91`, `#95`, and `#115`. |
| **F. Keep Open — Canonical Active Execution Backlog** | 12 | `#67`, `#69`, `#79`, `#91`, `#95`, `#115`, `#116`, `#118`, `#130`, `#131`, `#132`, `#136` | Genuine ongoing execution tracks requiring live user telemetry, external partners, or private-repo work. |

*(Exact verified total: `3 + 1 + 20 + 18 + 3 + 12 = 57` issues — matching 100% of live open issues `#67`–`#148` below.)*

---

## Complete 57-Issue Mapping (`#67`–`#148`)

| Issue # | Title | Proposed Action | Target / Evidence |
|---:|---|---|---|
| `#67` | P0: Build measurable WhatsApp → website → lead acquisition pipeline | **KEEP OPEN** | Needs owner live domain verification & WhatsApp CTA telemetry after deployment. |
| `#68` | P1: Add AI qualification, routing and commercial response layer | **CLOSE ON MERGE** | Delivered by `assets/js/demand-router.mjs`, `index.html`, `sourcing-economics.html`, and `portfolio-ops.mjs`. |
| `#69` | P2: Build self-marketing flywheel from market signals → content → enquiries | **KEEP OPEN** | Weekly digest pipeline live offline (`scripts/market-signals.mjs`); keep open until `.github/workflows/market-signal-monitor.yml` auto-generates digest PRs & outreach loop. |
| `#70` | Collective: assess Jeton dashboard, eligibility and payment-rail fit | **CONSOLIDATE → CLOSE** | Fold payment-rail note into `docs/PRODUCTION-READINESS-CHECKLIST.md` / `#114`; non-blocking exploratory check. |
| `#71` | Portfolio strategy: document AI-enabled service-business transformation model and cross-repository roles | **CONSOLIDATE → CLOSE** | Documented in `docs/REPOSITORY-RELATIONSHIP-REGISTRY.md` & `README.md`. |
| `#72` | Portfolio opportunity: affordable digital safety and privacy services for SMEs and individuals | **CONSOLIDATE → CLOSE** | Track active commercial delivery under `#118` + `website-health-check.html`. |
| `#73` | Task 008: Present a unified AI voice, visual storytelling and business-asset proposition | **CONSOLIDATE → CLOSE** | Covered in `index.html` / `portfolio.html` capability matrix. |
| `#74` | Task 009: Document the portfolio's accountable AI operations and governance model | **CONSOLIDATE → CLOSE** | Documented in `docs/` & `scripts/security-audit.mjs` + `professional-record.html`. |
| `#75` | Task 010: Present automation and integration services with measurable business outcomes | **CONSOLIDATE → CLOSE** | Presented across `index.html`, `portfolio.html`, and `sourcing-economics.html`. |
| `#76` | Task 011: Document a free-first, portable and resilient digital operating model | **CONSOLIDATE → CLOSE** | Implemented (zero third-party runtime JS, zero DB hosting dependency, portable JSON/CSV schemas). |
| `#77` | Task 012: Document portfolio-wide free-first continuity and fallback standards | **CONSOLIDATE → CLOSE** | Implemented with `#76` in `templates/SCHEMAS/` & static offline scripts. |
| `#78` | Task 013: Register learning-app competitor and prioritize Tasks 001–013 | **CONSOLIDATE → CLOSE** | Learning apps registered in `docs/OWNERSHIP-STATUS-REGISTER.md`; execution consolidated into `#95`/`#114`. |
| `#79` | Khaie OS — Smooth Rider pilot and production-readiness gates | **KEEP OPEN** | Active cross-repo pilot & post-Oct-30 Supabase grant verification (`GH-79`). |
| `#80` | Task 015: Evaluate an MCP Factory app — validate one secure connector first | **CONSOLIDATE → CLOSE** | Non-urgent R&D evaluation; fold under `#114` / `#118` backlog. |
| `#81` | Task 016: Assess PostHog, Perplexity, Playwright and Composio connectors | **CONSOLIDATE → CLOSE** | Non-urgent tooling comparison; fold under `#114`. |
| `#82` | Task 017: Evaluate Google AI Edge and Gemma for offline-first AI | **CONSOLIDATE → CLOSE** | Fold alongside `#83` under `#114` AI R&D notes. |
| `#83` | Task 018: Test quantised Gemma E2B for low-resource offline AI | **CONSOLIDATE → CLOSE** | Duplicate/continuation of `#82`. |
| `#84` | Task 019: Free-first AI API keys, provider routing and fallbacks | **CONSOLIDATE → CLOSE** | Fold into `#114`; free-first client tools live offline with zero API keys required. |
| `#85` | Task 020: Audit GitHub for sensitive data, remediate exposures, harden .gitignore | **CLOSE AFTER HISTORY PURGE** | Static repo/CI/CSP audit & fixes complete (`scripts/security-audit.mjs`, `docs/evidence/SECURITY-AND-SECRETS-AUDIT-2026-11-09.md`); keep open or close with follow-up note strictly for owner `git-filter-repo` purge of `314b95b`/`42a4477` + 4 private `GH-85` repos. |
| `#87` | Task 021: Local QA Reviewer app for web, desktop and phone | **CONSOLIDATE → CLOSE** | Track under `#95` (Task 028.06) / `#114`. |
| `#88` | Task 022: Healthcare-focused Local QA Reviewer for web, desktop and phone | **CONSOLIDATE → CLOSE** | Track under `#95` (Task 028.17) / `#114`. |
| `#89` | Task 023: Home health services provider enterprise and app | **CONSOLIDATE → CLOSE** | Track under `#95` (Task 028.10) / `#114`. |
| `#90` | Task 024: AI Penetration Tester — build an evidence-led, safe competitor | **CONSOLIDATE → CLOSE** | Fold active security commercial/service work under `#118`. |
| `#91` | Task 025: HIV Care Continuity, Prevention & Research Platform (Botswana-first) | **KEEP OPEN (PARENT)** | Canonical parent for OpenCare HIV product & grant readiness (absorbs `#92` & `#93`). |
| `#92` | Task 025 — OpenCare HIV: person-centred HIV prevention, treatment, continuity and research ecosystem | **CLOSE AS DUPLICATE** | Exact duplicate of `#91`. |
| `#93` | Task 026 — Make OpenCare HIV grant-ready and align with eligible Botswana funding routes | **MERGE INTO `#91`** | Sub-deliverable of `#91` (keep open only if tracked separately for grant timeline). |
| `#94` | Task 027 — Ranked app portfolio for fundable impact projects and recurring revenue | **MERGE INTO `#95` / `#125`** | Portfolio ranking live in `FPCC` Google Sheet + `portfolio-control.html` (`GH-94`). |
| `#95` | Task 028 — Deliver all 18 apps: audit, build or upgrade, validate and monetize | **KEEP OPEN (PARENT)** | Canonical 18-app product portfolio umbrella (absorbs `#96`–`#113` as checklist items). |
| `#96` | Task 028.01 — SME Website Care + Local QA Monitor | **CLOSE → CHECKLIST UNDER `#95`** | Tracked via `website-health-check.html` & `#95`. |
| `#97` | Task 028.02 — Tender & Supplier Readiness Workspace | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#98` | Task 028.03 — Clothing & Embroidery Production OS Lite | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#99` | Task 028.04 — AgriSage360 Focused Farm Operations | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#100` | Task 028.05 — OpenCare HIV Continuity of Care | **CLOSE → CHECKLIST UNDER `#95` / `#91`** | Covered by `#91`. |
| `#101` | Task 028.06 — Local QA Reviewer | **CLOSE → CHECKLIST UNDER `#95`** | Covered by `#95` (dup `#87`). |
| `#102` | Task 028.07 — AI-Assisted Security Assessment Workbench | **CLOSE → CHECKLIST UNDER `#95` / `#118`** | Covered by `#118`. |
| `#103` | Task 028.08 — Offline Digital Learning & Skills PWA | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#104` | Task 028.09 — SME SEO & Digital Growth OS | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#105` | Task 028.10 — HomeCare Coordination | **CLOSE → CHECKLIST UNDER `#95`** | Covered by `#95` (dup `#89`). |
| `#106` | Task 028.11 — Poultry Outgrower Matching & Operations | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#107` | Task 028.12 — Livestock Health Referral & Farm Records | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#108` | Task 028.13 — Supplier Compliance & Document Vault | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#109` | Task 028.14 — Local Business Directory & Lead Exchange | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#110` | Task 028.15 — Grant & Funding Readiness Workspace | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#111` | Task 028.16 — Community Climate & Agriculture Resilience Monitor | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#112` | Task 028.17 — Healthcare Software QA & Compliance Workbench | **CLOSE → CHECKLIST UNDER `#95`** | Covered by `#95` (dup `#88`). |
| `#113` | Task 028.18 — Ethical Reviews & Consumer Trust Platform | **CLOSE → CHECKLIST UNDER `#95`** | Sub-item of `#95`. |
| `#114` | Task 029 — Ultimate competitor-app portfolio, repository audit and creation roadmap | **MERGE INTO `#95` / `#115`** | Master roadmap now captured in `docs/OWNERSHIP-STATUS-REGISTER.md` + `docs/REPOSITORY-RELATIONSHIP-REGISTRY.md`. |
| `#115` | Task 030 — Continue Stage 0: source, deployment, ownership and duplicate audit | **KEEP OPEN** | Needed until 4 private `GH-85` repos + 6 `GBOIF` private repos are audited from an authenticated owner token. |
| `#116` | Task 031 — Market research and primary customer evidence sprint for app portfolio | **KEEP OPEN (PARENT)** | Canonical primary customer discovery parent (absorbs `#117`). |
| `#117` | Task 031 — Run first-hand customer discovery before building apps | **CLOSE AS DUPLICATE** | Duplicate of `#116`. |
| `#118` | Portfolio opportunity: Botswana-owned cyber resilience and technology assurance | **KEEP OPEN** | Active commercial/assurance track (`OpenCast` PR #1 + `website-health-check.html`). |
| `#125` | Task 032 — Convert the digital-asset portfolio into an income-first execution backlog | **CLOSE ON MERGE (TRACK VIA `portfolio-control.html` & `FPCC`)** | Stage 1/2 execution backlog & 17-item queue shipped; ongoing task prioritisation lives in `FPCC` + `portfolio-control.html`. |
| `#130` | Run the Self-Reliance Field Guide customer-validation sprint | **KEEP OPEN** | Active customer-validation sprint (`GH-130`). |
| `#131` | Assess and pilot locally accessible organic assurance and certification in Botswana | **KEEP OPEN** | Active research/pilot track (`GH-131`). |
| `#132` | Define and validate the automated buyer–producer discovery, matching and orchestration platform | **KEEP OPEN** | Active platform validation track (`GH-132`). |
| `#136` | Engineering action: prepare for Supabase Data API grant change (30 Oct 2026) | **KEEP OPEN UNTIL REPO-WIDE CHECK** | Static `faroukpandor.github.io` confirmed N/A; keep open until private Supabase-linked repos (`MOKORO*`, `Khaie OS`) are verified. |
| `#148` | P0: Reconcile public portfolio against 100 GitHub repositories and verified customer-ready offerings | **CLOSE ON MERGE** | Delivered (`116` repos reconciled in `docs/OWNERSHIP-STATUS-REGISTER.md`, `docs/REPOSITORY-RELATIONSHIP-REGISTRY.md`, and `data/repository-inventory.json`). |

---

## Owner-Executable Batch Commands (Do Not Auto-Run Until PR Merges & Owner Approves)

```bash
# 1. Close duplicate issues (immediate zero-loss cleanup)
gh issue close 92 --repo faroukpandor/faroukpandor.github.io --comment "Duplicate of #91 (consolidated under ISSUE-CONSOLIDATION-MATRIX-2026-11-09)."
gh issue close 117 --repo faroukpandor/faroukpandor.github.io --comment "Duplicate of #116 (consolidated under ISSUE-CONSOLIDATION-MATRIX-2026-11-09)."

# 2. Roll Task 028.01-028.18 micro-tickets back into parent #95
for n in $(seq 96 113); do
  gh issue close "$n" --repo faroukpandor/faroukpandor.github.io --comment "Tracked as a sub-item under #95 per ISSUE-CONSOLIDATION-MATRIX-2026-11-09."
done

# 3. After merging the current branch to main, close delivered tracks:
gh issue close 68 125 148 --repo faroukpandor/faroukpandor.github.io --comment "Delivered in faroukpandor.github.io Stage 1/2 + security hardening PR."
```
