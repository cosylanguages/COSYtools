/* COSYtools service worker.
 *
 * What works offline: the app shell (hub, shared CSS/JS/engines) is precached at install, and every
 * page, script, stylesheet and data file a learner opens is kept for later. The tools hold about
 * 67 MB of verb data, so nothing is downloaded in advance: offline means "what you have opened".
 *
 * Strategies
 *   - Pages (navigations): network first with a short timeout, then the saved copy, then offline.html.
 *     Saved pages are stored without their query string, so ?verb=lire works offline too.
 *   - Everything else (CSS, JS, JSON, images, fonts): stale-while-revalidate. Instant from cache, and
 *     refreshed in the background so the next visit is current.
 *
 * Bump VERSION when a strategy or cache layout changes. Editing this file (including the precache
 * list) makes browsers install the new worker; old caches are removed on activation.
 */
const VERSION = 'v2';
const PRECACHE = `cosytools-precache-${VERSION}`;
const RUNTIME = `cosytools-runtime-${VERSION}`;
const MAX_RUNTIME_ENTRIES = 300;
const NAVIGATION_TIMEOUT_MS = 4000;
const OFFLINE_URL = './offline.html';

const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './catalog.json',
  './manifest.json',
  './404.html',
  './shared/css/fonts.css',
  './shared/css/cosy-tokens.css',
  './shared/css/tokens.css',
  './shared/css/base.css',
  './shared/css/components.css',
  './shared/css/layout.css',
  './shared/css/tools.css',
  './shared/css/hub.css',
  './shared/styles/reference.css',
  './shared/assets/logo.png',
  './shared/images/cosylanguages.png',
  './shared/js/cosy-theme.js',
  './shared/js/sw-register.js',
  './shared/js/escape.js',
  './shared/js/languages.js',
  './shared/js/shell.js',
  './shared/js/daily-feed.js',
  './shared/js/hub-i18n.js',
  './shared/js/hub-filter.js',
  './shared/engines/srs-store.js',
  './shared/engines/practice-engine.js',
  './shared/engines/conjugator-base.js',
  './shared/engines/gender-base.js',
  './shared/engines/reference-utils.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      for (const url of PRECACHE_URLS) {
        // cache: 'reload' bypasses the browser HTTP cache so a new install never stores a stale copy
        const response = await fetch(new Request(url, { cache: 'reload' }));
        if (!response.ok) throw new Error(`Precache failed for ${url}: HTTP ${response.status}`);
        await cache.put(url, response);
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PRECACHE, RUNTIME]);
      for (const key of await caches.keys()) {
        if (key.startsWith('cosytools-') && !keep.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;

  event.respondWith(request.mode === 'navigate' ? handleNavigation(event) : staleWhileRevalidate(event));
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Only keep complete, same-origin, successful responses. */
function isCacheable(response) {
  return Boolean(response) && response.status === 200 && response.type === 'basic';
}

/** Saved pages are keyed by path only, so every ?query variant of a page shares one copy. */
function pageKey(requestUrl) {
  const url = new URL(requestUrl);
  return url.origin + url.pathname;
}

/** Newest copy wins: the runtime cache is refreshed in the background, the precache is install-time. */
async function lookup(request) {
  const runtime = await caches.open(RUNTIME);
  const fresh = await runtime.match(request);
  if (fresh) return fresh;
  const precache = await caches.open(PRECACHE);
  return precache.match(request);
}

async function saveToRuntime(request, response) {
  const cache = await caches.open(RUNTIME);
  await cache.put(request, response);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_RUNTIME_ENTRIES; i++) await cache.delete(keys[i]);
}

async function handleNavigation(event) {
  const request = event.request;
  const key = pageKey(request.url);

  const network = fetch(request).then((response) => {
    if (isCacheable(response)) event.waitUntil(saveToRuntime(key, response.clone()));
    return response;
  });
  const outcome = await Promise.race([
    network.then((response) => ({ response }), () => ({ failed: true })),
    delay(NAVIGATION_TIMEOUT_MS).then(() => ({ slow: true })),
  ]);
  if (outcome.response) return outcome.response;

  const saved = await lookup(key);
  if (saved) return saved;
  if (outcome.slow) {
    // Slow connection and nothing saved: keep waiting for the network rather than showing "offline".
    try {
      return await network;
    } catch {
      /* fall through to the offline page */
    }
  }
  return (await lookup(OFFLINE_URL)) || Response.error();
}

async function staleWhileRevalidate(event) {
  const request = event.request;
  const cached = await lookup(request);
  const refresh = fetch(request).then((response) => {
    if (isCacheable(response)) event.waitUntil(saveToRuntime(request, response.clone()));
    return response;
  });
  if (cached) {
    event.waitUntil(refresh.catch(() => {}));
    return cached;
  }
  try {
    return await refresh;
  } catch {
    return Response.error();
  }
}
