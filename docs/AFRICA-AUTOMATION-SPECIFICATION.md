# Africa Opportunity Intelligence Automation Specification

## Phase 1 — source monitoring
Monitor official AU, REC and national planning/investment/procurement sources.

Pipeline:
FETCH → NORMALISE → HASH → COMPARE → CLASSIFY → DEDUPLICATE → STORE → ALERT.

## Phase 2 — evidence operations
- stale-source reminders;
- changed-page detection;
- source retrieval log;
- duplicate-signal detection;
- opportunity-ID assignment;
- weekly digest.

## Phase 3 — commercial evidence
Import manually captured:
- enquiries;
- quote requests;
- supplier quotes;
- deposits;
- completed jobs;
- contribution;
- repeat orders.

## Human-in-the-loop controls
Automation must not:
- infer political preferences;
- claim government endorsement;
- submit tenders;
- make purchases;
- approve regulated products/services;
- promise stock;
- commit customers;
- declare market proof without transaction evidence.

## Failure behaviour
If automation fails, export/import must remain possible through CSV/JSON/manual registers.
