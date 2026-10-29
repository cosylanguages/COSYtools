/**
 * COSYlanguages Shared Top Verbs Preset Configuration & Helpers
 * Supports instant practice for top core verbs (be, have, think, know, like, want, work, study, go, can, eat, drink)
 * in present tense across all 14 COSY target languages.
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
            plural: ['ni', 'c\'hwi', 'i'],
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
            singular: ['მე', 'შεν', 'ის'],
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
        if (entry.present_simple) return entry.present_simple;

        const base = entry.base || entry.lemma || 'be';
        if (base === 'be') {
            return { 'I': 'am', 'you': 'are', 'he': 'is', 'she': 'is', 'it': 'is', 'we': 'are', 'they': 'are' };
        }
        if (base === 'have') {
            return { 'I': 'have', 'you': 'have', 'he': 'has', 'she': 'has', 'it': 'has', 'we': 'have', 'they': 'have' };
        }
        const s3 = entry.third_person_singular || (base.endsWith('y') && !/[aeiou]y$/.test(base) ? base.slice(0, -1) + 'ies' : base + 's');
        return {
            'I': base,
            'you': base,
            'he': s3,
            'she': s3,
            'it': s3,
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
     * Generates granular single fill-in-the-blank practice items for each pronoun form,
     * sentence polarity (➕ Positive, ➖ Negative, ❓ Question), and target mode (type verb vs type pronoun).
     */
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

        const prefixRegex = /^(je\s+|j'|tu\s+|il\/elle\/on\s+|il\/elle\s+|nous\s+|vous\s+|ils\/elles\s+|io\s+|lui\/lei\s+|noi\s+|voi\s+|loro\s+|я\s+|ты\s+|он\/она\/оно\s+|он\/она\s+|мы\s+|вы\s+|они\s+|εγώ\s+|εσύ\s+|αυτός\/αυτή\/αυτό\s+|εμείς\s+|εσείς\s+|αυτοί\/αυτές\/αυτά\s+|eu\s+|ele\/ela\s+|nós\s+|vós\s+|eles\/elas\s+|ich\s+|du\s+|er\/sie\/es\s+|wir\s+|ihr\s+|sie\/Sie\s+|yo\s+|tú\s+|él\/ella\/usted\s+|nosotros\s+|vosotros\s+|ellos\/ellas\/ustedes\s+|мин\s+|син\s+|ол\/ул\s+|без\s+|сез\s+|алар\s+|беҙ\s+|һеҙ\s+|улар\s+|эпĕ\s+|эсĕ\s+|вăл\s+|эпир\s+|эсир\s+|вĕсем\s+|me\s+|te\s+|eñ\/hi\s+|ni\s+|c'hwi\s+|i\s+|ես\s+|դու\s+|նա\s+|մենք\s+|դուք\s+|նրանք\s+|მე\s+|შენ\s+|ის\s+|ჩვენ\s+|თქვენ\s+|ისინი\s+)/i;

        for (const lemma of targetLemmas) {
            const entry = findEntry(lang, dbMap, lemma);
            if (!entry) continue;

            const definition = entry.definition || entry.usage_hint || '';

            // Extract forms list
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

            // Generate items for singular/plural unmerged pronouns
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
                    // EXCLUSION RULE: Exclude 1st singular ("je") questions in French!
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
                            // User must type the PRONOUN
                            promptText = `________ ${cleanVerb} ${polSymbol} (${lemma})`;
                            expectedAnswer = pronoun;
                        } else {
                            // User must type the CONJUGATED VERB
                            if (pol === 'question' && lang === 'fr') {
                                promptText = `Est-ce que ${pronoun} ________ ${polSymbol} ? (${lemma})`;
                            } else if (pol === 'question' && lang === 'es') {
                                promptText = `¿${pronoun} ________ ${polSymbol} ? (${lemma})`;
                            } else {
                                promptText = `${pronoun} ________ ${polSymbol} (${lemma})`;
                            }
                            expectedAnswer = cleanVerb;
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

    return {
        getConfig,
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
