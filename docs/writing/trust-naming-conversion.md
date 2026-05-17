> Supplement for **Pixscaler**. See [`WRITING_GUIDE.md`](../WRITING_GUIDE.md) for which files to attach when prompting AI so you do not paste everything every time.

# Trust, compression, and monetization

## Accuracy and trust rules

This platform must be careful with claims to maintain absolute credibility.

### Compression and quality claims

Use accurate wording when explaining optimization results.

Preferred:

- "reduces file size by up to 80%"
- "keeps visual quality near-lossless"
- "optimized for human eye perception"
- "visual comparison shows no noticeable difference at normal zoom levels"
- "processes images locally in your browser"

Do not claim:

- "zero loss in file resolution or raw data" (lossy compression does discard metadata and sub-pixel details to shrink files).
- "guarantees infinite quality at any scale."

### Privacy and data safety claims

Since our tool runs 100% client-side, make this our strongest trust factor.

Preferred:

- "Your images never leave your computer."
- "Processing is done 100% locally on your device via Web Workers."
- "Secure, private, and fully offline-capable."
- "We do not store, view, or upload any of your files."

Do not say:

- "We store your files on our secure remote database."
- "Our servers process and guard your images."

### Performance and AdSense claims

We are an ad-supported utility tool, so keep the integration balanced and transparent.

Preferred:

- "AdSense units are located in the sidebar or below the download zone so they never interrupt your drag-and-drop workspace."
- "We serve light ads to keep this tool 100% free and private."
- "Building a high-quality blog layer ensures our site passes AdSense value standards."

Do not promise:

- "Guaranteed AdSense approval for any site clone."
- "Instantly earn thousands of dollars with a single-page tool."

### Copyright and portal compliance claims

This site is a utility, not a regulatory body.

Use:

- "Ensure you have the rights to use and modify the images you drop into our resizer."
- "We help you fit government or application portals (like passport applications, visa uploads, or e-commerce lists), but double-check portal requirements before submission."
- "Our target file size compression attempts to get as close as possible to your specified kilobyte threshold."

Do not use:

- "This image is legally certified for any government passport portal."
- "No copyright concerns when compressing files."

### Technical claims

Explain canvas rendering and Web Worker multi-threading in plain English without confusing readers.

Good:

> We render your images onto an offscreen canvas and run compression algorithms inside Web Workers. This keeps processing extremely fast and stops your browser tab from freezing, even on large batches.

Bad:

> Our proprietary server-side cloud AI compresses images with zero processing impact on your machine.

---

## Image format and compression standards

When advising readers on how to choose formats and compression settings, stick to these guidelines.

### Highly optimized images are usually

- Converted to next-gen formats (WebP or AVIF).
- Scaled to the exact display dimensions (not larger than the container width).
- Kept under 200KB for large headers, and under 50KB for standard web images.
- Kept clean with descriptive, lowercase, hyphenated filenames for image SEO (e.g. `green-running-shoe.webp` instead of `IMG_9381.PNG`).
- Compressed lossily to balance speed and visual clarity.

### Unoptimized images often have

- Massive resolutions (like raw 4000x3000 camera uploads) displayed in tiny 400px grids.
- Outdated formats like raw PNG or uncompressed JPEG for simple blog photographs.
- File sizes over 1MB, which destroys mobile performance.
- Vague, auto-generated names (e.g. `screenshot-2026-05-17.png`).
- Visible distortion or artifacts from forcing extreme low-quality compression.

### Format advice

Keep advice balanced and practical.

General guidance:

- **WebP**: The default modern standard. Highly compressed, has excellent browser compatibility, and supports transparent backgrounds.
- **AVIF**: The next-generation pioneer. Offers even smaller file sizes than WebP, but legacy browsers or older devices may not display them properly.
- **PNG**: Best only when lossless pixel-per-pixel accuracy is mandatory, or for simple logos with sharp text.
- **JPEG**: A legacy fallback format. Good for high compatibility, but should usually be converted to WebP for modern web performance.

---

## Conversion and ad layout rules

This site monetizes primarily through AdSense, which requires high user retention and frictionless interaction.

### Where to suggest the resizer tool

Introduce the resizer naturally within blog posts:

- Immediately after explaining an image format tradeoff.
- Following a step-by-step sizing tutorial.
- In a "Before you upload" checklist.
- In a quick summary box near the top of PageSpeed resolution articles.

Avoid interrupting the reading flow with aggressive CTAs.

### CTA tone

Good CTAs:

- "Drag and drop your images into the resizer workspace."
- "Convert your PNG files to WebP instantly."
- "Set a target size and optimize your assets locally."
- "Try the free offline-capable compressor."

Avoid:

- "Unlock ultimate image power now."
- "Click here to revolutionize your visuals."

### Monetization transparency

Keep ad placement clean to build long-term trust.

Rules:

- Do not cover the drop zone with popups, anchor ads, or interstitials that disrupt dragging files.
- Place ad units in a sidebar next to the workspace, or directly below the action buttons (like the download buttons).
- Clearly explain that ads keep the tool completely free and private.
