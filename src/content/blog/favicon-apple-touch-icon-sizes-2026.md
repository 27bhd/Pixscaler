---
title: "Favicon and Apple Touch Icon Sizes in One Checklist (2026)"
description: "Modern browsers request many icon sizes. Learn what to export, what you can skip, and how to keep crisp masters without shipping huge PNGs from your static site root."
pubDate: 2025-12-17
author: "Benchehida Abdelatif"
tags: ["favicon", "apple touch icon", "png", "web performance", "icons"]
---

Favicons are the smallest files on your site with the most annoying requirements. Browsers request a 16 pixel tab icon, iOS wants a 180 pixel home screen tile, Android and Windows pick up other sizes from manifests, and social previews are a different system entirely. If you only ship one `favicon.ico` from 2005, you are not wrong to ship something, but you are missing crisp marks on modern displays.

This checklist explains what to prepare in 2026, how to avoid absurd PNG weights in your root directory, and how to test without guessing.

## Quick answer

Start from a vector logo or a high resolution square master, then derive raster sizes you actually reference in your HTML manifest and Apple meta tags. Keep each PNG as small as practical while preserving readable edges at its display size. Pixscaler on [the tool page](/tool/) helps you batch export square PNGs **locally in the browser** using **Web Workers** so brand marks do not pass through random online resizing services. For wider marketing images elsewhere on your site, do not confuse favicons with Open Graph assets: compare share images with the [blog featured image preset](/resize/blog-featured-image/) instead.

## The baseline: `favicon.ico` still matters

Some tools still expect `favicon.ico` in the site root. ICO can contain multiple embedded sizes. If you maintain ICO, ensure it includes at least 16 and 32 pixel representations for tab clarity.

## PNG favicons for modern browsers

Many sites ship `favicon-32x32.png` and `favicon-16x16.png` alongside SVG when available. SVG favicons are supported in some browsers but not universal. Raster fallbacks remain a safe default.

## Apple touch icon: the common 180 square

A typical tag is `rel="apple-touch-icon"` pointing to a 180 x 180 PNG. iOS may apply rounding and visual effects, so keep important logo details centred with padding.

## Android and PWAs: manifest icons

Web app manifests often list 192 and 512 pixel icons for install prompts. These should be clean squares with enough padding that the OS mask does not clip your mark.

## Maskable icons and safe zones

Android’s maskable icon format expects a larger safe zone because adaptive shapes can crop more aggressively than iOS rounded squares. If you support maskable icons, design with even more padding than Apple touch icons.

## Windows tile metadata

Some sites still ship `browserconfig.xml` and tile images. If you support Windows pinning, keep those assets updated alongside your main icon set or remove them deliberately to avoid stale branding.

## SVG favicons: useful, not universal

SVG favicons can stay crisp at any display size, but not every browser and crawler path handles them consistently. A pragmatic approach is SVG plus raster fallbacks, not SVG alone, unless you have verified your audience.

## Sharpness starts in the master

Export icons from vector whenever possible. If you only have a raster logo, avoid recompressing it repeatedly across formats. Keep one clean PNG master in your design repository, then derive web sizes from that master in one session.

## A practical export checklist

1. Export a master square at least 512 pixels wide from vector if possible.
2. Generate 16, 32, 180, 192, and 512 variants from that master, not by upscaling a tiny source.
3. Run lossless optimisations appropriate to your pipeline, then verify tab clarity in Chrome, Safari, and Firefox.
4. Confirm filenames and `<link>` tags match exactly, because caching makes typos painful.

## Weight discipline in the site root

It is easy to accumulate ten full colour PNGs at 512 pixels that each weigh half a megabyte because nobody compressed them. That is silly weight for icons. Downscale and compress sensibly while keeping edges crisp.

## Dark mode and `prefers-color-scheme`

Some sites ship alternate icons for dark browser chrome. If you do, keep both sets updated when the logo changes, otherwise users see mismatched branding at night.

## `theme-color` is not a favicon, but it sits next to one

Browser UI tinting uses `theme-color` meta tags. Coordinate tint with icon background choices so the tab strip does not clash visually.

## Lighthouse and “properly sized images”

Lighthouse may flag icon assets if your HTML references a 512 pixel icon where only 16 pixels display. Some flags are informational. Decide whether you care enough to split tags for every surface or accept the warning as a tradeoff for install quality.

## Git hygiene for binary icons

Icon changes create binary diffs. Commit them intentionally, reference them in release notes, and avoid churning icons weekly without reason because reviewers stop caring and mistakes slip through.

## Accessibility: icons are decorative until they are not

Favicons rarely carry meaning for assistive tech, but your site title does. Keep titles readable and unique so tabs remain distinguishable when users have many open.

## `rel="icon"` type attributes and MIME confusion

Be explicit with `type` attributes where your server MIME types are easy to misconfigure. Misconfigured types cause silent failures that look like “Safari hates my site” when it is just headers.

## CDN caching for icons

If you serve icons via a CDN, purge caches after updates or use versioned filenames. Icons are the kind of asset people “fix” five times because caching hid the last fix.

## Favicon theft is weird, but it happens

Some attackers swap icons on compromised sites as a subtle brand attack. Monitoring unexpected icon changes is niche, but not crazier than monitoring unexpected JS.

## What Pixscaler offers as one option

Open [the homepage](/), set exact width and height for each square output, export PNG, download. Iterate locally until tab icons look sharp without bloating your repository.

## Common mistakes

**Upscaled blurry marks**  
If the source logo is 64 pixels wide, no amount of icon sizes fixes it.

**Different marks per platform**  
Confuses users who pin your site next to your app.

## What to do next

Audit your `public/` icon set, regenerate from a vector master, compress, redeploy, and verify install prompts and tab icons on a real iPhone and a mid tier Android phone. Read more on [the blog index](/blog/).
