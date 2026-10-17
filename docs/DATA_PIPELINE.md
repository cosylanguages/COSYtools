# Data pipeline

Runtime data for the shared lookup (`shared/js/supplemental_lexicon.js`) is served from
`tools/<lang>/data/shards/` (`index.json` + one JSON file per first letter) and
`tools/<lang>/data/lexicon.json`. These are committed.

The **raw upstream imports** the shards are built from are *not* committed. They were ~128 MB of
pretty-printed JSON (`morphology.json`, `kaikki.json` per language) that nothing at runtime reads, and
they are listed in `.gitignore`.

| Raw file | Source | Languages | Importer |
|---|---|---|---|
| `tools/<lang>/data/morphology.json` | [UniMorph](https://github.com/unimorph) | en fr de es it pt ru el ba br hy ka tt | `scripts/data-pipeline/import_unimorph.js` |
| `tools/<lang>/data/kaikki.json` | [kaikki.org](https://kaikki.org) (Wiktionary) | br cv | `scripts/data-pipeline/import_kaikki.js` |

## Regenerating the shards

1. Download the UniMorph TSV for each language to `/tmp/<iso3>.tsv` (`eng`, `fra`, `deu`, `spa`, `ita`, `por`, `rus`, `ell`, `bak`, `bre`, `hye`, `kat`, `tat`).
2. `node scripts/data-pipeline/import_unimorph.js [limit] [lang ...]` (default limit: 1000 lemmas per language)
3. `node scripts/data-pipeline/import_kaikki.js` (needs the kaikki.org dumps; see the script header)
4. `node scripts/data-pipeline/shard-data.js` rebuilds `shards/` from `morphology.json`, `kaikki.json` and `lexicon.json`
5. `node scripts/data-pipeline/verify-shard-results.js`, then `node scripts/build_language_lexicons.js` if tool data changed

Upstream sources change over time, so a regenerated import may differ slightly from the committed shards.
Review the diff of `shards/` before committing.

## Known size hot-spots (runtime)

Each shard is fetched whole on first lookup of a letter, so large shards cost mobile users:
`tools/es/data/shards/a.json` is ~8.5 MB. Splitting hot letters by two-letter prefix would fix this.
