#!/usr/bin/env node
/**
 * Sync APP_VERSION (host) and CORE_VERSION (lib) with the release version.
 */
import fs from 'node:fs';
import path from 'node:path';

const version = process.argv[2];
if (!version) {
  console.error('Usage: sync-app-version.mjs <version>');
  process.exit(1);
}

function syncConst(filePath, constName) {
  const source = fs.readFileSync(filePath, 'utf8');
  const re = new RegExp(`export const ${constName} = '[^']*';`);
  if (!re.test(source)) {
    console.error(`Could not find ${constName} in ${filePath}`);
    process.exit(1);
  }
  const next = source.replace(re, `export const ${constName} = '${version}';`);
  fs.writeFileSync(filePath, next);
  console.log(`Synced ${constName} to ${version} in ${filePath}`);
}

const root = process.cwd();
syncConst(path.join(root, 'src/app/app-info.ts'), 'APP_VERSION');
syncConst(
  path.join(root, 'projects/commit-to-love-lib/src/love-src/version.ts'),
  'CORE_VERSION',
);
