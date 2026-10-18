# Self-Reliance Field Guide — MVP Decision and Acceptance Spec

**Status:** Proposed specification; implementation blocked on customer-validation evidence.
**Canonical home:** To be confirmed after portfolio ownership review. This document belongs in the personal portfolio planning layer only; it does not authorise a new repository, production deployment, or edits to other projects.
**Product name:** “Self-Reliance Field Guide” is a working title, not a cleared brand.

## Product thesis

Help a clearly defined Southern African household complete one practical task with less uncertainty, lower avoidable cost or less waste. The product should turn useful, sourced information into a next action—not become a generic survival blog, an unbounded AI chatbot, or ten loosely related websites.

## Gate 0 — prove the problem

No MVP implementation until the Customer Validation Sprint identifies one winning problem hypothesis and documents evidence against the explicit gates. If no hypothesis passes, do not build.

Required decision record:
- Target user and context:
- Job to be done:
- Evidence of repeated recent behaviour:
- Existing alternatives/workarounds:
- User-tested success criterion:
- Primary risks and source requirements:
- Proposed first offer and price-test method:
- Evidence that would cause us to stop:

## MVP shape after Gate 0

Choose exactly one primary workflow based on observed evidence. Candidate formats:

1. **Water-smart growing planner:** inputs limited to broad climate/season, growing space, water constraint and budget; output a transparent planning worksheet with assumptions and source links. Do not promise yields or give unsupported local planting calendars.
2. **Pantry and household stock tracker:** manual item, quantity, unit, expiry/best-before date and notes; local-device-first storage, export/print and clear deletion/reset controls. No account required for the first version.
3. **Household readiness prioritiser:** simple needs inventory and action checklist ordered by user-selected constraints; no fear-based scoring or claims that a household is “safe” or “disaster-proof”.

Only one is selected after interviews. Do not combine them into a feature-heavy suite at launch.

## Delivery constraints

- Mobile-first and usable on low-bandwidth connections.
- HTML-first; printable and downloadable output where useful.
- Core task works without an AI API. AI may not be required for the first release.
- Free-first, portable, no vendor lock-in; avoid accounts, analytics trackers and external dependencies unless a measured need justifies them.
- No sensitive data collection. If personal entries are needed, prefer local storage with clear export/reset behaviour and explain device/browser limits.
- Semantic HTML, keyboard accessibility, readable contrast, clear error states and short instructions.
- Plain-language sourcing: title, publisher/author, URL, access/review date, and which claim the source supports.
- No invented local data, automated diagnosis, guaranteed outcomes or unsafe instructions.
- A simple contact/feedback path may be tested manually; do not build CRM/automation before real volume justifies it.

## Acceptance criteria (all required)

**Customer value**
- A target user can complete the single core task without coaching.
- At least 4 of 5 prototype testers can complete the core task unaided; record failures and revise.
- At least 3 testers can accurately explain the output and its limitations.
- Task completion is measured; praise alone is not acceptance.

**Content and evidence**
- Every consequential factual claim has a traceable source or is explicitly labelled as an assumption.
- No medical claims, fake testimonials, false scarcity, copied content or unsupported savings/yield claims.
- Limitations, units, date assumptions and local applicability are visible.

**Technical**
- Works on a current Android mobile browser and desktop browser.
- No blocking runtime errors in the tested core flow.
- Works on a slow connection; core content is available without a third-party API.
- If data is stored locally, refresh behaviour, export, reset and failure cases are tested.
- Inputs are validated; outputs are reproducible from the displayed assumptions.
- No secrets, private keys, or service credentials in client-side code or repository.
- Basic accessibility checks cover labels, focus order, keyboard use, headings and contrast.

**Trust and privacy**
- Privacy notice explains exactly what is and is not collected.
- No analytics or tracking by default.
- Feedback and contact are voluntary; consent is explicit before follow-up.
- No user-submitted private details are published in logs, issues or repository commits.

**Commercial**
- Free resource has a clear next step, but no manipulative popups or fake urgency.
- Any paid offer states price, currency, deliverables, exclusions, delivery time and refund/cancellation terms before payment.
- Do not accept payment until fulfilment, support, legal/tax obligations and payment handling have been reviewed.
- Measure meaningful actions (completed task, opted-in follow-up, referral, paid commitment), not impressions alone.

## Release sequence

1. Validation sprint.
2. Written decision and ownership check.
3. Low-fidelity paper/HTML prototype with synthetic data.
4. Five moderated usability tests; revise.
5. Source, privacy, security and commercial review.
6. Manual, limited pilot with explicit consent.
7. Release only after acceptance criteria pass and the owner approves.
8. Post-pilot review: task completion, repeat use, support burden, conversion evidence, complaints and stop/continue decision.

## Required repository-level evidence before coding or deployment

- Confirm canonical repository and owner.
- Inspect current branch, build scripts, license, accessibility and security posture.
- Identify existing components/tools that can be reused without scope confusion.
- Open a focused feature branch and draft PR; do not commit directly to main.
- Include tests and a rollback/disable path.
- Confirm preview deployment and test the actual URL before claiming success.
- No client/employer repository modifications without explicit written authorization.

## Initial measurement sheet

| Metric | Definition | Threshold / decision |
|---|---|---|
| Interview completion | Useful interviews completed | At least 8 before deciding |
| Problem recurrence | Independent users reporting same recent problem | At least 5 |
| Workaround evidence | Users already trying to solve it | At least 3 |
| Prototype opt-in | Users consent to test | At least 3 |
| Task completion | Testers complete core task unaided | At least 4 of 5 |
| Meaningful next action | Follow-up request, referral, or paid commitment | Record separately; never inflate |
| Safety/source failures | Unsupported or unsafe consequential claims | Zero before release |
| Fulfilment viability | Deliverable, cost, support and obligations understood | Must be reviewed before paid test |

These are decision thresholds for this experiment, not claims about typical conversion or market performance.
