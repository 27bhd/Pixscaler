> Supplement for **Pixscaler**. See [`WRITING_GUIDE.md`](../WRITING_GUIDE.md) for which files to attach when prompting AI so you do not paste everything every time.

# Polish: humanization, formatting, accessibility, checklists, and repo notes

## Humanization rules

The site should feel human, practical, and developer-friendly without becoming messy.

### Use contractions naturally

Use contractions where they sound normal in speech:

- "you'll"
- "we'll"
- "don't"
- "can't"
- "it's"

Do not force contractions into every sentence. Some detailed explanations of compression algorithms read better without them.

### Vary sentence length

Mix short and medium sentences.

Short sentence:

> Start with WebP.

Medium sentence:

> If your target file size is extremely small and you want to maximize compression, test AVIF before falling back to standard formats.

Avoid long sentences with multiple clauses unless the technical concept truly needs them.

### Add small real-world details

Human writing includes details that come from actual usage.

Good:

- "Forcing a 10MB photo into a 20KB limit will make it look like a blurry mess."
- "Images with text look pixelated if you compress them too hard using lossy settings."
- "First-year Shopify sellers often struggle with slow page loading caused by raw camera files."
- "Web Workers ensure your browser tab stays smooth while doing heavy math on 40 photos."

These details make the copy feel written by a developer who has optimized real sites.

### Avoid fake personality

Do not add fake excitement or forced jokes to serious tasks.

Avoid:

- "Boom."
- "Magic."
- "Pixel shrinking made sexy."
- "Your next lightning-fast website is waiting."

Light, practical personality is fine when it does not reduce trust.

### Remove AI filler

After any AI-assisted draft, search for and remove phrases like:

- "in today's digital landscape"
- "unlock the power"
- "game-changer"
- "seamless experience"
- "robust solution"
- "revolutionize"
- "leverage"
- "elevate your assets"
- "cutting-edge"
- "look no further"
- "whether you're a seasoned professional or just starting out"

Replace them with specific, plain language.

---

## Formatting rules

### Markdown

Use normal Markdown for blog posts and documentation.

Use:

- `##` for main sections.
- `###` for subsections.
- Bullets for short lists.
- Numbered lists for ordered steps.
- Tables only when format comparison is clearer in a table.
- Blockquotes for important warnings or example metrics.

Avoid:

- Too many nested bullets.
- Huge tables on mobile.
- Extra blank lines for visual spacing.
- Fenced code blocks for normal prose.

### Code blocks

Use fenced code blocks only for actual code, CSS properties, console commands, or structured data examples.

Do not use code blocks for normal article copy, size advice, or UI text examples unless monospace formatting is necessary.

For image format and size examples inside text, inline code is fine:

`1200x800`, `WebP`, `AVIF`, `200KB`

### Tables

Tables are useful for comparisons, but keep them readable on mobile.

Good table topics:

- WebP vs AVIF vs PNG vs JPEG compression features.
- Recommended social media resolutions.
- Before and after file sizes.
- Portal size thresholds.

Avoid tables when bullets would be easier on mobile.

### Bold text

Use bold sparingly.

Good uses:

- Important warnings.
- Key terms.
- The main takeaway in a section.

Avoid bolding random phrases just to create visual rhythm.

### Lists

Lists should make scanning easier.

Good list items are parallel:

- Convert to WebP.
- Scale to width.
- Reduce to 150KB.
- Download ZIP.

Weak list items mix shapes:

- Turn into WebP format.
- Scaling dimensions is important.
- Think about sizes under 150KB.
- Download.

---

## Accessibility and readability

Writing affects accessibility.

### Plain language

Prefer common, direct words.

Use:

- "buy" instead of "procure"
- "use" instead of "utilize"
- "help" instead of "facilitate"
- "check" instead of "verify" when casual
- "size" instead of "dimensions structure" when simple

Technical terms are fine when needed, but explain them.

### Explain acronyms

First mention:

- "Largest Contentful Paint (LCP)"
- "Cumulative Layout Shift (CLS)"
- "WebP format"
- "AVIF format"
- "Web Worker API"

After that, shorter terms are fine.

### Avoid color-only meaning

If writing UI copy, do not rely only on color.

Good:

- Green progress bar with text "Completed" or "100%".
- Red indicator with text "Failed: Too large".
- Error message with clear text.

Bad:

- "Green files are optimized, red files are not" with no labels.

### Mobile reading

Assume many readers are on phones.

Rules:

- Keep paragraphs short.
- Break long sections with headings.
- Avoid wide tables unless necessary.
- Use bullets for scan-heavy content.
- Put the answer near the top.

---

## Editing checklist for AI drafts

Any AI-assisted draft must be edited before publishing.

Do this pass:

- [ ] Remove em dashes.
- [ ] Delete generic AI phrases.
- [ ] Add at least one image optimization example.
- [ ] Add one real compression caveat (quality tradeoff).
- [ ] Make the intro faster.
- [ ] Check that the title matches the actual page.
- [ ] Replace vague claims with specific ones.
- [ ] Add internal links to the resizer workspace.
- [ ] Confirm the CTA fits the reader's next step.
- [ ] Read the first two paragraphs aloud.
- [ ] Make sure UI text is shorter than blog text.
- [ ] Check that no claim sounds legally guaranteed.

If the draft still sounds like a generic SaaS article, rewrite the opening and headings first.

---

## Publishing checklist

Before publishing a page or post:

- [ ] No em dashes anywhere.
- [ ] The page has a clear purpose.
- [ ] The main reader is obvious.
- [ ] The first screen or first paragraph explains the value.
- [ ] The text sounds human and specific.
- [ ] Claims about compression are careful.
- [ ] Local client-side processing is explained clearly.
- [ ] Any programmatic social media dimension advice is accurate.
- [ ] Internal links help the reader continue.
- [ ] The CTA is specific.
- [ ] The title is searchable but not clickbait.
- [ ] The meta description is specific and not stuffed.
- [ ] Examples use realistic file sizes and format comparisons.
- [ ] Paragraphs are short enough for mobile.
- [ ] Blog posts include enough depth to be worth bookmarking.
- [ ] UI text is short, direct, and easy to act on.
- [ ] A human proofread the final version.

---

## File and route notes

Planned refactored content locations (Astro + React components stack):

- Homepage & Workspace: `src/pages/index.astro`
- Blog index: `src/pages/blog/index.astro`
- Blog posts: `src/content/blog/`
- Resizer React component: `src/components/ImageResizer.tsx`
- Web Worker script (compression process): `src/workers/compressor.worker.ts`
- Layout copy and SEO defaults: `src/layouts/BaseLayout.astro`
- Navigation: `src/components/Navbar.astro`
- Footer: `src/components/Footer.astro`

When adding new content, keep route names simple and readable.

Good future routes:

- `/` (Main tool workspace)
- `/blog/` (Content home)
- `/blog/resize-image-to-200kb/`
- `/blog/batch-compress-png-to-webp/`
- `/resize/facebook-cover-photo/` (Programmatic SEO preset page)
- `/resize/shopify-product-image/` (Programmatic SEO preset page)

Avoid route names that are vague, dated too early, or stuffed with every keyword.

---

## Build, sitemap, and discovery (ops)

These details help AI and humans ship without breaking SEO plumbing.

- **Production build:** from the repo root, `npm run build` runs `astro build` and is the usual gate before deploy.
- **Sitemap:** `@astrojs/sitemap` is enabled in `astro.config.mjs`. The `site` URL in that config should match production; if it is wrong, sitemap entries and absolute OG image URLs will be wrong too.
- **Robots:** keep `public/robots.txt` aligned with what you want crawled (and with any ads file like `public/ads.txt` if you use it).
- **RSS:** the starter documents blog feed `/rss.xml` in the writing guides.

---

## Typography and layout (let CSS do the work)

Article or marketing layout spacing should come from components and global CSS, not from stacking extra blank lines in Markdown or Astro to fake padding. Write normal structure; adjust rhythm in styles when needed.

---

## Final quality gate

Before shipping any meaningful text on this site, ask:

> Would someone with a heavy, unoptimized image open in another tab find this useful, clear, and trustworthy?

If the answer is no, improve the copy before publishing.

The best writing on this site helps readers move from "I have a heavy image" to "I have a compressed modern WebP file."
