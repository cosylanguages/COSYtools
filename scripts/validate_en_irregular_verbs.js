const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'en-irregular-verbs');

const filesToVerify = [
    'manifest.json',
    'index.html',
    'style.css',
    'data/verbs.json',
    'js/spaced_repetition.js',
    'js/practice.js',
    'js/dashboard.js',
    'js/engine.js'
];

console.log('Verifying en-irregular-verbs files...');

filesToVerify.forEach(relPath => {
    const fullPath = path.join(dir, relPath);
    if (!fs.existsSync(fullPath)) {
        console.error(`❌ Missing file: ${relPath}`);
        process.exit(1);
    }
    const stat = fs.statSync(fullPath);
    if (stat.size === 0) {
        console.error(`❌ Empty file: ${relPath}`);
        process.exit(1);
    }
    console.log(`  ✓ ${relPath} (${stat.size} bytes)`);
});

// Check root index.html link
const rootIndex = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
if (!rootIndex.includes('href="en-irregular-verbs/"')) {
    console.error(`❌ root index.html does not link to en-irregular-verbs/`);
    process.exit(1);
}
console.log('  ✓ root index.html link verified');

// Check README.md
const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf-8');
if (!readme.includes('en-irregular-verbs/')) {
    console.error(`❌ README.md does not mention en-irregular-verbs/`);
    process.exit(1);
}
console.log('  ✓ README.md reference verified');

console.log('✅ All end-to-end file checks passed!');
