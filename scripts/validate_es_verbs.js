const fs = require('fs');
const path = require('path');
const assert = require('assert');

const verbsPath = path.join(__dirname, '..', 'tools', 'es', 'conjugeur', 'data', 'verbs.json');
const verbs = JSON.parse(fs.readFileSync(verbsPath, 'utf8'));

const requiredTenses6 = [
    'presente',
    'pasado',
    'preterito_imperfecto',
    'preterito_perfecto_compuesto',
    'futuro_simple',
    'condicional_simple',
    'subjuntivo_presente'
];

let totalVerbs = 0;

for (const [verb, data] of Object.entries(verbs)) {
    totalVerbs++;
    assert(data.group, `Verb ${verb} missing group`);
    assert(data.level, `Verb ${verb} missing level`);
    assert(data.definition, `Verb ${verb} missing definition`);
    assert(Array.isArray(data.examples), `Verb ${verb} missing examples array`);
    assert(data.tenses, `Verb ${verb} missing tenses object`);

    for (const tenseKey of requiredTenses6) {
        const forms = data.tenses[tenseKey];
        assert(Array.isArray(forms), `Verb ${verb} missing tense array ${tenseKey}`);
        assert.strictEqual(forms.length, 6, `Verb ${verb} tense ${tenseKey} does not have 6 forms (has ${forms.length})`);
        forms.forEach((f, idx) => {
            assert(typeof f === 'string' && f.trim().length > 0, `Verb ${verb} tense ${tenseKey} form ${idx} is invalid: ${f}`);
        });
    }

    // Check imperativo
    const impv = data.tenses.imperativo;
    assert(Array.isArray(impv), `Verb ${verb} missing imperativo array`);
    assert.strictEqual(impv.length, 4, `Verb ${verb} imperativo does not have 4 forms (has ${impv.length})`);
    impv.forEach((f, idx) => {
        assert(typeof f === 'string' && f.trim().length > 0, `Verb ${verb} imperativo form ${idx} is invalid: ${f}`);
    });
}

console.log(`Validation successful! Verified all ${totalVerbs} verbs in ${verbsPath}.`);
