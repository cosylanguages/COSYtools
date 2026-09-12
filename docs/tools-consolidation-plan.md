# COSYtools Reference Engines Consolidation Plan

## Executive Summary

This document establishes the official consolidation architecture for the original **12 core reference engines** in `COSYtools`. Following an ecosystem-wide architectural comparison between legacy per-language paths (`tools/{lang}/{tool-name}/`) and unified category paths (`conjugation/{lang}/`, `gender/{lang}/`, `cases/{lang}/`, `prepositions/{lang}/`), this plan designates `tools/{lang}/{tool-name}/` as the **canonical source of truth and primary user path** for all 12 engines, and defines permanent client-side redirect specifications for all non-canonical unified paths.

---

## 1. Background & Duplication Audit Rationale

Prior to this consolidation, `COSYtools` maintained two parallel structural trees:
1. **Per-Language Engine Structure (`tools/{lang}/{tool-name}/`)**: Dedicated standalone reference applications containing rich JSON datasets (hundreds of conjugated verbs/nouns, complete case matrices, prepositional regimes), SRS spaced repetition engines (`spaced_repetition.js`, `srs.js`), practice trainers, and custom stylesheets.
2. **Unified Category Structure (`conjugation/`, `gender/`, `cases/`, `prepositions/`)**: Simplified category index pages and template wrappers that originally acted as entry points.

Allowing two active implementations created drift risks and potential routing confusion for ecosystem applications (`COSYlanguages`, `COSYgames`, `COSYworld`, `COSYevents`).

Per the **COSYtools Data Contract (v1.0)** (`docs/DATA_CONTRACT.md`) and **Data Inventory Audit** (`docs/DATA_INVENTORY.md`), the `tools/{lang}/{tool-name}/` structure is established as the canonical source of truth.

---

## 2. 12-Engine Comparison & Canonical Matrix

| # | Reference Engine | Legacy Path (`tools/`) | Unified Path | Dataset Size & Features Comparison | Canonical Path | Redirect Target |
|---|---|---|---|---|---|---|
| **1** | **English Irregular Verbs** | `tools/en/irregular-verbs/` | `conjugation/english/` | **`tools/`**: 215 irregular verbs (100.5 KB), flashcard mode, SRS engine, practice dashboard.<br>**Unified**: Redirect page to 1-sample template. | `tools/en/irregular-verbs/` | `tools/en/irregular-verbs/` |
| **2** | **French Conjugueur** | `tools/fr/conjugeur/` | `conjugation/french/` | **`tools/`**: 200+ French verbs (581.5 KB), all moods/tenses, color-coded endings, practice game.<br>**Unified**: Redirect page to 1-sample template. | `tools/fr/conjugeur/` | `tools/fr/conjugeur/` |
| **3** | **Italian Coniugatore** | `tools/it/coniugatore/` | `conjugation/italian/` | **`tools/`**: 200+ Italian verbs (437.5 KB), aux verbs, antonyms, irregular highlights.<br>**Unified**: Redirect page to 1-sample template. | `tools/it/coniugatore/` | `tools/it/coniugatore/` |
| **4** | **Russian Спряжение** | `tools/ru/spryazhenie/` | `conjugation/russian/` | **`tools/`**: 200+ Russian verbs (449.4 KB), aspectual pairs (НСВ/СВ), stress accents, practice trainer.<br>**Unified**: Redirect page to 1-sample template. | `tools/ru/spryazhenie/` | `tools/ru/spryazhenie/` |
| **5** | **Greek Κλίση Ρημάτων** | `tools/el/klisi-rimaton/` | `conjugation/greek/` | **`tools/`**: 200+ Greek verbs (343.9 KB), active/passive voices, contracted verbs, stress marks.<br>**Unified**: Redirect page to 1-sample template. | `tools/el/klisi-rimaton/` | `tools/el/klisi-rimaton/` |
| **6** | **French Genre & Pluriels** | `tools/fr/genre/` | `gender/french/` | **`tools/`**: French noun gender lookup (92.4 KB), articles, plural rules, ending reliability badges.<br>**Unified**: Redirect page to generic gender hub. | `tools/fr/genre/` | `tools/fr/genre/` |
| **7** | **Italian Genere** | `tools/it/genere/` | `gender/italian/` | **`tools/`**: Italian noun gender lookup (86.1 KB), articles, irregular plurals, practice trainer.<br>**Unified**: Redirect page to generic gender hub. | `tools/it/genere/` | `tools/it/genere/` |
| **8** | **Russian Род & Падежи** | `tools/ru/rod-padezhi/` | `gender/russian/`<br>`cases/russian/` | **`tools/`**: Russian noun gender AND 6-case declension matrix (201.0 KB), ending rules, practice trainer.<br>**Unified**: Redirect pages to generic hub. | `tools/ru/rod-padezhi/` | `tools/ru/rod-padezhi/` |
| **9** | **Greek Γένος & Πτώσεις** | `tools/el/genos-ptoseis/` | `gender/greek/`<br>`cases/greek/` | **`tools/`**: Greek noun gender AND 4-case declension matrix (157.6 KB), accent shifts, practice trainer.<br>**Unified**: Redirect pages to generic hub. | `tools/el/genos-ptoseis/` | `tools/el/genos-ptoseis/` |
| **10** | **English Dependent Prepositions** | `tools/en/verb-prep/` | `prepositions/english/` | **`tools/`**: Verbs, adjectives, nouns datasets (400 KB total), SRS module, quiz drills, dashboard.<br>**Unified**: Redirect page to summary rule list. | `tools/en/verb-prep/` | `tools/en/verb-prep/` |
| **11** | **French Régime Prépositionnel** | `tools/fr/regime/` | `prepositions/french/` | **`tools/`**: French prepositional regimes (155 KB total), SRS module (`srs.js`), practice trainer, custom UI.<br>**Unified**: Redirect page to summary rule list. | `tools/fr/regime/` | `tools/fr/regime/` |
| **12** | **Italian Reggenza Verbale** | `tools/it/reggenza/` | `prepositions/italian/` | **`tools/`**: Italian verb/adjective/noun reggenze (400 KB total), SRS module, practice trainer, dashboard.<br>**Unified**: Redirect page to summary rule list. | `tools/it/reggenza/` | `tools/it/reggenza/` |

---

## 3. Redirect Specification & Data Compatibility

### 3.1 Client-Side Redirect Pattern

Every non-canonical path MUST serve a clean HTML page matching the standard `COSYtools` redirect pattern established in `MIGRATION-TOOLS.md`.

Redirect pages MUST:
1. Include `<meta http-equiv="refresh" content="0;url=CANONICAL_PATH">` in `<head>`.
2. Include JavaScript `window.location.replace()` to execute instant redirection.
3. **Preserve URL Query Parameters**: Forward any search parameters (e.g., `?verb=parler`, `?noun=дом`, `?mode=practice`) to the canonical target URL.
4. Provide a styled fallback button for users with disabled JavaScript.

#### Standard Redirect Snippet Example:
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=../../tools/fr/conjugeur/">
    <title>Tool Moved | COSYtools</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 3rem; background: #fdf8f0; color: #1c1917; }
        .card { background: #ffffff; padding: 2rem; border-radius: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.08); max-width: 480px; }
        .btn { display: inline-block; background: #416b49; color: #fff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="card">
        <h2>This reference tool has moved! 🚀</h2>
        <p>Redirecting you to the canonical reference engine.</p>
        <a class="btn" id="redirect-btn" href="../../tools/fr/conjugeur/">Open Conjugueur Français ↗</a>
    </div>
    <script>
        (function() {
            const canonicalPath = "../../tools/fr/conjugeur/";
            const targetUrl = new URL(canonicalPath, window.location.href);
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.forEach((value, key) => targetUrl.searchParams.set(key, value));
            document.getElementById('redirect-btn').href = targetUrl.toString();
            window.location.replace(targetUrl.toString());
        })();
    </script>
</body>
</html>
```

### 3.2 Preservation of `localStorage` & SRS Progress

Under the Web Storage API, `localStorage` is scoped strictly by **origin** (`protocol + domain + port`, e.g., `https://cosylanguages.github.io`).
Since both non-canonical paths (`/COSYtools/conjugation/french/`) and canonical paths (`/COSYtools/tools/fr/conjugeur/`) share the exact same host origin:

- SRS state keys (`cosy-fr-regime-progress`, `cosy-en-irregular-verbs-progress`, `cosy-it-reggenza-progress`, `cosy_weak_spots`, `cosy_practice_stats`) are accessible immediately upon redirect.
- Users navigating via old bookmarks or deep links lose zero progress, streaks, or spaced-repetition card review history.

---

## 4. Implementation Plan for Proof-of-Concept (French & Russian)

### 4.1 French Tools Consolidation
- `conjugation/french/index.html` ➔ Redirects to `../../tools/fr/conjugeur/`
- `gender/french/index.html` ➔ Redirects to `../../tools/fr/genre/`
- `prepositions/french/index.html` ➔ Redirects to `../../tools/fr/regime/`

### 4.2 Russian Tools Consolidation
- `conjugation/russian/index.html` ➔ Redirects to `../../tools/ru/spryazhenie/`
- `gender/russian/index.html` ➔ Redirects to `../../tools/ru/rod-padezhi/`
- `cases/russian/index.html` ➔ Redirects to `../../tools/ru/rod-padezhi/`
- `prepositions/russian/index.html` ➔ Redirects to `../../tools/ru/spryazhenie/`

### 4.3 Directory & Navigation Updates (`index.html`)
- Update `index.html` Core Tools and Detailed Reference cards to directly link to canonical engine paths (`tools/fr/conjugeur/`, `tools/fr/genre/`, `tools/fr/regime/`, `tools/ru/spryazhenie/`, `tools/ru/rod-padezhi/`, `tools/en/irregular-verbs/`, `tools/it/coniugatore/`, `tools/el/klisi-rimaton/`, etc.).
- Ensure all multi-lingual search filters in `index.html` match canonical paths.
