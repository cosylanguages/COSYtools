/**
 * Inline-colour check.
 *
 * The site has a light and a dark theme. A hard-coded colour in an inline style does not
 * follow the theme, so it can leave text unreadable in one of them. This check scans every
 * `style="..."` in HTML and in the JS that builds markup, and fails when it finds:
 *
 *   - a literal colour on its own (e.g. `color:#9d174d`, `background:#f4fbf6`): use a token;
 *   - a literal text/background pair below 4.5:1 contrast (self-contained pairs such as a
 *     pastel badge are fine because both halves are fixed);
 *   - white text on anything other than a sage button background (white on --sage passes
 *     in both themes; white on --sage-dark does not, use --cosy-on-sage-dark).
 *
 * Colours inside var(--token, #fallback) are ignored: the token wins when it exists.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'data', 'scripts', 'fixtures', 'fonts']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(html|js)$/.test(entry.name) && !/\.min\./.test(entry.name)) out.push(p);
  }
  return out;
}

const LITERAL = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b(?:white|black)\b/i;

function parseHex(c) {
  const m = c.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = [...h].map((x) => x + x).join('');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  if (/^white$/i.test(c.trim())) return [255, 255, 255];
  if (/^black$/i.test(c.trim())) return [0, 0, 0];
  return null;
}
const lum = ([r, g, b]) => {
  const f = (x) => ((x /= 255) <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** Returns the list of problems in one style attribute value. */
function inspect(style) {
  const decls = {};
  for (const part of style.split(';')) {
    const i = part.indexOf(':');
    if (i > 0) decls[part.slice(0, i).trim().toLowerCase()] = part.slice(i + 1).trim();
  }
  const strip = (v) => (v || '').replace(/var\([^)]*\)/gi, '');
  const textLit = LITERAL.exec(strip(decls.color));
  const bgRaw = decls.background || decls['background-color'];
  const bgMatch = LITERAL.exec(strip(bgRaw));
  // translucent rgba()/hsla() backgrounds are overlays or tints: they follow whatever is behind them
  const translucent = bgMatch && /^(?:rgba|hsla)\(/i.test(bgMatch[0]) && !/,\s*1(?:\.0+)?\s*\)$|\/\s*1\s*\)$/.test(bgMatch[0]);
  const bgLit = translucent ? null : bgMatch;
  const problems = [];

  if (translucent) return problems;

  if (textLit && bgLit) {
    const f = parseHex(textLit[0]);
    const b = parseHex(bgLit[0]);
    if (!f || !b) problems.push(`unparseable colour pair ${textLit[0]} on ${bgLit[0]}`);
    else if (ratio(f, b) < 4.5) problems.push(`${textLit[0]} on ${bgLit[0]} is ${ratio(f, b).toFixed(2)}:1 (< 4.5)`);
  } else if (textLit) {
    const white = parseHex(textLit[0]) && ratio(parseHex(textLit[0]), [255, 255, 255]) < 1.05;
    const sageBg = /var\(\s*--(?:sage-primary|sage|btn-primary-bg)(?![\w-])/.test(bgRaw || '');
    if (!(white && sageBg)) problems.push(`literal text colour ${textLit[0]} does not follow the theme; use a token`);
  } else if (bgLit) {
    problems.push(`literal background ${bgLit[0]} does not follow the theme; use a token`);
  }
  return problems;
}

const violations = [];
for (const file of walk(ROOT)) {
  const text = fs.readFileSync(file, 'utf8');
  const re = /style=\\?(["'])(.*?)\\?\1/gs;
  let m;
  while ((m = re.exec(text))) {
    const problems = inspect(m[2]);
    if (!problems.length) continue;
    const line = text.slice(0, m.index).split('\n').length;
    for (const p of problems) violations.push(`${path.relative(ROOT, file)}:${line}  ${p}`);
  }
}

if (violations.length) {
  console.error(violations.join('\n'));
  console.error(`\n${violations.length} inline colour problem(s)`);
  process.exit(1);
}
console.log('Inline colours: every literal colour is theme-safe.');
