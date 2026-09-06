const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const ALLOWED_LEVELS = new Set(['A1', 'A2', 'B1', 'B2', 'B2+']);

function scanDataFiles(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.git') continue;
            files = files.concat(scanDataFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.json') && fullPath.includes('/data/')) {
            files.push(fullPath);
        }
    }
    return files;
}

const dataFiles = scanDataFiles(rootDir);
console.log(`Checking CEFR levels in ${dataFiles.length} COSYtools data files...`);

let errors = 0;

function checkObjectForLevels(obj, filePath) {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
        obj.forEach(item => checkObjectForLevels(item, filePath));
        return;
    }

    if (obj.level !== undefined) {
        if (!ALLOWED_LEVELS.has(obj.level)) {
            console.error(`❌ Invalid level '${obj.level}' in ${filePath}`);
            errors++;
        }
    }

    Object.values(obj).forEach(val => {
        if (typeof val === 'object' && val !== null) {
            checkObjectForLevels(val, filePath);
        }
    });
}

dataFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf-8');
        const json = JSON.parse(content);
        checkObjectForLevels(json, file);
    } catch (err) {
        console.error(`❌ Failed to parse JSON in ${file}:`, err.message);
        errors++;
    }
});

if (errors > 0) {
    console.error(`\n❌ Found ${errors} level violations! COSYtools datasets are capped at A1-B2+.`);
    process.exit(1);
} else {
    console.log(`✅ All COSYtools datasets strictly observe the A1–B2+ level scheme!`);
}
