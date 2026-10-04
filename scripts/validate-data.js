const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Find all tool directories
function findToolDirectories(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === 'shared') return;
            const dataDir = path.join(fullPath, 'data');
            if (fs.existsSync(dataDir) && fs.statSync(dataDir).isDirectory()) {
                results.push(fullPath);
            }
            results = results.concat(findToolDirectories(fullPath));
        }
    });
    return [...new Set(results)];
}

const allToolDirs = findToolDirectories(path.join(ROOT_DIR, 'tools'));

let totalOffendingRecords = 0;
const toolFailureCounts = {};
const toolsWithoutVerbData = [];
const toolsWithoutNounData = [];

console.log('====================================================');
console.log('COSYtools Data Field & Schema Validation Audit');
console.log('====================================================\n');

allToolDirs.sort().forEach(toolDir => {
    const relToolDir = path.relative(ROOT_DIR, toolDir).replace(/\\/g, '/');
    const dataDir = path.join(toolDir, 'data');

    let hasVerbData = false;
    let hasNounData = false;

    const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'manifest.json');

    dataFiles.forEach(fileName => {
        const filePath = path.join(dataDir, fileName);
        const relFilePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');

        if (fileName === 'verbs.json') hasVerbData = true;
        if (fileName === 'nouns.json') hasNounData = true;

        let content;
        try {
            content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
            console.error(`[FAIL] ${relFilePath}: Invalid JSON syntax - ${err.message}`);
            totalOffendingRecords++;
            return;
        }

        let entries = [];
        if (Array.isArray(content)) {
            entries = content.map((item, idx) => ({ key: item.lemma || item.word || item.id || `index_${idx}`, val: item }));
        } else if (content && typeof content === 'object') {
            if (Array.isArray(content.units)) {
                entries = content.units.map((item, idx) => ({
                    key: item.lemma || item.headword || item.word || item.id || `unit_${idx}`,
                    val: item.data || item
                }));
            } else {
                entries = Object.entries(content)
                    .filter(([k]) => k !== 'language' && k !== 'version' && k !== 'meta')
                    .map(([k, v]) => ({ key: k, val: v }));
            }
        }

        entries.forEach(({ key, val }) => {
            const issues = [];

            if (!val || typeof val !== 'object') {
                issues.push('record is null or not an object');
            } else {
                // Check prepositions array & items
                if (val.prepositions !== undefined && !Array.isArray(val.prepositions)) {
                    issues.push(`'prepositions' must be an array (got ${typeof val.prepositions})`);
                } else if (Array.isArray(val.prepositions)) {
                    val.prepositions.forEach((p, pIdx) => {
                        if (typeof p !== 'string') {
                            issues.push(`prepositions[${pIdx}] is non-string (${typeof p}: ${JSON.stringify(p)})`);
                        }
                    });
                }

                // Check examples array & items
                if (val.examples !== undefined && !Array.isArray(val.examples)) {
                    issues.push(`'examples' must be an array (got ${typeof val.examples})`);
                } else if (Array.isArray(val.examples)) {
                    val.examples.forEach((ex, exIdx) => {
                        if (typeof ex !== 'string') {
                            issues.push(`examples[${exIdx}] is non-string (${typeof ex}: ${JSON.stringify(ex)})`);
                        }
                    });
                }

                // Check string fields passed to .replace() or string manipulation in engines
                ['definition', 'grammar_rule', 'common_mistake', 'pattern', 'level', 'transitivity', 'separability', 'related_forms', 'noun_parallel'].forEach(field => {
                    if (val[field] !== undefined && val[field] !== null && typeof val[field] !== 'string') {
                        issues.push(`'${field}' must be a string (got ${typeof val[field]}: ${JSON.stringify(val[field])})`);
                    }
                });
            }

            if (issues.length > 0) {
                console.error(`❌ [OFFENDING RECORD] File: ${relFilePath} | ID/Key: "${key}"`);
                issues.forEach(iss => console.error(`   - ${iss}`));
                totalOffendingRecords++;
                toolFailureCounts[relToolDir] = (toolFailureCounts[relToolDir] || 0) + 1;
            }
        });
    });

    if (!hasVerbData) toolsWithoutVerbData.push(relToolDir);
    if (!hasNounData) toolsWithoutNounData.push(relToolDir);
});

console.log('\n====================================================');
console.log('VALIDATION REPORT SUMMARY');
console.log('====================================================');
console.log(`Total offending records found: ${totalOffendingRecords}`);

console.log('\nOffending record counts per tool:');
if (Object.keys(toolFailureCounts).length === 0) {
    console.log('  None! (0 failing records)');
} else {
    Object.entries(toolFailureCounts).forEach(([t, count]) => {
        console.log(`  - ${t}: ${count} offending record(s)`);
    });
}

console.log('\nTools without any verb data (verbs.json):');
toolsWithoutVerbData.forEach(t => console.log(`  - ${t}`));

console.log('\nTools without any noun data (nouns.json):');
toolsWithoutNounData.forEach(t => console.log(`  - ${t}`));

if (totalOffendingRecords > 0) {
    console.error('\nData validation failed with offending records.');
    process.exit(1);
} else {
    console.log('\nData validation passed cleanly!');
    process.exit(0);
}
