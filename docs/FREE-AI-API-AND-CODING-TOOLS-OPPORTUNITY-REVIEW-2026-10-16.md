# Free AI APIs and Coding Tools — Opportunity Review

**Reviewed:** 2026-10-16  
**Evidence supplied:** Reddit discussion, “Which APIs do you use for FREE - Best free options for CODING,” posted approximately one year before the review.  
**Status:** Research triage and proposed adoption only. No provider account, key, API integration, deployment, or usage entitlement has been verified.

## Executive decision

Use a **free-first, provider-direct, least-privilege** approach. Start with free coding assistants that do not require building an API integration, then test a small number of API providers for specific workloads. Do not build a multi-provider proxy or add API integrations to every repository just because a Reddit comment reports generous limits.

The thread is useful for discovery, not as reliable evidence of today's pricing, quotas, model availability, terms, or security. Claims such as “unlimited,” “not rate limited,” “$300 credit,” and “nearly unlimited” are anecdotal and time-sensitive. Check the official provider dashboard and terms immediately before adoption.

## Opportunity assessment

| Candidate | Best potential use | Free-resource fit | Decision |
|---|---|---|---|
| Gemini Code Assist / Gemini in supported developer tools | Coding assistance, code explanations, review while developing | Strong first test where the current free plan is available | **Test first**; confirm current quota and data-use terms |
| Google AI Studio / Gemini API | Prototyping AI features and evaluating Gemini models | Potentially useful free tier, subject to model/region quotas and terms | **Test second** for a narrowly scoped prototype; never assume API access is the same as a coding-assistant allowance |
| OpenRouter free models | Compare multiple models through one interface; low-cost experiments | Useful for evaluation, but free-model availability, limits and context can change | **Optional evaluation route**; set budgets and check each model's current policy |
| GitHub Copilot Free / other GitHub-supported coding features | Inline completion and coding assistance | Convenient if current free plan and limits meet needs | **Use if eligible**; verify current plan limits rather than relying on older comments |
| Google Jules or similar hosted coding agents | Delegated coding tasks and repository changes | May have a free allowance, availability and task limits | **Trial for non-sensitive, reviewable tasks**; inspect every diff before accepting |
| LiteLLM proxy / Cloudflare Worker key router | Unified routing, logging or controlled fallback across providers | Technically possible, but adds engineering, security and maintenance work | **Defer** until measured usage proves a real bottleneck; never rotate keys to evade provider limits |
| Reverse proxy using a ChatGPT session cookie | Attempt to turn a consumer subscription session into an API endpoint | Not an acceptable foundation | **Reject**: session-cookie exposure, account-security risk, unsupported access pattern and possible terms violations |
| Shared or publicly posted API key | Quick access to someone else's balance | Unreliable and unsafe | **Reject**: never use or redistribute exposed keys; revoke and report them where possible |

## Official starting points

These are provider/product entry points, not guarantees of a free quota. Check the current pricing, eligibility, supported regions, model list, data handling and terms before use.

- [Google AI Studio](https://aistudio.google.com/) — prototype and manage Gemini API access.
- [Gemini API pricing and free-tier details](https://ai.google.dev/gemini-api/docs/pricing) — confirm model-specific quotas and charges.
- [Gemini Code Assist](https://codeassist.google/) — coding-assistant plan and eligibility.
- [GitHub Copilot plans](https://github.com/features/copilot/plans) — current plan allowances.
- [OpenRouter models](https://openrouter.ai/models) — check current model pricing/availability; filter for free models and inspect per-model limits.
- [OpenRouter API documentation](https://openrouter.ai/docs) — integration details and provider/model behaviour.
- [LiteLLM documentation](https://docs.litellm.ai/) — only if a proxy is later justified.
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) — check current free limits before designing any routing service.
- [Google Jules](https://jules.google/) — check current access and task allowances.

## Recommended implementation sequence

1. **No-code/low-friction baseline:** test the available free coding assistant in the editor already in use. Measure whether it can complete a small, non-sensitive task reliably.
2. **One API proof of concept:** if a product feature genuinely needs model calls, use one provider and one low-risk workflow. Record model, purpose, quota, terms checked date, latency, output quality, and fallback.
3. **Provider comparison:** compare one Gemini option with one currently available OpenRouter free model on the same small task. Evaluate correctness, context limits, rate limits and review time—not benchmark claims alone.
4. **Security:** store secrets only in local ignored environment files for local development and in the relevant host's encrypted secret store for deployed functions. Never commit keys, put them in browser-visible variables, embed them in static frontend bundles, or paste them into public issues. Use separate keys per project/environment, restrict permissions where supported, set budget/usage alerts where available, and rotate any key suspected of exposure.
5. **Human review:** generated code must pass tests, dependency/security checks and human review. No autonomous production deployment, client-repository change, external outreach, or financial/clinical decision based solely on model output.
6. **Only add routing when justified:** document measured quota exhaustion and the value of failover before adopting LiteLLM or a Worker. Respect each provider's quotas and terms; do not use key rotation to circumvent limits.

## Portfolio routing — proposed responsibilities

- **Canonical policy, links, evidence date and provider register:** this portfolio repository.
- **AI-Powered-Personal-Command-Center / AI-Personal-Command-Center:** potential personal dashboard for a *non-secret* inventory of provider name, purpose, console URL, status, owner/project, last checked date and setup instructions. Do not store raw API keys in repository files or ordinary app data. These similarly named repositories are not presumed duplicates; compare them before choosing a canonical implementation.
- **MOKORO Digital Growth Engine:** add a provider integration only where a validated agency workflow needs it, using server-side secrets and a documented fallback. Do not turn the website into a generic key vault.
- **AgriSage360 and other specialist apps:** adopt a provider only after a use-case test demonstrates domain value, acceptable costs/quotas and data governance. Keep core farm records and offline workflows functional without an AI API.
- **Client/third-party repositories (including YellowBlue and other client assets):** no integrations or secret changes without explicit authorization.

These are routing recommendations, not evidence that integrations exist or have been deployed.

## Minimum provider register fields

Record: provider/product; official console and pricing URLs; free-tier eligibility checked; quota/limits checked; permitted use/data retention checked; intended project and purpose; secret storage location (never the secret itself); key restrictions; fallback; last verified date; test result; owner/change authority.

## Source note and limitations

The supplied Reddit discussion is dated roughly a year before this review and includes user anecdotes, conflicting reports, promotional claims and a publicly posted API key. None of those statements establishes current entitlements or safe practice. Do not copy, test or republish any exposed key from the thread. This review is a triage of potential uses, not a live audit of provider accounts or a completed repository-wide implementation.

## Acceptance checklist

- [ ] Confirm current provider terms, free quota and eligibility from official pages.
- [ ] Test one coding assistant on a non-sensitive task and record results.
- [ ] Test one API only if a concrete product workflow requires it.
- [ ] Confirm no secrets are committed or exposed in client-side bundles.
- [ ] Compare the two command-centre repositories before any consolidation.
- [ ] Reassess proxy/routing only after actual quota and reliability measurements.
