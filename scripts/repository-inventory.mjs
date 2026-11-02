#!/usr/bin/env node
// Repository inventory catalogue: generate + reconcile (issue #148).
//
// Usage:
//   node scripts/repository-inventory.mjs generate   # requires `gh` auth; writes data/repository-inventory.json
//   node scripts/repository-inventory.mjs reconcile  # offline; validates the committed catalogue (CI guard)
//
// Evidence rules (safe failure):
//   - GitHub metadata (visibility, fork, archived, license, pushed_at) is verifiable account
//     state only. It is NOT proof of commercial ownership, customer readiness or authorization.
//   - Repositories the listing token cannot read (HTTP 403/404) are retained with their
//     registry-declared classification and marked "registry-declared-unverified". Nothing is
//     inferred about them.
//   - No deployment URLs live in this catalogue. Verified public destinations stay in
//     data/public-projects.json behind scripts/verify-public-portfolio.mjs.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const REGISTRY_PATH = new URL('../docs/REPOSITORY-RELATIONSHIP-REGISTRY.md', import.meta.url);
const CATALOGUE_PATH = new URL('../data/repository-inventory.json', import.meta.url);

const CLASSIFICATION_VOCABULARY = [
  'CONTROL',
  'OWNED-ACCOUNT',
  'CLIENT-EMPLOYER',
  'UPSTREAM-FORK',
  'ARCHIVED',
  'EXPERIMENT',
  'UNKNOWN',
];

const ROW_RE = /^\| \[([^\]]+)\]\(https:\/\/github\.com\/faroukpandor\/([^)]+)\) \| ([^|]+?) \| ([^|]+?) \|$/;

function parseRegistry() {
  const text = readFileSync(REGISTRY_PATH, 'utf8');
  const lastReconciled = text.match(/^\*\*Last reconciled:\*\* (\d{4}-\d{2}-\d{2})/m);
  assert.ok(lastReconciled, 'registry must declare a Last reconciled date');
  const section = text.split('## Repository inventory')[1]?.split('## Reconciliation queue')[0];
  assert.ok(section, 'registry must contain a Repository inventory section');
  const rows = [];
  for (const line of section.split('\n')) {
    const m = line.match(ROW_RE);
    if (!m) continue;
    rows.push({
      name: m[2],
      display: m[1],
      registryVisibility: m[3].trim(),
      registryClass: m[4].trim(),
    });
  }
  assert.ok(rows.length >= 100, 'registry inventory table should cover the account listing');
  return { lastReconciled: lastReconciled[1], rows };
}

// Deterministic classification precedence shared by generate and reconcile.
function classify({ registryClass, fork, archived }) {
  const cls = registryClass ?? '';
  if (cls.startsWith('PERSONAL /')) return 'CONTROL';
  if (cls.startsWith('CLIENT /')) return 'CLIENT-EMPLOYER';
  if (archived === true) return 'ARCHIVED';
  if (fork === true || cls.startsWith('UPSTREAM /')) return 'UPSTREAM-FORK';
  if (cls.startsWith('PERSONAL PROJECT CANDIDATE')) return 'OWNED-ACCOUNT';
  return 'UNKNOWN';
}

function classificationBasis({ registryClass, fork, archived, verified }) {
  const cls = registryClass ?? '';
  if (cls.startsWith('PERSONAL /')) return 'registry control-plane declaration; GitHub access does not prove commercial ownership';
  if (cls.startsWith('CLIENT /')) return 'registry client/employer/third-party boundary declaration (relationship unverified)';
  if (archived === true) return 'GitHub archived flag';
  if (fork === true) return 'GitHub fork flag (third-party upstream software)';
  if (cls.startsWith('UPSTREAM /')) return 'registry upstream/template declaration (fork and licence status unverified; verify before edits)';
  if (cls.startsWith('PERSONAL PROJECT CANDIDATE')) {
    return verified
      ? 'GitHub owner listing, non-fork account repository (account-level only)'
      : 'registry personal-project declaration; API inaccessible in this pass';
  }
  return verified
    ? 'GitHub owner listing, non-fork account repository; purpose and canonical role unverified'
    : 'registry row without verified classification; API inaccessible in this pass';
}

function fetchOwnedPublicRepositories() {
  let out;
  try {
    out = execFileSync(
      'gh',
      [
        'api',
        'user/repos?type=owner&per_page=100',
        '--paginate',
        '--jq',
        '.[] | [.name, .fork, .archived, (.license.spdx_id // "none"), .pushed_at] | @tsv',
      ],
      { encoding: 'utf8' },
    );
  } catch (err) {
    throw new Error(
      'safe failure: could not list owned repositories via `gh api`. ' +
        'Authenticate `gh` and retry. No catalogue was written. (' + String(err).slice(0, 200) + ')',
    );
  }
  const repos = [];
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    const [name, fork, archived, license, pushedAt] = line.split('\t');
    repos.push({
      name,
      fork: fork === 'true',
      archived: archived === 'true',
      license: license === 'none' ? null : license,
      pushedAt,
    });
  }
  assert.ok(repos.length > 0, 'safe failure: owner listing returned no repositories');
  return repos;
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function generate() {
  const { lastReconciled, rows: registryRows } = parseRegistry();
  const owned = fetchOwnedPublicRepositories();
  const ownedByName = new Map(owned.map((r) => [r.name.toLowerCase(), r]));
  const registryByName = new Map(registryRows.map((r) => [r.name.toLowerCase(), r]));
  const generatedOn = todayUTC();

  const names = new Set([...registryByName.keys(), ...ownedByName.keys()]);
  const repositories = [];
  for (const lower of [...names].sort()) {
    const reg = registryByName.get(lower) ?? null;
    const meta = ownedByName.get(lower) ?? null;
    const verified = meta !== null;
    const registryClass = reg?.registryClass ?? null;
    const classification = classify({
      registryClass,
      fork: meta?.fork ?? null,
      archived: meta?.archived ?? null,
    });
    const noteParts = [];
    if (!reg) {
      noteParts.push('NEW 2026 reconciliation gap: owned public repository absent from the registry inventory table; add a register row and classify purpose before any portfolio claim');
    }
    if (reg && verified && registryClass.startsWith('UNVERIFIED') && meta.fork) {
      noteParts.push('registry listed this as UNVERIFIED; GitHub fork flag resolves it to third-party upstream software');
    }
    if (reg && !verified) {
      noteParts.push('private or inaccessible to the reconciliation token (HTTP 403/404 on 2026-11-02); registry declaration retained without inference');
    }
    repositories.push({
      name: meta?.name ?? reg.name,
      in_registry: reg !== null,
      registry_visibility: reg ? reg.registryVisibility : null,
      visibility: verified ? 'public-verified' : 'declared-private-unverified',
      fork: meta ? meta.fork : null,
      archived: meta ? meta.archived : null,
      license: meta ? meta.license : null,
      pushed_at: meta ? meta.pushedAt : null,
      classification,
      verification: verified ? `github-metadata-${generatedOn}` : 'registry-declared-unverified',
      classification_basis: classificationBasis({
        registryClass,
        fork: meta?.fork ?? null,
        archived: meta?.archived ?? null,
        verified,
      }),
      ...(noteParts.length ? { note: noteParts.join('; ') } : {}),
    });
  }

  const byClass = Object.fromEntries(CLASSIFICATION_VOCABULARY.map((c) => [c, 0]));
  for (const r of repositories) byClass[r.classification] += 1;

  const unregistered = repositories.filter((r) => !r.in_registry).map((r) => r.name);

  const catalogue = {
    schema_version: 1,
    generated_on: generatedOn,
    generator: 'scripts/repository-inventory.mjs generate',
    sources: [
      'GitHub REST GET /user/repos?type=owner&per_page=100 (authenticated listing, paginated), queried ' + generatedOn,
      'docs/REPOSITORY-RELATIONSHIP-REGISTRY.md repository inventory table (registry-declared rows)',
    ],
    access_boundary:
      'The reconciliation token could read public repositories only; private repositories returned HTTP 403. ' +
      'Private rows keep their registry-declared classification with verification=registry-declared-unverified and null metadata. ' +
      'Safe failure: no ownership, deployment, customer or readiness claim is inferred for inaccessible repositories, ' +
      'and no deployment URLs are published in this catalogue (verified public destinations live in data/public-projects.json).',
    classification_vocabulary: CLASSIFICATION_VOCABULARY,
    counts: {
      total: repositories.length,
      public_verified: repositories.filter((r) => r.visibility === 'public-verified').length,
      declared_private_unverified: repositories.filter((r) => r.visibility === 'declared-private-unverified').length,
      in_registry: repositories.filter((r) => r.in_registry).length,
      unregistered: unregistered.length,
      by_classification: byClass,
    },
    repositories,
    reconciliation_gaps: {
      unregistered_public_repositories: unregistered,
      note:
        'Owned public repositories missing from the registry inventory table at generation time. ' +
        'Registry rule 7 requires each to be registered with a named canonical purpose before portfolio use.',
    },
    duplicate_families: [
      {
        family: 'EVERYTHINGCITY marketplace naming',
        members: ['EVERYTHINGCITY', 'EVERYTHING-CITY'],
        canonical: 'PENDING-EVIDENCE',
        note: 'Separate repositories; do not merge, delete or repurpose on name similarity (registry canonical architecture).',
      },
      {
        family: 'YellowBlue client boundary',
        members: [
          'yellow-blue-pwa',
          'yellowblue-pwa',
          'YELLOWBLUEPWA',
          'YELLOW-BLUE-PROGRESSIVE-WEB-APPLICATION-3',
          'YELLOW-BLUE-LOGISTICS',
          'YELLOW-BLUE-CARGO',
          'YB17.12.2025',
        ],
        canonical: 'PENDING-EVIDENCE',
        note: 'CLIENT / THIRD-PARTY BOUNDARY. No modification, branding or canonical merge without explicit written authorization.',
      },
      {
        family: 'Personal command centre',
        members: ['AI-Powered-Personal-Command-Center', 'AI-Personal-Command-Center'],
        canonical: 'PENDING-EVIDENCE',
        note: 'Registry requires a documented comparison before selecting a canonical role.',
      },
      {
        family: 'Health Haven / health hive',
        members: ['HEALTHHAVEN', 'HEALTHHAVEN1', 'health-haven-medical-centre', 'health-haven-tcs', 'health-hive-spark'],
        canonical: 'PENDING-EVIDENCE',
        note: 'Duplicate-family review pending; unrelated fork medical-center (SUST system) stays separate.',
      },
      {
        family: 'Morua Junction',
        members: ['moruajunction', 'moruajunction1', 'MORUA-JUNCTION---TEMPOLABS', 'MORUA_JUNCTION_1'],
        canonical: 'PENDING-EVIDENCE',
        note: 'Duplicate-family review pending; moruajunction is a verified GitHub fork.',
      },
      {
        family: 'Commerce / storefront',
        members: ['faroukpandorcommerce', 'faroukpandor-nextjs-commerce', 'nextjs-commerce-cpm', 'Farouk-s-Store-by-ZoroDesign'],
        canonical: 'PENDING-EVIDENCE',
        note: 'Farouk-s-Store-by-ZoroDesign is a verified third-party fork; no storefront claims without evidence.',
      },
      {
        family: 'Aether',
        members: ['AETHER-X-Global-AI-Ecosystem-Platform', 'Aether-AI-Orchestrator'],
        canonical: 'PENDING-EVIDENCE',
        note: 'Duplicate-family review pending.',
      },
      {
        family: 'AgriSage naming',
        members: ['AGRISAGE'],
        canonical: 'AGRISAGE',
        note: "Repository name AGRISAGE360 does not exist (404 repaired in PR #149); 'AgriSage360' is a product label only.",
      },
    ],
    evidence_note:
      'GitHub metadata is verifiable account state, not proof of commercial ownership, authorization, certification, ' +
      'customer outcomes or commercial status. Registry-declared values are unverified declarations retained for continuity. ' +
      'Reconcile with: node scripts/repository-inventory.mjs reconcile (offline, free tooling).',
  };

  writeFileSync(CATALOGUE_PATH, JSON.stringify(catalogue, null, 2) + '\n');
  console.log(
    `wrote data/repository-inventory.json: ${repositories.length} repositories ` +
      `(${catalogue.counts.public_verified} GitHub-verified, ${catalogue.counts.declared_private_unverified} registry-declared), ` +
      `generated_on ${generatedOn}, ${unregistered.length} unregistered gaps`,
  );
}

function reconcile() {
  const checks = [];
  const t = (fn) => {
    fn();
    checks.push(fn.name || 'check');
  };

  const catalogue = JSON.parse(readFileSync(CATALOGUE_PATH, 'utf8'));
  const { lastReconciled, rows: registryRows } = parseRegistry();
  const registryByName = new Map(registryRows.map((r) => [r.name.toLowerCase(), r]));

  t(function schema_version_is_explicit() {
    assert.equal(catalogue.schema_version, 1, 'catalogue schema_version must be 1');
  });

  t(function freshness_timestamp_present_and_valid() {
    assert.match(String(catalogue.generated_on), /^\d{4}-\d{2}-\d{2}$/, 'generated_on must be an ISO date');
    assert.ok(!Number.isNaN(Date.parse(catalogue.generated_on)), 'generated_on must parse');
    assert.ok(catalogue.generated_on <= todayUTC(), 'generated_on must not be in the future');
  });

  t(function freshness_matches_registry_last_reconciled() {
    assert.equal(
      catalogue.generated_on,
      lastReconciled,
      'catalogue generated_on must match the registry Last reconciled date (regenerate after editing either)',
    );
  });

  t(function safe_failure_fields_documented() {
    assert.ok(catalogue.access_boundary && catalogue.access_boundary.includes('Safe failure'), 'access_boundary must document safe failure');
    assert.ok(Array.isArray(catalogue.sources) && catalogue.sources.length >= 2, 'sources must be recorded');
    assert.ok(catalogue.evidence_note && catalogue.evidence_note.length > 40, 'evidence_note must bound the claims');
  });

  t(function no_urls_or_secrets_in_entries() {
    for (const r of catalogue.repositories) {
      const blob = JSON.stringify(r);
      assert.ok(!/https?:\/\//.test(blob), `entry ${r.name} must not embed URLs (names only)`);
      assert.ok(!/(ghp_|github_pat_|AKIA|BEGIN (RSA|OPENSSH) PRIVATE KEY)/.test(blob), `entry ${r.name} must not embed secrets`);
    }
  });

  t(function names_unique_case_insensitive() {
    const seen = new Set();
    for (const r of catalogue.repositories) {
      const lower = r.name.toLowerCase();
      assert.ok(!seen.has(lower), `duplicate repository name ${r.name}`);
      seen.add(lower);
    }
  });

  t(function classification_vocabulary_valid() {
    for (const r of catalogue.repositories) {
      assert.ok(CLASSIFICATION_VOCABULARY.includes(r.classification), `invalid classification ${r.classification} for ${r.name}`);
    }
  });

  t(function registry_coverage_bidirectional() {
    const catalogueNames = new Set(catalogue.repositories.map((r) => r.name.toLowerCase()));
    for (const row of registryRows) {
      assert.ok(catalogueNames.has(row.name.toLowerCase()), `registry row ${row.name} missing from catalogue`);
    }
    for (const r of catalogue.repositories) {
      if (r.in_registry) {
        assert.ok(registryByName.has(r.name.toLowerCase()), `catalogue claims ${r.name} is registered but registry has no row`);
      } else {
        assert.ok(!registryByName.has(r.name.toLowerCase()), `${r.name} is in the registry but marked unregistered`);
      }
    }
  });

  t(function unregistered_gaps_listed() {
    const listed = new Set(catalogue.reconciliation_gaps.unregistered_public_repositories.map((s) => s.toLowerCase()));
    for (const r of catalogue.repositories) {
      assert.equal(r.in_registry, !listed.has(r.name.toLowerCase()), `${r.name}: in_registry flag disagrees with reconciliation_gaps`);
    }
  });

  t(function classification_recomputes_exactly() {
    for (const r of catalogue.repositories) {
      const reg = registryByName.get(r.name.toLowerCase()) ?? null;
      const expected = classify({
        registryClass: reg?.registryClass ?? null,
        fork: r.fork,
        archived: r.archived,
      });
      assert.equal(r.classification, expected, `${r.name}: stored classification ${r.classification} != recomputed ${expected}`);
    }
  });

  t(function metadata_and_verification_consistent() {
    for (const r of catalogue.repositories) {
      if (r.visibility === 'public-verified') {
        assert.equal(typeof r.fork, 'boolean', `${r.name}: verified row needs a fork flag`);
        assert.equal(typeof r.archived, 'boolean', `${r.name}: verified row needs an archived flag`);
        assert.equal(r.verification, `github-metadata-${catalogue.generated_on}`, `${r.name}: verification must cite the catalogue date`);
      } else {
        assert.equal(r.visibility, 'declared-private-unverified', `${r.name}: unknown visibility value`);
        assert.equal(r.verification, 'registry-declared-unverified', `${r.name}: unverified rows must say so`);
        assert.equal(r.fork, null, `${r.name}: inaccessible rows must not carry inferred metadata`);
        assert.equal(r.archived, null, `${r.name}: inaccessible rows must not carry inferred metadata`);
        assert.equal(r.license, null, `${r.name}: inaccessible rows must not carry inferred metadata`);
        assert.equal(r.pushed_at, null, `${r.name}: inaccessible rows must not carry inferred metadata`);
      }
    }
  });

  t(function client_boundary_rows_classified() {
    for (const row of registryRows) {
      if (row.registryClass.startsWith('CLIENT /')) {
        const r = catalogue.repositories.find((x) => x.name.toLowerCase() === row.name.toLowerCase());
        assert.equal(r.classification, 'CLIENT-EMPLOYER', `${row.name}: client boundary must classify CLIENT-EMPLOYER`);
      }
    }
  });

  t(function archived_flag_takes_archive_class() {
    for (const r of catalogue.repositories) {
      if (r.archived === true) assert.equal(r.classification, 'ARCHIVED', `${r.name}: archived repo must classify ARCHIVED`);
    }
  });

  t(function duplicate_families_reference_catalogued_members() {
    const names = new Set(catalogue.repositories.map((r) => r.name));
    for (const fam of catalogue.duplicate_families) {
      assert.ok(Array.isArray(fam.members) && fam.members.length >= 1, `${fam.family}: needs members`);
      for (const m of fam.members) {
        assert.ok(names.has(m), `${fam.family}: member ${m} not in catalogue`);
      }
      assert.ok(
        fam.canonical === 'PENDING-EVIDENCE' || fam.members.includes(fam.canonical),
        `${fam.family}: canonical must be PENDING-EVIDENCE or a member`,
      );
    }
  });

  t(function counts_match_recomputed() {
    const byClass = Object.fromEntries(CLASSIFICATION_VOCABULARY.map((c) => [c, 0]));
    for (const r of catalogue.repositories) byClass[r.classification] += 1;
    assert.equal(catalogue.counts.total, catalogue.repositories.length, 'total count drift');
    assert.equal(catalogue.counts.public_verified, catalogue.repositories.filter((r) => r.visibility === 'public-verified').length);
    assert.equal(
      catalogue.counts.declared_private_unverified,
      catalogue.repositories.filter((r) => r.visibility === 'declared-private-unverified').length,
    );
    assert.equal(catalogue.counts.in_registry, catalogue.repositories.filter((r) => r.in_registry).length);
    assert.equal(catalogue.counts.unregistered, catalogue.repositories.filter((r) => !r.in_registry).length);
    assert.deepEqual(catalogue.counts.by_classification, byClass, 'by_classification drift');
  });

  console.log(checks.length + ' repository inventory reconciliation checks passed (offline, no network)');
}

const mode = process.argv[2];
if (mode === 'generate') {
  generate();
} else if (mode === 'reconcile') {
  reconcile();
} else {
  console.error('usage: node scripts/repository-inventory.mjs <generate|reconcile>');
  process.exit(2);
}
