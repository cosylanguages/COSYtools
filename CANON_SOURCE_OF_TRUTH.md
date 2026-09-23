# Ecosystem Canon Source of Truth Policy

This document establishes the official synchronization policy and authority hierarchy for canonical datasets within the COSY ecosystem (**COSYdata**, **COSYtools**, **COSYlanguages**, **COSYgames**, **COSYworld**, **COSYmanuals**, **COSYplatform**).

The COSY ecosystem operates under a **two-canon split governance model**:
- **COSYdata**: Canonical source for **VOCABULARY UNITS** — dictionary-style entries per word/sense (definitions, translations, basic grammar tags, example sentences).
- **COSYtools**: Canonical source for **DEEPER VERB MECHANICS & MORPHOLOGY** — full conjugation tables, prepositional regimes/government, and morphosyntactic mechanics (`tools/<lang>/<tool>/data/*.json` and `shared/data/*.json`).

Downstream repositories (**COSYgames**, **COSYworld**, **COSYmanuals**, **COSYplatform**, **COSYlanguages**) are read-only consumers with respect to both canonical datasets.

---

## 1. Governance & Single Source of Truth Declarations

To prevent data divergence, duplicate maintenance, and drift across ecosystem repositories:

1. **Vocabulary Canon Authority**:
   - **COSYdata** is the canonical source of truth for **VOCABULARY UNITS** across the entire COSY ecosystem. It maintains one dictionary-style entry per word/sense, including definitions, translations, POS tags, CEFR levels, and basic usage examples.
   - Downstream repositories consume vocabulary data from **COSYdata** as read-only mirrors.
   - *Legacy Stub Notice*: The file `vocabulary/_canonical/en/A0-A1_master.json` in **COSYtools** (containing only 20 stub entries) is a stale legacy stub inconsistent with this governance model. It is flagged to be removed or replaced with a pointer to COSYdata's stable canonical URL in a follow-up task. (The file is kept in place in this task to avoid breaking downstream references prior to that cleanup).

2. **Verb Mechanics Canon Authority**:
   - **COSYtools** is the canonical source of truth for **DEEPER VERB MECHANICS & MORPHOLOGY** across the entire COSY ecosystem. This includes all detailed verb datasets in `tools/<lang>/<tool>/data/*.json` and `shared/data/*.json` (covering full conjugation tables across tenses/moods, aspectual pairs, voice, prepositional regimes/government, and noun gender/declension paradigms).
   - This formalizes the architecture recommended in `docs/DATA_INVENTORY.md` ("Single Source of Truth Proposal"). Deeper verb mechanics and full inflectional tables are maintained canonically in **COSYtools** because embedding full conjugation paradigms and syntactic regime rules directly into dictionary entries would unnecessarily bloat **COSYdata** entries.

3. **Curriculum Canon Authority**:
   - `curriculum/en/general/*.json` (e.g., `A1.json`, `A2.json`, etc.) in **COSYlanguages** is the **sole writable master copy** of general-course curriculum data for the entire COSY ecosystem.

4. **Read-Only Mirror Requirement**:
   - Any other repository or application within the COSY ecosystem holding a copy or subset of vocabulary, verb mechanics, or curriculum datasets MUST treat its local copy as a **read-only mirror** and label it as such.

5. **Change Management Protocol**:
   - Downstream repositories must **NEVER** edit local mirror copies directly.
   - Proposed vocabulary additions, definition edits, or translation corrections must be submitted as Issues or PRs to **COSYdata**.
   - Proposed changes to conjugation paradigms, verb syntax, prepositional regimes, or morphological rules must be submitted as Issues or PRs to **COSYtools**.
   - Proposed curriculum additions or lesson adjustments must be submitted as Issues or PRs to **COSYlanguages**.

---

## 2. Drift Detection Utility Usage

A standalone checker tool conceptualized in `scripts/check-canon-drift.mjs` can be used to detect and audit drift between local mirror files and the canonical sources.

### Running the Checker

```bash
# Audit a vocabulary mirror against COSYdata canonical dataset
node scripts/check-canon-drift.mjs path/to/mirror_vocabulary.json

# Audit a curriculum mirror against curriculum/en/general/A1.json
node scripts/check-canon-drift.mjs path/to/mirror_A1.json
```

### Options & Auto-Detection
- **Automatic Schema Detection**: The script automatically detects whether the input file is a **Vocabulary Canon** dataset or a **Curriculum** dataset.
- **Explicit Canon Target**: You can optionally pass `--canon <path_to_canon_file>` to override the canonical target file.

### Output Format
The checker outputs report blocks detailing:
- **Added Elsewhere**: Words or lessons present in the mirror but missing from the local canon source of truth.
- **Missing Elsewhere**: Words or lessons present in the local canon source of truth but missing from the mirror.
- **Field Modifications**: Mismatched POS, definitions, topics, or lesson titles between mirror and canon.

---

## 3. Propagation Notes for Sub-Repository READMEs

The following companion note must be included in the READMEs of downstream repositories.

### Repositories to Update:
- `COSYgames` (`README.md`)
- `COSYworld` (`README.md`)
- `COSYmanuals` (`README.md`)
- `COSYplatform` (`README.md`)
- `COSYlanguages` (`README.md`)

### Snippet to Copy:

```markdown
> ⚠️ **Read-Only Mirror Notice**:
> The vocabulary datasets in this repository are **read-only mirrors** synced from [COSYdata](https://github.com/cosylanguages/COSYdata) (the canonical source for vocabulary units), and verb mechanics / conjugation tables are synced from [COSYtools](https://github.com/cosylanguages/COSYtools) (the canonical source for verb mechanics). General curriculum files (`A1.json` - `C2.json`) are synced from [COSYlanguages](https://github.com/cosylanguages/COSYlanguages).
> 
> **Do not edit these dataset files directly in this repository.** Proposed changes must be submitted to their respective canonical repositories:
> - Vocabulary entries & definitions ➔ [COSYdata](https://github.com/cosylanguages/COSYdata)
> - Conjugations & verb syntax regimes ➔ [COSYtools](https://github.com/cosylanguages/COSYtools)
> - Curriculum structure & lesson cards ➔ [COSYlanguages](https://github.com/cosylanguages/COSYlanguages)
```
