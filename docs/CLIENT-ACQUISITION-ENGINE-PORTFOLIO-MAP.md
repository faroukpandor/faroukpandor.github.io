# Client Acquisition Engine — Portfolio Integration Map

**Canonical implementation:** [MOKORO Digital Growth Engine](https://github.com/faroukpandor/MOKORO---Digital-Growth-Engine)  
**Initial route:** `/tools/client-acquisition`  
**Primary spec:** [Client Acquisition & Opportunity Engine](https://github.com/faroukpandor/MOKORO---Digital-Growth-Engine/blob/main/docs/CLIENT-ACQUISITION-OPPORTUNITY-ENGINE.md)  
**Poultry pilot:** [Initial Botswana poultry prospect map](https://github.com/faroukpandor/MOKORO---Digital-Growth-Engine/blob/main/docs/CLIENT-ACQUISITION-POULTRY-PILOT-LEADS.md)  
**Status:** First local-first prospect workspace added to source; deployment/build verification still required.

## Canonical responsibility

MOKORO Digital Growth Engine owns the reusable client-acquisition workflow: campaign briefs, evidence-backed prospect records, fit scoring, pipeline stages, outreach drafts, follow-up dates, and CSV/JSON export. Do not duplicate this general-purpose tool in every enterprise repository.

## Integration by business line

| Business line / repository | Intended use | Boundary |
|---|---|---|
| **MOKORO Digital Growth Engine** | Canonical tool, general sales acquisition and opportunity workflows | Own implementation and roadmap |
| **AgriSage360 / AGRISAGE** | Agricultural market research, grower/integrator/processor discovery, farm-service partner mapping | Agricultural domain criteria and interpretation belong here; link to canonical tool rather than copy it |
| **AgriSolutions / Master Farmer / AgriLink / AnimalSphere** | Field-service customers, farmer network engagement, agricultural commerce and partner discovery | Use only authorised contacts and consented information |
| **BRANDCRAFT-ALCHEMIST** | Prospects for branding, design, embroidery/print collateral and creative services | Client brand assets remain client-owned; no cross-use without permission |
| **Personal portfolio / FAROUKPANDORCONSULTANT** | Route inbound enquiries to the correct offer and track own consulting pipeline | Clearly distinguish personal services from client work and partner referrals |
| **Procurement and sourcing projects** | Supplier qualification, buyer/distributor mapping, tender/EOI tracking and partner discovery | Do not imply tender eligibility or submit bids without explicit approval |
| **Client / employer projects (including YellowBlue and WCD)** | Potential beneficiary only where a mandate and permission exist | No edits, shared databases, portfolio branding or data transfer without authorisation |

## Evidence and automation rules

- Every material prospect claim should have a public source, retrieval date and an explicit confidence/unknowns field.
- The current route is a local-first workspace with seeded poultry research leads and manually entered prospects. It is not yet a live web-search crawler or scheduled monitoring service.
- Do not treat a research lead as an interested buyer, a confirmed contract, an open funding call or a guaranteed customer.
- Do not send messages automatically. Human approval is required for outreach, bids, applications, sharing confidential details and commercial commitments.
- Respect public-source terms, data protection requirements, opt-outs, contact frequency, and client/third-party data boundaries.
- Keep the core workflow usable without paid API keys. Add discovery and scheduled monitoring only after the source adapter, costs, terms and reliability are validated.
- Do not mark the feature live in a deployed environment until a successful build and URL check are recorded.

## Pilot success measures

Track verified prospects, source freshness, percentage meeting stated criteria, positive replies, meetings, proposals, wins/losses, time saved, and cost per qualified opportunity. Measure actual outcomes before making pricing or revenue claims.
