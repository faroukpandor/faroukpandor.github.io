# Prepared Issue Updates — 27 October 2026

**Status:** NOT POSTED. The GitHub integration token in this session can read issues and create pull requests, but returned `403 Resource not accessible by integration` for issue-comment writes. These texts are kept here so the owner can paste them verbatim, or re-run the update after granting the integration issue-write permission.

**Why this matters:** the evidence should sit next to the opportunity it closes, not only in a document. Until these are posted, issues #136 and #79 do not show the 30 October 2026 deadline escalation in their timelines. Pull request #145 references both issues.

---

## Paste into issue #136

## Audit update — 27 October 2026: inspection complete, recommend N/A for this repository

A read-only inspection was completed at commit `6d8bf0f` on the working branch. Full reproducible commands and findings: [EVID-2026-10-27-001](https://github.com/faroukpandor/faroukpandor.github.io/blob/arena/137b7da2-faroukpandor-github-io/docs/evidence/SUPABASE-DATA-API-GRANT-CHANGE-AUDIT-2026-10-27.md).

**Findings**
- No `supabase`, `postgrest`, `graphql`, `anon`/`service_role` key names, `supabase.co` or `createClient` references in any tracked file: all Markdown, the four published HTML pages, the CSS, both workflows, JSON/CSV, and the two fetched third-party HTML snapshots.
- No `package.json`/lockfiles, `.env*`, SQL, migration, `supabase/` config, schema file, Docker/Terraform config or server-side code. No database client initialisation.
- External URLs in published pages are outbound links only; there is no data-API endpoint, client library or analytics/tracking tag.
- Deployment is a static GitHub Pages artefact plus a snapshot-fetch workflow. Neither uses a database.

This closes the "check JavaScript/HTML, workflows and deployment configuration" gap left in the 23 October comment.

**Official change verified today** against the [Supabase changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically): on **30 October 2026** the behaviour is enforced on all existing projects; **existing tables keep their grants**, but new `public` tables need explicit `GRANT` statements in the same migration that creates them. Grants and RLS are separate controls; sequence privileges are a separate check; direct Postgres connections are unaffected; do not apply blanket CRUD grants.

**Conclusion:** this repository does not use the Supabase Data API, so there are no tables or migrations here to change. No code, secret, database, deployment, purchase or client-owned change was made.

**Escalation (the real exposure):** [issue #79](https://github.com/faroukpandor/faroukpandor.github.io/issues/79) records that the Khaie OS operations page requires tenant-scoped Supabase setup. That product **is** affected by the 30 October change even though this static repository is not. The grants/RLS checklist is routed to #79 rather than opening a duplicate opportunity (see section 4 of the evidence record).

**Requested decision:** if you accept the evidence, close this issue as not applicable for this repository, with the portfolio-level action tracked on #79 before 30 October 2026.

---

## Paste into issue #79

## PM escalation — Supabase default-grant change takes effect 30 October 2026

Your production-readiness gates already require verification of source, deployment and database policies. This is a dated, vendor-enforced reason to do that verification this week.

**Verified 27 October 2026** against the [official Supabase changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically): from **30 October 2026**, newly created tables in the `public` schema of **existing** projects are not exposed to the Data API automatically. Existing tables keep their current grants; the break appears the first time a new table is created without an explicit `GRANT`. Applies to Data API clients (PostgREST, GraphQL, `supabase-js`, `/rest/v1/`); direct Postgres connections are unaffected. RLS remains a **separate** control, and sequence privileges (`USAGE, SELECT`) need their own check. The vendor recommends bundling grants with `ENABLE ROW LEVEL SECURITY` and policies in the same migration, and warns against blanket CRUD grants.

A read-only audit of this portfolio repository found **no Supabase usage at all** — see [EVID-2026-10-27-001](https://github.com/faroukpandor/faroukpandor.github.io/blob/arena/137b7da2-faroukpandor-github-io/docs/evidence/SUPABASE-DATA-API-GRANT-CHANGE-AUDIT-2026-10-27.md) and issue #136. Because this issue records a tenant-scoped Supabase dependency for Khaie OS, the portfolio-level risk sits here instead.

**Single proposed next action (before 30 October):** confirm the canonical source repository URL and access, then in a **non-production** environment — inventory `public` tables created by migrations/provisioning, identify which are intentionally API-accessible, add the minimum explicit `GRANT` statements in the same migration that creates each table, verify RLS enablement and tenant-isolation policies separately, check sequence privileges, and test clean migration replay, `supabase db reset`, preview/branch provisioning and role-specific API access. Record the test evidence in a reviewed PR.

Do not change production, operator data, passenger/staff records or any client-owned asset without the relevant approval. No database, deployment or account change was made as part of this escalation.

---

## Record

- Prepared: 27 October 2026, 12:45 CAT.
- Attempted delivery: `gh issue comment 136` and direct REST POST — both refused with 403.
- No issue state was changed, closed, labelled or assigned.
- Related: [EVID-2026-10-27-001](./SUPABASE-DATA-API-GRANT-CHANGE-AUDIT-2026-10-27.md) · [daily brief](../DAILY-BRIEF-2026-10-27.md) · [PR #145](https://github.com/faroukpandor/faroukpandor.github.io/pull/145).
