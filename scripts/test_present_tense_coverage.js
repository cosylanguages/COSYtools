const fs = require('fs');

const LEMMAS = [
  "be", "have", "think", "know", "like", "love", "hate", "dislike", "want", "work",
  "study", "go", "can", "eat", "drink", "do", "make", "understand", "speak", "talk",
  "say", "tell", "need", "look", "watch", "see", "ask", "answer", "take", "give",
  "must", "have to", "wait", "live", "listen", "hear", "pay", "buy", "remember",
  "forget", "feel", "meet", "decide", "write", "read", "type", "spend", "waste",
  "play", "agree", "disagree", "send", "get"
];

const LANG_CONFIGS = [
  { lang: 'en', file: 'tools/en/irregular-verbs/data/verbs.json', presentKeys: ['present', 'third_person_singular', 'base'] },
  { lang: 'fr', file: 'tools/fr/conjugeur/data/verbs.json', presentKeys: ['present', 'indicatif_present'] },
  { lang: 'it', file: 'tools/it/coniugatore/data/verbs.json', presentKeys: ['pres', 'presente', 'present'] },
  { lang: 'ru', file: 'tools/ru/spryazhenie/data/verbs.json', presentKeys: ['pres', 'настоящее', 'present'] },
  { lang: 'el', file: 'tools/el/klisi-rimaton/data/verbs.json', presentKeys: ['pres', 'Ενεστώτας', 'present'] },
  { lang: 'pt', file: 'tools/pt/conjugeur/data/verbs.json', presentKeys: ['presente', 'present', 'pres'] },
  { lang: 'de', file: 'tools/de/konjugation/data/verbs.json', presentKeys: ['präsens', 'present', 'pres'] },
  { lang: 'es', file: 'tools/es/conjugeur/data/verbs.json', presentKeys: ['presente', 'present', 'pres'] },
  { lang: 'tt', file: 'tools/tt/conjugeur/data/verbs.json', presentKeys: ['present', 'pres'] },
  { lang: 'ba', file: 'tools/ba/conjugeur/data/verbs.json', presentKeys: ['present', 'pres'] },
  { lang: 'cv', file: 'tools/cv/conjugeur/data/verbs.json', presentKeys: ['present', 'pres'] },
  { lang: 'br', file: 'tools/br/conjugeur/data/verbs.json', presentKeys: ['present', 'pres'] },
  { lang: 'hy', file: 'tools/hy/conjugeur/data/verbs.json', presentKeys: ['present', 'pres'] },
  { lang: 'ka', file: 'tools/ka/conjugeur/data/verbs.json', presentKeys: ['present', 'pres'] }
];

let totalTested = 0;
let errors = [];

LANG_CONFIGS.forEach(cfg => {
  if (!fs.existsSync(cfg.file)) {
    errors.push(`Missing dataset file for language ${cfg.lang}: ${cfg.file}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(cfg.file, 'utf8'));
  const entries = Object.entries(data);

  LEMMAS.forEach(lemma => {
    totalTested++;
    const matching = entries.filter(([key, entry]) => {
      const matchLemma = entry.en_lemma === lemma || entry.lemma === lemma || key === lemma || entry.base === lemma;
      if (!matchLemma) return false;

      const tenses = entry.tenses || {};
      for (const pk of cfg.presentKeys) {
        if (tenses[pk] && tenses[pk].length > 0) return true;
        if (entry[pk]) return true;
      }
      return false;
    });

    if (matching.length === 0) {
      errors.push(`[${cfg.lang.toUpperCase()}] Missing present tense conjugation entry for lemma "${lemma}"`);
    }
  });
});

console.log(`=== Present Tense 14-Language Coverage Test ===`);
console.log(`Total language-lemma combinations checked: ${totalTested}`);

if (errors.length > 0) {
  console.error(`FAILED with ${errors.length} error(s):`);
  errors.forEach(err => console.error(` - ${err}`));
  process.exit(1);
} else {
  console.log(`✅ ALL 53 lemmas explicitly verified with present tense conjugations across all 14 languages!`);
}
