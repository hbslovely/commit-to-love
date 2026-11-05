#!/usr/bin/env bash
# Sets package.json (and package-lock.json) to exact VERSION, commits & pushes if needed.
# Fails if HEAD does not match VERSION after this step.
set -euo pipefail

VERSION="${1:?Usage: commit-package-version.sh <version> <commit-message> <branch>}"
MSG="${2:?commit message required}"
BRANCH="${3:?branch required}"
LIB_PACKAGE_JSON="projects/commit-to-love-lib/package.json"

jq --arg v "${VERSION}" '.version = $v' package.json > package.json.tmp
mv package.json.tmp package.json

if [ -f "${LIB_PACKAGE_JSON}" ]; then
  jq --arg v "${VERSION}" '.version = $v' "${LIB_PACKAGE_JSON}" > "${LIB_PACKAGE_JSON}.tmp"
  mv "${LIB_PACKAGE_JSON}.tmp" "${LIB_PACKAGE_JSON}"
fi

if [ -f package-lock.json ]; then
  jq --arg v "${VERSION}" '.version = $v' package-lock.json > package-lock.json.tmp
  mv package-lock.json.tmp package-lock.json
fi

node .github/scripts/sync-app-version.mjs "${VERSION}"

ACTUAL="$(jq -r '.version' package.json)"
if [ "${ACTUAL}" != "${VERSION}" ]; then
  echo "::error::Failed to set package.json to ${VERSION} (got ${ACTUAL})"
  exit 1
fi

if [ -f "${LIB_PACKAGE_JSON}" ]; then
  LIB_ACTUAL="$(jq -r '.version' "${LIB_PACKAGE_JSON}")"
  if [ "${LIB_ACTUAL}" != "${VERSION}" ]; then
    echo "::error::Failed to set ${LIB_PACKAGE_JSON} to ${VERSION} (got ${LIB_ACTUAL})"
    exit 1
  fi
fi

git config user.name "hbslovely-auto-bot"
git config user.email "quyenninh.720@gmail.com"

CORE_VERSION_TS="projects/commit-to-love-lib/src/love-src/version.ts"

git add package.json src/app/app-info.ts
if [ -f "${CORE_VERSION_TS}" ]; then
  git add "${CORE_VERSION_TS}"
fi
if [ -f "${LIB_PACKAGE_JSON}" ]; then
  git add "${LIB_PACKAGE_JSON}"
fi
if [ -f package-lock.json ]; then
  git add package-lock.json
fi

if ! git diff --staged --quiet; then
  git commit -m "${MSG}"
  git push --force-with-lease origin "HEAD:${BRANCH}"
  echo "Committed and pushed package.json version ${VERSION}"
else
  echo "package.json already ${VERSION} at HEAD — no new commit"
fi

ACTUAL="$(jq -r '.version' package.json)"
if [ "${ACTUAL}" != "${VERSION}" ]; then
  echo "::error::HEAD package.json must be ${VERSION} before tagging (got ${ACTUAL})"
  exit 1
fi

APP_ACTUAL="$(grep -E "^export const APP_VERSION = " src/app/app-info.ts | sed -E "s/.*'([^']*)'.*/\1/")"
if [ "${APP_ACTUAL}" != "${VERSION}" ]; then
  echo "::error::app-info.ts APP_VERSION must be ${VERSION} (got ${APP_ACTUAL})"
  exit 1
fi

if [ -f "${CORE_VERSION_TS}" ]; then
  CORE_ACTUAL="$(grep -E "^export const CORE_VERSION = " "${CORE_VERSION_TS}" | sed -E "s/.*'([^']*)'.*/\1/")"
  if [ "${CORE_ACTUAL}" != "${VERSION}" ]; then
    echo "::error::${CORE_VERSION_TS} CORE_VERSION must be ${VERSION} (got ${CORE_ACTUAL})"
    exit 1
  fi
fi

if [ -f "${LIB_PACKAGE_JSON}" ]; then
  LIB_ACTUAL="$(jq -r '.version' "${LIB_PACKAGE_JSON}")"
  if [ "${LIB_ACTUAL}" != "${VERSION}" ]; then
    echo "::error::${LIB_PACKAGE_JSON} version must be ${VERSION} (got ${LIB_ACTUAL})"
    exit 1
  fi
fi

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "version_sha=$(git rev-parse HEAD)" >> "${GITHUB_OUTPUT}"
fi
