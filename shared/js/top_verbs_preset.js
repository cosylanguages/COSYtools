/**
 * COSYlanguages Shared Top Verbs Preset Configuration & Helpers
 * Supports instant practice for top core verbs (be, have, think, know, like, want, work, study, go, can, eat, drink)
 * in present tense across all 14 COSY target languages.
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

    function getTopVerbsPool(lang, dbMap) {
        const cfg = getConfig(lang);
        if (!cfg || !dbMap) return [];
        const pool = [];

        for (const lemma of cfg.lemmas) {
            const entry = dbMap[lemma] || Object.values(dbMap).find(x => x && x.lemma === lemma);
            if (!entry) continue;

            if (lang === 'en' && entry.present_simple) {
                const formsObj = entry.present_simple;
                const pronouns = ['I', 'you', 'he/she/it', 'we', 'they'];
                const forms = pronouns.map(p => `${p} ${formsObj[p] || entry.base}`);
                pool.push({
                    type: 'conjugate',
                    key: `${lemma}:present_simple`,
                    verbKey: lemma,
                    tenseName: 'present_simple',
                    entry: entry,
                    data: entry,
                    tenseForms: forms,
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
            const forms = tenses[presentKey];
            if (!forms || (Array.isArray(forms) && forms.length === 0)) continue;

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

    return {
        getConfig,
        getAllConfigs,
        isTopVerb,
        getTopVerbsPool
    };
}));
