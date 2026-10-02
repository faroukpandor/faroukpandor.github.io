# Portable Opportunity Intake

## Purpose

Provide a structured first-contact mechanism without turning the public portfolio into a backend application.

## Public fields

- Need/category
- Name
- Contact method
- Location
- Requirement
- Timing
- Acquisition source

The form intentionally does not collect unnecessary sensitive information.

## Transport

The initial implementation uses a standard `mailto:` form. The visitor's own email client prepares the message.

This is a fallback mechanism, not a CRM.

## Canonical internal record

Once received, the enquiry can be normalised into:

**Opportunity ID → Customer ID → Requirement ID → Provider ID → Evidence ID → Quote ID → Cost ID → Compliance ID → Fulfilment ID → Outcome ID**

Minimum portable fields:

- Opportunity ID
- date/time received
- customer/contact
- requirement
- location
- category
- urgency/timing
- source channel
- status
- next action
- owner
- evidence references
- provider/supplier
- economics
- compliance
- outcome

## Status

Use:

SIGNAL → REQUIREMENT-VERIFIED → CUSTOMER-VERIFIED → SUPPLIER/PROVIDER-VERIFIED → QUOTED → COMMITTED → PAID/PILOT → DELIVERED → REPEATABLE → RECURRING

Alternative:

HOLD → REDESIGN → ROUTE → ARCHIVE

## Privacy and resilience

- Do not collect sensitive information unless necessary.
- Do not promise confidentiality beyond the actual communication channel.
- Do not store customer information in public Git repositories.
- The public site remains functional if the intake transport fails.
- A plain email, spreadsheet, CSV or paper record can reconstruct the workflow.

## Future options

Only add a backend/CRM when real enquiry volume demonstrates the need. Candidate future adapters can include a lightweight form endpoint, spreadsheet, email automation or self-hosted/open-source system, provided the canonical record remains portable.
