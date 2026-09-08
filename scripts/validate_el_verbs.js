const fs = require('fs');
const path = require('path');
const assert = require('assert');

const verbsPath = path.join(__dirname, '..', 'tools', 'el', 'klisi-rimaton', 'data', 'verbs.json');
const verbs = JSON.parse(fs.readFileSync(verbsPath, 'utf8'));

const required6PersonTenses = [
    'pres',
    'imp',
    'aor',
    'fut',
    'perf',
    'subj',
    'cond',
    'pluperfect',
    'future_perfect'
];

let count = 0;

for (const [verb, data] of Object.entries(verbs)) {
    count++;
    assert(data.tenses, `Verb ${verb} missing tenses object`);

    for (const tenseKey of required6PersonTenses) {
        const forms = data.tenses[tenseKey];
        assert(Array.isArray(forms), `Verb ${verb} missing tense array ${tenseKey}`);
        assert.strictEqual(forms.length, 6, `Verb ${verb} tense ${tenseKey} length is ${forms.length}, expected 6`);
        forms.forEach((f, idx) => {
            assert(typeof f === 'string' && f.trim().length > 0, `Verb ${verb} tense ${tenseKey} form ${idx} is invalid`);
        });
    }

    const impv = data.tenses.impv;
    assert(Array.isArray(impv), `Verb ${verb} missing impv array`);
    assert.strictEqual(impv.length, 2, `Verb ${verb} impv length is ${impv.length}, expected 2`);
    impv.forEach((f, idx) => {
        assert(typeof f === 'string' && f.trim().length > 0, `Verb ${verb} impv form ${idx} is invalid`);
    });
}

console.log(`Validation passed! Verified ${count} Greek verbs and all required tenses.`);
