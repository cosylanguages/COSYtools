# Ecosystem Canon Source of Truth Policy

This document establishes the official synchronization policy and authority hierarchy for canonical datasets within the COSY ecosystem (**COSYlanguages**, **COSYgames**, **COSYtools**, **COSYworld**, **COSYmanuals**).

---

## 1. Governance & Single Source of Truth Declarations

The COSY ecosystem operates under a **two-canon governance model**:

1. **Vocabulary Canon Authority (COSYdata)**:
   - **COSYdata** is the canonical source of truth for **VOCABULARY UNITS** — one dictionary-style entry per word/sense (definitions, translations, basic grammar tags, examples).
   - *Note on Legacy Stub*: `vocabulary/_canonical/en/A0-A1_master.json` (or any legacy path under `vocabulary/_canonical/`) is a stale 20-entry stub inconsistent with this governance model. It is flagged for removal or replacement with a pointer to COSYdata's stable URL in a follow-up task.
2. **Verb Mechanics Canon Authority (COSYtools)**:
   - **COSYtools** is the canonical source of truth for **DEEPER VERB MECHANICS** — full conjugation tables, prepositional regimes/government, and morphological tables under `tools/<lang>/<tool>/data/*.json`. These deep structures live in COSYtools to avoid bloating dictionary entries in COSYdata.
3. **Downstream Consumer Status**:
   - Other repositories (**COSYgames**, **COSYworld**, **COSYmanuals**, **COSYplatform**) are read-only downstream consumers with respect to both vocabulary and verb mechanics data.
4. **Change Management Protocol**:
   - Downstream repositories must **NEVER** edit local mirror copies directly.
   - Any proposed vocabulary addition, definition change, or spelling correction must be submitted to **COSYdata**.
   - Any proposed verb mechanics update (conjugations, prepositional regimes) must be submitted to **COSYtools**.

---

## 2. Drift Detection Utility Usage

A standalone checker tool is provided in `scripts/check-canon-drift.mjs` to detect and audit drift between local mirror files and canonical files.

### Running the Checker

```bash
# Audit a vocabulary mirror against vocabulary canon source
node scripts/check-canon-drift.mjs path/to/mirror_A0-A1_master.json

# Audit a curriculum mirror against curriculum canon source
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

The following companion note must be added manually to the READMEs of downstream repositories.

### Repositories to Update:
- `COSYgames` (`README.md`)
- `COSYtools` (`README.md`)
- `COSYworld` (`README.md`)
- `COSYmanuals` (`README.md`)

### Snippet to Copy:

```markdown
> ⚠️ **Read-Only Mirror Notice**:
> Vocabulary datasets are synced from [COSYdata](https://github.com/cosylanguages/COSYdata), and verb mechanics datasets are synced from [COSYtools](https://github.com/cosylanguages/COSYtools).
> 
> **Do not edit these dataset files directly in this repository.** Proposed vocabulary changes must be submitted to COSYdata, and verb mechanics changes must be submitted to COSYtools. See `CANON_SOURCE_OF_TRUTH.md` in `COSYtools` for details.
```
