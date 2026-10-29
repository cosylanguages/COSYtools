/**
 * Behavioural tests for practice/quick-drills and practice/weak-spots (run in jsdom).
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

async function load(page, before) {
  const errs = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errs.push(e.message));
  const dom = await JSDOM.fromURL(`http://localhost:${srv.address().port}/${page}`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) { w.fetch = u => fetch(new URL(u, w.location.href).href); if (before) before(w); }
  });
  await sleep(600);
  return { w: dom.window, d: dom.window.document, errs };
}

(async () => {
  // ---------- Quick Drills ----------
  let { w, d, errs } = await load('practice/quick-drills/index.html');
  ok(errs.length === 0, 'quick-drills: no script errors ' + errs.join('|'));
  ok(d.getElementById('qd-progress').getAttribute('role') === 'progressbar' && d.getElementById('qd-progress').hasAttribute('aria-valuenow'), 'quick-drills: progress bar exposed');
  ok(d.getElementById('qd-feedback').getAttribute('role') === 'status', 'quick-drills: feedback is a live region');
  const opts = () => [...d.querySelectorAll('#qd-options button')];
  ok(opts().length === 4 && opts().every(b => b.type === 'button'), 'quick-drills: 4 answer buttons');
  // single-key shortcut must NOT fire page-wide
  d.body.dispatchEvent(new w.KeyboardEvent('keydown', { key: '1', bubbles: true }));
  ok(d.getElementById('qd-feedback').textContent === '', 'quick-drills: digit keys ignored outside the answers');
  opts()[0].dispatchEvent(new w.KeyboardEvent('keydown', { key: '2', bubbles: true }));
  ok(d.getElementById('qd-feedback').textContent.length > 0, 'quick-drills: digit keys work while focus is on the answers');
  ok(d.activeElement === d.getElementById('qd-next-btn'), 'quick-drills: focus moves to Next');
  const q1 = d.getElementById('qd-question').textContent;
  await sleep(1700);
  ok(d.getElementById('qd-question').textContent === q1, 'quick-drills: no auto-advance (time to read feedback)');
  d.getElementById('qd-next-btn').click();
  ok(d.getElementById('qd-question').textContent !== q1 && d.activeElement === opts()[0], 'quick-drills: Next shows new question and focuses first answer');

  // ---------- Weak Spots ----------
  const nasty = [
    { id: "l'été:1", lang: 'fr', type: 'T', prompt: '<img src=x onerror="window.__xss=1">', answer: "l'été" },
    { id: 'ok:2', lang: 'en', type: 'T', prompt: 'have (she)', answer: 'has' }
  ];
  ({ w, d, errs } = await load('practice/weak-spots/index.html', win => {
    // seed through the same API the app uses once the utils exist
    win.addEventListener('DOMContentLoaded', () => {}, { once: true });
  }));
  nasty.forEach(n => w.COSYReferenceUtils.recordWeakSpot(n));
  w.renderWeakSpotsList();
  ok(!w.__xss && !d.querySelector('#weak-spots-list img'), 'weak-spots: stored HTML is escaped (no injection)');
  const btns = [...d.querySelectorAll('#weak-spots-list button')];
  ok(btns.length === 2 && btns.every(b => b.getAttribute('aria-label')), 'weak-spots: each button has a specific accessible name');
  const before = w.COSYReferenceUtils.getWeakSpots().length;
  btns[0].click();
  ok(w.COSYReferenceUtils.getWeakSpots().length === before - 1, "weak-spots: button works for ids containing an apostrophe");
  ok(/removed/.test(d.getElementById('ws-status').textContent), 'weak-spots: removal announced');
  ok(d.activeElement && d.activeElement.closest('#weak-spots-list'), 'weak-spots: focus kept inside the list after removal');
  ok(errs.length === 0, 'weak-spots: no script errors ' + errs.join('|'));

  console.log(fails ? 'FAILURES: ' + fails : 'ALL PRACTICE PAGE CHECKS PASSED');
  srv.close(); process.exit(fails ? 1 : 0);
})();
