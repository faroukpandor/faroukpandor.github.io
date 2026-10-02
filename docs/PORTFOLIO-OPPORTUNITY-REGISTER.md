# Portfolio Opportunity Register

**Status:** Active index architecture  
**Purpose:** Provide a portfolio-level index without duplicating specialist enterprise records.

## 1. Role

The register is an **index and control tower**, not the system of record for every enterprise.

It answers:

- What opportunities exist?
- Where did they originate?
- What stage are they at?
- Which capability/enterprise should handle them?
- What evidence exists?
- What is the next action?
- What is the working-capital/compliance exposure?
- What happened?

Detailed operational records remain in the appropriate enterprise repository.

## 2. Master row schema

| Field | Description |
|---|---|
| Opportunity ID | Canonical `OPP-` identifier |
| Created | Date first recorded |
| Source channel | Website / WhatsApp / Facebook / referral / research / supplier / partner / other |
| Source asset | Specific acquisition asset |
| Opportunity title | Short neutral description |
| Customer ID | Canonical customer reference |
| Customer type | Buyer category |
| Geography | Relevant market/location |
| Category | Commercial / digital / agriculture / research / specialist / other |
| Problem | Verified or hypothesised problem |
| Requirement | Defined customer requirement |
| Capability route | Required capability |
| Enterprise destination | Responsible enterprise/repository |
| Ownership status | FAROUK-OWNED / CLIENT-OWNED / EMPLOYER-OWNED / THIRD-PARTY / PARTNER / UNKNOWN |
| Commercial mode | Standard commercial mode |
| Evidence level | Signal / verified / customer-validated etc. |
| Provider/Supplier | Reference |
| Economics status | Not started / estimated / verified |
| Compliance status | Not started / review / verified |
| Customer commitment | None / enquiry / quote / sample / deposit / PO / paid |
| Status | Current lifecycle state |
| Next action | Single next action |
| Owner | Person responsible |
| Exposure | Capital/time/reputational/compliance exposure |
| Last verified | Freshness |
| Review due | Reverification |
| Outcome | Completed result |
| Learning | Reusable lesson |
| Enterprise record | Link/reference to detailed record |

## 3. Portfolio lifecycle

**CAPTURE → TRIAGE → VERIFY → ROUTE → VALIDATE → COMMIT → DELIVER → RECONCILE → LEARN**

An opportunity can be routed without being approved for expenditure.

## 4. Triage classes

### A — Immediate commercial validation

Customer problem appears concrete and a low-capital test is possible.

### B — Evidence development

Promising signal but customer, supplier, economics or compliance evidence is incomplete.

### C — Relationship development

Potential partner/provider/customer relationship requiring verification.

### D — Research

Useful information signal without current commercial commitment.

### E — Hold

Not enough evidence, timing or capacity.

### F — Archive

Invalidated, completed with no repeat path, superseded or otherwise closed.

## 5. Priority controls

Do not rank opportunities using arbitrary scores as a substitute for evidence.

Use explicit gates:

1. Is there a defined problem?
2. Is there a plausible customer?
3. Is the requirement specific enough to quote/test?
4. Can the requirement be fulfilled?
5. Are economics understood?
6. Are compliance questions identified?
7. Is there customer commitment?
8. Can exposure be kept within an acceptable limit?
9. Is there a clear next action?

## 6. Enterprise routing

| Opportunity type | Likely destination |
|---|---|
| Product sourcing / resale / procurement | Farouk commercial / General Dealer |
| Digital system / automation | MOKORO |
| Farm / livestock / AgTech | AgriSage360 |
| Research / market intelligence | Research layer |
| Discovery / comparison / opportunity information | EverythingCity |
| Specialist local service | Provider/referral network |
| Indigenous bioresources | Research + commercialisation + appropriate specialist enterprise |
| Client/employer requirement | Client/employer record, not Farouk-owned asset |

Routing is a working classification, not proof of ownership or service availability.

## 7. Evidence progression

**SIGNAL → PROBLEM-VERIFIED → CUSTOMER-VERIFIED → REQUIREMENT-VERIFIED → SUPPLIER/PROVIDER-VERIFIED → ECONOMICS-VERIFIED → COMPLIANCE-VERIFIED → CUSTOMER-COMMITTED → PAID → DELIVERED → REPEATABLE**

No stage may be silently skipped in reporting.

## 8. Exposure register

For active opportunities record:

- cash committed;
- customer deposits received;
- supplier deposits paid;
- outstanding supplier balance;
- estimated working capital;
- time invested;
- inventory exposure;
- cancellation/refund exposure;
- compliance exposure;
- reputational/service exposure.

Deposits are not automatically profit.

## 9. Source-channel learning

Track outcomes by acquisition source:

- Website
- WhatsApp
- Facebook page
- Referral
- Existing relationship
- Research
- Supplier
- Partner
- Institutional signal
- Other

The objective is to discover which channels produce **qualified and economically viable outcomes**, not simply the most enquiries.

## 10. Resilience

Maintain a minimal exportable register.

Recommended files:

- `PORTFOLIO-OPPORTUNITY-REGISTER.csv`
- `PORTFOLIO-OPPORTUNITY-REGISTER.json`

The index should be reconstructable from enterprise records if lost.

No platform should be the only copy.

## 11. Privacy

The public repository must contain only non-sensitive index information.

Do not commit:
- private phone numbers;
- personal email addresses unless intentionally public;
- payment details;
- private quotations;
- confidential supplier terms;
- credentials;
- customer-sensitive information.

Use stable internal IDs and controlled systems for sensitive details.

## 12. Portfolio dashboard fields

The future dashboard may report:

- active opportunities;
- verified requirements;
- customer-validated opportunities;
- quotes;
- commitments;
- paid pilots;
- delivered outcomes;
- repeatable opportunities;
- recurring relationships;
- working-capital exposure;
- opportunities by source;
- opportunities by enterprise route;
- stale records;
- archived opportunities.

Avoid vanity metrics such as raw idea count or page views as primary performance indicators.

## 13. Decision doctrine

The register exists to make the portfolio **more executable**, not to create another documentation project.

When an opportunity has no next action, either define one, hold it explicitly, route it, or archive it.

**The register should shrink uncertainty, not merely record it.**
