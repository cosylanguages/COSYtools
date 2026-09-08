const fs = require('fs');
const path = require('path');

const itVerbsPath = path.join(__dirname, '..', 'tools', 'it', 'coniugatore', 'data', 'verbs.json');
const verbs = JSON.parse(fs.readFileSync(itVerbsPath, 'utf8'));

const keyMap = {
  'presente': 'pres',
  'imperfetto': 'imp',
  'impf': 'imp',
  'futuro_semplice': 'fut',
  'condizionale_presente': 'cond',
  'congiuntivo_presente': 'subj',
  'imperativo': 'impv',
  'participio_passato': 'part',
  'pass_comp': 'pc'
};

const canonicalKeys = new Set([
  'pres', 'imp', 'fut', 'cond', 'subj', 'impv', 'part',
  'cond_pass', 'subj_pass', 'subj_imp', 'trap_pass', 'fut_ant', 'pc'
]);

let cleanedCount = 0;
let flaggedCount = 0;
const logMismatches = [];

for (const [verb, entry] of Object.entries(verbs)) {
  let hasLongForm = false;
  let hasMismatch = false;

  for (const [longKey, canonKey] of Object.entries(keyMap)) {
    if (entry.tenses[longKey] !== undefined) {
      hasLongForm = true;
      if (entry.tenses[canonKey] !== undefined) {
        const valLong = JSON.stringify(entry.tenses[longKey]);
        const valCanon = JSON.stringify(entry.tenses[canonKey]);
        if (valLong !== valCanon) {
          hasMismatch = true;
          logMismatches.push({
            verb,
            longKey,
            canonKey,
            valLong,
            valCanon
          });
        }
      }
      // Delete the long-form key
      delete entry.tenses[longKey];
    }
  }

  if (hasMismatch) {
    entry.needs_review = true;
    flaggedCount++;
  } else if (hasLongForm) {
    cleanedCount++;
  }
}

fs.writeFileSync(itVerbsPath, JSON.stringify(verbs, null, 2) + '\n', 'utf8');

console.log(`Cleanup complete!`);
console.log(`Total verbs processed: ${Object.keys(verbs).length}`);
console.log(`Verbs cleaned without mismatch: ${cleanedCount}`);
console.log(`Verbs flagged with 'needs_review': true due to data mismatch: ${flaggedCount}`);
console.log(`\nMismatch details logged:`);
console.log(JSON.stringify(logMismatches, null, 2));
