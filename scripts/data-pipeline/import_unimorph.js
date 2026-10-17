const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const selectedLanguages = new Set(process.argv.slice(3));
const languageMap = {
    eng: 'en',
    fra: 'fr',
    deu: 'de',
    spa: 'es',
    ita: 'it',
    por: 'pt',
    rus: 'ru',
    ell: 'el',
    bak: 'ba',
    bre: 'br',
    hye: 'hy',
    kat: 'ka',
    tat: 'tt'
};
const limit = Number(process.argv[2] || 1000);

function readSource(languageCode) {
    const sourcePath = path.join('/tmp', `${languageCode}.tsv`);
    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Missing ${sourcePath}. Download the UniMorph source before importing.`);
    }
    return fs.readFileSync(sourcePath, 'utf8');
}

function collectExistingLemmas(language) {
    const lemmas = new Set();
    const dataRoot = path.join(repoRoot, 'tools', language);
    function visit(directory) {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory()) visit(fullPath);
            else if (entry.name.endsWith('.json') && entry.name !== 'lexicon.json' && entry.name !== 'morphology.json' && fullPath.includes(`${path.sep}data${path.sep}`)) {
                const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                Object.keys(data).forEach(lemma => lemmas.add(lemma.toLocaleLowerCase()));
            }
        }
    }
    visit(dataRoot);
    return lemmas;
}

function parseSource(languageCode, language) {
    const entries = new Map();
    const existing = collectExistingLemmas(language);
    for (const line of readSource(languageCode).split(/\r?\n/)) {
        if (!line.trim()) continue;
        const columns = line.split(/\s+/);
        if (columns.length < 3) continue;
        const [lemma, form, featureString] = columns;
        if (!lemma || !form || !featureString) continue;
        const features = featureString.split(';');
        const pos = features.find(feature => ['N', 'V', 'ADJ', 'ADV', 'DET', 'PRON'].includes(feature)) || 'OTHER';
        const key = `${lemma.toLocaleLowerCase()}\t${pos}`;
        if (!entries.has(key)) entries.set(key, { lemma, pos, forms: new Map(), existing: existing.has(lemma.toLocaleLowerCase()) });
        const entry = entries.get(key);
        const formKey = `${form}\t${featureString}`;
        entry.forms.set(formKey, { form, features });
    }
    return [...entries.values()]
        .sort((left, right) => Number(right.existing) - Number(left.existing) || right.forms.size - left.forms.size || left.lemma.localeCompare(right.lemma))
        .slice(0, limit)
        .map(entry => ({
            lemma: entry.lemma,
            pos: entry.pos,
            forms: [...entry.forms.values()].sort((left, right) => left.form.localeCompare(right.form)),
            source: 'UniMorph',
            source_url: `https://github.com/unimorph/${languageCode}`
        }));
}

for (const [languageCode, language] of Object.entries(languageMap)) {
    if (selectedLanguages.size > 0 && !selectedLanguages.has(language)) continue;
    const units = parseSource(languageCode, language);
    const outputPath = path.join(repoRoot, 'tools', language, 'data', 'morphology.json');
    fs.writeFileSync(outputPath, `${JSON.stringify({ language, units }, null, 2)}\n`, 'utf8');
    console.log(`${language}: imported ${units.length} morphological units`);
}