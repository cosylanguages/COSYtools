/**
 * Hub filtering: language + tool type + free-text search + "in development" toggle.
 * State is mirrored in the URL (?lang=fr&type=gender-case&q=avoir&dev=1) so views can be
 * bookmarked and other COSY apps can deep-link into a filtered hub.
 * Cards and filter controls are rendered by scripts/generate_hub.js from catalog.json.
 */
(function () {
  'use strict';

  const state = { lang: '', type: 'all', q: '', dev: false };

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

  function isPrimaryLanguage(code) {
    const pill = findPill('data-filter-lang', code);
    return Boolean(pill && pill.closest('#hub-primary-languages'));
  }

  function readUrl() {
    const p = new URLSearchParams(window.location.search);
    const lang = p.get('lang');
    const type = p.get('type');
    const savedLang = localStorage.getItem('cosy_target_lang');
    if (lang && findPill('data-filter-lang', lang)) state.lang = lang;
    else if (savedLang && findPill('data-filter-lang', savedLang)) state.lang = savedLang;
    if (type && findPill('data-filter-type', type)) state.type = type;
    state.q = (p.get('q') || '').trim().toLowerCase();
    state.dev = p.get('dev') === '1';
  }

  function writeUrl() {
    const p = new URLSearchParams();
    if (state.lang && state.lang !== 'all') p.set('lang', state.lang);
    if (state.type !== 'all') p.set('type', state.type);
    if (state.q) p.set('q', state.q);
    if (state.dev) p.set('dev', '1');
    const current = new URLSearchParams(window.location.search);
    ['embed', 'iframe', 'mode'].forEach(key => {
      if (current.has(key)) p.set(key, current.get(key));
    });
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
    const pill = state.lang !== 'all' ? findPill('data-filter-lang', state.lang) : null;
    if (pill && pill.hasAttribute('data-dev-only') && !state.dev) state.dev = true;

    const hasContext = Boolean(state.lang || state.q);
    const secondaryLanguage = state.lang && state.lang !== 'all' && !isPrimaryLanguage(state.lang);
    const languageDetails = $('#hub-more-languages');
    if (languageDetails && secondaryLanguage) languageDetails.open = true;

    if (state.lang && state.lang !== 'all') localStorage.setItem('cosy_target_lang', state.lang);
    else if (state.lang === 'all') localStorage.removeItem('cosy_target_lang');

    const devBox = $('#hub-show-dev');
    if (devBox) devBox.checked = state.dev;
    setPressed('data-filter-lang', state.lang);
    setPressed('data-filter-type', state.type);

    let visibleTools = 0;
    $$('.engine-card').forEach(card => {
      const ok =
        (state.lang === '' || state.lang === 'all' || card.dataset.lang === state.lang) &&
        (state.type === 'all' || card.dataset.type === state.type) &&
        (state.dev || secondaryLanguage || card.dataset.status !== 'stub') &&
        hasContext &&
        (!state.q || (card.dataset.search || '').includes(state.q));
      card.hidden = !ok;
      if (ok) visibleTools++;
    });
    $$('.hub-section').forEach(sec => {
      sec.hidden = !$$('.engine-card:not([hidden])', sec).length;
    });

    // Cross-language tools stay tucked away until a search points to one.
    let visibleCoreTools = 0;
    $$('.ref-card').forEach(card => {
      const hay = ((card.getAttribute('data-search') || '') + ' ' + card.innerText).toLowerCase();
      const ok = !state.q || hay.includes(state.q);
      card.style.display = ok ? 'flex' : 'none';
      if (ok) visibleCoreTools++;
    });
    const coreDetails = $('#hub-core-tools');
    if (coreDetails && state.q && visibleCoreTools) coreDetails.open = true;

    const results = $('#hub-tool-results');
    if (results) results.hidden = !hasContext;
    const toolsJump = $('.sd-jump-link[href="#hub-tool-results"]');
    if (toolsJump) toolsJump.hidden = !hasContext;
    const prompt = $('#hub-language-prompt');
    if (prompt) prompt.hidden = hasContext;

    const empty = $('#no-results-box');
    if (empty) empty.style.display = hasContext && visibleTools + (state.q ? visibleCoreTools : 0) === 0 ? 'block' : 'none';
    const count = $('#hub-result-count');
    if (count) count.hidden = !hasContext;
    renderCount(visibleTools + (state.q ? visibleCoreTools : 0));
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
    state.lang = ''; state.type = 'all'; state.q = ''; state.dev = false;
    localStorage.removeItem('cosy_target_lang');
    const languages = $('#hub-more-languages');
    if (languages) languages.open = false;
    const filters = $('#hub-advanced-filters');
    if (filters) filters.open = false;
    const coreTools = $('#hub-core-tools');
    if (coreTools) coreTools.open = false;
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
      let debounceTimer = null;
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.q = input.value.trim().toLowerCase();
          apply();
        }, 120);
      });
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
      if (state.dev && !state.lang) state.lang = 'all';
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
