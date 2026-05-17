# Writing guide for Pixscaler

This guide tells humans and AI assistants how copy should sound everywhere on **Pixscaler**: marketing pages, the image resizing/compressing tool, errors, blog posts, SEO text, and future product pages.

## Why this file is short

Putting everything into one ~1,500 line document is **possible**, but it is a poor default for AI prompting:

- It burns tokens on every task, even small UI tweaks.
- It buries the rules that matter most (voice, honesty about client-side privacy, no em dashes).
- It encourages lazy "paste the whole bible" prompts instead of scoped work.

The **full** rules still exist. They were split into supplements under `docs/writing/` so you attach **only what the task needs**.

Nothing important was removed: same rules, easier prompting.

---

## Default bundle (use this most of the time)

For general writing or edits across this site, attach:

1. [`docs/writing/core-voice-and-rules.md`](writing/core-voice-and-rules.md)

That file holds non-negotiables, audience, voice, and site-wide rules (including local-only client-side privacy messaging and careful quality/format language).

---

## Topic supplements (add when relevant)

| Task | Also attach |
|------|----------------|
| Buttons, labels, errors, empty states, resizer UI, workspace | [`docs/writing/ui-and-landing-pages.md`](writing/ui-and-landing-pages.md) |
| Homepage, landing sections, feature blurbs, tool workspace | [`docs/writing/ui-and-landing-pages.md`](writing/ui-and-landing-pages.md) |
| Blog posts, SEO, slugs, internal links, article templates | [`docs/writing/blog-and-seo.md`](writing/blog-and-seo.md) |
| Claims, disclaimers, privacy wording, naming standards, CTAs, AdSense layout | [`docs/writing/trust-naming-conversion.md`](writing/trust-naming-conversion.md) |
| Markdown style, humanization pass, accessibility, publishing checklists, repo paths | [`docs/writing/polish-and-ops.md`](writing/polish-and-ops.md) |

If you are unsure, start with **core only**, then add one supplement if the output feels off-topic.

---

## Ultra-short reminders (if you attach nothing else)

- Do **not** use the em dash character (Unicode U+2014). Use a period, comma, colon, or parentheses instead.
- Write like a helpful human: concrete image resolution/compression examples, plain English, no empty SaaS hype.
- Heavy processing is done **100% client-side** (locally in the browser using Web Workers). Say so clearly to build trust.
- UI copy stays shorter than blog copy; buttons name the action (e.g. "Compress Image", "Download WebP").

---

## Naming this site in copy

Prefer **Pixscaler**, **this site**, **this platform**, or **we** where it reads naturally. Avoid repeating a product name in every paragraph unless the sentence truly needs it.

---

## Full reference

All supplements together replace the previous single mega-guide.

**Large pillar article (maximum AI context):** attach **core + blog-and-seo + trust-naming-conversion + polish-and-ops** so you get SEO ops, publishing checklists, and repo paths in the same prompt.

**Coverage map (nothing important should live only in memory):**

| Topic | Where it lives |
|-------|----------------|
| Em dash ban, voice, audience, local privacy honesty, next action | `writing/core-voice-and-rules.md` |
| Buttons, errors, homepage, CTAs, workspace, batch drag-and-drop | `writing/ui-and-landing-pages.md` |
| Blog depth, intros, FAQs, SEO, slugs, internal links, frontmatter, article templates | `writing/blog-and-seo.md` |
| Claims, privacy, legal, naming, AdSense layout, conversions | `writing/trust-naming-conversion.md` |
| Humanization, Markdown, code fences, a11y, AI or publish checklists, build or sitemap notes | `writing/polish-and-ops.md` |

If a rule touches two files (for example client-side processing in core and again in SEO crawler clarity), that overlap is intentional so a single-file prompt still works.
