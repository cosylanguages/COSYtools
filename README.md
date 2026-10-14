# COSYtools

COSYtools is a suite of client-side language reference tools, verb conjugators, noun gender checkers, case declension tables, and interactive grammar practice exercises supporting 14 languages (including tools like `tools/en/irregular-verbs/`, `tools/fr/conjugeur/`, and `tools/it/reggenza/`). Visit the live site at [https://cosylanguages.github.io/COSYtools/](https://cosylanguages.github.io/COSYtools/) or explore the main platform at [https://cosylanguages.github.io/COSYlanguages/](https://cosylanguages.github.io/COSYlanguages/).

## Ecosystem Integration & Linking Rules

Other repositories in the COSY ecosystem (such as `COSYlanguages`, `COSYdata`, `COSYplatform`, and `COSYgames`) reference and link into COSYtools engines using the standardized rules below.

### 1. Catalog Discovery (`/catalog.json`)
Every tool available in the repository is indexed in `/catalog.json`. External apps can fetch `https://cosylanguages.github.io/COSYtools/catalog.json` to inspect tool metadata (`id`, `language`, `type`, `entry_url`, `data_file_paths`, `entry_counts`).

### 2. Standardized Tool Paths
- **Canonical Tool Entry Points:** `tools/<lang>/<tool-name>/index.html` (e.g., `tools/fr/conjugeur/index.html`, `tools/en/irregular-verbs/index.html`, `tools/it/reggenza/index.html`).
- **Category Redirect Routes:** Permanent redirect stubs under `/conjugation/`, `/gender/`, `/cases/`, `/prepositions/`, `/verb-patterns/`, and `/noun-declensions/` forward seamlessly to canonical paths (preserving query parameters).

### 3. Deep Linking & Headword Query Parameters
All reference tools process query parameters upon initialization to automatically filter or search for specific headwords:
- Verb Conjugators: `?verb=<lemma>` or `?infinitive=<lemma>` (e.g. `https://cosylanguages.github.io/COSYtools/tools/fr/conjugeur/?verb=avoir`)
- Noun Gender & Case Checkers: `?word=<noun>` or `?noun=<noun>` (e.g. `https://cosylanguages.github.io/COSYtools/tools/de/genus/?noun=Haus`)
- Preposition & Syntax Regimes: `?q=<word>` or `?search=<word>` (e.g. `https://cosylanguages.github.io/COSYtools/tools/it/reggenza/?q=pensare`)

### 4. COSYdata `related_forms` Pointers
In `COSYdata` dictionary datasets, vocabulary entries link directly to COSYtools reference engines using the standard format:
`COSYtools:<tool-id>:<headword>`

Examples:
- `COSYtools:fr-conjugeur:être` -> resolves to `https://cosylanguages.github.io/COSYtools/tools/fr/conjugeur/?verb=être`
- `COSYtools:it-reggenza:pensare` -> resolves to `https://cosylanguages.github.io/COSYtools/tools/it/reggenza/?q=pensare`
- `COSYtools:en-irregular-verbs:go` -> resolves to `https://cosylanguages.github.io/COSYtools/tools/en/irregular-verbs/?verb=go`

The `<tool-id>` values match the exact `id` field declared in `catalog.json`.

Copyright (c) 2026 COSY Languages. All rights reserved.
