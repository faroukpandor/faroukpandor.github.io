# Security, Secrets & Privacy Audit — 2026-11-09 (`GH-85` / Task 020)

**Scope verified directly:** `faroukpandor/faroukpandor.github.io` working tree, `.github/workflows/`, remote commit history (`314b95b`, `42a4477`, `de3a19f`, `6a53f4b`, `7da3c09`), connected GitHub API posture, Gmail alerts (`faroukpandor@gmail.com` & recovery alerts for `pandorserenity.faroukpandor@gmail.com`), Google Sheets task sheet (`FPCC — Prioritised tasks (2026-11-09)`), and Vercel/Supabase/Linear metadata.

**Scope NOT accessible to sandbox token (HTTP 403 / UNVERIFIED):** Private repositories `MOKORO-ENTERPRISE-OS`, `MOKORO---Digital-Growth-Engine`, `FAROUKPANDORCONSULTANT`, and `health-haven-medical-centre`.

---

## 1. Fixes Applied in `faroukpandor.github.io` (2026-11-09)

1. **Strict Content Security Policy & Referrer Policy (`<meta>`) across all 8 public HTML pages**
   - Added `Content-Security-Policy`: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' mailto:`.
   - Zero `'unsafe-inline'`, zero `'unsafe-eval'`, zero third-party script/font/beacon origins.
   - Added `<meta name="referrer" content="strict-origin-when-cross-origin">`.
   - Note on static hosting: GitHub Pages does not set custom HTTP response headers; `frame-ancestors` and HSTS/clickjacking headers require an edge proxy (e.g., Cloudflare in front of custom domain) if stricter framing restrictions are later needed.
2. **Eliminated ALL inline `<script>`, inline `on*=` handlers, inline `style=` attributes, and `.innerHTML` assignments**
   - Extracted inline JavaScript into clean external ES modules under `assets/js/`:
     - `assets/js/index-intake.mjs`
     - `assets/js/print-record.mjs`
     - `assets/js/health-check.mjs`
     - `assets/js/sourcing-workbench.mjs` (removed `pMeta.innerHTML = ''` DOM sink)
     - `assets/js/portfolio-control.mjs`
   - Replaced all 20 inline `style="..."` attributes across `portfolio.html`, `website-health-check.html`, `sourcing-economics.html`, and `scripts/portfolio-ops.mjs` with utility classes in `assets/css/site.css`.
   - Replaced `onclick="window.print()"` on `professional-record.html` with `id="btn-print-record"` + event listener in `assets/js/print-record.mjs`.
3. **Scoped GitHub Pages Deploy Artifact (`.github/workflows/pages.yml`)**
   - Switched `upload-pages-artifact` from `path: .` to a curated `_site/` staging directory containing only `*.html`, `robots.txt`, `sitemap.xml`, `assets/`, and sanitized public data feeds (`data/public-projects.json`, `data/repository-inventory.json`, `data/portfolio-opportunity-register.{json,csv}`, `data/portfolio-dashboard-summary.json`, `data/next-actions/NEXT-ACTION-QUEUE.{json,csv}`, `data/market-signals/SIGNAL-DIGEST.{json,md}`).
   - Excludes `docs/`, `documents/`, `scripts/`, `tests/`, `templates/`, `.git/`, and raw scraped third-party HTML snapshots (`data/market-signals/*.html`) from the public Pages origin.
4. **Hardened `.gitignore` & Automated Offline Security Guard (`scripts/security-audit.mjs`)**
   - Added ignore rules for `documents/personal/*.{jpeg,csv,xlsx,xls,json,zip}`, `_site/`, `*.bak`, and `*.orig`.
   - Created `scripts/security-audit.mjs` wired into `npm run verify` and `.github/workflows/pages.yml` CI.
   - Synced remote `main` `7da3c09` (`2026-11-09T13:58:46Z`) market-signal refresh files and updated `tests/market-signals.test.mjs` so digest checks validate both live fresh (`FETCHED`) and staleness (`STALE`) thresholds cleanly.

---

## 2. Verified Working-Tree & Public Content Status

- **Secrets / credentials / private keys:** None found across all 159 tracked files.
- **Tracked personal folder (`documents/personal/`):** Only `README.md` and `beekeeping-circular-3-of-2026-page-{1,2}.jpeg` remain tracked; both JPEGs are verified public Botswana government beekeeping circular notices (no private CV, certificates, Omang/ID, or banking documents in `HEAD`).
- **Third-party scraped HTML (`data/market-signals/*.html`):** Contains an upstream `+267` contact number (`npc-national-development-plans.html`) and upstream `http://` links / unguarded `target="_blank"`. Excluded from `_site/` Pages deployment.

---

## 3. Verified Historical Git Exposure (`314b95b` → `42a4477` → `6a53f4b`)

Remote commits still retain git blobs for **7 personal documents** uploaded to repository root in `314b95b` (`2026-10-23T10:07:47Z`), moved into `documents/personal/` in `42a4477` (`2026-10-23T10:19:01Z`), and deleted from `HEAD` in `6a53f4b`:

| Original root path (`314b95b`, pre-`42a4477`) | Renamed `documents/personal/` path (`42a4477`, removed in `6a53f4b`) |
|---|---|
| `Rangeland Facilitation Officer position at Conservation International Botswana APPLICATION LETTER.docx` | `documents/personal/Farouk-Pandor-Application-Letter-RFO-2796.docx` |
| `Farouk Pandor Resume FEBRUARY 2021.docx` | `documents/personal/Farouk-Pandor-CV-2021.docx` |
| `FAROUK GERALD PANDOR curriculum vitae conservation international.docx` | `documents/personal/Farouk-Pandor-CV-Conservation-International.docx` |
| `FAROUK PANDOR PERSONAL PROFILE.txt` | `documents/personal/Farouk-Pandor-Personal-Profile.txt` |
| `FAROUK PANDOR - TIRELO SECHABA.jpg` | `documents/personal/Farouk-Pandor-Tirelo-Sechaba-Office-of-President.jpg` |
| `FAROUK PANDOR - UB BSC ANIMAL SCIENCE CERTIFICATE.jpg` | `documents/personal/Farouk-Pandor-UB-Degree-Certificate-2010-scan.jpg` |
| `UNIVERSITY OF BOTSWANA - FAROUK PANDOR - BSC ANIMAL SCIENCE - 2010.jpg` | `documents/personal/Farouk-Pandor-UB-Degree-Certificate-2010.jpg` |

> Note: Commit `de3a19f` also added `documents/personal/WhatsApp Image 2026-10-21 at 20.34.{29,30}.jpeg`, which `6a53f4b` simply renamed to `beekeeping-circular-3-of-2026-page-{1,2}.jpeg` (public Botswana beekeeping circular notices). Only the 14 paths above (7 root + 7 renamed) hold personal CVs/letters/certificates.

### Ready-to-Run Owner History Purge Procedure (Execute After Merging Open Branch)

> Warning: History rewriting force-pushes `main`. Merge any active PR first, notify contributors/agents to re-clone, and run against a fresh `--mirror` clone in an owner environment with `git-filter-repo` installed.

```bash
cat <<'EOF' > /tmp/purge-paths.txt
Rangeland Facilitation Officer position at Conservation International Botswana APPLICATION LETTER.docx
Farouk Pandor Resume FEBRUARY 2021.docx
FAROUK GERALD PANDOR curriculum vitae conservation international.docx
FAROUK PANDOR PERSONAL PROFILE.txt
FAROUK PANDOR - TIRELO SECHABA.jpg
FAROUK PANDOR - UB BSC ANIMAL SCIENCE CERTIFICATE.jpg
UNIVERSITY OF BOTSWANA - FAROUK PANDOR - BSC ANIMAL SCIENCE - 2010.jpg
documents/personal/Farouk-Pandor-Application-Letter-RFO-2796.docx
documents/personal/Farouk-Pandor-CV-2021.docx
documents/personal/Farouk-Pandor-CV-Conservation-International.docx
documents/personal/Farouk-Pandor-Personal-Profile.txt
documents/personal/Farouk-Pandor-Tirelo-Sechaba-Office-of-President.jpg
documents/personal/Farouk-Pandor-UB-Degree-Certificate-2010-scan.jpg
documents/personal/Farouk-Pandor-UB-Degree-Certificate-2010.jpg
EOF

git clone --mirror https://github.com/faroukpandor/faroukpandor.github.io.git /tmp/fp-mirror.git
cd /tmp/fp-mirror.git
git filter-repo --invert-paths --paths-from-file /tmp/purge-paths.txt
git push --force --all
git push --force --tags
```

After pushing: contact GitHub Support to purge cached views/PR commits for `314b95b` and `42a4477`, then review any personal IDs/contacts previously exposed inside those 7 documents.

---

## 4. Critical & High Actions Requiring Owner Execution (Cannot Run from Sandbox)

| Severity | Finding | Evidence | Exact Owner Action Required |
|---|---|---|---|
| **CRITICAL** | **Live Google account & workstation security verification** | Gmail alerts (`11 Nov 2026 06:07–06:15 GMT`): (1) `RaiDrive` granted Drive access on `faroukpandor@gmail.com` (`1a1c937d842fba3e`); (2) new Windows sign-in (`1a1c938d04247f93`, `06:08 GMT`) + `Mailsuite` OAuth grant (`1a1c93f2669ccf73`, `06:15 GMT`) on `pandorserenity.faroukpandor@gmail.com`; plus `FPCC` sheet Rank 8 Windows PC + USB malware scan task | **Do this first if any of those 06:07–06:15 GMT logins/apps were not yours:** open Google Security Checkup (`myaccount.google.com/notifications` & `myaccount.google.com/permissions`) on BOTH `faroukpandor@gmail.com` and `pandorserenity.faroukpandor@gmail.com`, revoke `RaiDrive`/`Mailsuite` & unknown Windows sessions if unrecognised, change passwords + check 2FA, and run Windows Defender Offline + USB scans before doing sensitive deployments. |
| **CRITICAL** | **GitHub remote history still holds the 7 uploaded personal files** | `314b95b` (root) and `42a4477` (`documents/personal/`) on `faroukpandor/faroukpandor.github.io` | Run the `git filter-repo` mirror purge script in Section 3 above once open PRs merge, then ask GitHub Support to flush cached blobs. |
| **HIGH** | **`health-haven-medical-centre/Cargo.lock` has 15 Dependabot alerts (3 High)** | Gmail Dependabot alert (`1a1c9743ebcabe63`, 11 Nov 2026): `libsqlite3-sys < 0.25.1` (use-after-free/memory corruption), `webpki <= 0.22.1` (name constraint vulnerability), `openssl < 0.10.70` (Use-After-Free) | Run `cargo update` + lockfile audit + verify downstream fixes locally in `health-haven-medical-centre` (`403` from sandbox token). |
| **HIGH** | **GitHub security scanning disabled on `faroukpandor.github.io` & 4 `GH-85` priority repos blocked (`403`)** | GitHub API returns `security_and_analysis: null` and `403 Dependabot alerts are disabled`; private repos `MOKORO-ENTERPRISE-OS`, `MOKORO---Digital-Growth-Engine`, `FAROUKPANDORCONSULTANT`, `health-haven-medical-centre` return `403` | Enable Secret Scanning, Push Protection, and Dependabot alerts on `faroukpandor.github.io` and priority private repos; rotate any secrets if found in private repos. |
| **MEDIUM** | **Vercel Slack permission prompt & blocked deployments** | `1a1c69c8bb32bb71` (Vercel Slack app permission update request); `vercel` `whitecitydiscount` PR #41 (`dpl_4zgUhFZ7ae5VyGEaJnYU3NK6e19e`) & `mokoro` prod (`dpl_BnsNBE5MYUNeHeKr6rPYDE9vjpiK`) `BLOCKED` on `COMMIT_AUTHOR_REQUIRED` | Review Slack integration permissions in Vercel team settings; keep author email/verification consistent on private repos before production promotion. |
