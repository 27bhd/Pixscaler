> Supplement for **Pixscaler**. See [`WRITING_GUIDE.md`](../WRITING_GUIDE.md) for which files to attach when prompting AI so you do not paste everything every time.

# Core voice and site-wide rules

## Non-negotiables

### 1) No em dashes

Do not use the em dash character anywhere in the site.

Avoid it in:

- Blog titles.
- Blog body copy.
- Frontmatter.
- Homepage copy.
- Buttons.
- Tooltips.
- Error states.
- Empty states.
- Placeholder text.
- Meta descriptions.
- Example copy.

Use these instead:

- A period and a new sentence.
- A comma.
- A colon when introducing a reason, list, or example.
- Parentheses for a short aside.
- A normal hyphen for ranges: `3-5`, `10-20`, `30-90`.

Reason: em dashes often make text feel overly polished, automated, or editorial. Copy on this site should feel plain, clear, and written by a real person.

### 2) No emoji

Do not use emoji characters anywhere on the site.

Avoid them in:

- Page headings.
- Feature cards.
- Button labels.
- Blog copy.
- Navigation.
- Hero sections.
- Footer copy.

Reason: emoji make professional, utility-focused copy feel informal and toy-like. They also render inconsistently across operating systems and screen readers announce them in ways that break reading flow. Use clear, concise text instead. If a section needs a visual element, use an SVG icon.

### 3) Write like a helpful human, not a content machine

Every page should sound like someone is trying to help the reader optimize their files or make a formatting decision.

Good writing on this site feels:

- Direct.
- Calm.
- Practical.
- Slightly conversational.
- Specific about image optimization, formats, resolution, and client-side privacy.
- Honest about technical tradeoffs.
- Easy to read on a phone.

Weak writing on this site feels:

- Overly dramatic.
- Full of hype.
- Stuffed with keywords.
- Written only for crawlers.
- Too formal.
- Too clever.
- Too vague.
- Like it was generated from a prompt and never edited.

If a sentence sounds like it belongs on 200 other SaaS websites, rewrite it.

### 3) Make every paragraph earn its place

Readers come to this site with a specific task in mind. They want to compress a heavy image, resize a photo to a target width, convert to WebP, or understand why their site loads slowly on mobile.

Do not waste their time with long abstract intros.

Before publishing any text, ask:

- Does this help someone resize, compress, convert formats, compare resolutions, or optimize images?
- Does this reduce confusion?
- Does this make the client-side tool easier to understand and trust?
- Would a developer, marketer, content creator, or SEO manager keep reading?

If not, cut it.

### 4) Keep the site readable before clever

This site can have personality, but clarity comes first.

Prefer:

- Short paragraphs.
- Clear headings.
- Concrete examples (e.g. compressing a 5MB image to 200KB).
- Plain labels.
- Scannable sections.
- Real-world image scenarios.
- Normal words.

Avoid:

- Long walls of text.
- Jokes inside important instructions.
- Dense SEO paragraphs.
- Complicated metaphors.
- Mystery buttons.
- Overwritten taglines.

People should understand the page even if they skim only the headings, buttons, and first sentence of each section.

### 5) Be useful even before conversion

The site should help people even if they never bookmark us, never click an ad, and never come back.

Useful content includes:

- How to batch-compress images client-side.
- How to choose between WebP and AVIF for web performance.
- How target file size compression quality loops operate.
- Why local, client-side processing is safer and faster.
- How image dimensions affect page speed and Core Web Vitals.
- How to prepare images for social media covers, Shopify products, or blogs.

Trust comes before monetization.

---

## What this site is

This site is Pixscaler: a blazing-fast, 100% client-side image resizer, converter, and compressor. 

At the current stage, the main promise is:

> Drag and drop images, resize or compress them instantly, and download modern formats locally. Your files never touch a server.

In future stages, the site may also include:

- Programmatic SEO landing pages for specific dimension targets (e.g. `/resize/facebook-cover-photo`, `/resize/instagram-story`).
- Advanced batch scaling templates.
- SVG optimization and format conversion.
- Dynamic visual cropping and aspect ratio locks.
- An Astro Blog focused on web performance, page speed optimization, image SEO, and format comparisons.

The writing guide must support that future without making the current site sound bigger than it is.

---

## Who we write for

### Primary readers

We mainly write for people who have heavy image files or specific size requirements for their site or project.

They may be:

- Web developers and designers optimizing assets for faster page loads.
- Content creators and social media managers sizing posts exactly.
- E-commerce sellers preparing batch photos for Shopify or Amazon.
- SEO managers trying to fix poor Core Web Vitals scores.
- Privacy-conscious creators who want absolute security for their files.
- Impatient builders who need instant local batch processing without waiting for server uploads.

They are usually impatient. They want instant results, not long loading screens or server queues.

### Secondary readers

Secondary readers include:

- Beginners who do not know the difference between JPEG, PNG, WebP, and AVIF.
- Users looking for a clear, jargon-free way to resize images to a specific kilobyte limit.
- Non-technical website owners who just received a speed warning from Google.
- Future search crawlers and AI answer engines analyzing our guides on web performance.

### Who we are not writing for

This site is not mainly for:

- Professional photographers looking for heavy, lossless desktop photo manipulation (like Photoshop or Lightroom).
- Users seeking cloud-based permanent image hosting or gallery sharing.
- Enterprise engineers seeking massive server-side programmatic image APIs.
- People looking for complex digital art editors.

We can cover technical aspects of compression, but the default explanation should stay readable.

---

## Core voice

Copy on this site should sound like a practical developer friend who has optimized a lot of websites and knows exactly where assets slow down.

Use a tone that is:

- Clear without being dry.
- Friendly without being silly.
- Confident without pretending to know everything.
- Helpful without talking down to the reader.
- Human without adding fake personal stories.

Examples of the right tone:

- "Drag and drop your images. We will compress them locally in your browser."
- "Since your browser handles all processing via Web Workers, your images never leave your device. They stay 100% secure and private."
- "To hit a target size (like under 200KB), we automatically adjust compression ratios in a fast local loop until the image fits."
- "WebP is the safest bet for modern websites, but AVIF can offer even higher compression without losing visual quality."

Examples of the wrong tone:

- "Unlock limitless asset optimization with our revolutionary AI-powered engine."
- "This simple canvas hack will solve all your image performance problems instantly."
- "In today's fast-paced digital landscape, maintaining premium visual integrity is paramount."
- "Embark on your file conversion journey with elite-grade algorithms."

---

## Site-wide writing rules

### Be specific

Do not write "improve your images" when you can describe exactly what optimization achieves.

Better words:

- Compress to under 200KB.
- Resize to exact pixel dimensions.
- Convert to modern WebP or AVIF.
- Optimize for Core Web Vitals.
- Process locally in the browser.
- Batch-scale 50 files at once.
- Save up to 80% on file size.

Weak:

> Get the best images for your site.

Better:

> Compress high-res images to under 200KB in seconds, convert them to WebP, and boost your page speed.

### Explain tradeoffs

Image compression is rarely about one magic setting. A good guide explains tradeoffs.

Examples:

- WebP is highly supported, but AVIF yields smaller files.
- Lossy compression saves massive file space, but too much compression adds artifacts.
- Local browser processing is private and instant, but your computer's memory determines how many huge files you can drop at once.
- Target size optimization is useful, but forcing a massive 4K raw photo into a tiny 50KB bucket will result in heavy quality loss.

Avoid pretending that high compression is free of quality costs.

### Use normal image examples

Use examples that look like real website assets.

Good examples:

- Compressing a `4.2MB` hero banner to `180KB`.
- Sizing a portrait photo to `1200 x 800` pixels.
- Batch-converting 30 PNG screenshots to WebP for a blog post.
- Exporting a transparent overlay as modern WebP.

Avoid joke sizes or unrealistic, pixelated targets unless describing what to avoid.

### Do not overpromise

Never promise:

- Infinitely small file sizes with zero quality loss.
- Guaranteed top Google page speeds (images are only part of the speed equation).
- Complete compatibility of AVIF with legacy browsers.
- Perfect automated layouts.

Use careful language:

- "reduces file size by up to 80%"
- "runs entirely in your browser"
- "helps improve page speed"
- "near-lossless quality"
- "keeps your files safe and local"

This keeps the site trustworthy.

### Be honest about local processing

This platform runs entirely in the client's browser. Explain this clearly.

Use plain explanations:

- "We use Web Workers to process your images locally. They never upload to a server."
- "Because all resizing and compression happens on your device, processing is private and instant."
- "Performance depends on your local browser memory."

Do not say:

- "We store your optimized files in our secure cloud."
- "Our servers compress your files with ultra-fast processors."

### Write for the next action

Most pages should answer: "What should the reader do next?"

Possible next actions:

- Drag and drop a file to compress.
- Choose a target file format.
- Set a width, height, or aspect ratio.
- Download the compressed assets as a ZIP.
- Read our format optimization guide.
- Check page speed impact.

Do not leave readers with a dead end.

---
