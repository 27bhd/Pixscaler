> Supplement for **Pixscaler**. See [`WRITING_GUIDE.md`](../WRITING_GUIDE.md) for which files to attach when prompting AI so you do not paste everything every time.

# UI copy and landing pages

## UI copy rules

UI copy is the text inside the product: labels, buttons, helper text, statuses, errors, empty states, placeholders, tooltips, and drop zones.

It must be shorter and clearer than blog writing.

### Buttons

Buttons should say what happens next.

Good:

- "Compress images"
- "Download optimized files"
- "Clear workspace"
- "Add files"
- "Convert to WebP"
- "Convert to AVIF"
- "Lock aspect ratio"
- "Download ZIP"

Avoid:

- "Submit"
- "Proceed"
- "Optimize asset"
- "Experience now"
- "Leverage tool"
- "Get started" when a more specific action fits.

### Labels

Labels should be plain.

Good:

- "Drag and drop your images here"
- "Choose target format"
- "Set target file size (KB)"
- "Quality level"
- "Scale by percentage"
- "Width (px)"
- "Height (px)"
- "Batch progress"

Avoid:

- "Visual optimization drop zone"
- "Compression intelligence threshold"
- "Actionable file-size opportunities"

### Helper text

Helper text should remove uncertainty.

Good:

- "You can drop up to 50 files. We process them locally using Web Workers so your browser does not freeze."
- "Your files never leave your computer. Processing is 100% local, secure, and offline-capable."
- "To hit a target size, we adjust compression in a fast local loop until the image fits."
- "Output files are generated instantly. Save them individually or download as a ZIP."

Avoid helper text that repeats the label.

Weak:

> Drag images here.

Better:

> Drag and drop PNG, JPEG, WebP, or AVIF files. Batch resizing is supported.

### Empty states

Empty states should tell the user what to do.

Good:

- "Drop some images here to start resizing."
- "No files added. Drag and drop a few images, or click to browse files."
- "All files cleared. Drag in a new batch to start over."

Avoid:

- "Nothing here."
- "No images."
- "Empty workspace."

### Loading states

Loading text should be calm and specific.

Good:

- "Compressing images..."
- "Optimizing 12 files..."
- "Converting to WebP..."
- "Generating ZIP file..."
- "Almost done..."

Avoid:

- "Working our magic..."
- "Unlocking visual perfection..."
- "Please wait while we revolutionize your pixels..."

### Error messages

Error messages should say what happened and how to fix it.

Good:

- "Please drop a valid image file (PNG, JPEG, WebP, or AVIF)."
- "This file is too large for local browser memory. Try dropping a smaller resolution first."
- "Target size compression could not hit the exact threshold. We saved the closest possible size."
- "Batch processing failed. Try adding 20 images or fewer."

Avoid:

- "Invalid file format."
- "Compression error."
- "Something went wrong."
- "Error 413."

If a technical detail helps, include it after the plain explanation.

### Status labels

Use consistent status language.

Preferred:

- "Ready"
- "Optimizing"
- "Compressed"
- "Failed"
- "Saved"

Avoid mixing labels like "done", "processed", "shrunk", "resized", and "converted" unless explaining the specific process.

For the main workspace table, "Compressed", "Pending", and "Failed" are easiest.

### Placeholders

Placeholders should demonstrate the format or standard values, not replace labels.

Good:

- `1200` (width)
- `800` (height)
- `200` (target KB)
- `80` (quality percentage)

Avoid placeholders like:

- "Enter width..."
- "Type a number..."
- "Your desired size here"

### Microcopy length

UI text should usually be:

- Button: 1-4 words.
- Label: 2-6 words.
- Helper text: 1 short sentence.
- Error: 1-2 short sentences.
- Empty state: 1 short sentence, plus optional next action.

If a UI explanation needs more than 2 sentences, it probably belongs in an FAQ or a dedicated help section below the workspace.

---

## Homepage and landing page rules

Landing pages must make the value clear quickly.

Above the fold, answer:

- What is this?
- Who is it for?
- What can I do here?
- Why should I trust it?
- What should I click?

Good homepage direction:

> Batch resize and compress images locally in your browser. Blazing fast, 100% private, and Web Worker powered.

Avoid vague homepage direction:

> Discover the future of visual asset intelligence.

### Headline rules

Headings should be clear before they are clever.

Good:

- "Bulk Image Resizer & Compressor"
- "Compress and Convert Images Client-Side"
- "Local Batch Image Optimizer"
- "Resize Images to Under 200KB Instantly"

Avoid:

- "Your Images Deserve Better"
- "Unlock Next-Gen Visual Power"
- "The Future of Page Speed Starts Now"

Those can sound nice, but they do not explain the tool.

### Feature section rules

Feature cards should connect features to user benefit.

Weak:

> Web Workers Multi-threading

Better:

> Blazing fast local processing: We run image rendering and compression inside Web Workers so your browser tab never freezes, even when processing 50 high-res files at once.

Weak:

> Target size compression

Better:

> Compress to target size: Type in your required limit (like 'under 200KB') and let our tool iteratively optimize quality settings locally until it fits.

Weak:

> 100% client-side

Better:

> Absolute privacy: Your files never touch a server. All compression and resizing happens locally inside your browser, making it secure and offline-capable.

### CTA rules

Calls to action should match intent.

Use:

- "Drop your images"
- "Try the bulk resizer"
- "Convert to WebP"
- "Set target size"

Do not overuse:

- "Get started"
- "Learn more"
- "Unlock now"

For a tool-first site, direct CTAs usually perform better.
