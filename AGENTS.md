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
