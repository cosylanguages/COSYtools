# COSYtools 🔎

COSYtools is an offline-first, 100% client-side language reference suite featuring verb conjugators, noun gender checkers, case declension matrices, prepositional regime lookup, and interactive grammar practice drills supporting 14 languages.

Live Website: [https://cosylanguages.github.io/COSYtools/](https://cosylanguages.github.io/COSYtools/)
Ecosystem Hub: [https://cosylanguages.github.io/COSYlanguages/](https://cosylanguages.github.io/COSYlanguages/)

---

## Architecture & Design Principles

1. **Client-Side & Offline-First:** Zero backend server requirement. All verb conjugations, noun declensions, and preposition rules execute in the user's browser using self-hosted fonts and local JSON datasets.
2. **Two-Tier Dataset Architecture:**
   - **Tool-Specific Datasets (`tools/<lang>/<tool>/data/`):** High-precision, structured schemas powering conjugators, case tables, and syntax engines.
   - **Supplemental Lexicon Shards (`tools/<lang>/data/shards/`):** Letter-sharded dictionary data loaded on-demand to keep initial bundle sizes under 1.5 MB.
3. **Ecosystem Integration:** Standardized headword deep-linking and integration with COSYdata, COSYgames, COSYplatform, and COSYevents.

---

## Catalog Schema & Status Meanings (`catalog.json`)

The central inventory is maintained in `catalog.json`. Each entry defines:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique tool identifier (e.g. `fr-conjugeur`, `ru-rod-padezhi`). |
| `language` | `string` | Two-letter ISO 639-1 language code (e.g. `fr`, `ru`, `de`). |
| `type` | `string` | Task category: `conjugation`, `gender-case`, `syntax`, or `speaking`. |
| `status` | `string` | Maturity level: `stable`, `beta`, or `stub`. |
| `title` | `string` | Native-language display title. |
| `description` | `string` | Native-language summary of features. |
| `entry_url` | `string` | Relative path to canonical HTML entry point. |
| `data_file_paths` | `array` | Relative paths to JSON datasets loaded by the tool. |
| `entry_counts` | `object` | Total and per-file record counts. |

### Status Meanings
- **`stable`:** Comprehensive, verified dataset and fully featured interactive tool. Visible by default.
- **`beta`:** Fully functional tool with a growing dataset. Visible by default.
- **`stub`:** Tool page in active development. Hidden by default in the hub unless *"Show tools in development"* is enabled.

---

## Supported URL Query Parameters & Deep Linking

All COSYtools engines accept headword query parameters on page load to link directly to specific lexical entries:

- **Verb Conjugators:** `?verb=<lemma>` or `?infinitive=<lemma>`
  *Example:* `https://cosylanguages.github.io/COSYtools/tools/fr/conjugeur/?verb=avoir`
- **Noun Gender & Case Checkers:** `?word=<noun>` or `?noun=<noun>`
  *Example:* `https://cosylanguages.github.io/COSYtools/tools/de/genus/?noun=Haus`
- **Preposition & Syntax Regimes:** `?q=<keyword>` or `?search=<keyword>`
  *Example:* `https://cosylanguages.github.io/COSYtools/tools/it/reggenza/?q=pensare`
- **Hub Page Filtering:** `?lang=<code>`, `?type=<type>`, `?q=<search>`, `?dev=1`
  *Example:* `https://cosylanguages.github.io/COSYtools/?lang=de&type=conjugation`

---

## How to Run Validation Scripts & Tests

COSYtools includes automated test suites covering syntax, templates, hub rendering, catalog integrity, broken links, deep-link parameter parsing, accessibility, security, and linguistic rules.

```bash
# Install development dependencies
npm install

# Rebuild the main hub (index.html) from catalog.json
npm run generate:hub

# Run the complete test suite
npm test
```

### Individual Check Commands:
```bash
npm run check:js-syntax      # Validate JavaScript file syntax
npm run check:inline-js      # Validate inline HTML <script> syntax
npm run check:shell          # Verify shell strip and footer HTML template synchronization
npm run check:hub            # Verify hub rendering against catalog.json
npm run validate:catalog     # Validate catalog schema, file existence, and record counts
npm run check:links          # Detect broken local links and test deep-link parameter parsing
npm run test:hub             # Test hub filter and search state behavior (jsdom)
npm run check:fonts          # Audit self-hosted web font links
npm run check:a11y           # Audit HTML pages for accessibility compliance
npm run validate:linguistic  # Perform language-aware structural and grammatical validation
npm run test:security        # Test XSS sanitization, SSO token origin checks, and CSP
npm run check:smoke          # Run browser smoke test (requires Chrome)
```

---

## How to Add a New Tool or Language Dataset

### Step 1: Create Tool Folder & HTML Entry Point
Create a directory under `tools/<lang>/<tool-name>/` with an `index.html` file using standard COSY shared CSS/JS headers:
```html
<link rel="stylesheet" href="../../../shared/css/base.css">
<link rel="stylesheet" href="../../../shared/css/components.css">
<script src="../../../shared/js/shell.js" defer></script>
```

### Step 2: Add Dataset JSON
Place the structured JSON dataset in `tools/<lang>/<tool-name>/data/` (e.g. `verbs.json` or `nouns.json`). Ensure all entries include required fields (`group`, `level`, `definition`, etc.).

### Step 3: Register in `catalog.json`
Add a new entry to `catalog.json` with appropriate `id`, `language`, `type`, `status`, `title`, `description`, `entry_url`, `data_file_paths`, and `entry_counts`.

### Step 4: Rebuild & Validate
```bash
npm run generate:hub
npm test
```

---

## Reporting Linguistic Errors

If you discover a grammatical error, missing tense form, or inaccurate case ending:
1. Open an issue on GitHub describing the language, tool, headword, and expected correction backed by an authoritative dictionary or grammar reference.
2. Alternatively, submit a pull request updating the respective `data/*.json` file, setting `"review_status": "needs_review"` and adding a `"review_notes"` explanation.

---

## Contribution & Licensing Policy

- **Software Code:** Copyright (c) COSY Languages.
- **Linguistic Data:** All reference data is provided for open educational use under a permissive client-side license.
- **Contributions:** Pull requests adding verified language datasets or expanding existing tools are welcomed. New tool folder additions or structural schema modifications require maintainer approval.
