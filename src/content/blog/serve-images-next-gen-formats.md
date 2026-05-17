---
title: "How to Fix 'Serve Images in Next-Gen Formats' in PageSpeed Insights"
description: "If Google PageSpeed is flagging your images, the fix is usually straightforward. Convert JPEGs and PNGs to WebP or AVIF and cut your file sizes by up to 80 percent."
pubDate: 2026-05-17
author: "Pixscaler Team"
tags: ["pagespeed insights", "next-gen formats", "webp", "avif", "core web vitals"]
---

When you run your website through Google PageSpeed Insights or Lighthouse, one of the most common warnings is this: "Serve images in next-gen formats." Below it, you usually see a list of your JPEGs and PNGs with an estimated savings in kilobytes.

The good news is that this is one of the most straightforward performance issues to fix. It does not require a developer, a plugin, or a server change. You convert the images, re-upload them, and the warning goes away.

## What are next-gen formats?

Next-gen image formats are file types that use more efficient compression algorithms than JPEG and PNG. The two that matter right now are WebP and AVIF.

**WebP** was developed by Google and released in 2010. It compresses photographic images 25 to 35 percent better than JPEG at the same visual quality. It also supports transparency, which means it can replace PNGs in most cases. Browser support is essentially universal now.

**AVIF** is newer, based on the AV1 video codec. It compresses even further than WebP, sometimes by 50 percent or more compared to JPEG. Browser support is strong on Chrome, Edge, Firefox, and Safari but may be limited on very old devices. If you need maximum compatibility, WebP is the safer choice.

## Quick answer

Convert your site's JPEGs and PNGs to WebP. For most websites, this reduces image payload by 25 to 40 percent without any visible quality difference. If your traffic is primarily on modern browsers and you want even smaller files, test AVIF for key images.

## Why PageSpeed flags this

Google's Lighthouse audit checks the format of every image on the page. JPEG and PNG files are flagged because they are larger than the equivalent WebP or AVIF file for the same visual output. The "potential savings" figure shows how much smaller your images could be in a next-gen format.

This matters because image weight is one of the largest contributors to a slow Largest Contentful Paint (LCP) score, which is a Core Web Vitals metric that Google uses as a ranking signal.

## How to convert images to WebP or AVIF

You do not need Photoshop, a command line, or a WordPress plugin to convert images. You can do it entirely in your browser using Pixscaler.

1. Open [Pixscaler](/).
2. Drop your JPEG or PNG files into the workspace.
3. Select "WebP" or "AVIF" from the format dropdown.
4. Click "Compress images."
5. Download the converted files and re-upload them to your website, replacing the originals.

All conversion happens locally in your browser. Your files never leave your computer.

If you are doing a bulk conversion of many images at once, drop them all in at the same time and click "Download all" to get a ZIP file of the converted assets.

## Do I need to worry about browser support?

For WebP: no. Every browser that has been released since 2020 supports WebP. If you are worried about very old browsers, you can use a `<picture>` element with a JPEG fallback, but for most sites this is unnecessary.

For AVIF: check your analytics. If fewer than 5 percent of your users are on browsers without AVIF support, it is probably worth using. Chrome, Firefox, Edge, and recent Safari versions all support it. If you need to cover a broader range, stick to WebP.

## Before and after

A typical 3.5MB product photo saved as JPEG at standard quality might compress to:

- **JPEG at 80% quality:** ~500KB
- **WebP at 80% quality:** ~330KB
- **AVIF at 80% quality:** ~220KB

The visual difference between these three at standard screen viewing distances is usually not noticeable. The load time difference, especially on mobile connections, is significant.

## What about transparency?

PNG is often used for logos, icons, and graphics with transparent backgrounds. WebP supports full alpha channel transparency, so you can replace most PNGs with WebP without any visual change. Convert the PNG file using Pixscaler and select WebP as the output format. The transparency will be preserved.

AVIF also supports transparency, but check your browser support requirements before switching critical transparent assets to AVIF.

## After converting

Once you have converted and re-uploaded your images, run PageSpeed Insights again. The "Serve images in next-gen formats" warning should be gone or show a much smaller savings estimate for any images you could not convert.

If you have a Shopify store, use our [Shopify product image preset](/resize/shopify-product-image) to pre-configure the exact dimensions and WebP format recommended for product listings.

If you are converting blog images, use the [blog hero preset](/resize/blog-featured-image) to get the right dimensions for Open Graph previews at the same time.

## What to do next (in order)

Work through these steps once per page or template you are fixing:

1. Identify which images PageSpeed flagged and note where they load in your HTML or CMS.
2. Download the originals (or export the highest-quality sources you have permission to use).
3. Convert to WebP (or AVIF if your audience’s browsers support it well enough).
4. Check that the visual quality is acceptable at the sizes where images are displayed.
5. Re-upload the converted files and update any `<img src>` references (or equivalent CMS fields).
6. Run PageSpeed Insights again to confirm the warning is resolved or materially reduced.
