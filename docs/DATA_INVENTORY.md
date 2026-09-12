# COSYtools Data Inventory & Source of Truth Audit

## Overview
This document provides a comprehensive inventory of all data files within `COSYtools`, compares `COSYtools` data structures against `COSYlanguages/reference-grammar/`, proposes a canonical single source of truth architecture, and records the audit results for ecosystem links (e.g., COSYgames).

---

## 1. COSYtools Data Files Inventory

`COSYtools` structures its data across three main tiers:
1. **Shared Datasets (`shared/data/*.json`)**: Centralized json lookup tables consumed directly by multi-lingual reference views (`/conjugation/`, `/gender/`, `/cases/`, `/prepositions/`).
2. **Tool-Specific Datasets (`tools/<lang>/<tool>/data/*.json`)**: Rich, interactive datasets tailored to language-specific engines (`conjugeur`, `genere`, `rod-padezhi`, `reggenza`, `verb-prep`, `praepositionen`, `klisi-rimaton`, etc.).
3. **Raw Lexicon & Morphology (`tools/<lang>/data/*.json`)**: UniMorph/Kaikki pipeline aggregation files (`lexicon.json`, `morphology.json`, `kaikki.json`) maintained per language.

### 1.1 Shared Data Files (`shared/data/`)

| File Path | Format | Covered Languages / Feature | Schema Key Fields |
| :--- | :--- | :--- | :--- |
| `shared/data/verbs-fr.json` | JSON Object (dict) | French (`fr`) Conjugations | `group`, `level`, `definition`, `antonyms`, `auxiliary`, `tenses` (`indicatif_present`, `indicatif_imparfait`, `indicatif_passe_compose`, `indicatif_futur_simple`, `conditionnel_present`, `subjonctif_present`), `usage_hint`, `irregular` |
| `shared/data/verbs-it.json` | JSON Object (dict) | Italian (`it`) Conjugations | `group`, `level`, `definition`, `antonyms`, `auxiliary`, `tenses` (`indicativo_presente`, `indicativo_imperfetto`, `indicativo_passato_prossimo`, `indicativo_futuro_semplice`, `congiuntivo_presente`, `condizionale_presente`), `usage_hint`, `irregular` |
| `shared/data/verbs-ru.json` | JSON Object (dict) | Russian (`ru`) Conjugations | `group`, `pair`, `level`, `definition`, `antonyms`, `tenses` (`present_future`, `past`, `imperative`), `usage_hint`, `irregular` |
| `shared/data/verbs-el.json` | JSON Object (dict) | Greek (`el`) Conjugations | `group`, `voice`, `level`, `definition`, `antonyms`, `tenses` (`present`, `imperfect`, `future`, `aorist`, `perfect`), `usage_hint`, `irregular` |
| `shared/data/verbs-en.json` | JSON Object (dict) | English (`en`) Irregular Verbs | `base`, `past_simple`, `past_participle`, `third_person_singular`, `pattern_group`, `level`, `definition`, `examples` |
| `shared/data/genders-fr.json` | JSON Object (dict) | French (`fr`) Noun Genders | `gender`, `level`, `definition`, `antonyms`, `article`, `plural`, `irregular`, `indefinite_article` |
| `shared/data/genders-it.json` | JSON Object (dict) | Italian (`it`) Noun Genders | `gender`, `level`, `definition`, `antonyms`, `article`, `plural`, `irregular`, `indefinite_article` |
| `shared/data/genders-ru.json` | JSON Object (dict) | Russian (`ru`) Noun Genders & Cases | `gender`, `level`, `definition`, `antonyms`, `cases` (`nom_sing`, `gen_sing`, `dat_sing`, `acc_sing`, `ins_sing`, `pre_sing`, `nom_plur`, `gen_plur`), `irregular` |
| `shared/data/genders-el.json` | JSON Object (dict) | Greek (`el`) Noun Genders & Cases | `gender`, `level`, `definition`, `antonyms`, `cases` (`nom_sing`, `gen_sing`, `acc_sing`, `voc_sing`, `nom_plur`, `gen_plur`, `acc_plur`), `irregular` |
| `shared/data/case-endings-ru.json` | JSON Object (dict) | Russian (`ru`) Case System Rules | `language`, `language_name`, `cases` (list of objects with `id`, `name`, `question`, `usage`, `endings`, `examples`) |
| `shared/data/case-endings-el.json` | JSON Object (dict) | Greek (`el`) Case System Rules | `language`, `language_name`, `cases` (list of objects with `id`, `name`, `question`, `usage`, `endings`, `examples`) |
| `shared/data/preposition-rules.json` | JSON Object (dict) | Preposition Rules (`en`, `fr`, `it`, `ru`, `el`) | Keyed by language code (`en`, `fr`, `it`, `ru`, `el`). Value is list of objects with `verb`/`word`, `preposition`, `level`, `grammar_rule`, `examples`, `common_mistake` |

---

### 1.2 Tool-Specific Data Files (`tools/<lang>/<tool>/data/`)

#### Conjugation Engines (`conjugeur`, `coniugatore`, `spryazhenie`, `klisi-rimaton`, `konjugation`)
- **Covered Languages:** `ba`, `br`, `cv`, `de`, `el`, `es`, `fr`, `hy`, `it`, `ka`, `pt`, `ru`, `tt` (13 languages).
- **Format:** JSON Object keyed by verb infinitive/base form.
- **Key Fields:**
  - `group` (string): Conjugation group/class (e.g. `"1er groupe"`, `"1-е спряжение"`).
  - `level` (string): CEFR level (`"A1"`, `"A2"`, `"B1"`, `"B2"`).
  - `definition` (string): Primary English definition or translation.
  - `tenses` (object): Map of tense names to lists/objects of conjugated forms.
  - `auxiliary` (string, optional): Auxiliary verb used in compound tenses (`"avoir"`, `"être"`, `"avere"`, `"essere"`).
  - `pair` (string, optional): Aspectual counterpart in Slavic languages (e.g., Russian НСВ/СВ).
  - `voice` (string, optional): Voice in Greek (Active/Passive).
  - `needs_review` / `review_notes` (boolean/string, optional): Curation flags.

#### Noun Gender & Case Declension Engines (`genre`, `genere`, `genus`, `rod-padezhi`, `genos-ptoseis`, `cases`)
- **Covered Languages:** `ba`, `br`, `cv`, `de`, `el`, `es`, `fr`, `hy`, `it`, `ka`, `pt`, `ru`, `tt` (13 languages).
- **Format:** JSON Object keyed by noun singular form.
- **Key Fields:**
  - `gender` (string): Grammatical gender (`"Masculin"`, `"Féminin"`, `"Neutre"`, `"Мужской"`, etc.).
  - `article` (string): Definite article singular.
  - `indefinite_article` (string, optional): Indefinite article singular.
  - `plural` (string): Nominative plural form.
  - `cases` (object, optional): Case declension table using standardized suffixes (`nom_sing`, `gen_sing`, `dat_sing`, `acc_sing`, `ins_sing`, `pre_sing`, `loc_sing`, `voc_sing`, `nom_plur`, `gen_plur`, `acc_plur`).
  - `level` / `definition` / `examples` (strings/lists): Pedagogical metadata.

#### Prepositional Regimes & Verb Syntax Engines (`verb-prep`, `regime`, `reggenza`, `praepositionen`, `syntaxi`)
- **Covered Languages:** `de`, `el`, `en`, `fr`, `it` (5 languages).
- **Format:** JSON Objects split across `verbs.json`, `nouns.json`, `adjectives.json`, or `two_way_prepositions.json`.
- **Key Fields:**
  - `prepositions` (string/list): Governing preposition(s) (e.g. `"a"`, `"di"`, `"über (+ Akk)"`).
  - `pattern` (string): Syntactic construction pattern (e.g. `"verb + à + quelqu'un"`).
  - `grammar_rule` (string): Specific usage rule explanation.
  - `common_mistake` (string): Typical learner error warning with correct usage.
  - `examples` (list of objects): Example sentences with translations.

#### Specialized Engines (`en/irregular-verbs`, `en/speaking-bot`)
- `tools/en/irregular-verbs/data/verbs.json`: 215 English irregular verbs with V1, V2, V3, 3rd person singular, pattern group, subgroup, and vowel pattern tags.
- `tools/en/speaking-bot/data/scenarios.json`: Interactive conversational scenario triggers and roleplay prompts.

---

### 1.3 Raw Lexicon & Morphology Data Files (`tools/<lang>/data/`)

- **Files:** `tools/<lang>/data/lexicon.json`, `tools/<lang>/data/morphology.json`, `tools/<lang>/data/kaikki.json`
- **Covered Languages:** `ba`, `br`, `cv`, `de`, `el`, `en`, `es`, `fr`, `hy`, `it`, `ka`, `pt`, `ru`, `tt` (14 languages).
- **Format:** JSON Objects produced by automated extraction pipelines (UniMorph and Kaikki/Wiktionary dumps) aggregating lemma forms, POS tags, inflectional tags, and translations.

---

## 2. Comparison with `COSYlanguages/reference-grammar/`

A structural comparison was conducted against the `COSYlanguages` repository tree (`reference-grammar/<lang>/`).

### 2.1 Coverage & Architecture Comparison Matrix

| Domain / Language | `COSYtools` Engine Data | `COSYlanguages/reference-grammar/` Data | Coverage Notes |
| :--- | :--- | :--- | :--- |
| **Languages Supported** | `ba`, `br`, `cv`, `de`, `el`, `en`, `es`, `fr`, `hy`, `it`, `ka`, `pt`, `ru`, `tt` (14 languages) | `br`, `de`, `el`, `en`, `es`, `fr`, `hy`, `it`, `ka`, `pt`, `ru`, `tt` (12 languages) | `ba` (Bashkir) and `cv` (Chuvash) are **only** present in `COSYtools`. |
| **Verbs / Conjugation** | **Deep Interactive Datasets**: Individual verb entries (80–370+ verbs per lang) with full tense arrays, aspectual pairs, voice, and offline practice links. | **High-Level Rule Schemas**: `morphology/verbs.json` containing group definitions, ending rule patterns, and lesson markdown/JSON references. | `COSYtools` contains complete conjugation lookup tables; `COSYlanguages` contains rule metadata. |
| **Nouns / Gender / Cases** | **Deep Declension Tables**: Detailed noun entries with exact case forms (`nom_sing`, `gen_sing`, etc.), article rules, and SRS practice items. | **Category Metadata**: `morphology/nouns.json` & `morphology/cases.json` specifying case lists, question triggers, and high-level rules. | `COSYtools` holds concrete declension dictionary items; `COSYlanguages` holds textbook lesson outlines. |
| **Prepositions & Regimes** | **Syntax Regimes Datasets**: Detailed verb/adjective/noun prepositional government entries across 5 major languages. | **Particle Lists**: `particles/prepositions.json` containing basic list of prepositions without detailed verb regimes. | Verb syntax regimes with common mistake warnings exist **only** in `COSYtools`. |
| **Phonology & Syntax** | None (focused on morphological mechanics). | `phonology/` (sounds, stress, intonation) & `syntax/` (word order, clause types). | Phonology and syntax rule trees exist **only** in `COSYlanguages`. |
| **Lesson Curriculum** | None (focused on reference tables & practice drills). | `lessons/` (A1–B2 lesson cards and reading exercises). | Textbook curriculum cards exist **only** in `COSYlanguages`. |

---

## 3. Single Source of Truth Proposal

### Recommendation: `COSYtools` as Canonical Canonical Source for Grammar Mechanics

Given that `COSYtools` serves explicitly as the "full encyclopedia and reference hub" with dedicated offline lookup engines, UniMorph/Kaikki pipelines, and validated CEFR datasets:

1. **`COSYtools` as Canonical Data Authority**:
   `COSYtools` will be the single canonical source of truth for all morphological datasets (verb conjugations, noun gender/declensions, case tables, prepositional regimes, irregular verb lists).

2. **Role of `COSYlanguages/reference-grammar/`**:
   `COSYlanguages/reference-grammar/` should cease maintaining duplicate morphology tables. Instead:
   - `COSYlanguages` will retain lesson plans, phonology, and prose grammar explanations.
   - Any raw morphology JSON files in `COSYlanguages` should be converted into re-export links or directly fetch `COSYtools` JSON endpoints.

3. **Technical Rationale**:
   - `COSYtools` already maintains strict validation scripts (`scripts/validate_levels.js`, `scripts/assert_tenses.js`, `scripts/build_language_lexicons.js`).
   - `COSYtools` data files are structured specifically for real-time frontend search and offline caching.
   - Consolidating morphology into `COSYtools` prevents drift and duplicate curation effort across repos.

---

## 4. COSYgames Link Resolution Audit

All "Practice on COSYgames" links across the repository were audited and spot-checked:

| Source File | Target URL / Pattern | HTTP Resolution Status | Result |
| :--- | :--- | :--- | :--- |
| `README.md` | `https://cosylanguages.github.io/COSYgames/` | **200 OK** | Valid |
| `index.html` | `https://cosylanguages.github.io/COSYgames/` | **200 OK** | Valid |
| `practice/index.html` | `https://cosylanguages.github.io/COSYgames/` | **200 OK** | Valid |
| `conjugation/template.html` | `https://cosylanguages.github.io/COSYgames/` | **200 OK** | Valid |
| `gender/index.html` | `https://cosylanguages.github.io/COSYgames/` | **200 OK** | Valid |
| `cases/index.html` | Dynamic link via `COSYReferenceUtils.getEcosystemLink('games', ...)` | **200 OK** | Valid |
| `shared/engines/reference-utils.js` | `https://cosylanguages.github.io/COSYgames/` | **200 OK** | Valid |

**Summary**: All COSYgames integration links resolve successfully to active pages without any broken endpoints.
