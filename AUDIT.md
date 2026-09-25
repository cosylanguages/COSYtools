# COSYtools Front-End Audit Report 🛠️

This report presents a thorough, read-and-report front-end audit across the 12 core COSYtools applications (`tools/fr/conjugeur`, `tools/it/coniugatore`, `tools/ru/spryazhenie`, `tools/el/klisi-rimaton`, `tools/fr/genre`, `tools/it/genere`, `tools/ru/rod-padezhi`, `tools/el/genos-ptoseis`, `tools/en/verb-prep`, `tools/fr/regime`, `tools/it/reggenza`, `tools/el/syntaxi`) and the main hub (`index.html`).

---

## 🎨 VISUAL / CSS AUDIT

### Design Token Usage & Theme Consistency
- **Shared Tokens:** All 12 tool applications correctly import `shared/css/cosy-tokens.css`, `tokens.css`, `base.css`, `components.css`, `layout.css`, and `tools.css`. Design tokens (`var(--sage-primary)`, `var(--cream-bg)`, `var(--ink)`, `var(--ref-surface)`, `var(--border-radius-lg)`) are consistently referenced across header bars, search inputs, result containers, and practice cards.
- **Color Scheme Uniformity:** Color-coded grammatical markup (e.g., green `.stem` and orange/red `.ending` spans in verb conjugation and noun declension tables) uses consistent CSS classes and variables defined in `shared/css/tools.css` and `shared/styles/reference.css`.
- **Minor Token Divergence:** A few tool-specific CSS files (e.g., `tools/en/irregular-verbs/` and `tools/fr/regime/`) define inline hex colors (e.g., `#416b49`, `#1c1917`) instead of strictly using CSS custom variables (`var(--sage-primary)`, `var(--ink)`).

### Practice Game UI & SRS Pattern
- **Standardized Practice Card Structure:** Practice game interfaces consistently utilize the `.practice-box`, `.game-prompt-box`, and `.feedback-card` component hierarchy.
- **Feedback Styling:** Right/wrong feedback cards are styled uniformly using `.feedback-card.correct` (pale green background with dark green text and checkmark) and `.feedback-card.wrong` (pale red background with error message).
- **Control Buttons:** Practice mode toggles ("Mode Entraînement" / "Mode Dictionnaire" or "Practice Mode" / "Lookup Mode") follow identical pill button patterns and badge styling across tools.

### Responsive Behavior (Complex Grammar Tables & Matrices)
- **Russian Case Declension (`tools/ru/rod-padezhi/`):** The 6-case declension matrix is wrapped in a `.table-wrap` container with `overflow-x: auto`. On narrow viewports (<600px), the table scrolls smoothly horizontally without breaking the page layout.
- **Greek Case Matrix (`tools/el/genos-ptoseis/`):** The 4-case Greek declension table uses identical `.table-wrap` responsive scrolling wrappers with sticky first column headers, preserving readability on mobile devices.
- **French Noun Gender & Plural Engine (`tools/fr/genre/`):** Flexbox grid layouts for singular/plural form comparisons wrap cleanly into stacked single-column cards on mobile viewports.

---

## 🏗️ STRUCTURAL / LOGIC AUDIT

### Catalog Links & Navigation (`index.html`)
- **Link Integrity:** All 12 tool cards in `index.html` point to valid relative paths (`tools/fr/conjugeur/`, `tools/it/coniugatore/`, `tools/ru/spryazhenie/`, `tools/el/klisi-rimaton/`, `tools/fr/genre/`, `tools/fr/regime/`, `tools/ru/rod-padezhi/`, `tools/en/verb-prep/`, `tools/it/genere/`, `tools/it/reggenza/`, `tools/el/genos-ptoseis/`). Zero dead links were detected.
- **Tool Descriptions & Badges:** Each card cleanly details the language, category, and feature summary (e.g., aspectual pairs for Russian, contracted verb classes for Greek, preposizioni articolate for Italian).

### `localStorage` Namespacing & SRS Isolation
- **Consistent Namespacing:** Tools that instantiate `SpacedRepetitionStore` use unique, prefix-namespaced keys:
  - `cosy-fr-conjugeur`
  - `cosy-it-coniugatore`
  - `cosy-ru-spryazhenie`
  - `cosy-el-klisi-rimaton`
  - `cosy-en-irregular-verbs`
  - `cosy-en-verb-prep`
  - `cosy-fr-regime`
  - `cosy-it-reggenza`
  - `cosy-el-syntaxi`
- **Zero Key Collision:** Progress data, streaks, and SRS interval weights are completely isolated per tool. Progress in Italian prepositions cannot corrupt or overwrite French conjugation data.
- **Gender Tools State:** Gender checkers (`tools/fr/genre`, `tools/it/genere`, `tools/ru/rod-padezhi`, `tools/el/genos-ptoseis`) maintain game scores in runtime memory during active sessions without persisting SRS state, avoiding unnecessary `localStorage` pollution.

### Code Duplication Across Tools
- **Conjugation Engines:** Each conjugation engine (`tools/fr/conjugeur/js/engine.js`, `tools/it/coniugatore/js/engine.js`, `tools/ru/spryazhenie/js/engine.js`, `tools/el/klisi-rimaton/js/engine.js`) implements near-identical logic for search input handling, suggestion popup rendering, stem/ending color coding, and game question selection (`nextGameQuestion`, `checkGameAnswer`).
- **Preposition & Regime Engines:** `tools/fr/regime/`, `tools/it/reggenza/`, `tools/en/verb-prep/`, and `tools/el/syntaxi/` share duplicate code patterns for multiple-choice distractor generation (`sanitizeUsageHint`, `nextPrepositionQuestion`).
- **Refactoring Opportunity:** Abstracting common engine search and game loop logic into a base `BaseReferenceEngine` class in `shared/js/engine.js` would eliminate ~600 lines of duplicated code across the 12 tools.

---

## 📱 UX / UI AUDIT

### Direct Landing & Navigation Context
- **Sticky Header & Breadcrumbs:** Every tool page features the sticky navigation bar (`.sd-sticky-header`) with explicit breadcrumbs (e.g., `COSYtools / Conjugueur Français`) linking directly back to the `index.html` hub (`../../index.html`).
- **Ecosystem Navigation:** Top jump-links (`Home`, `Practice Hub`, `Games`, `Tools`, `Events`) ensure users arriving via direct deep-link or search engine land with full context and can navigate anywhere in the COSY ecosystem in one click.

### Practice / SRS Game UX
- **Instructions & Prompts:** Questions clearly display the target verb/noun prompt, tense/case badge, and pronoun context (e.g., *`parler` · Présent · `nous`*).
- **Feedback Quality:** Instant visual feedback is provided upon submission with exact correct answers displayed when a user submits an incorrect form.
- **Progress Visibility:** Streak counts and current session score widgets (`game-score`, `game-streak`) update in real-time above the question prompt.

### Accessibility (Semantics & Table Markup)
- **Declension & Case Matrices:** Complex multi-column declension tables in `tools/ru/rod-padezhi/` and `tools/el/genos-ptoseis/` are properly constructed with semantic HTML `<table>`, `<thead>`, `<tbody>`, `<th>`, and `<td>` elements, providing full accessibility for screen-reader navigation.
- **Conjugation Tense Views:** Conjugation engines render tense paradigms using grid-formatted semantic list structures (`<ul>` / `<li>` with `.pronoun` and `.verb-form` spans). While visually clear, wrapping person-by-person paradigms in explicit `<table>` elements or ARIA list roles would further enhance screen reader accessibility.

---

## 🔝 TOP 5 PRIORITY FIXES

1. **Abstract Common Engine Logic into a Shared Base Class:**
   - *Issue:* High duplication of search indexing, suggestion dropdown rendering, and SRS game handlers across the 4 conjugation engines and 4 preposition engines.
   - *Fix:* Create a unified `BaseReferenceEngine` class in `shared/js/engine.js` that individual tools extend.

2. **Standardize Hardcoded Colors to CSS Tokens in Secondary Tool Stylesheets:**
   - *Issue:* Hardcoded hex values (`#416b49`, `#1c1917`) in `tools/en/irregular-verbs/` and `tools/fr/regime/` bypass `cosy-tokens.css`.
   - *Fix:* Replace inline color declarations with `var(--sage-primary)`, `var(--ink)`, and `var(--cream-bg)`.

3. **Enhance Screen-Reader Semantics on Tense Cards:**
   - *Issue:* Tense conjugation cards use `<ul>` lists for person-by-person paradigms without explicit table headers or ARIA attributes.
   - *Fix:* Add `role="table"` / `role="row"` or convert tense cards to lightweight `<table>` grids with `<th scope="col">` for person and form columns.

4. **Persist SRS Progress in Gender & Case Engines:**
   - *Issue:* Gender/case declension engines (`tools/fr/genre/`, `tools/ru/rod-padezhi/`) maintain game score/streak in memory only, resetting progress on page reload.
   - *Fix:* Instantiate `SpacedRepetitionStore` with namespaced keys (e.g. `cosy-fr-genre`, `cosy-ru-rod-padezhi`) so missed gender and declension items are saved to local Weak Spots review.

5. **Add Mobile Sticky Column Headers to Horizontal Scrolling Tables:**
   - *Issue:* On narrow screens (<480px), scrolling horizontally across 6-case Russian declension tables hides case names on the left.
   - *Fix:* Apply `position: sticky; left: 0;` to the first column cells (`th:first-child`, `td:first-child`) inside `.table-wrap`.
