const assert = require('node:assert/strict');
const { escapeHtml, html, raw } = require('../shared/js/escape.js');

assert.equal(escapeHtml('<img src=x onerror="a()">'), '&lt;img src=x onerror=&quot;a()&quot;&gt;');
assert.equal(escapeHtml("it's & fine"), 'it&#39;s &amp; fine');
assert.equal(escapeHtml(null), '');
assert.equal(escapeHtml(undefined), '');
assert.equal(escapeHtml(0), '0');
assert.equal(html`<b>${'<script>'}</b>`, '<b>&lt;script&gt;</b>');
assert.equal(html`<i>${raw('<br>')}</i>`, '<i><br></i>');
assert.equal(html`no values`, 'no values');
console.log('escape helper: all assertions passed');

// Guard: any page whose engine uses COSYEscape must load shared/js/escape.js first.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const toolsDir = path.join(root, 'tools');
const problems = [];
for (const lang of fs.readdirSync(toolsDir)) {
  const langDir = path.join(toolsDir, lang);
  if (!fs.statSync(langDir).isDirectory()) continue;
  for (const tool of fs.readdirSync(langDir)) {
    const engine = path.join(langDir, tool, 'js', 'engine.js');
    const page = path.join(langDir, tool, 'index.html');
    if (!fs.existsSync(engine) || !fs.existsSync(page)) continue;
    if (!fs.readFileSync(engine, 'utf8').includes('COSYEscape')) continue;
    const html = fs.readFileSync(page, 'utf8');
    const iEsc = html.indexOf('shared/js/escape.js');
    const iEng = html.indexOf('js/engine.js');
    if (iEsc === -1 || iEsc > iEng) problems.push(`tools/${lang}/${tool}/index.html`);
  }
}
assert.deepEqual(problems, [], 'pages using COSYEscape without loading escape.js first: ' + problems.join(', '));
console.log('escape guard: every page using COSYEscape loads it first');
