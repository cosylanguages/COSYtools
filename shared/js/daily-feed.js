/**
 * COSYtools Daily Feed Engine (`shared/js/daily-feed.js`)
 *
 * Ingests Word of the Day (if verb) and Phrasal Verb of the Day from COSYdata:
 *   https://cosylanguages.github.io/COSYdata/daily/{lang}/calendar/{slot}/{YYYY-MM}.json
 * Matches verb headword against COSYtools conjugation database & preposition governance.
 * Handles client-side midnight rollover, offline fallback, and ecosystem deep linking.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.COSYDailyFeed = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const BASE_DATA_URL = 'https://cosylanguages.github.io/COSYdata/daily';

    /**
     * Get the client's local date string formatted as YYYY-MM-DD.
     * Respects client timezone and midnight rollover.
     * @param {Date} [d=new Date()]
     * @returns {string} YYYY-MM-DD
     */
    function getLocalDateString(d = new Date()) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Get YYYY-MM from a Date or YYYY-MM-DD string.
     * @param {Date|string} date
     * @returns {string} YYYY-MM
     */
    function getYearMonth(date) {
        if (typeof date === 'string') {
            return date.slice(0, 7);
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }

    /**
     * Deterministic hash integer from date string and optional seed.
     * Useful for stable offline selection across days.
     * @param {string} str
     * @returns {number}
     */
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    /**
     * Deep-link generator for ecosystem partners.
     */
    function getEcosystemLinks(dateStr, verbId) {
        const dateParam = dateStr || getLocalDateString();
        const verbParam = encodeURIComponent(verbId || '');
        return {
            conversation: `https://cosylanguages.github.io/COSYlanguages/?date=${dateParam}`,
            practice: `https://cosylanguages.github.io/COSYpractice/?verb=${verbParam}`
        };
    }

    /**
     * Fetch daily slot calendar from COSYdata.
     * If 404 or network fails, returns null.
     */
    async function fetchDailyCalendar(lang, slot, yearMonth) {
        const url = `${BASE_DATA_URL}/${lang}/calendar/${slot}/${yearMonth}.json`;
        try {
            const resp = await fetch(url, { cache: 'default' });
            if (!resp.ok) return null;
            return await resp.json();
        } catch (e) {
            return null;
        }
    }

    /**
     * COSYdata calendars hold one card per CEFR level for each date ({"A2": {...}, "B1": {...}}).
     * Return the card for the preferred level, else the nearest sensible one. A flat card
     * (an object that has its own `word`) is returned as is, so older feeds keep working.
     * @param {Object|null} day calendar value for one date
     * @param {string} [preferred='B1']
     * @returns {Object|null}
     */
    function pickLevelCard(day, preferred = 'B1') {
        if (!day || typeof day !== 'object') return null;
        if (typeof day.word === 'string') return day;
        const order = [preferred, 'B1', 'A2', 'B2', 'A1', 'A0', 'C1', 'C2'];
        for (const level of order) {
            const card = day[level];
            if (card && typeof card === 'object' && typeof card.word === 'string' && card.word.trim()) {
                return card.level ? card : Object.assign({ level }, card);
            }
        }
        return null;
    }

    /**
     * Universal loader that works in both Browser and Node.js environments.
     */
    async function loadJsonResource(relPath) {
        if (typeof window === 'undefined' && typeof require !== 'undefined') {
            try {
                const fs = require('fs');
                const path = require('path');
                // Try from cwd
                const fullPath = path.resolve(process.cwd(), relPath);
                if (fs.existsSync(fullPath)) {
                    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                }
            } catch (e) {
                // Fall back
            }
        }

        if (typeof fetch === 'function') {
            const res = await fetch(relPath);
            if (res.ok) {
                return await res.json();
            }
        }
        return null;
    }

    /**
     * Fetch preposition rules from shared or tool databases.
     */
    async function fetchPrepositionRules(lang, basePath = '') {
        const paths = [
            `${basePath}tools/${lang}/verb-prep/data/verbs.json`,
            `${basePath}tools/${lang}/regime/data/verbs.json`,
            `${basePath}tools/${lang}/reggenza/data/verbs.json`,
            `${basePath}tools/${lang}/praepositionen/data/verbs.json`,
            `${basePath}tools/${lang}/syntaxi/data/verbs.json`,
            `${basePath}shared/data/preposition-rules.json`
        ];

        for (const p of paths) {
            try {
                const data = await loadJsonResource(p);
                if (data) {
                    if (p.includes('shared/data/preposition-rules.json')) {
                        return data[lang] || [];
                    }
                    return data;
                }
            } catch (e) {
                // Try next
            }
        }
        return null;
    }

    /**
     * Fetch conjugation database for a language.
     */
    async function fetchConjugationData(lang, basePath = '') {
        const candidatePaths = [
            `${basePath}tools/${lang}/irregular-verbs/data/verbs.json`,
            `${basePath}tools/${lang}/conjugeur/data/verbs.json`,
            `${basePath}tools/${lang}/coniugatore/data/verbs.json`,
            `${basePath}tools/${lang}/spryazhenie/data/verbs.json`,
            `${basePath}tools/${lang}/klisi-rimaton/data/verbs.json`,
            `${basePath}tools/${lang}/konjugation/data/verbs.json`,
            `${basePath}shared/data/verbs-${lang}.json`
        ];

        for (const p of candidatePaths) {
            try {
                const data = await loadJsonResource(p);
                if (data && (Array.isArray(data) || Object.keys(data).length > 0)) {
                    return data;
                }
            } catch (e) {
                // Try next
            }
        }
        return null;
    }

    /**
     * Find a verb entry in conjugation data by headword or alias.
     */
    function matchVerbEntry(conjData, lemma) {
        if (!conjData || !lemma) return null;
        const target = lemma.trim().toLowerCase();

        if (Array.isArray(conjData)) {
            return conjData.find(v => {
                if (!v) return false;
                const base = (v.base || v.lemma || v.verb || v.infinitive || '').toLowerCase();
                return base === target;
            }) || null;
        }

        // Object keyed by headword
        if (conjData[target]) return conjData[target];

        for (const [k, v] of Object.entries(conjData)) {
            if (!v) continue;
            const normKey = k.toLowerCase();
            const base = (v.base || v.lemma || v.verb || v.infinitive || '').toLowerCase();
            if (normKey === target || base === target) return v;
        }

        return null;
    }

    /**
     * Find a preposition governance entry by verb headword.
     */
    function matchPrepositionEntry(prepData, lemma) {
        if (!prepData || !lemma) return null;
        const target = lemma.trim().toLowerCase();

        if (Array.isArray(prepData)) {
            return prepData.find(p => {
                if (!p) return false;
                const v = (p.verb || p.lemma || p.word || '').toLowerCase();
                return v === target;
            }) || null;
        }

        if (prepData[target]) return prepData[target];

        for (const [k, v] of Object.entries(prepData)) {
            if (!v) continue;
            const normK = k.toLowerCase();
            if (normK === target || normK.startsWith(target + ' ') || normK.startsWith(target + '+')) {
                return v;
            }
        }

        return null;
    }

    /**
     * Extract key tenses from a verb entry into a standardized structure.
     */
    function extractKeyTenses(entry, lang) {
        if (!entry) return {};

        // English irregular verb entry structure
        if (lang === 'en' && entry.base) {
            return {
                base: entry.base,
                past_simple: entry.past_simple,
                past_participle: entry.past_participle,
                third_person_singular: entry.third_person_singular || (entry.base + 's'),
                is_irregular: true,
                pattern_group: entry.pattern_group || 'irregular'
            };
        }

        const tenses = entry.tenses || entry.conjugations || {};
        const result = {};

        // Present
        const presKey = Object.keys(tenses).find(k => k.includes('present') || k === 'pres' || k === 'prs');
        if (presKey) result.present = tenses[presKey];

        // Past / Imperfect / Preterite
        const pastKey = Object.keys(tenses).find(k => k.includes('imparfait') || k.includes('past') || k === 'imp' || k.includes('pret'));
        if (pastKey) result.past = tenses[pastKey];

        // Perfect / Passé Composé
        const perfKey = Object.keys(tenses).find(k => k === 'pc' || k.includes('perfect') || k === 'perf' || k === 'aor');
        if (perfKey) result.perfect = tenses[perfKey];

        // Future
        const futKey = Object.keys(tenses).find(k => k.includes('futur') || k === 'fut');
        if (futKey) result.future = tenses[futKey];

        // Subjunctive / Conditional
        const subKey = Object.keys(tenses).find(k => k.includes('subj') || k.includes('subjonctif') || k.includes('cond'));
        if (subKey) result.subjunctive_or_conditional = tenses[subKey];

        return result;
    }

    /**
     * Generate fallback daily entries deterministically from local databases.
     * Prioritizes verbs that have both conjugation AND preposition governance data
     * to prevent linguistically mismatched pairings.
     */
    function getFallbackDailyEntry(lang, conjData, prepData, dateStr) {
        const hash = hashString(`${dateStr}:${lang}`);

        let selectedVerb = null;
        let selectedVerbKey = '';
        let selectedPrep = null;
        let prepVerbKey = '';

        const conjKeys = conjData ? (Array.isArray(conjData)
            ? conjData.map(v => v.base || v.lemma || v.verb || v.infinitive).filter(Boolean)
            : Object.keys(conjData)) : [];

        // Try to find a verb that exists in BOTH conjugation and preposition databases
        if (conjKeys.length > 0 && prepData) {
            const overlapping = conjKeys.filter(k => !!matchPrepositionEntry(prepData, k));
            if (overlapping.length > 0) {
                selectedVerbKey = overlapping[hash % overlapping.length];
                selectedVerb = Array.isArray(conjData)
                    ? conjData.find(v => (v.base || v.lemma || v.verb || v.infinitive) === selectedVerbKey)
                    : conjData[selectedVerbKey];
                selectedPrep = matchPrepositionEntry(prepData, selectedVerbKey);
                prepVerbKey = selectedVerbKey;
            }
        }

        // Fallback if no overlap found
        if (!selectedVerb && conjKeys.length > 0) {
            selectedVerbKey = conjKeys[hash % conjKeys.length];
            selectedVerb = Array.isArray(conjData)
                ? conjData.find(v => (v.base || v.lemma || v.verb || v.infinitive) === selectedVerbKey)
                : conjData[selectedVerbKey];
        }

        if (!selectedPrep && prepData) {
            const prepKeys = Array.isArray(prepData)
                ? prepData.map(p => p.verb || p.lemma || p.word).filter(Boolean)
                : Object.keys(prepData);

            if (prepKeys.length > 0) {
                prepVerbKey = prepKeys[(hash + 3) % prepKeys.length];
                selectedPrep = Array.isArray(prepData)
                    ? prepData.find(p => (p.verb || p.lemma || p.word) === prepVerbKey)
                    : prepData[prepVerbKey];
            }
        }

        return {
            date: dateStr,
            lang: lang,
            verbKey: selectedVerbKey,
            verbEntry: selectedVerb,
            prepKey: prepVerbKey || selectedVerbKey,
            prepEntry: selectedPrep,
            source: 'local-deterministic'
        };
    }

    /**
     * Main ingestion entry point.
     * Ingests today's Word of the Day (if verb) and Phrasal Verb of the Day,
     * matches against COSYtools conjugation and preposition databases,
     * with local deterministic fallback.
     */
    async function getDailyGrammarPack(lang = 'en', date = new Date(), basePath = '', level = 'B1') {
        const dateStr = typeof date === 'string' ? date : getLocalDateString(date);
        const ym = getYearMonth(dateStr);

        // Concurrently load local databases
        const [conjData, prepData] = await Promise.all([
            fetchConjugationData(lang, basePath),
            fetchPrepositionRules(lang, basePath)
        ]);

        let wordOfDay = null;
        let phrasalOfDay = null;

        // Attempt feed fetch from COSYdata. `verb` and `verb-prep` list only verbs these tools can drill.
        const [wordCal, phrasalCal, idiomCal, verbCal, verbPrepCal] = await Promise.all([
            fetchDailyCalendar(lang, 'word', ym),
            fetchDailyCalendar(lang, 'phrasal-verb', ym),
            fetchDailyCalendar(lang, 'idiom', ym),
            fetchDailyCalendar(lang, 'verb', ym),
            fetchDailyCalendar(lang, 'verb-prep', ym)
        ]);
        const verbOfDay = verbCal && verbCal.days ? pickLevelCard(verbCal.days[dateStr], level) : null;
        const verbPrepOfDay = verbPrepCal && verbPrepCal.days ? pickLevelCard(verbPrepCal.days[dateStr], level) : null;

        if (wordCal && wordCal.days) {
            wordOfDay = pickLevelCard(wordCal.days[dateStr], level);
        }
        if (phrasalCal && phrasalCal.days) {
            phrasalOfDay = pickLevelCard(phrasalCal.days[dateStr], level);
        }
        if (!wordOfDay && idiomCal && idiomCal.days) {
            // Check if any level contains a verb idiom
            const candidate = pickLevelCard(idiomCal.days[dateStr], level);
            if (candidate) {
                wordOfDay = {
                    word: candidate.word,
                    definition: candidate.definition,
                    example: candidate.example,
                    id: candidate.id
                };
            }
        }

        // Identify candidate verb headword: the verb of the day wins, then the word/idiom of the day
        let candidateLemma = '';
        if (verbOfDay && verbOfDay.word) {
            candidateLemma = verbOfDay.word.toLowerCase().trim().replace(/^to\s+/, '');
        } else if (wordOfDay && typeof wordOfDay === 'object') {
            const raw = (wordOfDay.word || wordOfDay.lemma || '').toLowerCase().trim();
            // Clean up to first word if multi-word or phrasal
            candidateLemma = raw.replace(/^to\s+/, '').split(/\s+/)[0];
        }

        let verbEntry = matchVerbEntry(conjData, candidateLemma);
        let prepEntry = matchPrepositionEntry(prepData, candidateLemma);
        let prepLemma = candidateLemma;

        // The verb + preposition of the day drives the preposition card; a phrasal verb is only used without it
        let prepFromFeed = false;
        if (verbPrepOfDay && verbPrepOfDay.word) {
            const lemma = verbPrepOfDay.word.toLowerCase().trim().replace(/^to\s+/, '');
            const match = matchPrepositionEntry(prepData, lemma);
            if (match) {
                prepEntry = match;
                prepLemma = lemma;
                prepFromFeed = true;
            }
        }

        // If phrasal verb of the day is present, use or match it for preposition card
        const phrasalWord = !prepFromFeed && phrasalOfDay && typeof phrasalOfDay === 'object'
            ? (phrasalOfDay.word || phrasalOfDay.lemma || phrasalOfDay.verb || '').toLowerCase().trim()
            : '';
        if (phrasalWord) {
            const phrasalMatch = matchPrepositionEntry(prepData, phrasalWord);
            if (phrasalMatch) {
                prepEntry = phrasalMatch;
                prepLemma = phrasalWord;
            } else if (!prepEntry) {
                prepEntry = {
                    verb: phrasalWord,
                    pattern: `${phrasalWord} [object]`,
                    level: phrasalOfDay.level || 'B1',
                    definition: phrasalOfDay.definition || 'Phrasal verb of the day',
                    examples: phrasalOfDay.example ? [phrasalOfDay.example] : [],
                    prepositions: phrasalWord.split(' ').slice(1)
                };
                prepLemma = phrasalWord;
            }
        }

        // If no match from external feed, use deterministic local fallback
        let source = 'cosydata-feed';
        if (!verbEntry) {
            const fallback = getFallbackDailyEntry(lang, conjData, prepData, dateStr);
            candidateLemma = fallback.verbKey;
            verbEntry = fallback.verbEntry;
            if (!prepEntry) {
                prepEntry = fallback.prepEntry;
                prepLemma = fallback.prepKey || fallback.verbKey;
            }
            source = 'local-fallback';
        } else if (!prepEntry) {
            const fallback = getFallbackDailyEntry(lang, conjData, prepData, dateStr);
            prepEntry = fallback.prepEntry;
            prepLemma = fallback.prepKey || fallback.verbKey;
        }

        const keyTenses = extractKeyTenses(verbEntry, lang);
        const links = getEcosystemLinks(dateStr, candidateLemma);

        return {
            date: dateStr,
            lang: lang,
            lemma: candidateLemma,
            prepLemma: prepLemma || candidateLemma,
            verbEntry: verbEntry,
            keyTenses: keyTenses,
            prepEntry: prepEntry,
            links: links,
            source: source,
            wordOfDay: wordOfDay,
            phrasalOfDay: phrasalOfDay,
            verbOfDay: verbOfDay,
            verbPrepOfDay: verbPrepOfDay
        };
    }

    return {
        getLocalDateString,
        getYearMonth,
        hashString,
        getEcosystemLinks,
        fetchDailyCalendar,
        fetchConjugationData,
        fetchPrepositionRules,
        pickLevelCard,
        matchVerbEntry,
        matchPrepositionEntry,
        extractKeyTenses,
        getFallbackDailyEntry,
        getDailyGrammarPack
    };
}));
