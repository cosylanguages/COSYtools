#!/usr/bin/env node
/**
 * Registry check.
 *
 * `catalog.json` is the registry: the hub, the sitemap and the filters are views
 * of it. But 30 served pages are not in it - the root-level gender/, cases/,
 * conjugation/, prepositions/, practice/, verb-patterns/ and noun-declensions/
 * generation, which predates tools/<lang>/<tool>/. They are linked from the
 * homepage and listed in sitemap.xml, while `generate_hub.js --check` only ever
 * looked inside tools/, so its "no uncatalogued tool pages" was true by
 * construction rather than by fact.
 *
 * This check does not decide what should happen to those pages. It makes them
 * visible and stops the list growing: every uncatalogued page must be named in
 * legacy-pages.json, and a redirect stub must actually redirect where the file
 * says it does.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'shared']);
const STATUSES = new Set(['site', 'template', 'redirect', 'content']);
const REFRESH = /http-equiv=["']?refresh["']?[^>]*content=["']\d+\s*;\s*url=([^"']+)/i;

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const exists = (relPath) => fs.existsSync(path.join(ROOT, relPath));

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(rel(full));
  }
  return out;
}

// Same resolution the page itself performs: relative to the stub, directory URLs
// become index.html, query strings are dropped.
function resolveTarget(pageRel, url) {
  const clean = url.trim().split('?')[0];
  let resolved = path.posix.normalize(path.posix.join(path.posix.dirname(pageRel), clean));
  if (resolved.endsWith('/')) resolved += 'index.html';
  else if (!resolved.endsWith('.html')) resolved += '/index.html';
  return resolved;
}

const errors = [];
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8'));
const catalogued = new Set(catalog.map((e) => e.entry_url));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'legacy-pages.json'), 'utf8'));
const listed = new Map();
let superseded = 0;

for (const entry of registry.pages) {
  const { path: page, status, target } = entry;
  if (!page) {
    errors.push('legacy-pages.json: an entry has no path');
    continue;
  }
  if (listed.has(page)) errors.push(`${page}: listed twice in legacy-pages.json`);
  listed.set(page, entry);

  if (!STATUSES.has(status)) {
    errors.push(`${page}: unknown status "${status}" (expected ${[...STATUSES].join(', ')})`);
  }
  if (!exists(page)) {
    errors.push(`${page}: listed in legacy-pages.json but the file does not exist`);
    continue;
  }
  if (catalogued.has(page)) {
    errors.push(`${page}: listed as uncatalogued but it is in catalog.json`);
  }

  if (status === 'redirect') {
    if (!target) {
      errors.push(`${page}: status "redirect" requires a target`);
      continue;
    }
    if (!exists(target)) errors.push(`${page}: redirect target ${target} does not exist`);
    if (catalogued.has(target)) superseded++;

    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const m = html.match(REFRESH);
    if (!m) {
      errors.push(`${page}: recorded as a redirect but the page has no meta refresh`);
    } else {
      const actual = resolveTarget(page, m[1]);
      if (actual !== target) {
        errors.push(`${page}: meta refresh goes to ${actual} but legacy-pages.json says ${target}`);
      }
    }
  } else if (target) {
    errors.push(`${page}: status "${status}" should not carry a target`);
  }
}

const untracked = walk(ROOT).filter(
  (page) => !page.startsWith('tools/') && !catalogued.has(page) && !listed.has(page)
);
for (const page of untracked) {
  errors.push(
    `${page}: served page is neither in catalog.json nor in legacy-pages.json - ` +
      'catalogue it or record its status'
  );
}

// The sitemap is the third view of the registry: it must advertise every page
// that is meant to be indexed, and none of the stubs that carry noindex.
const SITE = 'https://cosylanguages.github.io/COSYtools/';
const sitemapSource = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const inSitemap = new Set();
for (const [, loc] of sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (!loc.startsWith(SITE)) {
    errors.push(`sitemap.xml: ${loc} is not under ${SITE}`);
    continue;
  }
  let page = loc.slice(SITE.length);
  if (page === '' || page.endsWith('/')) page += 'index.html';
  inSitemap.add(page);
  if (!exists(page)) errors.push(`sitemap.xml: ${loc} does not resolve to a file`);
}

const indexable = [
  ...catalog.map((e) => e.entry_url),
  ...registry.pages.filter((e) => e.status === 'content').map((e) => e.path),
  'index.html',
];
for (const page of indexable) {
  if (!inSitemap.has(page))
    errors.push(`sitemap.xml: ${page} is indexable but missing from the sitemap`);
}
for (const entry of registry.pages) {
  if (entry.status === 'redirect' && inSitemap.has(entry.path)) {
    errors.push(
      `sitemap.xml: ${entry.path} is a noindex redirect stub and must not be in the sitemap`
    );
  }
}

if (errors.length) {
  console.error(`\nRegistry check failed with ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  [FAIL] ${e}`);
  console.error('');
  process.exit(1);
}

const counts = {};
for (const entry of registry.pages) counts[entry.status] = (counts[entry.status] || 0) + 1;
const summary = Object.entries(counts)
  .map(([status, n]) => `${n} ${status}`)
  .join(', ');

console.log(
  `Registry check passed: ${catalog.length} catalogued tools, ${registry.pages.length} ` +
    `uncatalogued pages tracked (${summary}; ${superseded} redirect into the catalogue), ` +
    `no untracked page, sitemap agrees (${inSitemap.size} URLs).`
);
