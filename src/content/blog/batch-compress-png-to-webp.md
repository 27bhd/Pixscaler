---
title: "How to Batch Compress PNG Images to WebP While Keeping Transparency"
description: "Converting a folder of PNG files to WebP reduces file size without losing transparent backgrounds. Here is how to do it in one session without uploading anything to a server."
pubDate: 2026-05-17
author: "Pixscaler Team"
tags: ["png to webp", "batch compression", "transparency", "image conversion", "web performance"]
---

PNG is the standard format for images that need a transparent background. Logos, icons, overlay graphics, and screenshots with transparent padding all tend to live as PNG files. The problem is that PNGs can be large, especially at high resolutions.

WebP handles transparency fully. An image with a transparent background converts to WebP without any visual change to the transparency, and the resulting file is typically 25 to 35 percent smaller than the original PNG.

This guide explains how to convert a batch of PNG files to WebP, keep the transparency intact, and reduce your total image payload in a single session without uploading anything to a server.

## Quick answer

Drop your PNG files into [Pixscaler](/), select WebP as the output format, and click "Compress images." Download the results individually or as a ZIP. Transparency is preserved automatically. All processing runs locally in your browser.

## Why PNG files are often large

PNG uses lossless compression. Every pixel is stored accurately, which makes it ideal for images where visual precision matters. But "lossless" also means the compression algorithm cannot throw away any visual information to reduce file size further.

A logo at 800 x 400 pixels with a transparent background is probably around 30 to 80KB as a PNG. At 1600 x 800 for a retina display, it might be 100 to 250KB. That adds up quickly if you have dozens of icons or UI graphics.

## How WebP handles transparency

WebP supports an alpha channel (the fourth channel in RGBA colour space) which stores transparency information pixel by pixel, the same way PNG does. When you convert a PNG to WebP in Pixscaler, the alpha channel is carried across to the output file without any modification.

The compression on the non-transparent pixels uses WebP's more efficient algorithm, which is where the file size reduction comes from. The transparent areas do not add much overhead in either format.

There are two situations where you should double-check the result before using the WebP file:

1. If your PNG has partial transparency (semi-transparent shadows, fades, or glows), view the exported WebP on a coloured background to confirm the blending still looks correct.
2. If your PNG is displayed on a dark background in your interface, test the WebP version in that context specifically before replacing it.

## Step-by-step: batch converting PNGs to WebP

1. Open [Pixscaler](/) in your browser.
2. Drag and drop all the PNG files you want to convert. You can drop up to 50 files at once.
3. Leave the dimension fields blank if you want to keep the original pixel size. Or enter a target width or height (with the aspect lock on) to scale the images down at the same time.
4. Select "WebP (recommended)" from the format dropdown.
5. Choose a quality level (start around 80% for photos), then click "Compress images."
6. When all files show "Compressed," click "Download all" to get a ZIP file.

The ZIP file will contain your WebP files named using the original filenames with the `.webp` extension.

## Scaling down at the same time

If you are preparing images for a web interface where they will be displayed at a specific size, it is worth scaling the pixel dimensions at the same time you convert the format. Sending a 1600 x 800 logo to a container that renders it at 400 x 200 wastes bandwidth.

In Pixscaler, set the width field to your target display size (double it for retina displays if needed), enable the aspect ratio lock, and leave the height field blank. The tool will scale proportionally while it converts.

## What about PNG files with text?

PNG is often the right choice for screenshots that contain text, because JPEG and WebP can introduce visible artefacts at sharp text edges. WebP at lower quality settings can produce blocky edges around text in screenshots.

For screenshots with text, test the WebP version at your target quality before switching. If you see visible artefacts around letters, either increase the quality setting or keep that specific image as PNG. The file size trade-off is not worth it if the output looks noticeably worse.

For screenshots that contain only images and no on-screen text, WebP is usually fine.

## Checking the results

After conversion, Pixscaler shows you the original file size and the compressed file size for each image. Click the thumbnail to preview the image in full before downloading.

If the file size reduction looks smaller than expected, it is often because the original PNG was already well-optimised, or because the image has a lot of non-transparent content with fine texture detail (which any lossy format compresses less efficiently).

## Limitations

- Pixscaler currently processes up to 50 files per session. For larger batches, run multiple sessions.
- AVIF format also supports transparency and produces even smaller files, but encoding is slower. If you are converting large numbers of PNGs, WebP is usually faster.
- Some very old browsers (released before 2018) do not support WebP. If you need to support these, use a `<picture>` element with a PNG fallback.

## Checklist before replacing PNG files on your site

- [ ] Does each WebP file visually match the original on both light and dark backgrounds?
- [ ] Is partial transparency rendering correctly (no unintended opaque areas)?
- [ ] Have you updated the `src` attributes in your HTML or CSS to reference `.webp` files?
- [ ] If you have a content management system, have you re-uploaded the WebP versions through the media library?
- [ ] Are the file sizes meaningfully smaller than the originals?

Once all five boxes are checked, your site will load faster without any visible change to your images.

If you need to resize images for a specific platform at the same time, check the [presets page](/resize) for pre-configured dimension and format settings for Shopify, Instagram, Facebook, and more.
