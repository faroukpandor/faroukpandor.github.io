# Disaster Recovery & Portability

## Principle
No critical digital asset should depend on one repository, one AI tool, one hosting provider or one undocumented person/process.

## Minimum recovery record
- canonical repository;
- backup/export location;
- deployment provider;
- domain registrar;
- environment-variable inventory (names only, never secret values);
- database/storage dependencies;
- build/deployment command;
- restoration notes;
- client/owner contact where appropriate.

## Secrets
Never store credentials, API keys or private tokens in this repository.

## Free-resource resilience
Prefer portable static/PWA architecture, open formats and exportable data where practical.

## Recovery priority
P0: identity, core portfolio and critical production services
P1: revenue-generating production applications
P2: strategic products
P3: incubators
P4: experiments/archive

## Failure principle
If one repository, host or AI environment fails, the documented recovery path should allow another suitable environment to reconstruct the asset.
