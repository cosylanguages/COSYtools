# COSY Multilingual Verb Inventory Report

## Executive Summary & Architectural Overview

This document presents the technical, lexicographical, and linguistic specification for the **COSY Multilingual Verb Inventory**, developed jointly for `COSYdata` (the ecosystem dictionary) and `COSYtools` (the verb-conjugation encyclopedia).

The inventory establishes a machine-readable, schema-validated canonical mapping between **53 core English verb concepts** and their lexical equivalents across **14 supported languages**. Rather than enforcing a simplistic 1-to-1 translation model, the inventory models polysemy through distinct **Sense IDs**, differentiates citation headwords from conjugated forms, records language-specific grammatical metadata, and tracks data provenance.

---

## Language Registry Matrix

The inventory supports 14 languages across 8 distinct language families:

| Language | ISO Code | Native Name | Language Family | Writing Script | Citation Form Type | Key Grammatical Features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **English** | `en` | English | Germanic | Latin | Infinitive | Bare / to-infinitive; modal inflection |
| **French** | `fr` | Français | Romance | Latin | Infinitive | Dual auxiliaries (`avoir`/`être`); 3 verb groups |
| **Italian** | `it` | Italiano | Romance | Latin | Infinitive | Dual auxiliaries (`avere`/`essere`); 3 conjugations |
| **Russian** | `ru` | Русский | Slavic | Cyrillic | Infinitive | Aspectual pairs (Imperfective / Perfective); aspectual prefixes |
| **Greek** | `el` | Ελληνικά | Hellenic | Greek | 1st Person Sing. Present | Dict citation form in -ω; active / mediopassive voices |
| **Portuguese**| `pt` | Português | Romance | Latin | Infinitive | Auxiliaries (`ter`/`haver`, `ser`/`estar`); personal infinitive |
| **German** | `de` | Deutsch | Germanic | Latin | Infinitive | Dual auxiliaries (`haben`/`sein`); separable preverbs |
| **Spanish** | `es` | Español | Romance | Latin | Infinitive | Compound tenses with `haber`; `ser`/`estar` distinction |
| **Tatar** | `tt` | Татарча | Turkic | Cyrillic | Verbal Noun | Agglutinative suffixes; citation form in -у / -ү |
| **Bashkir** | `ba` | Башҡортса | Turkic | Cyrillic | Verbal Noun | Agglutinative suffixes; citation form in -ыу / -еү |
| **Chuvash** | `cv` | Чӑвашла | Turkic (Oghur)| Cyrillic | Verbal Noun | Oghur Turkic morphology; citation form in -ни / -в |
| **Breton** | `br` | Brezhoneg | Celtic | Latin | Infinitive | Initial consonant mutations; dual auxiliaries (`ober`/`kaout`) |
| **Armenian** | `hy` | Հայերեն | Armenian | Armenian | Infinitive | Citation in -ել / -ալ; auxiliary verb particle system |
| **Georgian** | `ka` | ქართული | Kartvelian | Georgian | Verbal Noun / Masdar| Screeve tense system; preverbs (`და-`); polypersonalism |

---

## Canonical English Source Inventory (53 Concepts)

The inventory preserves all 53 canonical source entries:

`be`, `have`, `think`, `know`, `like`, `love`, `hate`, `dislike`, `want`, `work`, `study`, `go`, `can`, `eat`, `drink`, `do`, `make`, `understand`, `speak`, `talk`, `say`, `tell`, `need`, `look`, `watch`, `see`, `ask`, `answer`, `take`, `give`, `must`, `have to`, `wait`, `live`, `listen`, `hear`, `pay`, `buy`, `remember`, `forget`, `feel`, `meet`, `decide`, `write`, `read`, `type`, `spend`, `waste`, `play`, `agree`, `disagree`, `send`, `get`.

---

## Analysis of Multiword Expressions & Modal Verbs

### 1. Modal Verbs (`can`, `must`)
- **English**: Defective verbs lacking infinitive forms (`*to can`, `*to must`) and third-person `-s`.
- **Germanic & Romance Translation**:
  - `can`: German `können`, French `pouvoir`, Italian `potere`, Spanish/Portuguese `poder`.
  - `must`: German `müssen`, French `devoir`, Italian `dovere`, Spanish `deber`.
- **Slavic & Hellenic**:
  - Russian uses the modal predicate `должен` (short adjective) for `must` and full verb `мочь` for `can`.
  - Greek uses impersonal construction `πρέπει` (it is necessary) for `must` and `μπορώ` for `can`.

### 2. Multiword Verbal Expressions (`have to`, `agree`, `disagree`, `be able to`)
- **`have to`** (external obligation):
  - Modelled as a distinct concept (`concept_have_to`) separate from `concept_must`.
  - English: periphrastic modal expression `have to`.
  - Spanish: `tener que` + infinitive.
  - French: `devoir` / `être obligé de`.
  - Breton: `rankout`.
  - Georgian: `უწევს` (impersonal construction).
- **`agree` / `disagree`**:
  - English uses simple verbs `agree` / `disagree`.
  - French uses `être d'accord` / `ne pas être d'accord`.
  - Italian uses `essere d'accordo` / `dissentire`.
  - Breton uses `a-du bezañ` / `n'em bezañ ket a-du`.
  - Russian uses `соглашаться` / `не соглашаться`.

---

## Polysemous Verbs & Sense Disambiguation

Verbs with divergent cross-lingual translations are split into granular Sense IDs:

| English Concept | Sense ID | Meaning / Context | French | German | Russian | Italian |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **know** | `sense_know_facts` | Factual knowledge | `savoir` | `wissen` | `знать` | `sapere` |
| **know** | `sense_know_people` | Familiarity with person/place | `connaître` | `kennen` | `знать` | `conoscere` |
| **think** | `sense_think_opinion` | Opinion / belief | `penser` | `glauben` | `думать` | `pensare` |
| **think** | `sense_think_reflection`| Mental process | `penser` | `denken` | `размышлять` | `pensare` |
| **make** | `sense_make_create` | Produce / fabricate | `fabriquer` | `herstellen`| `создавать` | `produrre` |
| **make** | `sense_make_cause` | Causative action | `rendre` | `veranlassen`| `заставлять` | `rendere` |
| **look** | `sense_look_gaze` | Direct gaze at object | `regarder` | `schauen` | `смотреть` | `guardare` |
| **look** | `sense_look_appear` | Visual appearance | `avoir l'air` | `aussehen` | `выглядеть` | `sembrare` |
| **meet** | `sense_meet_encounter`| Encounter person | `rencontrer` | `treffen` | `встречать` | `incontrare` |
| **meet** | `sense_meet_assemble` | Assemble as committee | `se réunir` | `tagen` | `собираться` | `riunirsi` |
| **spend** | `sense_spend_time` | Pass time | `passer` | `verbringen` | `проводить` | `passare` |
| **spend** | `sense_spend_money` | Disburse funds | `dépenser` | `ausgeben` | `тратить` | `spendere` |
| **waste** | `sense_waste_time` | Squander time | `gaspiller` | `verschwenden`| `терять` | `sprecare` |
| **waste** | `sense_waste_money` | Squander money | `gaspiller` | `verschwenden`| `тратить впустую`| `sprecare` |
| **play** | `sense_play_game` | Game / sport | `jouer` | `spielen` | `играть в` | `giocare` |
| **play** | `sense_play_instrument`| Musical instrument | `jouer de` | `spielen` | `играть на` | `suonare` |
| **live** | `sense_live_reside` | Inhabit home/city | `habiter` | `wohnen` | `проживать` | `abitare` |
| **live** | `sense_live_alive` | Be alive | `vivre` | `leben` | `жить` | `vivere` |
| **get** | `sense_get_receive` | Obtain / receive | `recevoir` | `bekommen` | `получать` | `ricevere` |
| **get** | `sense_get_become` | Become / change state | `devenir` | `werden` | `становиться`| `diventare` |

---

## Typological Nuances & Language-Specific Metadata

1. **Dual Auxiliaries (Romance, Germanic, Celtic)**:
   - French (`avoir` vs `être`), Italian (`avere` vs `essere`), German (`haben` vs `sein`), Breton (`ober` vs `kaout`) distinguish transitivity and motion in past tense auxiliary selection.
2. **Aspectual System (Slavic)**:
   - Russian pairs imperfective (`читать`) and perfective (`прочитать`) forms to distinguish process from completed result.
3. **Citation Form Diversity**:
   - Modern Greek uses 1st person singular present indicative (`γράφω`).
   - Tatar, Bashkir, Chuvash, and Georgian use verbal nouns / masdars (`язу`, `яҙыу`, `вулав`, `წერა`).
4. **Initial Mutation in Breton**:
   - Initial consonants mutate phonetically depending on pre-verbal particles or syntax (e.g. `ober` -> `gober`, `vezañ` -> `bezañ`).
5. **Kartvelian Screeves & Preverbs**:
   - Georgian verbs incorporate preverbs (e.g. `და-` in `დაწერს`) to indicate perfective aspect and directional orientation across 11 screeves.

---

## Provenance & Governance

All dataset entries in `shared/data/multilingual-verb-inventory.json` adhere to `schemas/multilingual-verb-inventory.schema.json`. Every record includes provenance metadata:

```json
"provenance": {
  "source": "COSYtools",
  "review_status": "verified_native",
  "verified": true
}
```

Any unverified or machine-assisted additions MUST be flagged with `"review_status": "needs_review"` and `"verified": false`.
