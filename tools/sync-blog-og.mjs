/**
 * Generate only missing blog OG images (skips when public/og/blog/<slug>.png exists).
 * Use npm run og:blog to overwrite all. Use --force here to ignore skips.
 *
 * Usage (repo root): npm run og:blog:sync
 *                    npm run og:blog:sync -- --force
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  loadConfig,
  extractFrontmatter,
  parseTitleFromFrontmatter,
  resolveBlogPaths,
  loadBasePngBuffer,
  writeOgImageForPost,
  getRepoRoot,
} from './blog-og/lib/composite.mjs';

const force = process.argv.includes('--force');

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

  let created = 0;
  let skipped = 0;

  for (const name of mdFiles.sort()) {
    const slug = name.replace(/\.md$/i, '');
    const outPath = path.join(outputDir, `${slug}.png`);

    if (!force) {
      try {
        await fs.access(outPath);
        console.log(`skip  ${slug} (already exists)`);
        skipped += 1;
        continue;
      } catch {
        /* generate */
      }
    }

    const raw = await fs.readFile(path.join(blogDir, name), 'utf8');
    const title = parseTitleFromFrontmatter(extractFrontmatter(raw));
    if (!title) {
      console.warn(`Skip (no title): ${name}`);
      continue;
    }

    const written = await writeOgImageForPost({
      repoRoot,
      config,
      baseBuf,
      slug,
      title,
      outputDir,
    });
    console.log(`write ${written}`);
    created += 1;
  }

  console.error(`\nSync done. Created: ${created}, skipped: ${skipped}. Output: ${outputDir}`);
  if (skipped > 0 && !force) {
    console.error('Tip: npm run og:blog to regenerate everything, or add --force to this script.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
