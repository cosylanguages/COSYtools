#!/usr/bin/env node
/**
 * test-hub.js — behavioural tests for the hub filters (runs in jsdom, no browser needed).
 * Serves the repo over a throwaway local HTTP server so localStorage and relative scripts work.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { JSDOM, ResourceLoader } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8'));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, rel.endsWith('/') ? rel + 'index.html' : rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

class LocalOnly extends ResourceLoader {
  fetch(url, opts) { return url.startsWith('http://127.0.0.1') ? super.fetch(url, opts) : Promise.resolve(Buffer.from('')); }
}

let failures = 0;
function check(name, cond, detail) {
  if (cond) console.log('  PASS ' + name);
  else { failures++; console.error('  FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

async function load(base, query) {
  const dom = await JSDOM.fromURL(`${base}/index.html${query || ''}`, {
    runScripts: 'dangerously', resources: new LocalOnly(), pretendToBeVisual: true
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  await new Promise(r => setTimeout(r, 30));
  return dom;
}

const visibleIds = doc => [...doc.querySelectorAll('.engine-card')].filter(c => !c.hidden).map(c => c.dataset.tool);
const click = (doc, sel) => doc.querySelector(sel).click();

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const stable = catalog.filter(t => t.status !== 'stub');

  console.log('Hub: structure');
  let dom = await load(base);
  let d = dom.window.document;
  check('every catalog tool has exactly one card', d.querySelectorAll('.engine-card').length === catalog.length &&
    catalog.every(t => d.querySelector(`.engine-card[data-tool="${t.id}"]`)));
  check('every card links to an existing page', [...d.querySelectorAll('.engine-card')].every(a => fs.existsSync(path.join(ROOT, a.getAttribute('href'), 'index.html'))));
  check('cards render task category badges', [...d.querySelectorAll('.card-type-tag')].length === catalog.length);
  check('interface language select has explicit label', d.querySelector('label[for="cosy-ui-language-select"]') !== null);
  check('search input has aria-describedby search hint', d.getElementById('hub-search-input').getAttribute('aria-describedby') === 'search-hint');

  console.log('Hub: defaults');
  check('in-development tools are hidden by default', visibleIds(d).length === stable.length, `${visibleIds(d).length} vs ${stable.length}`);
  check('dev-only language pills are hidden by default', [...d.querySelectorAll('[data-dev-only]')].every(b => b.hidden));
  check('result count is shown', /\b21\b/.test(d.getElementById('hub-result-count').textContent) || d.getElementById('hub-result-count').textContent.includes(String(stable.length)));

  console.log('Hub: filters');
  click(d, '[data-filter-lang="de"]');
  check('German filter shows only German tools', visibleIds(d).length === 3 && visibleIds(d).every(id => id.startsWith('de-')), visibleIds(d).join());
  click(d, '[data-filter-lang="all"]');
  click(d, '[data-filter-type="gender-case"]');
  check('type filter hides other types', visibleIds(d).every(id => catalog.find(t => t.id === id).type === 'gender-case'));
  check('empty sections are hidden', [...d.querySelectorAll('.hub-section')].filter(s => !s.hidden).length === 1);
  click(d, '[data-filter-lang="en"]');
  check('empty state appears when nothing matches (en + gender-case)', d.getElementById('no-results-box').style.display === 'block');
  click(d, '#hub-reset');
  check('reset restores all stable tools', visibleIds(d).length === stable.length && d.getElementById('no-results-box').style.display === 'none');

  console.log('Hub: search');
  const input = d.getElementById('hub-search-input');
  input.value = 'спряжение';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  check('search matches native titles (ru)', visibleIds(d).includes('ru-spryazhenie'));
  input.value = 'zzzzqq';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  check('nonsense search shows empty state', visibleIds(d).length === 0 && d.getElementById('no-results-box').style.display === 'block');

  console.log('Hub: dev toggle & URL state');
  click(d, '#hub-reset');
  d.getElementById('hub-show-dev').click();
  check('dev toggle reveals all catalog tools', visibleIds(d).length === catalog.length);
  click(d, '[data-filter-lang="ba"]');
  check('URL mirrors filter state', dom.window.location.search.includes('lang=ba') && dom.window.location.search.includes('dev=1'), dom.window.location.search);
  dom.window.close();

  dom = await load(base, '?lang=ba');
  d = dom.window.document;
  check('?lang=ba deep link works (auto-enables dev tools)', visibleIds(d).length === 2 && visibleIds(d).every(id => id.startsWith('ba-')), visibleIds(d).join());
  dom.window.close();

  dom = await load(base, '?lang=el&type=syntax');
  d = dom.window.document;
  check('?lang=el&type=syntax shows el-syntaxi', visibleIds(d).join() === 'el-syntaxi', visibleIds(d).join());

  console.log('Hub: UI language');
  dom.window.COSY_UI.setUILanguage('fr');
  check('count is translated when UI language changes', /\b1 outil\b/.test(d.getElementById('hub-result-count').textContent), d.getElementById('hub-result-count').textContent);
  check('filter labels are translated', d.getElementById('hub-type-label').textContent.trim() === 'Catégorie :');
  dom.window.close();

  server.close();
  if (failures) { console.error(`\n${failures} hub test(s) failed`); process.exit(1); }
  console.log('\nAll hub tests passed.');
})().catch(e => { console.error(e); server.close(); process.exit(1); });
