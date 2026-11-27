#!/usr/bin/env node
/**
 * Tool isolation contract.
 *
 * The claim this repository is built on is that every tool under tools/<lang>/<tool>/
 * is standalone: delete one and the other 56 keep working. That claim is only worth
 * something if it is checked, so this test reads each tool's own files and asserts
 * that every asset it loads is inside the tool folder or in shared/.
 *
 * A plain <a href> is navigation, not a dependency, so it may leave the tool; it must
 * still point at a file that exists, which is what catches a link to a deleted tool.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOLS = path.join(ROOT, 'tools');
const problems = [];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function toolDirs() {
  const dirs = [];
  for (const lang of fs.readdirSync(TOOLS, { withFileTypes: true })) {
    if (!lang.isDirectory()) continue;
    for (const tool of fs.readdirSync(path.join(TOOLS, lang.name), { withFileTypes: true })) {
      if (!tool.isDirectory()) continue;
      const rel = `tools/${lang.name}/${tool.name}`;
      if (fs.existsSync(path.join(ROOT, rel, 'index.html'))) dirs.push(rel);
    }
  }
  return dirs.sort();
}

/** Returns { assets, links } for one source file. */
function references(file, source) {
  const assets = new Set();
  const links = new Set();
  const rel = (ref) => !/^(?:[a-z]+:|\/\/|#|data:)/i.test(ref);

  for (const m of source.matchAll(/<(?:link|script|img|source|iframe)\b[^>]*?(?:href|src)=["']([^"']+)["']/gi)) {
    if (/rel=["'](?:canonical|alternate)["']/i.test(m[0])) continue;
    if (rel(m[1])) assets.add(m[1]);
  }
  for (const m of source.matchAll(/srcset=["']([^"']+)["']/gi)) {
    for (const part of m[1].split(',')) {
      const ref = part.trim().split(/\s+/)[0];
      if (ref && rel(ref)) assets.add(ref);
    }
  }
  for (const m of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) if (rel(m[1])) assets.add(m[1]);
  for (const m of source.matchAll(/@import\s+(?:url\()?["']([^"']+)["']/gi)) if (rel(m[1])) assets.add(m[1]);
  for (const m of source.matchAll(/\bfetch\(\s*["']([^"']+)["']/gi)) if (rel(m[1])) assets.add(m[1]);
  for (const m of source.matchAll(/\bnew\s+URL\(\s*["']([^"']+)["']/gi)) if (rel(m[1])) assets.add(m[1]);
  for (const m of source.matchAll(/<a\b[^>]*href=["']([^"']+\.html[^"']*)["']/gi)) if (rel(m[1])) links.add(m[1]);

  return { assets: [...assets], links: [...links], file: path.relative(ROOT, file) };
}

function target(baseDir, ref) {
  const clean = ref.split(/[?#]/)[0];
  return path.relative(ROOT, path.resolve(baseDir, clean)).split(path.sep).join('/');
}

// fetch() and new URL() resolve against the document, not the script file; url() in a
// stylesheet resolves against the stylesheet. `baseDir` models that difference.
function baseDirFor(file, toolRoot) {
  return file.endsWith('.js') ? toolRoot : path.dirname(file);
}

const exceptions = JSON.parse(fs.readFileSync(path.join(ROOT, 'isolation-exceptions.json'), 'utf8')).exceptions;
const used = new Set();
const isException = (tool, dest) => {
  const hit = exceptions.find((entry) => entry.tool === tool && entry.target === dest);
  if (hit) used.add(`${hit.tool}|${hit.target}`);
  return Boolean(hit);
};

const tools = toolDirs();

if (tools.length < 10) {
  problems.push(`only ${tools.length} tools found under tools/; the isolation contract needs the real tree`);
}

for (const tool of tools) {
  const folder = path.join(ROOT, tool);
  const sources = walk(folder).filter((file) => /\.(html|css|js)$/.test(file));

  for (const file of sources) {
    const { assets, links } = references(file, fs.readFileSync(file, 'utf8'));
    const baseDir = baseDirFor(file, folder);

    for (const ref of assets) {
      const dest = target(baseDir, ref);
      if (dest.startsWith('..')) {
        problems.push(`${tool}: ${path.relative(ROOT, file)} loads ${ref}, outside the repository`);
        continue;
      }
      const inside = dest.startsWith(`${tool}/`);
      const shared = dest.startsWith('shared/');
      if (!inside && !shared && !isException(tool, dest)) {
        problems.push(`${tool}: ${path.relative(ROOT, file)} loads ${dest} (only the tool folder and shared/ are allowed)`);
      }
      if (!fs.existsSync(path.join(ROOT, dest))) {
        problems.push(`${tool}: ${path.relative(ROOT, file)} loads a missing file ${dest}`);
      }
    }

    for (const ref of links) {
      const dest = target(baseDir, ref);
      if (dest.startsWith('..')) continue;
      if (!fs.existsSync(path.join(ROOT, dest))) {
        problems.push(`${tool}: ${path.relative(ROOT, file)} links to a missing page ${dest}`);
      }
    }
  }
}

for (const entry of exceptions) {
  if (!used.has(`${entry.tool}|${entry.target}`)) {
    problems.push(`stale exception: ${entry.tool} no longer loads ${entry.target}; delete the entry`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\nTool contract failed: ${problems.length} problem(s) across ${tools.length} tools.`);
  process.exit(1);
}
console.log(`Tool contract: ${tools.length} tools load only their own files and shared/.`);
