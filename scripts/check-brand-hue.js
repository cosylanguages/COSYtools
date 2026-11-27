#!/usr/bin/env node
/**
 * Brand-hue guard.
 *
 * The ramp is only worth having if nothing else competes with it. A stylesheet
 * can always grow one more hand-mixed teal - hero.css had six - and no gate
 * would notice, because `check:inline-colours` only reads `style="..."` and a
 * literal inside a stylesheet is invisible to it.
 *
 * This gate reads the ramp from the token files and fails on any other literal
 * whose hue sits within HUE_TOLERANCE degrees of the brand with enough chroma
 * to be seen. Greys, sage, honey, coral and the rest of the structural palette
 * fall outside that window, so the rule is about the brand hue only, not about
 * literals in general.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const RAMP_FILES = ['shared/css/tokens.css', 'shared/css/cosy-tokens.css'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'vendor', 'dist']);
const HUE_TOLERANCE = 20;
const MIN_CHROMA = 8;

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function toLch(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => srgbToLinear(v / 255));
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const fx = f(x / 0.95047);
  const fy = f(y);
  const fz = f(z / 1.08883);
  const a = 500 * (fx - fy);
  const bb = 200 * (fy - fz);
  return {
    L: 116 * fy - 16,
    C: Math.hypot(a, bb),
    H: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360,
  };
}

const normalise = (hex) => {
  const h = hex.replace('#', '').toUpperCase();
  return '#' + (h.length === 3 ? h.replace(/./g, (c) => c + c) : h);
};

const HEX = /#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{6}\b/g;

// The ramp itself is the reference, so every literal in the token files is allowed.
const allowed = new Set();
for (const rel of RAMP_FILES) {
  const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  for (const m of text.match(HEX) || []) allowed.add(normalise(m));
}

const brand = toLch(normalise('#0ABBB5'));

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.css')) out.push(full);
  }
  return out;
}

const problems = [];
let scanned = 0;

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (RAMP_FILES.includes(rel)) continue;
  scanned++;

  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const m of line.match(HEX) || []) {
      const hex = normalise(m);
      if (allowed.has(hex)) continue;
      const { C, H } = toLch(hex);
      if (C < MIN_CHROMA) continue;
      const delta = Math.abs(((H - brand.H + 180) % 360) - 180);
      if (delta > HUE_TOLERANCE) continue;
      problems.push({
        file: rel,
        line: i + 1,
        hex,
        hue: H,
        delta,
        chroma: C,
      });
    }
  });
}

if (problems.length) {
  console.error(
    `\n${problems.length} literal colour(s) compete with the brand hue ` +
      `(${brand.H.toFixed(1)} deg) instead of using a ramp step:\n`
  );
  for (const p of problems) {
    console.error(
      `  [FAIL] ${p.file}:${p.line}  ${p.hex}  ` +
        `hue ${p.hue.toFixed(1)} (${p.delta.toFixed(1)} deg from brand), chroma ${p.chroma.toFixed(1)}`
    );
  }
  console.error(
    '\nUse var(--cosy-50 … --cosy-900) from shared/css/tokens.css. ' +
      'A new shade of the brand is a new ramp step, not a new literal.\n'
  );
  process.exit(1);
}

console.log(
  `Brand hue check passed: ${scanned} stylesheets, every teal is a ramp step ` +
    `(brand ${brand.H.toFixed(1)} deg, tolerance ${HUE_TOLERANCE} deg).`
);
