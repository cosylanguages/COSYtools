/**
 * ConjugatorEngineBase — behaviour shared by the verb-conjugator tools.
 *
 * Subclasses provide only what is language-specific: rendering a verb, colour-coding
 * endings, searching, and the practice questions. Everything else (data loading,
 * deep-link handling, the search box, suggestions, practice-mode toggle) lives here.
 *
 *   class ItalianConjugationEngine extends ConjugatorEngineBase {
 *     constructor() { super({ storeKey: 'cosy-it-coniugatore' }); }
 *     ...
 *   }
 *
 * Classic <script>: load after srs-store.js, practice-engine.js and escape.js,
 * and before the tool's own js/engine.js.
 */
/* global SpacedRepetitionStore, PracticeEngine, COSYEscape */
class ConjugatorEngineBase {
  /**
   * @param {{storeKey: string, dataUrl?: string, practiceModes?: string[]}} options
   */
  constructor({ storeKey, dataUrl = 'data/verbs.json', practiceModes = ['conjugate'] }) {
    this.verbDb = {};
    this.isGameActive = false;
    this.dataUrl = dataUrl;
    this.srsStore = typeof SpacedRepetitionStore !== 'undefined' ? new SpacedRepetitionStore(storeKey) : null;
    this.practice =
      typeof PracticeEngine !== 'undefined'
        ? new PracticeEngine({
            engine: this,
            srsStore: this.srsStore,
            containerId: 'practice-card-content',
            practiceModes,
          })
        : null;
    this.init();
  }

  async init() {
    try {
      const res = await fetch(this.dataUrl);
      this.verbDb = await res.json();
      this.bindEvents();
      this.handleInitialQueryParams();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Hook for tools that support ?preset=… deep links.
   * @param {URLSearchParams} _params
   * @returns {boolean} true when the preset handled the page load
   */
  handlePreset(_params) {
    return false;
  }

  handleInitialQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (this.handlePreset(params)) return;
    const target =
      params.get('verb') || params.get('infinitive') || params.get('word') || params.get('q') || params.get('search');
    if (target) {
      const input = document.getElementById('verb-search-input');
      if (input) input.value = target;
      this.searchVerb(target);
    }
  }

  bindEvents() {
    const input = document.getElementById('verb-search-input');
    if (input) {
      input.addEventListener('input', (e) => this.handleInput(e.target.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.searchVerb(input.value);
      });
    }
    const gInput = document.getElementById('game-answer-input');
    if (gInput) {
      gInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.checkGameAnswer();
      });
    }
    const box = document.getElementById('search-suggestions');
    if (box) {
      box.addEventListener('click', (e) => {
        const item = e.target.closest('[data-key]');
        if (item) this.searchVerb(item.dataset.key);
      });
    }
  }

  handleInput(query) {
    const q = query.trim().toLowerCase();
    const box = document.getElementById('search-suggestions');
    if (!q) {
      box.style.display = 'none';
      return;
    }
    const esc = COSYEscape.escapeHtml;
    const matches = Object.keys(this.verbDb).filter((v) => v.startsWith(q));
    if (matches.length > 0) {
      box.innerHTML = matches
        .slice(0, 6)
        .map(
          (v) => `
                <button type="button" class="suggestion-item" data-key="${esc(v)}">
                    <span><strong>${esc(v)}</strong></span>
                    <span>${esc(this.verbDb[v].group)}</span>
                </button>
            `
        )
        .join('');
      box.style.display = 'block';
    } else {
      box.style.display = 'none';
    }
  }

  toggleGameMode() {
    this.isGameActive = !this.isGameActive;
    document.getElementById('game-container').style.display = this.isGameActive ? 'block' : 'none';
    document.getElementById('search-section-container').style.display = this.isGameActive ? 'none' : 'block';
    document.getElementById('verb-result-container').style.display = 'none';
    document.getElementById('empty-state').style.display = this.isGameActive ? 'none' : 'block';
    if (this.isGameActive && this.practice) this.practice.startSession();
  }
}

if (typeof window !== 'undefined') window.ConjugatorEngineBase = ConjugatorEngineBase;
if (typeof module === 'object' && module.exports) module.exports = ConjugatorEngineBase;
