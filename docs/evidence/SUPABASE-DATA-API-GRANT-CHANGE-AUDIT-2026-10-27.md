# Evidence Record — Supabase Data API Grant Change (30 Oct 2026)

**Record ID:** EVID-2026-10-27-001
**Date of inspection:** 27 October 2026, 10:34–10:45 UTC (12:34–12:45 CAT)
**Repository / revision:** `faroukpandor/faroukpandor.github.io`, branch `arena/137b7da2-faroukpandor-github-io`, commit `6d8bf0f`
**Trigger:** [issue #136](https://github.com/faroukpandor/faroukpandor.github.io/issues/136) — engineering action for the Supabase breaking change taking effect 30 October 2026.
**Scope:** read-only audit of this repository only. No code, database, secret, deployment, account or client-owned change was made.

---

## 1. Official change verified

The [official Supabase changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically) was retrieved and read on 27 October 2026. Confirmed points:

- On **30 October 2026** the new behaviour is enforced on **all existing projects**: newly created tables in the `public` schema are **not** exposed to the Data API automatically.
- **Existing tables keep their current grants** and stay reachable. The break appears the first time a new table is created without an explicit `GRANT` after the change — including tables created by migrations, the CLI, the Management API, MCP or AI coding tools.
- Affected: apps using the Data API (PostgREST, GraphQL, `supabase-js`, client libraries, direct `/rest/v1/` or `/graphql/v1`). Unaffected: apps talking to Postgres over a direct connection (psql, ORM, app server connection string).
- **Grants and Row Level Security are separate controls.** The recommended migration bundles `GRANT ...` statements with `ENABLE ROW LEVEL SECURITY` and policies in the same migration. Sequence privileges (`USAGE, SELECT`) must be considered separately.
- Do **not** apply blanket CRUD grants. The changelog's own example grants `SELECT` to `anon` and only the privileges each role actually needs to `authenticated` / `service_role`.
- The dashboard's Data API exposure badge and Security Advisor list affected tables. The vendor states it emailed a final notice on 23 October 2026.
- See also the [official discussion](https://github.com/orgs/supabase/discussions/45329) referenced in issue #136.

---

## 2. Inspection method (reproducible)

All commands were run from the repository root against the working tree at the revision above.

```bash
# 1. Search every tracked file (including HTML, CSS, workflows, JSON, CSV and Markdown)
git grep -in -E 'supabase|postgrest|graphql|anon[_-]?key|service[_-]?role|sb_access|supabase\.co|createClient\(' -- . ':!*.html' ':!data/market-signals/*.html'

# 2. Search the two fetched third-party HTML evidence snapshots separately
grep -ril -E 'supabase|postgrest|graphql' data/market-signals/*.html

# 3. Look for manifests, migrations, SQL, environment/config and deployment files
git ls-files | grep -iE 'package(-lock)?\.json|yarn\.lock|pnpm|requirements|pyproject|composer|\.sql$|migration|supabase|schema\.sql|docker|terraform|\.env|wrangler|vercel|netlify|next\.config|vite\.config'

# 4. Enumerate all external URLs referenced by the four published HTML pages
grep -rhoE 'https?://[^"'"'"' <)]+' index.html portfolio.html professional-record.html portfolio-map.html | sort -u

# 5. Inventory the tracked file types
git ls-files | sed 's/.*\.//' | sort | uniq -c | sort -rn
```

## 3. Findings

| Check | Result |
|---|---|
| `supabase`, `postgrest`, `graphql`, `anon`/`service_role` key names, `createClient` in any tracked file | **No matches** |
| Same terms in the fetched `data/market-signals/*.html` snapshots | **No matches** |
| `package.json`, lockfiles, `pyproject`, `requirements`, `.env*`, `wrangler`, `vercel`, `netlify`, Docker/Terraform files | **None present** |
| `.sql`, migration, `schema.sql`, `supabase/` config directory or CLI config | **None present** |
| External URLs in published pages | Only outbound links: GitHub profile/repositories, LinkedIn, `agrisage360.vercel.app`, `mokoro-dge.pages.dev`, own GitHub Pages URLs, `schema.org`, `w3.org` SVG namespace. **No data-API endpoint, no client library, no analytics/tracking tag.** |
| Tracked file types | 120 Markdown, 6 HTML, 5 JSON, 3 CSV, 2 YAML, 2 JPEG, 1 CSS, XML/TXT/ignore files — a static documentation and publishing repository |
| Deployment | `.github/workflows/pages.yml` uploads the repository root as a static GitHub Pages artefact; `.github/workflows/market-signal-monitor.yml` fetches three public pages and commits HTML/JSON snapshots. Neither workflow initialises a database client. |

**Conclusion:** for this repository, issue #136 is **not applicable**. It is a static site with no Supabase project, no Data API client, no SQL migrations, no server-side code and no environment-configured database connection. There are no `public` tables here to migrate. This closes the "inspect JavaScript/HTML, workflows and deployment configuration" gap left by the 23 October audit comment.

**Limitations:** a repository scan cannot prove that no external service, browser bookmark, deployment environment or untracked local configuration exists. It also cannot see other repositories or Supabase projects owned by the same account. That is why section 4 matters.

---

## 4. Portfolio-level escalation (the real risk)

[Issue #79](https://github.com/faroukpandor/faroukpandor.github.io/issues/79) records that the live Khaie OS operations page "requires provisioned owner/supervisor email and tenant-scoped Supabase setup". A Supabase-backed product elsewhere in the portfolio **is** affected by the 30 October change, even though this static repository is not.

Before 30 October 2026, the owner of that canonical repository should:

1. Confirm the canonical source repository and deployment connection before changing code (gate already listed in #79).
2. Inventory tables in `public` created by migrations or provisioning, and identify which are intentionally exposed through the Data API.
3. Add the **minimum explicit `GRANT` statements in the same migration** that creates each new table; review `USAGE, SELECT` on sequences where applicable.
4. Verify RLS enablement and tenant-isolation policies as a **separate** control; a grant is not a substitute for RLS.
5. Do not grant blanket CRUD to `anon`, `authenticated` and `service_role`. Passenger, staff and payment-adjacent data stay private unless a documented access requirement says otherwise.
6. Test a clean migration replay, `supabase db reset`, preview/branch provisioning and role-specific API access in a **non-production** environment; record the test evidence.
7. Keep secrets out of browser bundles; prepare a reviewed PR before any production rollout, with operator approval where a pilot is involved.

A missing grant causes PostgREST to return `42501 permission denied for table` rather than a silent failure — a detectable but service-interrupting fault. A blanket grant avoids the interruption at the cost of a security exposure. Neither is acceptable for passenger-facing data.

---

## 5. Record

- **Status:** COMPLETE for this repository; ESCALATED for Supabase-using portfolio products.
- **Owner of next action:** Farouk Pandor.
- **Next action (single):** confirm the Khaie OS canonical repository URL/access and run the grants/RLS checklist above before 30 October 2026.
- **Decision requested:** close issue #136 as not applicable for this repository; keep the escalation attached to issue #79 rather than opening a duplicate opportunity.
- **Evidence retained:** this record, the linked issue comment, and the reproducible commands above.
- **No production change, purchase, credential use, deployment or external contact was made.**
