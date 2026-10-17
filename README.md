# COSYtools

COSYtools is a suite of client-side language reference tools, verb conjugators, noun gender checkers, case declension tables, and interactive grammar practice exercises supporting 14 languages (including tools like `tools/en/irregular-verbs/`, `tools/fr/conjugeur/`, and `tools/it/reggenza/`). Visit the live site at [https://cosylanguages.github.io/COSYtools/](https://cosylanguages.github.io/COSYtools/) or explore the main platform at [https://cosylanguages.github.io/COSYlanguages/](https://cosylanguages.github.io/COSYlanguages/).

## Ecosystem Integration & Linking Rules

Other repositories in the COSY ecosystem (such as `COSYlanguages`, `COSYdata`, `COSYplatform`, and `COSYgames`) reference and link into COSYtools engines using the standardized rules below.

### 1. Catalog Discovery (`/catalog.json`)
Every tool available in the repository is indexed in `/catalog.json`. External apps can fetch `https://cosylanguages.github.io/COSYtools/catalog.json` to inspect tool metadata (`id`, `language`, `type`, `status`, `title`, `description`, `keywords`, `entry_url`, `data_file_paths`, `entry_counts`). `title` and `description` are written in the tool's own language. `status` is `stable`, `beta` (usable, still growing) or `stub` (placeholder data; hidden in the hub unless "Show tools in development" is ticked).

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

### 5. Hub Deep Links
The hub filters are mirrored in the URL, so other COSY apps can link to a pre-filtered view: `?lang=<code>`, `?type=conjugation|gender-case|syntax|speaking`, `?q=<text>`, `?dev=1` (include tools in development). Example: `https://cosylanguages.github.io/COSYtools/?lang=de&type=conjugation`.

## Development

```bash
npm install
npm run generate:hub      # rebuild the hub (index.html) from catalog.json
npm run check:js-syntax && npm run check:inline-js && npm run check:shell
npm run check:hub         # hub in sync with catalog + no uncatalogued tool pages
npm run test:hub          # hub filter behaviour (jsdom, no browser needed)
npm run check:smoke       # full browser smoke test (needs Chrome)
```

**Adding a tool:** create `tools/<lang>/<slug>/index.html` (with a native-language `<title>` and `<meta name="description">`), add an entry to `catalog.json` (`id`, `language`, `type`, `status`, `title`, `description`, `entry_url`, `data_file_paths`, `entry_counts`), then run `npm run generate:hub`. CI fails if a tool page exists but is not catalogued, or if `index.html` is stale.

**Data:** runtime data lives in `tools/<lang>/data/` (shards, lexicon, tool JSON). Raw upstream imports (UniMorph, Kaikki) are not tracked in git — see [docs/DATA_PIPELINE.md](docs/DATA_PIPELINE.md).
