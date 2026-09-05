/**
 * js/data/languages.js
 * Master language registry for COSYlanguages.
 */

window.TRANSLATION_MAP = {
    'en': 'js/data/germanic/en/translations.js',
    'fr': 'js/data/romance/fr/translations.js',
    'it': 'js/data/romance/it/translations.js',
    'ru': 'js/data/slavic/ru/translations.js',
    'el': 'js/data/hellenic/el/translations.js',
    'es': 'js/data/romance/es/translations.js',
    'de': 'js/data/germanic/de/translations.js',
    'pt': 'js/data/romance/pt/translations.js',
    'hy': 'js/data/armenian/hy/translations.js',
    'ka': 'js/data/kartvelian/ka/translations.js',
    'tt': 'js/data/turkic/tt/translations.js',
    'ba': 'js/data/turkic/ba/translations.js',
    'br': 'js/data/celtic/br/translations.js'
};

// Master language registry.
// status: 'active' = published on site | 'coming_soon' = data may exist but not yet published
// has_data: true = there are grammar/vocabulary/curriculum files in the repo for this language
// James controls when a language moves from coming_soon to active.

window.COSY_LANGUAGES = [
  { code: 'en', name: 'English',    native: 'English',     status: 'active',       flag: '🇬🇧', family: 'germanic', img: 'cosyenglish.png',   has_cases: false, has_data: true  },
  { code: 'fr', name: 'French',     native: 'Français',    status: 'active',       flag: '🇫🇷', family: 'romance',  img: 'cosyfrench.png',    has_cases: false, has_data: true  },
  { code: 'it', name: 'Italian',    native: 'Italiano',    status: 'active',       flag: '🇮🇹', family: 'romance',  img: 'cosyitalian.png',   has_cases: false, has_data: true  },
  { code: 'ru', name: 'Russian',    native: 'Русский',     status: 'active',       flag: '🇷🇺', family: 'slavic',   img: 'cosyrussian.png',   has_cases: true,  has_data: true  },
  { code: 'el', name: 'Greek',      native: 'Ελληνικά',    status: 'active',       flag: '🇬🇷', family: 'hellenic', img: 'cosygreek.png',     has_cases: true,  has_data: true  },
  { code: 'es', name: 'Spanish',    native: 'Español',     status: 'coming_soon',  flag: '🇪🇸', family: 'romance',  img: 'cosyspanish.png',   has_cases: false, has_data: true  },
  { code: 'de', name: 'German',     native: 'Deutsch',     status: 'coming_soon',  flag: '🇩🇪', family: 'germanic', img: 'cosygerman.png',    has_cases: true,  has_data: true  },
  { code: 'pt', name: 'Portuguese', native: 'Português',   status: 'coming_soon',  flag: '🇵🇹', family: 'romance',  img: 'cosyportugese.png', has_cases: false, has_data: true  },
  { code: 'hy', name: 'Armenian',   native: 'Հայերեն',     status: 'coming_soon',  flag: '🇦🇲', family: 'armenian', img: 'cosyarmenian.png',  has_cases: true,  has_data: true  },
  { code: 'ka', name: 'Georgian',   native: 'ქართული',     status: 'coming_soon',  flag: '🇬🇪', family: 'kartvelian', img: 'cosygeorgian.png', has_cases: true,  has_data: true  },
  { code: 'tt', name: 'Tatar',      native: 'Татарча',     status: 'coming_soon',  flag: '🏴', family: 'turkic',    img: 'cosytatar.png',     has_cases: true,  has_data: true  },
  { code: 'ba', name: 'Bashkir',    native: 'Башҡортса',   status: 'coming_soon',  flag: '🏴', family: 'turkic',    img: 'cosybachkir.png',   has_cases: true,  has_data: true  },
  { code: 'br', name: 'Breton',     native: 'Brezhoneg',   status: 'coming_soon',  flag: '🏴', family: 'celtic',    img: 'cosybreton.png',    has_cases: false, has_data: true  },
];

window.COSY_LEVELS = [
    { id: 'starter',           name: 'Starter (A1)',           short: 'A1' },
    { id: 'elementary',        name: 'Elementary (A2)',        short: 'A2' },
    { id: 'intermediate',      name: 'Intermediate (B1)',      short: 'B1' },
    { id: 'upper_intermediate', name: 'Upper-Intermediate (B2)', short: 'B2' },
    { id: 'advanced',          name: 'Advanced (C1)',          short: 'C1' },
    { id: 'proficiency',       name: 'Proficiency (C2)',       short: 'C2' }
];

window.FAMILY_MAP = window.COSY_LANGUAGES.reduce((acc, l) => {
    acc[l.code] = l.family;
    return acc;
}, {});

/**
 * Normalises a language string/code to a standard ISO code.
 */
window.getLangCode = function(val) {
    if (!val) return localStorage.getItem('language') || 'en';
    const v = val.toLowerCase().trim();

    // 1. Exact matches for code or name
    const match = window.COSY_LANGUAGES.find(l =>
        l.code === v ||
        l.name.toLowerCase() === v ||
        l.native.toLowerCase() === v
    );
    if (match) return match.code;

    // 2. Partial matches (more permissive, but prioritized after exact)
    const partialMatch = window.COSY_LANGUAGES.find(l =>
        v.startsWith(l.code) ||
        v.includes(l.name.toLowerCase()) ||
        v.includes(l.native.toLowerCase())
    );

    return partialMatch ? partialMatch.code : 'en';
};

/**
 * Converts a level ID (e.g. 'starter') or short code to its short code (e.g. 'A1').
 * If already a short code, returns it.
 */
window.levelIdToShort = function(val) {
    if (!val) return 'A1';
    const v = val.toLowerCase().trim();
    if (v === 'all') return 'all';
    const match = window.COSY_LEVELS.find(l =>
        l.id === v ||
        l.id === v.replace('-', '_') ||
        l.short.toLowerCase() === v ||
        l.name.toLowerCase().includes(v)
    );
    return match ? match.short : 'A1';
};

/**
 * Converts a short code (e.g. 'A1') or level ID to its full ID (e.g. 'starter').
 * If already an ID, returns it.
 */
window.levelShortToId = function(val) {
    if (!val) return 'starter';
    const v = val.toLowerCase().trim();
    if (v === 'all') return 'all';
    const match = window.COSY_LEVELS.find(l =>
        l.id === v ||
        l.id === v.replace('-', '_') ||
        l.short.toLowerCase() === v ||
        l.name.toLowerCase().includes(v)
    );
    return match ? match.id : 'starter';
};

/**
 * Normalises a level string/code to a standard slug (id) or short code.
 * @param {string} val - The level string to normalise.
 * @param {string} [targetType='id'] - 'id' for full ID (starter), 'short' for short code (A1).
 * @returns {string} The normalised level code.
 */
window.getLevelCode = function(val, targetType = 'id') {
    if (targetType === 'short') return window.levelIdToShort(val);
    return window.levelShortToId(val);
};

/**
 * Normalises a level string/code to a standard uppercase short code (A1-C2).
 */
window.normalizeLevel = function(val) {
    return window.levelIdToShort(val);
};

/**
 * Returns the directory name for a level slug.
 * Maps level IDs to short codes using COSY_LEVELS.
 */
window.getLevelDir = function(levelId) {
    const match = (window.COSY_LEVELS || []).find(l => l.id === levelId);
    return match ? match.short : levelId.toUpperCase();
};

// Helper: get only published languages
window.COSY_ACTIVE_LANGUAGES = window.COSY_LANGUAGES.filter(l => l.status === 'active');

// Helper: get all languages that have data (active + coming-soon with content)
window.COSY_LANGUAGES_WITH_DATA = window.COSY_LANGUAGES.filter(l => l.has_data);
