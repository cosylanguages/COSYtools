# COSYtools Prioritized Linguistic Review Report

## Executive Summary
This document provides a prioritized, evidence-based audit of linguistic data quality across all **33 catalog tools** and **43 dataset JSON files** in COSYtools, comprising **4,959 total lexical and grammatical records** across 14 languages.

Structural validation (`npm run validate:linguistic`) passes cleanly with 0 errors.

---

## Priority 1: High Priority (Stub & Early Stage Datasets)
Languages in development (`stub` catalog status) contain placeholder paradigms and entries marked with `"needs_review": true`. These require native-speaker linguistic review prior to promoting tools to `beta` or `stable`.

| Language | Tool ID | File Path | Total Entries | Needs Review Entries | Primary Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Armenian (hy)** | `hy-conjugeur` | `tools/hy/conjugeur/data/verbs.json` | 27 | 26 | Verbs need full tense aspect paradigm verification. |
| **Armenian (hy)** | `hy-cases` | `tools/hy/cases/data/nouns.json` | 4 | 2 | Noun declension endings require dialectal check (Eastern vs Western Armenian). |
| **Bashkir (ba)** | `ba-conjugeur` | `tools/ba/conjugeur/data/verbs.json` | 24 | 24 | Turkic affixation rules require native review. |
| **Bashkir (ba)** | `ba-cases` | `tools/ba/cases/data/nouns.json` | 5 | 2 | Case suffix harmony needs review. |
| **Breton (br)** | `br-conjugeur` | `tools/br/conjugeur/data/verbs.json` | 26 | 20 | Mutation rules (initial consonant mutations) require review. |
| **Chuvash (cv)** | `cv-conjugeur` | `tools/cv/conjugeur/data/verbs.json` | 24 | 24 | Affixation patterns require native check. |
| **Chuvash (cv)** | `cv-cases` | `tools/cv/cases/data/nouns.json` | 4 | 4 | Declension suffixes need review. |
| **Georgian (ka)** | `ka-conjugeur` | `tools/ka/conjugeur/data/verbs.json` | 23 | 18 | Screeve and polypersonal agreement paradigms require review. |
| **Georgian (ka)** | `ka-cases` | `tools/ka/cases/data/nouns.json` | 4 | 4 | Case declensions need review. |
| **Tatar (tt)** | `tt-conjugeur` | `tools/tt/conjugeur/data/verbs.json` | 24 | 24 | Turkic tense affixes need review. |
| **Tatar (tt)** | `tt-cases` | `tools/tt/cases/data/nouns.json` | 5 | 2 | Case suffixes need review. |

---

## Priority 2: Medium Priority (Beta Datasets)
Datasets in `beta` status are functional and schema-compliant, but require additional example sentence coverage and verification of minor paradigm exceptions.

| Language | Tool ID | File Path | Total Entries | Primary Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Spanish (es)** | `es-conjugeur` | `tools/es/conjugeur/data/verbs.json` | 104 | Tense paradigms valid; needs expanded example sentence coverage. |
| **Spanish (es)** | `es-genre` | `tools/es/genre/data/nouns.json` | 62 | Article and plural forms verified; needs expanded exception notes. |
| **German (de)** | `de-genus` | `tools/de/genus/data/nouns.json` | 65 | Gender values mapped to standard German terms (`Maskulinum`, `Femininum`, `Neutrum`). |
| **Portuguese (pt)**| `pt-conjugeur` | `tools/pt/conjugeur/data/verbs.json` | 101 | Tense paradigms valid; needs regional variant tags (European vs Brazilian). |
| **Portuguese (pt)**| `pt-genre` | `tools/pt/genre/data/nouns.json` | 62 | Gender and plurals verified. |

---

## Priority 3: Low Priority (Stable Core Datasets)
Datasets in `stable` status contain comprehensive grammatical paradigms and definitions.

| Language | Tool ID | File Path | Total Entries | Status |
| :--- | :--- | :--- | :--- | :--- |
| **English (en)** | `en-irregular-verbs` | `tools/en/irregular-verbs/data/verbs.json` | 215 | Verified. |
| **English (en)** | `en-verb-prep` | `tools/en/verb-prep/data/*.json` | 554 | Verified. |
| **French (fr)** | `fr-conjugeur` | `tools/fr/conjugeur/data/verbs.json` | 237 | Verified. |
| **French (fr)** | `fr-genre` | `tools/fr/genre/data/nouns.json` | 357 | Verified. |
| **French (fr)** | `fr-regime` | `tools/fr/regime/data/*.json` | 244 | Verified. |
| **Italian (it)** | `it-coniugatore` | `tools/it/coniugatore/data/verbs.json` | 195 | Verified. |
| **Italian (it)** | `it-genere` | `tools/it/genere/data/nouns.json` | 331 | Verified. |
| **Italian (it)** | `it-reggenza` | `tools/it/reggenza/data/*.json` | 518 | Verified. |
| **Russian (ru)** | `ru-spryazhenie` | `tools/ru/spryazhenie/data/verbs.json` | 404 | Verified. |
| **Russian (ru)** | `ru-rod-padezhi` | `tools/ru/rod-padezhi/data/nouns.json` | 283 | Verified. |
| **Greek (el)** | `el-klisi-rimaton` | `tools/el/klisi-rimaton/data/verbs.json` | 143 | Verified. |
| **Greek (el)** | `el-genos-ptoseis` | `tools/el/genos-ptoseis/data/nouns.json` | 269 | Verified. |
| **Greek (el)** | `el-syntaxi` | `tools/el/syntaxi/data/*.json` | 352 | Verified. |
| **German (de)** | `de-konjugation` | `tools/de/konjugation/data/verbs.json` | 158 | Verified. |
| **German (de)** | `de-praepositionen`| `tools/de/praepositionen/data/*.json` | 130 | Verified. |

---

## Language-Specific Validation Limitations
1. **Agglutinative Suffix Harmony (Turkic & Uralic Languages):** Bashkir, Tatar, and Chuvash possess vowel harmony and consonant assimilation rules that require morphological analyzer integration (e.g., UniMorph) rather than plain regex pattern matching.
2. **Grammatical Voice & Aspectual Imperfective/Perfective Pairs:** Slavic (Russian) aspectual pairs and Greek passive/active voices require contextual dictionary lookup rather than algorithmic generation.
3. **Breton Initial Mutations:** Breton initial consonant mutations (soft, hard, spirant, nasal) vary depending on preceeding particle syntax and require sentence-level parsing.
