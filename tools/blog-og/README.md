# Blog OG generator

See **[`../README.md`](../README.md)** for how this fits with `sync-blog-og.mjs` and npm scripts.

## Quick steps

1. Put **`base.png`** here (your 1200×630 template).
2. Open **`preview.html`** in a browser, draw the title safe zone, save **`config.json`** here.
3. From repo root: **`npm run og:blog`** (full regen) or **`npm run og:blog:sync`** (only missing PNGs).

Outputs: **`public/og/blog/<slug>.png`** (slug = markdown filename without `.md`).

Frontmatter:

```yaml
heroImage: "/og/blog/your-slug.png"
```

## `config.json` notes

- **`typography.fontSize`**: maximum title size (px) for short titles.
- **`typography.fontSizeMin`**: smallest size the fitter will use for long titles.
- **`textBox.verticalAlign`**: `"center"` (default) or `"top"` inside the box.
