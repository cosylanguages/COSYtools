# COSYtools Repository Audit Report

This document presents a comprehensive, read-only audit of the `COSYtools` repository, conducted across all git branches, files, datasets, ecosystem references, cross-repo dependencies, deployment configurations, and access control settings.

---

## 1. Branches and Open Pull Requests

| Branch Name | Last Commit Date | What It Adds That Is Not On `main` |
| :--- | :--- | :--- |
| `main` | 2026-10-14 16:33:51 +0200 | Primary production branch. Contains all consolidated tool styles, master token imports, PracticeEngine exercise format extensions, and logo integration (#83). |
| `origin/jules-2711692177333680095-a90b563c` | 2026-10-14 14:28:46 +0000 | Remote tracking feature branch. Commit `89d0f5a` was previously merged into `main` via PR #83. Contains **0 additional commits / 0 code diffs** relative to `main`. |

*Note: No other remote or local branches or open PRs exist in the repository.*

---

## 2. Full Folder Tree (Depth 3)

Below is the folder structure up to depth 3, along with file counts and a primary functional purpose for each directory.

- `/` (Root directory: `404.html`, `index.html`, `manifest.json`, `package.json`, `robots.txt`, `sitemap.xml`, etc.)
  - `assets/`: 1 file (1 direct). Holds top-level static brand asset (`logo.png`).
  - `cases/`: 3 files (1 direct). Legacy entry points and permanent client-side redirects to canonical case tools.
    - `cases/greek/`: 1 file (1 direct). Permanent client-side redirect to `/tools/el/genos-ptoseis/`.
    - `cases/russian/`: 1 file (1 direct). Permanent client-side redirect to `/tools/ru/rod-padezhi/`.
  - `conjugation/`: 6 files (1 direct). Legacy entry points and redirects for verb conjugator engines across 5 languages.
    - `conjugation/english/`: 1 file (1 direct). Permanent client-side redirect to `/tools/en/irregular-verbs/`.
    - `conjugation/french/`: 1 file (1 direct). Permanent client-side redirect to `/tools/fr/conjugeur/`.
    - `conjugation/greek/`: 1 file (1 direct). Permanent client-side redirect to `/tools/el/klisi-rimaton/`.
    - `conjugation/italian/`: 1 file (1 direct). Permanent client-side redirect to `/tools/it/coniugatore/`.
    - `conjugation/russian/`: 1 file (1 direct). Permanent client-side redirect to `/tools/ru/spryazhenie/`.
  - `docs/`: 7 files (3 direct). Technical documentation, data contracts, and inventory specifications.
    - `docs/archive/`: 2 files (2 direct). Archived audit logs and governance source-of-truth policy docs.
    - `docs/staging/`: 2 files (2 direct). Raw verb lists and verb coverage audit staging documents.
  - `gender/`: 5 files (1 direct). Legacy entry points and redirects for noun gender reference tools.
    - `gender/french/`: 1 file (1 direct). Permanent client-side redirect to `/tools/fr/genre/`.
    - `gender/greek/`: 1 file (1 direct). Permanent client-side redirect to `/tools/el/genos-ptoseis/`.
    - `gender/italian/`: 1 file (1 direct). Permanent client-side redirect to `/tools/it/genere/`.
    - `gender/russian/`: 1 file (1 direct). Permanent client-side redirect to `/tools/ru/rod-padezhi/`.
  - `noun-declensions/`: 1 file (1 direct). Interactive reference page for noun declension paradigms across languages.
  - `practice/`: 3 files (1 direct). Practice dashboard landing page and drill session engine integration.
    - `practice/quick-drills/`: 1 file (1 direct). Rapid-fire interactive multiple-choice practice session interface.
    - `practice/weak-spots/`: 1 file (1 direct). Spaced repetition weak-spot review interface using `localStorage`.
  - `prepositions/`: 6 files (1 direct). Legacy entry points and redirects for preposition governance tools.
    - `prepositions/english/`: 1 file (1 direct). Permanent client-side redirect to `/tools/en/verb-prep/`.
    - `prepositions/french/`: 1 file (1 direct). Permanent client-side redirect to `/tools/fr/regime/`.
    - `prepositions/greek/`: 1 file (1 direct). Permanent client-side redirect to `/tools/el/syntaxi/`.
    - `prepositions/italian/`: 1 file (1 direct). Permanent client-side redirect to `/tools/it/reggenza/`.
    - `prepositions/russian/`: 1 file (1 direct). Permanent client-side redirect to `/tools/ru/particles/`.
  - `schemas/`: 2 files (2 direct). JSON Schema validation standards for particles and verb patterns.
  - `scripts/`: 26 files (26 direct). Maintenance, data sharding, validation, and build verification scripts.
  - `shared/`: 38 files (1 direct). Shared design system assets, CSS stylesheets, engines, and templates.
    - `shared/assets/`: 1 file (1 direct). Master brand logo asset (`logo.png`).
    - `shared/css/`: 9 files (9 direct). Master design tokens (`cosy-tokens.css`), base styles, and tool layouts.
    - `shared/data/`: 13 files (13 direct). Canonical cross-tool reference datasets (genders, cases, verbs, prepositions).
    - `shared/engines/`: 3 files (3 direct). Core client engines (`practice-engine.js`, `reference-utils.js`, `srs-store.js`).
    - `shared/images/`: 1 file (1 direct). High-resolution brand logo PNG (`cosylanguages.png`).
    - `shared/js/`: 7 files (7 direct). Shared UI components (`shell.js`, `auth-sso.js`, `cms-editor.js`, `languages.js`).
    - `shared/styles/`: 1 file (1 direct). Global reference layout stylesheet (`reference.css`).
    - `shared/templates/`: 2 files (2 direct). Ecosystem navigation strip and footer HTML templates.
  - `tools/`: 608 files total across 14 language codes (0 direct).
    - `tools/ba/`: 41 files total (Bashkir language reference engines and letter shard datasets).
      - `tools/ba/cases/`: 2 files (1 direct). Case declension reference engine for Bashkir.
      - `tools/ba/conjugeur/`: 2 files (1 direct). Verb conjugation engine for Bashkir.
      - `tools/ba/data/`: 37 files (2 direct). Bashkir lexicon, morphology, and alphabetical shards.
    - `tools/br/`: 32 files total (Breton language reference engines and datasets).
      - `tools/br/conjugeur/`: 2 files (1 direct). Verb conjugation engine for Breton.
      - `tools/br/data/`: 28 files (3 direct). Breton lexicon, morphology, and alphabetical shards.
      - `tools/br/genre/`: 2 files (1 direct). Noun gender reference engine for Breton.
    - `tools/cv/`: 39 files total (Chuvash language reference engines and datasets).
      - `tools/cv/cases/`: 2 files (1 direct). Case declension reference engine for Chuvash.
      - `tools/cv/conjugeur/`: 2 files (1 direct). Verb conjugation engine for Chuvash.
      - `tools/cv/data/`: 35 files (2 direct). Chuvash lexicon, morphology, and alphabetical shards.
    - `tools/de/`: 44 files total (German language reference engines and datasets).
      - `tools/de/data/`: 30 files (2 direct). German lexicon, morphology, and alphabetical shards.
      - `tools/de/genus/`: 2 files (1 direct). German noun gender engine (`Genus`).
      - `tools/de/konjugation/`: 3 files (2 direct). German verb conjugation engine (`Konjugation`).
      - `tools/de/praepositionen/`: 9 files (3 direct). German preposition engine (`Präpositionen`).
    - `tools/el/`: 55 files total (Greek language reference engines and datasets).
      - `tools/el/data/`: 34 files (2 direct). Greek lexicon, morphology, and alphabetical shards.
      - `tools/el/genos-ptoseis/`: 5 files (3 direct). Greek noun gender and case declension engine.
      - `tools/el/klisi-rimaton/`: 5 files (3 direct). Greek verb conjugation engine (`Κλίση Ρημάτων`).
      - `tools/el/particles/`: 4 files (4 direct). Greek spatial, temporal, directional preposition datasets.
      - `tools/el/syntaxi/`: 7 files (3 direct). Greek preposition syntax governance engine (`Σύνταξη`).
      - `tools/el/verb-patterns/`: 0 files (0 direct). Placeholder directory for Greek verb patterns.
    - `tools/en/`: 74 files total (English language reference engines and datasets).
      - `tools/en/data/`: 32 files (2 direct). English lexicon, morphology, and alphabetical shards.
      - `tools/en/irregular-verbs/`: 9 files (4 direct). English irregular verb conjugator and pattern tool.
      - `tools/en/particles/`: 4 files (4 direct). English preposition datasets.
      - `tools/en/speaking-bot/`: 5 files (3 direct). Interactive speaking bot drill engine.
      - `tools/en/verb-patterns/`: 15 files (15 direct). English verb pattern classification datasets.
      - `tools/en/verb-prep/`: 9 files (3 direct). English verb + preposition dependency engine.
    - `tools/es/`: 31 files total (Spanish language reference engines and datasets).
      - `tools/es/conjugeur/`: 3 files (2 direct). Spanish verb conjugation engine.
      - `tools/es/data/`: 26 files (2 direct). Spanish lexicon, morphology, and alphabetical shards.
      - `tools/es/genre/`: 2 files (1 direct). Spanish noun gender engine.
    - `tools/fr/`: 52 files total (French language reference engines and datasets).
      - `tools/fr/conjugeur/`: 5 files (3 direct). French verb conjugation engine (`Conjugueur`).
      - `tools/fr/data/`: 30 files (2 direct). French lexicon, morphology, and alphabetical shards.
      - `tools/fr/genre/`: 5 files (3 direct). French noun gender engine (`Genre`).
      - `tools/fr/particles/`: 4 files (4 direct). French preposition datasets.
      - `tools/fr/regime/`: 8 files (3 direct). French preposition regime governance engine (`Régime`).
      - `tools/fr/verb-patterns/`: 0 files (0 direct). Placeholder directory for French verb patterns.
    - `tools/hy/`: 38 files total (Armenian language reference engines and datasets).
      - `tools/hy/cases/`: 2 files (1 direct). Armenian case declension engine.
      - `tools/hy/conjugeur/`: 2 files (1 direct). Armenian verb conjugation engine.
      - `tools/hy/data/`: 34 files (2 direct). Armenian lexicon, morphology, and alphabetical shards.
    - `tools/it/`: 46 files total (Italian language reference engines and datasets).
      - `tools/it/coniugatore/`: 5 files (3 direct). Italian verb conjugation engine (`Coniugatore`).
      - `tools/it/data/`: 23 files (2 direct). Italian lexicon, morphology, and alphabetical shards.
      - `tools/it/genere/`: 5 files (3 direct). Italian noun gender engine (`Genere`).
      - `tools/it/particles/`: 4 files (4 direct). Italian preposition datasets.
      - `tools/it/reggenza/`: 9 files (3 direct). Italian verb/noun/adjective preposition reggenza engine.
      - `tools/it/verb-patterns/`: 0 files (0 direct). Placeholder directory for Italian verb patterns.
    - `tools/ka/`: 35 files total (Georgian language reference engines and datasets).
      - `tools/ka/cases/`: 2 files (1 direct). Georgian case declension engine.
      - `tools/ka/conjugeur/`: 2 files (1 direct). Georgian verb conjugation engine.
      - `tools/ka/data/`: 31 files (2 direct). Georgian lexicon, morphology, and alphabetical shards.
    - `tools/pt/`: 31 files total (Portuguese language reference engines and datasets).
      - `tools/pt/conjugeur/`: 3 files (2 direct). Portuguese verb conjugation engine.
      - `tools/pt/data/`: 26 files (2 direct). Portuguese lexicon, morphology, and alphabetical shards.
      - `tools/pt/genre/`: 2 files (1 direct). Portuguese noun gender engine.
    - `tools/ru/`: 45 files total (Russian language reference engines and datasets).
      - `tools/ru/data/`: 31 files (2 direct). Russian lexicon, morphology, and alphabetical shards.
      - `tools/ru/particles/`: 4 files (4 direct). Russian preposition datasets.
      - `tools/ru/rod-padezhi/`: 5 files (3 direct). Russian noun gender and case declension engine.
      - `tools/ru/spryazhenie/`: 5 files (3 direct). Russian verb conjugation engine (`Спряжение`).
      - `tools/ru/verb-patterns/`: 0 files (0 direct). Placeholder directory for Russian verb patterns.
    - `tools/tt/`: 45 files total (Tatar language reference engines and datasets).
      - `tools/tt/cases/`: 2 files (1 direct). Tatar case declension engine.
      - `tools/tt/conjugeur/`: 2 files (1 direct). Tatar verb conjugation engine.
      - `tools/tt/data/`: 41 files (2 direct). Tatar lexicon, morphology, and alphabetical shards.
  - `verb-patterns/`: 1 file (1 direct). Master reference landing page for irregular verb pattern classifications.

---

## 3. Languages and CEFR Levels Covered per Content Type

The repository covers **14 ISO 639-1 language codes**. CEFR level tags cap at `B2+` across all datasets.

| Content Type | Language Codes Covered | CEFR Levels Covered |
| :--- | :--- | :--- |
| **Verb Conjugation Reference & Engines** | `en`, `fr`, `it`, `es`, `de`, `ru`, `el`, `pt`, `ba`, `br`, `cv`, `hy`, `ka`, `tt` | `en`, `fr`, `it`, `ru`, `el`: **A1, A2, B1, B2, B2+**<br>`de`, `es`, `pt`: **A1, A2**<br>`ba`, `br`, `cv`, `hy`, `ka`, `tt`: **A1** |
| **Noun Gender & Declension Engines** | `de`, `fr`, `it`, `es`, `pt`, `br`, `ru`, `el`, `ba`, `cv`, `hy`, `ka`, `tt` | `fr`, `ru`, `el`: **A1, A2, B1, B2**<br>`it`: **A1, A2, B1**<br>`de`, `es`, `pt`, `br`, `ba`, `cv`, `hy`, `ka`, `tt`: **A1** |
| **Preposition Governance & Particles** | `en`, `fr`, `it`, `de`, `ru`, `el` | `en`, `fr`, `it`, `el`: **A1, A2, B1, B2, B2+**<br>`de`: **A1, A2, B1**<br>`ru`: **A1, A2** |
| **Interactive Practice & Quick Drills** | `en`, `fr`, `it`, `es`, `de`, `ru`, `el` | **A1, A2, B1, B2** |
| **Verb Pattern Classifications** | `en` | **A1, A2, B1, B2, B2+** |
| **Lexicon & Morphology Shards** | `en`, `fr`, `it`, `es`, `de`, `ru`, `el`, `pt`, `ba`, `br`, `cv`, `hy`, `ka`, `tt` | **A1, A2, B1, B2, B2+** (varies per language depth) |

---

## 4. Intended PAID or Restricted Content Audit

A complete scan of the repository for payment endpoints, paid courseware, teacher guidebooks, answer keys, premium workbooks, or restricted session materials was conducted:

- **Audit Finding:** **NONE.** No paid courses, teacher guides, answer key documents, workbooks, or restricted event materials exist within this repository.
- **Verification:** All exercises served via `/practice/` or `/tools/` evaluate user answers entirely client-side against open JSON datasets (`shared/data/*.json` and `tools/<lang>/.../data/*.json`). There are no hidden or restricted content files served publicly.

---

## 5. Content Duplication and Ecosystem Overlaps

The following table lists content held in `COSYtools` that overlaps with canonical authority in other COSY repositories (`COSYdata` for vocabulary/lexicon, `COSYgames` for interactive drills, `COSYmanuals` for reference documentation, and `COSYlanguages` for main portal links).

| Overlapping Content Category | Exact Path | File Count | Newest Commit Date Fingerprint | Canonical Repo Target |
| :--- | :--- | :--- | :--- | :--- |
| **Lexicon & Morphology Datasets** | `shared/data/*.json`<br>`tools/*/data/*.json` | 448 files | `2026-10-14 16:33:51 +0200` | **COSYdata** (Vocabulary authority) |
| **Interactive Practice Engines** | `practice/index.html`<br>`practice/quick-drills/index.html`<br>`practice/weak-spots/index.html`<br>`shared/engines/practice-engine.js`<br>`shared/engines/srs-store.js` | 5 files | `2026-10-14 16:33:51 +0200` | **COSYgames** (Interactive practice authority) |
| **Grammar Reference Docs** | `verb-patterns/index.html`<br>`noun-declensions/index.html` | 2 files | `2026-10-14 16:33:51 +0200` | **COSYmanuals** (Manual & reference authority) |
| **Staged Verb Lists & Audits** | `docs/staging/a0-a1-master-verb-list-raw.md`<br>`docs/staging/verb-coverage-audit.md` | 2 files | `2026-10-14 16:33:51 +0200` | **COSYdata** / **COSYlanguages** |

---

## 6. COSYworld References Audit

A repository-wide scan was performed for all occurrences of `COSYworld` across code, docs, links, config, comments, and git history:

- **Active Files Scan (`grep -rni "cosyworld" .`):** **0 occurrences.**
- **Git Commit Message History (`git log --grep="cosyworld" -i`):**
  - **Commit `37a75a3`** (Line in commit body): *"Purged all references to cosyworld across HTML, JS, CSS, and Markdown files."*
  - **Commit `89d0f5a`** (Line in commit body): *"Purged all references to cosyworld across HTML, JS, CSS, and Markdown files."*

*Conclusion: The active working tree is completely free of COSYworld references.*

---

## 7. Dependencies on Other COSY Repositories

The following list identifies all hardcoded cross-repository dependencies, HTTP fetch URLs, GitHub Pages navigation links, JSON schemas, and shared JS references across the codebase:

### Shared Navigation Strip Links (`shared/templates/strip.html`)
- `shared/templates/strip.html:3`: `https://cosylanguages.github.io/COSYlanguages/` (`COSYlanguages 🏠`)
- `shared/templates/strip.html:4`: `https://cosylanguages.github.io/COSYdata/` (`COSYdata 📊`)
- `shared/templates/strip.html:6`: `https://cosylanguages.github.io/COSYgames/` (`COSYgames 🎮`)
- `shared/templates/strip.html:7`: `https://cosylanguages.github.io/COSYevents/` (`COSYevents 🎉`)

*(Note: The above strip links are duplicated across 33 tool `index.html` files and redirect stubs).*

### JSON Schema Declarations
- `schemas/particle.schema.json:3`: `https://cosylanguages.com/schemas/particle.schema.json`
- `schemas/verb-pattern.schema.json:3`: `https://cosylanguages.com/schemas/verb-pattern.schema.json`

### External Ecosystem Script & CDN References
- `shared/js/shell.js:14`: Dynamic script injection of Supabase SDK: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1`
- `shared/js/auth-sso.js:1`: Dynamic ecosystem SSO token parsing across `COSYlanguages` domains.
- `shared/js/cms-editor.js:1`: On-page founder CMS editor querying Supabase table `cms_page_overrides`.

### Global Helper Links (`shared/engines/reference-utils.js`)
- `shared/engines/reference-utils.js:142`: Cross-app navigation generator targeting `https://cosylanguages.github.io/COSYlanguages/`, `COSYgames`, and `COSYdata`.

---

## 8. Dead Weight Audit

The following files represent non-production utility scripts, staging files, and archived documentation that are not required for client-side website delivery:

| Category | File Path | Description |
| :--- | :--- | :--- |
| **Archived Audit Docs** | `docs/archive/AUDIT.md` | Stale legacy audit document. |
| **Archived Policy Docs** | `docs/archive/CANON_SOURCE_OF_TRUTH.md` | Archived governance document. |
| **Raw Staging Data** | `docs/staging/a0-a1-master-verb-list-raw.md` | Unparsed raw master verb import text file. |
| **Raw Audit Data** | `docs/staging/verb-coverage-audit.md` | Static staging coverage audit markdown document. |
| **One-Off / Maintenance Scripts** | `scripts/assert_tenses.js`<br>`scripts/build_language_lexicons.js`<br>`scripts/cleanup_it_verbs.js`<br>`scripts/generate_data_manifest.js`<br>`scripts/generate_el_verb_tenses.js`<br>`scripts/generate_es_verb_tenses.js`<br>`scripts/generate_ru_perfective_verbs.js`<br>`scripts/generate_verbs.py`<br>`scripts/import_kaikki.js`<br>`scripts/import_unimorph.js`<br>`scripts/report_language_coverage.js`<br>`scripts/shard-data.js`<br>`scripts/sync-shell.js`<br>`scripts/update_pt_verbs.js`<br>`scripts/verify-shard-results.js` | One-time data generation, extraction, sharding, and cleanup scripts. |

---

## 9. Site Deployment and Access Control

### Deployment Model
- **Hosting Platform:** GitHub Pages static site hosting.
- **Base Domain:** `https://cosylanguages.github.io/COSYtools/`
- **Execution Model:** 100% client-side HTML, CSS, and Vanilla JavaScript.
- **Data Fetching:** Datasets are fetched asynchronously via relative HTTP GET requests (`shared/data/*.json`, `tools/<lang>/.../data/*.json`) and cached in browser `localStorage`.

### Access Control & Security
- **Public Visibility:** The entire website and all associated JSON datasets are publicly accessible over HTTPS without password protection or payload encryption.
- **Server-Side Access Control:** **None.** GitHub Pages serves all static assets to any client without authentication checks.
- **Client-Side Auth Integrations:**
  - `shared/js/auth-sso.js`: Reads URL hash fragments (`#access_token=...`) passed during cross-domain navigation from `COSYlanguages` and sets session data via Supabase JS SDK.
  - `shared/js/cms-editor.js`: Renders an on-page editing bar if the authenticated user's Supabase JWT contains user metadata roles (`admin`, `founder`, or `owner`). Page overrides are fetched from Supabase REST API (`cms_page_overrides`).
