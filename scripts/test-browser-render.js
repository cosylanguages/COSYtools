/**
 * Real-browser rendering test (light and dark theme, every page).
 *
 * Two things only a real browser can answer, checked on every page load:
 *   1. colour contrast (axe's color-contrast rule) in both themes;
 *   2. elements carrying the `hidden` class really are hidden. The class is defined in base.css, and
 *      tools that do not load it (fr/regime, it/reggenza, el/*) once showed their SRS dashboard modal
 *      over the whole page on load. Redirect stubs (meta refresh) are skipped.
 *
 * Why a real browser: contrast depends on the cascade (which stylesheets a page loads, custom
 * properties that fall back, theme overrides). jsdom cannot compute that, and a static check cannot
 * know which rules apply on which page. This loads each page in Chrome, switches theme exactly like
 * a visitor does (the stored preference read by cosy-theme.js), and runs axe's color-contrast rule.
 *
 * It needs Chrome like check:smoke does: set CHROME_BIN, CHROME_PATH or PUPPETEER_EXECUTABLE_PATH
 * (GitHub's ubuntu runners already have one). COSY_BROWSER_ARGS adds launch flags and
 * COSY_HEADLESS=shell selects chrome-headless-shell and COSY_RENDER_CONCURRENCY=1 runs pages one
 * at a time, for unusual sandboxes.
 *
 * External requests are blocked so results do not depend on the network. 404.html is skipped: it
 * relies on <base href="/COSYtools/">, which only resolves on the published site.
 */
/* global document, window, getComputedStyle -- used inside page.evaluate callbacks (browser context) */
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const NOT_PAGES = new Set(['404.html', 'conjugation/template.html', 'shared/templates/footer.html', 'shared/templates/strip.html']);
const THEMES = ['light', 'dark'];
const CONCURRENCY = Math.max(1, Number(process.env.COSY_RENDER_CONCURRENCY) || 4);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(path.relative(ROOT, p).split(path.sep).join('/'));
  }
  return out;
}
const ONLY = (process.env.COSY_RENDER_ONLY || '').split(',').map((x) => x.trim()).filter(Boolean); // dev aid: substrings of page paths
const pages = walk(ROOT).filter((p) => !NOT_PAGES.has(p) && (!ONLY.length || ONLY.some((o) => p.includes(o)))).sort();

async function findChrome() {
  const candidates = [process.env.PUPPETEER_EXECUTABLE_PATH, process.env.CHROME_BIN, process.env.CHROME_PATH,
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  try { candidates.push(await puppeteer.executablePath()); } catch { /* no bundled browser */ }
  return candidates.find((c) => typeof c === 'string' && fs.existsSync(c)) || null;
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

async function check(browser, base, rel, theme) {
  // One isolated context per job: tabs of the same profile share localStorage, so parallel light and
  // dark jobs would overwrite each other's stored theme.
  // (A single sequential worker needs no isolation, and some single-process builds cannot create contexts.)
  const context = CONCURRENCY > 1 ? await browser.createBrowserContext() : null;
  const page = context ? await context.newPage() : await browser.newPage();
  try {
    await page.setViewport({ width: 1100, height: 900 });
    await page.setRequestInterception(true);
    page.on('request', (r) => (r.url().startsWith(base) ? r.continue() : r.abort()));
    await page.evaluateOnNewDocument((t) => { try { localStorage.setItem('cosy.theme', t); } catch { /* storage unavailable */ } }, theme);
    await page.goto(`${base}/${rel.replace(/index\.html$/, '')}`, { waitUntil: 'load', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 500));
    const applied = await page.evaluate(() => ({ attr: document.documentElement.getAttribute('data-theme'), scheme: document.documentElement.style.colorScheme }));
    if (applied.attr !== theme || applied.scheme !== theme) return { rel, theme, error: `theme not applied (${JSON.stringify(applied)})` };
    const isStub = await page.evaluate(() => Boolean(document.querySelector('meta[http-equiv="refresh"]')));
    const shownHidden = isStub ? [] : await page.evaluate(() => [...document.querySelectorAll('.hidden')]
      .filter((e) => getComputedStyle(e).display !== 'none')
      .map((e) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}`));
    await page.evaluate(AXE);
    const nodes = await page.evaluate(async () => {
      const result = await window.axe.run(document, { runOnly: ['color-contrast'] });
      return result.violations.flatMap((v) => v.nodes.map((n) => ({ target: n.target.join(' '), data: n.any[0] && n.any[0].data })));
    });
    return { rel, theme, nodes, shownHidden };
  } catch (e) {
    return { rel, theme, error: e.message.slice(0, 160) };
  } finally {
    await (context || page).close();
  }
}

server.listen(0, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = await findChrome();
  if (!executablePath) {
    console.error('No Chrome/Chromium found. Set CHROME_BIN, CHROME_PATH or PUPPETEER_EXECUTABLE_PATH.');
    server.close(); process.exit(1);
  }
  const extra = (process.env.COSY_BROWSER_ARGS || '').split(/\s+/).filter(Boolean);
  const browser = await puppeteer.launch({ executablePath, headless: process.env.COSY_HEADLESS === 'shell' ? 'shell' : true, args: ['--no-sandbox', '--disable-setuid-sandbox', ...extra] });
  const jobs = pages.flatMap((rel) => THEMES.map((theme) => [rel, theme]));
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < jobs.length) { const [rel, theme] = jobs[next++]; results.push(await check(browser, base, rel, theme)); }
  }));
  await browser.close();
  server.close();

  const errors = results.filter((r) => r.error);
  const leaking = results.filter((r) => r.shownHidden && r.shownHidden.length && r.theme === 'light');
  const failing = results.filter((r) => r.nodes && r.nodes.length).sort((a, b) => a.rel.localeCompare(b.rel) || a.theme.localeCompare(b.theme));
  for (const r of failing) {
    console.error(`FAIL ${r.theme.padEnd(5)} ${r.rel}: ${r.nodes.length} element(s) below the contrast minimum`);
    for (const n of r.nodes.slice(0, 5)) console.error(`       ${n.target.slice(0, 70)}  ${n.data ? `${n.data.fgColor} on ${n.data.bgColor} = ${n.data.contrastRatio}:1` : ''}`);
  }
  for (const r of leaking) console.error(`FAIL hidden ${r.rel}: ${r.shownHidden.length} element(s) with class "hidden" are visible (${r.shownHidden.slice(0, 4).join(', ')}). Load base.css or define .hidden for this page.`);
  for (const r of errors) console.error(`ERROR ${r.theme} ${r.rel}: ${r.error}`);
  if (failing.length || errors.length || leaking.length) {
    console.error(`\n${failing.length} page/theme combination(s) with contrast problems, ${leaking.length} page(s) showing hidden elements, ${errors.length} error(s), out of ${results.length}.`);
    console.error('Fix with theme-aware tokens (for example --cosy-sage-text, --cosy-on-sage, --cosy-on-sage-dark); see shared/css/tokens.css.');
    process.exit(1);
  }
  console.log(`RENDER (real browser): ${pages.length} pages x ${THEMES.length} themes: no contrast problems, no visible "hidden" elements.`);
});
