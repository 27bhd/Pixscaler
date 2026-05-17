/**
 * Regenerate every blog OG image (overwrites existing PNGs).
 *
 * Usage (repo root): npm run og:blog
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadConfig,
  extractFrontmatter,
  parseTitleFromFrontmatter,
  resolveBlogPaths,
  loadBasePngBuffer,
  writeOgImageForPost,
  getRepoRoot,
} from './lib/composite.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const config = await loadConfig();
  const repoRoot = getRepoRoot();
  const { blogDir, outputDir, baseImage } = resolveBlogPaths(config);

  try {
    await fs.access(baseImage);
  } catch {
    console.error(`Missing base image: ${baseImage}`);
    console.error('Add your template as tools/blog-og/base.png (1200×630 recommended).');
    process.exit(1);
  }

  const baseBuf = await loadBasePngBuffer(config, baseImage);
  const entries = await fs.readdir(blogDir, { withFileTypes: true });
  const mdFiles = entries.filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => e.name);

  if (mdFiles.length === 0) {
    console.error(`No .md files in ${blogDir}`);
    process.exit(1);
  }

  let ok = 0;
  for (const name of mdFiles.sort()) {
    const slug = name.replace(/\.md$/i, '');
    const raw = await fs.readFile(path.join(blogDir, name), 'utf8');
    const title = parseTitleFromFrontmatter(extractFrontmatter(raw));
    if (!title) {
      console.warn(`Skip (no title): ${name}`);
      continue;
    }
    const outPath = await writeOgImageForPost({
      repoRoot,
      config,
      baseBuf,
      slug,
      title,
      outputDir,
    });
    console.log(outPath);
    ok += 1;
  }

  console.error(
    `\nDone. ${ok} image(s). Per-post frontmatter example:\n  heroImage: "/og/blog/your-slug.png"`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
