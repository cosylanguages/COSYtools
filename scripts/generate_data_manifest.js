const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const toolsDir = path.join(ROOT_DIR, 'tools');
const sharedDataDir = path.join(ROOT_DIR, 'shared', 'data');

if (!fs.existsSync(sharedDataDir)) {
    fs.mkdirSync(sharedDataDir, { recursive: true });
}

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
