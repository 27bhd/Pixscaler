> Supplement for **Pixscaler**. See [`WRITING_GUIDE.md`](../WRITING_GUIDE.md) for which files to attach when prompting AI so you do not paste everything every time.

# Blog content and SEO

## Blog content rules

Blog posts should support the tool and help readers make better image optimization and web performance decisions.

A good post on this site should be useful to someone who is actively working on speeding up their website, preparing images for social media or storefronts, or trying to understand web formats.

### Blog goals

Each article should do at least one of these:

- Explain an image optimization concept in plain English.
- Help someone choose between formats (WebP, AVIF, JPEG, PNG).
- Help someone avoid bad compression decisions (heavy quality loss or unoptimized formats).
- Teach a repeatable batch resizing/compression workflow.
- Address specific search intent (e.g. passport size photo limits, specific platform dimensions).
- Answer a search query about page speed with real depth.
- Support the Pixscaler tool with natural internal links.
- Build topical authority around image SEO, Core Web Vitals, and web performance.

### Blog topics that fit

Good future topics:

- How to resize an image to under 200KB for online forms.
- Why WebP and AVIF are better than JPEG and PNG for modern webs.
- How to fix "Serve images in next-gen formats" in Google PageSpeed Insights.
- What is the best image resolution and format for Shopify product pages?
- How to batch-compress PNG screenshots to WebP without losing transparency.
- How Core Web Vitals (like Largest Contentful Paint) are impacted by image size.
- Why local, client-side image processing is safer for sensitive documents.
- The ultimate guide to social media image sizes (Facebook, Instagram, LinkedIn dimensions).
- How to run iterative compression loops client-side to hit precise kilobyte limits.
- How to crop and scale images for clean responsive web layouts.
- Understanding lossy vs lossless compression tradeoffs.

Topics that do not fit unless they connect back to image performance:

- Generic online business motivation.
- Broad SEO advice with no speed or asset optimization angle.
- High-level programming tutorials with no canvas or Web Worker relevance.
- Generic design tutorials with no optimization focus.

### Article length

Short posts rarely earn trust or rankings.

Most articles on this site should be substantial enough to answer the query fully. That does not mean adding fluff. It means including the practical details a reader actually needs.

Strong articles often include:

- A clear, fast intro.
- A quick answer near the top.
- Step-by-step instructions.
- Dimension or format tables.
- Quality/compression comparison examples.
- Common mistakes.
- Edge cases.
- A next action to try the Pixscaler tool.
- Natural internal links.

Target:

- Simple answer post: 900-1,400 words.
- Practical guide: 1,500-2,500 words.
- Comparison page: 1,800-3,000 words.
- Pillar guide: 2,500+ words only if the topic deserves it.

Do not stretch a tiny topic into a long post just to hit a number. Add depth, not padding.

### Intro rules

The intro should get to the point quickly.

A good intro:

- Names the problem (e.g., slow page speed, file size limits).
- Gives the reader a reason to trust the page.
- Tells them what they will learn.
- Avoids generic internet filler.

Weak:

> In today's digital world, having optimized images is more important than ever.

Better:

> If you are trying to fix a 'Serve images in next-gen formats' warning on PageSpeed Insights, you do not need server-side plugins. Usually, converting your JPEGs to WebP or AVIF and compressing them to under 150KB solves the issue. This guide explains how next-gen formats operate and shows you how to convert your batch files locally.

### Quick answer sections

For search-focused posts, include a quick answer near the top when useful.

Example:

> Quick answer: To serve next-gen formats, convert JPEGs and PNGs to WebP or AVIF. This reduces file size by up to 80% without visible quality loss. Use our local client-side compressor to batch-convert your assets in seconds without uploading files to any server.

This helps readers, crawlers, and future answer engines understand the page.

### Headings

Headings should be descriptive.

Good:

- "Why JPEG is slowing down your e-commerce shop"
- "How to batch-convert PNGs to WebP while keeping transparency"
- "When AVIF beats WebP for web performance"
- "How to compress images to under 200KB for government portals"

Avoid:

- "The problem"
- "The solution"
- "Final thoughts"
- "Summary"

Generic headings make posts harder to skim.

### Examples

Use examples often. Image writing without examples becomes abstract fast.

Good example pattern:

> For a standard Shopify product card, a high-res 4000x3000 JPEG is massive technical debt. Scaling it to a maximum width of 1200px and converting it to WebP can compress the file from 3.5MB to just 120KB, making your catalog page load twice as fast.

Include examples for:

- Before and after file sizes.
- Exact dimension recommendations.
- Core Web Vitals score differences.
- Web Worker vs main thread processing behavior.
- Client-side compression loop cycles.
- Lossy vs lossless format outcomes.

### Checklists

Checklists work well for content on this site because readers are preparing assets.

Use checklists for:

- Before publishing a web page.
- Shopify product image checks.
- Social media export checks.
- Page speed audit steps.

Example:

- [ ] Is the format WebP or AVIF?
- [ ] Is the file size under 150KB for large images, and under 50KB for small thumbnails?
- [ ] Are the dimensions scaled to the maximum display width?
- [ ] Did you keep transparent backgrounds in PNG/WebP if needed?
- [ ] Did you process files locally to keep sensitive document scans secure?
- [ ] Are all filenames lowercase and hyphen-separated for SEO?

### FAQs

FAQ sections are useful when the topic has short follow-up questions.

Good FAQ questions:

- "Is WebP better than AVIF for web compatibility?"
- "Why does my image look blurry after compression?"
- "Will converting a PNG to WebP make it smaller?"
- "Can I compress images on my computer without uploading them?"
- "How many files can I batch-resize at once?"

Answer plainly. Do not turn every FAQ into a sales pitch.

---

## SEO rules

This site should be friendly to search engines and future crawlers without sounding like it was written only for them.

### Search intent first

Before writing, identify the reader's likely intent.

Examples:

- "resize image to 200kb": They want a simple tool and workflow to hit a portal limit.
- "compress png to webp": They want transparency preserved and high compression.
- "serve images in next-gen formats": They want to resolve a Google PageSpeed warning.
- "shopify image dimensions": They want reference guidelines and a way to batch-size images.
- "private image resizer": They want reassurance that files do not touch a remote server.

Match the page to the intent.

### Keywords

Use keywords naturally.

Good keyword phrases:

- bulk image resizer
- client-side image compressor
- serve images next-gen formats
- compress PNG to WebP
- convert to WebP
- local batch image resizer
- resize image to target size
- private image compressor
- image file size reducer
- core web vitals image optimization

Do not repeat a keyword in every paragraph.

Weak:

> Our bulk image resizer is the best bulk image resizer to bulk resize images with a bulk image resizer.

Better:

> Use the local bulk resizer to scale many files simultaneously inside Web Workers, bypassing server queues completely.

### Titles

Titles should be clear, searchable, and human.

Good:

- "How to Batch Compress PNG Images to WebP with Transparency"
- "How to Fix 'Serve Images in Next-Gen Formats' in PageSpeed Insights"
- "Best Image Dimensions and Formats for Shopify Storefronts"
- "How to Compress Images to Under 200KB Without Losing Quality"

Avoid:

- "The Ultimate Guide to Visual Mastery"
- "Unlocking the Magic of Pixels"
- "You Won't Believe These Page Speed Secrets"

### Meta descriptions

Meta descriptions should summarize the page and include the benefit.

Rules:

- Keep most descriptions around 140-160 characters.
- No em dashes.
- No clickbait.
- Include the main topic naturally.
- Make the page's promise clear.

Good:

> Learn how to batch-compress PNG images to WebP locally in your browser. Keep transparent backgrounds, reduce file size by 80%, and improve load speeds.

### Slugs

Slugs should be lowercase, readable, and stable.

Good:

- `/blog/batch-compress-png-to-webp/`
- `/blog/serve-images-next-gen-formats/`
- `/blog/webp-vs-avif-performance/`
- `/blog/resize-image-to-200kb/`

Avoid:

- `/blog/the-ultimate-image-guide-2026-final/`
- `/blog/post-1/`
- `/blog/imageResizerTips/`

### Internal links

Use internal links when they help the reader continue.

Good places to link:

- From a speed guide to the resizer workspace: `/`
- From a format article to related format comparisons.
- From a social media dimensions guide to the preset workspace page.
- From a privacy/client-side article to a local processing technical explanation.

Rules:

- Link with descriptive text.
- Do not use "click here."
- Do not force links into every paragraph.
- Use a trailing slash for blog paths if that matches Astro's configuration.
- Link to the workspace when the reader is ready to optimize a file.

**Internal linking checklist (before publish):**

- [ ] At least one internal link where the tool or another page on this site genuinely helps.
- [ ] Link text describes the destination (not "read more").
- [ ] Blog paths stay consistent with Astro routing styles.

### External links

Use external links only when they add trust or utility.

Good external links:

- Official Google PageSpeed Insights or Web Dev guidelines.
- MDN Web Docs on canvas and Web Workers.
- Official AVIF and WebP development specifications.
- Social media platform official size documentation.

Do not add external links just to look authoritative.

### Crawler clarity

Write pages so a crawler can understand:

- The main optimization topic.
- The tool's privacy promise (100% client-side, local processing).
- The target formats supported (WebP, AVIF).
- The difference between lossy and lossless compression.
- The next useful action (dropping files into the tool).

Use plain nouns. Do not hide meaning behind slogans.

### Page title and heading discipline

- One clear primary topic per URL: the article `title` and the on-page `h1` should match intent.
- Use a logical heading order (`h2` then `h3`). Do not skip levels for styling.
- Write descriptive `alt` text for images (empty `alt` only for decorative background borders).

### Markdown vs MDX for blog

- Default: **`.md`** for posts in `src/content/blog/`.
- Use **`.mdx`** if you need interactive resizer presets or visual sliders directly inside the article. Ensure the Astro configuration and Content Collection schemas match.

---

## Frontmatter rules for blog posts

Blog posts live in `src/content/blog/`.

Use frontmatter consistently.

Required fields:

- `title`
- `description`
- `pubDate`

Also supported by the schema:

- `tags` (array of strings)
- `author` (string)
- `updatedDate` (optional)
- `heroImage` (optional path string)

Example:

```yaml
---
title: "How to Batch Compress PNG Images to WebP"
description: "Learn how to convert multiple PNGs to modern WebP format client-side, keep transparent backgrounds, and dramatically reduce file sizes."
pubDate: 2026-05-17
tags: ["image compression", "webp", "batch resize"]
author: "Pixscaler Dev"
---
```

Description rules:

- No em dashes.
- No hype.
- No fake urgency.
- Keep it useful.
- Mention the real speed/size benefit.

---

## Content structures that work

### How-to guide

Use this for practical searches like "how to resize image to 200kb."

Structure:

1. Short intro with the portal or speed problem.
2. Quick answer.
3. Step-by-step compression process in the browser.
4. Width, height, and quality settings examples.
5. Common mistakes (over-compressing).
6. FAQ.
7. CTA link to drop zone.

### Format comparison

Use this for WebP vs AVIF, JPEG vs WebP, and similar topics.

Structure:

1. Quick format recommendation based on browser support and speed.
2. Core compression differences.
3. Compatibility matrix.
4. File size savings comparisons (e.g. standard JPEG vs WebP vs AVIF sizes).
5. Transparency and animation support notes.
6. Decision checklist.

### Speed optimization tutorial

Use this for solving "serve next-gen images" or LCP issues.

Structure:

1. Explain the warning from Google Lighthouse.
2. Show how heavy images impact loading speeds.
3. Explain client-side conversion as the cleanest fix.
4. Show a workflow for batch-converting site assets.
5. Provide before and after speed metrics.

### Platform preset guide

Use this for social media sizes or e-commerce dimensional requirements.

Structure:

1. List official dimension standards (e.g. Instagram, Shopify).
2. Explain why uploading correct ratios prevents ugly stretching.
3. Provide recommended file size limits for fast loads.
4. Embed the tool preset or provide instructions on using preset width/height toggles.
5. Link to the resizer tool.
