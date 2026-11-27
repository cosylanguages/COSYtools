# Architecture: independent tools, one shell

COSYtools is a member of the COSYlanguages ecosystem and a standalone repository.
Both halves of that sentence are load-bearing, and both are checked.

> A collection of independent language tools built on one shared design system and
> one lightweight shell. Removing a tool never affects another tool.

Nothing in this document is a preference. Each section names the gate that fails when
the rule is broken, because an unchecked claim is a decoration.

## Layers

| Layer | Lives in | May depend on | Changes |
| --- | --- | --- | --- |
| Shell | `shared/templates/`, generated into every page | design tokens | rarely; regenerated, never hand-edited per page |
| Design tokens | `shared/css/cosy-tokens.css` (pinned), `shared/css/tokens.css` (local) | nothing | freely |
| Engines | `shared/engines/` | tokens, `shared/data/` | treated as a library: coordinated bump |
| Tools | `tools/<lang>/<tool>/` | its own files, `shared/`, `catalog.json` | independently |
| Data | `tools/<lang>/<tool>/data/`, `shared/data/` | nothing | independently |
| Registry | `catalog.json`, `shared/js/languages.js` | nothing | one entry per tool or language |

## The six contracts

| # | Contract | Gate | What it proves |
| --- | --- | --- | --- |
| C1 | No page, stylesheet or script loads an asset from a sibling repository | `npm run check:independence` | A COSYlanguages deploy cannot break a page here. Navigation links and metadata are exempt; only fetches count. |
| C2 | A tool loads only its own files or `shared/` | `npm run test:tool-contract` | Deleting a tool cannot break another tool. |
| C3 | Every page carries the identical generated shell | `npm run check:shell` | One header, one footer, one strip, one browser-chrome colour. |
| C4 | No literal colour where a token exists | `npm run check:inline-colours` | The theme stays themeable. |
| C5 | The service-worker precache matches the tree | `npm run check:sw` | Offline install cannot silently half-work. |
| C6 | `catalog.json` matches the folders and datasets, and every page outside it is accounted for | `npm run validate:catalog`, `npm run check:registry` | The hub, sitemap and filters are views of one file, and no page can sit outside the registry unnoticed. |

All six run in `npm test`. C1–C3, C5 and C6 are also cheap enough to run on every save.

### C1 in practice: pinned copies, not live links

`shared/vendor/` holds byte-identical copies of COSYlanguages assets. `shared/vendor/ASSETS.json`
records the upstream URL and the SHA-256 of each copy.

```
npm run sync:ecosystem-strip    # download, rewrite ASSETS.json, print updated/unchanged
npm run check:ecosystem-strip   # hash every copy (part of npm test)
```

Never edit a file in `shared/vendor/`. A local tweak fails the hash check, and the fix is
to change the file upstream and re-sync. `shared/css/cosy-tokens.css` is pinned the same
way by `npm run check:design-tokens`; local overrides belong in `shared/css/tokens.css`.

This is why the ecosystem strip is no longer loaded from `cosylanguages.github.io`: 63 of
65 pages used to depend on two files in another repository.

### C2 in practice: the tool contract

`tools/<lang>/<tool>/` is a copyable unit: `index.html`, `js/`, `style.css`, `data/`.
`scripts/test-tool-contract.js` walks every tool, reads every HTML/CSS/JS file, and resolves
each asset it loads.

- Allowed: anything inside the tool folder, anything under `shared/`.
- Not allowed: another tool's folder, or a sibling repository.
- `fetch()` and `new URL()` in a script resolve against the **page**, `url()` in a
  stylesheet resolves against the **stylesheet**. The test models that difference.
- A plain `<a href>` is navigation, so it may leave the tool, but it must point at a file
  that exists. That is what catches a link to a deleted tool.

`isolation-exceptions.json` lists known couplings with a reason and a follow-up. The test
fails on a stale entry, so the list cannot quietly grow or rot. It currently holds one:
Greek `syntaxi` reads the `genos-ptoseis` noun table as optional enrichment.

### C3 in practice: generate the shell, do not inject it

The shell is written into each page at build time by `scripts/sync-shell.js`, not inserted
at runtime by a script.

| | Runtime injection | Build-time generation (chosen) |
| --- | --- | --- |
| Breaks if the host JS fails | yes | no |
| Works without JS / for crawlers | poorly | yes |
| Cost of a shell change | one file | regenerate 63 pages |
| Duplication | none | 63 generated copies, verified by `check:shell` |

Runtime is still used for state that must be live: the theme toggle and the strip's
signed-in links. Those degrade to something sensible when the script does not run.

`sync-shell.js` owns the strip markup, the footer, the local strip `<link>`/`<script>` and
the `<meta name="theme-color">`. It reads the browser-chrome colour from
`--cosy-signal`, so the address bar cannot drift from the brand.

### C5 in practice: the precache is derived

`PRECACHE_URLS` in `sw.js` is generated between two markers from the tree: the app shell
plus every stylesheet and script under `shared/`. Fonts and datasets stay out on purpose —
they are large and are cached at runtime the first time a page opens them.

```
npm run generate:sw     # rewrite the block
npm run check:sw        # fail when sw.js is stale (part of npm test)
```

### C6 in practice: the registry has a second list

`catalog.json` covers `tools/<lang>/<tool>/`. It does not cover the root-level pages that
predate that layout — `gender/`, `cases/`, `conjugation/`, `prepositions/`, `practice/`,
`verb-patterns/` and `noun-declensions/` — which are linked from the homepage. `generate_hub.js
--check` only ever looked inside `tools/`, so those pages were served while the registry did
not know they existed.

`legacy-pages.json` names each of the 30 with a status. Sixteen are redirect stubs left
behind by the migration (fifteen of them into the catalogue); ten are real content:

| Status | Count | Meaning | Gate |
| --- | --- | --- | --- |
| `site` | 3 | Not a tool: hub, 404, offline | no target |
| `template` | 1 | Source file, not served | no target |
| `redirect` | 16 | A stub that sends users elsewhere | `target` must exist and must equal the page's own meta refresh |
| `content` | 10 | Real content, no catalogued equivalent | cataloguing or migration is a separate task |

`npm run check:registry` fails when a served page is neither catalogued nor listed, when a
listed page disappears, when a redirect target is missing, when the recorded target disagrees
with the meta refresh in the file, or when a listed page is also catalogued. Comparing the
record with the page is what keeps the list honest: the stub is the source of truth, so the
JSON cannot claim a destination the file does not use.

The sitemap is the third view of the registry, and the check covers it too: every catalogued
tool, every `content` page and the hub must appear in `sitemap.xml`, and no `redirect` stub
may appear there. That is what a `noindex` stub is for — advertising it in the sitemap asks
search engines to index a page that asks them not to. The rule found `practice/daily`: a real
page, canonical set, linked twice from the practice hub, which had never been submitted.

The ten `content` pages are the three family reference guides, the five `practice/` pages,
`verb-patterns/` and `noun-declensions/`. They reach the design tokens through
`shared/styles/reference.css`, which imports `tokens.css` and `base.css`, so they carry the
brand and the focus ring like the tools do. The sixteen redirect stubs load only `fonts.css`,
which is the right weight for a page whose whole job is to forward. Whether the content pages
become tools with catalogue entries or stay as guides is a product decision this check
deliberately does not make.

## Colour

Two colours carry the ecosystem, and they are already defined as tokens:

| Token | Value | Role |
| --- | --- | --- |
| `--cosy-signal` | `#0ABBB5` | the mark: logo, primary fill, active state, focus |
| `--cosy-signal-secondary` | `#0CA2B0` | the second step of the gradient, secondary accents |
| `--cosy-signal-deep` | `#087A80` | **the text and border colour** of that hue |
| `--cosy-signal-soft` | `#DFFAF8` | wash behind signal-coloured text |
| `--cosy-signal-gradient` | `135deg #0ABBB5 → #0CA2B0` | both colours at once: hero rule, progress fill |

### The one rule that cannot be broken

`#0ABBB5` is 2.39:1 on white. It is a **fill** colour, never text, and never the label
colour on a fill. White text on it is also 2.39:1.

| Pair | Ratio | Use |
| --- | --- | --- |
| `#087A80` on `#FFFFFF` | 5.11:1 | signal text |
| `#087A80` on `#DFFAF8` | 4.67:1 | signal text on a signal wash |
| `#06201F` on `#0ABBB5` | 7.12:1 | label on a signal fill |
| `#6EF7F3` on `#222B22` | 11.32:1 | signal text in dark mode |
| `#0ABBB5` on `#FFFFFF` | 2.39:1 | **graphics only** |

Dark mode has its own ink (`--cosy-300`) because `#087A80` disappears on a dark surface.
`check:contrast` measures the focus ring against both surfaces: 5.11:1 light, 11.32:1 dark.

### Ramp

Derived from `#0ABBB5` by lightness; steps 700 and darker are the only ones that clear
4.5:1 on white, and 600 is the lightest step that clears 3:1 for a UI line.

```
--cosy-50  #ECFEFD   row hover        --cosy-600 #09A59F   borders (3:1)
--cosy-100 #D3FDFB   selected row     --cosy-700 #07837F   small text (4.6:1)
--cosy-200 #A8FAF8   chart fills      --cosy-800 #05615E   headings (7.3:1)
--cosy-300 #6EF7F3   dark-mode ink    --cosy-900 #033F3D   dark ground
--cosy-400 #2AF4ED   gradient hover
--cosy-500 #0BCBC5   brand fill
```

### Where the signal goes

The pinned token file states the rule this repository follows:

> The structural palette (cream/sage/ink) stays the paper the content sits on.
> Teal marks what is *alive*: active nav, progress, selection, focus, badges.

Applied now: `--cosy-ink-teal` (tag text, hover borders, icons), `--cosy-focus-ring`
(every `:focus-visible`), `--cosy-tools-accent` (active filter chips), `theme-color`,
`.hero-tag`, `.setup-opt.sel`, the hero step numbers and the card top rule.

`--teal` and `--teal-light` used to alias sage. They are remapped to the signal family in
`shared/css/tokens.css`, together with the label pairing they needed: anything written on a
`--teal` fill uses `--cosy-on-signal` (7.1:1), never white (2.4:1). A census of the rendered
hub and tool pages showed those rules were largely dead CSS, so this was a correctness fix
rather than a visible one; the live accents were already the signal.

Deliberately still sage: headings, body text, icon tiles and the paper surfaces. That is the
upstream rule, not an oversight. Turning them turquoise would make every page a block of
brand colour and leave nothing for the signal to mark.

Identity comes from form, not hue: every COSY product keeps the signal accent, and only
density, typography and iconography differ. That is why a reference tool reads as precise
and a game reads as playful without either owning a private colour.

## Adding a tool

1. Create `tools/<lang>/<tool>/` with `index.html`, its own CSS/JS and `data/`.
2. Load shared code only from `shared/`. Never reach into another tool.
3. Add one entry to `catalog.json` (`id`, `language`, `type`, `status`, `title`,
   `description`, `entry_url`, `data_file_paths`, `entry_counts`).
4. `npm run generate:hub` then `npm test`.

## Removing a tool

1. Delete `tools/<lang>/<tool>/`.
2. Delete its `catalog.json` entry.
3. `npm run generate:hub && npm run generate:sw` then `npm test`.

If anything else has to change, a contract was already broken and the test said so when it
was added, not now.

## Shared code: two layers, two rules

```
shared/css/      appearance only, no behaviour      change freely
shared/engines/  behaviour, public surface is small  treat as a library
```

An engine exposes one entry point per capability (`mount`, `load`, `search`) and keeps the
rest private. That is what lets one tool's UI be rewritten without touching another's.
