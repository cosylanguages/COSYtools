# Ecosystem auth & CMS scripts (opt-in)

`shared/js/auth-sso.js` (cross-app session hand-off) and `shared/js/cms-editor.js` (founder on-page editor)
are **off by default** in COSYtools. They need a Supabase project, which this repo does not configure, so
`shell.js` loads nothing unless a host page opts in. Result: no Supabase SDK, no jsDelivr request and no
extra JavaScript on ordinary visits (`npm run test:security` enforces "no third-party requests").

## Enabling
Define, before `shell.js` runs:

```html
<script>
  window.COSY_SUPABASE_URL = 'https://<project>.supabase.co';
  window.COSY_SUPABASE_ANON_KEY = '<anon key>';          // the public anon key only, never the service key
  window.COSY_SSO_ALLOWED_ORIGINS = ['https://learn.example.org'];   // optional extra origins
</script>
```
or provide a ready `window.supabaseClient`. The SDK is then loaded from jsDelivr (pinned version).

## Security model — please read
All COSY apps are served from `https://cosylanguages.github.io`, so they share **one browser origin**:
`localStorage`, cookies and any Supabase session are visible to every app. A script-injection bug in
COSYtools is therefore also a bug in COSYplatform. Rules that follow:

1. **Session tokens only go to allow-listed origins.** `auth-sso.js` matches the link's exact origin
   (default `https://cosylanguages.github.io`), never a substring. Add custom domains through
   `COSY_SSO_ALLOWED_ORIGINS`. (Before this was fixed, any link containing "cosylanguages" or "COSY" — even
   `https://evil.example/cosylanguages` — received the access *and* refresh token.)
2. **CMS HTML is sanitised with an allow-list** (`COSY_CMS.sanitizeHTML`): only basic text-formatting tags,
   `class/lang/dir/title/aria-label`, and `http(s)`/`mailto`/relative links. Everything else (scripts, styles,
   SVG/MathML, forms, images, inline styles, `id`) is dropped. Don't loosen it without adding a test to
   `scripts/test-security.js`.
3. **The editor's role check is cosmetic.** `isFounderOrAdmin()` reads `localStorage` and user metadata, which
   a visitor can edit. Real protection must be **Row Level Security on `cms_page_overrides`**:

```sql
alter table cms_page_overrides enable row level security;
create policy "anyone can read overrides" on cms_page_overrides for select using (true);
create policy "admins write overrides" on cms_page_overrides for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','founder','owner'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','founder','owner'));
```
   Use `app_metadata` (only the server can set it), **not** `user_metadata` (users can edit their own).
   This repo cannot verify your Supabase policies — please check them in the dashboard.

## Where this should live
Auth and editing belong to COSYplatform. Long term, move `auth-sso.js` / `cms-editor.js` there and keep only
the thin opt-in hook in `shell.js`. Until then the code here is inert unless explicitly configured.
