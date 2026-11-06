/**
 * Verbs that have a verbs.json entry but no imported lexicon unit must still show their forms:
 * COSYConjugationTable.buildFromEntry builds the table, and the conjugator pages use it as a fallback.
 */
require('./lib/ignore-closed-window-errors');
const http = require('http'), fs = require('fs'), path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const root = path.join(__dirname, '..');
const srv = http.createServer((q, r) => {
  const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end(); }
  r.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[path.extname(f)] || 'application/octet-stream');
  r.end(fs.readFileSync(f));
}).listen(0);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

// 1. the builder itself
{
  const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync(path.join(root, 'shared/js/conjugation_table.js'), 'utf8'));
  const T = dom.window.COSYConjugationTable;
  ok(typeof T.buildFromEntry === 'function', 'buildFromEntry is exported');
  const html = T.buildFromEntry({ tenses: { presente: ['pago', 'pagas', 'paga', 'pagamos', 'pagáis', 'pagan'], imperativo: ['paga', 'pagad'] } }, 'es');
  ok(/pagáis/.test(html) && (html.match(/<tr /g) || []).length === 6 && /paga<\/strong>, <strong>pagad/.test(html), 'six-form tense becomes a person table, shorter lists a plain list');
  ok(!/<script/.test(T.buildFromEntry({ tenses: { x: ['<script>alert(1)</script>', 'b', 'c', 'd', 'e', 'f'] } }, 'es')), 'forms are HTML-escaped');
  ok(T.buildFromEntry({ tenses: {} }, 'es') === null && T.buildFromEntry(null, 'es') === null && T.buildFromEntry({ tenses: { a: ['', ' '] } }, 'es') === null, 'nothing usable -> null (the page keeps its "not available" message)');
}

// 2. the pages' own practice modes must survive entries that have fewer tenses (they once crashed on
//    "pasado" / "passado" for new "Irregular" entries that only had the present tense)
async function practiceSurvives(tool) {
  const errs = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errs.push(e.message));
  const dom = await JSDOM.fromURL(`http://localhost:${srv.address().port}/tools/${tool}/index.html`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) { w.fetch = u => fetch(new URL(u, w.location.href).href); w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, addEventListener() {} })); }
  });
  const d = dom.window.document;
  let next = null;
  for (const deadline = Date.now() + 15000; !next && Date.now() < deadline;) {
    await sleep(250);
    const prompt = d.getElementById('practice-prompt');
    if (prompt && prompt.textContent.trim()) next = d.getElementById('practice-next');
  }
  let asked = 0;
  if (next) for (let i = 0; i < 150; i++) { next.click(); if (d.getElementById('practice-prompt').textContent.trim()) asked++; }
  ok(!!next && asked === 150 && errs.length === 0, `${tool}: 150 practice questions without errors ${errs.slice(0, 1).join('|')}`);
  dom.window.close();
}

// 3. the pages
const CASES = [['es/conjugeur', 'pagar', 'pagáis'], ['de/konjugation', 'ausgeben', 'gibt aus'], ['pt/conjugeur', 'pagar', 'pagais'], ['ka/conjugeur', 'იხდის', 'ვიხდით']];
(async () => {
  for (const t of ['es/conjugeur', 'pt/conjugeur', 'de/konjugation']) await practiceSurvives(t);
  for (const [tool, verb, expect] of CASES) {
    const dom = await JSDOM.fromURL(`http://localhost:${srv.address().port}/tools/${tool}/index.html`, {
      runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
      beforeParse(w) { w.fetch = u => fetch(new URL(u, w.location.href).href); w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, addEventListener() {} })); }
    });
    const w = dom.window, d = w.document;
    let input = null;
    for (const deadline = Date.now() + 15000; !input && Date.now() < deadline;) {
      await sleep(250);
      input = d.querySelector('#verb-search-input, #search-input, input[type="text"]');
      if (input && !(w.COSYConjugationTable && d.querySelector('#result-display, #verb-display') && d.querySelector('#result-display, #verb-display').innerHTML.length > 0)) input = null;
    }
    let shown = '';
    for (const deadline = Date.now() + 15000; !shown.includes(expect) && Date.now() < deadline;) {
      if (input) { input.value = verb; input.dispatchEvent(new w.Event('input', { bubbles: true })); }
      await sleep(400);
      const disp = d.querySelector('#result-display, #verb-display');
      shown = disp ? disp.textContent : '';
    }
    const disp = d.querySelector('#result-display, #verb-display');
    ok(shown.includes(expect) && !!disp.querySelector('.conjugation-table') && !/table-unavailable/.test(disp.innerHTML), `${tool}: ${verb} shows its conjugation table ("${expect}")`);
    w.close();
  }
  console.log(fails ? 'FAILURES: ' + fails : 'ALL ENTRY TABLE CHECKS PASSED');
  srv.close(); process.exit(fails ? 1 : 0);
})();
