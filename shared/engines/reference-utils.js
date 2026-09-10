/**
 * COSYtools Shared Reference & Engine Utilities
 * Provides offline-first search, language detection, data loading, caching,
 * weak-spot/SRS tracking, and link generation across reference tools.
 */

window.COSYReferenceUtils = (function () {
  'use strict';

  const LOCAL_CACHE_PREFIX = 'cosy_ref_cache_';
  const WEAK_SPOTS_KEY = 'cosy_weak_spots';
  const PRACTICE_STATS_KEY = 'cosy_practice_stats';

  /**
   * Detect language from text string based on character sets and common tokens.
   * @param {string} text
   * @returns {string} Language code ('ru', 'el', 'fr', 'it', 'en', 'es', 'de', 'pt', 'hy', 'ka', 'tt', 'ba', 'br', 'cv', or 'unknown')
   */
  function detectLanguage(text) {
    if (!text || typeof text !== 'string') return 'en';
    const query = text.trim();

    // Cyrillic (ru, tt, ba, cv)
    if (/[\u0400-\u04FF]/.test(query)) {
      if (/[ҫӑӐҪ]/.test(query)) return 'cv';
      if (/[әөүҗңһӘӨҮҖҢҺ]/.test(query)) return 'tt';
      if (/[ҙҡҫңғһҘҠҪҢҒҺ]/.test(query)) return 'ba';
      return 'ru';
    }

    // Greek
    if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(query)) {
      return 'el';
    }

    // Armenian
    if (/[\u0530-\u058F]/.test(query)) {
      return 'hy';
    }

    // Georgian
    if (/[\u10A0-\u10FF]/.test(query)) {
      return 'ka';
    }

    // Romance / Germanic accent markers & word endings
    const lower = query.toLowerCase();
    if (/[éèêëàâùûçîïôœ]/.test(lower) || /\b(le|la|les|un|une|des|du|est|sont|parler|être)\b/.test(lower)) return 'fr';
    if (/[àèéìíîòóùú]/.test(lower) || /\b(il|la|i|gli|le|un|una|essere|avere|parlare|di|del)\b/.test(lower)) return 'it';
    if (/[ñáéíóúü]/.test(lower) || /\b(el|la|los|las|un|una|ser|estar|hablar|del|por)\b/.test(lower)) return 'es';
    if (/[äöüß]/.test(lower) || /\b(der|die|das|ein|eine|sein|haben|und|ich|mit)\b/.test(lower)) return 'de';
    if (/[ãõçáéíóúâêô]/.test(lower) || /\b(o|a|os|as|um|uma|ser|estar|falar|com)\b/.test(lower)) return 'pt';
    if (/\b(c'h|gant|amzer|pa|eo|ha|hag)\b/.test(lower)) return 'br';

    return 'en';
  }

  /**
   * Load JSON dataset with offline fallback and caching.
   * @param {string} url
   * @returns {Promise<any>}
   */
  async function loadData(url) {
    const cacheKey = LOCAL_CACHE_PREFIX + url;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} loading ${url}`);
      }
      const data = await response.json();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {
        // Storage limit or disabled
      }
      return data;
    } catch (err) {
      console.warn(`COSYReferenceUtils: Failed to fetch ${url}, checking local cache...`, err);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error('COSYReferenceUtils: Failed parsing cached data', e);
        }
      }
      throw err;
    }
  }

  /**
   * Search across verbs, nouns, or grammar rules in a dataset object.
   * @param {Object|Array} dataset
   * @param {string} query
   * @param {Object} [options]
   * @returns {Array} Matching items
   */
  function searchDataset(dataset, query, options = {}) {
    if (!dataset || !query) return [];
    const q = query.trim().toLowerCase();
    const items = Array.isArray(dataset) ? dataset : Object.values(dataset);

    return items.filter(item => {
      if (typeof item === 'string') {
        return item.toLowerCase().includes(q);
      }

      const matchLemma = (item.verb || item.noun || item.lemma || item.word || item.name || '').toLowerCase().includes(q);
      const matchDef = (item.definition || item.translation || item.meaning || item.desc || '').toLowerCase().includes(q);
      const matchGrammar = (item.pattern || item.grammar_rule || item.gender || '').toLowerCase().includes(q);

      return matchLemma || matchDef || matchGrammar;
    });
  }

  /**
   * Record a weak spot item for SRS practice.
   * @param {Object} item - { id, lang, type, prompt, answer, userResponse }
   */
  function recordWeakSpot(item) {
    if (!item || !item.id) return;
    try {
      const spots = JSON.parse(localStorage.getItem(WEAK_SPOTS_KEY) || '[]');
      const existingIdx = spots.findIndex(s => s.id === item.id && s.lang === item.lang);

      const newSpot = {
        id: item.id,
        lang: item.lang || 'en',
        type: item.type || 'general',
        prompt: item.prompt || '',
        answer: item.answer || '',
        failCount: existingIdx >= 0 ? (spots[existingIdx].failCount || 1) + 1 : 1,
        lastReviewed: Date.now()
      };

      if (existingIdx >= 0) {
        spots[existingIdx] = newSpot;
      } else {
        spots.push(newSpot);
      }

      localStorage.setItem(WEAK_SPOTS_KEY, JSON.stringify(spots));
    } catch (e) {
      console.error('COSYReferenceUtils: Error saving weak spot', e);
    }
  }

  /**
   * Get list of recorded weak spots.
   * @returns {Array}
   */
  function getWeakSpots() {
    try {
      return JSON.parse(localStorage.getItem(WEAK_SPOTS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Clear or remove a weak spot item once mastered.
   * @param {string} id
   * @param {string} lang
   */
  function removeWeakSpot(id, lang) {
    try {
      let spots = JSON.parse(localStorage.getItem(WEAK_SPOTS_KEY) || '[]');
      spots = spots.filter(s => !(s.id === id && s.lang === lang));
      localStorage.setItem(WEAK_SPOTS_KEY, JSON.stringify(spots));
    } catch (e) {
      console.error('COSYReferenceUtils: Error removing weak spot', e);
    }
  }

  /**
   * Generate ecosystem cross-links.
   * @param {string} destination - 'games', 'home', 'world', 'events', 'tools'
   * @param {Object} [params] - Query params to append
   * @returns {string} URL string
   */
  function getEcosystemLink(destination, params = {}) {
    const baseUrls = {
      home: 'https://cosylanguages.github.io/COSYlanguages/',
      games: 'https://cosylanguages.github.io/COSYgames/',
      world: 'https://cosylanguages.github.io/COSYworld/',
      events: 'https://cosylanguages.github.io/COSYevents/',
      tools: 'https://cosylanguages.github.io/COSYtools/'
    };

    let baseUrl = baseUrls[destination] || baseUrls.home;
    const searchParams = new URLSearchParams(params).toString();
    return searchParams ? `${baseUrl}?${searchParams}` : baseUrl;
  }

  return {
    detectLanguage,
    loadData,
    searchDataset,
    recordWeakSpot,
    getWeakSpots,
    removeWeakSpot,
    getEcosystemLink
  };
})();
