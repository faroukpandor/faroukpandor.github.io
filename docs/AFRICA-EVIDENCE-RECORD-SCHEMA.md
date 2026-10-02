# Africa Evidence Record Schema

Every intelligence item must be traceable.

## Evidence record
- `evidence_id`
- `source_url`
- `source_owner`
- `source_type`: OFFICIAL / PRIMARY / CREDIBLE-SECONDARY / MARKET / CUSTOMER / SUPPLIER / TRANSACTION
- `publication_date`
- `retrieved_at`
- `country`
- `REC`
- `sector`
- `claim`
- `quoted_or_extracted_fact`
- `interpretation`
- `confidence`
- `stale_after`
- `hash`
- `related_opportunity_ids`

## Confidence
VERIFIED-OFFICIAL > VERIFIED-PRIMARY > STRONGLY-DOCUMENTED > SECONDARY > UNVERIFIED.

Interpretation must never be stored as though it were the source's own statement.
