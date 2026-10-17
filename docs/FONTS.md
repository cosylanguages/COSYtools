# Fonts

All fonts are self-hosted (`shared/fonts/`, declared in `shared/css/fonts.css`). Nothing is requested from
Google or any other third party, which keeps the "No Tracking · 100% client-side" promise true and avoids
sending visitors' IP addresses to Google (a GDPR concern for EU users).

| Family name in CSS | Font | Scripts covered |
|---|---|---|
| `COSY Sans` | Inter Variable | Latin, Latin Ext, Cyrillic, Cyrillic Ext, Greek, Greek Ext |
| `COSY Serif` | Source Serif 4 Variable (+ italic) | Latin, Latin Ext, Cyrillic, Cyrillic Ext, Greek (no polytonic — falls back to `COSY Sans`) |
| both | Noto Sans Armenian / Noto Sans Georgian | Armenian, Georgian (per-glyph fallback via `unicode-range`) |

Cyrillic Extended matters: Bashkir, Tatar and Chuvash need letters such as ә ө ҡ ң ҙ ғ ҫ ү һ ӑ ӗ ӳ.
Browsers download only the script files a page actually uses (`unicode-range`); the full set is ~600 KB.

Always use `var(--font-sans)` / `var(--font-serif)` (from `cosy-tokens.css`) or the families `'COSY Sans'` /
`'COSY Serif'`. Do not hard-code other family names or add `<link>` tags to font CDNs — `npm run check:fonts`
fails on both, and fails if a page does not link `shared/css/fonts.css`.

## Changing the typeface
The families are named after their role, not the font. To swap a font, install the matching
`@fontsource-variable/*` package, copy the `woff2` files into `shared/fonts/`, and update the
`@font-face` blocks in `fonts.css` (keep the `COSY Sans` / `COSY Serif` names). No other CSS changes.
Verify coverage for every language before shipping (see the sample strings used for the original check:
Greek `ΐ ΰ ά έ`, Russian `ёЁ №`, Bashkir `ҡәөңҙғҫү һ`, Chuvash `ӑӗҫӳ`, Tatar `әөүҗңһ`, Breton `c’h ñ`,
Armenian `Հայերեն`, Georgian `ქართული`).

## Licenses
All four families are licensed under the SIL Open Font License 1.1; license texts are in `shared/fonts/licenses/`.

## Note on class names
Some CSS classes still contain the old name (e.g. `hero-fraunces-title`). They are only class names and
do not affect rendering; the smoke test references one, so rename them together if you want them gone.
