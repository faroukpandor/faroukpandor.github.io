# Portfolio Dashboard Specification

**Status:** Architecture specification  
**Purpose:** Define the minimum useful portfolio dashboard over the canonical opportunity register without creating a monolithic ERP.

## 1. Dashboard role

The dashboard is a **decision surface**, not the underlying system of record.

It should answer:

1. What is active?
2. What needs action?
3. What is verified?
4. What is commercially committed?
5. What has actually produced an outcome?
6. Where is cash/time/exposure committed?
7. Which acquisition routes produce qualified opportunities?
8. Which enterprise routes require attention?
9. Which records are stale?
10. What should be done next?

## 2. Executive views

### A. Opportunity pipeline

Display counts by lifecycle:

SIGNAL → PROBLEM-VERIFIED → CUSTOMER-VERIFIED → REQUIREMENT-VERIFIED → SUPPLIER/PROVIDER-VERIFIED → QUOTED → CUSTOMER-COMMITTED → PAID/PILOT → DELIVERED → REPEATABLE → RECURRING

Also show HOLD / REDESIGN / ROUTE / ARCHIVE.

### B. Action queue

Default view should prioritise records with:

- explicit next action;
- overdue verification;
- customer awaiting response;
- quote nearing expiry;
- supplier dependency;
- compliance review;
- payment/reconciliation issue;
- delivery exception.

The dashboard should not invent priorities where evidence is absent.

### C. Commercial evidence funnel

Visualise:

**Signal → Customer evidence → Quote → Commitment → Paid → Delivered → Repeat**

This exposes where opportunities are actually being lost.

### D. Enterprise routing

Group active opportunities by:

- Farouk commercial / General Dealer;
- MOKORO;
- AgriSage360;
- Research / Intelligence;
- EverythingCity;
- Provider/referral network;
- Indigenous Bioresources;
- Client/employer/third-party routes.

### E. Acquisition channels

Compare:

- Website;
- WhatsApp;
- Facebook;
- Referral;
- Existing relationship;
- Research;
- Supplier;
- Partner;
- Institutional signal;
- Other.

Do not optimise for raw lead volume. Track qualified and completed outcomes.

## 3. Core KPI definitions

### Opportunity count

Number of unique active Opportunity IDs.

### Qualified opportunity

An opportunity with a verified problem and sufficiently defined requirement to proceed to the next validation step.

### Customer-validated

Customer has confirmed the relevant problem/requirement through documented interaction.

### Quote conversion

Customer-committed opportunities ÷ quoted opportunities.

Interpret carefully when sample size is small.

### Paid conversion

Paid pilots/transactions ÷ qualified opportunities.

### Delivery conversion

Delivered outcomes ÷ paid pilots/transactions.

### Repeat rate

Repeat transactions/relationships ÷ completed initial transactions.

### Recurring rate

Recurring relationships ÷ completed relationships.

### Realised contribution

Actual received selling value minus verified variable costs attributable to completed transactions.

Do not use quoted margin as realised contribution.

### Working-capital exposure

Outstanding cash committed or required before customer receipts, including supplier balances and other unavoidable prepayment obligations.

### Stale opportunity rate

Active opportunities past their review date ÷ active opportunities.

## 4. Financial dashboard

Show separately:

- customer deposits received;
- supplier deposits paid;
- outstanding supplier balances;
- cash committed;
- cash received;
- realised contribution;
- estimated pipeline value;
- working-capital exposure;
- refunds/cancellations;
- unverified economic assumptions.

Never present pipeline value as income.

Never present deposits as profit.

## 5. Evidence dashboard

Track evidence state:

- unverified;
- source verified;
- requirement verified;
- customer verified;
- supplier/provider verified;
- economics verified;
- compliance verified;
- commitment;
- outcome;
- repeat evidence.

Include source and last-verified date.

## 6. Compliance view

Show:

- compliance not started;
- review required;
- evidence requested;
- verified;
- exception;
- blocked.

The dashboard must not itself determine specialist legal, tax, medical, veterinary, financial or regulatory requirements.

## 7. Ownership view

Filter by:

- FAROUK-OWNED;
- CLIENT-OWNED;
- EMPLOYER-OWNED;
- THIRD-PARTY;
- PARTNER;
- UNKNOWN.

Unknown ownership should be visible rather than silently classified.

## 8. Resilience view

Display system dependency:

- primary operating repository;
- secondary/fallback;
- portable export available;
- last export;
- manual reconstruction possible.

A critical opportunity should never depend on a single application.

## 9. Visual language

The dashboard should follow the existing visual-storytelling doctrine:

- one idea per visual;
- flow and relationships before decoration;
- evidence status visible;
- original Farouk design language;
- static-first where practical;
- accessible labels;
- no decorative chart that does not support a decision.

Recommended visual primitives:

- pipeline;
- funnel;
- action queue;
- enterprise routing map;
- acquisition-source table;
- contribution/exposure cards;
- evidence ladder;
- aging table;
- recurring-revenue pathway;
- resilience map.

## 10. Minimum viable dashboard

Do not build all views immediately.

V1 should contain only:

1. Active opportunities
2. Next actions
3. Pipeline state
4. Customer-validated count
5. Paid/delivered/repeat outcomes
6. Working-capital exposure
7. Opportunities by source
8. Opportunities by enterprise route
9. Stale records
10. Portable export status

## 11. Data contract

The dashboard consumes the Portfolio Opportunity Register.

It should not create a competing schema.

Primary identifiers:

Opportunity ID  
Customer ID  
Requirement ID  
Provider ID  
Evidence ID  
Quote ID  
Cost ID  
Compliance ID  
Fulfilment ID  
Outcome ID

## 12. Privacy

A public portfolio dashboard must never expose private customer information, confidential prices, supplier terms, payment details or sensitive operational data.

Public view should use aggregate/approved information only.

## 13. Implementation ladder

### Stage 0 — Manual

CSV/JSON + spreadsheet calculations.

### Stage 1 — Static

Generated HTML dashboard from exported CSV/JSON.

### Stage 2 — Lightweight automation

Scheduled generation or local scripts.

### Stage 3 — Operational application

Only when enquiry/transaction volume justifies it.

### Stage 4 — Integrated ecosystem

Connect specialist enterprise repositories through stable identifiers/API/export contracts.

## 14. Decision rule

Build the next technical layer only when the current layer creates a measurable bottleneck.

**Do not build a dashboard because dashboards are interesting. Build it when it improves decisions, follow-up, economics, evidence quality or resilience.**

## 15. Success criteria

The dashboard succeeds if it helps answer:

> **What should I do next, why, what evidence supports it, what is at risk, and what happened after we acted?**

It fails if it merely displays more numbers.
