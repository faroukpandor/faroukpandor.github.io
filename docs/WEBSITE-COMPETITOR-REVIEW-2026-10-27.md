# Website Competitor & Market Review — 2026-10-27

**Surface:** https://faroukpandor.github.io/ (this repository)
**Method:** Desk research of public competitor and market sources plus an internal review of the site against the Problem-First Homepage Contract and the Website Health Check Delivery Checklist. No paid-tool crawl, no client data, no claim of ranking outcomes.

## 1. Market landscape (public-source level)

| Actor type | Examples | What the public positioning does well | Gap this site can exploit |
|---|---|---|---|
| Enterprise development agencies | LEA (lea.co.bw), CEDA, BITC | Institutional credibility, programmes, countrywide footprint, funding facilitation | Slow, programme-led; the visitor must fit the institution's boxes first |
| Large professional-services firms | Grant Thornton Botswana, EOH Consulting Botswana (est. 2001, 11–50 staff) | Full compliance/consulting stacks, brand trust, licence/registration services | Enterprise pricing and scope; not built for a single defined requirement from an SME or individual buyer |
| Government opportunity portals | gov.bw Doing Business opportunities, EDD registration, Thuo Letlotlo | Authoritative demand signals and preferences (e.g. GoB procurement price-preference margins for locally based firms — 15% small / 10% mid / 5% large per the US State Dept Investment Climate Statement) | Opportunities are listed, not facilitated; no help with supplier sourcing or route selection |
| Global task/service marketplaces | (category benchmark) | Fast self-serve comparison | Little local knowledge of Botswana buyers, standards bodies, logistics |

**Positioning conclusion (unchanged):** the winning lane is the personal, evidence-led problem-solver — "start with the problem, not the programme" — with explicit scope, honest evidence labels and specialist referral where work is regulated. That lane is not occupied by any of the above at the single-requirement level.

## 2. Site review against internal contracts

Problem-First Homepage Contract acceptance test (visitor can answer "what can I ask?", "where do I start?", "do I need to choose an enterprise?") — **already passing** before today's changes. Trust rules (no historical concepts as active enterprises, no client assets as owned, evidence labels, no licensure claims) — respected in all copy.

### Gaps found (and status)

| Gap | Severity | Status |
|---|---|---|
| No FAQ layer for detail-seekers (fee structure, guarantees, regulated work, geography) | Medium | **Fixed** — FAQ section (06) added before the enquiry section; answers written to match the trust rules |
| No FAQPage / ProfessionalService structured data | Medium | **Fixed** — JSON-LD `@graph` with ProfessionalService (areaServed Botswana, serviceType list) and FAQPage (7 questions) |
| Title/meta lacked local intent ("Botswana") in the title; description service list slightly stale | Medium | **Fixed** — title and meta description updated with locality and current service vocabulary |
| No social preview image (twitter:card was `summary`, no og:image) | Low/Med | **Fixed** — `assets/img/og-cover.jpg` generated to match the site's orbit motif; `summary_large_image` set |
| Sitemap missing portfolio-map.html and lastmod dates | Low | **Fixed** — sitemap.xml updated (2026-10-27) |
| Nav lacked a route to the FAQ | Low | **Fixed** — "FAQ" added between About and Enquire |

### Deliberately not done (evidence limits)
- No testimonials, client logos, pricing tables or outcome statistics — none have verifiable support yet. The FAQ states fees are agreed in writing and nothing is charged until agreed, consistent with the value section.
- No claim about search ranking or traffic improvement — unmeasured.
- No change to the Problem-First hierarchy: hero → outcome intents → method → value → portfolio → principles → FAQ → enquiry.

## 3. Notes for the next review pass
1. Testimonials: once one client provides a written, quotable statement, add a "Working together" strip with attribution control.
2. Case examples: illustrative engagement scenarios would strengthen credibility if clearly labelled as illustrations, not client results.
3. Local pages: a Gaborone/Botswana landing fragment (services by district, delivery notes) is a candidate only if enquiry data shows geographic intent.
4. Re-check competitor set in ~90 days; agency programmes and procurement preferences change.

## 4. Sources (retrieved 2026-10-27)
- https://www.lea.co.bw/ — LEA public site and publications (tenders, incubators, SMME mandate)
- https://www.grantthornton.co.bw/services/corporate-services/ — business consulting and compliance services description
- https://www.linkedin.com/company/eoh-consulting-botswana/ — EOH Consulting Botswana profile
- https://www.gov.bw/taxonomy/term/153 — Doing Business opportunity categories
- https://www.state.gov/reports/2023-investment-climate-statements/botswana — procurement price-preference margins for locally based firms
- Internal: docs/PROBLEM-FIRST-HOMEPAGE-CONTRACT.md, docs/WEBSITE-HEALTH-CHECK-DELIVERY-CHECKLIST.md, docs/MARKET-AND-CUSTOMER-EVIDENCE-RESEARCH.md (desk-evidence status table; customer interviews still outstanding)
