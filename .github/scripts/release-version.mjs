#!/usr/bin/env node
/**
 * Version scheme (npm-compatible semver):
 *   Monthly: YYYY.M.0          (e.g. 2026.6.0) — tag v2026.6.0
 *   Daily:   YYYY.M.N          (e.g. 2026.6.1, 2026.6.2)
 *   Commit:  <base>-rc.NN      (e.g. 2026.6.0-rc.01, 2026.6.1-rc.02)
 */

import { execSync } from 'node:child_process';

const SEMVER_RE = /^(\d{4})\.(\d{1,2})\.(\d+)$/;
const RC_SUFFIX_RE = /^(.+)-rc\.(\d{2})$/;
/** Shipped patch/monthly tags only — excludes -rc prerelease tags. */
const PATCH_TAG_RE = /^v(\d{4})\.(\d{1,2})\.(\d+)$/;

export function comparePatchTags(a, b) {
  const ma = PATCH_TAG_RE.exec(a);
  const mb = PATCH_TAG_RE.exec(b);
  if (!ma || !mb) return 0;
  for (let i = 1; i <= 3; i++) {
    const diff = parseInt(ma[i], 10) - parseInt(mb[i], 10);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function listPatchReleaseTags() {
  try {
    const out = execSync('git tag -l "v*"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim().split('\n').filter((tag) => PATCH_TAG_RE.test(tag));
  } catch {
    return [];
  }
}

/** Latest shipped tag vYYYY.M.N (monthly or patch), excluding -rc tags. */
export function latestPatchTag() {
  const tags = listPatchReleaseTags();
  if (!tags.length) return '';
  tags.sort(comparePatchTags);
  return tags[tags.length - 1];
}

export function monthlyVersion(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  return `${y}.${m}.0`;
}

export function previousMonthlyTag(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1));
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  return `v${y}.${m}.0`;
}

export function stripRcSuffix(version) {
  const match = RC_SUFFIX_RE.exec(version);
  return match ? match[1] : version;
}

export function parseBaseVersion(version) {
  const withoutRc = stripRcSuffix(version);
  if (SEMVER_RE.test(withoutRc)) {
    return withoutRc;
  }
  return monthlyVersion();
}

export function bumpDaily(version) {
  const base = stripRcSuffix(version);
  const match = SEMVER_RE.exec(base);
  if (match) {
    const next = parseInt(match[3], 10) + 1;
    return `${match[1]}.${match[2]}.${next}`;
  }
  throw new Error(`Cannot bump daily from: ${version}`);
}

export function listRcTagsForBase(base) {
  try {
    const out = execSync(`git tag -l "v${base}-rc.*"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/** Next -rc.NN: max(existing tags for base, rc in package.json) + 1 */
export function nextRcVersion(packageVersion) {
  const base = parseBaseVersion(packageVersion);
  let maxRc = 0;

  const inPkg = RC_SUFFIX_RE.exec(packageVersion);
  if (inPkg) {
    maxRc = parseInt(inPkg[2], 10);
  }

  const prefix = `v${base}-rc.`;
  for (const tag of listRcTagsForBase(base)) {
    if (tag.startsWith(prefix)) {
      const n = parseInt(tag.slice(prefix.length), 10);
      if (!Number.isNaN(n)) {
        maxRc = Math.max(maxRc, n);
      }
    }
  }

  return `${base}-rc.${String(maxRc + 1).padStart(2, '0')}`;
}

/** @deprecated Use nextRcVersion */
export function bumpRc(version) {
  return nextRcVersion(version);
}

const cmd = process.argv[2];
const arg = process.argv[3];

switch (cmd) {
  case 'monthly':
    console.log(monthlyVersion());
    break;
  case 'previous-monthly-tag':
    console.log(previousMonthlyTag());
    break;
  case 'daily':
    console.log(bumpDaily(arg ?? ''));
    break;
  case 'latest-patch-tag':
    console.log(latestPatchTag());
    break;
  case 'rc':
  case 'next-rc':
    console.log(nextRcVersion(arg ?? ''));
    break;
  default:
    console.error(
      'Usage: release-version.mjs <monthly|previous-monthly-tag|daily|latest-patch-tag|next-rc> [version]'
    );
    process.exit(1);
}
