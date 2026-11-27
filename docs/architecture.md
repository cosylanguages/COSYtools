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

## The seven contracts

| # | Contract | Gate | What it proves |
| --- | --- | --- | --- |
| C1 | No page, stylesheet or script loads an asset from a sibling repository | `npm run check:independence` | A COSYlanguages deploy cannot break a page here. Navigation links and metadata are exempt; only fetches count. |
| C2 | A tool loads only its own files or `shared/` | `npm run test:tool-contract` | Deleting a tool cannot break another tool. |
| C3 | Every page carries the identical generated shell, and every manifest agrees with it | `npm run check:shell` | One header, one footer, one strip, one browser-chrome colour — on the page and after install. |
| C4 | No literal colour where a token exists, and no literal may compete with the brand hue | `npm run check:inline-colours`, `npm run check:brand-hue` | The theme stays themeable, and a new shade of the brand has to be a ramp step. |
| C5 | The service-worker precache matches the tree | `npm run check:sw` | Offline install cannot silently half-work. |
| C6 | `catalog.json` matches the folders and datasets | `npm run validate:catalog` | The hub, sitemap and filters are views of one file. |
| C7 | The signal ramp is one hue at ten measured lightnesses | `npm run check:signal-ramp` | Step 500 is the brand colour, 700 and darker are text-safe, 300 is a focus ring on dark, and no hand edit moves a step out of its role. |

All seven run in `npm test`. C1–C3, C5–C7 are also cheap enough to run on every save.

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
| `#7FE7E1` on `#222B22` | 10.04:1 | signal ink in dark mode |
| `#8DD9D4` on `#222B22` | 9.05:1 | focus ring in dark mode |
| `#0ABBB5` on `#FFFFFF` | 2.39:1 | **graphics only** |

Dark mode has its own ink (`--cosy-signal-ink`, `#7FE7E1`) because `#087A80` disappears on a
dark surface, and the focus ring uses `--cosy-300` (`#8DD9D4`). `check:contrast` measures
both against the dark surface: 10.04:1 and 9.05:1.

### Ramp

One hue at ten lightnesses, generated in CIELAB from `#0ABBB5`: step 500 *is* the brand, and
every other step keeps the brand hue (drift under 2°) with the chroma falling off toward both
ends, so the pale steps read as tints rather than neon.

```
--cosy-50  #EDF9F8   row hover, wash        --cosy-600 #009691   UI line only (3.6:1)
--cosy-100 #DCF6F4   selected row           --cosy-700 #007A76   small text (5.2:1)
--cosy-200 #BFEEEB   chart fill, selection  --cosy-800 #00605C   headings (7.4:1)
--cosy-300 #8DD9D4   dark-mode ink, ring    --cosy-900 #004643   dark ground
--cosy-400 #5DC6C1   gradient hover
--cosy-500 #0ABBB5   the brand itself
```

`npm run check:signal-ramp` re-measures every step against its role, so the table above
cannot rot: 500 must equal `--cosy-signal`, lightness must fall strictly from 50 to 900, the
hue must stay within 3° of the brand, 700 and darker must clear 4.5:1 on white and cream, 800
and darker must carry white text, 300 must clear 3:1 on dark, and 50–200 must stay under
1.5:1 so a "wash" cannot quietly become a block of colour.

The same rule applies to every other stylesheet. `npm run check:brand-hue` fails on any
literal whose hue is within 20° of the brand with enough chroma to be seen, unless it is one
of the token values; greys, sage, honey and coral fall outside that window, so the gate is
about the brand hue rather than about literals in general. `hero.css` carried six such
colours — a private teal palette (`#176B65`, `#17746D`, `#1F8A82`, `#3CBEB4`, `#7FDCD3`,
`#0B2422`) that shadowed the ramp on one page and drifted from it by a few degrees each time
it was edited. They are ramp steps now.

### Where the signal goes

The pinned token file states the rule this repository follows:

> The structural palette (cream/sage/ink) stays the paper the content sits on.
> Teal marks what is *alive*: active nav, progress, selection, focus, badges.

Applied now: `--cosy-ink-teal` (tag text, hover borders, icons), `--cosy-focus-ring`
(every `:focus-visible` — the hub cards, the hub search input, the chips and the sidebar
toggle used sage, or a hardcoded `#1f8a82`, until the ramp landed), `--cosy-tools-accent`
(active filter chips), `theme-color` on every page and `theme_color` in all 16 manifests,
`.hero-tag`, `.setup-opt.sel`, the hero step numbers, the card top rule, the hub card hover
border, `::selection`, `accent-color` on form controls and `caret-color`.

The browser's own UI is included on purpose: a checkbox, a text selection and a caret are
drawn by the browser, so a token there is the cheapest way to make the brand present on
every page without restyling a single component.

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
