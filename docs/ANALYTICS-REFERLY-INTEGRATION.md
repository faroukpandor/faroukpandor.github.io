# Google Analytics and Referly setup

## Scope and current state

- Canonical site: https://faroukpandor.github.io/
- Source repository: https://github.com/faroukpandor/faroukpandor.github.io
- Hosting: GitHub Pages (static HTML).
- The inspected homepage source does not currently contain a Google Analytics tag or a Referly tracking script.
- No Google Analytics Measurement ID has been supplied, and account-level GA4/Referly authorisation has not been performed.
- This document is a setup checklist only. It does not activate tracking.

## Recommended integration path

### A. Measure the personal website with GA4

1. Sign in at https://analytics.google.com/ using the Google account that should own the property.
2. Create or select a GA4 property for **Farouk Pandor – Personal Website**.
3. Add a Web data stream for exactly `https://faroukpandor.github.io`.
4. Copy the stream's Measurement ID (format: `G-XXXXXXXXXX`).
5. Before changing the website, search the repository again for existing tags so that duplicate pageview events are not introduced.
6. Add the official Google tag immediately after the opening `<head>` in the shared HTML document (currently `index.html`). If future pages have independent HTML documents, tag those pages too.
7. Commit the change to a review branch and open a pull request. Do not merge or publish until the Measurement ID is confirmed and the diff is reviewed.
8. After deployment, visit the public website and confirm the visit appears in GA4 Realtime. Allow time for reporting to populate.

Official instructions: https://support.google.com/analytics/answer/14183469

### B. Connect GA4 to Referly for audience verification

Referly's privacy policy describes an optional Google account connection that requests read-only Google Analytics access to list properties for website verification and share aggregate metrics.

1. Sign in at https://www.referly.so/.
2. Open the affiliate/creator profile's website verification or connected-account settings.
3. Choose the Google Analytics connection, if offered for the account.
4. Sign in with the same Google account that can access the GA4 property.
5. Review the permission screen and grant only the requested read-only access if comfortable.
6. Select the property for `https://faroukpandor.github.io` and complete Referly's verification.
7. Confirm the connected property and displayed metrics in Referly.

This route is separate from installing a referral-sales tracker. DNS records are not a substitute for the GA4 website tag.

Referly privacy policy: https://www.referly.so/privacy-policy

### C. When to install Referly's website tracking script

Only install Referly's tracking script if the goal is to operate a Referly affiliate/referral programme and attribute referrals or sales on a website that you control and that is part of that programme. Connecting GA4 to a creator profile for audience verification does not, by itself, require that script.

Before installing any Referly script, confirm:
- The exact programme/site in Referly that owns the script.
- The exact script URL and required programme identifier copied from the authenticated Referly dashboard.
- Whether the site actually has an eligible conversion event (for example, a lead form submission or completed purchase).
- What the integration tracks, what data is transmitted, and whether a privacy notice or consent controls are needed.

Do not copy a demo snippet or another company's programme identifier into this site. Do not place private API keys in browser JavaScript.

Referly integration overview: https://www.referly.so/integrations

## DNS guidance

Do not add DNS records just to enable Google Analytics on the `github.io` subdomain. DNS cannot install a pageview tag. DNS verification should be used only if a service explicitly requests a specific record for a domain you control. The `github.io` subdomain itself is managed by GitHub; it is not a domain for which this repository owner can independently create arbitrary DNS records.

## Acceptance checklist

- [ ] Confirm the GA4 property and Web data stream belong to the intended Google account.
- [ ] Confirm the Measurement ID starts with `G-` and matches the website stream.
- [ ] Confirm no duplicate Google tags or duplicate pageview events.
- [ ] Review the exact code diff before merge.
- [ ] Deploy only after review.
- [ ] Verify the homepage visit in GA4 Realtime.
- [ ] Connect the same GA4 property to Referly with explicit Google authorisation.
- [ ] Confirm Referly shows the intended site/property.
- [ ] Install a Referly referral tracker only if a real programme and conversion-tracking need are confirmed.

## Sources

- Google Analytics setup: https://support.google.com/analytics/answer/14183469
- Google tag troubleshooting: https://support.google.com/analytics/answer/9311124
- Referly privacy policy: https://www.referly.so/privacy-policy
- Referly integrations: https://www.referly.so/integrations
