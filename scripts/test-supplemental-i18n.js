/**
 * The "Source-backed additions" panel (shared/js/supplemental_lexicon.js) must be fully
 * translated for all 14 languages, and every tool language page must show its own title.
 */
const http = require('http'), fs = require('fs'), path = require('path'), vm = require('vm');
const { JSDOM, VirtualConsole } = require('jsdom');
const root = path.join(__dirname, '..');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

// 1. static: complete table
const src = fs.readFileSync(path.join(root, 'shared', 'js', 'supplemental_lexicon.js'), 'utf8');
const m = src.match(/const SUPP_I18N = (\{[\s\S]*?\n        \});/);
ok(!!m, 'SUPP_I18N table found');
const table = vm.runInNewContext('(' + m[1] + ')');
const LANGS = ['ba', 'br', 'cv', 'de', 'el', 'en', 'es', 'fr', 'hy', 'it', 'ka', 'pt', 'ru', 'tt'];
const keys = Object.keys(table.en);
ok(LANGS.every(l => table[l] && keys.every(k => table[l][k] && table[l][k].trim())), 'all 14 languages have all ' + keys.length + ' strings');
ok(LANGS.every(l => /\{n\}/.test(table[l].more)), 'every "show more" string keeps the {n} placeholder');
ok(LANGS.filter(l => l !== 'en').every(l => table[l].title !== table.en.title), 'no language still shows the English title');

// 2. pages: one tool per language shows its own title
const srv = http.createServer((q, r) => {
  const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end(); }
  r.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[path.extname(f)] || 'application/octet-stream');
  r.end(fs.readFileSync(f));
}).listen(0);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  for (const l of LANGS) {
    const tools = fs.readdirSync(path.join(root, 'tools', l)).filter(t => {
      const f = path.join(root, 'tools', l, t, 'index.html');
      return fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('id="search-suggestions"');
    });
    if (!tools.length) { console.log('skip', l, '(no tool with a search box)'); continue; }
    const dom = await JSDOM.fromURL(`http://localhost:${srv.address().port}/tools/${l}/${tools[0]}/index.html`, {
      runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
      beforeParse(w) { w.fetch = u => fetch(new URL(u, w.location.href).href); w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, addEventListener() {} })); }
    });
    await sleep(1200);
    const el = dom.window.document.getElementById('supplemental-lexicon-title');
    ok(el && el.textContent === table[l].title, `${l}/${tools[0]}: panel title is "${table[l].title}"`);
    dom.window.close();
  }
  console.log(fails ? 'FAILURES: ' + fails : 'ALL SUPPLEMENTAL I18N CHECKS PASSED');
  srv.close(); process.exit(fails ? 1 : 0);
})();
