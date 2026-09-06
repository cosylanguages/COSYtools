const fs = require('fs');
const path = require('path');

const toolsRoot = path.join(__dirname, '..', 'tools');

function collectDataFiles(directory) {
    const files = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectDataFiles(fullPath));
        } else if (entry.name.endsWith('.json') && !['lexicon.json', 'morphology.json', 'kaikki.json'].includes(entry.name) && fullPath.includes(`${path.sep}data${path.sep}`)) {
            files.push(fullPath);
        }
    }
    return files;
}

function getDataKind(filePath) {
    const name = path.basename(filePath, '.json');
    if (name === 'verbs' || name === 'nouns' || name === 'adjectives') return name;
    return 'lexical';
}

for (const entry of fs.readdirSync(toolsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const language = entry.name;
    const languageRoot = path.join(toolsRoot, language);
    const entries = [];
    const seen = new Set();

    for (const filePath of collectDataFiles(languageRoot)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const kind = getDataKind(filePath);
        const source = path.relative(path.join(__dirname, '..'), filePath).replaceAll(path.sep, '/');

        for (const [lemma, record] of Object.entries(data)) {
            const key = `${kind}:${lemma.toLocaleLowerCase()}`;
            if (seen.has(key)) continue;
            seen.add(key);
            entries.push({ lemma, kind, source, data: record });
        }
    }

    entries.sort((left, right) => `${left.kind}:${left.lemma}`.localeCompare(`${right.kind}:${right.lemma}`));
    const outputPath = path.join(languageRoot, 'data', 'lexicon.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify({ language, units: entries }, null, 2)}\n`, 'utf8');
    console.log(`${language}: wrote ${entries.length} units to ${path.relative(process.cwd(), outputPath)}`);
}