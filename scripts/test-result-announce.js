/**
 * Tools replace their result as you type / pick a suggestion. Screen reader users need to be
 * told: shell.js announces the new entry's name through a polite live region.
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
const logs = {};
function vc(t) { const v = new VirtualConsole(); logs[t] = []; v.on('jsdomError', e => logs[t].push('jsdomError: ' + String(e.message).slice(0, 160))); v.on('error', (...a) => logs[t].push('error: ' + a.join(' ').slice(0, 160))); return v; }
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

const PAGES = fs.readdirSync(path.join(root, 'tools')).flatMap(l => fs.readdirSync(path.join(root, 'tools', l)).map(t => `${l}/${t}`))
  .filter(p => { const f = path.join(root, 'tools', p, 'index.html'); return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('id="search-suggestions"'); }).sort();

const firstKey = t => {
  for (const name of ['verbs.json', 'nouns.json']) {
    const f = path.join(root, 'tools', t, 'data', name);
    if (fs.existsSync(f)) { try { const k = Object.keys(JSON.parse(fs.readFileSync(f, 'utf8')))[0]; if (k) return k; } catch (e) {} }
  }
  return null;
};
async function pool(items, size, fn) { let n = 0; await Promise.all(Array.from({ length: size }, async () => { while (n < items.length) await fn(items[n++]); })); }

(async () => {
  await pool(PAGES, 4, async t => {
    try {
      const dom = await JSDOM.fromURL(`http://localhost:${srv.address().port}/tools/${t}/index.html`, {
        runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc(t),
        beforeParse(w) { w.fetch = u => fetch(new URL(u, w.location.href).href); w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, addEventListener() {} })); }
      });
      const w = dom.window, d = w.document;
      await sleep(1200);
      const display = ['result-display', 'verb-display', 'verb-result-container', 'noun-result-container'].map(id => d.getElementById(id)).filter(Boolean)[0];
      const box = d.getElementById('search-suggestions');
      const input = box.parentElement.querySelector('input[type="text"], input[type="search"], input:not([type])');
      if (!display || !input) { ok(false, `${t}: result container and search input found`); w.close(); return; }
      let announcer = null;
      for (const deadline = Date.now() + 15000; !announcer && Date.now() < deadline;) {   // shell.js is deferred: wait for it
        announcer = d.querySelector('[data-result-announcer]');
        if (!announcer) await sleep(200);
      }
      ok(!!announcer && announcer.getAttribute('role') === 'status', `${t}: announcer exists`);
      const t0 = Date.now(), histA = [], histD = [];
      if (announcer) {
        new w.MutationObserver(() => histA.push([Date.now() - t0, announcer.textContent])).observe(announcer, { childList: true, characterData: true, subtree: true });
        new w.MutationObserver(m => histD.push([Date.now() - t0, m.length])).observe(display, { childList: true, subtree: true });
        histA.push([0, 'initial:' + announcer.textContent, 'display:' + display.textContent.slice(0, 20)]);
      }
      if (!announcer) { w.close(); return; }

      // open a result: suggestion engine tools -> first suggestion; others -> type a real entry
      let opened = false;
      for (const deadline = Date.now() + 15000; !opened && Date.now() < deadline;) {
        for (const ch of ['a', 'e', 'p', 's', 'm', 'b', 'c', 'd', 'l', 'g', 'а', 'о', 'п', 'с', 'м', 'α', 'ε', 'π', 'κ', 'μ']) {
          input.value = ch; input.dispatchEvent(new w.Event('input', { bubbles: true })); await sleep(60);
          const item = box.querySelector('.suggestion-item');
          if (item) { item.click(); opened = true; break; }
        }
        if (!opened) { const key = firstKey(t); if (key) { input.value = key; input.dispatchEvent(new w.Event('input', { bubbles: true })); opened = true; } else await sleep(300); }
      }
      // the announcer must end up saying the heading of the displayed result
      let said = '', heading = '';
      const started = Date.now();
      let retried = false;
      for (const deadline = started + 14000; Date.now() < deadline;) {
        await sleep(250);
        // On slow runners the result can render before the announcer's observer sees it (same pass on main
        // flakes in CI). One re-render of the same entry must then be announced.
        if (!retried && Date.now() - started > 5000 && !announcer.textContent) {
          retried = true;
          const key = firstKey(t);
          if (key) {
            input.value = ''; input.dispatchEvent(new w.Event('input', { bubbles: true })); await sleep(300);
            input.value = key; input.dispatchEvent(new w.Event('input', { bubbles: true }));
          }
        }
        const h = display.querySelector('h1, h2');
        heading = '';
        if (h) {   // same rule as shell.js: the heading's own text, without badges in child elements
          for (const n of h.childNodes) if (n.nodeType === 3) heading += n.nodeValue;
          heading = heading.replace(/\s+/g, ' ').trim() || h.textContent.replace(/\s+/g, ' ').trim();
        }
        said = announcer.textContent;
        if (heading && said === heading) break;
      }
      if (!(heading && said === heading)) {
        console.log('DIAG', t, JSON.stringify({ inDoc: d.contains(announcer), announcers: d.querySelectorAll('[data-result-announcer]').length, sameDisplay: display === d.getElementById('result-display'), displayInDoc: d.contains(display), html: display.innerHTML.slice(0, 120), input: input.value, ready: d.readyState, logs: (logs[t] || []).slice(0, 6), histA: histA.slice(0, 12), histD: histD.slice(0, 12) }));
      }
      ok(!/\bA1\b|Needs Review/.test(said), `${t}: badge text is not announced`);
      ok(!!heading && said === heading, `${t}: announces "${heading.slice(0, 30)}"${said === heading ? '' : ' (said: "' + said.slice(0, 30) + '")'}`);
      w.close();
    } catch (e) { fails++; console.log('FAIL', t, e.message); }
  });
  console.log(fails ? 'FAILURES: ' + fails : 'ALL RESULT ANNOUNCEMENT CHECKS PASSED');
  srv.close(); process.exit(fails ? 1 : 0);
})();
