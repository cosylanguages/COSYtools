const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const toolsDir = path.join(ROOT_DIR, 'tools');
const sharedDataDir = path.join(ROOT_DIR, 'shared', 'data');

if (!fs.existsSync(sharedDataDir)) {
    fs.mkdirSync(sharedDataDir, { recursive: true });
}

// Sub-tools to check for by-group shards
const conjugationTools = [
    'en/irregular-verbs',
    'fr/conjugeur',
    'it/coniugatore',
    'ru/spryazhenie',
    'el/klisi-rimaton'
];

// Rebuild master verbs.json from by-group shards if available
conjugationTools.forEach(relPath => {
    const dataDir = path.join(toolsDir, relPath, 'data');
    const groupDir = path.join(dataDir, 'by-group');
    if (fs.existsSync(groupDir)) {
        const groupFiles = fs.readdirSync(groupDir).filter(f => f.endsWith('.json')).sort();
        const mergedVerbs = {};
        groupFiles.forEach(gf => {
            const content = JSON.parse(fs.readFileSync(path.join(groupDir, gf), 'utf8'));
            Object.assign(mergedVerbs, content);
        });
        const masterPath = path.join(dataDir, 'verbs.json');
        fs.writeFileSync(masterPath, JSON.stringify(mergedVerbs, null, 2) + '\n', 'utf8');
        console.log(`Synced ${Object.keys(mergedVerbs).length} verbs for ${relPath} from ${groupFiles.length} group shards into verbs.json`);
    }
});

// Update global manifest
const languages = fs.readdirSync(toolsDir).filter(f => {
    return fs.statSync(path.join(toolsDir, f)).isDirectory();
}).sort();

const manifest = {};

languages.forEach(lang => {
    const dataDir = path.join(toolsDir, lang, 'data');
    manifest[lang] = {
        shards: fs.existsSync(path.join(dataDir, 'shards', 'index.json')),
        lexicon: fs.existsSync(path.join(dataDir, 'lexicon.json'))
    };
});

const outputPath = path.join(sharedDataDir, 'data-manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Generated ${outputPath} successfully for ${Object.keys(manifest).length} languages.`);
