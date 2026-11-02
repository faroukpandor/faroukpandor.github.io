# Ownership Status Register

**Register owner:** Farouk Pandor  
**Canonical control point:** [Personal portfolio repository](https://github.com/faroukpandor/faroukpandor.github.io)  
**Created:** 2026-11-02 as part of [issue #148](https://github.com/faroukpandor/faroukpandor.github.io/issues/148)  
**Source catalogue:** [`data/repository-inventory.json`](../data/repository-inventory.json) (read-only, generated; `generated_on` freshness timestamp)  
**Reproduce:** `node scripts/repository-inventory.mjs generate` (owner machine, requires `gh` auth) then `node scripts/repository-inventory.mjs reconcile` (offline, runs in the GitHub Pages guard)  
**Purpose:** Distinguish **owned, client/employer, fork, archive, experiment and unknown** repositories with explicit evidence for each row, so the public portfolio never claims more than the evidence supports.

> **Evidence boundary (applies to every row):** GitHub metadata (visibility, fork, archived, licence, last push) is verifiable **account state only**. It is not proof of commercial ownership, change authority, authorization, certification, customer outcomes or commercial status. Rows the reconciliation token could not read (HTTP 403) keep their registry-declared classification and are marked **registry-declared-unverified** — safe failure, no inference. Nothing in this register authorises changes to client, employer, third-party or upstream repositories.

## Classification vocabulary

| Class | Meaning | Evidence required to assign |
|---|---|---|
| `CONTROL` | Portfolio/group control plane | Registry control-plane declaration |
| `OWNED-ACCOUNT` | Account-held personal project candidate | Registry personal-project declaration, non-contradicted by GitHub metadata |
| `CLIENT-EMPLOYER` | Client / employer / third-party boundary | Registry boundary declaration (relationship itself unverified) |
| `UPSTREAM-FORK` | Third-party upstream software (fork, template or mirror) | GitHub fork flag, or registry upstream/template declaration |
| `ARCHIVED` | Archived repository | GitHub archived flag |
| `EXPERIMENT` | Declared experiment | Explicit experiment declaration (none recorded this pass) |
| `UNKNOWN` | Classification pending evidence | Safe default when no verified classification exists |

## 2026-11-02 pass summary

- **114 repositories catalogued:** 41 public and GitHub-verified, 73 private and registry-declared-unverified (the pass token received HTTP 403 for private repositories).
- **35 of the 41 public repositories are verified GitHub forks** of third-party upstream software. Rows the registry had listed as "UNVERIFIED" (`medical-center`, `mall123`, `BlackViperScript`, `tsafi`, `moruajunction`, `faroukpandor`, `Farouk-s-Store-by-ZoroDesign`, `ultimate-crypto-trading-bot`, `tradingview-mcp`, `bollinger-band-screener`, `disease_diagnosis_with_Machine-Learning`) are resolved to `UPSTREAM-FORK` by the fork flag.
- **11 previously unregistered public repositories** were discovered in the owner listing and added to the registry inventory in this pass: `binance-trade-bot`, `ClawWork`, `hummingbot`, `jenetics`, `openclaw`, `pentagi`, `pinokio`, `python-binance`, `rea`, `ruflo`, `Rust-Ecosystem-`. Ten are verified forks; `Rust-Ecosystem-` (non-fork, created 2026-11-02) remains `UNKNOWN` pending a named canonical purpose (registry rule 7).
- **0 archived repositories** and **0 declared experiments** were found; the classes exist in the vocabulary for future passes.
- **No ownership claims were upgraded** for private repositories and **no repositories were merged, deleted or repurposed**. Duplicate families are documented below with canonical ownership `PENDING-EVIDENCE`.
- No deployment URLs live in this register; verified public destinations stay in [`data/public-projects.json`](../data/public-projects.json) behind `scripts/verify-public-portfolio.mjs`.

## Register by classification

### CONTROL (2) — Control-plane repositories

| Repository | Visibility | Fork | Archived | Licence | Last push | Basis |
|---|---|---|---|---|---|---|
| faroukpandor.github.io | public (verified) | false | false | — | 2026-10-31 | registry control-plane declaration; GitHub access does not prove commercial ownership |
| MOKORO-ENTERPRISE-OS | private (declared) | — | — | — | — | registry control-plane declaration; GitHub access does not prove commercial ownership |

### OWNED-ACCOUNT (18) — Account-held project candidates (personal-project declarations)

| Repository | Visibility | Fork | Archived | Licence | Last push | Basis |
|---|---|---|---|---|---|---|
| AEXON | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| AGRISAGE | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| AI-Personal-Command-Center | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| AI-Powered-Personal-Command-Center | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| AnimalHealth | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| AXON---Personal-Value-Engine | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| BRANDCRAFT-ALCHEMIST | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| EVERYTHING-CITY | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| EVERYTHINGCITY | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| FAROUKPANDORCONSULTANT | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| FOUNDRYFREE---MOCKUP-POD | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| MOKORO---Digital-Growth-Engine | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| NEXUS-ONEHEALTH | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| NexusStream---Open-Content-Directory | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| OMNINEWS | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| OpenEarn-Global | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| PULA | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |
| THE-ENGINE | private (declared) | — | — | — | — | registry personal-project declaration; API inaccessible in this pass |

### CLIENT-EMPLOYER (9) — Client / employer / third-party boundary (do not modify without authorization)

| Repository | Visibility | Fork | Archived | Licence | Last push | Basis |
|---|---|---|---|---|---|---|
| MegaDealsMA---B2B-B2C-E-Commerce-Platform | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |
| tshono.com---Digital-Prosperity-Ecosystem | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |
| YB17.12.2025 | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |
| YELLOW-BLUE-CARGO | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |
| YELLOW-BLUE-LOGISTICS | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |
| YELLOW-BLUE-PROGRESSIVE-WEB-APPLICATION-3 | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |
| yellow-blue-pwa | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |
| yellowblue-pwa | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |
| YELLOWBLUEPWA | private (declared) | — | — | — | — | registry client/employer/third-party boundary declaration (relationship unverified) |

### UPSTREAM-FORK (39) — Third-party upstream software (verified forks and declared templates)

| Repository | Visibility | Fork | Archived | Licence | Last push | Basis |
|---|---|---|---|---|---|---|
| assemble | public (verified) | true | false | MIT | 2022-02-20 | GitHub fork flag (third-party upstream software) |
| astro | private (declared) | — | — | — | — | registry upstream/template declaration (fork and licence status unverified; verify before edits) |
| awesome-agriculture | public (verified) | true | false | NOASSERTION | 2023-07-06 | GitHub fork flag (third-party upstream software) |
| awesome-github-pages-portfolios | public (verified) | true | false | CC0-1.0 | 2021-04-05 | GitHub fork flag (third-party upstream software) |
| awesome-n8n-templates | public (verified) | true | false | — | 2025-08-10 | GitHub fork flag (third-party upstream software) |
| awesome-quant | private (declared) | — | — | — | — | registry upstream/template declaration (fork and licence status unverified; verify before edits) |
| binance-trade-bot | public (verified) | true | false | GPL-3.0 | 2026-10-09 | GitHub fork flag (third-party upstream software) |
| BlackViperScript | public (verified) | true | false | NOASSERTION | 2022-04-15 | GitHub fork flag (third-party upstream software) |
| bollinger-band-screener | public (verified) | true | false | MIT | 2026-10-12 | GitHub fork flag (third-party upstream software) |
| bolt.diy | public (verified) | true | false | MIT | 2025-01-18 | GitHub fork flag (third-party upstream software) |
| ClawWork | public (verified) | true | false | MIT | 2026-03-03 | GitHub fork flag (third-party upstream software) |
| Clean-Coder-AI | public (verified) | true | false | Apache-2.0 | 2026-09-26 | GitHub fork flag (third-party upstream software) |
| disease_diagnosis_with_Machine-Learning | public (verified) | true | false | — | 2026-10-12 | GitHub fork flag (third-party upstream software) |
| equifix-tina-cloud-starter | public (verified) | true | false | Apache-2.0 | 2025-01-21 | GitHub fork flag (third-party upstream software) |
| Farouk-s-Store-by-ZoroDesign | public (verified) | true | false | — | 2024-07-31 | GitHub fork flag (third-party upstream software) |
| faroukpandor | public (verified) | true | false | MIT | 2026-10-21 | GitHub fork flag (third-party upstream software) |
| FAROUKPANDOR-astro-platform-starter | private (declared) | — | — | — | — | registry upstream/template declaration (fork and licence status unverified; verify before edits) |
| hummingbot | public (verified) | true | false | Apache-2.0 | 2026-09-07 | GitHub fork flag (third-party upstream software) |
| jenetics | public (verified) | true | false | Apache-2.0 | 2026-10-02 | GitHub fork flag (third-party upstream software) |
| mall123 | public (verified) | true | false | — | 2025-02-04 | GitHub fork flag (third-party upstream software) |
| medical-center | public (verified) | true | false | — | 2024-10-22 | GitHub fork flag (third-party upstream software) |
| moruajunction | public (verified) | true | false | CC0-1.0 | 2026-10-08 | GitHub fork flag (third-party upstream software) |
| next-on-pages | public (verified) | true | false | MIT | 2025-01-03 | GitHub fork flag (third-party upstream software) |
| odoo | public (verified) | true | false | NOASSERTION | 2026-10-01 | GitHub fork flag (third-party upstream software) |
| openclaw | public (verified) | true | false | MIT | 2026-03-18 | GitHub fork flag (third-party upstream software) |
| opensourcepos | public (verified) | true | false | NOASSERTION | 2025-02-07 | GitHub fork flag (third-party upstream software) |
| pages-cms | public (verified) | true | false | — | 2024-12-16 | GitHub fork flag (third-party upstream software) |
| pentagi | public (verified) | true | false | MIT | 2026-09-10 | GitHub fork flag (third-party upstream software) |
| pinokio | public (verified) | true | false | MIT | 2026-03-25 | GitHub fork flag (third-party upstream software) |
| Publii | private (declared) | — | — | — | — | registry upstream/template declaration (fork and licence status unverified; verify before edits) |
| pwa-starter | public (verified) | true | false | NOASSERTION | 2026-10-08 | GitHub fork flag (third-party upstream software) |
| python-binance | public (verified) | true | false | MIT | 2026-06-08 | GitHub fork flag (third-party upstream software) |
| rea | public (verified) | true | false | MIT | 2026-10-14 | GitHub fork flag (third-party upstream software) |
| rocket-rust-hello-world | public (verified) | true | false | MIT | 2024-10-08 | GitHub fork flag (third-party upstream software) |
| ruflo | public (verified) | true | false | MIT | 2026-02-28 | GitHub fork flag (third-party upstream software) |
| tradingview-mcp | public (verified) | true | false | MIT | 2026-10-12 | GitHub fork flag (third-party upstream software) |
| tsafi | public (verified) | true | false | — | 2026-10-12 | GitHub fork flag (third-party upstream software) |
| ultimate-crypto-trading-bot | public (verified) | true | false | MPL-2.0 | 2025-07-18 | GitHub fork flag (third-party upstream software) |
| wifite2 | public (verified) | true | false | GPL-2.0 | 2024-08-20 | GitHub fork flag (third-party upstream software) |

### ARCHIVED (0) — Archived repositories

_None recorded in this pass._

### EXPERIMENT (0) — Experiments

_None recorded in this pass._

### UNKNOWN (46) — Unknown — classification pending evidence

| Repository | Visibility | Fork | Archived | Licence | Last push | Basis |
|---|---|---|---|---|---|---|
| Aether-AI-Orchestrator | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| AETHER-X-Global-AI-Ecosystem-Platform | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| AGRINEXUS | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| agrisphere | public (verified) | false | false | GPL-3.0 | 2026-10-16 | GitHub owner listing, non-fork account repository; purpose and canonical role unverified |
| Al-Mu-allim-AI-Madrassa-Tutor | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| Aura-Native---Autonomous-Ad-Ecosystem | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| bolt-slidev-hydroponic-mushroom-production | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| cloudflare1 | public (verified) | false | false | — | 2025-09-16 | GitHub owner listing, non-fork account repository; purpose and canonical role unverified |
| CreativeFlow | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| digital-botswana-hub | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| ECHOWEAVE | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| EcoOffset-Nexus | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| EliteDir---Professional-Product-Service-Directory | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| faroukpandor-nextjs-commerce | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| faroukpandorcommerce | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| ghost-farouk | public (verified) | false | false | MIT | 2025-08-06 | GitHub owner listing, non-fork account repository; purpose and canonical role unverified |
| GlobalEstate | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| health-haven-medical-centre | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| health-haven-tcs | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| health-hive-spark | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| HEALTHHAVEN | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| HEALTHHAVEN1 | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| Infinite-Heroes | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| innovatepwa | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| MORUA-JUNCTION---TEMPOLABS | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| MORUA_JUNCTION_1 | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| moruajunction1 | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| MQL5 | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| NeuroFlow-AI | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| nextjs-ai-chatbot | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| nextjs-commerce-cpm | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| NEXUSFLOW-RPG | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| nexusforge-vision | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| NOVA-OS | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| NRTC-PROPOSAL-TO-BOTSWANA-BY-FAROUK-PANDOR | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| oracle-bet-ai-assistant | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| PipTick | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| QuantGenie | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| Rust-Ecosystem- | public (verified) | false | false | — | 2026-11-02 | GitHub owner listing, non-fork account repository; purpose and canonical role unverified |
| skillswap | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| smart-life-blueprint | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| smartfarm | public (verified) | false | false | — | 2026-10-23 | GitHub owner listing, non-fork account repository; purpose and canonical role unverified |
| tiny-unicorn-hum | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| UnityMail | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| WealthFlow-AI | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |
| ZENTRA | private (declared) | — | — | — | — | registry row without verified classification; API inaccessible in this pass |

## Duplicate families — canonical ownership pending evidence

Nothing in these families may be merged, retired, renamed or repurposed until a canonical decision is recorded with evidence and change authority (issue #148 task 6).

| Family | Members | Canonical | Rule |
|---|---|---|---|
| EVERYTHINGCITY marketplace naming | EVERYTHINGCITY, EVERYTHING-CITY | PENDING-EVIDENCE | Separate repositories; do not merge on name similarity |
| YellowBlue client boundary | yellow-blue-pwa, yellowblue-pwa, YELLOWBLUEPWA, YELLOW-BLUE-PROGRESSIVE-WEB-APPLICATION-3, YELLOW-BLUE-LOGISTICS, YELLOW-BLUE-CARGO, YB17.12.2025 | PENDING-EVIDENCE | CLIENT / THIRD-PARTY BOUNDARY — no modification, branding or case-study claims without explicit written authorization |
| Personal command centre | AI-Powered-Personal-Command-Center, AI-Personal-Command-Center | PENDING-EVIDENCE | Registry requires a documented comparison before selecting a canonical role |
| Health Haven / health hive | HEALTHHAVEN, HEALTHHAVEN1, health-haven-medical-centre, health-haven-tcs, health-hive-spark | PENDING-EVIDENCE | Duplicate-family review pending; verified fork `medical-center` (SUST system) stays separate |
| Morua Junction | moruajunction, moruajunction1, MORUA-JUNCTION---TEMPOLABS, MORUA_JUNCTION_1 | PENDING-EVIDENCE | `moruajunction` is a verified GitHub fork of third-party software |
| Commerce / storefront | faroukpandorcommerce, faroukpandor-nextjs-commerce, nextjs-commerce-cpm, Farouk-s-Store-by-ZoroDesign | PENDING-EVIDENCE | `Farouk-s-Store-by-ZoroDesign` is a verified third-party fork; no storefront claims without evidence |
| Aether | AETHER-X-Global-AI-Ecosystem-Platform, Aether-AI-Orchestrator | PENDING-EVIDENCE | Duplicate-family review pending |
| AgriSage naming | AGRISAGE | AGRISAGE (resolved) | Repository name `AGRISAGE360` does not exist (404 repaired in PR #149); "AgriSage360" is a product label only |

## Reconciliation gaps and next actions

- **Unregistered public repositories at generation time:** none (the 11 gaps found in this pass were registered above and are tracked in the catalogue's `reconciliation_gaps`).
- **Private rows (73):** remain registry-declared-unverified. Re-verify fork/archived/ownership status when a token with private-repository read access is available; until then no claim may rest on them.
- **Vercel source verification:** confirm which repository (if any) feeds `faroukpandor.vercel.app` in Vercel → Project → Settings → Git before altering any guessed source (registry reconciliation queue).
- **Organisation/other-account inventory:** still to be reconciled; the owner listing is not exhaustive of organizations or other accounts.
- **Published-site link audit:** broken links, stale claims, SEO metadata, accessibility and mobile performance across `index.html`, `portfolio.html`, `professional-record.html` and `portfolio-map.html` remain on the issue #148 task list.
- **EXPERIMENT intake:** when a repository is deliberately declared an experiment, record the declaration and this register will classify it.

## Related control documents

- [Cross-Repository Relationship Registry](REPOSITORY-RELATIONSHIP-REGISTRY.md) — inventory table and relationship rules
- [Portfolio Asset Ledger](PORTFOLIO-ASSET-LEDGER.md)
- [`data/repository-inventory.json`](../data/repository-inventory.json) — machine-readable catalogue (this register is generated from it)
- [`data/public-projects.json`](../data/public-projects.json) — verified public destinations only
- [Issue #148](https://github.com/faroukpandor/faroukpandor.github.io/issues/148) — P0 reconciliation tracking
