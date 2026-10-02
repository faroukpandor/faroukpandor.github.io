# General Dealer, Sourcing & Enterprise Orchestration Architecture

**Status:** Working architecture — October 2026  
**Repository:** `faroukpandor/faroukpandor.github.io`  
**Branch:** `general-dealer-orchestration-v1`

## Purpose

Extend the personal-brand commercial architecture so that **General Dealer, reselling, sourcing, brokerage/facilitation and enterprise orchestration** operate as one coherent customer-facing model without turning the personal website into a monolithic commerce or ERP system.

## Core proposition

> **Connect people, products, services, resources and opportunities — then coordinate the right combination into a practical outcome.**

The public identity may include:

**Business Development · Sourcing · Reselling · Enterprise Orchestration**

“General Dealer” is a commercial category, not the complete professional identity.

## Operating model

**Customer / opportunity**  
→ **Requirement capture**  
→ **Diagnose**  
→ **Source / Resell / Broker / Build / Coordinate**  
→ **Assemble suppliers, specialists, enterprises, technology and logistics**  
→ **Quote / agree scope**  
→ **Coordinate delivery**  
→ **Quality / evidence control**  
→ **Outcome**  
→ **Follow-up**  
→ **Repeat / recurring relationship**

## Commercial modes

### 1. Resell

Acquire or arrange products for resale where the economics, legality, supply reliability and customer demand are acceptable.

Product status must always be explicit:

- IN STOCK
- PRE-ORDER
- SOURCE-TO-ORDER
- IMPORT-TO-ORDER
- AFFILIATE / REFERRAL
- BROKERED
- PARTNER SUPPLIED

Never imply ownership of inventory that is not owned or controlled.

### 2. Source

A customer specifies a requirement; the business identifies and coordinates suitable suppliers.

Workflow:

**Requirement → specification → supplier discovery → comparison → quotation → customer approval → procurement → logistics → delivery → evidence**

### 3. Facilitate / broker

Where appropriate, connect buyer and provider and coordinate the transaction. Commercial relationships, commissions, margins and responsibilities must be transparent to the relevant parties.

### 4. Orchestrate

For multi-component requirements, act as the coordination layer rather than pretending to personally perform every specialist function.

Example:

**Customer requirement → product supplier + contractor + logistics + digital system + specialist → coordinated implementation**

Specialist and regulated decisions remain with appropriately qualified providers.

### 5. Build / implement

Where Farouk or a canonical enterprise can directly provide the required service, route the opportunity to that enterprise.


## Commercial fulfilment models

The same General Dealer front door may use different fulfilment and capital models. The model must be recorded for every opportunity.

| Model | Typical example | Capital exposure | Core control |
|---|---|---:|---|
| SOURCE-TO-ORDER | Customer-requested product | Low | Verify supplier before quote |
| IMPORT-TO-ORDER | UK used vehicle | Low–medium | Landed-cost and import verification |
| CUSTOMER-COMMITTED IMPORT | Customer commits before procurement | Low–medium | Written scope, payment and refund/variation terms |
| DEFERRED-ARRIVAL STOCK | China supplier requiring 50% deposit and balance on arrival | Medium | Deposit, balance, lead time, FX and inventory controls |
| BUY-AND-HOLD RESELL | Purchased stock held locally | Medium–high | Demand validation, stock ageing and working capital |
| CUSTOM-TO-ORDER | Blank merchandise customised for a customer | Low–medium | Artwork/specification approval and production QC |
| PARTNER-SUPPLIED | Product/service fulfilled by another business | Low | Supplier/provider responsibility and evidence |
| BROKERED / FACILITATED | Buyer connected to provider | Very low | Transparent role, fee/commission and handoff |
| DELIVERY-ONLY | Restaurant food or other local order | Low | Order confirmation, collection, delivery and reconciliation |
| ORCHESTRATED PROCUREMENT | Multiple products/providers assembled around one requirement | Variable | Scope, dependencies, supplier coordination and QC |

### Example category applications

**Automobiles — UK vendor**

Classify supplier-listed vehicles as `IMPORT-TO-ORDER` or `PARTNER-SUPPLIED` until availability, vehicle identity, price basis, shipping destination, shipping inclusions/exclusions, documentation and other material claims are verified.

A supplier statement such as “PRICE WITH SHIPPING” is **not automatically a Botswana landed cost**. Duties, taxes, port/clearing, registration/compliance, local transport, currency movements and the exact shipping destination/basis must be established before a landed-price quote is made.

**China goods — Rocky's Bargain League**

Where the supplier requires **50% deposit to place the order and 50% when goods arrive approximately three months later**, classify the procurement as `DEFERRED-ARRIVAL STOCK` unless a specific customer order makes it source-to-order.

Track separately:

- supplier quotation/reference;
- product/SKU and quantity;
- deposit amount and payment date;
- expected arrival window;
- remaining balance;
- currency and FX exposure;
- freight/logistics;
- duties/taxes/clearing;
- damage/shortage risk;
- customer pre-orders, if any;
- stock commitment;
- final landed unit cost;
- target selling price and contribution.

The three-month interval is a **procurement planning cycle**, not a guaranteed delivery promise.

**Blank corporate, promotional and operational merchandise**

Support three levels:

1. **Blank resale** — source and resell uncustomised products.
2. **Customised order** — source blanks, then coordinate embroidery, printing or other approved customisation.
3. **Complete procurement/branding package** — coordinate merchandise, artwork/specification, production, quality control, packaging and delivery.

The public proposition should not imply that every production asset or facility is Farouk-owned. Client/employer production experience can be presented as evidence of capability where appropriate.

**Restaurant food delivery**

Treat restaurant food primarily as `DELIVERY-ONLY` or `ORDER-COORDINATION`, not inventory resale, unless the commercial arrangement explicitly makes Farouk the food seller.

Minimum workflow:

**Customer order → restaurant/provider confirmation → payment/reconciliation → collection → delivery → proof of completion → exception handling**

Any existing delivery vehicle/arrangement should be recorded as an operational asset only after its ownership, availability, capacity, operating area and commercial terms are documented.


## Portfolio routing

The personal site is the **front door and orchestration layer**.

Canonical enterprises remain the **delivery layers**.

Repositories remain **digital assets/evidence**.

The preferred routing pattern is:

**Farouk Pandor → customer problem → capability → offer → canonical enterprise/provider → evidence → outcome**

Do not create a new enterprise merely because a new opportunity or capability appears.

## Customer entry points

The public website should eventually support clear routes such as:

- **I need a product**
- **I need something sourced**
- **I need several suppliers/providers coordinated**
- **I need business support**
- **I need a digital system**
- **I need agricultural support**
- **I have a product/opportunity**
- **I want to partner**
- **I need market-entry support**

These should initially route to simple enquiry mechanisms rather than requiring a complex commerce backend.

## Product / opportunity record

A future catalogue or sourcing register should be able to capture:

- Product/service
- Category
- Customer requirement
- Supplier/provider
- Supplier verification status
- Product evidence
- Availability status
- Location
- Currency
- Supplier cost
- Logistics cost
- Duties/taxes/fees where applicable
- Transaction/coordination costs
- Target selling price
- Gross margin estimate
- Lead time
- Minimum order quantity
- Risk notes
- Compliance notes
- Last verified date
- Responsible person
- Customer/enquiry reference
- Status

## Commercial controls

Before accepting an opportunity, assess:

1. Identifiable customer or credible market need
2. Clear requirement
3. Feasible sourcing/delivery
4. Supplier/provider reliability
5. Total landed/direct cost
6. Plausible margin or service fee
7. Payment/cash-flow requirements
8. Logistics and fulfilment risk
9. Legal/regulatory boundaries
10. Data/privacy/confidentiality requirements
11. Reputation risk
12. Whether the work can be repeated or standardised

## Resilience architecture

No single repository, website, supplier, platform or communication channel should be treated as the entire enterprise.

Minimum separation:

**Public hub** → discovery and trust  
**Canonical enterprise repositories** → delivery systems  
**Operational records** → controlled knowledge/document storage  
**Email** → formal communication  
**WhatsApp Business** → customer conversation  
**Supplier network** → fulfilment alternatives  
**Catalogue data** → portable structured records  
**Documentation/SOPs** → continuity if personnel or software changes

Where practical, every critical process should have:

- primary route;
- low-cost/free fallback;
- portable data;
- documented SOP;
- alternative provider/channel.

## Governance rules

- Do not claim stock that is not controlled.
- Do not claim supplier relationships that have not been established.
- Do not claim licences/certifications that are not current and evidenced.
- Do not provide regulated specialist decisions outside the appropriate professional boundary.
- Do not present client/employer assets as Farouk-owned.
- Do not expose confidential customer or supplier information.
- Do not publish prices that cannot be maintained or verified.
- Do not automate a process before its manual workflow is understood.
- Do not build a marketplace merely because a directory or catalogue is technically possible.
- Evidence of a repository or prototype is not evidence of commercial demand.

## Measurement

Track the full commercial funnel:

**Enquiries → qualified requirements → sourcing work → quotations → accepted work → paid transactions → direct cost → contribution → delivery time → rework/issues → customer outcome → repeat purchase → referrals**

The objective is not maximum activity. It is **repeatable, economically sound value creation**.

## Implementation sequence

1. Reconcile this architecture against the existing capability/evidence documents.
2. Add the General Dealer / sourcing / reselling capability to the public information architecture.
3. Create a lightweight catalogue/sourcing intake before building full e-commerce.
4. Create portable product and opportunity records.
5. Test a small number of real customer requirements.
6. Document successful workflows as SOPs.
7. Route repeatable offers into the appropriate enterprise.
8. Automate only after evidence of repeat demand.
9. Establish fallback channels and supplier/provider alternatives.
10. Review quarterly and retire overlapping or non-performing assets.

## Definition of orchestration

**Orchestration is the disciplined coordination of independently owned or operated resources, people, products, services, technology and processes around a defined customer or enterprise outcome.**

It is not a claim that one person performs every specialist task.

---

**Related architecture:** capability/offer architecture, evidence matrix, commercial MVP system, opportunity register and portfolio asset ledger.
