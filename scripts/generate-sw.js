#!/usr/bin/env node
/**
 * Regenerates the service-worker precache list.
 *
 * The list used to be maintained by hand, so renaming a shared stylesheet silently
 * broke offline install. It is now derived from the tree: the app shell plus every
 * stylesheet and script under shared/. Fonts and datasets stay out on purpose — they
 * are large and are cached at runtime the first time a page uses them.
 *
 *   node scripts/generate-sw.js            # rewrite sw.js
 *   node scripts/generate-sw.js --check    # fail when sw.js is stale
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SW = path.join(ROOT, 'sw.js');
const BEGIN = '// BEGIN GENERATED PRECACHE (scripts/generate-sw.js)';
const END = '// END GENERATED PRECACHE';

const ROOT_FILES = ['./', './index.html', './offline.html', './404.html', './catalog.json', './manifest.json'];
const SHELL_DIRS = [
  { dir: 'shared/css', ext: /\.css$/ },
  { dir: 'shared/js', ext: /\.js$/ },
  { dir: 'shared/engines', ext: /\.js$/ },
  { dir: 'shared/styles', ext: /\.css$/ },
  { dir: 'shared/assets', ext: /\.png$/ },
  { dir: 'shared/images', ext: /\.png$/ },
  { dir: 'shared/vendor', ext: /\.(css|js)$/ },
];

function collect() {
  const urls = [...ROOT_FILES];
  for (const { dir, ext } of SHELL_DIRS) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) continue;
    const files = fs
      .readdirSync(full, { withFileTypes: true })
      .filter((entry) => entry.isFile() && ext.test(entry.name))
      .map((entry) => `${dir}/${entry.name}`)
      .sort();
    urls.push(...files.map((file) => `./${file}`));
  }
  return urls;
}

function render(urls) {
  const body = urls.map((url) => `  '${url}',`).join('\n');
  return `${BEGIN} — do not edit by hand.\nconst PRECACHE_URLS = [\n${body}\n];\n${END}`;
}

const urls = collect();
const expected = render(urls);
const source = fs.readFileSync(SW, 'utf8');
const start = source.indexOf(BEGIN);
const end = source.indexOf(END);

if (start === -1 || end === -1) {
  console.error('sw.js is missing the generated-precache markers.');
  process.exit(1);
}

const current = source.slice(start, end + END.length);

if (process.argv.includes('--check')) {
  if (current !== expected) {
    console.error('sw.js precache list is stale. Run: npm run generate:sw');
    process.exit(1);
  }
  console.log(`Service worker precache: ${urls.length} URLs, up to date.`);
} else {
  fs.writeFileSync(SW, source.slice(0, start) + expected + source.slice(end + END.length));
  console.log(`Service worker precache: wrote ${urls.length} URLs.`);
}
