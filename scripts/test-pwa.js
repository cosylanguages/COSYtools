/**
 * PWA tests: manifests and icons, apple-touch links, service-worker registration from any page
 * depth, and the real sw.js running against a mocked Cache API.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM, ResourceLoader, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const SW_SOURCE = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const ORIGIN = 'https://tools.test';
let passed = 0;
const ok = (name) => { passed++; console.log('ok   ' + name); };

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const files = walk(ROOT);

// ---------------------------------------------------------------------------------------------
// 1. Manifests and icons
// ---------------------------------------------------------------------------------------------
function pngSize(file) {
  const b = fs.readFileSync(file);
  assert.equal(b.toString('latin1', 1, 4), 'PNG', file + ' is not a PNG');
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}
const manifests = files.filter((f) => path.basename(f) === 'manifest.json');
assert.ok(manifests.length >= 16, 'expected the root manifest and the per-tool manifests');
for (const file of manifests) {
  const rel = path.relative(ROOT, file);
  const m = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.ok(!('orientation' in m), `${rel}: do not lock orientation (breaks tablets and external keyboards)`);
  assert.ok(Array.isArray(m.icons) && m.icons.length, `${rel}: no icons`);
  for (const icon of m.icons) {
    const iconFile = path.resolve(path.dirname(file), icon.src);
    assert.ok(fs.existsSync(iconFile), `${rel}: missing icon ${icon.src}`);
    const [w, h] = pngSize(iconFile);
    assert.equal(`${w}x${h}`, icon.sizes, `${rel}: ${icon.src} is ${w}x${h} but declared ${icon.sizes}`);
    assert.ok(!/any maskable|maskable any/.test(icon.purpose || ''), `${rel}: combine "any maskable" is discouraged; use separate icons`);
  }
  const anyIcon = (size) => m.icons.some((i) => i.sizes === size && (i.purpose || 'any') === 'any');
  assert.ok(anyIcon('192x192') && anyIcon('512x512'), `${rel}: needs 192 and 512 icons with purpose "any"`);
  assert.ok(m.icons.some((i) => i.purpose === 'maskable' && i.sizes === '512x512'), `${rel}: needs a 512 maskable icon`);
  assert.ok(fs.existsSync(path.resolve(path.dirname(file), m.start_url)), `${rel}: start_url does not exist`);
  for (const s of m.shortcuts || []) {
    assert.ok(fs.existsSync(path.resolve(path.dirname(file), s.url, s.url.endsWith('/') ? 'index.html' : '')), `${rel}: shortcut ${s.url} does not exist`);
  }
}
ok(`${manifests.length} manifests: icons exist, sizes are true, maskable present, no orientation lock`);

// ---------------------------------------------------------------------------------------------
// 2. Pages: manifest + apple-touch-icon links resolve
// ---------------------------------------------------------------------------------------------
let linked = 0;
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const manifest = html.match(/<link rel="manifest" href="([^"]+)"/);
  if (!manifest) continue;
  const rel = path.relative(ROOT, file);
  assert.ok(fs.existsSync(path.resolve(path.dirname(file), manifest[1])), `${rel}: manifest link is broken`);
  const apple = html.match(/<link rel="apple-touch-icon" href="([^"]+)"/);
  assert.ok(apple, `${rel}: missing apple-touch-icon`);
  const target = path.resolve(path.dirname(file), apple[1]);
  assert.ok(fs.existsSync(target), `${rel}: apple-touch-icon does not exist`);
  assert.deepEqual(pngSize(target), [180, 180], `${rel}: apple-touch-icon must be 180x180`);
  linked++;
}
assert.ok(linked >= 20);
ok(`${linked} pages: manifest and apple-touch-icon links resolve`);

// Every real page must register the service worker (a page that does not gives no offline support).
const NOT_PAGES = new Set(['offline.html', 'conjugation/template.html', 'shared/templates/footer.html', 'shared/templates/strip.html']);
const realPages = files.filter((f) => f.endsWith('.html') && !NOT_PAGES.has(path.relative(ROOT, f).split(path.sep).join('/')));
const unregistered = realPages.filter((f) => !/<script src="[^"]*shared\/js\/sw-register\.js" defer><\/script>/.test(fs.readFileSync(f, 'utf8')));
assert.deepEqual(unregistered.map((f) => path.relative(ROOT, f)), [], 'pages that never register the service worker');
for (const f of realPages) {
  const src = fs.readFileSync(f, 'utf8').match(/<script src="([^"]*shared\/js\/sw-register\.js)" defer>/)[1];
  if (!/<base /.test(fs.readFileSync(f, 'utf8'))) assert.ok(fs.existsSync(path.resolve(path.dirname(f), src)), `${path.relative(ROOT, f)}: sw-register.js path is wrong`);
}
ok(`${realPages.length} pages load sw-register.js with a path that resolves`);

// ---------------------------------------------------------------------------------------------
// 3. Service worker against a mocked Cache API
// ---------------------------------------------------------------------------------------------
class MockCaches {
  constructor() { this.store = new Map(); }
  static href(req) { return new URL(typeof req === 'string' ? req : req.url, ORIGIN + '/').href; }
  async open(name) {
    if (!this.store.has(name)) this.store.set(name, new Map());
    const map = this.store.get(name);
    return {
      match: async (req, opts = {}) => this._find(map, req, opts),
      put: async (req, res) => { map.set(MockCaches.href(req), { status: res.status, body: await res.clone().text() }); },
      keys: async () => [...map.keys()].map((url) => ({ url })),
      delete: async (req) => map.delete(typeof req === 'string' ? req : req.url),
    };
  }
  _find(map, req, opts) {
    const want = new URL(MockCaches.href(req));
    for (const [url, v] of map) {
      const have = new URL(url);
      if (have.origin + have.pathname === want.origin + want.pathname && (opts.ignoreSearch || have.search === want.search)) {
        return new Response(v.body, { status: v.status });
      }
    }
    return undefined;
  }
  async match(req, opts) { for (const map of this.store.values()) { const r = this._find(map, req, opts); if (r) return r; } }
  async keys() { return [...this.store.keys()]; }
  async delete(name) { return this.store.delete(name); }
}

/** Build a fresh service-worker context. `network(request)` decides every fetch. */
function loadWorker(network) {
  const listeners = {};
  const state = { skipWaiting: 0, claim: 0, fetched: [] };
  const caches = new MockCaches();
  class Req extends Request { constructor(u, init) { super(new URL(u, ORIGIN + '/').href, init); } }
  const ctx = {
    self: {
      location: { origin: ORIGIN },
      addEventListener: (type, fn) => { listeners[type] = fn; },
      skipWaiting: async () => { state.skipWaiting++; },
      clients: { claim: async () => { state.claim++; } },
    },
    caches, Request: Req, Response, URL, Promise, console,
    fetch: async (req) => { state.fetched.push(req); return network(req); },
    setTimeout: (fn, ms) => setTimeout(fn, Math.min(ms, 25)), // compress the 4 s navigation timeout
  };
  vm.createContext(ctx);
  vm.runInContext(SW_SOURCE, ctx);
  const get = (name) => vm.runInContext(name, ctx);
  const lifecycle = async (type) => {
    const waits = [];
    listeners[type]({ waitUntil: (p) => waits.push(p) });
    await Promise.all(waits);
  };
  const request = (url, { mode = 'cors', method = 'GET' } = {}) => ({ url: new URL(url, ORIGIN + '/').href, method, mode });
  const dispatch = async (req) => {
    const ev = { request: req, waits: [], responded: false, waitUntil(p) { this.waits.push(p); }, respondWith(p) { this.responded = true; this.p = p; } };
    listeners.fetch(ev);
    const response = ev.responded ? await ev.p : undefined;
    await Promise.all(ev.waits);
    return { response, responded: ev.responded };
  };
  return { caches, state, get, lifecycle, request, dispatch };
}
const basic = (body, status = 200) => { const r = new Response(body, { status }); Object.defineProperty(r, 'type', { value: 'basic' }); return r; };
const text = (r) => r.text();
const down = async () => { throw new TypeError('offline'); };

(async () => {
  // install: precaches everything with cache:'reload', then skips waiting
  {
    const w = loadWorker(async (req) => basic('asset:' + req.url));
    await w.lifecycle('install');
    const urls = w.get('PRECACHE_URLS');
    const pre = w.caches.store.get(w.get('PRECACHE'));
    assert.equal(pre.size, new Set(urls.map((u) => new URL(u, ORIGIN + '/').href)).size);
    assert.ok(w.state.fetched.every((r) => r.cache === 'reload'), 'precache must bypass the HTTP cache');
    assert.equal(w.state.skipWaiting, 1);
    ok('install precaches every listed file with cache:reload and skips waiting');
  }
  // install: a single missing file fails the install loudly
  {
    const w = loadWorker(async (req) => (req.url.endsWith('/catalog.json') ? basic('nope', 404) : basic('x')));
    await assert.rejects(() => w.lifecycle('install'), /catalog\.json/);
    ok('install fails (not silently succeeds) when a precache file is missing');
  }
  // every file the worker precaches exists in the repo
  {
    const w = loadWorker(down);
    const missing = Array.from(w.get('PRECACHE_URLS')).filter((u) => !fs.existsSync(path.join(ROOT, u === './' ? 'index.html' : u)));
    assert.deepEqual(missing, [], 'precache entries missing on disk: ' + missing.join(', '));
    assert.ok(w.get('PRECACHE_URLS').includes(w.get('OFFLINE_URL')), 'offline page must be precached');
    ok('every precache entry exists on disk, including the offline page');
  }
  // activate: drops old COSYtools caches only
  {
    const w = loadWorker(down);
    for (const n of ['cosytools-v1', 'cosytools-precache-v1', 'cosytools-runtime-v1', 'someone-elses', w.get('PRECACHE'), w.get('RUNTIME')]) await w.caches.open(n);
    await w.lifecycle('activate');
    assert.deepEqual([...w.caches.store.keys()].sort(), ['someone-elses', w.get('PRECACHE'), w.get('RUNTIME')].sort());
    assert.equal(w.state.claim, 1);
    ok('activate removes old cosytools caches, keeps current and foreign ones, claims clients');
  }
  // fetch: ignores what it must not touch
  {
    const w = loadWorker(async () => basic('x'));
    await w.lifecycle('install');
    for (const [label, req] of [
      ['POST', w.request('/a.json', { method: 'POST' })],
      ['cross-origin', { url: 'https://elsewhere.test/a.js', method: 'GET', mode: 'cors' }],
      ['sw.js', w.request('/sw.js')],
    ]) assert.equal((await w.dispatch(req)).responded, false, label + ' should pass through');
    ok('non-GET, cross-origin and sw.js requests pass through untouched');
  }
  // navigation online: returns the network page and saves it without the query string
  {
    const w = loadWorker(async (req) => basic('page:' + req.url));
    const { response } = await w.dispatch(w.request('/tools/fr/conjugeur/?verb=avoir', { mode: 'navigate' }));
    assert.match(await text(response), /verb=avoir/);
    const keys = [...w.caches.store.get(w.get('RUNTIME')).keys()];
    assert.deepEqual(keys, [ORIGIN + '/tools/fr/conjugeur/']);
    ok('online navigation is served from the network and saved without its query string');
  }
  // navigation offline: a different ?query is served from the saved page
  {
    let online = true;
    const w = loadWorker(async () => { if (!online) throw new TypeError('offline'); return basic('page'); });
    await w.dispatch(w.request('/tools/fr/conjugeur/?verb=avoir', { mode: 'navigate' }));
    online = false;
    const { response } = await w.dispatch(w.request('/tools/fr/conjugeur/?verb=lire', { mode: 'navigate' }));
    assert.equal(await text(response), 'page');
    ok('offline deep link (?verb=lire) is served from the page saved with another query');
  }
  // navigation offline, nothing saved: offline page
  {
    const w = loadWorker(down);
    await w.lifecycle('install').catch(() => {});
    const pre = await w.caches.open(w.get('PRECACHE'));
    await pre.put('./offline.html', basic('OFFLINE PAGE'));
    const { response } = await w.dispatch(w.request('/tools/it/genere/', { mode: 'navigate' }));
    assert.equal(await text(response), 'OFFLINE PAGE');
    ok('offline navigation with nothing saved shows the offline page, not the hub');
  }
  // navigation on a slow network
  {
    const slow = () => new Promise((resolve) => setTimeout(() => resolve(basic('late network')), 120));
    const w = loadWorker(slow);
    const rt = await w.caches.open(w.get('RUNTIME'));
    await rt.put(ORIGIN + '/saved/', basic('saved copy'));
    assert.equal(await text((await w.dispatch(w.request('/saved/', { mode: 'navigate' }))).response), 'saved copy');
    assert.equal(await text((await w.dispatch(w.request('/never-saved/', { mode: 'navigate' }))).response), 'late network');
    ok('slow network: serves the saved copy when there is one, otherwise keeps waiting for the network');
  }
  // stale-while-revalidate returns the cached copy, then the refreshed one
  {
    let version = 'v1';
    const w = loadWorker(async () => basic('css ' + version));
    const pre = await w.caches.open(w.get('PRECACHE'));
    await pre.put('./shared/css/base.css', basic('css v1'));
    version = 'v2';
    assert.equal(await text((await w.dispatch(w.request('/shared/css/base.css'))).response), 'css v1');
    assert.equal(await text((await w.dispatch(w.request('/shared/css/base.css'))).response), 'css v2',
      'the refreshed copy must win over the install-time precache copy');
    ok('stale-while-revalidate: instant cached answer, then the refreshed copy replaces the precached one');
  }
  // uncached + offline asset
  {
    const w = loadWorker(down);
    const { response } = await w.dispatch(w.request('/shared/js/never-seen.js'));
    assert.equal(response.type, 'error');
    ok('uncached asset while offline fails cleanly');
  }
  // only complete same-origin 200 responses are stored
  {
    const w = loadWorker(async (req) => (req.url.includes('missing') ? basic('nope', 404) : new Response('opaque-ish', { status: 200 })));
    await w.dispatch(w.request('/missing.json'));
    await w.dispatch(w.request('/non-basic.json'));
    const rt = w.caches.store.get(w.get('RUNTIME'));
    assert.ok(!rt || rt.size === 0, 'neither a 404 nor a non-basic response may be cached');
    ok('404 and non-basic responses are never cached');
  }
  // bounded runtime cache
  {
    const w = loadWorker(async (req) => basic('data ' + req.url));
    const max = w.get('MAX_RUNTIME_ENTRIES');
    for (let i = 0; i < max + 8; i++) await w.dispatch(w.request(`/tools/xx/data/shard-${i}.json`));
    const rt = w.caches.store.get(w.get('RUNTIME'));
    assert.equal(rt.size, max);
    assert.ok(!rt.has(`${ORIGIN}/tools/xx/data/shard-0.json`) && rt.has(`${ORIGIN}/tools/xx/data/shard-${max + 7}.json`));
    ok(`runtime cache is capped at ${max} entries, oldest evicted first`);
  }

  // -------------------------------------------------------------------------------------------
  // 4. Registration finds sw.js from every page depth (regression: it used to count URL segments)
  // -------------------------------------------------------------------------------------------
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' }[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  class LocalOnly extends ResourceLoader { fetch(url, opts) { return url.startsWith(base) ? super.fetch(url, opts) : Promise.resolve(Buffer.from('')); } }
  const pages = ['/index.html', '/practice/index.html', '/practice/daily/', '/practice/top-verbs/index.html', '/prepositions/', '/gender/french/', '/tools/fr/genre/', '/tools/it/genere/index.html'];
  for (const p of pages) {
    const registered = [];
    const dom = await JSDOM.fromURL(base + p, {
      runScripts: 'dangerously', resources: new LocalOnly(), pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
      beforeParse(w) {
        Object.defineProperty(w.navigator, 'serviceWorker', { value: { register: (u) => { registered.push(u); return Promise.resolve(); } } });
        // This test only looks at service-worker registration. Pages must not load their data: a fetch that
        // settles after dom.window.close() runs page code against a closed window (document is undefined),
        // throws outside any handler and kills the process. Never-settling is deterministic on any machine.
        w.fetch = () => new Promise(() => {});
      },
    });
    await new Promise((r) => setTimeout(r, 700));
    dom.window.close();
    assert.deepEqual(registered, [base + '/sw.js'], `${p} registered ${JSON.stringify(registered)}`);
  }
  server.close();
  ok(`service worker registers at the site root from ${pages.length} different page depths`);

  console.log(`\nALL PWA CHECKS PASSED (${passed} groups)`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
