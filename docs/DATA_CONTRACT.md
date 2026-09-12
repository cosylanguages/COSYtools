# COSYtools Data Contract Specification (v1.0)

## Overview
This document specifies the official, versioned **Data Contract (v1.0)** for `COSYtools`. It defines stable public REST/URL access patterns, standardized JSON data schemas, offline caching guidelines, and consumption protocols for sibling repositories in the COSY ecosystem (`COSYplatform`, `COSYevents`, `COSYworld`, `COSYgames`, `COSYmanuals`).

---

## 1. Stable JSON Endpoint URL Patterns

External client applications and sibling repositories can reference, fetch, or embed grammar mechanics datasets directly using stable URL paths relative to the `COSYtools` host domain (`https://cosylanguages.github.io/COSYtools/`).

### 1.1 Tool-Specific Datasets (`/tools/<lang>/<feature>/data.json`)

Consumer applications requiring feature-specific morphology tables per language MUST use the following stable URL patterns:

| Feature / Topic | Stable Data Endpoint Path | Example URL |
| :--- | :--- | :--- |
| **Verb Conjugations** | `/tools/<lang>/conjugeur/data/verbs.json` (or language equivalent e.g., `coniugatore`, `spryazhenie`, `klisi-rimaton`, `konjugation`) | `https://cosylanguages.github.io/COSYtools/tools/fr/conjugeur/data/verbs.json` |
| **Noun Gender & Declensions** | `/tools/<lang>/genre/data/nouns.json` (or language equivalent e.g., `genere`, `genus`, `rod-padezhi`, `genos-ptoseis`, `cases`) | `https://cosylanguages.github.io/COSYtools/tools/ru/rod-padezhi/data/nouns.json` |
| **Prepositional Regimes (Verbs)** | `/tools/<lang>/regime/data/verbs.json` (or language equivalent e.g., `reggenza`, `verb-prep`, `praepositionen`, `syntaxi`) | `https://cosylanguages.github.io/COSYtools/tools/en/verb-prep/data/verbs.json` |
| **Prepositional Regimes (Nouns)** | `/tools/<lang>/regime/data/nouns.json` | `https://cosylanguages.github.io/COSYtools/tools/it/reggenza/data/nouns.json` |
| **Prepositional Regimes (Adjectives)**| `/tools/<lang>/regime/data/adjectives.json` | `https://cosylanguages.github.io/COSYtools/tools/de/praepositionen/data/adjectives.json` |
| **Irregular Verbs (English)** | `/tools/en/irregular-verbs/data/verbs.json` | `https://cosylanguages.github.io/COSYtools/tools/en/irregular-verbs/data/verbs.json` |

---

### 1.2 Shared & Global Reference Datasets (`/shared/data/`)

For multi-lingual reference views and aggregated matrices, consumer applications can access:

| Feature / Topic | Stable Data Endpoint Path | Example URL |
| :--- | :--- | :--- |
| **Shared Verb Lists** | `/shared/data/verbs-<lang>.json` | `https://cosylanguages.github.io/COSYtools/shared/data/verbs-fr.json` |
| **Shared Gender Lists** | `/shared/data/genders-<lang>.json` | `https://cosylanguages.github.io/COSYtools/shared/data/genders-it.json` |
| **Case System Matrix** | `/shared/data/case-endings-<lang>.json` | `https://cosylanguages.github.io/COSYtools/shared/data/case-endings-ru.json` |
| **Preposition Rules (Multi-lang)**| `/shared/data/preposition-rules.json` | `https://cosylanguages.github.io/COSYtools/shared/data/preposition-rules.json` |

---

### 1.3 Aggregated Lexicon & Morphology Datasets (`/tools/<lang>/data/`)

For automated pipelines requiring raw lemma inflections and dictionary data:

| Dataset Type | Endpoint Path | Example URL |
| :--- | :--- | :--- |
| **Aggregated Lexicon** | `/tools/<lang>/data/lexicon.json` | `https://cosylanguages.github.io/COSYtools/tools/fr/data/lexicon.json` |
| **UniMorph Raw Morphology** | `/tools/<lang>/data/morphology.json` | `https://cosylanguages.github.io/COSYtools/tools/de/data/morphology.json` |
| **Kaikki / Wiktionary Data** | `/tools/<lang>/data/kaikki.json` | `https://cosylanguages.github.io/COSYtools/tools/br/data/kaikki.json` |

---

## 2. Standardized Data Schemas

### 2.1 Verb Conjugation Schema (`verbs.json`)

The dataset is a JSON object where each top-level key is the verb's infinitive or base dictionary entry.

```json
{
  "parler": {
    "group": "1er groupe",
    "level": "A1",
    "definition": "To speak / express thought by words.",
    "auxiliary": "avoir",
    "antonyms": ["taire", "écouter"],
    "tenses": {
      "indicatif_present": [
        "je parle",
        "tu parles",
        "il/elle parle",
        "nous parlons",
        "vous parlez",
        "ils/elles parlent"
      ],
      "indicatif_imparfait": [ ... ],
      "indicatif_passe_compose": [ ... ],
      "indicatif_futur_simple": [ ... ],
      "conditionnel_present": [ ... ],
      "subjonctif_present": [ ... ]
    },
    "examples": [
      "Je parle français tous les jours."
    ],
    "usage_hint": "Regular -er verb.",
    "irregular": false
  }
}
```

- **Required Fields**: `group`, `level`, `definition`, `tenses`.
- **Optional Fields**: `auxiliary`, `antonyms`, `examples`, `pair` (Slavic aspectual pair), `voice` (Greek voice), `irregular`, `needs_review`.

---

### 2.2 Noun Gender & Declension Schema (`nouns.json`)

Keyed by the nominative singular noun form.

```json
{
  "дом": {
    "gender": "Мужской",
    "level": "A1",
    "definition": "House / home.",
    "antonyms": [],
    "article": "",
    "plural": "дома",
    "cases": {
      "nom_sing": "дом",
      "gen_sing": "дома",
      "dat_sing": "дому",
      "acc_sing": "дом",
      "ins_sing": "домом",
      "pre_sing": "доме",
      "nom_plur": "дома",
      "gen_plur": "домов"
    },
    "irregular": true,
    "needs_review": false
  }
}
```

- **Required Fields**: `gender`, `level`, `definition`.
- **Declension Key Naming Convention**: MUST use `_sing` and `_plur` suffixes (`nom_sing`, `gen_sing`, `dat_sing`, `acc_sing`, `ins_sing`, `pre_sing`, `loc_sing`, `voc_sing`, `nom_plur`, `gen_plur`, `acc_plur`).

---

### 2.3 Prepositional Regimes & Syntax Schema (`verbs.json`, `nouns.json`, `adjectives.json`)

Keyed by base word or phrase entry.

```json
{
  "depend": {
    "word_type": "verb",
    "prepositions": "on / upon",
    "pattern": "depend + on + someone/something",
    "level": "A2",
    "definition": "To rely on or be controlled by.",
    "grammar_rule": "Always followed by 'on' when expressing reliance.",
    "examples": [
      {
        "sentence": "It depends on the weather.",
        "translation": "It depends on the weather."
      }
    ],
    "common_mistake": "❌ depend of ➜ ✅ depend on",
    "synonyms": ["rely on"],
    "antonyms": []
  }
}
```

- **Required Fields**: `prepositions`, `level`, `definition`, `grammar_rule`, `examples`.
- **Optional Fields**: `pattern`, `common_mistake`, `synonyms`, `antonyms`, `related_forms`.

---

## 3. Client Integration & Offline Caching Guidelines

Consumer applications (such as lesson decks in `COSYplatform` or quest cards in `COSYworld`) SHOULD load data using `COSYReferenceUtils.loadData(url)` or implement equivalent HTTP caching:

```javascript
// Recommended client fetch snippet with localStorage caching
async function fetchCosyGrammarData(endpointUrl) {
  const cacheKey = `cosy_cache_${endpointUrl}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) {}
  }
  const res = await fetch(endpointUrl);
  if (!res.ok) throw new Error(`Failed to load ${endpointUrl}: ${res.status}`);
  const data = await res.json();
  try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) {}
  return data;
}
```

---

## 4. Versioning & Backward Compatibility Policy

1. **v1.0 Stability Guarantee**: Standard schema field names (`group`, `level`, `definition`, `tenses`, `cases`, `prepositions`) and file paths listed in Section 1 will remain backward compatible.
2. **Additive Changes**: New optional fields or new language additions will be introduced without incrementing major version numbers.
3. **Breaking Changes**: Any structural removal or renaming of schema keys will require a major version increment (e.g. `v2.0`) and a 6-month deprecation period documented in `MIGRATION-TOOLS.md`.
