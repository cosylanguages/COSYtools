#!/usr/bin/env node
/**
 * Independence check.
 *
 * COSYtools must render with nothing from a sibling repository. Every stylesheet,
 * script, font, image and data file a browser fetches has to live in this repo, so a
 * deploy of COSYlanguages/COSYgames/COSYevents cannot break a page here.
 *
 * Navigation is not a dependency: `<a href>` links, canonical/Open Graph metadata and
 * the ecosystem strip's outbound links are allowed to point at siblings. Assets are not.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'fonts', 'fixtures']);
const SIBLING = /(?:https?:)?\/\/cosylanguages\.github\.io\/([A-Za-z0-9_-]+)\//g;
const SELF = 'COSYtools';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(html|css|js)$/.test(entry.name) && !/\.min\./.test(entry.name)) out.push(full);
  }
  return out;
}

/** Asset loads only. `<a href>` and metadata are navigation, not dependencies. */
function assetReferences(file, source) {
  const refs = [];
  if (file.endsWith('.html')) {
    for (const m of source.matchAll(/<(?:link|script|img|source|iframe)\b[^>]*?(?:href|src)=["']([^"']+)["']/gi)) {
      // <link rel="canonical"> and rel="alternate" are metadata, not fetches.
      const tag = m[0];
      if (/rel=["'](?:canonical|alternate|author|license|me)["']/i.test(tag)) continue;
      refs.push(m[1]);
    }
    for (const m of source.matchAll(/srcset=["']([^"']+)["']/gi)) {
      refs.push(...m[1].split(',').map((part) => part.trim().split(/\s+/)[0]));
    }
  } else if (file.endsWith('.css')) {
    for (const m of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) refs.push(m[1]);
    for (const m of source.matchAll(/@import\s+(?:url\()?["']([^"']+)["']/gi)) refs.push(m[1]);
  } else {
    for (const m of source.matchAll(/new\s+URL\(\s*["']([^"']+)["']/gi)) refs.push(m[1]);
    for (const m of source.matchAll(/\bimport\(\s*["']([^"']+)["']/gi)) refs.push(m[1]);
    for (const m of source.matchAll(/\bfetch\(\s*["']([^"']+)["']/gi)) refs.push(m[1]);
  }
  return refs.filter((ref) => !ref.startsWith('data:') && !ref.startsWith('#'));
}

const problems = [];
const external = new Set();

for (const file of walk(ROOT)) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = path.relative(ROOT, file).split(path.sep).join('/');
  for (const ref of assetReferences(file, source)) {
    SIBLING.lastIndex = 0;
    let match;
    while ((match = SIBLING.exec(ref))) {
      if (match[1] !== SELF) problems.push(`${relative} loads ${ref}`);
    }
    if (/^(?:https?:)?\/\//.test(ref) && !/cosylanguages\.github\.io/.test(ref)) external.add(ref);
  }
}

if (external.size) {
  console.log(`Note: ${external.size} third-party asset(s) still loaded (not a sibling-repo dependency):`);
  for (const ref of [...external].sort().slice(0, 10)) console.log(`  ${ref}`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\nIndependence check failed: ${problems.length} sibling-repository asset(s). Vendor the file under shared/vendor/ instead.`);
  process.exit(1);
}
console.log('Independence: no page, stylesheet or script loads an asset from a sibling repository.');
