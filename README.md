# Farouk Pandor — Personal Brand & Professional Portfolio

Canonical public publishing site for Farouk Pandor.

This repository is the presentation layer for a broader professional and enterprise ecosystem. It routes visitors to evidence, professional records, research and canonical enterprise repositories rather than duplicating enterprise products.

## Deployment
Designed for GitHub Pages at https://faroukpandor.github.io/ using a static, provider-portable architecture with no runtime server, database or paid SaaS dependency.

## Trust rules
- Do not present historical concepts as active enterprises without confirmation.
- Do not present client or third-party assets as Farouk-owned.
- Distinguish documented evidence from self-reported or unverified claims.
- Do not imply professional licensure or regulated authority without current evidence.
- Keep enterprise-specific functionality in its canonical repository.

## Ultimate ideal competitor apps and earning portfolio
The long-term competitor-benchmark and app-build roadmap is maintained in [docs/ULTIMATE-IDEAL-COMPETITOR-APPS.md](docs/ULTIMATE-IDEAL-COMPETITOR-APPS.md). It covers first-wave commercial products, competitor sets to benchmark, additional app opportunities, existing assets to audit, and conditional repository names. This is a research/roadmap register—not a claim that listed apps are built or earning revenue. Audit and validate demand before creating duplicate repositories.

## Public pages and static tools

- `index.html` — Problem-first routing homepage with consent-aware portable intake (`PORTABLE-OPPORTUNITY-INTAKE` JSON/clipboard fallback).
- `portfolio.html` & `portfolio-map.html` — Connected capabilities, verified public destinations and visual/non-visual routing map.
- `professional-record.html` — Conservative education, experience and continuing-development record with print styling.
- `website-health-check.html` — Free offline-first 6-area Website & Digital Presence Health Check tool (CC BY 4.0, Markdown/JSON/PDF export).
- `sourcing-economics.html` — Offline-first Botswana landed economics & working-capital calculator (`assets/js/landed-economics.mjs`) and deterministic `GH-68` demand qualification router (`assets/js/demand-router.mjs`).
- `portfolio-control.html` — Stage 1 static portfolio control dashboard, one-next-action ageing queue, market-signal health and read-only repository catalogue (generated via `npm run generate`).
- `privacy.html` — Privacy notice, zero-tracking status, ownership boundaries and disclosure rules.
- `affiliate-disclosure.html` — Standalone commercial and editorial disclosure, including current placement status and standards for future affiliate/referral links.
- `404.html` — Branded not-found page (`noindex,follow`, intentionally excluded from `sitemap.xml`) that routes visitors back to a working page instead of the default GitHub Pages error screen.

## Verification, schemas and operator CLI

Run the offline test suite and CI verification checks locally:

```bash
npm test
npm run verify
```

- `scripts/opportunity-cli.mjs` — CLI helpers (`route`, `intake-to-record`, `landed`, `validate-schemas`) backed by JSON Schemas in `templates/SCHEMAS/`.
- `scripts/market-signals.mjs` — Normalises, hashes, deduplicates and checks staleness across cached official signal snapshots (`data/market-signals/SIGNAL-DIGEST.{json,md}`).

## Operating layer (internal governance)

The [personal assistant / project manager mandate](docs/PA-PM-MANDATE.md) sets the working rules, evidence levels, risk tiers and approval boundaries. The canonical [next-action queue](data/next-actions/NEXT-ACTION-QUEUE.json) (also available as [CSV](data/next-actions/NEXT-ACTION-QUEUE.csv)) carries exactly one next action per active opportunity, synced with [data/portfolio-opportunity-register.json](data/portfolio-opportunity-register.json) and verified via `node scripts/portfolio-ops.mjs verify`. These are internal operating records; they are not claims of revenue, certification, readiness or compliance, and they must not contain customer, supplier or personal financial data.

## Cross-repository governance

The current cross-repository inventory and relationship rules are maintained in [docs/REPOSITORY-RELATIONSHIP-REGISTRY.md](docs/REPOSITORY-RELATIONSHIP-REGISTRY.md) and classified in [docs/OWNERSHIP-STATUS-REGISTER.md](docs/OWNERSHIP-STATUS-REGISTER.md). Every confirmed personal-owned active repository should link back to that registry and maintain a local `docs/PORTFOLIO-RELATIONSHIPS.md`.

Related personal surface: https://faroukpandor.vercel.app/ — confirmed on 2026-11-09 via Vercel project `faroukpandor` to deploy from private repository `faroukpandor/FAROUK-PANDOR` (not the legacy `faroukpandor` Hugo starter fork).
