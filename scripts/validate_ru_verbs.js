const fs = require('fs');
const path = require('path');
const assert = require('assert');

const verbsPath = path.join(__dirname, '..', 'tools', 'ru', 'spryazhenie', 'data', 'verbs.json');
const verbs = JSON.parse(fs.readFileSync(verbsPath, 'utf8'));

let totalVerbs = 0;
let perfectiveVerbs = 0;
let imperfectiveVerbs = 0;

for (const [verb, data] of Object.entries(verbs)) {
    totalVerbs++;
    assert(data.group, `Verb ${verb} missing group`);
    assert(data.level, `Verb ${verb} missing level`);
    assert(data.definition !== undefined, `Verb ${verb} missing definition`);
    assert(data.tenses, `Verb ${verb} missing tenses object`);

    const isPerfective = data.group.includes("(СВ)") || data.group.startsWith("Совершенный вид");
    if (isPerfective) {
        perfectiveVerbs++;
        assert(!data.tenses.pres, `Perfective verb ${verb} must NOT have a "pres" key`);
        assert(Array.isArray(data.tenses.past) && data.tenses.past.length === 4, `Perfective verb ${verb} must have past array with 4 forms`);
        assert(Array.isArray(data.tenses.fut) && data.tenses.fut.length === 6, `Perfective verb ${verb} must have fut array with 6 forms`);
        assert(Array.isArray(data.tenses.impv) && (data.tenses.impv.length === 2 || (data.tenses.impv.length === 1 && data.tenses.impv[0] === '—')), `Perfective verb ${verb} must have impv array with 2 forms or ["—"]`);
    } else {
        imperfectiveVerbs++;
        assert(Array.isArray(data.tenses.pres) && data.tenses.pres.length === 6, `Imperfective verb ${verb} must have pres array with 6 forms`);
    }
}

console.log(`Russian verb validation passed! Total verbs: ${totalVerbs} (Imperfective: ${imperfectiveVerbs}, Perfective: ${perfectiveVerbs})`);
