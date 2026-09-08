const fs = require('fs');
const path = require('path');

const verbsPath = path.join(__dirname, '..', 'tools', 'el', 'klisi-rimaton', 'data', 'verbs.json');
const verbs = JSON.parse(fs.readFileSync(verbsPath, 'utf8'));

// Auxiliaries for Pluperfect (υπερσυντέλικος)
const pluperfectAux = ["είχα", "είχες", "είχε", "είχαμε", "είχατε", "είχαν"];

// Auxiliaries for Future Perfect (συντελεσμένος μέλλοντας)
const futurePerfectAux = ["θα έχω", "θα έχεις", "θα έχει", "θα έχουμε", "θα έχετε", "θα έχουν"];

let countImpvFixed = 0;
let countPluperfectAdded = 0;
let countFuturePerfectAdded = 0;

for (const [verb, data] of Object.entries(verbs)) {
    if (!data.tenses) {
        throw new Error(`Verb ${verb} is missing tenses object`);
    }

    // 1. Check and add impv for πρέπει if missing
    if (!data.tenses.impv) {
        if (verb === 'πρέπει') {
            data.tenses.impv = ["πρέπει!", "πρέπει!"];
            countImpvFixed++;
        } else {
            throw new Error(`Verb ${verb} is missing impv array!`);
        }
    }

    // 2. Extract participle from perf array
    const perfArr = data.tenses.perf;
    if (!Array.isArray(perfArr) || perfArr.length !== 6) {
        throw new Error(`Verb ${verb} perf tense array is invalid`);
    }

    // Extract participle portion from first person singular form (or 3rd person for impersonal)
    // "έχω γράψει" -> "γράψει", "έχει χρειαστεί" -> "χρειαστεί"
    const firstForm = perfArr[0];
    const match = firstForm.match(/^(?:έχω|έχει)\s+(.+)$/);
    if (!match) {
        throw new Error(`Could not extract participle from perf form "${firstForm}" for verb ${verb}`);
    }
    const participle = match[1];

    // Check if impersonal verb (like πρέπει)
    const isImpersonal = (verb === 'πρέπει');

    // 3. Generate pluperfect
    if (isImpersonal) {
        data.tenses.pluperfect = Array(6).fill(`είχε ${participle}`);
    } else {
        data.tenses.pluperfect = pluperfectAux.map(aux => `${aux} ${participle}`);
    }
    countPluperfectAdded++;

    // 4. Generate future_perfect
    if (isImpersonal) {
        data.tenses.future_perfect = Array(6).fill(`θα έχει ${participle}`);
    } else {
        data.tenses.future_perfect = futurePerfectAux.map(aux => `${aux} ${participle}`);
    }
    countFuturePerfectAdded++;
}

console.log(`Updated Greek verbs dataset:`);
console.log(`- Fixed missing impv for ${countImpvFixed} verb(s) (πρέπει).`);
console.log(`- Added pluperfect for ${countPluperfectAdded} verbs.`);
console.log(`- Added future_perfect for ${countFuturePerfectAdded} verbs.`);

fs.writeFileSync(verbsPath, JSON.stringify(verbs, null, 2) + '\n', 'utf8');
console.log(`Saved updated verbs to ${verbsPath}`);
