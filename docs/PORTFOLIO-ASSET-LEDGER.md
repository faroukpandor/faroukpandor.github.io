# Portfolio Asset Ledger — Initial Reconciliation

**Purpose:** establish a controlled inventory of GitHub assets and route them to canonical professional/enterprise destinations. This is an initial reconciliation, not a claim that every repository is active, owned as an enterprise, or commercially validated.

## Canonical portfolio layer

| Asset / repository | Role | Initial status | Canonical destination |
|---|---|---|---|
| FAROUKPANDORCONSULTANT | B2B administration, consulting and orchestration | Developing | Farouk Pandor Consultant |
| MOKORO-ENTERPRISE-OS | Group governance / operating layer | Developing | Mokoro |
| MOKORO---Digital-Growth-Engine | Digital growth, automation and client products | Developing | Mokoro |
| AGRISOLUTIONS | Physical agricultural execution / extension | Developing | AgriSolutions |
| EVERYTHING-CITY | Discovery, comparison and commercial information | Developing | EverythingCity |
| OMNINEWS | Development intelligence / research / publishing engine | Developing | Research & publishing layer |
| OpenEarn-Global | Country-aware opportunity intelligence | Developing | OpenEarn Global |
| NEXUS-ONEHEALTH | One Health application/prototype | Research / developing | Animal/One Health portfolio; reconcile before consolidation |
| BRANDCRAFT-ALCHEMIST | Branding/product prototype | Developing / requires reconciliation | BrandCraft |
| BW-IMPORT-SHOP | Import-commerce prototype | Developing / requires reconciliation | Commerce / sourcing |

## Important ownership controls

Repositories under the user's GitHub account are not automatically equivalent to separately owned enterprises. Client/employer repositories and projects must remain explicitly classified as client/third-party work. In particular, YellowBlue, MegaDealsMA and other known client/third-party assets must not be presented as Farouk-owned enterprises merely because repository access exists.

## Evidence classes

- **VERIFIED** — primary evidence reviewed.
- **DOCUMENTED** — supported by repository/CV/documentation evidence but not independently verified.
- **SELF-REPORTED** — supplied by the owner without primary corroboration.
- **HISTORICAL** — retained as portfolio history.
- **UNVERIFIED** — requires confirmation.
- **REQUIRES REVIEW** — repository exists but role, ownership, status or canonical destination needs deeper inspection.

## Architecture findings

### 1. The portfolio already contains distinct operating layers
The repositories indicate a useful separation between professional orchestration, digital implementation, agricultural execution/intelligence, discovery/commercial information, and research/publishing.

### 2. Duplicate-prototype risk is material
Several repositories appear to be prototypes, templates, forks or experiments. They should not automatically become public portfolio destinations. The next audit should identify duplicate functionality and select one canonical repository per capability.

### 3. Repository size/activity is not commercial validation
A large or technically sophisticated repository is evidence of work performed, not evidence of customer demand, revenue, regulatory suitability or product-market fit.

### 4. The personal website should remain lightweight
The personal site should primarily explain identity, evidence, portfolio routing and opportunities. It should not absorb the operating logic of every enterprise.

## Required next audit

For each relevant repository, capture:

1. ownership and collaborators;
2. visibility and default branch;
3. README/product purpose;
4. actual implemented features;
5. duplicate/overlapping capabilities;
6. current deployment;
7. technical debt/security exposure;
8. data/privacy obligations;
9. regulatory/professional boundaries;
10. commercial model and evidence of demand;
11. canonical enterprise destination;
12. lifecycle status;
13. evidence class;
14. recommended action: **KEEP / CONSOLIDATE / CONVERT TO SERVICE / ARCHIVE / CLIENT-ONLY / RESEARCH**.

## Decision gate

No repository should be promoted to a flagship public portfolio asset merely because it has a compelling name or sophisticated code. Promotion requires a clear role, ownership status, evidence and canonical destination.

## Current strategic sequence

**Personal identity → evidence ledger → repository archaeology → canonical enterprise map → selected case studies → commercial proof.**


## Repository archaeology update — October 2026

Further review of previously unresolved repositories produced these working dispositions:

| Repository | Observed role | Working disposition |
|---|---|---|
| AGRISAGE | Agricultural intelligence / AgTech; related to AgriSolutions, Master Farmer, AgriLink and AnimalSphere | **Developing / canonical AgriSage360 candidate** — avoid generic ERP expansion |
| AGRINEXUS | README explicitly labels it legacy/consolidation reference | **Legacy / consolidate** — no new overlapping development |
| smartfarm | Offline-first farm operating system; defined as operational system of record underneath AgriSage360 | **Developing / reusable core** — subject to implementation/evidence audit |
| AnimalHealth | Animal-health research/technical component; private; default branch master | **Developing / specialist component** — retain under AnimalSphere/animal-health architecture |
| THE-ENGINE | Generic AI Studio app shell | **Prototype / requires identification** |
| NOVA-OS | Explicitly legacy/reference | **Legacy / consolidate** |
| NEXUSFLOW-RPG | Generic AI Studio app shell | **Prototype / requires identification** |
| AEXON | Windows administration/maintenance PWA with audit, repair, cleaning and security modules | **Developing / technical utility** — security-sensitive functions require careful testing |
| AETHER-X-Global-AI-Ecosystem-Platform | Generic AI Studio app shell | **Prototype / requires identification** |
| Aether-AI-Orchestrator | Minimal AI Studio shell | **Prototype / requires identification** |
| EliteDir---Professional-Product-Service-Directory | Generic AI Studio app shell | **Prototype / requires identification; possible directory overlap** |
| EcoOffset-Nexus | Minimal AI Studio shell | **Prototype / requires identification** |
| PULA | Generic AI Studio app shell | **Prototype / requires identification** |
| AI-Personal-Command-Center | Generic AI Studio app shell | **Prototype / requires identification; likely internal unless evidence says otherwise** |
| AXON---Personal-Value-Engine | Generic AI Studio app shell | **Prototype / requires identification; do not duplicate personal-brand architecture** |
| AGRISAGE360 | Could not be retrieved under the expected owner/path during this audit | **Requires repository-path/state reconciliation** — do not infer deletion from the 404 alone |

### Key architecture findings

1. The agricultural portfolio has a clearer separation: smartfarm can serve as an operational system-of-record concept, AgriSage360/AGRISAGE as intelligence/AgTech, and AgriSolutions as field execution. AGRINEXUS should not become another platform.
2. AnimalHealth is confirmed as a private specialist component on master, not a public standalone commercial veterinary service.
3. Several newer repositories remain identifiable only as AI Studio shells from their README. They should not be promoted into the public personal portfolio until source code, purpose, evidence and overlap are inspected.
4. AEXON is materially different from the generic shells and merits a dedicated technical/security review before commercial positioning.
5. The personal brand should show selected evidence, not every repository. Repository count is not a credibility metric.

### Required next audit fields

For unresolved prototypes, inspect source tree, package/dependencies, implemented screens/features, environment/API dependencies, deployment state, data handling, security, license, history and overlap before assigning a canonical enterprise or public status.
