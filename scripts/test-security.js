#!/usr/bin/env node
/**
 * test-security.js — security regression tests (jsdom, no browser needed).
 *
 *  1. CMS sanitizer: known XSS payloads must not survive; ordinary formatting must.
 *  2. SSO link interception: session tokens may only be appended to allow-listed origins.
 *  3. No third-party requests: real pages must not load anything from outside the site
 *     (fonts, SDKs, CDNs) unless explicitly configured.
 *
 * All COSY apps live under one origin (cosylanguages.github.io), so script injection in this repo
 * can reach the sessions of the other apps. These tests guard the paths where that could happen.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { JSDOM, ResourceLoader } = require('jsdom');

const ROOT = path.join(__dirname, '..');
let failures = 0;
function check(name, cond, detail) {
  if (cond) console.log('  PASS ' + name);
  else { failures++; console.error('  FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

// ---------------------------------------------------------------------------------------------
// 1. CMS sanitizer
// ---------------------------------------------------------------------------------------------
function loadCms() {
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://cosylanguages.github.io/COSYtools/', runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync(path.join(ROOT, 'shared/js/cms-editor.js'), 'utf8'));
  return dom.window;
}

const ALLOWED_TAGS = new Set(['A', 'B', 'STRONG', 'I', 'EM', 'U', 'BR', 'P', 'SPAN', 'DIV', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'CODE', 'SMALL', 'SUP', 'SUB', 'BLOCKQUOTE', 'HR']);
const ALLOWED_ATTRS = new Set(['href', 'class', 'lang', 'dir', 'title', 'aria-label', 'rel']);

function auditOutput(win, html) {
  const problems = [];
  const doc = new win.DOMParser().parseFromString(html, 'text/html');
  doc.body.querySelectorAll('*').forEach(el => {
    if (!ALLOWED_TAGS.has(el.tagName)) problems.push(`tag <${el.tagName.toLowerCase()}>`);
    for (const a of Array.from(el.attributes)) {
      if (!ALLOWED_ATTRS.has(a.name)) problems.push(`attr ${a.name}`);
      if (a.name === 'href') {
        const v = a.value.replace(/[\u0000-\u0020]/g, '').toLowerCase();
        if (!/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/.test(v) && /^[a-z][a-z0-9+.-]*:/.test(v)) problems.push(`href scheme ${a.value}`);
      }
    }
  });
  return problems;
}

const PAYLOADS = {
  'img onerror': '<img src=x onerror=alert(1)>',
  'script tag': '<script>alert(1)</script>ok',
  'tab inside javascript: scheme': '<a href="java&#9;script:alert(1)">x</a>',
  'newline inside javascript: scheme': '<a href="java&#10;script:alert(1)">x</a>',
  'leading control chars + mixed case': '<a href="&#1;  JaVaScRiPt:alert(1)">x</a>',
  'svg xlink:href': '<svg><a xlink:href="javascript:alert(1)"><text>x</text></a></svg>',
  'svg onload': '<svg onload=alert(1)></svg>',
  'svg animate href': '<svg><a><animate attributeName=href values=javascript:alert(1) /><text>x</text></a></svg>',
  'style injection': '<style>body{background:url(//evil.example/x)}</style>t',
  'inline style': '<span style="background:url(//evil.example/x)">t</span>',
  'form action': '<form action="javascript:alert(1)"><button formaction="javascript:alert(1)">x</button></form>',
  'base tag': '<base href="//evil.example/">',
  'data: url': '<a href="data:text/html,<script>alert(1)</script>">x</a>',
  'vbscript url': '<a href="vbscript:msgbox(1)">x</a>',
  'iframe srcdoc': '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  'object/embed': '<object data="x"></object><embed src="x">',
  'meta refresh': '<meta http-equiv="refresh" content="0;url=//evil.example">',
  'noscript breakout': '<noscript><p title="</noscript><img src=x onerror=alert(1)>"></noscript>',
  'mXSS (math/mglyph)': '<math><mtext><table><mglyph><style><!--</style><img title="--&gt;&lt;img src=1 onerror=alert(1)&gt;">',
  'id clobbering': '<a id="COSY_SUPABASE_URL" name="supabase">x</a>',
  'target _blank without rel': '<a href="https://example.org" target="_blank">x</a>'
};

console.log('CMS sanitizer: attack payloads');
const win = loadCms();
const san = win.COSY_CMS && win.COSY_CMS.sanitizeHTML;
check('sanitizeHTML is exposed', typeof san === 'function');
if (typeof san === 'function') {
  for (const [name, payload] of Object.entries(PAYLOADS)) {
    const out = san(payload);
    const problems = auditOutput(win, out);
    check(name, problems.length === 0, `${problems.join(', ')} in: ${out.slice(0, 120)}`);
  }
  console.log('CMS sanitizer: legitimate content survives');
  const good = '<p class="lead">Ελληνικά <b>Русский</b> <em>français</em><br>a &lt; b &amp; c</p><ul><li>one</li></ul><a href="https://example.org/x?y=1">link</a> <a href="/COSYtools/tools/fr/conjugeur/">rel</a>';
  const out = san(good);
  check('formatting tags kept', /<b>Русский<\/b>/.test(out) && /<em>français<\/em>/.test(out) && /<ul><li>one<\/li><\/ul>/.test(out), out);
  check('unicode kept', out.includes('Ελληνικά') && out.includes('Русский'));
  check('entities stay escaped', out.includes('a &lt; b &amp; c'), out);
  check('https and relative links kept', out.includes('href="https://example.org/x?y=1"') && out.includes('href="/COSYtools/tools/fr/conjugeur/"'), out);
  check('class kept', out.includes('class="lead"'));
  check('external links get rel=noopener', /rel="[^"]*noopener/.test(san('<a href="https://example.org">x</a>')));
  check('empty / non-string input is safe', san('') === '' && san(null) === '' && san(42) === '');
}

// ---------------------------------------------------------------------------------------------
// 2. SSO token leakage
// ---------------------------------------------------------------------------------------------
async function ssoResult(href) {
  const dom = new JSDOM(`<!doctype html><body><a id="l" href="${href}">go</a></body>`, { url: 'https://cosylanguages.github.io/COSYtools/', runScripts: 'outside-only' });
  const w = dom.window;
  w.supabaseClient = { auth: { getSession: async () => ({ data: { session: { access_token: 'ACCESS123', refresh_token: 'REFRESH456' } } }) } };
  w.eval(fs.readFileSync(path.join(ROOT, 'shared/js/auth-sso.js'), 'utf8'));
  // auth-sso registers its click handler on DOMContentLoaded; wait for it or the test proves nothing.
  await new Promise(r => (w.document.readyState === 'complete' ? r() : w.addEventListener('load', r)));
  const link = w.document.getElementById('l');
  link.addEventListener('click', e => e.preventDefault());
  link.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  await new Promise(r => setTimeout(r, 20));
  return link.href;
}

(async () => {
  console.log('SSO: tokens only go to allow-listed origins');
  const leaks = {
    'attacker URL containing "cosylanguages"': 'https://evil.example/cosylanguages',
    'attacker URL containing "COSY"': 'https://evil.example/COSY/login',
    'look-alike host (suffix)': 'https://cosylanguages.github.io.evil.example/',
    'look-alike host (userinfo)': 'https://cosylanguages.github.io@evil.example/',
    'plain http downgrade': 'http://cosylanguages.github.io/COSYplatform/',
    'javascript: URL mentioning cosylanguages': 'javascript:alert(\'cosylanguages\')'
  };
  for (const [name, href] of Object.entries(leaks)) {
    const out = await ssoResult(href);
    check(`no tokens sent to ${name}`, !/ACCESS123|REFRESH456|access_token/.test(out), out);
  }
  const ok = await ssoResult('https://cosylanguages.github.io/COSYplatform/');
  check('tokens still handed to https://cosylanguages.github.io', /access_token=ACCESS123/.test(ok) && /refresh_token=REFRESH456/.test(ok), ok);

  // -------------------------------------------------------------------------------------------
  // 3. No third-party requests
  // -------------------------------------------------------------------------------------------
  console.log('Pages: no third-party requests by default');
  const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png' };
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, rel.endsWith('/') ? rel + 'index.html' : rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const external = [];
  class Spy extends ResourceLoader {
    fetch(url, opts) {
      if (!url.startsWith(base)) { external.push(url); return Promise.resolve(Buffer.from('')); }
      return super.fetch(url, opts);
    }
  }
  const pages = ['index.html', 'tools/fr/conjugeur/index.html', 'tools/ru/spryazhenie/index.html', 'tools/el/klisi-rimaton/index.html', 'prepositions/index.html', 'practice/index.html', '404.html'];
  for (const p of pages) {
    external.length = 0;
    const dom = await JSDOM.fromURL(`${base}/${p}`, { runScripts: 'dangerously', resources: new Spy(), pretendToBeVisual: true });
    await new Promise(r => dom.window.addEventListener('load', r));
    await new Promise(r => setTimeout(r, 150));
    check(`${p} makes no third-party requests`, external.length === 0, external.join(', '));
    dom.window.close();
  }
  // Opt-in must still work: with a Supabase config present, the SDK + ecosystem scripts are requested.
  external.length = 0;
  const cfgDom = await JSDOM.fromURL(`${base}/index.html`, {
    runScripts: 'dangerously', resources: new Spy(), pretendToBeVisual: true,
    beforeParse(w) { w.COSY_SUPABASE_URL = 'https://example.supabase.co'; w.COSY_SUPABASE_ANON_KEY = 'anon'; }
  });
  await new Promise(r => cfgDom.window.addEventListener('load', r));
  await new Promise(r => setTimeout(r, 150));
  check('with a Supabase config, the SDK is still loaded (opt-in works)', external.some(u => /supabase-js/.test(u)), external.join(', '));
  cfgDom.window.close();
  server.close();

  if (failures) { console.error(`\n${failures} security test(s) failed`); process.exit(1); }
  console.log('\nAll security tests passed.');
})().catch(e => { console.error(e); process.exit(1); });
