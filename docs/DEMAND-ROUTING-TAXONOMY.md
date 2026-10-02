# Demand Routing Taxonomy

## Purpose

Provide a stable, plain-language entry taxonomy for demand-driven progressive disclosure.

## Customer-facing categories

1. **Buy or source something**
   - Product
   - Equipment
   - Vehicle
   - Agricultural input
   - Merchandise
   - Other goods

2. **Service or specialist**
   - Facilities
   - Handyman/trade
   - Delivery
   - Specialist provider
   - Referral/coordination

3. **Business help**
   - Business operations
   - Sourcing/procurement
   - Commercialisation
   - Digital workflow
   - Marketing/brand/growth
   - Market entry

4. **Agricultural help**
   - Farm operations
   - Livestock
   - Agricultural inputs
   - AgTech
   - Field intelligence

5. **Research or information**
   - Research
   - Market intelligence
   - Opportunity discovery
   - Evidence review

6. **Idea or opportunity**
   - Product/opportunity validation
   - Partnership exploration
   - Supplier opportunity
   - Commercial experiment

## Routing rule

These categories are intentionally broad. They are not enterprise names and do not determine the final destination.

The system should ask the minimum additional questions necessary to identify:

- desired outcome;
- location;
- timing;
- quantity/scope;
- relevant specification;
- customer commitment level;
- evidence already available.

Then route to the appropriate operating layer.

## Fallback

If no category fits:

**Something else** → free-text requirement → manual triage.

## Anti-complexity rule

Do not expose all subcategories at the first step.

**Broad choice first → relevant detail second → internal routing third.**

## Change control

New categories should be introduced only when recurring demand demonstrates that the existing language is insufficient.

This keeps the public interface stable while allowing the internal portfolio to grow.
