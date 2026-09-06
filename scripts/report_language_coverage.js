const fs = require('fs');
const path = require('path');

const toolsRoot = path.join(__dirname, '..', 'tools');
const languageCodes = fs.readdirSync(toolsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

function collectJsonFiles(directory) {
    const files = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectJsonFiles(fullPath));
        } else if (entry.name.endsWith('.json') && entry.name !== 'lexicon.json' && fullPath.includes(`${path.sep}data${path.sep}`)) {
            files.push(fullPath);
        }
    }
    return files;
}

for (const language of languageCodes) {
    const languageRoot = path.join(toolsRoot, language);
    const files = collectJsonFiles(languageRoot);
    const units = new Set();
    const fileCounts = [];

    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (Array.isArray(data.units)) {
            const lemmas = data.units.map(unit => unit.lemma).filter(Boolean);
            lemmas.forEach(lemma => units.add(lemma.toLocaleLowerCase()));
            fileCounts.push(`${path.relative(process.cwd(), file)}=${lemmas.length}`);
        } else {
            const keys = Object.keys(data);
            keys.forEach(key => units.add(key.toLocaleLowerCase()));
            fileCounts.push(`${path.relative(process.cwd(), file)}=${keys.length}`);
        }
    }

    const status = units.size >= 1000 ? 'READY' : `${1000 - units.size} remaining`;
    console.log(`${language}: ${units.size} unique units (${status})`);
    fileCounts.forEach(count => console.log(`  ${count}`));
}