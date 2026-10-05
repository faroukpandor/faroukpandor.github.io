# Repository Governance

## Purpose

Keep GitHub as the canonical source for source code where appropriate while allowing Google Drive/Docs and Google AI Studio to serve as research, specifications, prototypes and working assets.

## Repository passport

Strategically relevant repositories should document:

- Name
- Purpose
- Enterprise/product
- Owner
- Client/partner status
- Canonical status
- AI Studio relationship
- Other-agent relationship
- Production URL
- Domain
- Hosting provider
- Primary technology
- Data sensitivity
- Regulatory/compliance considerations
- Dependencies
- Backup/fallback
- Revenue model
- Lifecycle
- Last review
- Next review

## Source-of-truth hierarchy

1. Production source code — canonical Git repository
2. Structured specifications — controlled documentation
3. Research/evidence — research repository
4. Prototype — AI Studio or other experimental environment
5. Generated media/design — appropriate asset repository
6. Deployment configuration — repository plus provider documentation
7. Secrets — never commit; use provider secret storage

## Free-resource and portability rule

Prefer portable, low-cost or free infrastructure. Avoid single-provider dependency where a realistic fallback can be maintained.

## Safety rule

Never commit API keys, passwords, private credentials, identity documents or sensitive client information.

## Client boundary

Client projects must not be represented as personal Farouk-owned IP merely because Farouk created or managed the repository.

## Duplicate rule

Do not delete or archive a repository solely because its name resembles another repository. Inspect contents, commits, deployments and provenance first.
