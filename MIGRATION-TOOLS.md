# MIGRATION-TOOLS.md: Reference Engine Migration Report

This document records the migration of the 12 core reference engines from COSYlanguages to COSYtools.

---

## 📋 List of Migrated Reference Engines & Paths

| Engine Name | Engine Type | Target Language | Old Path (COSYlanguages) | New Path (COSYtools) | Standalone Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. English Irregular Verbs** | Conjugation | English 🇬🇧 | `apps/en/irregular-verbs/` | `tools/en/irregular-verbs/` & `conjugation/english/` | ✅ Complete (Standalone) |
| **2. French Conjugueur** | Conjugation | French 🇫🇷 | `apps/fr/conjugeur/` | `tools/fr/conjugeur/` & `conjugation/french/` | ✅ Complete (Standalone) |
| **3. Italian Coniugatore** | Conjugation | Italian 🇮🇹 | `apps/it/coniugatore/` | `tools/it/coniugatore/` & `conjugation/italian/` | ✅ Complete (Standalone) |
| **4. Russian Спряжение** | Conjugation | Russian 🇷🇺 | `apps/ru/spryazhenie/` | `tools/ru/spryazhenie/` & `conjugation/russian/` | ✅ Complete (Standalone) |
| **5. Greek Κλίση Ρημάτων** | Conjugation | Greek 🇬🇷 | `apps/el/klisi-rimaton/` | `tools/el/klisi-rimaton/` & `conjugation/greek/` | ✅ Complete (Standalone) |
| **6. French Genre & Pluriels** | Gender | French 🇫🇷 | `apps/fr/genre/` | `tools/fr/genre/` & `gender/french/` | ✅ Complete (Standalone) |
| **7. Italian Genere** | Gender | Italian 🇮🇹 | `apps/it/genere/` | `tools/it/genere/` & `gender/italian/` | ✅ Complete (Standalone) |
| **8. Russian Род & Падежи** | Gender & Cases | Russian 🇷🇺 | `apps/ru/rod-padezhi/` | `tools/ru/rod-padezhi/` & `gender/russian/` & `cases/russian/` | ✅ Complete (Standalone) |
| **9. Greek Γένος & Πτώσεις** | Gender & Cases | Greek 🇬🇷 | `apps/el/genos-ptoseis/` | `tools/el/genos-ptoseis/` & `gender/greek/` & `cases/greek/` | ✅ Complete (Standalone) |
| **10. English Dependent Prepositions** | Syntax & Regimes | English 🇬🇧 | `apps/en/verb-prep/` | `tools/en/verb-prep/` & `prepositions/english/` | ✅ Complete (Standalone) |
| **11. French Régime Prépositionnel** | Syntax & Regimes | French 🇫🇷 | `apps/fr/regime/` | `tools/fr/regime/` & `prepositions/french/` | ✅ Complete (Standalone) |
| **12. Italian Reggenza Verbale** | Syntax & Regimes | Italian 🇮🇹 | `apps/it/reggenza/` | `tools/it/reggenza/` & `prepositions/italian/` | ✅ Complete (Standalone) |

---

## 🔄 COSYlanguages Permanent Redirect Template

To redirect old tool locations in COSYlanguages to COSYtools, place the following `index.html` at each old engine path:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="3;url=https://cosylanguages.github.io/COSYtools/conjugation/french/">
    <title>Tool Moved | COSYlanguages</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 3rem; background: #fdf8f0; color: #1c1917; }
        .card { background: #ffffff; padding: 2rem; border-radius: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .btn { display: inline-block; background: #416b49; color: #fff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="card">
        <h2>This reference tool has moved to COSYtools! 🚀</h2>
        <p>You are being automatically redirected to the updated, offline-first reference engine.</p>
        <a class="btn" href="https://cosylanguages.github.io/COSYtools/conjugation/french/">Open Tool in COSYtools ↗</a>
        <p><small>If you are not redirected within 3 seconds, click the button above.</small></p>
    </div>
</body>
</html>
```

---

## 🎯 Testing & Verification Checklist Results

- [x] **Standalone Functionality:** All 12 engines operate 100% client-side without dependencies on COSYlanguages.
- [x] **Data Integrity:** All JSON datasets in `shared/data/` and `tools/*/data/` pass schema validation and CEFR level checks (`node scripts/validate_levels.js`).
- [x] **Conjugation Engine Verification:** Verified verb searches and tense generation for EN, FR, IT, RU, EL (`node scripts/assert_tenses.js`).
- [x] **Gender & Case System Verification:** Verified noun lookup, articles, plural forms, and case matrices for FR, IT, RU, EL.
- [x] **Preposition Rules Verification:** Verified dependent prepositions and case governing rules.
- [x] **Cross-App Search & Navigation:** Tested multi-lingual search in `index.html` and `shared/engines/reference-utils.js`.
- [x] **Mobile Responsiveness & Visual UI:** Verified Playwright screen and video recording across desktop and mobile viewports.
- [x] **Offline Capabilities:** Offline caching supported via `localStorage` and `COSYReferenceUtils.loadData()`.
