# Grave Shopify Store — Agents Notes

## Deploy Workflow

### ⚠️ CRITICAL: CDN Cache (READ THIS BEFORE EVERY CSS EDIT)
Shopify's CDN caches CSS files permanently (1-year `max-age=31557600`). Once a filename is served by the CDN, **all subsequent uploads to the same filename are invisible**.

**Always use a new filename** for CSS changes. Never modify an existing CSS file and expect it to update. This is the #1 source of frustration when changes "don't work."

### Current Active Files
- **CSS**: `assets/grave-v31.css` (latest version)
- **About page CSS**: `assets/about-page-v2.css`
- **theme.liquid**: references `grave-v31.css` on line 341 and `about-page-v2.css` on line 342
- Next version when making changes: `grave-v32.css`

### Deploy Process (follow EVERY time)
1. **Create a NEW CSS file** with the next version number (e.g., `grave-v19.css`)
2. **Copy current CSS content** to the new file
3. **Make all edits** to the NEW file only
4. **Update `layout/theme.liquid`** to reference the new filename
5. **Push BOTH files**: `shopify theme push -s i0zd90-iw -t 148523188406 --allow-live --nodelete`
6. **Tell user to hard refresh** (Cmd+Shift+R) — regular refresh won't work

### ⚠️ NEVER DO THIS
- Editing `grave-v18.css` and re-uploading (CDN serves old version)
- Forgetting to update `theme.liquid` to reference new filename
- Pushing only the CSS file without pushing `theme.liquid`

## ⚠️ CRITICAL: Avoid the Compounding Loop

When the user says "changes aren't showing," **do NOT immediately write more code.** This creates a compounding loop where perfectly good code gets overwritten.

### The Loop (AVOID THIS)
1. Agent writes code → pushes to Shopify
2. User doesn't see change (CDN cache)
3. Agent writes MORE code to "fix" it
4. Now there are conflicting styles
5. User says "that broke something else"
6. Agent writes EVEN MORE code to fix that
7. Repeat until chaos

### The Correct Response
1. **Verify the code is correct in the backend** (Shopify code editor or API)
2. **If code looks correct → STOP. Tell the user:**
   - "The code is correct in the Shopify backend"
   - "The CDN is caching the old version"
   - "Do NOT let me write more code yet"
   - "Please check in Incognito window or secondary browser"
   - "If still not showing, try the Double Save trick (see below)"
3. **Only write more code if the user confirms the backend code is wrong**

### Verification Steps (before writing ANY more code)
1. Check `shopify theme push` output — did it succeed?
2. If user says "not showing" — ask them to check Shopify code editor (not preview)
3. If code is correct in editor → it's a CDN issue, not a code issue
4. Have user try: Incognito window, secondary browser, or Double Save trick

### Double Save Trick (force Shopify preview to re-render)
1. Open Shopify code editor
2. Open the file that was just changed
3. Add a single space → Save
4. Delete the space → Save
5. This forces the customizer to re-render

### Multi-Browser Strategy
- Don't rely on Cmd+Shift+R alone
- Keep an Incognito window open for checking changes
- Or use a secondary browser (Safari/Firefox) just for previewing

### Key Facts About Shopify CDN (2026)
- Bare query strings (`?v=123`) no longer bust cache — Shopify updated their policy
- Only a new filename forces CDN to fetch fresh content
- The `| asset_url` filter appends a version hash, but CDN still caches by filename
- Use Preview URL with `?preview_theme_id=` parameter to bypass heavy caching
- There is no "Clear Cache" button in Shopify admin

## Authentication
API token from `~/Library/Preferences/shopify-cli-kit-nodejs/config.json`:
- Config is JSON with `sessionStore` as a nested JSON string
- Navigate to: `sessionStore → accounts.shopify.com → [sessionId] → identity → accessToken`
- For store-specific: `sessionStore → accounts.shopify.com → [sessionId] → applications → [store key] → accessToken`
- Token expires ~2 hours; run `shopify auth login` to refresh

## REST API Endpoint
`https://i0zd90-iw.myshopify.com/admin/api/2024-04/themes/148523188406/assets.json`
- Bearer token auth
- GET to read, PUT to upload, DELETE to remove
- Live theme ID: `148523188406`

## Theme Info
- Live theme: "Grave Apparel - Mike's Edit" (#148523188406)
- Development theme: `149314896054` (name: "Development (c1b2fa-iMac)")
- Parallax theme, Shopify Online Store 2.0 (JSON templates)
- Primary green: `#3cd36a`, Page bg: `#121212`, Text: `#d1d7d9`

## Git
- Remote: `https://github.com/llMaxFischer/Grave-Shopify-Store.git`
- Last commit (as of session end): `bad3b2d`

## Key Files
- `assets/grave-v18.css` — current active custom CSS file
- `layout/theme.liquid` — references `grave-v18.css`
- `assets/grave-custom.js` — renamed from jsSlideshow.js for CDN cache bust
- `assets/jsSlideshow.js` — old filename, CDN-cached
- `assets/ProximaNova-Bold.ttf` — custom font
- `assets/Times New Roman Bold.ttf` — custom font for titles
- `assets/stay-haunted-banner.svg` — marquee SVG
- `assets/facebook.svg`, `assets/instagram.svg` — social icon SVGs
- `sections/footer.liquid` — footer layout with reference-based classes
- `.opencode/skills/shopify-cdn/SKILL.md` — CDN caching workflow skill
