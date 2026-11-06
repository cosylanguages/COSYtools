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
const languageSource = fs.readFileSync(path.join(ROOT, 'shared/js/languages.js'), 'utf8');
const primaryMatch = languageSource.match(/window\.COSYTOOLS_PRIMARY_LANGUAGES\s*=\s*\[([^\]]*)\]/);
const primaryLanguages = primaryMatch ? Array.from(primaryMatch[1].matchAll(/'([a-z]{2})'/g), match => match[1]) : [];
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
  check('language filters use stable language codes', [...d.querySelectorAll('[data-filter-lang]:not([data-filter-lang="all"])')].every(button =>
    button.querySelector('.hub-lang-code')?.textContent.trim().toLowerCase() === button.dataset.filterLang));
  check('primary language buttons follow the central registry', primaryLanguages.join(',') ===
    [...d.querySelectorAll('#hub-primary-languages [data-filter-lang]')].map(button => button.dataset.filterLang).join(','));
  check('tool cards use stable language codes', [...d.querySelectorAll('.engine-card')].every(card =>
    card.querySelector('.engine-icon')?.textContent.trim().toLowerCase() === card.dataset.lang));
  check('section icons use COSY masks', [...d.querySelectorAll('.hub-section .category-header .cosy-icon')].length === d.querySelectorAll('.hub-section').length);
  check('interface language select has explicit label', d.querySelector('label[for="cosy-ui-language-select"]') !== null);
  check('search input has aria-describedby search hint', d.getElementById('hub-search-input').getAttribute('aria-describedby') === 'search-hint');

  console.log('Hub: defaults');
  check('five primary languages are shown first', [...d.querySelectorAll('#hub-primary-languages [data-filter-lang]')].map(b => b.dataset.filterLang).join(',') === 'en,fr,it,el,ru');
  check('nine other languages are grouped in a collapsed section', d.querySelectorAll('#hub-more-languages [data-filter-lang]:not([data-filter-lang="all"])').length === 9 && !d.getElementById('hub-more-languages').open);
  check('language-specific tools wait for a language choice', d.getElementById('hub-tool-results').hidden && visibleIds(d).length === 0);
  check('language prompt is visible before a choice', !d.getElementById('hub-language-prompt').hidden);
  check('tools navigation waits for a language or search', d.querySelector('.sd-jump-link[href="#hub-tool-results"]').hidden);
  check('cross-language tools are collapsed initially', !d.getElementById('hub-core-tools').open);
  check('external COSYlanguages links remain collapsed but available', !d.getElementById('hub-cosy-links').open && d.querySelectorAll('#hub-cosy-links a').length === 2);
  check('result count is hidden before a choice', d.getElementById('hub-result-count').hidden);

  console.log('Hub: filters');
  click(d, '[data-filter-lang="de"]');
  check('German filter shows only German tools', visibleIds(d).length === 3 && visibleIds(d).every(id => id.startsWith('de-')), visibleIds(d).join());
  check('selected study language is remembered', dom.window.localStorage.getItem('cosy_target_lang') === 'de');
  check('tools navigation appears after language selection', !d.querySelector('.sd-jump-link[href="#hub-tool-results"]').hidden);
  click(d, '[data-filter-lang="all"]');
  check('all-language view shows stable tools only', visibleIds(d).length === stable.length, `${visibleIds(d).length} vs ${stable.length}`);
  click(d, '[data-filter-type="gender-case"]');
  check('type filter hides other types', visibleIds(d).every(id => catalog.find(t => t.id === id).type === 'gender-case'));
  check('empty sections are hidden', [...d.querySelectorAll('.hub-section')].filter(s => !s.hidden).length === 1);
  click(d, '[data-filter-lang="en"]');
  check('empty state appears when nothing matches (en + gender-case)', d.getElementById('no-results-box').style.display === 'block');
  click(d, '#hub-reset');
  check('reset returns to language selection', visibleIds(d).length === 0 && !d.getElementById('hub-language-prompt').hidden && d.getElementById('no-results-box').style.display === 'none');
  check('reset clears remembered study language', dom.window.localStorage.getItem('cosy_target_lang') === null);
  check('reset hides tools navigation again', d.querySelector('.sd-jump-link[href="#hub-tool-results"]').hidden);

  console.log('Hub: search');
  const input = d.getElementById('hub-search-input');
  input.value = 'спряжение';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 150));
  check('search matches native titles (ru)', visibleIds(d).includes('ru-spryazhenie'));
  input.value = 'zzzzqq';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 150));
  check('nonsense search shows empty state', visibleIds(d).length === 0 && d.getElementById('no-results-box').style.display === 'block');

  console.log('Hub: dev toggle & URL state');
  click(d, '#hub-reset');
  d.getElementById('hub-show-dev').click();
  check('dev toggle reveals all catalog tools', visibleIds(d).length === catalog.length);
  click(d, '[data-filter-lang="ba"]');
  check('URL mirrors language and development state', dom.window.location.search.includes('lang=ba') && dom.window.location.search.includes('dev=1'), dom.window.location.search);
  dom.window.close();

  dom = await load(base, '?lang=ba');
  d = dom.window.document;
  check('?lang=ba deep link works (auto-enables dev tools)', visibleIds(d).length === 2 && visibleIds(d).every(id => id.startsWith('ba-')), visibleIds(d).join());
  dom.window.close();

  dom = await load(base, '?lang=el&type=syntax');
  d = dom.window.document;
  check('?lang=el&type=syntax shows el-syntaxi', visibleIds(d).join() === 'el-syntaxi', visibleIds(d).join());
  check('hub link preserves deep-linked study language', d.querySelector('.cosy-strip-link.active').getAttribute('href').includes('lang=el'));

  const embedDom = await load(base, '?embed=1');
  check('embed query survives filter initialization', embedDom.window.location.search.includes('embed=1'), embedDom.window.location.search);
  embedDom.window.close();

  console.log('Hub: UI language');
  const navAndHeadingLabels = [...d.querySelectorAll('.sd-jump-link, .hero-tag, [data-i18n="cat_core_tools"], [data-i18n="promo_btn_practice"]')];
  for (const lang of ['en', 'fr', 'it', 'ru', 'el']) {
    dom.window.COSY_UI.setUILanguage(lang);
    check(`${lang}: navigation and headings contain no emoji glyphs`, navAndHeadingLabels.every(label => !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(label.textContent)));
  }
  dom.window.COSY_UI.setUILanguage('fr');
  check('count is translated when UI language changes', /\b1 outil\b/.test(d.getElementById('hub-result-count').textContent), d.getElementById('hub-result-count').textContent);
  check('filter labels are translated', d.getElementById('hub-type-label').textContent.trim() === 'Catégorie :');
  dom.window.close();

  server.close();
  if (failures) { console.error(`\n${failures} hub test(s) failed`); process.exit(1); }
  console.log('\nAll hub tests passed.');
})().catch(e => { console.error(e); server.close(); process.exit(1); });
