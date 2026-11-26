/**
 * shared/js/vocabulary-relations.js
 * Antonyms for every band, synonyms from B1-B2 upwards.
 *
 * The lexicon is one file, shared by every daily surface: club wheels, word of
 * the day, verb, phrasal verb and idiom cards. A word with no entry simply
 * renders without a relation line.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.COSYVocab = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    var LEXICON_URL = 'https://cosylanguages.github.io/COSYtools/shared/js/vocabulary-relations.json';
    var SYNONYM_FROM = ['b1-b2', 'c1-c2'];

    var cache = null;
    var loading = null;

    function norm(word) {
        return String(word == null ? '' : word).trim().toLowerCase().replace(/\s+/g, ' ');
    }

    function bandFromLevel(level) {
        var raw = String(level == null ? '' : level).trim().toLowerCase();
        if (!raw) return '';
        if (raw === 'a0-a1' || raw === 'a2' || raw === 'b1-b2' || raw === 'c1-c2') return raw;
        if (raw === 'a0' || raw === 'a1') return 'a0-a1';
        if (raw === 'a2') return 'a2';
        if (raw === 'b1' || raw === 'b2') return 'b1-b2';
        if (raw === 'c1' || raw === 'c2') return 'c1-c2';
        return '';
    }

    function allowsSynonyms(band) {
        var b = bandFromLevel(band) || band;
        return SYNONYM_FROM.indexOf(b) !== -1;
    }

    function prime(data) {
        cache = (data && data.langs) || data || {};
        return cache;
    }

    function load(url) {
        if (cache) return Promise.resolve(cache);
        if (loading) return loading;
        if (typeof fetch !== 'function') {
            cache = {};
            return Promise.resolve(cache);
        }
        loading = fetch(url || LEXICON_URL)
            .then(function (res) {
                if (!res.ok) throw new Error('lexicon ' + res.status);
                return res.json();
            })
            .then(function (data) {
                return prime(data);
            })
            .catch(function () {
                cache = {};
                return cache;
            });
        return loading;
    }

    function relations(word, lang) {
        var table = (cache && cache[lang || 'en']) || {};
        var entry = table[norm(word)];
        if (!entry) return { antonyms: [], synonyms: [] };
        return {
            antonyms: (entry.antonyms || []).slice(),
            synonyms: (entry.synonyms || []).slice()
        };
    }

    /** Relations allowed for a band: antonyms always, synonyms from b1-b2. */
    function forBand(word, band, lang) {
        var r = relations(word, lang);
        return {
            antonyms: r.antonyms,
            synonyms: allowsSynonyms(band) ? r.synonyms : []
        };
    }

    function decorate(word, opts) {
        var o = opts || {};
        var r = forBand(word, o.band, o.lang);
        return {
            word: word,
            antonyms: r.antonyms,
            synonyms: r.synonyms,
            hasRelations: r.antonyms.length > 0 || r.synonyms.length > 0
        };
    }

    function decorateList(list, opts) {
        return (list || []).map(function (word) { return decorate(word, opts); });
    }

    /** Adds antonyms/synonyms onto an entry object in place, and returns it. */
    function attach(entry, opts) {
        if (!entry) return entry;
        var headword = entry.word || entry.lemma || entry.verb || entry.idiom || '';
        var r = forBand(headword, (opts || {}).band, (opts || {}).lang);
        entry.antonyms = r.antonyms;
        entry.synonyms = r.synonyms;
        return entry;
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /** One line of HTML: "↔ antonym · ≈ synonym, synonym", empty when nothing applies. */
    function relationsLine(word, opts) {
        var r = forBand(word, (opts || {}).band, (opts || {}).lang);
        var parts = [];
        if (r.antonyms.length) {
            parts.push('<span class="vocab-antonym">↔ ' + escapeHtml(r.antonyms.join(', ')) + '</span>');
        }
        if (r.synonyms.length) {
            parts.push('<span class="vocab-synonym">≈ ' + escapeHtml(r.synonyms.join(', ')) + '</span>');
        }
        return parts.length ? parts.join('<span class="vocab-sep"> · </span>') : '';
    }

    function stats() {
        var table = (cache && cache.en) || {};
        var words = Object.keys(table);
        var withAntonym = words.filter(function (w) { return (table[w].antonyms || []).length; });
        return { words: words.length, withAntonym: withAntonym.length };
    }

    return {
        LEXICON_URL: LEXICON_URL,
        load: load,
        prime: prime,
        relations: relations,
        forBand: forBand,
        decorate: decorate,
        decorateList: decorateList,
        attach: attach,
        relationsLine: relationsLine,
        allowsSynonyms: allowsSynonyms,
        bandFromLevel: bandFromLevel,
        stats: stats
    };
}));
