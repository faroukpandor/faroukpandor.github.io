# Website & Digital Presence Health Check — Delivery Checklist

**Status:** Reusable template; not yet validated on a client site.
**Service:** Fixed-scope review of one public website, up to 10 key pages.
**Commercial status:** Draft service. Test prices are hypotheses, not verified market rates.
**Revision:** 2026-10-19

## Before review — scope and permission

- [ ] Record client/business name, authorised contact, website URL, review date, objective and deadline.
- [ ] Confirm the client controls the site or has authority to request the review.
- [ ] Define pages and journeys included (e.g. home → product/service → contact/booking).
- [ ] Confirm whether authenticated pages or form submission tests are authorised. Never submit fake data to a live business form without approval.
- [ ] Record accessibility needs, language and primary device/network constraints.
- [ ] Agree deliverables, exclusions, price, payment terms and acceptance criteria in writing.
- [ ] Exclude penetration testing, exploit attempts, load testing, legal certification and guaranteed SEO/ranking claims.
- [ ] Use public/synthetic data in sample reports; keep client secrets and personal data out of public repositories.

## Evidence capture standard

For each finding, record:
- Finding ID and date/time
- Exact URL/page and steps to reproduce
- Device/browser and method (manual or tool-assisted)
- Evidence (screenshot or safe excerpt, with personal data redacted)
- Observed behaviour vs expected behaviour
- User/business impact
- Severity: Critical / High / Medium / Low / Informational
- Confidence: Confirmed / Likely / Unverified
- Recommended next action and who should own it

Never present an untested hypothesis as a confirmed defect. Mark inaccessible, blocked, or not tested explicitly.

## Review checklist

### 1. Reachability and navigation
- [ ] Homepage responds and renders.
- [ ] Key service/product pages respond.
- [ ] Internal navigation and primary CTA destinations work.
- [ ] Broken links and redirect loops checked.
- [ ] Unknown path behaviour checked where appropriate.
- [ ] Mobile layout checked at a narrow viewport.

### 2. Enquiry and conversion path
- [ ] Primary offer and intended audience are clear.
- [ ] Contact route is visible and consistent.
- [ ] Email/telephone/WhatsApp links point to the expected destination.
- [ ] Forms are inspected for required fields, validation, consent language and clear errors.
- [ ] Successful submission is not claimed unless delivery/storage is verified with permission.
- [ ] Thank-you/success messages are not mistaken for proof of backend delivery.
- [ ] No real enquiry is submitted without authorisation.

### 3. Content and trust
- [ ] Business name, address, contact details and hours are consistent where shown.
- [ ] Claims, prices, availability, certifications and testimonials have identifiable support.
- [ ] Content is current enough for the service offered.
- [ ] Images/logos appear authorised and appropriate.
- [ ] Privacy notice and terms are discoverable where relevant.
- [ ] No false scarcity, fabricated social proof or unsupported guarantees.

### 4. Basic search and metadata
- [ ] Page title and meta description are present and relevant.
- [ ] Heading structure is understandable.
- [ ] Canonical/robots/sitemap are inspected when applicable.
- [ ] Images have useful alternative text where meaningful.
- [ ] Link text is understandable out of context.
- [ ] Structured data is checked only if appropriate and safely verifiable.

### 5. Basic accessibility and usability
- [ ] Keyboard navigation and visible focus spot-checked.
- [ ] Form fields have labels.
- [ ] Contrast and text scaling spot-checked; do not claim a full WCAG audit.
- [ ] Buttons and links are distinguishable and usable.
- [ ] Error messages explain how to recover.
- [ ] Mobile text, tap targets and page flow are usable.

### 6. Basic performance and technical signals
- [ ] Page load behaviour noted under stated conditions.
- [ ] Large images and obviously heavy assets noted.
- [ ] HTTPS/certificate status checked with a safe browser-level check.
- [ ] Browser console only inspected if authorised and available.
- [ ] Security headers are observations only; no exploit attempts or penetration-test claim.
- [ ] Third-party scripts, cookies and external embeds noted where visible.
- [ ] Automated metrics include tool name, date, URL and limitations.

## Severity guide

- **Critical:** confirmed issue creates immediate serious user harm, major exposure or complete loss of core function. Escalate promptly; do not exploit or access data.
- **High:** core conversion/service flow fails, sensitive data appears exposed, or a major user journey is blocked.
- **Medium:** material friction or reliability issue with a workaround.
- **Low:** limited polish, content or minor usability issue.
- **Informational:** improvement opportunity or unverified concern.

Severity must reflect observed evidence and impact, not visual preference.

## Final report structure

1. Executive summary: scope, date, limitations and overall status.
2. What was checked and what was not checked.
3. Findings table: ID, priority, evidence, impact, confidence and next action.
4. Conversion path walkthrough.
5. Quick wins (low effort / high impact).
6. 30-day recommended action plan.
7. Appendix: URLs, test conditions, source/tool notes.
8. Explicit exclusions: not a penetration test, legal compliance certification, full accessibility audit or ranking guarantee.

## Quality gate before delivery

- [ ] Every finding has evidence and a confidence label.
- [ ] Observed facts are separated from recommendations and assumptions.
- [ ] Client names, personal information, credentials and private URLs are redacted from samples.
- [ ] Any issue involving possible personal-data exposure is escalated privately, not published.
- [ ] The report has been proofread and links rechecked.
- [ ] Delivery time and direct costs are logged for pricing/margin learning.
- [ ] Client has a clear next step and a short handover is scheduled.

## Sample audit status

**No sample audit findings are asserted in this file.** The candidate MOKORO live hosts were not accessible through the current web inspection path, and no local build or live verification command was run in this execution. Use a public demo/test site or a client-authorised URL, then record actual observations before marking this gate complete.
