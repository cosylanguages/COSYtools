/**
 * Guards against systematic generation mistakes in the conjugation data (all copies: verbs.json,
 * by-group shards, groups, shared/data, lexicon). Found and fixed so far:
 *  - Italian -iare verbs with doubled "ii" (studii, studiiamo, che io mangii ...)
 *  - Greek forms with two accent marks (σκέφτόμαστε, ακούγόμουν ...)
 *  - a Russian typo with three identical letters (поообещал)
 */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };

const walkFiles = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'docs'].includes(e.name)) continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(f, out); else if (e.name.endsWith('.json')) out.push(f);
  }
  return out;
};
const ACC = new Set('άέήίόύώΐΰ');
const STRESSED_I = new Set(['inviare', 'sciare', 'spiare', 'avviare', 'obliare']);   // tu invii, che io invii, che loro inviino

// collect { file, lemma, tense, form } for every conjugation table in a JSON file
function collect(x, file, out, lemma) {
  if (Array.isArray(x)) { x.forEach(i => collect(i, file, out, lemma)); return; }
  if (!x || typeof x !== 'object') return;
  const lem = typeof x.lemma === 'string' ? x.lemma : lemma;
  for (const [k, v] of Object.entries(x)) {
    if (k === 'tenses' && v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [tn, forms] of Object.entries(v)) if (Array.isArray(forms)) forms.forEach(f => typeof f === 'string' && out.push({ file, lemma: lem, tense: tn, form: f }));
    } else {
      collect(v, file, out, (v && typeof v === 'object' && !Array.isArray(v) && v.tenses) ? k : lem);
    }
  }
}

const rows = [];
for (const f of walkFiles(root)) {
  const rel = path.relative(root, f);
  if (!/(verbs[^/]*\.json|by-group|\/groups\/|lexicon\.json)/.test(rel) || /shards\//.test(rel)) continue;
  try { collect(JSON.parse(fs.readFileSync(f, 'utf8')), rel, rows, null); } catch (e) {}
}
ok(rows.length > 50000, `scanned ${rows.length} conjugated forms`);

const words = s => s.split(/[\s/]+/).map(w => w.replace(/^[!?.,;:()'’]+|[!?.,;:()'’]+$/g, '')).filter(Boolean);
const italian = rows.filter(r => /\/it\//.test(r.file) || /verbs-it\.json/.test(r.file));
const bad_it = italian.filter(r => r.lemma && r.lemma.endsWith('iare') && ['pres', 'subj', 'impv'].includes(r.tense) &&
  words(r.form).some(w => /ii(amo|ate)$/.test(w) || (!STRESSED_I.has(r.lemma) && /ii(no)?$/.test(w))));
ok(bad_it.length === 0, 'Italian -iare verbs have no doubled "ii" ' + bad_it.slice(0, 3).map(r => `${r.lemma}:${r.form}`).join(', '));

const greek = rows.filter(r => /\/el\//.test(r.file) || /verbs-el\.json/.test(r.file));
const bad_el = greek.filter(r => words(r.form).some(w => [...w.normalize('NFC')].filter(c => ACC.has(c)).length >= 2));
ok(bad_el.length === 0, 'Greek forms have at most one accent mark per word ' + bad_el.slice(0, 3).map(r => `${r.lemma}:${r.form}`).join(', '));

const triple = rows.filter(r => words(r.form).some(w => /(.)\1\1/u.test(w)));
ok(triple.length === 0, 'no form contains the same letter three times in a row ' + triple.slice(0, 3).map(r => `${r.lemma}:${r.form}`).join(', '));

// spot checks of verbs learners practise
const it = JSON.parse(fs.readFileSync(path.join(root, 'tools/it/coniugatore/data/verbs.json'), 'utf8'));
ok(JSON.stringify(it['studiare'].tenses.pres) === JSON.stringify(['studio', 'studi', 'studia', 'studiamo', 'studiate', 'studiano']), 'it studiare present tense');
ok(it['inviare'].tenses.pres[1] === 'invii' && it['inviare'].tenses.pres[3] === 'inviamo', 'it inviare keeps the stressed i (tu invii) but noi inviamo');
const el = JSON.parse(fs.readFileSync(path.join(root, 'tools/el/klisi-rimaton/data/verbs.json'), 'utf8'));
ok(el['σκέφτομαι'].tenses.pres[3] === 'σκεφτόμαστε', 'el σκέφτομαι: σκεφτόμαστε');

console.log(fails ? 'FAILURES: ' + fails : 'ALL VERB FORM CHECKS PASSED');
process.exit(fails ? 1 : 0);
