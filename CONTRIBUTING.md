# Contributing to COSY Tools

Thank you for your interest in contributing to **COSY Tools**! We build offline-first, client-side reference engines and practice applications (conjugation, gender, declension, and syntax/prepositions) across multiple languages.

---

## 🛠️ Contribution Guidelines

### 1. Allowed & Welcomed Contributions
You can freely submit Pull Requests without prior maintainer approval for:
- **New Data & Vocabulary Entries**: Expand verb databases, noun gender tables, declension entries, or prepositional regimes within an existing tool's data schema (e.g., `data/verbs.json`).
- **Translations & Explanations**: Improve grammatical definitions, usage hints, antonym lookups, or localized UI strings across supported languages.
- **UI & Bug Fixes**: Enhance CSS responsive layouts, touch interaction, dark mode contrast, keyboard navigation, or performance in `shared/` or tool subdirectories.
- **Validation & Test Enhancements**: Add or refine assertion scripts under `scripts/`.

### 2. Requiring Review & Maintainer Approval
Please open an issue to discuss before submitting PRs that affect:
- **New Tool Folders**: Adding a new standalone tool directory or language engine requires maintainer approval.
- **Shared Architecture Changes**: Modifications to core engine logic (`shared/js/engine.js`), shared UI (`shared/js/ui.js`), or base styling in `shared/css/`.
- **Schema Breaking Changes**: Altering existing JSON schemas or dataset structures in tool folders.

---

## 🎨 Design Tokens Linking Policy

All HTML entry points in tool directories and shared templates **MUST** import or link the master design tokens stylesheet from the `COSYlanguages` repository adhering to the following rules:

- **Pinned URL Requirement**: Always link `css/cosy-tokens.css` via `raw.githubusercontent.com` **pinned to a specific commit SHA or release tag**.
- **No `main` References**: **NEVER** reference `main` directly in consumer imports or `<link>` tags.
- **Load Order**: Place the master design token `<link>` element **before** this repository's local `shared/css` stylesheets.

Example valid link tag:
```html
<link rel="stylesheet" href="https://raw.githubusercontent.com/cosylanguages/COSYlanguages/ba14a13d3c32e84f5c8ebbabd2d8b85c060d04a4/css/cosy-tokens.css">
```

---

## 📋 How to Submit a Pull Request

1. Fork the `COSYtools` repository.
2. Create a feature branch (`git checkout -b feature/add-french-verbs`).
3. Make your changes in accordance with the target tool's schema and structure.
4. Run dataset validation and assertion scripts locally using Node.js:
   ```bash
   node scripts/assert_tenses.js
   node scripts/validate_verbs.js
   node scripts/validate_levels.js
   node scripts/validate_en_irregular_verbs.js
   ```
5. Ensure all modified HTML files conform to the design tokens linking policy.
6. Commit your changes with clear, descriptive commit messages.
7. Push to your fork and submit a Pull Request.
