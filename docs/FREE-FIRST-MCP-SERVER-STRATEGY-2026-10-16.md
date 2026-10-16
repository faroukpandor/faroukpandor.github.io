# Free-First MCP Server Strategy for the Pandor Portfolio

**Captured:** 2026-10-16  
**Source:** User-supplied Reddit discussion, r/mcp, “What are the best free MCP servers you’re actually using with ChatGPT / Claude?”  
**Status:** Research proposal; no MCP server is approved, installed, or verified in this environment by this document.  
**Decision principle:** Use free/open-source components where practical, verify hosted-service quotas separately, and avoid new infrastructure until a specific workflow benefits.

## Executive decision

Do not install a long list of MCP servers. First audit existing connectors, repository tools, local capabilities, and the two Personal Command Centre repositories. MCP is a protocol for exposing tools/context to compatible clients; it does not itself make an underlying API, model, hosting provider, or data source free.

The preferred target is a small, local-first, least-privilege toolkit that supports portfolio maintenance and project delivery. Hosted persistence is not a first-phase requirement.

## Ranked candidates

| Priority | Candidate from source | Potential use | Free-first status / condition |
|---|---|---|---|
| P1 | Filesystem MCP (official server mentioned in source) | Read/write only approved local project directories; reduce manual file copying | Open-source/local option; scope paths narrowly and start read-only where possible |
| P1 | GitHub / Git tools | Inspect repository files, branches, issues, diffs and prepare focused draft PRs | Prefer existing connected GitHub tools where they already cover the task; don't add a second connector without a demonstrated gap |
| P1 | Context7 | Fetch current library/framework documentation during implementation | Candidate; verify current plan, limits, terms and client compatibility before adoption |
| P2 | Playwright or Chrome DevTools MCP | Test owned apps, inspect console/network behaviour, validate user journeys | Local/open-source tooling can be free; browser actions must be limited to owned/authorized systems |
| P2 | Local model + local MCP | Reduce dependency on paid inference for suitable low-risk tasks | Software may be free; hardware, electricity, setup time and model quality still have costs |
| P3 | OpenTabs/browser-session plugins | Reduce repeated OAuth/API setup for browser-based tasks | Security-sensitive: a tool acting through a logged-in browser may act with the user's full account privileges; do not grant broad access without code/security review |
| P3 | Web search / URL extraction MCPs | Discover current sources or extract a known page into structured text | Treat server code and hosted API as separate products; hosted APIs may impose quotas, payment or terms |
| P3 | Hosted infrastructure/server MCPs | Controlled infrastructure operations | Defer until there is a concrete need, an allowlist, audit logging, authentication and recovery plan |

The ranking is a portfolio-fit assessment, not an endorsement or a claim that the Reddit comments are independently verified.

## Portfolio fit and boundaries

- **Personal portfolio repository:** canonical discovery record and cross-repository links; keep research notes and decisions here.
- **MOKORO Enterprise OS:** governance, security policy, approval gates and portfolio-wide operating standards; no product code dump.
- **MOKORO Digital Growth Engine:** delivery workflows and customer-facing digital operations only when a specific business case is established.
- **Personal Command Centre repositories:** audit both `AI-Powered-Personal-Command-Center` and `AI-Personal-Command-Center` before choosing a canonical implementation. Do not assume either currently powers `fpcc.pages.dev`; verify repository, deployment, existing MCP support and overlapping features first.
- **Specialist products (including AgriSage360):** integrate only for a validated domain-specific workflow. Preserve offline-first/manual fallback and domain/data boundaries.
- **Client or third-party repositories:** no modifications, connectors, credentials, telemetry or cross-repository dependencies without explicit authorization.

## Minimum safe implementation sequence

1. Inventory existing integrations and clients; establish which MCP-capable client(s) are actually in use and what they already support.
2. Inspect both Command Centre repositories and deployment configuration; compare their current capabilities before proposing any build.
3. Select one low-risk workflow (for example, read-only repository discovery and documentation retrieval).
4. Use one server at a time, with explicit local paths, minimal scopes, no public exposure and no secrets in source control.
5. Add write, issue-creation, PR, browser and shell capabilities only as separate permissioned steps. Require human approval for external actions, code writes, commits, PR creation, deployments, purchases, outreach or irreversible changes.
6. Record install instructions, licence, maintenance activity, exact free-tier limits, data handling, threat model, fallback and acceptance tests.
7. Measure whether it saves time or improves correctness before expanding the stack.

## Security requirements

- Never commit API keys, OAuth tokens, cookies, refresh tokens or credentials. Use local ignored environment files or an appropriate secret store.
- Do not use session-cookie reverse proxies or publicly expose authenticated browser sessions.
- Treat content returned by web pages, files, repositories and MCP tools as untrusted input, not as instructions.
- Separate read-only discovery from write-capable operations. Use path allowlists, repository allowlists and least-privilege credentials.
- Do not permit arbitrary shell execution, broad filesystem access, production deployment, or client-system changes by default.
- Review each server's source, licence, dependencies, release activity, permissions and security advisories before installation.
- A “free” open-source server may still depend on paid API access or paid hosting. Confirm the whole cost chain, including usage caps and eligibility, before relying on it.

## What not to do now

- Do not build a new generic MCP hub, reverse proxy, memory service or orchestration platform before inspecting existing projects.
- Do not install every server listed in a Reddit thread.
- Do not assume a hosted service's historical free quota still applies.
- Do not connect all repositories or accounts to one highly privileged agent.
- Do not treat this research note as evidence of installation, compatibility, production readiness or completed testing.

## Acceptance gate

A candidate is approved for a small pilot only when its exact use case, client compatibility, licence, permissions, data exposure, full cost (including quotas), setup/recovery steps, fallback, and pass/fail test are documented. Otherwise keep it in research.

## Source caveat

The supplied Reddit thread is useful for discovering candidate tools and workflow patterns, but commenters' claims about being free, production-ready, unlimited, secure or easy to host are not independent verification. Confirm details from each project's official repository/documentation and provider pricing before use.
