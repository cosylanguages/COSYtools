# Canonical A1 Master List Gap Analysis & Recommendation Report

This report documents the gap analysis performed between COSYtools English practice dataset entries tagged as `A1` and the canonical A0–A1 master vocabulary list (`vocabulary/_canonical/en/A0-A1_master.json` from the COSYlanguages repository).

---

## 1. `tools/en/irregular-verbs/data/verbs.json`

### Confirmed in Canonical A1 List
- **build** (`en_verb_build`, topic: `common_verbs_actions`) - Retained at `A1` level in practice dataset.
- **wake** (`en_verb_wake`, topic: `common_verbs_actions`) - Retained at `A1` level in practice dataset.

### Gaps & Recommendations

| Headword | Current Level | Action Taken / Recommendation | Detailed Reasoning |
| :--- | :---: | :--- | :--- |
| **hit** | A1 ➔ **A2** | Relabeled to `A2` locally | High-frequency physical impact verb. Not present in canonical A1 list; appropriate for early elementary (A2) verb list. |
| **steal** | A1 ➔ **A2** | Relabeled to `A2` locally | Elementary crime/property verb. Belongs in A2 rather than essential beginner A1 vocabulary. |
| **become** | A1 ➔ **A2** | Relabeled to `A2` locally; **Recommend upstream addition to A1 canon** | Core linking verb. Highly fundamental; recommended for addition to upstream A1 master vocabulary. Relabeled to A2 locally in the interim for alignment. |
| **hide** | A1 ➔ **A2** | Relabeled to `A2` locally | Common action verb, suitable for A2 level learning. |
| **set** | A1 ➔ **A2** | Relabeled to `A2` locally | Polysemous verb with complex usage; better suited for A2 level in practice modules. |
| **let** | A1 | **Recommend upstream addition to A1 canon** | Essential permission/causative verb (`let's`, `let me`). High frequency at beginner level; recommended for upstream addition to A1 master list. Retained as A1 locally. |

---

## 2. `tools/en/verb-prep/data/verbs.json`

### Gaps & Recommendations

| Headword | Current Level | Action Taken / Recommendation | Detailed Reasoning |
| :--- | :---: | :--- | :--- |
| **pick up** | A1 | **Recommend upstream addition to A1 canon** | Very high-frequency phrasal verb used in everyday contexts (picking up objects, calls, skills). Recommended for upstream addition to A1 canon. |
| **apply** | A1 | **Recommend upstream addition to A1 canon** | Essential verb for job, visa, and school applications (`apply for`). Very common for beginner adult learners. |
| **belong to** | A1 | **Recommend upstream addition to A1 canon** | Core possession prepositional verb (`belongs to me`). Essential A1 concept. |
| **search** | A1 | **Recommend upstream addition to A1 canon** | Fundamental internet and navigation verb (`search for`). Essential A1 beginner vocabulary. |
| **greet** | A1 | **Recommend upstream addition to A1 canon** | Basic social interaction verb (greetings, welcoming). Primary A1 context word. |
| **enter** | A1 | **Recommend upstream addition to A1 canon** | Fundamental movement/place verb (`enter a room/building`). Basic A1 vocabulary. |
| **reach** | A1 | **Recommend upstream addition to A1 canon** | Fundamental verb for spatial arrival and contact (`reach out`, `reach the destination`). Common A1 concept. |
| **glance at** | A1 ➔ **A2** | Relabeled to `A2` locally | Specific visual aspect verb (quick look). Less primary than basic `look at` (which is A1 in canon). |
| **stare at** | A1 ➔ **A2** | Relabeled to `A2` locally | Specific visual aspect verb (fixed look). Suitable for A2 descriptive vocabulary. |
| **resemble** | A1 ➔ **A2** | Relabeled to `A2` locally | Direct transitive state verb (`resemble someone`). A2 level vocabulary. |
| **obey** | A1 ➔ **A2** | Relabeled to `A2` locally | Formal rule-following verb. Better classified at A2 elementary level. |
| **survive** | A1 ➔ **A2** | Relabeled to `A2` locally | Specific state/event verb. Fits elementary A2 level better than foundational A1. |

---

## 3. `tools/en/verb-prep/data/nouns.json`

### Gaps & Recommendations

| Headword / Collocation | Current Level | Action Taken / Recommendation | Detailed Reasoning |
| :--- | :---: | :--- | :--- |
| **sort of** | A1 | **Recommend upstream addition to A1 canon** | Common qualification expression / noun collocations (`a sort of...`). Recommended for upstream A1 canon. |
| **lot of** | A1 | **Recommend upstream addition to A1 canon** | Essential quantifier expression (`a lot of...`). Universal beginner A1 vocabulary. |
| **request for** | A1 | **Recommend upstream addition to A1 canon** | Common polite request structure (`request for information`). Important A1 communication phrase. |
| **interest in** | A1 | **Recommend upstream addition to A1 canon** | Fundamental expression of preferences (`interest in art/music`). Core A1 vocabulary concept. |
| **way to** | A1 | **Recommend upstream addition to A1 canon** | Crucial direction and method expression (`way to the station`). Universal A1 topic. |
| **invitation to** | A1 | **Recommend upstream addition to A1 canon** | Core social event noun phrase (`invitation to a party`). Standard A1 beginner topic. |
| **slice of** | A1 | **Recommend upstream addition to A1 canon** | Basic food quantifier noun phrase (`slice of pizza/bread`). Standard A1 food vocabulary. |
| **place for** | A1 | **Recommend upstream addition to A1 canon** | Fundamental spatial concept (`place for lunch/meeting`). Universal A1 vocabulary. |
| **belief in** | A1 ➔ **A2** | Relabeled to `A2` locally | Abstract philosophical/conviction noun phrase. Better suited for A2 level practice. |

---

## 4. `tools/en/verb-prep/data/adjectives.json`

### Gaps & Recommendations

| Headword / Collocation | Current Level | Action Taken / Recommendation | Detailed Reasoning |
| :--- | :---: | :--- | :--- |
| **interested in** | A1 | **Recommend upstream addition to A1 canon** | Fundamental adjective preposition pairing (`be interested in`). Essential A1 personal description. |
| **crazy about** | A1 | **Recommend upstream addition to A1 canon** | High-frequency informal enthusiasm expression (`crazy about sports`). Very common beginner phrase. |
| **mad about** | A1 | **Recommend upstream addition to A1 canon** | High-frequency enthusiasm/emotion expression (`mad about music`). Standard beginner phrase. |
| **fond of** | A1 ➔ **A2** | Relabeled to `A2` locally | Slightly more formal/literary liking expression. Relabeled to A2 for practice alignment. |
| **keen on** | A1 ➔ **A2** | Relabeled to `A2` locally | Idiomatic enthusiasm expression (predominantly British). Fits A2 elementary level better than core A1. |

---

## Summary of Local Dataset Relabeling Actions

- `tools/en/irregular-verbs/data/verbs.json`: Relabeled `hit`, `steal`, `become`, `hide`, `set` from `A1` to `A2`.
- `tools/en/verb-prep/data/verbs.json`: Relabeled `glance at`, `stare at`, `resemble`, `obey`, `survive` from `A1` to `A2`.
- `tools/en/verb-prep/data/nouns.json`: Relabeled `belief in` from `A1` to `A2`.
- `tools/en/verb-prep/data/adjectives.json`: Relabeled `fond of`, `keen on` from `A1` to `A2`.

No verb conjugation data, preposition structures, definitions, grammar rules, or example sentences were modified.
