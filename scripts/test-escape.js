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
