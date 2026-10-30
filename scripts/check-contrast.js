/**
 * Colour-contrast check (WCAG 2.x) for the design tokens and the fixed colours used on
 * the practice pages. jsdom cannot compute layout, so axe skips contrast; this fills the gap
 * by resolving the CSS custom properties in shared/css/cosy-tokens.css for light and dark.
 *
 * Normal text must reach 4.5:1, large text / UI components 3:1.
 */
const fs = require('fs'), path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', 'shared', 'css', 'cosy-tokens.css'), 'utf8');

function block(startRe) {
  const m = css.match(startRe);
  if (!m) throw new Error('block not found: ' + startRe);
  let i = css.indexOf('{', m.index), depth = 0, j = i;
  for (; j < css.length; j++) { if (css[j] === '{') depth++; else if (css[j] === '}') { depth--; if (!depth) break; } }
  return css.slice(i + 1, j);
}
function vars(text) {
  const out = {};
  text.replace(/(--[\w-]+)\s*:\s*([^;]+);/g, (_, k, v) => { out[k] = v.trim(); });
  return out;
}
const light = vars(block(/^:root\s*\{/m));
const dark = Object.assign({}, light, vars(block(/html\[data-theme="dark"\],\s*body\.theme-dark\s*\{/)));

function resolve(v, map, depth = 0) {
  if (depth > 10) return v;
  const m = v.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/);
  if (m) return map[m[1]] ? resolve(map[m[1]], map, depth + 1) : (m[2] ? resolve(m[2].trim(), map, depth + 1) : v);
  return v;
}
function parse(c) {
  c = c.trim();
  let m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) { let h = m[1]; if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  m = c.match(/^rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}
const lum = ([r, g, b]) => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const tok = (map, name) => parse(resolve('var(' + name + ')', map));

// [description, fg, bg, minimum] – "tok:--x" uses the active theme, "#hex" is a fixed colour
const PAIRS = [
  ['body text on surface', 'tok:--ink', 'tok:--surface-color', 4.5],
  ['secondary text on surface', 'tok:--ink-soft', 'tok:--surface-color', 4.5],
  ['muted text on surface', 'tok:--ink-muted', 'tok:--surface-color', 4.5],
  ['heading green on surface', 'tok:--sage-dark', 'tok:--surface-color', 4.5],
  ['heading green on sage-mist chip', 'tok:--sage-dark', 'tok:--sage-mist', 4.5],
  ['secondary text on sage-mist', 'tok:--ink-soft', 'tok:--sage-mist', 4.5],
  ['text on sage-dark (buttons, active chips)', 'tok:--cosy-on-sage-dark', 'tok:--sage-dark', 4.5],
  ['focus ring vs surface (UI, 3:1)', 'tok:--cosy-focus-ring', 'tok:--surface-color', 3],
  // fixed colours, same in both themes (own backgrounds)
  ['toast: white on #234027', '#ffffff', '#234027', 4.5],
  ['badge: #92400e on #fef3c7', '#92400e', '#fef3c7', 4.5],
  ['badge: #0369a1 on #e0f2fe', '#0369a1', '#e0f2fe', 4.5],
  ['error: #991b1b on #fee2e2', '#991b1b', '#fee2e2', 4.5],
  ['success: #166534 on #dcfce7', '#166534', '#dcfce7', 4.5],
  ['mnemonic banner: #92400e on #fef3c7', '#92400e', '#fef3c7', 4.5],
];

let fails = 0;
for (const [theme, map] of [['light', light], ['dark', dark]]) {
  for (const [label, fg, bg, min] of PAIRS) {
    const fixed = !fg.startsWith('tok:') && !bg.startsWith('tok:');
    if (fixed && theme === 'dark') continue;               // checked once
    const f = fg.startsWith('tok:') ? tok(map, fg.slice(4)) : parse(fg);
    const b = bg.startsWith('tok:') ? tok(map, bg.slice(4)) : parse(bg);
    if (!f || !b) { console.log(`skip ${theme}: ${label} (could not resolve)`); continue; }
    const r = ratio(f, b);
    const ok = r >= min;
    if (!ok) fails++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${fixed ? 'both ' : theme.padEnd(5)} ${r.toFixed(2).padStart(5)}:1 (min ${min})  ${label}`);
  }
}
console.log(fails ? `\nContrast failures: ${fails}` : '\nAll checked colour pairs meet WCAG contrast.');
process.exit(fails ? 1 : 0);
