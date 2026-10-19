/* COSYtools PWA Offline Service Worker */
const CACHE_NAME = 'cosytools-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
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
  './shared/js/languages.js',
  './shared/js/shell.js',
  './shared/js/hub-i18n.js',
  './shared/js/hub-filter.js',
  './shared/engines/srs-store.js',
  './shared/engines/practice-engine.js',
  './shared/engines/reference-utils.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network first with fallback to cache for HTML/data, cache first for static assets
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip cross-origin or non-http requests
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html') || caches.match('/index.html');
          }
        });
      })
  );
});
