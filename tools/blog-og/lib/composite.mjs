/**
 * Shared OG compositor: Outfit (same family as global.css), measure-based wrap,
 * binary search for largest font that fits the textBox.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));
export const BLOG_OG_DIR = path.join(LIB_DIR, '..');

/** Repo root: …/Pixscaler */
export function getRepoRoot() {
  return path.resolve(BLOG_OG_DIR, '..', '..');
}

export async function loadConfig() {
  const raw = await fs.readFile(path.join(BLOG_OG_DIR, 'config.json'), 'utf8');
  return JSON.parse(raw);
}

export function extractFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

/** One-line title: "..." | '...' | plain */
export function parseTitleFromFrontmatter(fm) {
  const line = fm.split(/\r?\n/).find((l) => /^title:\s*/.test(l));
  if (!line) return null;
  let raw = line.replace(/^title:\s*/, '').trim();
  if (raw.startsWith('"') && raw.endsWith('"') && raw.length >= 2) {
    return raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (raw.startsWith("'") && raw.endsWith("'") && raw.length >= 2) {
    return raw.slice(1, -1).replace(/''/g, "'");
  }
  return raw;
}

/** Approximate string width for Outfit 700 (Latin titles). Tuned conservatively. */
export function estimateLineWidth(text, fontSize) {
  let w = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (ch === ' ') w += fontSize * 0.3;
    else if ('il1|!.,:;I'.includes(ch)) w += fontSize * 0.24;
    else if ('mwMW@%'.includes(ch) || (code >= 0x300 && code <= 0x36f)) w += fontSize * 0.68;
    else if (ch >= 'A' && ch <= 'Z') w += fontSize * 0.58;
    else w += fontSize * 0.52;
  }
  return w;
}

/** Greedy wrap to max pixel width using estimateLineWidth. */
export function wrapTitleToWidth(title, maxWidth, fontSize) {
  const words = title.replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines = [];
  let line = '';

  const pushLine = (s) => {
    if (s) lines.push(s);
  };

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (estimateLineWidth(candidate, fontSize) <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) {
      pushLine(line);
      line = '';
    }
    if (estimateLineWidth(word, fontSize) <= maxWidth) {
      line = word;
      continue;
    }
    let chunk = '';
    for (const ch of word) {
      const next = chunk + ch;
      if (estimateLineWidth(next, fontSize) <= maxWidth) chunk = next;
      else {
        if (chunk) pushLine(chunk);
        chunk = ch;
      }
    }
    line = chunk;
  }
  if (line) pushLine(line);
  return lines.length ? lines : [title.slice(0, 24)];
}

export function ellipsizeToWidth(line, maxWidth, fontSize) {
  const ell = '\u2026';
  if (estimateLineWidth(line, fontSize) <= maxWidth) return line;
  let s = line;
  while (s.length > 0 && estimateLineWidth(s + ell, fontSize) > maxWidth) {
    s = s.slice(0, -1);
  }
  return s ? s + ell : ell;
}

/**
 * Largest font size in [fontSizeMin, fontSize] such that wrapped title fits textBox height.
 */
export function fitTitleInBox(title, textBox, typo) {
  const minFs = typo.fontSizeMin;
  const maxFs = typo.fontSize;
  const lh = typo.lineHeight;
  const maxW = textBox.width;
  const maxH = textBox.height;

  let bestFs = minFs;
  let bestLines = wrapTitleToWidth(title, maxW, minFs);

  let lo = minFs;
  let hi = maxFs;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const lines = wrapTitleToWidth(title, maxW, mid);
    const blockH = lines.length * mid * lh;
    if (blockH <= maxH) {
      bestFs = mid;
      bestLines = lines;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  while (bestLines.length * bestFs * lh > maxH && bestFs > minFs) {
    bestFs -= 1;
    bestLines = wrapTitleToWidth(title, maxW, bestFs);
  }

  const maxLines = Math.max(1, Math.floor(maxH / (bestFs * lh)));
  let lines = bestLines;
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = ellipsizeToWidth(lines[maxLines - 1], maxW, bestFs);
  }

  return { fontSize: bestFs, lines };
}

let cachedFontCss;

/** @param {string} repoRoot */
export async function getEmbeddedOutfitFontFace(repoRoot) {
  if (cachedFontCss) return cachedFontCss;
  const fontPath = path.join(
    repoRoot,
    'node_modules/@fontsource/outfit/files/outfit-latin-700-normal.woff2',
  );
  const buf = await fs.readFile(fontPath);
  const b64 = buf.toString('base64');
  cachedFontCss = `@font-face{font-family:'Outfit';font-style:normal;font-weight:700;font-display:block;src:url(data:font/woff2;charset=utf-8;base64,${b64}) format('woff2');}`;
  return cachedFontCss;
}

export function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildTitleSvg({ config, lines, fontSize, typo, fontFaceCss }) {
  const outW = config.output?.width ?? 1200;
  const outH = config.output?.height ?? 630;
  const box = config.textBox;
  const lh = typo.lineHeight;
  const fill = typo.fill ?? '#1c1c1a';
  const weight = typo.fontWeight ?? 700;

  const blockH = lines.length * fontSize * lh;
  const valign = box.verticalAlign === 'top' ? 0 : Math.max(0, (box.height - blockH) / 2);
  const originY = box.y + valign;

  const tspans = lines
    .map((line, i) => {
      const yy = originY + fontSize * (0.88 + i * lh);
      return `<tspan x="${box.x}" y="${yy}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  return `<svg width="${outW}" height="${outH}" xmlns="http://www.w3.org/2000/svg">
<defs><style type="text/css"><![CDATA[
${fontFaceCss}
]]></style></defs>
<text xml:space="preserve" font-family="Outfit, system-ui, sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${escapeXml(fill)}">${tspans}</text>
</svg>`;
}

/**
 * Composite SVG overlay onto prepared base raster.
 */
export async function renderCompositePng(baseBuf, svgString) {
  const svgBuf = Buffer.from(svgString, 'utf8');
  return sharp(baseBuf)
    .composite([{ input: svgBuf, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function loadBasePngBuffer(config, baseImageAbs) {
  const outW = config.output?.width ?? 1200;
  const outH = config.output?.height ?? 630;
  return sharp(baseImageAbs)
    .resize(outW, outH, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();
}

export function resolveBlogPaths(config) {
  const blogDir = path.resolve(BLOG_OG_DIR, config.paths?.blogDir ?? '../../src/content/blog');
  const outputDir = path.resolve(BLOG_OG_DIR, config.paths?.outputDir ?? '../../public/og/blog');
  const baseImage = path.resolve(BLOG_OG_DIR, config.paths?.baseImage ?? 'base.png');
  return { blogDir, outputDir, baseImage };
}

/**
 * Write one OG PNG. Expects baseBuf from loadBasePngBuffer.
 */
export async function writeOgImageForPost({
  repoRoot,
  config,
  baseBuf,
  slug,
  title,
  outputDir,
}) {
  const typo = {
    fontSize: config.typography?.fontSize ?? 56,
    fontSizeMin: config.typography?.fontSizeMin ?? 24,
    lineHeight: config.typography?.lineHeight ?? 1.12,
    fill: config.typography?.fill ?? '#1c1c1a',
    fontWeight: config.typography?.fontWeight ?? 700,
  };

  const fontFaceCss = await getEmbeddedOutfitFontFace(repoRoot);
  const { fontSize, lines } = fitTitleInBox(title, config.textBox, typo);
  const svg = buildTitleSvg({ config, lines, fontSize, typo, fontFaceCss });
  const png = await renderCompositePng(baseBuf, svg);
  const outPath = path.join(outputDir, `${slug}.png`);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outPath, png);
  return outPath;
}
