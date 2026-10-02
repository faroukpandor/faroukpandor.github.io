# Opportunity Routing Interface

## Purpose

The homepage now provides a problem-first routing interface. A visitor can choose a broad outcome without knowing Farouk's repository or enterprise names.

## Routes

1. Product/supplier → General Dealer / sourcing
2. Business workflow → Mokoro / digital systems
3. Agricultural support → AgriSage360
4. Research/intelligence → research layer
5. Specialist service → provider/referral network
6. Opportunity submission → commercial validation layer

## Interaction model

The interface deliberately uses native HTML `details/summary` rather than JavaScript. This preserves:
- static hosting portability;
- accessibility;
- low maintenance;
- offline/read-only resilience;
- no runtime dependency.

## Guardrails

The router is not a booking engine, procurement commitment, supplier endorsement or guarantee of service availability.

Opening a route should lead to requirement definition and evidence collection before commercial commitment.

## Future extension

If actual demand justifies it, the router can later connect to a portable opportunity intake record. The data model should remain exportable to CSV/JSON and reconstructable manually.
