# General Dealer Opportunity, Order & Fulfilment Schema

**Status:** Working operational schema — October 2026  
**Purpose:** Provide one portable record structure for sourcing, reselling, importing, customisation, delivery and orchestration without requiring a commerce platform.

## 1. Opportunity record

Every enquiry should receive a unique opportunity/reference ID.

Required fields:

- Opportunity ID
- Date opened
- Customer/contact
- Organisation, if applicable
- Customer location
- Requirement
- Category
- Requested quantity
- Required specification
- Desired outcome
- Deadline
- Budget indication, if volunteered
- Fulfilment model
- Proposed commercial mode
- Supplier/provider candidate
- Supplier verification status
- Evidence/source reference
- Availability status
- Quote currency
- Supplier unit cost
- Supplier total cost
- Freight/logistics
- Duties/taxes/fees
- Clearing/handling
- Local transport
- Customisation/production cost
- Payment/transaction costs
- Contingency/risk allowance
- Target selling price
- Expected contribution
- Customer deposit/payment requirement
- Supplier deposit requirement
- Supplier balance requirement
- Expected lead time
- Risk level
- Compliance notes
- Data/confidentiality classification
- Owner/responsible person
- Next action
- Last verified
- Status

## 2. Status vocabulary

Use controlled values rather than free-form descriptions.

### Opportunity

NEW → QUALIFYING → SOURCING → QUOTED → CUSTOMER-COMMITTED → PROCUREMENT → IN-FULFILMENT → DELIVERED → RECONCILIATION → CLOSED

Alternative exits:

DECLINED · LOST · ON-HOLD · CANCELLED

### Product availability

IN-STOCK · PRE-ORDER · SOURCE-TO-ORDER · IMPORT-TO-ORDER · CUSTOM-TO-ORDER · PARTNER-SUPPLIED · BROKERED

### Verification

UNVERIFIED · PARTIALLY-VERIFIED · VERIFIED · STALE-REQUIRES-RECHECK

## 3. Order and payment ledger

Never rely on a single “paid” field.

Record:

- Customer order/reference
- Supplier order/reference
- Order date
- Customer amount due
- Customer amount received
- Customer balance
- Supplier amount due
- Supplier amount paid
- Supplier balance
- Deposit percentage
- Deposit date
- Balance due date/trigger
- Currency
- FX rate used, if applicable
- Payment method
- Transaction charges
- Refund/variation status
- Outstanding obligations

### Deferred-arrival example

For a supplier requiring 50% deposit and 50% on arrival:

**Supplier quoted cost → 50% deposit → procurement/production → shipment/arrival → inspection/reconciliation → 50% balance → local fulfilment → sale**

The system must show the unpaid 50% as an outstanding obligation even if the first 50% has already been paid.

## 4. Landed-cost calculation

For imported goods, calculate:

**Supplier cost + international freight + insurance where applicable + duties/taxes/levies + port/clearing/handling + local transport + transaction/payment costs + reasonable documented risk allowance = landed/direct cost**

Then:

**Selling price − landed/direct cost = gross contribution before overhead/tax**

Do not publish or quote a Botswana landed price until material cost assumptions have been verified.

## 5. Custom merchandise workflow

**Requirement → product/specification → blank supplier → artwork/specification approval → production/customisation → QC → packaging → delivery → acceptance**

Capture artwork approval and final quantity because custom products may be difficult to resell if a customer cancels.

## 6. Restaurant delivery workflow

**Customer order → restaurant confirmation → customer/payment reconciliation → collection → delivery → proof of completion → exception/refund handling**

Record:

- restaurant/provider
- order number
- items
- order value
- delivery fee
- collection time
- promised delivery window
- actual delivery time
- delivery status
- exception/shortage/damage
- payment status

## 7. Margin and performance ledger

Track:

- quoted revenue
- actual revenue
- supplier cost
- logistics cost
- direct fulfilment cost
- transaction fees
- refunds/credits
- actual contribution
- hours spent
- rework
- delivery delay
- customer outcome
- repeat order
- referral

The purpose is to discover which categories produce repeatable contribution rather than merely high sales volume.

## 8. Evidence rules

Every material supplier claim should be traceable to an evidence source.

Examples:

- supplier catalogue/listing
- supplier quotation
- invoice/pro-forma invoice
- vehicle VIN/chassis documentation
- shipping documentation
- product photographs
- inspection report
- customer-approved specification
- delivery proof

Record **source + date verified + person responsible**.

## 9. Privacy and security

Do not put passwords, payment-card details, identity documents, private addresses or unnecessary personal data into a public repository.

Public GitHub documentation should contain only the schema, SOPs and synthetic examples. Actual customer/supplier records belong in an appropriately controlled operational system.

## 10. Portability requirement

The operational schema should remain usable in:

- spreadsheet
- CSV
- simple JSON
- lightweight PWA
- future database
- future ERP/CRM

The business should not become dependent on one platform merely because it is convenient initially.
