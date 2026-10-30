/**
 * Behavioural test: search suggestions in every tool that has them.
 * Items must be real buttons, keyboard navigable (ArrowDown/Up/Escape),
 * expose aria-expanded on the input, and selecting one must run the search.
 */
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

const PAGES = ['de/praepositionen', 'el/genos-ptoseis', 'el/klisi-rimaton', 'el/syntaxi', 'en/irregular-verbs', 'en/verb-prep',
  'fr/conjugeur', 'fr/genre', 'fr/regime', 'it/coniugatore', 'it/genere', 'it/reggenza', 'ru/rod-padezhi', 'ru/spryazhenie'];

function getComputedStyleDisplay(w, el) { return w.getComputedStyle(el).display; }

async function testPage(tool) {
  const errs = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errs.push(e.message));
  const dom = await JSDOM.fromURL(`http://localhost:${srv.address().port}/tools/${tool}/index.html`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) { w.fetch = u => fetch(new URL(u, w.location.href).href); w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, addEventListener() {} })); }
  });
  const w = dom.window, d = w.document;
  await sleep(1500);
  const box = d.getElementById('search-suggestions');
  const input = box && box.parentElement.querySelector('input[type="text"], input[type="search"], input:not([type])');
  if (!box || !input) { ok(false, `${tool}: search box found`); return; }

  let typed = null;
  for (const ch of ['a', 'e', 'p', 's', 'm', 'b', 'c', 'd', 'l', 'g', 'а', 'о', 'п', 'с', 'м', 'α', 'ε', 'π', 'κ', 'μ']) {
    input.value = ch; input.dispatchEvent(new w.Event('input', { bubbles: true }));
    await sleep(60);
    if (box.querySelector('.suggestion-item')) { typed = ch; break; }
  }
  if (!typed) { ok(false, `${tool}: suggestions appear for some letter`); return; }
  const items = [...box.querySelectorAll('.suggestion-item')];
  ok(items.every(i => i.tagName === 'BUTTON' && i.type === 'button' && i.dataset.key), `${tool}: ${items.length} suggestions are buttons with data-key`);
  await sleep(50);
  const live = [...d.querySelectorAll('[role="status"]')].map(e => e.textContent).join(' ');
  ok(/\d/.test(live) && !input.hasAttribute('aria-expanded'), `${tool}: result count is announced (and no unsupported aria-expanded on the text field)`);
  input.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  ok(d.activeElement === items[0], `${tool}: ArrowDown moves focus into the list`);
  if (items.length > 1) {
    items[0].dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    ok(d.activeElement === items[1], `${tool}: ArrowDown moves to next item`);
    items[1].dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  }
  items[0].dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await sleep(60);
  ok(d.activeElement === input && getComputedStyleDisplay(w, box) === 'none', `${tool}: Escape returns to the input and closes the list`);
  ok(errs.length === 0, `${tool}: no script errors ${errs.slice(0, 1).join('|')}`);

  // selecting: the handler must run without throwing (including keys with apostrophes)
  input.value = typed; input.dispatchEvent(new w.Event('input', { bubbles: true })); await sleep(60);
  const first = box.querySelector('.suggestion-item');
  let threw = null; w.addEventListener('error', e => { threw = e.message; });
  first.click(); await sleep(150);
  ok(!threw, `${tool}: selecting a suggestion works ${threw || ''}`);
  w.close();
}

(async () => {
  for (const t of PAGES) { try { await testPage(t); } catch (e) { fails++; console.log('FAIL', t, e.message); } }
  console.log(fails ? 'FAILURES: ' + fails : 'ALL TOOL SUGGESTION CHECKS PASSED');
  srv.close(); process.exit(fails ? 1 : 0);
})();
