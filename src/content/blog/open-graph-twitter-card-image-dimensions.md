---
title: "Image Dimensions for Open Graph and Twitter Cards: One Reference for Less Broken Previews"
description: "og:image and Twitter summary cards want a wide frame. Learn the common 1200x630 target, safe margins, file size habits, and local JPEG or WebP prep before deploy."
pubDate: 2026-01-26
author: "Benchehida Abdelatif"
tags: ["open graph", "twitter cards", "og:image", "social sharing", "dimensions"]
---

Broken link previews are expensive. Someone shares your article in Slack, Discord, LinkedIn, or X, and the card shows a random crop, a blurry upscaled logo, or nothing at all because your `og:image` is missing, too large for fetchers, or blocked by caching headers. Most teams do not need twenty social sizes on day one. They need one reliable wide image that reads at small card sizes and does not weigh multiple megabytes.

This guide focuses on the common 1200 x 630 style frame, how to compose safe margins, and how to compress locally before deployment.

## Quick answer

Use a 1200 x 630 pixel image (or the same aspect ratio) for many Open Graph and Twitter summary card setups, keep critical text inside a central safe area, and compress to a modest file size so crawlers and chat apps fetch it reliably. Pixscaler includes a dedicated [Twitter and Open Graph preset](/resize/twitter-og-image/) at 1200 x 630 to start your canvas. Prepare files on [the tool page](/tool/) **locally in the browser** using **Web Workers** so pre launch campaign artwork does not pass through unknown upload compressors. For blog headers that double as share images, compare behaviour with the [blog featured image preset](/resize/blog-featured-image/), which uses the same dimensions in this project’s preset list.

## Why margins matter more than pixel perfect platform tables

Card UIs change. Safe margins survive change better than edge hugging text.

## File size and fetch reliability

Some social crawlers time out on very large images. Aim for a reasonable kilobyte budget and treat anything multi megabyte as a bug unless you have a reason.

## Format realities

JPEG is the common denominator. WebP can work in many modern stacks but verify your channels. AVIF is less universal for social fetchers as of common 2026 setups, so test rather than assume.

## LinkedIn and other networks reuse the same asset

If you also share on LinkedIn feeds, compare composition with the [LinkedIn post image preset](/resize/linkedin-post/) at 1200 x 627. It is not identical to 1200 x 630, but it is close enough that a single master can work if you keep margins conservative.

## Slack and Discord unfurl behaviour

Chat apps fetch `og:image` quickly and cache aggressively. If your preview looks wrong in Slack, verify the URL is publicly reachable without authentication and that TLS is valid.

## Absolute URLs and staging domains

Crawlers fetch what you publish. If `og:image` points at `localhost` or a staging hostname, production previews break. Use absolute production URLs in production builds.

## Width and height meta tags when you use them

Some frameworks emit `og:image:width` and `og:image:height`. When correct, they can help platforms allocate layout space. When incorrect, they can cause oddities. If you set them, keep them aligned with the real file.

## Facebook and legacy Open Graph tooling

Many teams still validate Facebook sharing separately from X because debugging UIs differ. Keep a short internal doc with the exact URLs you use for validators so you do not hunt bookmarks during incidents.

## When to create a separate `twitter:image`

If X card behaviour diverges from generic `og:image` in your stack, maintain explicit tags. If it does not diverge, avoid duplicating configuration that can drift.

## Image text and localisation

If you ship multiple languages, plan separate share images per language or keep text out of the image and render language in HTML instead. One English slogan baked into an image becomes wrong fast.

## Performance for crawlers: keep TLS fast

Slow TLS handshakes and huge images combine badly. Share images are part of reliability engineering, not only marketing polish.

## Avoid text that is illegal to screenshot

If your share image includes claims you cannot substantiate, fix the copy before you tune compression. Pixels cannot rescue policy problems.

## `og:type` and article metadata

Share previews also depend on stable URLs and correct page metadata. If `og:title` is empty because your template broke, the image will not save you.

## `og:url` canonical mismatches

If `og:url` disagrees with the real URL users share, some platforms pick the wrong canonical and fetch the wrong image. Keep metadata coherent.

## Large summary cards versus basic cards

Some Twitter card types expect different aspect ratios. If you enable large cards, validate that your image composition still reads when cropped tighter than you expect.

## Homepage versus article pages

Your site might need different share images per template. Do not assume one global `og:image` works when your homepage is a product grid and articles are longform text.

## Marketing campaigns that change daily

If you swap share art frequently, automate naming and cache busting so you do not fight stale previews for a week after launch.

## Measuring success beyond “it looks fine on my laptop”

After you ship, spot check real shares in two apps and record screenshots for your runbook. Operations teams appreciate receipts when someone says “the card is broken again”.

## Avoid ultra wide logos in narrow cards

Extreme aspect logos get padded awkwardly in some cards. Add controlled padding in the master image so the mark breathes.

## Gradients and banding in social cards

Subtle gradients can band in JPEG at low quality. If your brand background is a smooth gradient, test multiple compression settings before you mass deploy.

## A deploy checklist

1. Confirm `og:image` URL is absolute on production.
2. Confirm the image returns 200 with sensible cache headers.
3. Validate dimensions and aspect visually in a card debugger where available.

## What Pixscaler offers as one option

Resize and compress share images locally, then deploy. Iterate quickly when marketing requests a copy tweak an hour before launch.

## Common mistakes

**Using a tall portrait as og:image**  
Looks fine on your phone album, crops badly in cards.

**Forgetting to bust cache after replacement**  
Teams swear the new image is live, fetchers disagree.

## What to do next

Generate your next share image using the [Twitter and Open Graph preset](/resize/twitter-og-image/), compress locally, deploy, and validate previews in two apps you care about. Read more on [the blog index](/blog/).
