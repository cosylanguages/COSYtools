# AGENTS.md

## COSY ecosystem: daily elements

Each "of the day" element lives in the repository that owns it. No repository copies
another's daily content; pages link out instead.

| Daily element | Owning repo | Data / component | Updates daily by |
|---|---|---|---|
| Word / Verb / Verb + Preposition / Phrasal Verb / Idiom of the Day | COSYdata | `daily/<lang>/calendar/<slot>/YYYY-MM.json` | `.github/workflows/daily-calendar.yml` (03:30 UTC, `scripts/build-daily-calendar.cjs`) |
| Speaking prompt, Writing prompt | COSYpractice | `data/daily/<lang>/{speaking,writing}.json` | client rotates by day-of-year (`js/daily-strip.js`) |
| Daily Challenge | COSYpractice | `types/writing/daily_data.js` (`DAILY_BANK`) | 7-day schedule (`DAILY_SCHEDULE`) |
| Fun fact | COSYlanguages | `data/daily/<lang>/facts.json` | client rotates by day-of-year |
| Hub daily strip | COSYlanguages | `js/daily-strip.js` (+ `css/daily-strip.css`) | reads the owners above, rotates by day-of-year |
| Shared daily directory | COSYlanguages | `js/daily-directory.js` (+ `css/daily-directory.css`) | static link directory |
| Holiday / Science / Music / Film spotlights | COSYevents | `data/daily-spotlights.json` | `.github/workflows/daily-spotlights.yml` (04:00 UTC) |
| Conjugation + preposition drills | COSYtools | `practice/daily/index.html`, `shared/js/daily-feed.js` | reads the COSYdata calendar, client midnight rollover |

### How hosts mount the directory

```html
<link rel="stylesheet" href="https://cosylanguages.github.io/COSYlanguages/css/daily-directory.css">
<div data-daily-directory data-self="data"></div>   <!-- data | practice | languages | events | tools -->
<script src="https://cosylanguages.github.io/COSYlanguages/js/daily-directory.js" defer></script>
```

`data-self` marks the host's own card as "You are here". The shared directory lists all
five owners (including COSYtools). COSYtools' own daily page lists only its four sibling
owners, because there COSYtools is the host.

### Notes

- COSYdata's daily calendars are built ~14 months ahead and are deterministic and
  idempotent: re-running the build with no new month leaves `git status` clean.
- COSYpractice and COSYlanguages each gained a minimal CI workflow that runs their daily
  validator / tests (`validate-daily-prompts.js`; `node --test tests/*.test.js`).
- Live daily data is served from GitHub Pages under `https://cosylanguages.github.io/`.

## Native apps (Android / iOS / desktop)

COSYtools, COSYgames, and COSYpractice each ship native apps. The pattern is identical in
all three repos; only the app id, display name, and the paths excluded from the bundle
differ. Per repo: `scripts/build-app.js`, `scripts/generate-app-sources.js`,
`native/capacitor`, `native/electron`, `docs/NATIVE_APPS.md`, `.github/workflows/native.yml`.

| Repo | App id | Display name | Bundle size |
|---|---|---|---|
| COSYtools | `io.github.cosylanguages.cosytools` | COSYtools | ~71 MB, 768 files |
| COSYgames | `io.github.cosylanguages.cosygames` | COSYgames | ~15 MB, 353 files |
| COSYpractice | `io.github.cosylanguages.cosypractice` | COSYpractice | ~40 MB, 466 files |

- A single generated web bundle, `native/www`, feeds both shells. It is a filtered copy of
  the repo (build-only paths, git metadata, and GitHub Pages-only files excluded) and is
  gitignored. `node scripts/build-app.js --check` fails if it is stale.
- `scripts/generate-app-sources.js` derives `native/capacitor/assets/{icon,splash,splash-dark}.png`
  and `native/electron/build/icon.png` from the repo logo (needs `sharp` from the root
  `npm install`). Icons/splashes: `npx capacitor-assets generate --android --ios`.
- Mobile: Capacitor (`native/capacitor`), platform projects committed so a clone can build
  without regenerating them. `npx cap sync` after any web change. Capacitor 7 needs JDK 21.
- Desktop: Electron (`native/electron`) serving the bundle over an `app://` scheme so
  relative `fetch()` works (the Fetch spec rejects `file://`). Packaged with electron-builder.
- Service workers are registered only on `http(s)` (`location.protocol.startsWith('http')`),
  so the hosted PWA uses one while Capacitor and the Electron `app://` shell do not need one.
- CI: `.github/workflows/native.yml` (bundle reproducibility check, Android debug APK,
  desktop installers on Ubuntu/Windows/macOS). Native shells use `npm ci` with committed
  lockfiles. iOS needs a macOS runner + signing and is left to a release job.
- Root-walking test/validator scripts skip `native/` (e.g. `SKIP_DIRS` in COSYgames'
  `scripts/sync-site-urls.js`) so the generated bundle is not double-scanned.
- Offline data: COSYpractice vendors `data/cosydata/themes.json` (refresh:
  `npm run vendor:cosydata`) and reads it before the live COSYdata schema. COSYpractice's
  Concept Check page still fetches lesson units from COSYplatform at runtime and shows a
  retry card when offline.
