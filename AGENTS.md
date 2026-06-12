# Grave Shopify Store — Agents Notes

## Deploy Workflow

### ⚠️ CRITICAL: CDN Cache (READ THIS BEFORE EVERY CSS EDIT)
Shopify's CDN caches CSS files permanently (1-year `max-age=31557600`). Once a filename is served by the CDN, **all subsequent uploads to the same filename are invisible**.

**Always use a new filename** for CSS changes. Never modify an existing CSS file and expect it to update. This is the #1 source of frustration when changes "don't work."

### Current Active Files
- **CSS**: `assets/grave-v4.css` (latest version)
- **theme.liquid**: references `grave-v4.css` on line 340
- Next version when making changes: `grave-v5.css`

### Deploy Process (follow EVERY time)
1. **Create a NEW CSS file** with the next version number (e.g., `grave-v5.css`)
2. **Copy current CSS content** to the new file
3. **Make all edits** to the NEW file only
4. **Update `layout/theme.liquid`** to reference the new filename
5. **Push BOTH files**: `shopify theme push -s i0zd90-iw -t 148523188406 --allow-live --nodelete`
6. **Tell user to hard refresh** (Cmd+Shift+R) — regular refresh won't work

### ⚠️ NEVER DO THIS
- Editing `grave-v4.css` and re-uploading (CDN serves old version)
- Forgetting to update `theme.liquid` to reference new filename
- Pushing only the CSS file without pushing `theme.liquid`

### Authentication
API token from `~/Library/Preferences/shopify-cli-kit-nodejs/config.json`:
- Config is JSON with `sessionStore` as a nested JSON string
- Navigate to: `sessionStore → accounts.shopify.com → [sessionId] → identity → accessToken`
- For store-specific: `sessionStore → accounts.shopify.com → [sessionId] → applications → [store key] → accessToken`
- Token expires ~2 hours; run `shopify auth login` to refresh

### REST API Endpoint
`https://i0zd90-iw.myshopify.com/admin/api/2024-04/themes/148523188406/assets.json`
- Bearer token auth
- GET to read, PUT to upload, DELETE to remove
- Live theme ID: `148523188406`

### Theme Info
- Live theme: "Copy of Grave Apparel - 04/19/26 - Mike Edits"
- Development theme: `149314896054` (name: "Development (c1b2fa-iMac)")
- Parallax theme, Shopify Online Store 2.0 (JSON templates)
- Primary green: `#3cd36a`, Page bg: `#121212`, Text: `#d1d7d9`

### Git
- Remote: `https://github.com/llMaxFischer/Grave-Shopify-Store.git`
- Last commit (as of session end): `c187f43`
- All CSS work is in `assets/grave-custom.css` (local) and `assets/grave-live.css`

### Key Files
- `assets/grave-v4.css` — current active custom CSS file
- `layout/theme.liquid` — references `grave-v4.css`
- `assets/jsSlideshow.js` — appended JS for parallax zoom and coffin scroll indicator
- `assets/ProximaNova-Bold.ttf` — custom font
- `assets/stay-haunted-banner.svg` — marquee SVG
- `assets/facebook.svg`, `assets/instagram.svg` — social icon SVGs
- `sections/footer.liquid` — footer layout with reference-based classes
