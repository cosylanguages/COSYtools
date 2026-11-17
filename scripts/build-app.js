#!/usr/bin/env node
/**
 * scripts/build-app.js
 *
 * Assembles the static COSYtools site into `native/www`, the single web bundle
 * consumed by both native shells:
 *   - Capacitor (Android + iOS)
 *   - Electron (Windows desktop)
 *
 * The site is already 100% client-side, so the bundle is a filtered copy of the
 * repository. Web-only and build-only paths (git metadata, node_modules, CI,
 * scripts, docs, the native project itself) are excluded. `404.html` is excluded
 * because its `<base href="/COSYtools/">` only resolves on GitHub Pages.
 *
 * Usage:
 *   node scripts/build-app.js            # build native/www
 *   node scripts/build-app.js --check    # verify native/www is up to date
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'native', 'www');
const MANIFEST = path.join(ROOT, 'native', '.www-manifest.json');

// Directories and files that are never part of the shipped app.
const EXCLUDE_NAMES = new Set([
  '.git',
  '.github',
  'node_modules',
  'native',
  'scripts',
  'docs',
  'schemas',
  '404.html',
  'package.json',
  'package-lock.json',
  'AGENTS.md',
  'AUDIT.md',
  'CONTRIBUTING.md',
  'MIGRATION-TOOLS.md',
  'README.md',
  'robots.txt',
  'sitemap.xml',
]);

function shouldSkip(relPath, name) {
  if (EXCLUDE_NAMES.has(name)) return true;
  if (name.endsWith('.md')) return true;
  if (name === '.gitignore') return true;
  return false;
}

function collectFiles(dir, relBase, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
    if (shouldSkip(rel, entry.name)) continue;
    if (entry.isDirectory()) {
      collectFiles(abs, rel, acc);
    } else if (entry.isFile()) {
      acc.push(rel);
    }
  }
  return acc;
}

function hashFiles(files) {
  const crypto = require('crypto');
  const records = files
    .slice()
    .sort()
    .map((rel) => {
      const buf = fs.readFileSync(path.join(ROOT, rel));
      return `${rel}\t${crypto.createHash('sha256').update(buf).digest('hex')}`;
    });
  return records.join('\n') + '\n';
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const files = collectFiles(ROOT, '', []);
  let bytes = 0;
  for (const rel of files) {
    const src = path.join(ROOT, rel);
    const dest = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    bytes += fs.statSync(src).size;
  }

  const manifest = hashFiles(files);
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, manifest);

  console.log(`Built native/www: ${files.length} files, ${(bytes / 1048576).toFixed(1)} MB.`);
}

function check() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('native/.www-manifest.json is missing. Run: node scripts/build-app.js');
    process.exit(1);
  }
  const expected = fs.readFileSync(MANIFEST, 'utf8');
  const actual = hashFiles(collectFiles(ROOT, '', []));
  if (expected !== actual) {
    console.error('native/www is out of date. Run: node scripts/build-app.js');
    process.exit(1);
  }
  console.log('native/www is up to date.');
}

if (process.argv.includes('--check')) {
  check();
} else {
  build();
}
