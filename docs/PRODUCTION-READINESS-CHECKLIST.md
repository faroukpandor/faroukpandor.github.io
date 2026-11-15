# Production Readiness Checklist

## Static site & security hardening (`GH-85` / Task 020)
- [x] GitHub Pages workflow uses allowlisted `_site/` staging (excludes `docs/`, `documents/`, `scripts/`, `tests/`, `templates/`, and raw scraped `data/market-signals/*.html`)
- [x] Strict `<meta http-equiv="Content-Security-Policy">` (`default-src 'self'`, `script-src 'self'`, `style-src 'self'`, zero `'unsafe-inline'`/`'unsafe-eval'`) and `<meta name="referrer">` on all 8 pages
- [x] Zero inline executable `<script>`, zero inline `on*=` event handlers, zero inline `style=` attributes, and zero `.innerHTML` sinks
- [x] Automated offline security guard (`scripts/security-audit.mjs`) wired into `npm run verify` and CI
- [x] No runtime database dependency
- [x] No mandatory paid API
- [x] Responsive CSS and `@media print` stylesheet
- [x] Reduced-motion support
- [x] Consent-aware intake with portable JSON and clipboard fallback
- [x] Public privacy and evidence disclosure page (`privacy.html`)
- [x] Free public website self-check tool (`website-health-check.html`)
- [x] Stage 1 static portfolio control dashboard (`portfolio-control.html`) and Stage 2 `sourcing-economics.html`

## Commercial integrity
- [x] Ownership distinctions documented
- [x] Evidence/validation distinctions documented
- [x] Supplier stock is not implied
- [x] Deposits are not treated as profit
- [x] Pipeline value is not presented as income
- [x] Regulated decisions are not claimed
- [x] Referral/provider status is not endorsement

## Data architecture
- [x] Canonical Opportunity Record
- [x] Portfolio Opportunity Register
- [x] Portable CSV template
- [x] Portable JSON template
- [x] Dashboard KPI specification
- [x] Public/private data boundary
- [x] Stable cross-system identifiers
- [x] Manual reconstruction path

- [x] Synced remote `main` commit `7da3c09` (`2026-11-09T13:58:46Z` market-signal refresh) into the current branch and regenerated `SIGNAL-DIGEST.{json,md}` cleanly.

## Remaining owner-only & live acceptance checks
1. **Live Google account & workstation security verification (`CRITICAL`):** Confirm whether the `11 Nov 2026 06:07–06:15 GMT` alerts (`RaiDrive` OAuth grant on `faroukpandor@gmail.com`; Windows sign-in + `Mailsuite` OAuth grant on `pandorserenity.faroukpandor@gmail.com`) were authorised by you; revoke unrecognised sessions/apps and run offline AV scans (`FPCC` Rank 8).
2. **Remote git history purge decision (`CRITICAL`):** Remote GitHub history (`314b95b`, `42a4477`, `6a53f4b`) still retains personal files uploaded on 23 Oct 2026 before working-tree cleanup. Run `git-filter-repo` across all 14 exact historical paths + force-push (`docs/evidence/SECURITY-AND-SECRETS-AUDIT-2026-11-09.md`).
3. **GitHub repo security & private repo audits (`HIGH`):** Enable Dependabot/Secret Scanning on `faroukpandor.github.io`, resolve the 15 Dependabot alerts (3 High Rust crates) on `health-haven-medical-centre`, and audit private repos returning `403` to public/sandbox tokens.
4. **CI deployment after merge (`main`):** Confirm GitHub Pages builds cleanly from `main` via `_site/` artifact with `npm test && npm run verify` passing (`security-audit.mjs`, `verify-public-portfolio.mjs`, `repository-inventory.mjs reconcile`, `market-signals.mjs verify`, `portfolio-ops.mjs verify`, `opportunity-cli.mjs validate-schemas`).
5. **Live browser verification:** Check rendered output and zero CSP console errors across all 8 HTML URLs, test consent-aware `mailto:` intake + portable JSON fallback, test keyboard focus/contrast on mobile (`375px`), and verify external Cloudflare Pages links (`mokoro-dge.pages.dev`, `agrisage.pages.dev`, `everythingcity.pages.dev`).
