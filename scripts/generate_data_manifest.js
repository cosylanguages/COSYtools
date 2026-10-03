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
        morphology: false,
        kaikki: false
    };
    if (fs.existsSync(dataDir)) {
        if (fs.existsSync(path.join(dataDir, 'morphology.json'))) {
            manifest[lang].morphology = true;
        }
        if (fs.existsSync(path.join(dataDir, 'kaikki.json'))) {
            manifest[lang].kaikki = true;
        }
    }
});

const outputPath = path.join(sharedDataDir, 'data-manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Generated ${outputPath} successfully for ${Object.keys(manifest).length} languages.`);
