---
name: shopify-cdn
description: Use when editing CSS files for this Shopify theme. Reminds agent to always create new filenames for CSS changes due to Shopify CDN permanent caching. Trigger keywords: CSS, stylesheet, grave-live.css, grave-v3.css, grave-v4.css, theme.liquid, asset_url, style, design, colors, layout, buttons, fonts.
---

# Shopify CDN Caching Rules

## CRITICAL: CDN Cache Behavior

Shopify's CDN caches CSS files **permanently by filename**. Once a CSS file is uploaded with a specific filename, the CDN serves that exact version forever — even if you overwrite the file with new content.

**This means:** Editing `grave-v18.css` and re-uploading will NOT show changes to users. The CDN still serves the original cached version.

## Required Workflow for ALL CSS Changes

1. **ALWAYS create a new CSS file** with a unique filename (e.g., `grave-v19.css`, `grave-v20.css`)
2. **Copy the current CSS content** to the new file
3. **Make all edits** to the NEW file
4. **Update `layout/theme.liquid`** to reference the new filename:
   ```
   {{ 'grave-v19.css' | asset_url | stylesheet_tag }}
   ```
5. **Push BOTH files** together:
   ```
   shopify theme push -s i0zd90-iw -t 148523188406 --allow-live --nodelete
   ```
6. **Tell the user to hard refresh** (Cmd+Shift+R) to see changes

## File Naming Convention

Use the pattern: `grave-v{N}.css` where N increments by 1 each time.

Current active file: `grave-v18.css`

## ⚠️ CRITICAL: Avoid the Compounding Loop

**When the user says "changes aren't showing," do NOT write more code.**

### The Trap
1. You write code → push to Shopify
2. User says "I don't see the change" (CDN cache serving old version)
3. You write MORE code to "fix" it
4. Now there are conflicting styles
5. User says "that broke something else"
6. You write EVEN MORE code to fix that
7. Repeat until chaos

### The Correct Response
1. **Ask the user to check the Shopify code editor** (not the visual preview)
2. **If the code is correct in the editor → it's a CDN issue, not a code issue**
3. **Tell the user:**
   - "The code is correct in the backend"
   - "The CDN is caching the old version"
   - "Please check in Incognito window or secondary browser"
   - "If still not showing, try the Double Save trick"
4. **Do NOT write more code until the user confirms the backend code is wrong**

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

## Verification Checklist

Before showing the user any CSS change, verify:
- [ ] New filename was created (not editing an existing file)
- [ ] theme.liquid was updated to reference the new filename
- [ ] Both files were pushed to Shopify successfully
- [ ] User was told to hard refresh
- [ ] If user says "not showing" → check Shopify code editor first
- [ ] If code is correct in editor → it's CDN cache, not code issue

## Emergency: If Changes Aren't Showing

1. **First**: Check if you edited an existing filename (bad) vs. created a new one (good)
2. **Second**: Verify theme.liquid references the correct new filename
3. **Third**: Ask user to check Shopify code editor (not visual preview)
4. **Fourth**: If code is correct in editor → have user try:
   - Incognito window
   - Secondary browser
   - Double Save trick
5. **Fifth**: Only if all above fails → push again with new filename

## Why This Happens

- Shopify CDN uses aggressive caching (1-year max-age)
- The `| asset_url` filter appends a hash, but the CDN still caches by filename
- Only a completely new filename forces the CDN to fetch fresh content
- This is a Shopify platform limitation, not a bug
