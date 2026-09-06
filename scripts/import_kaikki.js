const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const sources = [
    { language: 'br', name: 'Breton' },
    { language: 'cv', name: 'Chuvash' }
];
const allowedPartsOfSpeech = new Set(['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'determiner', 'conjunction', 'preposition']);

function getGloss(entry) {
    for (const sense of entry.senses || []) {
        const gloss = (sense.glosses || sense.raw_glosses || []).find(value => value && value.length > 2);
        if (gloss) return gloss;
    }
    return '';
}

function getGender(entry) {
    const tags = (entry.senses || []).flatMap(sense => sense.tags || []);
    if (tags.includes('masculine')) return 'Masculine';
    if (tags.includes('feminine')) return 'Feminine';
    if (tags.includes('neuter')) return 'Neuter';
    return null;
}

for (const source of sources) {
    const inputPath = path.join('/tmp', `kaikki-${source.name}.jsonl`);
    if (!fs.existsSync(inputPath)) throw new Error(`Missing ${inputPath}`);

    const units = new Map();
    for (const line of fs.readFileSync(inputPath, 'utf8').split(/\r?\n/)) {
        if (!line.trim()) continue;
        const entry = JSON.parse(line);
        const word = entry.word && entry.word.trim();
        const gloss = getGloss(entry);
        if (!word || !gloss || !allowedPartsOfSpeech.has(entry.pos)) continue;
        if (word.length < 2 || word !== word.toLocaleLowerCase()) continue;
        if (units.has(word)) continue;

        const forms = [...new Set((entry.forms || []).map(form => form.form).filter(Boolean))];
        units.set(word, {
            lemma: word,
            pos: entry.pos,
            definition: gloss,
            gender: entry.pos === 'noun' ? getGender(entry) : null,
            forms,
            source: 'Kaikki/Wiktionary',
            source_url: `https://kaikki.org/dictionary/${source.name}/`
        });
    }

    const outputPath = path.join(repoRoot, 'tools', source.language, 'data', 'kaikki.json');
    const selected = [...units.values()].slice(0, 1000);
    fs.writeFileSync(outputPath, `${JSON.stringify({ language: source.language, units: selected }, null, 2)}\n`, 'utf8');
    console.log(`${source.language}: imported ${selected.length} lexical units from Kaikki`);
}