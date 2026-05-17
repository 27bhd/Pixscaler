---
title: "JPEG Quality 80 vs 70: What You Actually Notice on a Retina Phone Screen"
description: "Quality sliders are not universal. Compare JPEG 80 and 70 on real photos, UI screenshots, and skin tones on a retina phone before you pick defaults for web and social."
pubDate: 2025-11-30
author: "Benchehida Abdelatif"
tags: ["jpeg", "quality", "compression", "retina", "mobile"]
---

JPEG quality settings are not comparable across every tool. One app’s 80 is another app’s 67 because quantisation tables and chroma subsampling differ. Still, writers need rules of thumb. The useful question is not “which number is best”, but “what do I notice on a phone in daylight at pinch zoom levels people actually use”.

This article compares the practical difference between quality around 80 and quality around 70 for common web subjects, explains when the gap is invisible, and when it becomes ugly fast.

## Quick answer

For many outdoor photos at sensible pixel dimensions, the gap between 80 and 70 is subtle on a phone until you zoom in. For screenshots with gradients and UI text, 70 can band earlier. For faces and hair, 70 can introduce softness that looks acceptable at thumbnail size but poor at full screen. Always judge on the final pixel width you publish, not on the raw camera export width. Pixscaler on [the tool page](/tool/) lets you export variants **locally in the browser** using **Web Workers** so you can compare without uploading private images.

## Why pixel dimensions dominate the discussion

If you compress a 4000 pixel wide image at quality 80, it can still be enormous in kilobytes. If you scale to 1200 pixels wide first, quality 70 might look cleaner than quality 80 on the oversized original because the encoder sees a simpler signal.

## Test methodology that does not fool you

**Use the real device**  
A laptop monitor hides mobile artefacts.

**Test two zoom levels**  
Fit to screen, then 100 percent pixel view for the exported width.

**Test two lighting conditions**  
Bright outdoor and dim indoor.

## Subject specific notes

**Skies and gradients**  
Band first. If you see stepping in blue skies, your quality is too low for that dimension choice.

**Grass and foliage**  
Hides artefacts until it does not.

**Text in screenshots**  
Shows artefacts immediately.

## Chroma subsampling in plain language

JPEG often stores colour at lower resolution than brightness because human eyes are less sensitive to colour detail. That is usually fine for photos and cruel to coloured small text. If your “photo” is mostly a screenshot, PNG or WebP may behave better than JPEG at the same visual intent.

## WebP and AVIF as comparison points

When you evaluate JPEG 80 versus 70, also export a WebP or AVIF variant at similar visual intent. Modern formats sometimes achieve the same subjective quality at smaller bytes, which can let you keep more detail without increasing weight. Pixscaler supports these formats locally on [the homepage](/).

## Batch testing for content teams

If your site publishes dozens of article images weekly, define a repeatable test set: one portrait, one landscape cityscape, one UI screenshot, one product macro. Tune defaults against that set rather than against a single favourite holiday photo.

## Monitoring real user conditions

Lab tests do not replace checking on a warm phone outdoors. Heat throttles CPUs and makes decode feel slower, which changes how forgiving you should be about huge files.

## Web delivery: pick budgets, not mystic numbers

Many teams aim for rough bands: sub 200KB for large in article images when possible, smaller for thumbnails. The quality slider is how you hit the band after dimensions are sane.

## What Pixscaler offers as one option

Export two JPEG variants from the same resized master, compare sizes in the list, download both, flip between them on your phone. Pixscaler processing stays local, which helps for screenshots of revenue dashboards you should not send to strangers.

## When 70 is clearly enough

Large background images behind text overlays can often live at 70 once dimensions are sane, because viewers never inspect them at full resolution. The key is purpose: decorative backgrounds can tolerate more loss than hero portraits.

## When 80 is still not enough

Tiny text in a screenshot may need PNG or lossless WebP regardless of JPEG quality. If you are “saving” JPEG by pushing quality to 95 while keeping 3000 pixel width, you are solving the wrong bottleneck.

## Colour banding on sunsets and stage lighting

High contrast sunsets band aggressively at JPEG 70. If your subject is a gradient heavy sky, either keep quality higher, reduce dimensions, or choose a modern format and test carefully.

## Printing versus phone viewing

A file that looks acceptable on a phone may still look soft if someone screenshots it and prints it. That mismatch rarely matters for WhatsApp, but it matters for teams who reuse the same asset across channels. Export channel specific variants rather than forcing one file to serve every destination.

## What “retina” means for your export

Retina displays have more physical pixels per CSS pixel. That does not mean every web image should be a 4x giant. It means your chosen export width should match the display width you expect, times a deliberate multiplier, not times panic.

## Metadata and orientation

Some phones strip rotation cleanly, others do not. If your JPEG looks correct in one viewer and rotated in another, bake rotation into a fresh export before you debate quality numbers.

## Naming your test exports

Save files as `scene-1200w-q80.jpg` versus `scene-1200w-q70.jpg` so you are not guessing which variant you are viewing after three messages distract you.

## When you should stop tweaking quality and fix composition

If neither 80 nor 70 looks good, your problem is usually composition, motion blur, or noise, not the slider. Fix the source, then re run the comparison with the same disciplined viewing ritual on the same phone you trust for daily browsing without switching phones or displays.

## Common mistakes

**Comparing different dimensions**  
Apples to oranges.

**Triple recompressing old JPEGs**  
Damage stacks.

## What to do next

Pick three representative images from your site, resize each to your real publish width, encode at 80 and 70, and view on your phone. If you cannot tell the difference at your byte budget, 70 is fine. If you can, stay higher. Continue reading on [the blog index](/blog/).
