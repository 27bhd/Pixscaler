---
title: "How to Sanity-Check WebP and AVIF Output in Safari, Chrome, and Firefox Before You Publish"
description: "Next-gen formats save bytes, but previews lie. Test decode, transparency, and colour in real browsers on desktop and mobile before you flip production defaults."
pubDate: 2026-02-07
author: "Benchehida Abdelatif"
tags: ["webp", "avif", "safari", "chrome", "firefox", "testing"]
---

WebP and AVIF can shrink photographic images dramatically compared with JPEG. They can also surprise you: alpha edges that look fine in one encoder look fringe heavy in another, colours shift subtly between software and hardware decoders, and Safari’s behaviour across versions is a moving target worth checking deliberately.

This guide is a practical pre publish testing pass across Safari, Chrome, and Firefox on desktop and mobile, focused on what breaks in the real world rather than what looks fine in a single preview pane.

## Quick answer

Open the same exported asset in multiple browsers at 100 percent zoom, on a retina display if you have one, and on a mid tier phone. Check transparency edges, fine text overlays, and gradients for banding. Pixscaler on [the tool page](/tool/) generates WebP and AVIF **locally in the browser** using **Web Workers**, which makes it easy to produce comparison files without uploading sensitive screenshots to a remote encoder. If you also maintain social share assets, validate dimensions separately using the [Twitter and Open Graph preset](/resize/twitter-og-image/) at 1200 x 630 as a common card frame.

## Build a tiny test matrix

**Desktop**  
Latest Chrome, latest Firefox, Safari if you are on macOS.

**Mobile**  
Safari on iOS, Chrome on Android if available.

**One older device if you can**  
Old iPads hang around longer than teams expect.

## What to look for in photographs

**Skin tones**  
AVIF can shift slightly depending on encoder settings. Compare against your JPEG reference.

**Fine fabric texture**  
First place oversmoothing shows up.

**Noise and grain**  
Noise fights compression; denoise deliberately if you must, rather than letting the codec mangle unpredictably.

## What to look for with transparency

**Fringes on dark backgrounds**  
Premultiplied alpha issues show as halos.

**Soft shadows**  
WebP and AVIF can preserve them well, but only if the source export is clean.

## Performance is not only bytes

AVIF decode can be heavier on some devices than WebP for the same visual result. If your page paints hundreds of AVIF thumbnails, scroll jank can appear even when Lighthouse praises bytes saved.

## Animated WebP and transparency

Some teams ship animated WebP for small UI loops. Test CPU usage on low end Android phones because animations decode continuously while visible.

## Colour management: default to sRGB for web assets

Embedded colour profiles can change how Safari and Chrome render the same bytes. For predictable social and web icons, convert to sRGB unless you have a controlled colour pipeline.

## Caching and “I updated the icon but nothing changed”

Icons are cached aggressively. When you iterate locally, rename files or use cache busting query strings where appropriate in your HTML during development, then settle on stable production names once verified.

## Alpha channels and unexpected halos

If your logo sits on a transparent background, test it on both white and black page backgrounds in a browser tab. Semi transparent shadows can look dirty when users switch themes.

## Enterprise policies and “blocked images”

Some organisations strip external images in email and internal tools. Your web format tests still matter for public pages, but do not assume every employee browser can decode AVIF during an intranet pilot.

## Regression testing after OS upgrades

iOS and macOS updates sometimes change Safari decoding edge cases. If you ship AVIF broadly, retest after major OS releases the way you retest layout CSS.

## Tooling differences: same format, different encoder

Not every AVIF encoder produces identical perceptual output at the same quality number. If you switch tools, rerun your visual matrix rather than trusting old conclusions.

## File size versus decode time charts

If you have the patience, record decode times for representative assets on a slow phone. Sometimes WebP wins the user experience even when AVIF wins the byte count.

## Transparency in WebP versus AVIF for UI assets

If you ship UI icons as raster (not ideal, but common), compare halos on dark mode backgrounds across formats. Pick the winner for your specific edge case rather than the global internet favourite.

## When JPEG is still the right fallback

If your publishing pipeline cannot serve multiple formats cleanly, a well compressed JPEG reference image still beats a perfect AVIF that never ships.

## Wide gamut displays and accidental saturation

Some exports look oversaturated on wide gamut Mac displays because colour profiles mismatch. If your team only tests on one display family, borrow another device before you declare victory.

## Automated visual diffing is optional but powerful

If you maintain a design system, snapshot tests can catch accidental icon colour shifts. For content images, human review still matters because perceptual issues are subjective.

## CPU throttling on phones while scrolling

Heavy AVIF decode can contribute to scroll jank when combined with JavaScript heavy pages. If your article template is busy, favour slightly larger WebP over slightly smaller AVIF when decode is the bottleneck.

## `<picture>` fallbacks in HTML

If you serve modern formats with fallbacks, test the fallback path deliberately by forcing the oldest format in devtools. Broken `<picture>` markup silently sends everyone down the wrong branch.

## Record keeping for decisions

When you pick AVIF for category A and WebP for category B, write it down in your engineering handbook. Future you will not remember the nuance during the next redesign.

## A one hour team ritual

Spend one hour once a quarter: pick five real assets, run the matrix, update defaults. Prevention is cheaper than emergency rollbacks.

## What Pixscaler offers as one option

Generate WebP and AVIF variants locally, download both, drop them into a static test page, and compare. Pixscaler stays client-side, which matters when your test images include internal dashboards.

## Common mistakes

**Testing only in the tool that encoded the file**  
Always test in browsers.

**Using exotic colour profiles without embedding intent**  
Convert to sRGB for web unless you truly know your pipeline.

## What to do next

Pick three production images, export WebP and AVIF, run the browser matrix, and record which format wins for your audience and risk tolerance. Continue reading on [the blog index](/blog/).
