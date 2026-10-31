/**
 * Automated accessibility scan with axe-core over every page (run in jsdom),
 * plus a few interactive states (drill, table mode, feedback, weak spots).
 * jsdom cannot compute layout, so colour-contrast and landmark-region rules are disabled;
 * those still need a real browser (Lighthouse / axe DevTools).
 */
const http = require('http'), fs = require('fs'), path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = path.join(__dirname, '..');
const srv = http.createServer((q, r) => {
  const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end(); }
  r.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[path.extname(f)] || 'application/octet-stream');
  r.end(fs.readFileSync(f));
}).listen(0);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'docs', 'assets', 'scripts'].includes(e.name)) continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out); else if (e.name === 'index.html') out.push(path.relative(root, f));
  }
  return out;
}

async function open(page) {
  const dom = await JSDOM.fromURL(`http://localhost:${srv.address().port}/${page}`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      w.fetch = u => fetch(new URL(u, w.location.href).href);
      w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, addEventListener() {} }));
    }
  });
  await sleep(1200);
  dom.window.eval(axeSource);
  return dom.window;
}
async function scan(w, label, failures) {
  const res = await w.axe.run(w.document, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } }, resultTypes: ['violations'] });
  if (res.violations.length === 0) { console.log('ok  ', label); return; }
  res.violations.forEach(v => {
    failures.push(label);
    console.log(`FAIL ${label}: [${v.impact}] ${v.id} – ${v.help}`);
    v.nodes.slice(0, 2).forEach(n => console.log('       ', n.html.slice(0, 140).replace(/\s+/g, ' ')));
  });
}

(async () => {
  const failures = [];
  for (const page of walk(root, []).concat(['404.html']).sort()) {
    try { const w = await open(page); await scan(w, page, failures); w.close(); }
    catch (e) { failures.push(page); console.log('FAIL', page, e.message); }
  }

  // Interactive states
  try {
    let w = await open('practice/top-verbs/index.html');
    w.document.getElementById('btn-launch').click(); await sleep(150);
    await scan(w, 'top-verbs: drill question', failures);
    w.eval("document.getElementById('drill-single-input').value = 'x'; checkSingleDrillAnswer();");
    await scan(w, 'top-verbs: drill feedback', failures);
    w.eval('showSetupCard()');
    w.document.getElementById('mode-card-table').click(); w.document.getElementById('btn-launch').click(); await sleep(300);
    await scan(w, 'top-verbs: table mode', failures);
    w.close();

    w = await open('practice/quick-drills/index.html');
    w.document.querySelector('#qd-options button').click();
    await scan(w, 'quick-drills: after answering', failures);
    w.close();

    w = await open('practice/weak-spots/index.html');
    w.COSYReferenceUtils.recordWeakSpot({ id: "l'été:1", lang: 'fr', type: 'T', prompt: 'été', answer: "l'été" });
    w.renderWeakSpotsList();
    await scan(w, 'weak-spots: with items', failures);
    w.close();
  } catch (e) { failures.push('states'); console.log('FAIL interactive states', e.message); }

  // Tool result views: search, pick the first suggestion, scan what gets rendered
  const TOOLS = ['de/praepositionen', 'el/genos-ptoseis', 'el/klisi-rimaton', 'el/syntaxi', 'en/irregular-verbs', 'en/verb-prep',
    'fr/conjugeur', 'fr/genre', 'fr/regime', 'it/coniugatore', 'it/genere', 'it/reggenza', 'ru/rod-padezhi', 'ru/spryazhenie'];
  for (const t of TOOLS) {
    try {
      const w = await open(`tools/${t}/index.html`);
      const box = w.document.getElementById('search-suggestions');
      const input = box && box.parentElement.querySelector('input[type="text"], input[type="search"], input:not([type])');
      let picked = false;
      for (const ch of ['a', 'e', 'p', 's', 'm', 'b', 'c', 'd', 'l', 'g', 'а', 'о', 'п', 'с', 'м', 'α', 'ε', 'π', 'κ', 'μ']) {
        if (!input) break;
        input.value = ch; input.dispatchEvent(new w.Event('input', { bubbles: true })); await sleep(60);
        const item = box.querySelector('.suggestion-item');
        if (item) { item.click(); picked = true; break; }
      }
      if (!picked) { failures.push(t); console.log(`FAIL tools/${t}: could not open a result`); w.close(); continue; }
      await sleep(700);
      await scan(w, `tools/${t}: result view`, failures);
      w.close();
    } catch (e) { failures.push(t); console.log('FAIL', t, e.message); }
  }

  console.log(failures.length ? `\nFAILURES: ${failures.length}` : '\nALL AXE SCANS PASSED');
  srv.close(); process.exit(failures.length ? 1 : 0);
})();
