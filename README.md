# COSYtools 🛠️

**COSYtools** is a consolidated repository containing all 12 standalone offline reference tools and interactive engines built for COSYlanguages.

---

## 🧰 Included Tools & Reference Engines

### 📜 Verb Conjugation Engines
1. **`fr-conjugeur/`** — French Verb Conjugation Engine (200+ verbs, all tenses, color-coded endings, practice game)
2. **`it-coniugatore/`** — Italian Verb Conjugation Engine (full conjugation tables, definitions, antonyms, irregular highlights)
3. **`ru-spryazhenie/`** — Russian Verb Conjugation Engine (aspectual pairs НСВ/СВ, stress accents, practice trainer)
4. **`el-klisi-rimaton/`** — Modern Greek Verb Conjugation Engine (active & passive voices, contracted verbs, stress accents)

### ⚖️ Noun Gender & Case Declension Engines
5. **`fr-genre/`** — French Gender & Plural Engine (masculine/feminine badges, irregular plurals, suffix rules)
6. **`it-genere/`** — Italian Gender & Combined Prepositions (noun gender, irregular plurals, preposizioni articolate matrices)
7. **`ru-rod-padezhi/`** — Russian Gender & 6-Case Declension Engine (singular/plural declension matrices, animacy, stress marks)
8. **`el-genos-ptoseis/`** — Modern Greek Gender & 4-Case Engine (nominative, genitive, accusative, vocative inflections)

### 📍 Prepositional Regimes & Verb Syntax Engines
9. **`en-verb-prep/`** — English Dependent Prepositions & Phrasals Engine (verbs, nouns & adjectives, contrast pairs, SRS deck)
10. **`fr-regime/`** — French Prepositional Regimes Engine (verb, noun & adjective constructions with à/de, SRS practice)
11. **`it-reggenza/`** — Italian Prepositional Reggenze Engine (governing prepositions, contrast matrices, SRS dashboard)
12. **`el-syntaxi/`** — Modern Greek Verb Syntax Engine (case government, accusative/genitive complements, examples)

---

## 🚀 Migration & How to Use

To copy everything into your new repository (`https://github.com/cosylanguages/COSYtools`):

1. **Copy Folder Contents**: Copy all files and folders inside `COSYtools/` into the root of your `COSYtools` repository:
   - `index.html` (Catalog & Hub interface)
   - `manifest.json` (Web App Manifest)
   - `shared/` (Shared CSS, JS, and image assets)
   - All 12 tool folders (`fr-conjugeur/`, `it-coniugatore/`, `en-verb-prep/`, etc.)

2. **Serve or Host Static Files**:
   - Host via GitHub Pages, Vercel, Netlify, or any static file server.
   - Open `index.html` in any browser — no node server or backend database required!

3. **100% Offline & Client-Side**:
   - All data datasets reside locally in JSON/JS files inside each tool directory.
   - User progress (SRS memory review, score streaks) is preserved in `localStorage`.
