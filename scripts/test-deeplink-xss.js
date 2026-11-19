/**
 * Regression test: attacker-controlled deep-link parameters must never become markup.
 * Loads each tool page in jsdom with an HTML payload in its search parameter and asserts
 * that no injected element exists. A control request proves the page really rendered.
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2' };
const PAYLOAD = encodeURIComponent('<img src=x id=pwned onerror=window.__xss=1>er');

const TOOLS = [
  ['tools/fr/conjugeur', 'verb'], ['tools/it/coniugatore', 'verb'], ['tools/ru/spryazhenie', 'verb'],
  ['tools/el/klisi-rimaton', 'verb'], ['tools/en/irregular-verbs', 'verb'], ['tools/fr/genre', 'noun'],
  ['tools/it/genere', 'noun'], ['tools/fr/regime', 'q'], ['tools/it/reggenza', 'q'],
  ['tools/en/verb-prep', 'q'], ['tools/de/praepositionen', 'q'],
];

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

async function load(base, tool, param, value) {
  const dom = await JSDOM.fromURL(`${base}/${tool}/?${param}=${value}`, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) { w.fetch = (u, o) => fetch(new URL(u, w.location.href), o); w.alert = () => {}; },
  });
  await new Promise((r) => setTimeout(r, 2000));
  const out = { injected: !!dom.window.document.getElementById('pwned'), executed: dom.window.__xss === 1, text: dom.window.document.body.textContent.length };
  dom.window.close();
  return out;
}

server.listen(0, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  let failed = 0;
  try {
    for (const [tool, param] of TOOLS) {
      const control = await load(base, tool, param, 'a');
      const attack = await load(base, tool, param, PAYLOAD);
      const ok = control.text > 500 && !attack.injected && !attack.executed;
      if (!ok) failed++;
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${tool}${ok ? '' : ' ' + JSON.stringify({ control: control.text, ...attack })}`);
    }
  } catch (e) { failed++; console.error(e); }
  server.close();
  if (failed) { console.error(`${failed} deep-link XSS check(s) failed`); process.exit(1); }
  console.log('ALL DEEP-LINK XSS CHECKS PASSED');
  process.exit(0);
});
