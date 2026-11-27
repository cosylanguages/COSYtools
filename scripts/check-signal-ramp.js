/**
 * Signal ramp check.
 *
 * The ten --cosy-NNN steps in shared/css/tokens.css are one hue at ten
 * lightnesses, and every step has a job. Nothing else in the repository reads
 * them, so a hand edit is invisible: a step can quietly stop being text-safe
 * while the comment above it still promises that it is.
 *
 * This gate measures the ramp against the roles that comment claims.
 *
 *   Structure  all ten steps exist, L* strictly decreases, the hue stays within
 *              3 degrees of the brand colour.
 *   Identity   step 500 is the brand colour from the canonical tokens, not a
 *              hand-picked neighbour of it.
 *   Roles      700 and darker are text-safe on white and on cream; 800 and
 *              darker carry white text; 500 stays legible on a dark surface;
 *              300 clears 3:1 on dark for the focus ring; 50-200 stay washes.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const canonical = fs.readFileSync(path.join(ROOT, 'shared/css/cosy-tokens.css'), 'utf8');
const local = fs.readFileSync(path.join(ROOT, 'shared/css/tokens.css'), 'utf8');

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const HUE_TOLERANCE = 3;

// ── CSS token reading ────────────────────────────────────────────────────────

/** Body of the first block whose selector starts the given pattern. */
function firstBlock(source, selector) {
  const match = new RegExp(`^${selector}[^{]*\\{`, 'm').exec(source);
  if (!match) return '';
  const start = source.indexOf('{', match.index);
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start + 1, i);
  }
  return '';
}

/** Last block that starts with the given selector (dark overrides are repeated). */
function lastBlock(source, selector) {
  const pattern = new RegExp(`^${selector}[^{]*\\{`, 'gm');
  let match;
  let last = '';
  while ((match = pattern.exec(source))) last = match.index;
  if (!last) return '';
  const start = source.indexOf('{', last);
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start + 1, i);
  }
  return '';
}

function declarations(block) {
  const out = {};
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[match[1]] = match[2].trim();
  return out;
}

function resolveVar(value, map, depth = 0) {
  if (depth > 8) return value;
  const match = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/.exec(value.trim());
  if (!match) return value.trim();
  return map[match[1]] ? resolveVar(map[match[1]], map, depth + 1) : match[2] || value;
}

// ── Colour maths ─────────────────────────────────────────────────────────────

function parseHex(value) {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

const channel = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function lab([r, g, b]) {
  const [lr, lg, lb] = [channel(r), channel(g), channel(b)];
  const x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175;
  const z = lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const fx = f(x / 0.95047);
  const fy = f(y / 1.0);
  const fz = f(z / 1.08883);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

const hue = (c) => (Math.atan2(c.b, c.a) * 180) / Math.PI;

// ── The ramp and its reference colours ───────────────────────────────────────

const lightTokens = declarations(firstBlock(canonical, ':root'));
const darkTokens = {
  ...lightTokens,
  ...declarations(lastBlock(canonical, 'html\\[data-theme="dark"\\],\\s*body\\.theme-dark')),
};
const localRoot = declarations(firstBlock(local, ':root'));

const WHITE = [255, 255, 255];
const cream = parseHex(resolveVar(lightTokens['--cosy-color-cream'], lightTokens));
const darkSurface = parseHex(resolveVar(darkTokens['--cosy-color-surface'], darkTokens));
const brandHex = resolveVar(lightTokens['--cosy-signal'], lightTokens);
const brand = parseHex(brandHex);

const ramp = new Map();
for (const step of STEPS) {
  const raw = localRoot[`--cosy-${step}`];
  ramp.set(step, raw ? parseHex(resolveVar(raw, { ...lightTokens, ...localRoot })) : null);
}

const failures = [];
const rows = [];
const check = (label, ok, detail) => {
  rows.push(`${ok ? 'ok  ' : 'FAIL'} ${detail.padEnd(46)} ${label}`);
  if (!ok) failures.push(label);
};

// ── Structure ────────────────────────────────────────────────────────────────

check(
  'all ten ramp steps are defined',
  [...ramp.values()].every(Boolean),
  STEPS.filter((s) => !ramp.get(s)).join(', ') || '50-900'
);

const labs = STEPS.map((step) => (ramp.get(step) ? lab(ramp.get(step)) : null));

const descending = labs.every(
  (current, i) => i === 0 || (current && labs[i - 1] && current.L < labs[i - 1].L)
);
check(
  'lightness decreases strictly from 50 to 900',
  descending,
  labs.map((c) => (c ? c.L.toFixed(1) : '??')).join(' > ')
);

const brandHue = brand ? hue(lab(brand)) : 0;
const drifts = labs.map((c) => (c ? Math.abs(((hue(c) - brandHue + 540) % 360) - 180) : 999));
check(
  `every step stays within ${HUE_TOLERANCE} degrees of the brand hue`,
  drifts.every((d) => d <= HUE_TOLERANCE),
  `max drift ${Math.max(...drifts).toFixed(2)} deg`
);

// ── Identity ─────────────────────────────────────────────────────────────────

check(
  'step 500 is the brand colour itself',
  Boolean(brand) && ramp.get(500)?.join() === brand.join(),
  `500 is ${localRoot['--cosy-500'] || 'missing'}, brand is ${brandHex}`
);

// ── Roles ────────────────────────────────────────────────────────────────────

const ratio = (step, against) => {
  const colour = ramp.get(step);
  return colour && against ? contrast(colour, against) : NaN;
};

for (const step of [700, 800, 900]) {
  check(
    `step ${step} is text-safe on white (>= 4.5:1)`,
    ratio(step, WHITE) >= 4.5,
    `${ratio(step, WHITE).toFixed(2)}:1`
  );
}
for (const step of [700, 800, 900]) {
  check(
    `step ${step} is text-safe on cream (>= 4.5:1)`,
    ratio(step, cream) >= 4.5,
    `${ratio(step, cream).toFixed(2)}:1`
  );
}
for (const step of [800, 900]) {
  const onStep = ramp.get(step) ? contrast(WHITE, ramp.get(step)) : NaN;
  check(`step ${step} carries white text (>= 4.5:1)`, onStep >= 4.5, `${onStep.toFixed(2)}:1`);
}
check(
  'step 500 is legible on a dark surface (>= 4.5:1)',
  ratio(500, darkSurface) >= 4.5,
  `${ratio(500, darkSurface).toFixed(2)}:1`
);
check(
  'step 300 clears 3:1 on dark for the focus ring',
  ratio(300, darkSurface) >= 3,
  `${ratio(300, darkSurface).toFixed(2)}:1`
);
for (const step of [50, 100, 200]) {
  check(
    `step ${step} stays a wash on cream (< 1.5:1)`,
    ratio(step, cream) < 1.5,
    `${ratio(step, cream).toFixed(2)}:1`
  );
}

// The dark theme reuses a light step as its focus ring; if the ramp moves, that
// ring can drop below the 3:1 floor without any other check noticing.
const darkFocus = /--cosy-focus-ring:\s*var\((--cosy-\d00)\)/.exec(local);
if (darkFocus) {
  const step = Number(darkFocus[1].replace('--cosy-', ''));
  const ringContrast = ratio(step, darkSurface);
  check(
    `dark focus ring (${darkFocus[1]}) clears 3:1 on dark`,
    ringContrast >= 3,
    `${ringContrast.toFixed(2)}:1`
  );
}

// ── Report ───────────────────────────────────────────────────────────────────

console.log('Signal ramp (shared/css/tokens.css)');
for (const step of STEPS) {
  const l = labs[STEPS.indexOf(step)];
  console.log(
    `  --cosy-${String(step).padEnd(4)} ${(localRoot[`--cosy-${step}`] || 'missing').padEnd(9)}` +
      ` L* ${l ? l.L.toFixed(1).padStart(5) : '   ??'}` +
      `  white ${ratio(step, WHITE).toFixed(2).padStart(5)}:1` +
      `  cream ${ratio(step, cream).toFixed(2).padStart(5)}:1` +
      `  dark ${ratio(step, darkSurface).toFixed(2).padStart(5)}:1`
  );
}
console.log('');
console.log(rows.join('\n'));

if (failures.length) {
  console.error(`\nSignal ramp check failed: ${failures.length} problem(s).`);
  process.exit(1);
}
console.log('\nSignal ramp check passed: ten steps, one hue, every role holds.');
