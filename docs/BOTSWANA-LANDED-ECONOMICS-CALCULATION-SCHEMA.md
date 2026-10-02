# Botswana Landed Economics Calculation Schema

**Created:** 2026-10-02

## Purpose

Prevent sourcing/reselling quotations from being based on supplier price alone.

## Required fields

- opportunity_id
- product/service
- specification
- quantity
- supplier
- supplier_location
- supplier_currency
- supplier_unit_cost
- supplier_total_cost
- FX_rate
- freight
- insurance
- packaging
- local_transport
- customs_duty
- VAT
- excise/levies where applicable
- clearing/handling
- permits/certificates/testing
- payment/transaction costs
- coordination cost
- contingency/risk allowance
- total_landed_cost
- unit_landed_cost
- proposed_customer_price
- gross_contribution
- contribution_percentage
- customer_payment_terms
- supplier_payment_terms
- working_capital_required
- lead_time
- validity_date
- evidence_refs

## Botswana customs control

BURS states that imports from outside SACU are liable for 12% VAT plus applicable tariff rates, while imports from SACU member states attract 12% VAT and no customs duty under the described general rule. Exact treatment remains product-specific and must be checked against the applicable tariff, origin rules and exemptions/rebates. Source: https://www.burs.org.bw/?Itemid=213&id=58&option=com_content&view=article

BURS publishes the customs duty tariff schedule/eTariff. Source: https://burs.org.bw/index.php/customs-duty-rates

Statistics Botswana states that imports are valued CIF, including transport and insurance to Botswana. Source: https://www.statsbots.org.bw/merchandise-trade-statistics

## Calculation rule

TOTAL LANDED COST = supplier cost + FX effect + freight + insurance + customs/taxes + clearance/handling + permits/testing + local transport + transaction costs + coordination + justified contingency

CONTRIBUTION = customer price - total landed cost

Never call supplier price “profit margin”.

## Quote controls

Every customer quote should state:
- currency;
- quote validity;
- assumptions;
- included costs;
- excluded costs;
- estimated lead time;
- stock/availability status;
- tax/duty assumptions;
- refund/cancellation conditions;
- supplier dependency where relevant.

## Working-capital control

Where supplier terms require deposits, record:
- deposit percentage;
- deposit amount;
- payment date;
- remaining balance;
- expected arrival;
- customer payment/deposit;
- working-capital gap.

A deferred supplier balance remains an obligation even when goods have arrived.

## Status

ESTIMATE → VERIFIED-COST → CUSTOMER-QUOTED → CUSTOMER-COMMITTED → PROCUREMENT → DELIVERED → RECONCILED.

If any material cost is unknown, the record remains ESTIMATE.
