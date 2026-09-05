const fs = require('fs');
const path = require('path');
const assert = require('assert');

const verbsPath = path.join(__dirname, '..', 'fr-conjugeur', 'data', 'verbs.json');
const verbs = JSON.parse(fs.readFileSync(verbsPath, 'utf8'));

// Canonical tense ID mapping from engine.js
const tenseIdMap = {
    indicatif_present: "pres",
    indicatif_imparfait: "imp",
    indicatif_futur_simple: "fut",
    conditionnel_present: "cond",
    cond_pass: "cond_pass",
    subjonctif_present: "subj",
    subj_pass: "subj_pass",
    pqp: "pqp",
    fut_ant: "fut_ant",
    imperatif: "impv",
    part: "part",
    pc: "pc"
};

const allowedKeys = new Set(Object.keys(tenseIdMap));

let totalVerbs = 0;
let checkedTenses = 0;

for (const [verb, data] of Object.entries(verbs)) {
    totalVerbs++;
    assert(data.tenses, `Verb "${verb}" is missing 'tenses' object`);

    const targetIdMap = new Map();

    for (const [tenseKey, forms] of Object.entries(data.tenses)) {
        checkedTenses++;
        assert(allowedKeys.has(tenseKey), `Verb "${verb}" has unrecognized/non-canonical tense key "${tenseKey}"`);

        const targetId = tenseIdMap[tenseKey] || tenseKey;

        if (targetIdMap.has(targetId)) {
            const existing = targetIdMap.get(targetId);
            assert.fail(`Verb "${verb}" has duplicate keys mapping to rendered tense ID "${targetId}": "${existing.key}" and "${tenseKey}"`);
        }

        targetIdMap.set(targetId, { key: tenseKey, forms });
    }
}

console.log(`Assertion passed! Verified ${totalVerbs} verbs and ${checkedTenses} tenses in ${verbsPath}.`);
