/** Tests for shared/engines/conjugator-base.js and for pages that depend on it. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const read = (...p) => fs.readFileSync(path.join(root, ...p), 'utf8');

// 1. Load-order guard: every page using the base must load it before its own engine.
const problems = [];
for (const lang of fs.readdirSync(path.join(root, 'tools'))) {
  const langDir = path.join(root, 'tools', lang);
  if (!fs.statSync(langDir).isDirectory()) continue;
  for (const tool of fs.readdirSync(langDir)) {
    const engine = path.join(langDir, tool, 'js', 'engine.js');
    const page = path.join(langDir, tool, 'index.html');
    if (!fs.existsSync(engine) || !fs.existsSync(page)) continue;
    const src = fs.readFileSync(engine, 'utf8');
    const html = fs.readFileSync(page, 'utf8');
    const iEng = html.indexOf('js/engine.js');
    for (const base of ['ConjugatorEngineBase:conjugator-base', 'GenderEngineBase:gender-base']) {
      const [cls, file] = base.split(':');
      if (!new RegExp('extends ' + cls).test(src)) continue;
      const iBase = html.indexOf(`shared/engines/${file}.js`);
      if (iBase === -1 || iBase > iEng) problems.push(`tools/${lang}/${tool} (${cls})`);
    }
  }
}
assert.deepEqual(problems, [], 'pages must load conjugator-base.js before engine.js: ' + problems.join(', '));
for (const f of ['conjugator-base.js', 'gender-base.js']) assert.ok(read('sw.js').includes(f), `service worker must precache ${f}`);

// 2. Behaviour of the base class in a DOM.
(async () => {
  const dom = new JSDOM(`<input id="verb-search-input"><div id="search-suggestions"></div>
    <div id="game-container"></div><div id="search-section-container"></div>
    <div id="verb-result-container"></div><div id="empty-state"></div>`, { runScripts: 'outside-only', url: 'http://localhost/tools/xx/y/?preset=p&verb=lire' });
  const w = dom.window;
  const verbs = { lire: { group: 'g1' }, '<img id=pwned src=x>': { group: '"><b id=pwned2>' } };
  w.fetch = async () => ({ json: async () => verbs });
  w.eval(read('shared', 'js', 'escape.js'));
  w.eval(read('shared', 'engines', 'conjugator-base.js'));
  const searched = [];
  w.eval(`window.T = class T extends ConjugatorEngineBase {
    constructor() { super({ storeKey: 'k' }); }
    searchVerb(q) { window.__searched.push(q); }
    checkGameAnswer() {}
  }`);
  w.__searched = searched;
  const engine = new w.T();
  await new Promise((r) => setTimeout(r, 20)); // init() is async

  // data loaded + deep link handled (no preset hook => falls through to ?verb=)
  assert.deepEqual(Object.keys(engine.verbDb), Object.keys(verbs));
  assert.deepEqual(searched, ['lire'], 'handleInitialQueryParams should search the ?verb value');
  assert.equal(w.document.getElementById('verb-search-input').value, 'lire');

  // suggestions: hostile data cannot create elements, click delegation passes the exact key
  engine.handleInput('<img');
  assert.equal(w.document.getElementById('pwned'), null, 'verb key must be escaped');
  assert.equal(w.document.getElementById('pwned2'), null, 'group must be escaped');
  const btn = w.document.querySelector('#search-suggestions .suggestion-item');
  assert.ok(btn, 'a suggestion button is rendered');
  btn.click();
  assert.equal(searched.at(-1), '<img id=pwned src=x>', 'click passes the original (unescaped) key');
  engine.handleInput('   ');
  assert.equal(w.document.getElementById('search-suggestions').style.display, 'none');

  // preset hook short-circuits the search
  w.eval(`window.P = class P extends ConjugatorEngineBase {
    constructor() { super({ storeKey: 'k2' }); }
    handlePreset(p) { window.__preset = p.get('preset'); return true; }
    searchVerb(q) { window.__searched.push('SHOULD-NOT-RUN:' + q); }
    checkGameAnswer() {}
  }`);
  const before = searched.length;
  new w.P();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(w.__preset, 'p');
  assert.equal(searched.length, before, 'preset handler must prevent the normal search');

  // practice toggle
  engine.toggleGameMode();
  assert.equal(w.document.getElementById('game-container').style.display, 'block');
  engine.toggleGameMode();
  assert.equal(w.document.getElementById('empty-state').style.display, 'block');
  console.log('conjugator base: all assertions passed');

  // gender base: hostile data cannot create elements; default SRS key is the bare noun
  {
    const gd = new JSDOM('<input id="noun-search-input"><div id="search-suggestions"></div>', { runScripts: 'outside-only', url: 'http://localhost/tools/xx/g/' });
    const gw = gd.window;
    gw.fetch = async () => ({ json: async () => ({ '<img id=pwned src=x>': { gender: '"><b id=pwned2>' } }) });
    gw.eval(read('shared', 'js', 'escape.js'));
    gw.eval(read('shared', 'engines', 'gender-base.js'));
    gw.eval("window.G = class G extends GenderEngineBase { constructor() { super({ storeKey: 'g', strings: {} }); } searchNoun(q) { window.__q = q; } }");
    const ge = new gw.G();
    await new Promise((r) => setTimeout(r, 20));
    ge.handleInput('<img');
    assert.equal(gw.document.getElementById('pwned'), null, 'noun key must be escaped');
    assert.equal(gw.document.getElementById('pwned2'), null, 'gender label must be escaped');
    gw.document.querySelector('#search-suggestions .suggestion-item').click();
    assert.equal(gw.__q, '<img id=pwned src=x>');
    assert.equal(ge.srsKey('gender', { noun: 'maison' }), 'maison', 'default SRS key is the bare noun');
    console.log('gender base: all assertions passed');
  }
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
