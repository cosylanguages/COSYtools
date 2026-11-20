/**
 * Registers the COSYtools service worker (offline support).
 *
 * Load on every page with <script src=".../shared/js/sw-register.js" defer></script>.
 * sw.js lives at the site root, two directories above this file, so the URL is derived from
 * this script's own address and works from any page depth, on a project site or a custom domain.
 */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(window.location.protocol)) return;
  const script = document.currentScript;
  if (!script || !script.src) return;
  const swUrl = new URL('../../sw.js', script.src).href;

  function register() {
    navigator.serviceWorker.register(swUrl).catch(function (err) {
      console.warn('COSY: service worker registration failed', err);
    });
  }
  // Wait for the page to finish loading so registration never competes with it.
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register);
})();
