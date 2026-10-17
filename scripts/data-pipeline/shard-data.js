const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const toolsDir = path.join(ROOT_DIR, 'tools');

function getFirstLetter(word) {
    if (!word) return 'other';
    const norm = String(word).normalize('NFC').toLowerCase().trim();
    if (!norm) return 'other';
    const char = norm.charAt(0);
    if (/[a-z0-9\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u0530-\u058F\u10A0-\u10FF]/i.test(char)) {
        return char;
    }
    return 'other';
}

function shardDataForLanguage(lang) {
    const dataDir = path.join(toolsDir, lang, 'data');
    if (!fs.existsSync(dataDir)) return;

    const sourceFiles = ['morphology.json', 'kaikki.json', 'lexicon.json'];
    const unitsByLetter = new Map();
    const allHeadwordsSet = new Set();
    const sourcesFound = {};

    for (const sourceFile of sourceFiles) {
        const filePath = path.join(dataDir, sourceFile);
        if (!fs.existsSync(filePath)) continue;

        sourcesFound[sourceFile.replace('.json', '')] = true;
        let fileContent;
        try {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(`Error parsing ${filePath}:`, e.message);
            continue;
        }

        const units = Array.isArray(fileContent) ? fileContent : (fileContent.units || []);

        for (const unit of units) {
            const lemma = unit.lemma || unit.headword || unit.word || unit.key || '';
            if (!lemma) continue;

            const normLemma = lemma.normalize('NFC').toLowerCase().trim();
            allHeadwordsSet.add(normLemma);

            const letter = getFirstLetter(normLemma);
            if (!unitsByLetter.has(letter)) {
                unitsByLetter.set(letter, []);
            }

            const taggedUnit = Object.assign({}, unit);
            if (!taggedUnit.source) {
                if (sourceFile === 'morphology.json') taggedUnit.source = 'UniMorph';
                else if (sourceFile === 'kaikki.json') taggedUnit.source = 'Kaikki/Wiktionary';
                else taggedUnit.source = 'COSYtools Lexicon';
            }

            unitsByLetter.get(letter).push(taggedUnit);
        }
    }

    if (unitsByLetter.size === 0) return;

    const shardsDir = path.join(dataDir, 'shards');
    if (!fs.existsSync(shardsDir)) {
        fs.mkdirSync(shardsDir, { recursive: true });
    }

    const availableLetters = Array.from(unitsByLetter.keys()).sort();

    for (const letter of availableLetters) {
        const shardUnits = unitsByLetter.get(letter);
        const shardPath = path.join(shardsDir, `${letter}.json`);
        const shardData = {
            language: lang,
            letter: letter,
            units: shardUnits
        };
        fs.writeFileSync(shardPath, JSON.stringify(shardData), 'utf8');
    }

    const sortedHeadwords = Array.from(allHeadwordsSet).sort();
    const indexPath = path.join(shardsDir, 'index.json');
    const indexData = {
        language: lang,
        letters: availableLetters,
        headwords: sortedHeadwords,
        sources: sourcesFound
    };
    fs.writeFileSync(indexPath, JSON.stringify(indexData), 'utf8');

    console.log(`Sharded ${lang}: ${sortedHeadwords.length} headwords into ${availableLetters.length} letter shards in tools/${lang}/data/shards/`);
}

function runSharding() {
    const langs = fs.readdirSync(toolsDir).filter(f => {
        return fs.statSync(path.join(toolsDir, f)).isDirectory();
    }).sort();

    for (const lang of langs) {
        shardDataForLanguage(lang);
    }
}

runSharding();
