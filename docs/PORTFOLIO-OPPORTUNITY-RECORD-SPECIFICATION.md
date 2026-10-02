# Portfolio Opportunity Record Specification

**Status:** Active architecture  
**Purpose:** One interoperable record for opportunities entering the Farouk portfolio from websites, WhatsApp, Facebook pages, referrals, research, suppliers, customers, partners or enterprise repositories.

## 1. Principle

Do not create a new record system for every channel.

All channels feed a canonical opportunity record, while each enterprise retains ownership of its specialist operating records.

**Channel → Opportunity Record → Qualification → Route → Enterprise / provider → Delivery → Outcome → Learning**

The record is an integration contract, not an ERP.

## 2. Canonical identifiers

Every record should use stable IDs:

- Opportunity ID: `OPP-YYYY-NNNN`
- Customer ID: `CUS-YYYY-NNNN`
- Requirement ID: `REQ-YYYY-NNNN`
- Provider ID: `PRV-YYYY-NNNN`
- Evidence ID: `EVD-YYYY-NNNN`
- Quote ID: `QTE-YYYY-NNNN`
- Cost ID: `CST-YYYY-NNNN`
- Compliance ID: `CMP-YYYY-NNNN`
- Fulfilment ID: `FUL-YYYY-NNNN`
- Outcome ID: `OUT-YYYY-NNNN`

Identifiers should be portable across GitHub, spreadsheets, forms, CRM systems and enterprise applications.

## 3. Minimum Opportunity Record

| Field | Purpose |
|---|---|
| Opportunity ID | Stable reference |
| Date received | Audit trail |
| Source channel | Website, WhatsApp, Facebook, referral, research, supplier, partner, etc. |
| Source asset | Specific page, repository, campaign or relationship |
| Customer/contact | Person or organisation |
| Customer type | Individual, SME, corporate, institution, farmer, processor, etc. |
| Location | Geography relevant to fulfilment |
| Problem | What needs solving |
| Requirement | What is actually requested |
| Category | Product, service, digital, agriculture, research, specialist, opportunity |
| Urgency | Timing |
| Quantity/frequency | Commercial scale signal |
| Budget signal | Only when voluntarily provided |
| Current solution | Existing supplier/process |
| Desired outcome | What success means |
| Capability route | Capability required |
| Enterprise route | Farouk-owned or appropriate third-party destination |
| Ownership status | FAROUK-OWNED / CLIENT-OWNED / EMPLOYER-OWNED / THIRD-PARTY / PARTNER / UNKNOWN |
| Commercial mode | RESELL / SOURCE-TO-ORDER / IMPORT-TO-ORDER / REFERRAL / BROKERED / PARTNER-SUPPLIED / CUSTOM-TO-ORDER / DELIVERY-ONLY / ORCHESTRATED-PROCUREMENT / SERVICE |
| Provider/supplier | Proposed fulfilment actor |
| Evidence | Supporting evidence |
| Economics | Cost, price, contribution and working capital |
| Compliance | Applicable requirements |
| Commitment | Interest, quote request, deposit, PO, paid pilot etc. |
| Status | Current decision state |
| Next action | One actionable next step |
| Owner | Person responsible |
| Last verified | Evidence freshness |
| Review due | Reverification date |
| Outcome | Actual result |
| Learning | What changed the model |

## 4. Source-channel taxonomy

### A. Owned acquisition

- faroukpandor.github.io
- owned enterprise websites
- owned social channels
- owned catalogues
- email
- WhatsApp Business

### B. Distributed acquisition

- Facebook pages
- community groups
- referrals
- provider networks
- partner channels

### C. Market/research signals

- Government publications
- procurement notices
- institutional programmes
- peer-reviewed literature
- supplier catalogues
- industry information
- market observations

A signal becomes an opportunity only after a defined problem or requirement is identified.

## 5. Routing rules

### Commercial / General Dealer

Use when the opportunity concerns:
- product sourcing;
- resale;
- procurement;
- import-to-order;
- supplier coordination;
- merchandise;
- delivery.

### Mokoro

Use when the core requirement is:
- digital system;
- website/PWA;
- workflow;
- automation;
- data infrastructure;
- growth system.

### AgriSage360

Use when the core requirement is:
- farm management;
- agricultural records;
- AgTech;
- production decision support;
- livestock/farm data;
- agricultural workflow.

### Research / Intelligence

Use when the requirement is:
- evidence synthesis;
- market research;
- literature review;
- opportunity intelligence;
- validation;
- research dossier.

### Provider / Referral Network

Use when:
- a specialist provider is required;
- Farouk is facilitating rather than delivering the specialist service;
- provider verification is required.

## 6. Qualification gate

Before significant expenditure:

**Signal → Problem verified → Customer verified → Requirement verified → Provider verified → Economics verified → Compliance verified → Customer commitment**

Do not purchase speculative inventory merely because a signal exists.

## 7. Status model

Primary:

`SIGNAL`  
→ `PROBLEM-VERIFIED`  
→ `CUSTOMER-VERIFIED`  
→ `REQUIREMENT-VERIFIED`  
→ `SUPPLIER/PROVIDER-VERIFIED`  
→ `QUOTED`  
→ `CUSTOMER-COMMITTED`  
→ `PAID/PILOT`  
→ `DELIVERED`  
→ `RECONCILED`  
→ `REPEATABLE`  
→ `PRODUCTISED`  
→ `RECURRING`

Alternative:

`HOLD` → `REDESIGN` → `ROUTE` → `ARCHIVE`

## 8. Evidence discipline

The following do **not** automatically establish customer demand:

- website traffic;
- social engagement;
- Government programme publication;
- tender publication;
- supplier listing;
- institutional relevance;
- research publication;
- AI-generated market-size estimate;
- verbal interest;
- historical willingness-to-pay;
- repository activity.

Customer evidence strengthens progressively:

**Interest → Information request → Specification → Quote request → Sample request → Deposit/PO → Paid pilot → Repeat order**

## 9. Financial controls

Every quote should distinguish:

- supplier cost;
- FX;
- freight;
- insurance;
- customs/taxes/levies where applicable;
- local transport;
- testing/permits;
- labour;
- packaging;
- coordination;
- contingency;
- total cost;
- selling price;
- contribution;
- customer payment;
- supplier payment;
- working-capital exposure;
- quote validity.

Customer deposits and supplier balances are obligations, not automatically profit.

## 10. Ownership controls

Never infer ownership from:
- repository access;
- collaboration;
- employment;
- client work;
- supplier relationship;
- domain control;
- hosting;
- historical involvement.

The current portfolio ownership register remains authoritative.

Client/employer work is experience evidence unless separately documented as Farouk-owned.

## 11. Privacy

The public website must not publish:
- private customer contact details;
- payment information;
- confidential quotations;
- private supplier terms;
- unnecessary personal information;
- credentials or secrets.

Sensitive operational records belong in controlled systems.

## 12. Resilience

Every opportunity must remain reconstructable from portable data.

Minimum fallback:

**Opportunity ID + customer + requirement + evidence + provider + economics + compliance + status + next action**

Preferred export formats:

- CSV
- JSON
- spreadsheet
- plain text

If an application disappears, the opportunity should survive.

## 13. Enterprise hand-off

The personal portfolio should not duplicate specialist records.

Hand-off package:

1. Opportunity ID
2. Requirement summary
3. Customer/relationship reference
4. Evidence references
5. Commercial mode
6. Ownership status
7. Provider/supplier reference
8. Economics
9. Compliance questions
10. Next action
11. Destination enterprise
12. Return/outcome requirement

## 14. KPI layer

Portfolio-level indicators:

- opportunities received;
- qualified opportunities;
- customer-verified opportunities;
- quotes issued;
- customer commitments;
- paid pilots;
- completed transactions;
- contribution realised;
- repeat transactions;
- recurring relationships;
- abandoned/archived opportunities;
- average time from signal to commitment;
- working-capital exposure;
- source-channel conversion.

Do not optimise for enquiry volume alone.

## 15. Decision principle

The portfolio should reward **validated outcomes and reusable evidence**, not the number of ideas, repositories, pages or documents created.

**Build less. Validate more. Reuse what works. Route what does not. Preserve the evidence.**
