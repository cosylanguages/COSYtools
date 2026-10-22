/**
 * Hub filtering: language + tool type + free-text search + "in development" toggle.
 * State is mirrored in the URL (?lang=fr&type=gender-case&q=avoir&dev=1) so views can be
 * bookmarked and other COSY apps can deep-link into a filtered hub.
 * Cards and filter controls are rendered by scripts/generate_hub.js from catalog.json.
 */
(function () {
  'use strict';

  const state = { lang: 'all', type: 'all', q: '', dev: false };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function t(key, vars, fallback) {
    const ui = window.COSY_UI;
    let s = ui && typeof ui.t === 'function' ? ui.t(key) : null;
    if (!s) s = fallback;
    return Object.keys(vars || {}).reduce((acc, k) => acc.replace('{' + k + '}', vars[k]), s);
  }

  function findPill(attr, value) {
    return $$('[' + attr + ']').find(b => b.getAttribute(attr) === value) || null;
  }

  function readUrl() {
    const p = new URLSearchParams(window.location.search);
    const lang = p.get('lang');
    const type = p.get('type');
    if (lang && findPill('data-filter-lang', lang)) state.lang = lang;
    if (type && findPill('data-filter-type', type)) state.type = type;
    state.q = (p.get('q') || '').trim().toLowerCase();
    state.dev = p.get('dev') === '1';
  }

  function writeUrl() {
    const p = new URLSearchParams();
    if (state.lang !== 'all') p.set('lang', state.lang);
    if (state.type !== 'all') p.set('type', state.type);
    if (state.q) p.set('q', state.q);
    if (state.dev) p.set('dev', '1');
    const qs = p.toString();
    try {
      window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
    } catch (e) { /* file:// or sandboxed frames: URL sync is best-effort */ }
  }

  function setPressed(attr, value) {
    $$('[' + attr + ']').forEach(b => {
      const on = b.getAttribute(attr) === value;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function apply() {
    // A language that only has in-development tools is only reachable with the toggle on.
    const pill = state.lang !== 'all' ? findPill('data-filter-lang', state.lang) : null;
    if (pill && pill.hasAttribute('data-dev-only') && !state.dev) state.dev = true;

    const devBox = $('#hub-show-dev');
    if (devBox) devBox.checked = state.dev;
    $$('[data-dev-only]').forEach(b => { b.hidden = !state.dev; });
    setPressed('data-filter-lang', state.lang);
    setPressed('data-filter-type', state.type);

    let visibleTools = 0;
    $$('.engine-card').forEach(card => {
      const ok =
        (state.lang === 'all' || card.dataset.lang === state.lang) &&
        (state.type === 'all' || card.dataset.type === state.type) &&
        (state.dev || card.dataset.status !== 'stub') &&
        (!state.q || (card.dataset.search || '').includes(state.q));
      card.hidden = !ok;
      if (ok) visibleTools++;
    });
    $$('.hub-section').forEach(sec => {
      sec.hidden = !$$('.engine-card:not([hidden])', sec).length;
    });

    // Core multi-language reference cards respond to the search box only.
    $$('.ref-card').forEach(card => {
      const hay = ((card.getAttribute('data-search') || '') + ' ' + card.innerText).toLowerCase();
      const ok = !state.q || hay.includes(state.q);
      card.style.display = ok ? 'flex' : 'none';
    });

    const empty = $('#no-results-box');
    if (empty) empty.style.display = visibleTools === 0 ? 'block' : 'none';
    renderCount(visibleTools);
    writeUrl();
  }

  function renderCount(n) {
    const el = $('#hub-result-count');
    if (!el) return;
    el.dataset.count = String(n);
    el.textContent = n === 1
      ? t('result_count_one', {}, '1 tool')
      : t('result_count', { n: n }, n + ' tools');
  }

  function reset() {
    state.lang = 'all'; state.type = 'all'; state.q = ''; state.dev = false;
    const input = $('#hub-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    apply();
  }

  function init() {
    readUrl();
    const input = $('#hub-search-input');
    if (input) {
      input.value = state.q;
      input.addEventListener('input', () => { state.q = input.value.trim().toLowerCase(); apply(); });
    }
    $$('[data-filter-lang]').forEach(b => b.addEventListener('click', () => {
      state.lang = b.getAttribute('data-filter-lang');
      apply();
    }));
    $$('[data-filter-type]').forEach(b => b.addEventListener('click', () => {
      state.type = b.getAttribute('data-filter-type');
      apply();
    }));
    const devBox = $('#hub-show-dev');
    if (devBox) devBox.addEventListener('change', () => {
      state.dev = devBox.checked;
      // Hiding dev tools while a dev-only language is selected would show an empty page.
      if (!state.dev) {
        const cur = state.lang !== 'all' ? findPill('data-filter-lang', state.lang) : null;
        if (cur && cur.hasAttribute('data-dev-only')) state.lang = 'all';
      }
      apply();
    });
    const resetBtn = $('#hub-reset');
    if (resetBtn) resetBtn.addEventListener('click', reset);
    document.addEventListener('cosy:ui-lang', () => renderCount(Number(($('#hub-result-count') || {}).dataset.count || 0)));
    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
