# COSYtools 🛠️

**COSYtools** is a consolidated repository containing all 32 standalone offline reference tools and interactive engines built for COSYlanguages.

---

## 🧰 Included Tools & Reference Engines

### 📜 Verb Conjugation Engines
1. **`tools/en/irregular-verbs/`** — English Irregular Verbs Engine (200+ verbs, V1/V2/V3 forms, 5 pattern groups, 4 practice modes, SRS deck)
2. **`tools/fr/conjugeur/`** — French Verb Conjugation Engine (200+ verbs, all tenses, color-coded endings, practice game)
3. **`tools/it/coniugatore/`** — Italian Verb Conjugation Engine (full conjugation tables, definitions, antonyms, irregular highlights)
4. **`tools/ru/spryazhenie/`** — Russian Verb Conjugation Engine (aspectual pairs НСВ/СВ, stress accents, practice trainer)
5. **`tools/el/klisi-rimaton/`** — Modern Greek Verb Conjugation Engine (active & passive voices, contracted verbs, stress accents)

### ⚖️ Noun Gender & Case Declension Engines
6. **`tools/fr/genre/`** — French Gender & Plural Engine (masculine/feminine badges, irregular plurals, suffix rules)
7. **`tools/it/genere/`** — Italian Gender & Combined Prepositions (noun gender, irregular plurals, preposizioni articolate matrices)
8. **`tools/ru/rod-padezhi/`** — Russian Gender & 6-Case Declension Engine (singular/plural declension matrices, animacy, stress marks)
9. **`tools/el/genos-ptoseis/`** — Modern Greek Gender & 4-Case Engine (nominative, genitive, accusative, vocative inflections)

### 📍 Prepositional Regimes & Verb Syntax Engines
10. **`tools/en/verb-prep/`** — English Dependent Prepositions & Phrasals Engine (verbs, nouns & adjectives, contrast pairs, SRS deck)
11. **`tools/fr/regime/`** — French Prepositional Regimes Engine (verb, noun & adjective constructions with à/de, SRS practice)
12. **`tools/it/reggenza/`** — Italian Prepositional Reggenze Engine (governing prepositions, contrast matrices, SRS dashboard)
13. **`tools/el/syntaxi/`** — Modern Greek Verb Syntax Engine (case government, accusative/genitive complements, examples)

---

## 🚀 How to Use & Deploy

### 1. What's Included
The repository contains everything needed out of the box:
- `index.html` (Catalog & Hub interface)
- `manifest.json` (Web App Manifest)
- `shared/` (Shared CSS, JS, and image assets)
- All tool folders are grouped under `tools/<language>/` (for example, `tools/en/` contains the English tools).
- `tools/<language>/data/lexicon.json` (shared lexical index assembled from that language's applications)

To rebuild the shared lexical indexes after adding or importing source data, run:

```bash
node scripts/build_language_lexicons.js
node scripts/report_language_coverage.js
```

Morphological paradigms can be imported from UniMorph for the supported languages with:

```bash
node scripts/import_unimorph.js 1000
```

The import writes `tools/<language>/data/morphology.json` and preserves the source URL. These paradigms provide grammatical forms; definitions, examples, gender labels, and usage notes still require lexical curation. UniMorph currently has no matching dataset in this pipeline for Chuvash, and Breton has a smaller available dataset.

### 2. Running Locally
- Open `index.html` directly in any web browser, or serve the repository with any static file server — no build step, Node server, or database required!

### 3. Deploying
- Host on **GitHub Pages**, **Vercel**, **Netlify**, or any static web hosting service.

### 4. 100% Offline & Client-Side
- All data datasets reside locally in JSON/JS files inside each tool directory.
- User progress (SRS memory review, score streaks) is preserved in `localStorage`.

---

## 🎓 CEFR Proficiency Level Scheme Rationale

By design, all reference datasets across **COSYtools** cap at **B2+** (`A1`, `A2`, `B1`, `B2`, `B2+`).

- **Product Rationale:** Reference engines focus on explicit rule acquisition and drill practice. Learners at C1/C2 operate primarily through intuitive immersion and native nuance rather than discrete reference lookups. Capping datasets at B2+ keeps reference tables focused and highly actionable.
- **COSYlanguages Relationship:** If full C1/C2 curriculum materials and advanced immersion content are required, refer to [COSYlanguages](https://github.com/cosylanguages/COSYlanguages), which is a separate product that supports the full CEFR spectrum (A1–C2).
