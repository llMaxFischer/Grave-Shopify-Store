---
name: shopify-cdn
description: Use when editing CSS files for this Shopify theme. Reminds agent to always create new filenames for CSS changes due to Shopify CDN permanent caching. Trigger keywords: CSS, stylesheet, grave-live.css, grave-v3.css, grave-v4.css, theme.liquid, asset_url, style, design, colors, layout, buttons, fonts.
---

# Shopify CDN Caching Rules

## CRITICAL: CDN Cache Behavior

Shopify's CDN caches CSS files **permanently by filename**. Once a CSS file is uploaded with a specific filename, the CDN serves that exact version forever — even if you overwrite the file with new content.

**This means:** Editing `grave-v19.css` and re-uploading will NOT show changes to users. The CDN still serves the original cached version.

## Why This Happens

Shopify is a production-first platform built to handle massive traffic. Its infrastructure caches assets heavily so websites load instantly for customers, but it actively fights live local or AI development workflows. There is no "Clear Cache" button in the admin panel.

- Shopify CDN uses aggressive caching (1-year max-age)
- Bare query strings (`?v=123`) no longer bust the cache (2026 Shopify update)
- Only a completely new filename forces the CDN to fetch fresh content
- The `| asset_url` filter appends a version hash, but the CDN still caches by filename

## Required Workflow for ALL CSS Changes

1. **ALWAYS create a new CSS file** with a unique filename (e.g., `grave-v20.css`, `grave-v21.css`)
2. **Copy the current CSS content** to the new file
3. **Make all edits** to the NEW file
4. **Update `layout/theme.liquid`** to reference the new filename:
   ```
   {{ 'grave-v20.css' | asset_url | stylesheet_tag }}
   ```
5. **Push BOTH files** together:
   ```
   shopify theme push -s i0zd90-iw -t 148523188406 --allow-live --nodelete
   ```
6. **Tell the user to hard refresh** (Cmd+Shift+R) to see changes

## File Naming Convention

Use the pattern: `grave-v{N}.css` where N increments by 1 each time.

Current active file: `grave-v19.css`

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
1. **Verify the code is correct in the Shopify backend** (code editor or API)
2. **If code looks correct → STOP. Tell the user:**
   - "The code is correct in the Shopify backend"
   - "The CDN is caching the old version"
   - "Do NOT let me write more code yet"
   - "Please check in Incognito window or secondary browser"
   - "If still not showing, try the Double Save trick (see below)"
3. **Only write more code if the user confirms the backend code is wrong**

## How to Bypass the CDN Cache

### 1. Filename Change (Only 100% Reliable Fix)
Rename the file and update `theme.liquid`. The CDN treats a new filename as an entirely new entity and has no choice but to fetch the fresh file.

### 2. Preview ID URL (Not Live Storefront)
When viewing changes, use the Theme Editor Preview URL with the `?preview_theme_id=XXXX` parameter. This URL pipeline bypasses the heaviest server-side caching. If you lose that query parameter, you're looking at cached code.

### 3. Ghost Edit / Double Save Trick
Forces Shopify's backend to re-render the template:
1. Open Shopify code editor
2. Open the file that was just changed
3. Add a single space → Save
4. Delete the space → Save
5. This forces an explicit backend compile command

### 4. Multi-Browser Strategy
- Don't rely on Cmd+Shift+R alone
- Keep an Incognito window open for checking changes
- Or use a secondary browser (Safari/Firefox) just for previewing

## Verification Checklist

Before showing the user any CSS change, verify:
- [ ] New filename was created (not editing an existing file)
- [ ] theme.liquid was updated to reference the new filename
- [ ] Both files were pushed to Shopify successfully
- [ ] User was told to hard refresh
- [ ] If user says "not showing" → verify code via API or code editor
- [ ] If code is correct → it's CDN cache, not code issue

## Emergency: If Changes Aren't Showing

1. **First**: Verify code exists on Shopify (API check or code editor)
2. **Second**: If code is correct → it's CDN cache. Do NOT rewrite code.
3. **Third**: Have user try:
   - Incognito window
   - Secondary browser
   - Double Save trick
   - Preview URL with `?preview_theme_id=` parameter
4. **Fourth**: Only if all above fails → push again with new filename

## What NOT to Do

- Do NOT append bare query strings (`?v=123`) — they no longer work in 2026
- Do NOT edit an existing CSS filename and re-upload
- Do NOT rewrite code logic when the issue is CDN caching
- Do NOT let the agent loop 5-6 times on the same visual bug
