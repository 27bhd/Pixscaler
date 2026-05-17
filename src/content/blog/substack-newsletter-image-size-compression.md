---
title: "Substack Newsletter Images: Width, Compression, and Why Huge Files Hurt Mobile Readers"
description: "Substack rewards readable posts. Learn sensible image widths, how heavy embeds feel on mobile data, and how to compress locally in the browser before you hit publish."
pubDate: 2026-05-13
author: "Benchehida Abdelatif"
tags: ["substack", "newsletter", "image compression", "mobile readers", "webp"]
---

Substack is text first, yet the best posts still use images: charts, photographs, screenshots, and quoted social cards. Each image is another file your reader’s phone must download before the essay feels complete. When writers export directly from design tools or paste retina screenshots, they accidentally ship assets sized for print, not for email and mobile web.

This guide is for independent writers and small publications who want crisp images without punishing subscribers on commuter trains. You will learn practical width targets, format choices, and a local compression habit that keeps private drafts off random servers.

## Quick answer

Publish images no wider than your readers can display in the Substack reader, then compress with lossy formats for photos and PNG or lossless WebP when transparency and UI edges matter. If you want a familiar social style frame for link previews you reuse elsewhere, compare your hero to the [blog featured image preset](/resize/blog-featured-image/) at 1200 x 630 as a reference canvas. Pixscaler on [the tool page](/tool/) helps you resize and compress **locally in the browser** using **Web Workers**, which is useful when a draft includes screenshots of subscriber analytics you should not upload to unknown tools.

## Why width beats clever compression tricks

A 2400 pixel wide PNG scaled down by CSS still downloads as a 2400 pixel wide PNG unless Substack generates derivatives you cannot control. Your first lever is intrinsic pixels. Shrink to the maximum width you believe most readers will see in the app and web reader, then add a little headroom for retina if you insist on one master file.

Writers argue about the exact number. A pragmatic approach is:

1. Measure the reader column width on desktop in CSS pixels.
2. Multiply by two if you want retina sharpness for screenshots with small text.
3. Stop when file sizes stop jumping wildly between increments.

## Compression is a tradeoff, not a moral failure

Lossy compression removes information. The goal is to remove information your reader would not notice on a phone in daylight. Photographs tolerate more aggressive settings than screenshots of monospace terminal output.

If you compress a photo of a forest, artefacts hide in texture. If you compress a screenshot of a pricing table, artefacts show up as muddy numbers. Adjust per image family, not one global slider forever.

## Formats: JPEG, WebP, and PNG in the Substack context

**JPEG**  
Reliable for photos. Poor for UI screenshots with coloured backgrounds and sharp lines unless quality stays high, which costs bytes.

**WebP**  
Often smaller than JPEG for the same photo quality, and can carry transparency when you need it. Confirm how Substack treats WebP in your workflow by previewing a private draft post.

**PNG**  
Still the honest choice when you need lossless UI captures, at the cost of size. Consider flattening transparency if it does not matter, because flattening can sometimes help downstream compression.

## A pre publish checklist for image heavy issues

**Before you insert**

1. Is this image actually necessary, or could a paragraph carry the point?
2. Have you cropped dead borders and irrelevant chrome?

**Before you upload**

1. Dimensions: no wider than needed for the reader experience you target.
2. Format: photo versus screenshot decision made deliberately.
3. File size: open the image properties and ask whether a commuter would thank you.

**After you upload**

1. Open the post on a phone on cellular data, not only Wi-Fi.
2. Scroll through images in order. If one stalls the experience, revisit that asset.

## Email delivery is not the same as the web reader

Some subscribers read in email clients with different image handling. Huge images still cost battery and data even when clients downscale visually. The ethical posture is the same: do not ship archival masters by default.

## Privacy for drafts with sensitive screenshots

Newsletters often include revenue charts, unreleased product UI, or DMs pasted as images. If you use an online compressor, you may expose those drafts. Pixscaler processes images on your device in the browser, which removes one common third party from the chain. You still must handle secrets responsibly in the published post itself.

## Common mistakes

**Using animated exports where a still image would work**  
Animations are heavier and distract in longform reading.

**Pasting from clipboard without checking pixel size**  
Clipboard captures from 4K monitors are enormous.

**Optimising only the cover image**  
Readers hit inline images while scrolling. Inline weight matters more for total time to read comfortably.

## Captions and alt text habits

Images carry meaning, not only decoration. When you export a smaller file, check that text inside the image remains legible at the width you publish. If you rely on alt text for meaning, write alt text like a human, not like a file name. Good accessibility also helps readers on e ink devices and poor connections where images load late.

## Charts: SVG versus raster exports

If your chart is simple lines and labels, SVG can be sharper and smaller than a giant PNG screenshot from a slide deck. If your chart is a photographic heatmap from a tool that only exports raster, treat it like a photo and compress accordingly. The wrong move is always “screenshot the whole dashboard at 5K and hope Substack shrinks it”.

## HEIC files from iPhones

Many writers draft on phones. HEIC is efficient on disk for Apple’s ecosystem, but it is not always the friendliest format for newsletter tooling. Convert to JPEG or WebP locally before upload when your workflow demands it. Pixscaler can help with that conversion on your machine in the browser without sending originals to a remote optimiser.

## Seasonal traffic spikes

Holiday issues attract casual readers who bounce if the page feels slow. Image discipline is part of hospitality. You would not serve a newsletter that takes ten seconds to scroll past the first photo without noticing.

## What to do next

Pick your last three posts, inspect the largest inline image in each, and re-export with disciplined width and compression. If you want a reference size that matches many blog and share conventions, open the [blog featured image preset](/resize/blog-featured-image/) and compare how your hero crops feel relative to that frame. More publishing performance notes live on [the blog index](/blog/).
