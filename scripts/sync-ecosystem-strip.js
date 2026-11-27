#!/usr/bin/env node
/**
 * Pins the COSYlanguages ecosystem strip into shared/vendor/.
 *
 * The strip used to be loaded from cosylanguages.github.io on 63 of 65 pages, so a
 * rename in COSYlanguages could blank the top bar of this whole site. A pinned copy
 * removes that coupling; `--check` (part of `npm test`) proves the copy is unmodified.
 *
 *   node scripts/sync-ecosystem-strip.js --sync   # download, rewrite ASSETS.json
 *   node scripts/sync-ecosystem-strip.js --check  # hash every vendored file
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'shared/vendor/ASSETS.json');
const args = new Set(process.argv.slice(2));
const syncMode = args.has('--sync');
const offlineOk = args.has('--offline-ok');

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function readManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
}

function check() {
  const manifest = readManifest();
  let errors = 0;

  for (const [file, entry] of Object.entries(manifest.assets)) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      console.error(`[FAIL] ${file}: vendored file is missing`);
      errors++;
      continue;
    }
    const actual = sha256(fs.readFileSync(full));
    if (actual !== entry.sha256) {
      console.error(`[FAIL] ${file}: hash mismatch (never edit a vendored file; run npm run sync:ecosystem-strip)`);
      errors++;
    }
  }

  if (errors) {
    console.error(`\nEcosystem strip check failed: ${errors} problem(s).`);
    process.exit(1);
  }
  console.log(`Ecosystem strip: ${Object.keys(manifest.assets).length} vendored file(s) match ASSETS.json.`);
}

async function download(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

async function sync() {
  const manifest = readManifest();
  for (const [file, entry] of Object.entries(manifest.assets)) {
    let body;
    try {
      body = await download(entry.upstream);
    } catch (error) {
      if (offlineOk) {
        console.warn(`[SKIP] ${file}: upstream unavailable (${error.message})`);
        continue;
      }
      throw error;
    }
    const full = path.join(ROOT, file);
    const previous = fs.existsSync(full) ? fs.readFileSync(full) : null;
    const changed = !previous || !previous.equals(body);
    fs.writeFileSync(full, body);
    entry.sha256 = sha256(body);
    console.log(`[${changed ? 'updated' : 'unchanged'}] ${file}`);
  }
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log('Review the diff, then commit the vendored files with ASSETS.json.');
}

Promise.resolve(syncMode ? sync() : check()).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
