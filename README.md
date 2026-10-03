# COSYtools 🛠️

**COSYtools** is the comprehensive reference hub and grammar engine suite for [COSYlanguages](https://cosylanguages.github.io/COSYlanguages/). It serves as an encyclopedia and reference library for language learners to verify grammar rules, lookup verb conjugations, inspect noun genders, study case declension tables, and practice targeted concepts.

---

## 🧰 Overview of Included Tools & Reference Engines

COSYtools includes **31 dedicated tool applications across 14 languages**, unified cross-language comparison hubs, practice drills, and client-side redirect stubs.

### 🌐 Unified Reference Hubs
- **`index.html`** — Main Reference Hub & Cross-Language Application Search
- **`conjugation/template.html`** — Multi-Language Conjugation Comparison Engine (English, French, Italian, Russian, Greek)
- **`gender/index.html`** — Multi-Language Noun Gender Checker & Article Guidelines
- **`cases/index.html`** — Multi-Language Case Systems & Declension Matrices
- **`prepositions/index.html`** — Multi-Language Dependent Prepositions & Case Government
- **`verb-patterns/index.html`** — Verb Pattern Classification & Vowel Shift Guide
- **`noun-declensions/index.html`** — Noun Ending Paradigms & Plural Rules
- **`practice/index.html`**, **`practice/quick-drills/`**, **`practice/weak-spots/`** — Practice Hub & Spaced Repetition (SRS) Review

### 🛠️ 31 Native Tool Applications (14 Languages)

1. **🇬🇧 English (`en`)**
   - `tools/en/irregular-verbs/` — English Irregular Verbs Engine
   - `tools/en/speaking-bot/` — English Speaking Practice Bot
   - `tools/en/verb-prep/` — English Prepositions & Regimes Engine

2. **🇫🇷 French (`fr`)**
   - `tools/fr/conjugeur/` — Conjugueur Français
   - `tools/fr/genre/` — Genre & Pluriels des Noms Français
   - `tools/fr/regime/` — Régime Prépositionnel Français

3. **🇮🇹 Italian (`it`)**
   - `tools/it/coniugatore/` — Coniugatore Italiano
   - `tools/it/genere/` — Genere & Preposizioni Italiane
   - `tools/it/reggenza/` — Reggenza Verbale, Nominale e Aggettivale

4. **🇷🇺 Russian (`ru`)**
   - `tools/ru/spryazhenie/` — Спряжение Глаголов (Russian Verb Engine)
   - `tools/ru/rod-padezhi/` — Род и 6 Падежей (Russian Gender & 6 Cases)

5. **🇬🇷 Greek (`el`)**
   - `tools/el/klisi-rimaton/` — Κλίση Ρημάτων (Greek Verb Engine)
   - `tools/el/genos-ptoseis/` — Γένος & 4 Πτώσεις (Greek Gender & 4 Cases)
   - `tools/el/syntaxi/` — Σύνταξη Ρημάτων (Greek Syntax & Prepositions)

6. **🇩🇪 German (`de`)**
   - `tools/de/konjugation/` — German Verb Conjugation Engine
   - `tools/de/genus/` — German Noun Gender Checker
   - `tools/de/praepositionen/` — Deutsche Verben mit Präpositionen

7. **🇪🇸 Spanish (`es`)**
   - `tools/es/conjugeur/` — Conjugación Española
   - `tools/es/genre/` — Género de Sustantivos

8. **🇵🇹 Portuguese (`pt`)**
   - `tools/pt/conjugeur/` — Conjugação Portuguesa
   - `tools/pt/genre/` — Gênero de Substantivos

9. **🇦🇲 Armenian (`hy`)**
   - `tools/hy/conjugeur/` — Armenian Verb Conjugator
   - `tools/hy/cases/` — Armenian Noun Case Declensions

10. **🇬🇪 Georgian (`ka`)**
    - `tools/ka/conjugeur/` — Georgian Verb Conjugator
    - `tools/ka/cases/` — Georgian Noun Case Declensions

11. **Bashkir (`ba`)**
    - `tools/ba/conjugeur/` — Bashkir Verb Conjugator
    - `tools/ba/cases/` — Bashkir Noun Case Declensions

12. **Breton (`br`)**
    - `tools/br/conjugeur/` — Breton Verb Conjugator
    - `tools/br/genre/` — Breton Noun Gender Reference

13. **Chuvash (`cv`)**
    - `tools/cv/conjugeur/` — Chuvash Verb Conjugator
    - `tools/cv/cases/` — Chuvash Noun Case Declensions

14. **Tatar (`tt`)**
    - `tools/tt/conjugeur/` — Tatar Verb Conjugator
    - `tools/tt/cases/` — Tatar Noun Case Declensions

### 🔀 Client-Side Redirect Stubs (16 Pages)
Legacy category routes are maintained as client-side redirect stubs pointing to canonical tool engines:
- **Cases:** `cases/greek/`, `cases/russian/`
- **Conjugation:** `conjugation/english/`, `conjugation/french/`, `conjugation/greek/`, `conjugation/italian/`, `conjugation/russian/`
- **Gender:** `gender/french/`, `gender/greek/`, `gender/italian/`, `gender/russian/`
- **Prepositions:** `prepositions/english/`, `prepositions/french/`, `prepositions/greek/`, `prepositions/italian/`, `prepositions/russian/`

---

## 🎨 Shared Shell & Ecosystem Consistency

All HTML pages in COSYtools enforce a unified ecosystem shell:
- **Ecosystem Header Strip:** `cosy-ecosystem-strip` provides navigation across COSYlanguages, COSYdata, COSYtools, and COSYgames.
- **Shell Footer:** `cosy-footer` provides copyright and client-side privacy notices.
- **Shell Tooling & CI:** The ecosystem strip and footer are stamped and kept in sync across all HTML pages using `scripts/sync-shell.js`, and validated in CI via `npm run check:shell`.

---

## 🚀 Shared JavaScript Utilities (`shared/js/`)

### `COSYReferenceUtils.detectLanguage(input)`
Detects language from input character sets and key tokens. Returns language code string (`'ru'`, `'el'`, `'fr'`, `'it'`, `'en'`, etc.).

### `COSYReferenceUtils.loadData(url)`
Loads JSON data with automatic caching in `localStorage`. Returns a Promise resolving to the parsed object.

```javascript
const verbs = await COSYReferenceUtils.loadData('/shared/data/verbs-fr.json');
```

---

## 🧪 CI & Verification Scripts

```bash
# Verify JavaScript syntax across .js files
npm run check:js-syntax

# Verify inline JavaScript blocks in HTML files
npm run check:inline-js

# Verify ecosystem shell strip and footer consistency
npm run check:shell

# Run Puppeteer smoke tests and mobile viewport checks
npm run check:smoke
```
