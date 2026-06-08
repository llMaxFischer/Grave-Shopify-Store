# Grave Shopify Store — Agents Notes

## Deploy Workflow

### ⚠️ CRITICAL: CDN Cache
Shopify's CDN caches CSS files permanently (1-year `max-age=31557600`). Once a filename is served by the CDN, **all subsequent uploads to the same filename are invisible**.

**Always use a new filename** for CSS changes. Never modify `grave-custom.css` and expect it to update.

### Deploy Process
1. Create a new CSS file with a fresh name: `grave-v2.css`, `grave-v3.css`, etc.
2. Update `layout/theme.liquid` to reference the new filename
3. Push via CLI: `shopify theme push --store=i0zd90-iw --theme=148523188406 --allow-live`
4. After push, clear Liquid render cache by saving in Theme Editor or rename the theme in admin

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
- `assets/grave-live.css` — current active custom CSS file
- `layout/theme.liquid` — references `grave-live.css`
- `assets/jsSlideshow.js` — appended JS for parallax zoom and coffin scroll indicator
- `assets/ProximaNova-Bold.ttf` — custom font
- `assets/stay-haunted-banner.svg` — marquee SVG
- `assets/facebook.svg`, `assets/instagram.svg` — social icon SVGs
- `sections/footer.liquid` — footer layout with reference-based classes
