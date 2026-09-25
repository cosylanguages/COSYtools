# COSY Design System & Vendored Base Tokens

## Overview
This document specifies the COSY ecosystem visual identity standards, vendored token synchronization rules, ecosystem strip navigation layout, emoji and icon conventions, and UI language switching principles for **COSYtools**.

---

## 1. Vendored Base Tokens Synchronization
COSYtools is a standalone offline-capable reference and practice tool. To ensure complete offline functionality and independence from external CDNs or network outages, canonical base tokens are **vendored** locally into:
- `shared/css/tokens.css`
- `shared/css/cosy-tokens.css`

### Token Sync Metadata
- **Sync Date:** `2026-09-25`
- **Canonical Source:** `https://cosylanguages.github.io/COSYlanguages/shared/css/tokens.css`
- **Primary Design Tokens Used:**
  - Background & Surface: `var(--cream)` (`#FAF7F2`), `var(--surface-color)` (`#FFFFFF`)
  - Typography & Ink: `var(--ink)` (`#222523`), `var(--ink-soft)` (`#5A625C`)
  - Primary Brand Accent: `var(--sage)` (`#2B6A78`), `var(--sage-dark)` (`#1B4332`)
  - Borders & Cards: `var(--border)` (`#E2DDD5`), `var(--r-md)` (`12px`)
  - Semantic Errors / Warnings: `var(--cosy-semantic-error)` (`#B04D35`)

---

## 2. Product Brand Identity
COSYtools uses the default COSY ecosystem design system look. It does not invent or define a distinct product accent color, ensuring consistent branding across all COSY ecosystem sub-products.

---

## 3. Shared Ecosystem Strip
The top ecosystem strip (`.cosy-ecosystem-strip`) provides unified cross-navigation across COSY applications:
- **Structure:**
  ```html
  <div class="cosy-ecosystem-strip" role="navigation" aria-label="COSY Ecosystem Products">
    <div class="cosy-strip-inner">
      <span class="cosy-strip-brand">🌐 COSY Ecosystem:</span>
      <ul class="cosy-strip-links">
        <li><a href="https://cosylanguages.github.io/COSYlanguages/" class="cosy-strip-link">COSYlanguages 🏠</a></li>
        <li><a href="https://cosylanguages.github.io/COSYdata/" target="_blank" rel="noopener" class="cosy-strip-link">COSYdata 📊</a></li>
        <li><a href="[relative-path]/index.html" class="cosy-strip-link active">COSYtools 🔎</a></li>
        <li><a href="https://cosylanguages.github.io/COSYgames/" target="_blank" rel="noopener" class="cosy-strip-link">COSYgames 🎮</a></li>
      </ul>
    </div>
  </div>
  ```

---

## 4. Navigation & Emoji Conventions
COSYtools strictly enforces standard emoji and icon placement across all hub and back navigation elements:

- **Ecosystem Strip & Top-Level Jump Links (Trailing Emojis):**
  - COSYlanguages: `COSYlanguages 🏠`
  - COSYdata: `COSYdata 📊`
  - COSYtools: `COSYtools 🔎`
  - COSYgames: `COSYgames 🎮`
  - Home: `Home 🏠`
  - Practice: `Practice 💡`
  - Games: `Games 🎮`
  - Tools: `Tools 🔎`
  - Events: `Events 🎉`

- **Back Navigation & Action CTAs (Leading Icons):**
  - Back Links: `← Back to Reference Hub`, `← Back to Conjugation Index`
  - Action Buttons: `▶ Compare Across Languages`, `▶ Launch FR Conjugeur`, `▶ Launch Case Reference`

---

## 5. UI Language Switching Principles

### Main Landing / Hub Pages (Multilingual Interaction)
Main portal hubs (e.g. `index.html`) provide an explicit UI language selector in the header offering 5 supported languages:
- 🇬🇧 English (`en`)
- 🇫🇷 Français (`fr`)
- 🇮🇹 Italiano (`it`)
- 🇷🇺 Русский (`ru`)
- 🇬🇷 Ελληνικά (`el`)

This gives students the ability to customize their interface experience based on whether they are beginners needing native-language guidance or advanced learners surrounding themselves with their target language.

### Target-Language Reference Engines (Strict Monolingualism)
Specific language reference applications (e.g. `tools/fr/conjugeur`, `tools/it/coniugatore`, `tools/ru/spryazhenie`, `tools/de/praepositionen`) are strictly **monolingual**. All headings, labels, instructions, paradigms, and terminology in these tools are rendered exclusively in the target language to maximize authentic language immersion and drill practice.
