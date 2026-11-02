/**
 * COSYlanguages Shared Top Verbs Preset Configuration & Helpers
 * Supports instant practice for top core verbs in present tense across all 14 COSY target languages.
 * Includes Positive, Negative, and Interrogative (Question) form generation,
 * unmerged individual pronouns, target element options (type verb vs type pronoun),
 * and French negative sandwich mnemonic helper.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.COSYTopVerbs = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    const TOP_VERB_CONFIGS = {
        en: {
            toolPath: 'tools/en/irregular-verbs/',
            groups: [['be'], ['have'], ['think'], ['know'], ['like'], ['want'], ['work', 'study', 'learn'], ['go'], ['can'], ['eat', 'drink']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        fr: {
            toolPath: 'tools/fr/conjugeur/',
            groups: [['être'], ['avoir'], ['penser'], ['savoir', 'connaître'], ['aimer'], ['vouloir'], ['travailler', 'étudier', 'apprendre'], ['aller'], ['pouvoir'], ['manger', 'boire']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        it: {
            toolPath: 'tools/it/coniugatore/',
            groups: [['essere'], ['avere'], ['pensare'], ['sapere', 'conoscere'], ['piacere'], ['volere'], ['lavorare', 'studiare', 'imparare'], ['andare'], ['potere'], ['mangiare', 'bere']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        ru: {
            toolPath: 'tools/ru/spryazhenie/',
            groups: [[], ['иметь'], ['думать'], ['знать'], ['нравиться'], ['хотеть'], ['работать', 'учиться', 'учить'], ['идти'], ['мочь'], ['есть', 'пить']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: true // быть omitted in present (zero copula)
        },
        el: {
            toolPath: 'tools/el/klisi-rimaton/',
            groups: [['είμαι'], ['έχω'], ['σκέφτομαι'], ['ξέρω', 'γνωρίζω'], ['μου αρέσει'], ['θέλω'], ['δουλεύω', 'διαβάζω', 'μαθαίνω'], ['πηγαίνω'], ['μπορώ'], ['τρώω', 'πίνω']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        pt: {
            toolPath: 'tools/pt/conjugeur/',
            groups: [['ser'], ['ter'], ['pensar'], ['saber', 'conhecer'], ['gostar'], ['querer'], ['trabalhar', 'estudar', 'aprender'], ['ir'], ['poder'], ['comer', 'beber']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        de: {
            toolPath: 'tools/de/konjugation/',
            groups: [['sein'], ['haben'], ['denken'], ['wissen', 'kennen'], ['mögen'], ['wollen'], ['arbeiten', 'studieren', 'lernen'], ['gehen'], ['können'], ['essen', 'trinken']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        es: {
            toolPath: 'tools/es/conjugeur/',
            groups: [['ser'], ['tener'], ['pensar'], ['saber', 'conocer'], ['gustar'], ['querer'], ['trabajar', 'estudiar', 'aprender'], ['ir'], ['poder'], ['comer', 'beber']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        tt: {
            toolPath: 'tools/tt/conjugeur/',
            groups: [['булу'], ['ия булу'], ['уйлау'], ['белү'], ['ошату'], ['теләү'], ['эшләү', 'уку'], ['бару'], ['булдыру'], ['ашау', 'эчү']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        ba: {
            toolPath: 'tools/ba/conjugeur/',
            groups: [['булыу'], ['эйә булыу'], ['уйлау'], ['белеү'], ['ошатыу'], ['теләү'], ['эшләү', 'уҡыу'], ['барыу'], ['булдырыу'], ['ашау', 'эсеү']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        cv: {
            toolPath: 'tools/cv/conjugeur/',
            groups: [['пулни'], ['пурни'], ['шухăшлани'], ['пĕлни'], ['кăмăллани'], ['кавашни'], ['ĕçлев', 'вĕренни'], ['кайни'], ['пултару'], ['ҫини', 'ӗҫни']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        br: {
            toolPath: 'tools/br/conjugeur/',
            groups: [['bezañ'], ['kaout'], ['soñjal'], ['gouzout'], ['karet'], ['fellout'], ['labourat', 'studiañ'], ['mont'], ['gallout'], ['debriñ', 'evañ']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        hy: {
            toolPath: 'tools/hy/conjugeur/',
            groups: [['լինել'], ['ունենալ'], ['մտածել'], ['իմանալ'], ['սիրել'], ['ուզել'], ['աշխատել', 'սովորել'], ['գնալ'], ['կարողանալ'], ['ուտել', 'խմել']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        ka: {
            toolPath: 'tools/ka/conjugeur/',
            groups: [['ყოფნა'], ['აქვს'], ['ფიქრობს'], ['იცის'], ['უყვარს'], ['უნდა'], ['მუშაობს', 'სწავლობს'], ['მიდის'], ['შეუძლია'], ['ჭამა', 'სმა']],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        }
    };

    // `groups` = the 10 numbered groups of "Top 10 verbs, part 1" (a group can hold several verbs:
    // 4 = know (savoir + connaître ...), 7 = work / study / learn, 10 = eat / drink).
    // `lemmas` is the flat list of all verbs, in group order.
    Object.keys(TOP_VERB_CONFIGS).forEach(l => {
        TOP_VERB_CONFIGS[l].lemmas = TOP_VERB_CONFIGS[l].groups.reduce((a, g) => a.concat(g), []);
    });

    const EN_REGULAR_FALLBACKS = {
        'like': { base: 'like', lemma: 'like', level: 'A1', definition: 'to find pleasant or agreeable', present_simple: { 'I': 'like', 'you': 'like', 'he/she/it': 'likes', 'we': 'like', 'they': 'like' } },
        'want': { base: 'want', lemma: 'want', level: 'A1', definition: 'to desire or wish for', present_simple: { 'I': 'want', 'you': 'want', 'he/she/it': 'wants', 'we': 'want', 'they': 'want' } },
        'work': { base: 'work', lemma: 'work', level: 'A1', definition: 'to perform labor or activity', present_simple: { 'I': 'work', 'you': 'work', 'he/she/it': 'works', 'we': 'work', 'they': 'work' } },
        'study': { base: 'study', lemma: 'study', level: 'A1', definition: 'to acquire knowledge', present_simple: { 'I': 'study', 'you': 'study', 'he/she/it': 'studies', 'we': 'study', 'they': 'study' } },
        'can': { base: 'can', lemma: 'can', level: 'A1', definition: 'to be able to', present_simple: { 'I': 'can', 'you': 'can', 'he/she/it': 'can', 'we': 'can', 'they': 'can' } }
    };


    // Regular English verbs of parts 2 and 3 that the English data file does not contain.
    // Present simple is fully regular (+s / +es / y->ies), so it is built on demand.
    const EN_REGULAR_EXTRA = {
        'talk': 'to speak with someone', 'look': 'to direct your eyes at something', 'watch': 'to look at something for a time',
        'listen': 'to pay attention to a sound', 'ask': 'to put a question to someone', 'answer': 'to reply to a question',
        'wait': 'to stay until something happens', 'live': 'to have your home somewhere; to be alive',
        'remember': 'to keep something in your memory', 'decide': 'to make a choice', 'solve': 'to find an answer to a problem',
        'waste': 'to use something carelessly', 'help': 'to make something easier for someone', 'call': 'to telephone someone',
        'text': 'to send a written message by phone', 'agree': 'to have the same opinion', 'disagree': 'to have a different opinion'
    };
    // modals / semi-modals: forms are given explicitly
    const EN_SPECIAL_EXTRA = {
        'must': { definition: 'to be obliged to', forms: ['must', 'must', 'must', 'must', 'must'] },
        'should': { definition: 'to ought to', forms: ['should', 'should', 'should', 'should', 'should'] },
        'have to': { definition: 'to be obliged to', forms: ['have to', 'have to', 'has to', 'have to', 'have to'] }
    };
    function buildEnglishEntry(lemma) {
        const special = EN_SPECIAL_EXTRA[lemma];
        const regular = EN_REGULAR_EXTRA[lemma];
        if (!special && !regular) return null;
        let third;
        if (special) third = special.forms[2];
        else if (/(s|x|z|ch|sh)$/.test(lemma)) third = lemma + 'es';
        else if (/[^aeiou]y$/.test(lemma)) third = lemma.slice(0, -1) + 'ies';
        else third = lemma + 's';
        const f = special ? special.forms : [lemma, lemma, third, lemma, lemma];
        return {
            base: lemma, lemma, level: 'A1', definition: special ? special.definition : regular, needs_review: false,
            present_simple: { 'I': f[0], 'you': f[1], 'he/she/it': f[2], 'we': f[3], 'they': f[4] }
        };
    }

    // Master Unmerged Pronoun Registry for all 14 languages
    const PRONOUN_MAP = {
        en: {
            singular: ['I', 'you (sg)', 'he', 'she', 'it'],
            plural: ['we', 'you (pl)', 'they'],
            singularIndices: [0, 1, 2, 2, 2],
            pluralIndices: [3, 4, 4]
        },
        fr: {
            singular: ['je', 'tu', 'il', 'elle', 'on'],
            plural: ['nous', 'vous', 'ils', 'elles'],
            singularIndices: [0, 1, 2, 2, 2],
            pluralIndices: [3, 4, 5, 5]
        },
        it: {
            singular: ['io', 'tu', 'lui', 'lei'],
            plural: ['noi', 'voi', 'loro'],
            singularIndices: [0, 1, 2, 2],
            pluralIndices: [3, 4, 5]
        },
        ru: {
            singular: ['я', 'ты', 'он', 'она', 'оно'],
            plural: ['мы', 'вы', 'они'],
            singularIndices: [0, 1, 2, 2, 2],
            pluralIndices: [3, 4, 5]
        },
        el: {
            singular: ['εγώ', 'εσύ', 'αυτός', 'αυτή', 'αυτό'],
            plural: ['εμείς', 'εσείς', 'αυτοί', 'αυτές', 'αυτά'],
            singularIndices: [0, 1, 2, 2, 2],
            pluralIndices: [3, 4, 5, 5, 5]
        },
        pt: {
            singular: ['eu', 'tu', 'ele', 'ela'],
            plural: ['nós', 'vós', 'eles', 'elas'],
            singularIndices: [0, 1, 2, 2],
            pluralIndices: [3, 4, 5, 5]
        },
        de: {
            singular: ['ich', 'du', 'er', 'sie', 'es'],
            plural: ['wir', 'ihr', 'sie', 'Sie'],
            singularIndices: [0, 1, 2, 2, 2],
            pluralIndices: [3, 4, 5, 5]
        },
        es: {
            singular: ['yo', 'tú', 'él', 'ella', 'usted'],
            plural: ['nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas', 'ustedes'],
            singularIndices: [0, 1, 2, 2, 2],
            pluralIndices: [3, 3, 4, 4, 5, 5, 5]
        },
        tt: {
            singular: ['мин', 'син', 'ол/ул'],
            plural: ['без', 'сез', 'алар'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        ba: {
            singular: ['мин', 'син', 'ол/ул'],
            plural: ['беҙ', 'һеҙ', 'улар'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        cv: {
            singular: ['эпĕ', 'эсĕ', 'вăл'],
            plural: ['эпир', 'эсир', 'вĕсем'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        br: {
            singular: ['me', 'te', 'eñ', 'hi'],
            plural: ['ni', "c'hwi", 'i'],
            singularIndices: [0, 1, 2, 2],
            pluralIndices: [3, 4, 5]
        },
        hy: {
            singular: ['ես', 'դու', 'նա'],
            plural: ['մենք', 'դուք', 'նրանք'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        ka: {
            singular: ['მე', 'შენ', 'ის'],
            plural: ['ჩვენ', 'თქვენ', 'ისინი'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        }
    };

    const ACCENT_KEYS = {
        fr: ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'ù', 'û', 'ü'],
        it: ['à', 'è', 'é', 'ì', 'ò', 'ó', 'ù'],
        es: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'],
        de: ['ä', 'ö', 'ü', 'ß'],
        pt: ['á', 'â', 'ã', 'à', 'ç', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú'],
        el: ['ά', 'έ', 'ή', 'ί', 'ό', 'ύ', 'ώ', 'ϊ', 'ϋ'],
        ru: ['ё'],
        tt: ['ә', 'ө', 'ү', 'җ', 'ң', 'һ'],
        ba: ['ә', 'ө', 'ү', 'ғ', 'ҙ', 'ҡ', 'ң', 'ҫ', 'һ'],
        cv: ['ă', 'ĕ', 'ҫ', 'ӳ'],
        br: ['ñ', 'ê', 'â', 'ô', 'ù', 'ü'],
        hy: [],
        ka: [],
        en: []
    };

    const POLARITY_SYMBOLS = {
        positive: '➕',
        negative: '➖',
        question: '❓'
    };

    function getConfig(lang) {
        return TOP_VERB_CONFIGS[lang] || null;
    }

    function getAllConfigs() {
        return TOP_VERB_CONFIGS;
    }

    function isTopVerb(lang, lemma) {
        const cfg = getConfig(lang);
        if (!cfg) return false;
        const norm = String(lemma || '').trim().toLowerCase();
        return cfg.lemmas.some(l => l.toLowerCase() === norm);
    }

    function buildEnglishPresentObj(entry) {
        if (!entry) return null;
        if (entry.present_simple) {
            // entries may give one combined "he/she/it" form; the generators read he / she / it separately
            const ps = Object.assign({}, entry.present_simple);
            const third = ps['he/she/it'];
            if (third) { ps.he = ps.he || third; ps.she = ps.she || third; ps.it = ps.it || third; }
            return ps;
        }

        const base = entry.base || entry.lemma || 'be';
        if (base === 'be') {
            return { 'I': 'am', 'you': 'are', 'he': 'is', 'she': 'is', 'it': 'is', 'we': 'are', 'they': 'are', 'he/she/it': 'is' };
        }
        if (base === 'have') {
            return { 'I': 'have', 'you': 'have', 'he': 'has', 'she': 'has', 'it': 'has', 'we': 'have', 'they': 'have', 'he/she/it': 'has' };
        }
        const s3 = entry.third_person_singular || (base.endsWith('y') && !/[aeiou]y$/.test(base) ? base.slice(0, -1) + 'ies' : base + 's');
        return {
            'I': base,
            'you': base,
            'he': s3,
            'she': s3,
            'it': s3,
            'he/she/it': s3,
            'we': base,
            'they': base
        };
    }

    function findEntry(lang, dbMap, lemma) {
        if (!dbMap) return null;
        let entry = null;

        if (Array.isArray(dbMap)) {
            entry = dbMap.find(x =>
                x && (x.lemma === lemma || x.infinitive === lemma || x.verb === lemma || x.word === lemma || x.base === lemma || x.en_lemma === lemma)
            );
        } else {
            entry = dbMap[lemma] || Object.values(dbMap).find(x =>
                x && (x.lemma === lemma || x.infinitive === lemma || x.base === lemma || x.en_lemma === lemma || (x.usage_hint && x.usage_hint.includes(lemma)))
            );
        }

        if (!entry && lang === 'en' && EN_REGULAR_FALLBACKS[lemma]) {
            entry = EN_REGULAR_FALLBACKS[lemma];
        }
        if (!entry && lang === 'en') {
            entry = buildEnglishEntry(lemma);
        }
        if (!entry && lang === 'el' && (lemma === 'μου αρέσει' || lemma === 'αρέσω')) {
            entry = dbMap['αρέσω'] || (Array.isArray(dbMap) ? dbMap.find(x => x && x.lemma === 'αρέσω') : Object.values(dbMap).find(x => x && x.lemma === 'αρέσω'));
        }

        return entry || null;
    }

    function getTopVerbsPool(lang, dbMap, personFilter = 'both', selectedLemmas = null, polarityFilter = 'positive', targetMode = 'verb') {
        const cfg = getConfig(lang);
        if (!cfg || !dbMap) return [];
        const pool = [];

        const targetLemmas = (selectedLemmas && Array.isArray(selectedLemmas) && selectedLemmas.length > 0)
            ? selectedLemmas
            : cfg.lemmas;

        const pMap = PRONOUN_MAP[lang] || PRONOUN_MAP.en;
        const prefixRegex = /^(je\s+|j'|tu\s+|il\/elle\/on\s+|il\/elle\s+|nous\s+|vous\s+|ils\/elles\s+|io\s+|lui\/lei\s+|noi\s+|voi\s+|loro\s+|я\s+|ты\s+|он\/она\/оно\s+|он\/она\s+|мы\s+|вы\s+|они\s+|εγώ\s+|εσύ\s+|αυτός\/αυτή\/αυτό\s+|εμείς\s+|εσείς\s+|αυτοί\/αυτές\/αυτά\s+|eu\s+|ele\/ela\s+|nós\s+|vós\s+|eles\/elas\s+|ich\s+|du\s+|er\/sie\/es\s+|wir\s+|ihr\s+|sie\/Sie\s+|yo\s+|tú\s+|él\/ella\/usted\s+|nosotros\s+|vosotros\s+|ellos\/ellas\/ustedes\s+|мин\s+|син\s+|ол\/ул\s+|без\s+|сез\s+|алар\s+|беҙ\s+|һеҙ\s+|улар\s+|эпĕ\s+|эсĕ\s+|вăл\s+|эпир\s+|эсир\s+|вĕсем\s+|me\s+|te\s+|eñ\/hi\s+|ni\s+|c'hwi\s+|i\s+|ես\s+|դու\s+|նա\s+|մենք\s+|դուք\s+|նրանք\s+|მე\s+|შεν\s+|ის\s+|ჩვენ\s+|თქვენ\s+|ისინი\s+)/i;

        for (const lemma of targetLemmas) {
            const entry = findEntry(lang, dbMap, lemma);
            if (!entry || isPlaceholderEntry(entry)) continue;

            let baseForms = [];
            if (lang === 'en') {
                const formsObj = buildEnglishPresentObj(entry);
                if (formsObj) {
                    baseForms = [
                        formsObj['I'] || entry.base,
                        formsObj['you'] || entry.base,
                        formsObj['he'] || formsObj['she'] || formsObj['it'] || (entry.base + 's'),
                        formsObj['we'] || entry.base,
                        formsObj['they'] || entry.base
                    ];
                }
            } else {
                const tenses = entry.tenses || entry.conjugations || {};
                const presentKey = Object.keys(tenses).find(k =>
                    k === 'indicatif_present' || k === 'pres' || k === 'presente' || k === 'present' || k === 'präsens' || k.includes('pres')
                );
                if (presentKey) baseForms = tenses[presentKey] || [];
            }

            if (!baseForms || baseForms.length === 0) continue;

            let pronounIndices = [];
            if (personFilter === 'both' || personFilter === 'all' || personFilter === 'singular') {
                pMap.singular.forEach((pro, idx) => {
                    pronounIndices.push({ pronoun: pro, formIdx: pMap.singularIndices[idx] || 0 });
                });
            }
            if (personFilter === 'both' || personFilter === 'all' || personFilter === 'plural') {
                pMap.plural.forEach((pro, idx) => {
                    pronounIndices.push({ pronoun: pro, formIdx: pMap.pluralIndices[idx] || 3 });
                });
            }

            const activePol = (polarityFilter === 'mixed' || polarityFilter === 'all') ? 'positive' : polarityFilter;
            const activeTarget = (targetMode === 'mixed') ? 'verb' : targetMode;

            const tenseForms = pronounIndices.map(({ pronoun, formIdx }) => {
                let rawForm = baseForms[formIdx] || '';
                let cleanVerb = rawForm.replace(prefixRegex, '').trim();
                if (!cleanVerb) cleanVerb = lemma;

                if (activeTarget === 'pronoun') {
                    if (activePol === 'negative' && lang === 'fr') {
                        const startsVowel = /^[aeiouyàâéèêëîïôûù]/i.test(cleanVerb);
                        return `________ (${pronoun}) ${startsVowel ? "n'" : "ne "} ${cleanVerb} pas ➖`;
                    }
                    return `________ (${pronoun}) ${cleanVerb} ${POLARITY_SYMBOLS[activePol] || '➕'}`;
                }

                if (activePol === 'negative') {
                    if (lang === 'fr') {
                        const startsVowel = /^[aeiouyàâéèêëîïôûù]/i.test(cleanVerb);
                        return `${pronoun} ${startsVowel ? "n'" : "ne "}${cleanVerb} pas`;
                    } else if (lang === 'es') {
                        return `${pronoun} no ${cleanVerb}`;
                    } else if (lang === 'it') {
                        return `${pronoun} non ${cleanVerb}`;
                    } else if (lang === 'de') {
                        return `${pronoun} ${cleanVerb} nicht`;
                    } else if (lang === 'en') {
                        if (cleanVerb === 'am' || cleanVerb === 'are' || cleanVerb === 'is') {
                            return `${pronoun} ${cleanVerb} not`;
                        } else {
                            const aux = (pronoun === 'he' || pronoun === 'she' || pronoun === 'it') ? "doesn't" : "don't";
                            const baseVerb = (entry && (entry.base || entry.lemma)) || lemma;
                            return `${pronoun} ${aux} ${baseVerb}`;
                        }
                    }
                } else if (activePol === 'question') {
                    if (lang === 'fr') return `Est-ce que ${pronoun} ${cleanVerb} ❓`;
                    if (lang === 'es') return `¿${pronoun} ${cleanVerb} ❓`;
                }

                return `${pronoun} ${cleanVerb}`;
            });

            pool.push({
                type: 'conjugate',
                key: `${lemma}:top_verbs_table:${personFilter}:${activePol}:${activeTarget}`,
                verbKey: lemma,
                tenseName: 'present_simple',
                entry: entry,
                data: entry,
                tenseForms: tenseForms,
                progress: { masteryLevel: 1 },
                state: { masteryLevel: 1 },
                isDue: true,
                mastery: 1
            });
        }

        return pool;
    }

    function generateSingleDrills(lang, dbMap, personFilter = 'both', selectedLemmas = null, polarityFilter = 'positive', targetMode = 'verb') {
        const cfg = getConfig(lang);
        if (!cfg || !dbMap) return [];
        const drills = [];

        const targetLemmas = (selectedLemmas && Array.isArray(selectedLemmas) && selectedLemmas.length > 0)
            ? selectedLemmas
            : cfg.lemmas;

        const pMap = PRONOUN_MAP[lang] || PRONOUN_MAP.en;

        const polaritiesToGenerate = (polarityFilter === 'mixed' || polarityFilter === 'all')
            ? ['positive', 'negative', 'question']
            : [polarityFilter];

        const prefixRegex = /^(je\s+|j'|tu\s+|il\/elle\/on\s+|il\/elle\s+|nous\s+|vous\s+|ils\/elles\s+|io\s+|lui\/lei\s+|noi\s+|voi\s+|loro\s+|я\s+|ты\s+|он\/она\/оно\s+|он\/она\s+|мы\s+|вы\s+|они\s+|εγώ\s+|εσύ\s+|αυτός\/αυτή\/αυτό\s+|εμείς\s+|εσείς\s+|αυτοί\/αυτές\/αυτά\s+|eu\s+|ele\/ela\s+|nós\s+|vós\s+|eles\/elas\s+|ich\s+|du\s+|er\/sie\/es\s+|wir\s+|ihr\s+|sie\/Sie\s+|yo\s+|tú\s+|él\/ella\/usted\s+|nosotros\s+|vosotros\s+|ellos\/ellas\/ustedes\s+|мин\s+|син\s+|ол\/ул\s+|без\s+|сез\s+|алар\s+|беҙ\s+|һеҙ\s+|улар\s+|эпĕ\s+|эсĕ\s+|вăл\s+|эпир\s+|эсир\s+|вĕсем\s+|me\s+|te\s+|eñ\/hi\s+|ni\s+|c'hwi\s+|i\s+|ես\s+|դու\s+|նա\s+|մենք\s+|դուք\s+|նրանք\s+|მე\s+|შεν\s+|ის\s+|ჩვენ\s+|თქვენ\s+|ისინი\s+)/i;

        for (const lemma of targetLemmas) {
            const entry = findEntry(lang, dbMap, lemma);
            if (!entry || isPlaceholderEntry(entry)) continue;

            const definition = entry.definition || entry.usage_hint || '';

            let forms = [];
            if (lang === 'en') {
                const formsObj = buildEnglishPresentObj(entry);
                if (formsObj) {
                    forms = [
                        formsObj['I'] || entry.base,
                        formsObj['you'] || entry.base,
                        formsObj['he'] || formsObj['she'] || formsObj['it'] || (entry.base + 's'),
                        formsObj['we'] || entry.base,
                        formsObj['they'] || entry.base
                    ];
                }
            } else {
                const tenses = entry.tenses || entry.conjugations || {};
                const presentKey = Object.keys(tenses).find(k =>
                    k === 'indicatif_present' || k === 'pres' || k === 'presente' || k === 'present' || k === 'präsens' || k.includes('pres')
                );
                if (presentKey) forms = tenses[presentKey] || [];
            }

            if (!forms || forms.length === 0) continue;

            const pronounEntries = [];
            if (personFilter === 'both' || personFilter === 'all' || personFilter === 'singular') {
                pMap.singular.forEach((pro, idx) => {
                    const formIdx = pMap.singularIndices[idx] || 0;
                    pronounEntries.push({ pronoun: pro, formIdx: formIdx, group: 'singular' });
                });
            }
            if (personFilter === 'both' || personFilter === 'all' || personFilter === 'plural') {
                pMap.plural.forEach((pro, idx) => {
                    const formIdx = pMap.pluralIndices[idx] || 3;
                    pronounEntries.push({ pronoun: pro, formIdx: formIdx, group: 'plural' });
                });
            }

            pronounEntries.forEach(({ pronoun, formIdx }) => {
                let rawForm = forms[formIdx] || '';
                let cleanVerb = rawForm.replace(prefixRegex, '').trim();
                if (!cleanVerb) cleanVerb = lemma;

                polaritiesToGenerate.forEach(pol => {
                    if (lang === 'fr' && pol === 'question' && (pronoun === 'je' || pronoun === "j'")) {
                        return;
                    }

                    const polSymbol = POLARITY_SYMBOLS[pol] || '➕';
                    const isFrenchNeg = (lang === 'fr' && pol === 'negative');
                    const mnemonicHint = isFrenchNeg ? "🥪 Règle du sandwich : ne/n' + verbe + pas" : null;

                    const targets = (targetMode === 'mixed') ? ['verb', 'pronoun'] : [targetMode];

                    targets.forEach(tMode => {
                        let promptText = '';
                        let expectedAnswer = '';

                        if (tMode === 'pronoun') {
                            if (pol === 'negative' && lang === 'fr') {
                                const startsVowel = /^[aeiouyàâéèêëîïôûù]/i.test(cleanVerb);
                                promptText = `________ ${startsVowel ? "n'" : "ne "} ${cleanVerb} pas ➖ (${lemma})`;
                            } else if (pol === 'question' && lang === 'fr') {
                                promptText = `Est-ce que ________ ${cleanVerb} ❓ ? (${lemma})`;
                            } else if (pol === 'negative' && (lang === 'es' || lang === 'it')) {
                                promptText = `________ non/no ${cleanVerb} ➖ (${lemma})`;
                            } else {
                                promptText = `________ ${cleanVerb} ${polSymbol} (${lemma})`;
                            }
                            expectedAnswer = pronoun;
                        } else {
                            if (pol === 'negative') {
                                if (lang === 'fr') {
                                    const startsVowel = /^[aeiouyàâéèêëîïôûù]/i.test(cleanVerb);
                                    promptText = `${pronoun} ________ ➖ (${lemma})`;
                                    expectedAnswer = `${startsVowel ? "n'" : "ne "}${cleanVerb} pas`;
                                } else if (lang === 'es') {
                                    promptText = `${pronoun} ________ ➖ (${lemma})`;
                                    expectedAnswer = `no ${cleanVerb}`;
                                } else if (lang === 'it') {
                                    promptText = `${pronoun} ________ ➖ (${lemma})`;
                                    expectedAnswer = `non ${cleanVerb}`;
                                } else if (lang === 'de') {
                                    promptText = `${pronoun} ________ ➖ (${lemma})`;
                                    expectedAnswer = `${cleanVerb} nicht`;
                                } else if (lang === 'en') {
                                    promptText = `${pronoun} ________ ➖ (${lemma})`;
                                    if (cleanVerb === 'am' || cleanVerb === 'are' || cleanVerb === 'is') {
                                        expectedAnswer = `${cleanVerb} not`;
                                    } else {
                                        const aux = (pronoun === 'he' || pronoun === 'she' || pronoun === 'it') ? "doesn't" : "don't";
                                        const baseVerb = (entry && (entry.base || entry.lemma)) || lemma;
                                        expectedAnswer = `${aux} ${baseVerb}`;
                                    }
                                } else {
                                    promptText = `${pronoun} ________ ➖ (${lemma})`;
                                    expectedAnswer = cleanVerb;
                                }
                            } else if (pol === 'question') {
                                if (lang === 'fr') {
                                    promptText = `Est-ce que ${pronoun} ________ ❓ (${lemma})`;
                                    expectedAnswer = cleanVerb;
                                } else if (lang === 'es') {
                                    promptText = `¿${pronoun} ________ ❓ (${lemma})`;
                                    expectedAnswer = cleanVerb;
                                } else if (lang === 'en') {
                                    promptText = `________ ${pronoun} ${lemma} ❓`;
                                    if (cleanVerb === 'am' || cleanVerb === 'are' || cleanVerb === 'is') {
                                        expectedAnswer = cleanVerb;
                                    } else {
                                        expectedAnswer = (pronoun === 'he' || pronoun === 'she' || pronoun === 'it') ? "does" : "do";
                                    }
                                } else {
                                    promptText = `${pronoun} ________ ❓ (${lemma})`;
                                    expectedAnswer = cleanVerb;
                                }
                            } else {
                                promptText = `${pronoun} ________ ➕ (${lemma})`;
                                expectedAnswer = cleanVerb;
                            }
                        }

                        drills.push({
                            id: `top10:${lang}:${lemma}:${pronoun}:${pol}:${tMode}`,
                            lang: lang,
                            lemma: lemma,
                            pronoun: pronoun,
                            polarity: pol,
                            symbol: polSymbol,
                            targetMode: tMode,
                            expected: expectedAnswer,
                            prompt: promptText,
                            definition: definition,
                            mnemonic: mnemonicHint,
                            accents: ACCENT_KEYS[lang] || []
                        });
                    });
                });
            });
        }

        return drills;
    }

    /**
     * Some data files still contain auto-generated stand-in entries ("Verb form for think",
     * "Example sentence for ...", all six present forms equal to the infinitive). Drilling them would
     * ask learners to type the infinitive for every pronoun, so they are skipped until real
     * conjugations exist.
     */
    function isPlaceholderEntry(entry) {
        if (!entry) return true;
        if (/^Verb form for/i.test(entry.definition || '')) return true;
        if ((entry.examples || []).some(x => /^Example sentence for/i.test(x))) return true;
        const t = entry.tenses || {};
        const present = t.present || t.pres || entry.present || [];
        return present.length >= 3 && new Set(present).size <= 1;
    }


    // ------------------------------------------------------------------------------------------
    // Top 10 verbs, parts 2 and 3 (part 1 is defined above as `groups`).
    // Each part has 10 numbered groups; a group can hold several verbs ("if they differ").
    //  part 2: do/make | speak/talk/say/tell | look/watch/see | listen/hear | must/have to/should |
    //          come/leave | take/give | ask/answer | wait | live
    //  part 3: pay/buy | remember/forget | feel | meet | decide/solve | spend/waste | send/get |
    //          help | call/text | agree/disagree
    // Resolution happens at runtime against the loaded data (resolvePart): only verbs that really
    // have a conjugation are listed, so new data shows up without touching this file.
    //  - languages with explicit lists (PART_LEMMAS) use them;
    //  - the others (data labelled with `en_lemma`) match the English concept names.
    // ------------------------------------------------------------------------------------------
    const PART_CONCEPTS = {
        2: [['do', 'make'], ['speak', 'talk', 'say', 'tell'], ['look', 'watch', 'see'], ['listen', 'hear'], ['must', 'have to', 'should'], ['come', 'leave'], ['take', 'give'], ['ask', 'answer'], ['wait'], ['live']],
        3: [['pay', 'buy'], ['remember', 'forget'], ['feel'], ['meet'], ['decide', 'solve'], ['spend', 'waste'], ['send', 'get'], ['help'], ['call', 'text'], ['agree', 'disagree']]
    };
    const PART_LEMMAS = {
        en: PART_CONCEPTS,
        fr: { 2: [['faire'], ['parler', 'dire', 'raconter'], ['regarder', 'voir'], ['écouter', 'entendre'], ['devoir', 'falloir'], ['venir', 'partir'], ['prendre', 'donner'], ['demander', 'répondre'], ['attendre'], ['vivre', 'habiter']],
              3: [['payer', 'acheter'], ['se souvenir', 'oublier'], ['sentir'], ['rencontrer'], ['décider', 'résoudre'], ['dépenser', 'gaspiller'], ['envoyer', 'recevoir'], ['aider'], ['appeler'], ['accepter']] },
        it: { 2: [['fare'], ['parlare', 'dire', 'raccontare'], ['guardare', 'vedere'], ['ascoltare', 'sentire'], ['dovere'], ['venire', 'partire'], ['prendere', 'dare'], ['chiedere', 'rispondere'], ['aspettare'], ['vivere', 'abitare']],
              3: [['pagare', 'comprare'], ['ricordare', 'dimenticare'], ['sentire'], ['incontrare'], ['decidere', 'risolvere'], ['spendere', 'sprecare'], ['inviare', 'ricevere'], ['aiutare'], ['chiamare'], ['accettare']] },
        pt: { 2: [['fazer'], ['falar', 'dizer', 'contar'], ['olhar', 'ver'], ['ouvir', 'escutar'], ['dever'], ['vir', 'partir'], ['pegar', 'dar'], ['perguntar', 'responder'], ['esperar'], ['viver', 'morar']],
              3: [['pagar', 'comprar'], ['lembrar', 'esquecer'], ['sentir'], ['encontrar'], ['decidir', 'resolver'], ['gastar', 'desperdiçar'], ['enviar', 'receber'], ['ajudar'], ['chamar'], ['concordar']] },
        es: { 2: [['hacer'], ['hablar', 'decir', 'contar'], ['mirar', 'ver'], ['escuchar', 'oír'], ['deber'], ['venir', 'salir'], ['tomar', 'dar'], ['preguntar', 'responder'], ['esperar'], ['vivir']],
              3: [['pagar', 'comprar'], ['recordar', 'olvidar'], ['sentir'], ['encontrar'], ['decidir', 'resolver'], ['gastar', 'desperdiciar'], ['enviar', 'recibir'], ['ayudar'], ['llamar'], ['aceptar']] },
        de: { 2: [['tun', 'machen'], ['sprechen', 'reden', 'sagen', 'erzählen'], ['sehen', 'schauen'], ['hören', 'zuhören'], ['müssen', 'sollen'], ['kommen', 'verlassen'], ['nehmen', 'geben'], ['fragen', 'antworten'], ['warten'], ['leben', 'wohnen']],
              3: [['bezahlen', 'kaufen'], ['erinnern', 'vergessen'], ['fühlen'], ['treffen'], ['entscheiden', 'lösen'], ['ausgeben', 'verschwenden'], ['senden', 'bekommen'], ['helfen'], ['anrufen'], ['zustimmen']] },
        ru: { 2: [['делать'], ['говорить', 'рассказывать'], ['смотреть', 'видеть'], ['слушать', 'слышать'], ['должен'], ['приходить', 'уходить'], ['брать', 'давать'], ['спрашивать', 'отвечать'], ['ждать'], ['жить']],
              3: [['платить', 'покупать'], ['помнить', 'забывать'], ['чувствовать'], ['встречать', 'встречаться'], ['решать'], ['тратить'], ['отправлять', 'получать'], ['помогать'], ['звонить'], ['соглашаться']] },
        // Georgian: the real conjugations sit under third-person headwords and carry no en_lemma
        ka: { 2: [['აკეთებს'], ['ლაპარაკობს', 'ამბობს'], ['უყურებს'], ['უსმენს', 'ესმის'], [], [], ['იღებს', 'აძლევს'], ['ეკითხება', 'პასუხობს'], ['ელოდება'], ['ცხოვრობს']],
              3: [[], [], [], [], [], [], [], [], [], []] },
        el: { 2: [['κάνω'], ['μιλάω', 'λέω'], ['κοιτάζω', 'βλέπω'], ['ακούω'], ['πρέπει'], ['έρχομαι', 'φεύγω'], ['παίρνω', 'δίνω'], ['ρωτάω', 'απαντάω'], ['περιμένω'], ['ζω', 'μένω']],
              3: [['πληρώνω', 'αγοράζω'], ['θυμάμαι', 'ξεχνάω'], ['νιώθω'], ['συναντώ'], ['αποφασίζω', 'λύνω'], ['ξοδεύω', 'σπαταλώ'], ['στέλνω', 'λαμβάνω'], ['βοηθάω'], ['τηλεφωνώ'], ['συμφωνώ']] }
    };

    /** True when the entry has a present tense the drills can use (perfective Russian verbs have none). */
    function hasPresentForms(lang, entry) {
        if (!entry) return false;
        if (lang === 'en') return !!buildEnglishPresentObj(entry);
        const tenses = entry.tenses || entry.conjugations || {};
        const key = Object.keys(tenses).find(k =>
            k === 'indicatif_present' || k === 'pres' || k === 'presente' || k === 'present' || k === 'präsens' || k.includes('pres'));
        const forms = key ? tenses[key] : null;
        return Array.isArray(forms) && forms.some(f => typeof f === 'string' && f.trim());
    }

    /**
     * The 10 groups of a part for the loaded data, keeping only verbs that exist and are not
     * placeholders. Part 1 is the fixed set from getConfig(lang).groups.
     */
    function resolvePart(lang, dbMap, part) {
        const cfg = getConfig(lang);
        if (!cfg) return { groups: [], lemmas: [] };
        let groups;
        if (Number(part) === 1) {
            groups = cfg.groups.map(g => g.slice());
        } else {
            const explicit = PART_LEMMAS[lang] && PART_LEMMAS[lang][part];
            const entries = Array.isArray(dbMap) ? dbMap.map(e => [e && e.lemma, e]) : Object.entries(dbMap || {});
            groups = (explicit || PART_CONCEPTS[part]).map(slot => {
                const found = [];
                slot.forEach(item => {
                    if (explicit) {
                        const e = findEntry(lang, dbMap, item);
                        if (e && !isPlaceholderEntry(e) && hasPresentForms(lang, e)) found.push(item);
                    } else {
                        entries.forEach(([key, e]) => {
                            if (e && e.en_lemma === item && !isPlaceholderEntry(e) && hasPresentForms(lang, e) && !found.includes(key)) found.push(key);
                        });
                    }
                });
                return found;
            });
        }
        return { groups, lemmas: groups.reduce((a, g) => a.concat(g), []) };
    }

    /** Group number (1-10) of each verb of `lang`, parallel to getConfig(lang).lemmas. */
    function getGroups(lang) {
        const cfg = getConfig(lang);
        if (!cfg) return [];
        const out = [];
        cfg.groups.forEach((g, i) => g.forEach(() => out.push(i + 1)));
        return out;
    }

    return {
        getConfig,
        getGroups,
        resolvePart,
        PART_CONCEPTS,
        PART_LEMMAS,
        isPlaceholderEntry,
        getAllConfigs,
        isTopVerb,
        findEntry,
        buildEnglishPresentObj,
        getTopVerbsPool,
        generateSingleDrills,
        PRONOUN_MAP,
        ACCENT_KEYS,
        POLARITY_SYMBOLS,
        EN_REGULAR_FALLBACKS
    };
}));
