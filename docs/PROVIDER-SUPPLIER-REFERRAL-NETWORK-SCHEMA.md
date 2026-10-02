# Provider, Supplier & Referral Network Schema

**Status:** Working operational architecture — October 2026

## Purpose

Create one controlled provider/supplier network for customer requirements arriving through Facebook pages, WhatsApp, the personal website, referrals and direct enquiries.

The network supports sourcing, reselling, referral/facilitation, delivery and enterprise orchestration without requiring a marketplace platform.

## 1. Provider record

- Provider ID
- Provider/business name
- Provider type: SUPPLIER / TRADESPERSON / CONTRACTOR / RESTAURANT / DELIVERY / SPECIALIST / OTHER
- Service/product categories
- Specific services/products
- Geographic coverage
- Contact channel
- Availability
- Typical lead time
- Pricing basis
- Referral/commission arrangement, if any
- Evidence available
- Licence/certification status where relevant
- Insurance status where relevant
- References/performance evidence
- Verification status
- Last verified
- Relationship status
- Responsible person
- Notes

## 2. Verification levels

UNVERIFIED: information received but not independently checked.

CONTACT-VERIFIED: provider identity/contact and stated offering have been confirmed.

DOCUMENT-VERIFIED: relevant supporting documentation has been checked where appropriate.

PERFORMANCE-VERIFIED: documented evidence of satisfactory completed work or fulfilment exists.

Verification is not a blanket endorsement. Higher-risk or regulated services require appropriate evidence and professional/regulatory checks.

## 3. Referral models

### REFERRAL

Customer and provider are introduced. The provider performs the work directly.

### COORDINATED REFERRAL

Farouk clarifies the requirement and coordinates the introduction and basic follow-up.

### SOURCING

Farouk actively searches, compares and presents providers/products against defined customer requirements.

### ORCHESTRATION

Multiple providers, products, logistics or services are coordinated around one customer outcome.

### DIRECT RESELL

Farouk is the seller/reseller and assumes the relevant commercial obligations.

The actual model must be recorded rather than inferred from the communication channel.

## 4. Lead-source record

Every enquiry should record its acquisition source:

- FACEBOOK_PAGE
- WEBSITE
- WHATSAPP
- LINKEDIN
- DIRECT_REFERRAL
- EXISTING_CUSTOMER
- PROVIDER_REFERRAL
- OTHER

For Facebook pages, record the specific page identifier/name internally.

This allows the enterprise to determine which channels actually produce qualified opportunities and completed transactions.

## 5. Lead workflow

Lead received → requirement clarified → category identified → urgency/location captured → provider/product matching → verification check → customer introduction/quotation → work/order → completion → outcome check → reconciliation → relationship update

Possible statuses:

NEW → QUALIFYING → MATCHING → REFERRED → ACCEPTED → IN-PROGRESS → COMPLETED → VERIFIED → CLOSED

Alternative exits: DECLINED · NO-MATCH · CANCELLED · LOST · ON-HOLD

## 6. Provider matching

Match against:

- service/product category
- location/service area
- availability
- capability
- required qualifications
- urgency
- customer specification
- price/budget where known
- previous performance
- capacity

Do not select a provider solely because they are already in the directory.

## 7. Commercial controls

Before making a referral or coordinated introduction:

- clarify the customer's requirement;
- avoid guaranteeing provider performance unless contractually responsible for it;
- disclose relevant referral/commission arrangements;
- do not claim a provider is licensed/certified unless evidence is current;
- avoid exposing unnecessary customer personal information;
- obtain appropriate customer consent before sharing contact details;
- document material commitments;
- distinguish referral from direct service delivery.

## 8. Provider performance record

After completed work, where practical record:

- opportunity ID
- provider ID
- service/product
- date
- promised completion
- actual completion
- customer outcome
- quality/issue indicator
- rework/complaint
- response time
- price variance
- customer feedback
- evidence of completion
- repeat engagement
- referral outcome

Performance evidence should influence future matching, but should not be represented as a universal guarantee.

## 9. Facebook acquisition architecture

Facebook pages should be treated as distributed acquisition assets.

Each page may have its own audience and service context while feeding the same central opportunity process:

Facebook Page → Lead → Requirement → Central Opportunity Record → Provider/Product Matching → Referral/Sourcing/Resell/Orchestration → Outcome

Do not create a separate operational database for every page unless evidence shows a genuine need.

## 10. Provider categories

Initial categories may include:

- Plumbing
- Electrical
- Carpentry
- Painting
- Welding
- Building/maintenance
- Roofing
- Air-conditioning/refrigeration
- Landscaping/gardening
- Cleaning
- Security-related services where appropriately qualified
- Appliance/equipment repair
- Transport/logistics
- Printing/branding
- Garment production
- Promotional merchandise
- Restaurants/food providers
- Vehicle suppliers
- Agricultural suppliers
- Machinery/equipment suppliers
- Specialist professional services

Categories should expand from actual customer demand rather than assumptions.

## 11. Revenue attribution

Track separately:

- direct product margin;
- sourcing fee;
- coordination fee;
- delivery fee;
- referral commission;
- supplier commission;
- recurring management fee;
- no-fee relationship/referral.

A referral that generates no immediate payment can still be recorded as a relationship/outcome, but should not be counted as revenue.

## 12. Privacy

Actual provider/customer records should not be stored in a public GitHub repository.

Public repository content should contain schemas, SOPs, synthetic examples and governance rules only.

## 13. Resilience

Maintain enough provider depth that one provider's failure does not automatically stop the service.

For important categories, aim to maintain:

Primary provider → alternate provider → emergency/backup route

The network itself is therefore an enterprise asset, but provider relationships must be maintained and verified rather than assumed permanent.
