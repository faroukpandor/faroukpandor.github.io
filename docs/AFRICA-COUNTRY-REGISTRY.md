# Africa Country Registry

**Purpose:** canonical machine-readable planning register for the 55 African Union member states.

## Rules
- One record per AU member state.
- Do not infer commercial attractiveness from country size, politics, GDP, population or leadership.
- Country metadata is descriptive; opportunity validation happens separately.
- Record REC membership explicitly because memberships can overlap.
- Historical and current claims require source, date and evidence status.
- A country record is not a market verdict.

## Minimum fields
`country_id`, `country_name`, `AU_region`, `REC_memberships`, `official_government_portal`, `planning_authority`, `investment_agency`, `trade_authority`, `procurement_source`, `customs_source`, `statistics_source`, `current_development_plan`, `budget_source`, `historical_plan_archive`, `executive_advisory_source`, `envoy_source`, `last_verified`, `review_due`, `notes`.

## Initial implementation
The registry should be populated from AU and official national sources, then progressively enriched. Do not fabricate missing fields; use `REQUIRES-RESEARCH`.
