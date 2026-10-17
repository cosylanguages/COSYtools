#!/usr/bin/env node
/**
 * check-fonts.js — keeps typography self-hosted and consistent.
 *  1. No third-party font hosts (Google Fonts etc.): the site promises "No Tracking" / "100% client-side".
 *  2. Every real page links shared/css/fonts.css (path resolves), so hub and tools look the same.
 *  3. Every font file referenced by fonts.css exists.
 *  4. No stale family names (Fraunces / DM Sans / Nunito / Lora) in font-family declarations.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'docs']);
const errors = [];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const rel = f => path.relative(ROOT, f);

for (const f of files.filter(f => /\.(html|css|js)$/.test(f))) {
  const text = fs.readFileSync(f, 'utf8');
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(text) && !f.endsWith('check-fonts.js')) {
    errors.push(`${rel(f)}: loads fonts from Google — self-host via shared/css/fonts.css`);
  }
  if (/\.(html|css)$/.test(f)) {
    for (const m of text.matchAll(/['"](Fraunces|DM Sans|Nunito|Lora)['"]/g)) {
      const line = text.slice(0, m.index).split('\n').length;
      errors.push(`${rel(f)}:${line}: stale font family ${m[0]} (use 'COSY Sans' / 'COSY Serif')`);
    }
  }
}

for (const f of files.filter(f => f.endsWith('.html') && !rel(f).startsWith(path.join('shared', 'templates')))) {
  const text = fs.readFileSync(f, 'utf8');
  const m = text.match(/<link[^>]*href="([^"]*shared\/css\/fonts\.css)"/);
  if (!m) errors.push(`${rel(f)}: missing <link> to shared/css/fonts.css`);
  else if (!fs.existsSync(path.resolve(path.dirname(f), m[1]))) errors.push(`${rel(f)}: fonts.css link does not resolve (${m[1]})`);
}

const fontsCss = fs.readFileSync(path.join(ROOT, 'shared/css/fonts.css'), 'utf8');
for (const m of fontsCss.matchAll(/url\(([^)]+)\)/g)) {
  if (!fs.existsSync(path.resolve(ROOT, 'shared/css', m[1]))) errors.push(`shared/css/fonts.css: missing font file ${m[1]}`);
}

if (errors.length) {
  console.error('Font check failed:\n' + errors.map(e => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`Font check passed: self-hosted fonts only, fonts.css linked from ${files.filter(f => f.endsWith('.html')).length - 2} pages, all font files present.`);
