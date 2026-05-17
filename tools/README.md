# Tools

Small utilities next to the Astro site. Nothing here runs in production or in the browser bundle.

## Blog OG images (`blog-og/` + `sync-blog-og.mjs`)

**Goal:** 1200×630 PNGs for social previews, one file per post at `public/og/blog/<slug>.png`, matching `heroImage: "/og/blog/<slug>.png"` in frontmatter.

| What | Where | When to use |
|------|--------|----------------|
| **Design the template and safe text box** | `blog-og/preview.html` | Once (or when the art changes). Drag the rectangle where titles may go, download `config.json` into `blog-og/`. |
| **Base artwork** | `blog-og/base.png` | Your blank template (ideally 1200×630; other sizes are cropped with cover). |
| **Typography & paths** | `blog-og/config.json` | `textBox` from the preview; `typography.fontSize` / `fontSizeMin` cap how large or small titles render. |
| **Regenerate every post** | `npm run og:blog` | Runs `tools/blog-og/generate.mjs`. Overwrites **all** `public/og/blog/*.png`. |
| **Only missing PNGs** | `npm run og:blog:sync` | Runs `tools/sync-blog-og.mjs`. Skips a slug if `public/og/blog/<slug>.png` already exists. `npm run og:blog:sync -- --force` rebuilds all like `og:blog`. |

**Font:** Titles use **Outfit 700**, embedded from `@fontsource/outfit` (same family as `src/styles/global.css` Google import). Wrapping uses a width estimate tuned for Latin text; the script **binary-searches** the largest font size between `fontSizeMin` and `fontSize` that still fits inside `textBox` height, then vertically centres the block unless `textBox.verticalAlign` is `"top"`.

**Dependencies:** `sharp` and `@fontsource/outfit` are **devDependencies** on the repo root `package.json`.

More detail: `blog-og/README.md`.
