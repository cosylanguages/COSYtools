/**
 * Golden-master test for the noun-gender tools (fr/genre, it/genere).
 * Runs a scripted session (search, rule-based fallback, all three practice modes,
 * right and wrong answers) with a seeded Math.random and records everything observable:
 * rendered text, feedback text, score/streak, and every spaced-repetition key written.
 * `node scripts/test-gender-golden.js --write` regenerates the fixture; otherwise it compares.
 * Suggestion-list markup is compared by text only (its markup is intentionally safer than before).
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const FIXTURE = path.join(__dirname, 'fixtures', 'gender-golden.json');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const TOOLS = ['tools/fr/genre', 'tools/it/genere'];

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const txt = (d, sel) => { const e = d.querySelector(sel); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; };
const vis = (d, sel) => { const e = d.querySelector(sel); return e ? e.style.display : null; };

async function record(base, tool) {
  const dom = await JSDOM.fromURL(`${base}/${tool}/`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      let seed = 12345; w.Math.random = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
      w.fetch = (u, o) => fetch(new URL(u, w.location.href), o);
      w.alert = () => {};
      // The pages do not load srs-store.js today; a stub lets the test pin the keys the engines would write.
      w.SpacedRepetitionStore = class { constructor(k) { w.__srsStoreKey = k; } recordAnswer() {} };
      w.localStorage.clear();
    },
  });
  await wait(1500);
  const w = dom.window, d = w.document, log = [];
  const eng = w.eval('appEngine');
  const srs = [['store-key', w.__srsStoreKey]];
  if (eng.srsStore) { const orig = eng.srsStore.recordAnswer.bind(eng.srsStore); eng.srsStore.recordAnswer = (k, ok) => { srs.push([k, ok]); return orig(k, ok); }; }
  const snap = (label) => log.push({
    label,
    result: txt(d, '#noun-result-container'), resultShown: vis(d, '#noun-result-container'),
    prompt: txt(d, '.prompt-label'), noun: txt(d, '#game-noun-prompt'),
    feedback: txt(d, '#game-feedback-box'), feedbackClass: (d.querySelector('#game-feedback-box') || {}).className,
    score: txt(d, '#game-score'), streak: txt(d, '#game-streak'),
    options: [...d.querySelectorAll('.game-choice-group button, #game-mc-options button')].map((b) => b.textContent.trim()),
    srsCalls: srs.length,
  });

  const nouns = Object.keys(eng.nounDb);
  // search: first, middle, last noun + two words absent from the data (exercise the fallback rule)
  for (const q of [nouns[0], nouns[Math.floor(nouns.length / 2)], nouns[nouns.length - 1], 'zzmaison', 'zzcasa', 'zzvoce']) {
    d.getElementById('noun-search-input').value = q; eng.searchNoun(q); snap('search:' + q);
  }
  // suggestions (text only)
  eng.handleSearchInput ? eng.handleSearchInput(nouns[0].slice(0, 2)) : eng.handleInput(nouns[0].slice(0, 2));
  log.push({ label: 'suggestions', items: [...d.querySelectorAll('#search-suggestions .suggestion-item')].map((b) => b.textContent.replace(/\s+/g, ' ').trim()) });

  eng.toggleGameMode(); snap('toggle-on');
  for (const mode of ['gender', 'ending', 'articles']) {
    eng.setPracticeMode(mode); snap(mode + ':start');
    for (let round = 0; round < 6; round++) {
      const buttons = [...d.querySelectorAll('.game-choice-group button, #game-mc-options button')].filter((b) => b.offsetParent !== null || true);
      const visible = buttons.filter((b) => {
        const g = b.closest('.game-choice-group, #game-mc-options'); return g && g.style.display !== 'none';
      });
      if (!visible.length) { log.push({ label: mode + ':no-buttons:' + round }); eng.nextGameQuestion(); continue; }
      visible[round % visible.length].click(); snap(`${mode}:answer${round}`);
      eng.nextGameQuestion(); snap(`${mode}:next${round}`);
    }
  }
  eng.toggleGameMode(); snap('toggle-off');
  dom.window.close();
  return { log, srs };
}

server.listen(0, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const result = {};
  try { for (const t of TOOLS) result[t] = await record(base, t); } catch (e) { console.error(e); server.close(); process.exit(1); }
  server.close();
  const out = JSON.stringify(result, null, 1);
  if (process.argv.includes('--write')) { fs.writeFileSync(FIXTURE, out + '\n'); console.log('golden written:', TOOLS.map((t) => `${t}: ${result[t].log.length} steps, ${result[t].srs.length} srs calls`).join(' | ')); process.exit(0); }
  const gold = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
  let bad = 0;
  for (const t of TOOLS) {
    const a = gold[t].log, b = result[t].log;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) { bad++; if (bad <= 4) console.error(`DIFF ${t} step ${i} (${(a[i] || {}).label})\n  expected ${JSON.stringify(a[i])}\n  actual   ${JSON.stringify(b[i])}`); }
    }
    if (JSON.stringify(gold[t].srs) !== JSON.stringify(result[t].srs)) { bad++; console.error(`DIFF ${t}: SRS keys/results differ\n  expected ${JSON.stringify(gold[t].srs).slice(0, 300)}\n  actual   ${JSON.stringify(result[t].srs).slice(0, 300)}`); }
  }
  if (bad) { console.error(bad + ' golden mismatch(es)'); process.exit(1); }
  console.log('GENDER GOLDEN MASTER MATCHES (' + TOOLS.map((t) => `${t}: ${result[t].log.length} steps, ${result[t].srs.length} srs calls`).join(' | ') + ')');
  process.exit(0);
});
