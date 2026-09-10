# COSYtools 🛠️

**COSYtools** is the comprehensive offline reference hub and grammar engine suite for [COSYlanguages](https://cosylanguages.github.io/COSYlanguages/). It serves as an encyclopedia and reference library for language learners to verify grammar rules, lookup verb conjugations, inspect noun genders, study case declension tables, and practice targeted concepts.

---

## 🧰 Overview of Included Tools & Reference Engines

### 📜 Verb Conjugation Engines
1. **`conjugation/template.html` & `conjugation/`** — Unified Multi-lingual Verb Conjugation Engine (English, French, Italian, Russian, Greek) with tense/mood filters, verb input, practice drills link, grammar rules, and contextual example sentences.
2. **`tools/en/irregular-verbs/`** — English Irregular Verbs Engine (200+ verbs, V1/V2/V3 forms, 5 pattern groups, 4 practice modes, SRS deck).
3. **`tools/fr/conjugeur/`** — French Verb Conjugation Engine (200+ verbs, all tenses, color-coded endings, practice game).
4. **`tools/it/coniugatore/`** — Italian Verb Conjugation Engine (full conjugation tables, definitions, antonyms, irregular highlights).
5. **`tools/ru/spryazhenie/`** — Russian Verb Conjugation Engine (aspectual pairs НСВ/СВ, stress accents, practice trainer).
6. **`tools/el/klisi-rimaton/`** — Modern Greek Verb Conjugation Engine (active & passive voices, contracted verbs, stress accents).

### ⚖️ Noun Gender & Case Declension Engines
7. **`gender/index.html` & `gender/`** — Universal Noun Gender & Article Checker for French, Italian, Russian, and Greek with singular/plural forms, suffix rules, ending reliability badges, and common exception lists.
8. **`cases/index.html` & `cases/`** — Interactive Case Systems Matrix for Russian (6 cases) and Greek (4 cases) with clickable rule cells, question triggers, usage guidelines, and example sentences.
9. **`noun-declensions/index.html`** — Complete Noun Declension Guide covering vocalic stems, consonant shifts, and irregular plural shifts.
10. **`tools/fr/genre/`** — French Gender & Plural Engine.
11. **`tools/it/genere/`** — Italian Gender & Preposizioni Articolate matrices.
12. **`tools/ru/rod-padezhi/`** — Russian Gender & 6-Case Declension Engine.
13. **`tools/el/genos-ptoseis/`** — Modern Greek Gender & 4-Case Engine.

### 📍 Prepositional Regimes & Verb Syntax Engines
14. **`prepositions/index.html` & `prepositions/`** — Preposition Rules & Verb Regimes Reference Engine covering dependent prepositions and case government in English, French, Italian, Russian, and Greek.
15. **`tools/en/verb-prep/`** — English Dependent Prepositions & Phrasals Engine.
16. **`tools/fr/regime/`** — French Prepositional Regimes Engine.
17. **`tools/it/reggenza/`** — Italian Prepositional Reggenze Engine.
18. **`tools/el/syntaxi/`** — Modern Greek Verb Syntax Engine.

### ⚡ Practice & SRS Review Modules
19. **`practice/index.html`** — Comprehensive Practice Hub with stats tracking (streaks, items reviewed, weak spots count).
20. **`practice/quick-drills/index.html`** — Dedicated Rapid-Fire Quick Drills trainer.
21. **`practice/weak-spots/index.html`** — Weak Spots Tracker powered by Spaced Repetition (SRS).

---

## 📖 How to Use Each Tool

### Using the Conjugation Engine (`/conjugation/`)
1. Enter any verb infinitive into the search box or select a target language from the dropdown selector.
2. Filter table results by tense/mood (Present, Past/Preterite, Future, Subjunctive/Conditional).
3. Review person-by-person conjugation rows, related grammar rules, and example sentences.
4. Click **"Practice this verb on COSYgames"** to launch interactive drill exercises in [COSYgames](https://cosylanguages.github.io/COSYgames/).

### Using the Gender Checker (`/gender/`)
1. Type any noun in French, Italian, Russian, or Greek.
2. View the noun's grammatical gender badge, definite/indefinite articles, and singular/plural forms.
3. Consult the **Ending Rules & Reliability Guidelines** to understand suffix patterns.
4. Review the **High-Frequency Exceptions** list to avoid common learner traps.

### Using Case Systems (`/cases/`)
1. Toggle between **Russian (6 Cases)** and **Greek (4 Cases)** using the top language pills.
2. Click on any case row in the declension matrix table to expand its detailed rule breakdown.
3. Review question triggers (e.g., *Кто? Что?*, *Ποιος; Ποια;*) and contextually highlighted example sentences.

### Using Preposition Rules (`/prepositions/`)
1. Search for a verb, noun, or preposition keyword.
2. Inspect the governing preposition, CEFR level tag, grammar rule, common mistake warnings, and example sentences.

### Using Practice & Weak Spots (`/practice/`)
1. Answer quick fill-in-the-blank questions on the Practice Hub or Quick Drills page.
2. Incorrect answers are automatically recorded into your local **Weak Spots Tracker**.
3. Re-test missed items on `/practice/weak-spots/` until mastered.

---

## 📊 Data Sources & Accuracy Notes

- **UniMorph Morphological Data:** Paradigm tables and inflectional forms are generated and verified against UniMorph morphological datasets.
- **Kaikki / Wiktionary Lexical Pipeline:** Definitions, translations, and auxiliary usage notes are harvested via Kaikki lexical datasets.
- **Human Pedagogical Curation:** All datasets undergo strict CEFR validation (`scripts/validate_levels.js`) and structural assertions (`scripts/validate_verbs.js`, `scripts/assert_tenses.js`).
- **CEFR Capping:** Reference data caps at **B2+** (`A1`, `A2`, `B1`, `B2`, `B2+`) to keep tables focused and highly actionable. Full C1/C2 immersion curriculum is available through [COSYlanguages](https://cosylanguages.github.io/COSYlanguages/).

---

## 📘 Integration Guide for COSYmanuals

**COSYmanuals** (the written grammar textbook modules) link directly into COSYtools reference engines for interactive rule verification:

```html
<!-- Example COSYmanuals embedding/link snippet -->
<a href="https://cosylanguages.github.io/COSYtools/conjugation/template.html?lang=fr&verb=parler"
   target="_blank" class="cosy-ref-link">
   🔎 Verify French conjugation for "parler" on COSYtools
</a>
```

When linking from COSYmanuals into COSYtools:
1. Pass `lang=<code` parameter (`en`, `fr`, `it`, `ru`, `el`).
2. Pass `verb=<infinitive>` or `noun=<word>` query parameter.
3. Include target `mode=gender|cases|prepositions` if linking to specific sub-engines.

---

## 🛠️ API Documentation (`COSYReferenceUtils`)

`shared/engines/reference-utils.js` exposes global helper functions on `window.COSYReferenceUtils`:

### `COSYReferenceUtils.detectLanguage(text)`
Detects language from input character sets and key tokens. Returns language code string (`'ru'`, `'el'`, `'fr'`, `'it'`, `'en'`, etc.).

### `COSYReferenceUtils.loadData(url)`
Loads JSON data with automatic offline caching in `localStorage`. Returns a Promise resolving to the parsed object.

```javascript
const verbs = await COSYReferenceUtils.loadData('/shared/data/verbs-fr.json');
```

### `COSYReferenceUtils.searchDataset(dataset, query)`
Performs fast, multi-field search across verbs, nouns, definitions, and grammar rules.

### `COSYReferenceUtils.recordWeakSpot(item)` / `getWeakSpots()` / `removeWeakSpot(id, lang)`
Manages weak-spot items saved locally for SRS review.

### `COSYReferenceUtils.getEcosystemLink(destination, params)`
Generates uniform ecosystem URLs (`'home'`, `'games'`, `'world'`, `'events'`, `'tools'`) with URL search parameters.

---

## 🚀 Course Enrollment & Ecosystem Links

Take your language learning to the next level:
- 🏠 **Official Home & Courses:** [COSYlanguages](https://cosylanguages.github.io/COSYlanguages/)
- 🎮 **Self-Study Games:** [COSYgames](https://cosylanguages.github.io/COSYgames/)
- 🌍 **Language World Map:** [COSYworld](https://cosylanguages.github.io/COSYworld/)
- 📅 **Live Events & Workshops:** [COSYevents](https://cosylanguages.github.io/COSYevents/)
