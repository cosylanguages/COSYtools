/**
 * COSYlanguages Shared Top Verbs Preset Configuration & Helpers
 * Supports instant practice for top core verbs (be, have, think, know, like, want, work, study, go, can, eat, drink)
 * in present tense across all 14 COSY target languages.
 * Includes Positive, Negative, and Interrogative (Question) form generation.
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
            lemmas: ['be', 'have', 'think', 'know', 'like', 'want', 'work', 'study', 'go', 'can', 'eat', 'drink'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        fr: {
            toolPath: 'tools/fr/conjugeur/',
            lemmas: ['être', 'avoir', 'penser', 'savoir', 'aimer', 'vouloir', 'travailler', 'étudier', 'aller', 'pouvoir', 'manger', 'boire'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        it: {
            toolPath: 'tools/it/coniugatore/',
            lemmas: ['essere', 'avere', 'pensare', 'sapere', 'piacere', 'volere', 'lavorare', 'studiare', 'andare', 'potere', 'mangiare', 'bere'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        ru: {
            toolPath: 'tools/ru/spryazhenie/',
            lemmas: ['иметь', 'думать', 'знать', 'нравиться', 'хотеть', 'работать', 'учиться', 'идти', 'мочь', 'есть', 'пить'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: true // быть omitted in present (zero copula)
        },
        el: {
            toolPath: 'tools/el/klisi-rimaton/',
            lemmas: ['είμαι', 'έχω', 'σκέφτομαι', 'ξέρω', 'μου αρέσει', 'θέλω', 'δουλεύω', 'διαβάζω', 'πηγαίνω', 'μπορώ', 'τρώω', 'πίνω'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        pt: {
            toolPath: 'tools/pt/conjugeur/',
            lemmas: ['ser', 'ter', 'pensar', 'saber', 'gostar', 'querer', 'trabalhar', 'estudar', 'ir', 'poder', 'comer', 'beber'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        de: {
            toolPath: 'tools/de/konjugation/',
            lemmas: ['sein', 'haben', 'denken', 'wissen', 'mögen', 'wollen', 'arbeiten', 'studieren', 'gehen', 'können', 'essen', 'trinken'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        es: {
            toolPath: 'tools/es/conjugeur/',
            lemmas: ['ser', 'tener', 'pensar', 'saber', 'gustar', 'querer', 'trabajar', 'estudiar', 'ir', 'poder', 'comer', 'beber'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        tt: {
            toolPath: 'tools/tt/conjugeur/',
            lemmas: ['булу', 'ия булу', 'уйлау', 'белү', 'ошату', 'теләү', 'эшләү', 'уку', 'бару', 'булдыру', 'ашау', 'эчү'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        ba: {
            toolPath: 'tools/ba/conjugeur/',
            lemmas: ['булыу', 'эйә булыу', 'уйлау', 'белеү', 'ошатыу', 'теләү', 'эшләү', 'уҡыу', 'барыу', 'булдырыу', 'ашау', 'эсеү'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        cv: {
            toolPath: 'tools/cv/conjugeur/',
            lemmas: ['пулни', 'пурни', 'шухăшлани', 'пĕлни', 'кăмăллани', 'кавашни', 'ĕçлев', 'вĕренни', 'кайни', 'пултару', 'ҫини', 'ӗҫни'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        br: {
            toolPath: 'tools/br/conjugeur/',
            lemmas: ['bout', 'kaout', 'soñjal', 'gouzout', 'plijout', 'follout', 'labourat', 'studiañ', 'mont', 'gallout', 'debriñ', 'evañ'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        hy: {
            toolPath: 'tools/hy/conjugeur/',
            lemmas: ['լինել', 'ունենալ', 'մտածել', 'իմացվել', 'դուր գալ', 'ուզել', 'աշխատել', 'սովորել', 'գնալ', 'կարողանալ', 'ուտել', 'խմել'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        },
        ka: {
            toolPath: 'tools/ka/conjugeur/',
            lemmas: ['ყოფნა', 'ყოლა', 'ფიქრი', 'ცოდნა', 'მოწონება', 'ნდომა', 'მუშაობა', 'სწავლა', 'სვლა', 'შეძლება', 'ჭამა', 'სმა'],
            supportsQuestions: true,
            supportsNegatives: true,
            excludePresentBe: false
        }
    };

    const EN_REGULAR_FALLBACKS = {
        'like': { base: 'like', lemma: 'like', level: 'A1', definition: 'to find pleasant or agreeable', present_simple: { 'I': 'like', 'you': 'like', 'he/she/it': 'likes', 'we': 'like', 'they': 'like' } },
        'want': { base: 'want', lemma: 'want', level: 'A1', definition: 'to desire or wish for', present_simple: { 'I': 'want', 'you': 'want', 'he/she/it': 'wants', 'we': 'want', 'they': 'want' } },
        'work': { base: 'work', lemma: 'work', level: 'A1', definition: 'to perform labor or activity', present_simple: { 'I': 'work', 'you': 'work', 'he/she/it': 'works', 'we': 'work', 'they': 'work' } },
        'study': { base: 'study', lemma: 'study', level: 'A1', definition: 'to acquire knowledge', present_simple: { 'I': 'study', 'you': 'study', 'he/she/it': 'studies', 'we': 'study', 'they': 'study' } },
        'can': { base: 'can', lemma: 'can', level: 'A1', definition: 'to be able to', present_simple: { 'I': 'can', 'you': 'can', 'he/she/it': 'can', 'we': 'can', 'they': 'can' } }
    };

    const PRONOUN_MAP = {
        en: {
            singular: ['I', 'you (sg)', 'he/she/it'],
            plural: ['we', 'you (pl)', 'they'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4]
        },
        fr: {
            singular: ['je', 'tu', 'il/elle/on'],
            plural: ['nous', 'vous', 'ils/elles'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        it: {
            singular: ['io', 'tu', 'lui/lei'],
            plural: ['noi', 'voi', 'loro'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        ru: {
            singular: ['я', 'ты', 'он/она/оно'],
            plural: ['мы', 'вы', 'они'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        el: {
            singular: ['εγώ', 'εσύ', 'αυτός/αυτή/αυτό'],
            plural: ['εμείς', 'εσείς', 'αυτοί/αυτές/αυτά'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        pt: {
            singular: ['eu', 'tu', 'ele/ela'],
            plural: ['nós', 'vós', 'eles/elas'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        de: {
            singular: ['ich', 'du', 'er/sie/es'],
            plural: ['wir', 'ihr', 'sie/Sie'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
        },
        es: {
            singular: ['yo', 'tú', 'él/ella/usted'],
            plural: ['nosotros', 'vosotros', 'ellos/ellas/ustedes'],
            singularIndices: [0, 1, 2],
            pluralIndices: [3, 4, 5]
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
            singular: ['me', 'te', 'eñ/hi'],
            plural: ['ni', 'c\'hwi', 'i'],
            singularIndices: [0, 1, 2],
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
        if (entry.present_simple) return entry.present_simple;

        const base = entry.base || entry.lemma || 'be';
        if (base === 'be') {
            return { 'I': 'am', 'you': 'are', 'he/she/it': 'is', 'we': 'are', 'they': 'are' };
        }
        if (base === 'have') {
            return { 'I': 'have', 'you': 'have', 'he/she/it': 'has', 'we': 'have', 'they': 'have' };
        }
        const s3 = entry.third_person_singular || (base.endsWith('y') && !/[aeiou]y$/.test(base) ? base.slice(0, -1) + 'ies' : base + 's');
        return {
            'I': base,
            'you': base,
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
        if (!entry && lang === 'el' && (lemma === 'μου αρέσει' || lemma === 'αρέσω')) {
            entry = dbMap['αρέσω'] || (Array.isArray(dbMap) ? dbMap.find(x => x && x.lemma === 'αρέσω') : Object.values(dbMap).find(x => x && x.lemma === 'αρέσω'));
        }

        return entry || null;
    }

    function filterFormsByPersons(lang, rawForms, personFilter) {
        if (!rawForms || rawForms.length === 0) return [];
        if (!personFilter || personFilter === 'both' || personFilter === 'all') return rawForms;

        const pMap = PRONOUN_MAP[lang] || PRONOUN_MAP.fr;
        const targetIndices = (personFilter === 'singular') ? pMap.singularIndices : pMap.pluralIndices;

        return targetIndices
            .filter(i => i < rawForms.length)
            .map(i => rawForms[i]);
    }

    /**
     * Builds negative or interrogative form variants for a given language, pronoun, and positive verb form.
     */
    function buildPolarityForm(lang, pronoun, positiveVerbForm, polarity, lemma) {
        if (polarity === 'positive' || !polarity) {
            return { promptText: `${pronoun} ________ (${lemma})`, expectedAnswer: positiveVerbForm };
        }

        const cleanVerb = String(positiveVerbForm || '').trim();

        if (lang === 'fr') {
            if (polarity === 'negative') {
                const startsWithVowel = /^[aeiouyhédèêàâîïôùû]/i.test(cleanVerb);
                const neParticle = startsWithVowel ? "n'" : "ne ";
                const negForm = `${neParticle}${cleanVerb} pas`;
                return { promptText: `${pronoun} ________ [ne...pas] (${lemma})`, expectedAnswer: negForm };
            }
            if (polarity === 'question') {
                const qPrompt = `Est-ce que ${pronoun} ________ ? (${lemma})`;
                return { promptText: qPrompt, expectedAnswer: cleanVerb };
            }
        }

        if (lang === 'en') {
            const isBe = (lemma === 'be' || cleanVerb === 'am' || cleanVerb === 'is' || cleanVerb === 'are');
            const isCan = (lemma === 'can');

            if (polarity === 'negative') {
                let negForm = '';
                if (isBe) {
                    negForm = `${cleanVerb} not`;
                } else if (isCan) {
                    negForm = `cannot`;
                } else {
                    const aux = (pronoun === 'he/she/it') ? 'does not' : 'do not';
                    negForm = `${aux} ${lemma}`;
                }
                return { promptText: `${pronoun} ________ [NOT] (${lemma})`, expectedAnswer: negForm };
            }

            if (polarity === 'question') {
                if (isBe) {
                    return { promptText: `${cleanVerb.toUpperCase()} ${pronoun} ________ ? (${lemma})`, expectedAnswer: cleanVerb };
                } else if (isCan) {
                    return { promptText: `CAN ${pronoun} ________ ? (${lemma})`, expectedAnswer: 'can' };
                } else {
                    const aux = (pronoun === 'he/she/it') ? 'Does' : 'Do';
                    return { promptText: `${aux} ${pronoun} ________ ? (${lemma})`, expectedAnswer: lemma };
                }
            }
        }

        if (lang === 'es') {
            if (polarity === 'negative') {
                return { promptText: `${pronoun} no ________ (${lemma})`, expectedAnswer: `no ${cleanVerb}` };
            }
            if (polarity === 'question') {
                return { promptText: `¿${pronoun} ________ ? (${lemma})`, expectedAnswer: cleanVerb };
            }
        }

        if (lang === 'it') {
            if (polarity === 'negative') {
                return { promptText: `${pronoun} non ________ (${lemma})`, expectedAnswer: `non ${cleanVerb}` };
            }
            if (polarity === 'question') {
                return { promptText: `${pronoun} ________ ? (${lemma})`, expectedAnswer: cleanVerb };
            }
        }

        if (lang === 'de') {
            if (polarity === 'negative') {
                return { promptText: `${pronoun} ________ nicht (${lemma})`, expectedAnswer: `${cleanVerb} nicht` };
            }
            if (polarity === 'question') {
                return { promptText: `${cleanVerb.toUpperCase()} ${pronoun} ________ ? (${lemma})`, expectedAnswer: cleanVerb };
            }
        }

        if (lang === 'ru') {
            if (polarity === 'negative') {
                return { promptText: `${pronoun} не ________ (${lemma})`, expectedAnswer: `не ${cleanVerb}` };
            }
            if (polarity === 'question') {
                return { promptText: `${pronoun} ________ ? (${lemma})`, expectedAnswer: cleanVerb };
            }
        }

        if (lang === 'el') {
            if (polarity === 'negative') {
                return { promptText: `${pronoun} δεν ________ (${lemma})`, expectedAnswer: `δεν ${cleanVerb}` };
            }
            if (polarity === 'question') {
                return { promptText: `${pronoun} ________ ; (${lemma})`, expectedAnswer: cleanVerb };
            }
        }

        if (lang === 'pt') {
            if (polarity === 'negative') {
                return { promptText: `${pronoun} não ________ (${lemma})`, expectedAnswer: `não ${cleanVerb}` };
            }
            if (polarity === 'question') {
                return { promptText: `${pronoun} ________ ? (${lemma})`, expectedAnswer: cleanVerb };
            }
        }

        // Default fallbacks for other target languages
        if (polarity === 'negative') {
            return { promptText: `${pronoun} [NEG] ________ (${lemma})`, expectedAnswer: cleanVerb };
        }
        if (polarity === 'question') {
            return { promptText: `${pronoun} ________ ? (${lemma})`, expectedAnswer: cleanVerb };
        }

        return { promptText: `${pronoun} ________ (${lemma})`, expectedAnswer: cleanVerb };
    }

    function getTopVerbsPool(lang, dbMap, personFilter = 'both', selectedLemmas = null) {
        const cfg = getConfig(lang);
        if (!cfg || !dbMap) return [];
        const pool = [];

        const targetLemmas = (selectedLemmas && Array.isArray(selectedLemmas) && selectedLemmas.length > 0)
            ? selectedLemmas
            : cfg.lemmas;

        for (const lemma of targetLemmas) {
            const entry = findEntry(lang, dbMap, lemma);
            if (!entry) continue;

            if (lang === 'en') {
                const formsObj = buildEnglishPresentObj(entry);
                if (!formsObj) continue;

                let rawForms = [
                    `I ${formsObj['I'] || entry.base}`,
                    `you ${formsObj['you'] || entry.base}`,
                    `he/she/it ${formsObj['he/she/it'] || entry.base + 's'}`,
                    `we ${formsObj['we'] || entry.base}`,
                    `they ${formsObj['they'] || entry.base}`
                ];

                if (personFilter === 'singular') {
                    rawForms = rawForms.slice(0, 3);
                } else if (personFilter === 'plural') {
                    rawForms = rawForms.slice(3, 5);
                }

                pool.push({
                    type: 'conjugate',
                    key: `${lemma}:present_simple`,
                    verbKey: lemma,
                    tenseName: 'present_simple',
                    entry: entry,
                    data: entry,
                    tenseForms: rawForms,
                    progress: { masteryLevel: 1 },
                    state: { masteryLevel: 1 },
                    isDue: true,
                    mastery: 1
                });
                continue;
            }

            const tenses = entry.tenses || entry.conjugations || {};
            const presentKey = Object.keys(tenses).find(k =>
                k === 'indicatif_present' ||
                k === 'pres' ||
                k === 'presente' ||
                k === 'present' ||
                k === 'präsens' ||
                k.includes('pres')
            );

            if (!presentKey) continue;
            let forms = tenses[presentKey];
            if (!forms || !Array.isArray(forms) || forms.length === 0) continue;

            forms = filterFormsByPersons(lang, forms, personFilter);

            pool.push({
                type: 'conjugate',
                key: `${lemma}:${presentKey}`,
                verbKey: lemma,
                tenseName: presentKey,
                entry: entry,
                data: entry,
                tenseForms: forms,
                progress: { masteryLevel: 1 },
                state: { masteryLevel: 1 },
                isDue: true,
                mastery: 1
            });
        }
        return pool;
    }

    /**
     * Generates granular single fill-in-the-blank practice items for each pronoun form, sentence polarity, and verb.
     */
    function generateSingleDrills(lang, dbMap, personFilter = 'both', selectedLemmas = null, polarityFilter = 'positive') {
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

        for (const lemma of targetLemmas) {
            const entry = findEntry(lang, dbMap, lemma);
            if (!entry) continue;

            const definition = entry.definition || entry.usage_hint || '';

            if (lang === 'en') {
                const formsObj = buildEnglishPresentObj(entry);
                if (!formsObj) continue;

                const items = [
                    { pronoun: 'I', form: formsObj['I'], group: 'singular', idx: 0 },
                    { pronoun: 'you', form: formsObj['you'], group: 'singular', idx: 1 },
                    { pronoun: 'he/she/it', form: formsObj['he/she/it'], group: 'singular', idx: 2 },
                    { pronoun: 'we', form: formsObj['we'], group: 'plural', idx: 3 },
                    { pronoun: 'they', form: formsObj['they'], group: 'plural', idx: 4 }
                ];

                for (const item of items) {
                    if (personFilter !== 'both' && personFilter !== 'all' && item.group !== personFilter) {
                        continue;
                    }

                    for (const pol of polaritiesToGenerate) {
                        const variant = buildPolarityForm('en', item.pronoun, item.form, pol, lemma);

                        drills.push({
                            id: `top10:en:${lemma}:${item.pronoun}:${pol}`,
                            lang: 'en',
                            lemma: lemma,
                            pronoun: item.pronoun,
                            polarity: pol,
                            expected: variant.expectedAnswer,
                            prompt: variant.promptText,
                            definition: definition,
                            accents: ACCENT_KEYS.en || []
                        });
                    }
                }
                continue;
            }

            const tenses = entry.tenses || entry.conjugations || {};
            const presentKey = Object.keys(tenses).find(k =>
                k === 'indicatif_present' ||
                k === 'pres' ||
                k === 'presente' ||
                k === 'present' ||
                k === 'präsens' ||
                k.includes('pres')
            );

            if (!presentKey) continue;
            const forms = tenses[presentKey];
            if (!forms || !Array.isArray(forms)) continue;

            const prefixRegex = /^(je\s+|j'|tu\s+|il\/elle\/on\s+|il\/elle\s+|nous\s+|vous\s+|ils\/elles\s+|io\s+|lui\/lei\s+|noi\s+|voi\s+|loro\s+|я\s+|ты\s+|он\/она\/оно\s+|он\/она\s+|мы\s+|вы\s+|они\s+|εγώ\s+|εσύ\s+|αυτός\/αυτή\/αυτό\s+|εμείς\s+|εσείς\s+|αυτοί\/αυτές\/αυτά\s+|eu\s+|ele\/ela\s+|nós\s+|vós\s+|eles\/elas\s+|ich\s+|du\s+|er\/sie\/es\s+|wir\s+|ihr\s+|sie\/Sie\s+|yo\s+|tú\s+|él\/ella\/usted\s+|nosotros\s+|vosotros\s+|ellos\/ellas\/ustedes\s+|мин\s+|син\s+|ол\/ул\s+|без\s+|сез\s+|алар\s+|беҙ\s+|һеҙ\s+|улар\s+|эпĕ\s+|эсĕ\s+|вăл\s+|эпир\s+|эсир\s+|вĕсем\s+|me\s+|te\s+|eñ\/hi\s+|ni\s+|c'hwi\s+|i\s+|ես\s+|դու\s+|նա\s+|մենք\s+|դուք\s+|նրանք\s+|მე\s+|შენ\s+|ის\s+|ჩვენ\s+|თქვენ\s+|ისინი\s+)/i;

            const singularLabels = pMap.singular || ['1s', '2s', '3s'];
            const pluralLabels = pMap.plural || ['1p', '2p', '3p'];

            forms.forEach((rawForm, idx) => {
                const isSingular = idx < 3;
                const group = isSingular ? 'singular' : 'plural';

                if (personFilter !== 'both' && personFilter !== 'all' && group !== personFilter) {
                    return;
                }

                let pronounLabel = isSingular ? (singularLabels[idx] || `Sg ${idx + 1}`) : (pluralLabels[idx - 3] || `Pl ${idx - 2}`);

                const match = rawForm.match(prefixRegex);
                if (match) {
                    pronounLabel = match[0].trim();
                }

                const cleanForm = rawForm.replace(prefixRegex, '').trim();

                for (const pol of polaritiesToGenerate) {
                    // EXCLUSION RULE: Exclude 1st singular ("je") questions in French!
                    if (lang === 'fr' && pol === 'question' && (pronounLabel === 'je' || pronounLabel === "j'" || idx === 0)) {
                        continue;
                    }

                    const variant = buildPolarityForm(lang, pronounLabel, cleanForm, pol, lemma);

                    drills.push({
                        id: `top10:${lang}:${lemma}:${idx}:${pol}`,
                        lang: lang,
                        lemma: lemma,
                        pronoun: pronounLabel,
                        polarity: pol,
                        expected: variant.expectedAnswer,
                        prompt: variant.promptText,
                        definition: definition,
                        accents: ACCENT_KEYS[lang] || []
                    });
                }
            });
        }

        return drills;
    }

    return {
        getConfig,
        getAllConfigs,
        isTopVerb,
        findEntry,
        buildEnglishPresentObj,
        getTopVerbsPool,
        generateSingleDrills,
        buildPolarityForm,
        PRONOUN_MAP,
        ACCENT_KEYS,
        EN_REGULAR_FALLBACKS
    };
}));
