const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'tools', 'en', 'irregular-verbs', 'data', 'verbs.json');

try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const db = JSON.parse(raw);

    const keys = Object.keys(db);
    console.log(`Checking ${keys.length} verbs in ${filePath}...`);

    if (keys.length < 180 || keys.length > 220) {
        console.error(`❌ Unexpected verb count: ${keys.length} (expected 180-220)`);
        process.exit(1);
    }

    const ALLOWED_PATTERNS = new Set([
        'no_change',
        'vowel_change',
        'same_past_participle',
        'totally_irregular',
        'add_en_or_n'
    ]);

    const ALLOWED_LEVELS = new Set(['A1', 'A2', 'B1', 'B2', 'B2+']);

    const REQUIRED_KEYS = [
        'base',
        'past_simple',
        'past_participle',
        'third_person_singular',
        'pattern_group',
        'level',
        'definition',
        'examples'
    ];

    let errors = 0;

    keys.forEach(key => {
        const verb = db[key];
        if (!verb) {
            console.error(`❌ Null entry for key: ${key}`);
            errors++;
            return;
        }

        if (verb.base !== key) {
            console.error(`❌ Key mismatch for '${key}': base is '${verb.base}'`);
            errors++;
        }

        REQUIRED_KEYS.forEach(reqKey => {
            if (!verb[reqKey]) {
                console.error(`❌ Verb '${key}' missing required key '${reqKey}'`);
                errors++;
            }
        });

        if (!ALLOWED_PATTERNS.has(verb.pattern_group)) {
            console.error(`❌ Verb '${key}' has invalid pattern_group: '${verb.pattern_group}'`);
            errors++;
        }

        if (!ALLOWED_LEVELS.has(verb.level)) {
            console.error(`❌ Verb '${key}' has invalid level: '${verb.level}'`);
            errors++;
        }

        if (!Array.isArray(verb.examples) || verb.examples.length !== 3) {
            console.error(`❌ Verb '${key}' must have exactly 3 example sentences`);
            errors++;
        } else {
            verb.examples.forEach((ex, idx) => {
                if (typeof ex !== 'string' || ex.trim().length === 0) {
                    console.error(`❌ Verb '${key}' example ${idx+1} is empty or not string`);
                    errors++;
                }
            });
        }
    });

    if (errors > 0) {
        console.error(`❌ Found ${errors} validation errors in verbs.json!`);
        process.exit(1);
    } else {
        console.log(`✅ All ${keys.length} verbs validated successfully! All schema requirements satisfied.`);
    }

} catch (err) {
    console.error('Failed to validate verbs.json:', err);
    process.exit(1);
}
