# Pixscaler

[Pixscaler](https://pixscaler.com) is a free, open-source image resizer and compressor that runs entirely in your browser. Files are processed locally (Web Workers + canvas); they are not uploaded for processing.

## Requirements

Use **Node.js 22.12 or newer** (see `engines` in `package.json`).

## Commands

```sh
npm install
npm run dev    # local dev server (default http://localhost:4321)
npm run build  # production build to ./dist/
npm run preview
npm run check  # optional: astro type/content check (requires devDependencies)
```

## Privacy

Image bytes stay on your device while you use the tool. See [Privacy policy](https://pixscaler.com/privacy-policy) for how the public site is hosted and what data is involved.

## Licence

Source code is released under the MIT Licence — see `LICENSE` in this repository.
