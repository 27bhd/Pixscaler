/**
 * compressor.worker.ts
 *
 * Off-main-thread image processing via OffscreenCanvas.
 * Handles: dimension scaling, quality-based encoding, and format conversion
 * (WebP / AVIF / JPEG / PNG).
 *
 * Message protocol:
 *   IN  → CompressJob
 *   OUT → CompressResult (one per job)
 */

export interface CompressJob {
  id: string;
  file: File;
  targetWidth?: number;
  targetHeight?: number;
  lockAspect?: boolean;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  /** Encoder quality 0–1 (lossy formats). */
  quality: number;
}

export interface CompressResult {
  id: string;
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: string;
  error?: string;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

self.addEventListener('message', async (event: MessageEvent<CompressJob>) => {
  const job = event.data;
  try {
    const result = await processJob(job);
    self.postMessage(result);
  } catch (err) {
    const result: CompressResult = {
      id: job.id,
      blob: new Blob(),
      originalSize: job.file.size,
      compressedSize: 0,
      width: 0,
      height: 0,
      format: job.format,
      error: err instanceof Error ? err.message : 'Unknown compression error',
    };
    self.postMessage(result);
  }
});

// ─── Core processing ──────────────────────────────────────────────────────────

async function processJob(job: CompressJob): Promise<CompressResult> {
  const bitmap = await createImageBitmap(job.file);
  const { width: srcW, height: srcH } = bitmap;

  const { outW, outH } = resolveOutputDimensions(
    srcW,
    srcH,
    job.targetWidth,
    job.targetHeight,
    job.lockAspect ?? true,
  );

  const canvas = new OffscreenCanvas(outW, outH);
  const ctx = require2dContext(canvas);

  renderHighQuality(ctx, bitmap, outW, outH, srcW, srcH);
  bitmap.close();

  const mimeType = formatToMime(job.format);
  const blob = await canvas.convertToBlob({ type: mimeType, quality: job.quality });

  return {
    id: job.id,
    blob,
    originalSize: job.file.size,
    compressedSize: blob.size,
    width: outW,
    height: outH,
    format: job.format,
  };
}

// ─── Dimension resolution ──────────────────────────────────────────────────────

function require2dContext(canvas: OffscreenCanvas): OffscreenCanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(
      '2D canvas is not available in this environment (needed to resize images). Try another browser or disable extensions that block canvas.',
    );
  }
  return ctx;
}

function resolveOutputDimensions(
  srcW: number,
  srcH: number,
  targetW?: number,
  targetH?: number,
  lockAspect = true,
): { outW: number; outH: number } {
  const tw = targetW && targetW > 0 ? targetW : 0;
  const th = targetH && targetH > 0 ? targetH : 0;

  if (!tw && !th) return { outW: srcW, outH: srcH };

  // Both dimensions set → exact output canvas (may stretch to match aspect).
  if (tw && th) {
    return { outW: Math.round(tw), outH: Math.round(th) };
  }

  if (lockAspect) {
    const aspect = srcW / srcH;
    if (tw && !th) return { outW: tw, outH: Math.round(tw / aspect) };
    if (th && !tw) return { outW: Math.round(th * aspect), outH: th };
  }

  return {
    outW: tw || srcW,
    outH: th || srcH,
  };
}

// ─── Two-pass high-quality scaling ────────────────────────────────────────────

function renderHighQuality(
  ctx: OffscreenCanvasRenderingContext2D,
  bitmap: ImageBitmap,
  outW: number,
  outH: number,
  srcW: number,
  srcH: number,
): void {
  const scaleX = outW / srcW;
  const scaleY = outH / srcH;

  if (scaleX < 0.5 || scaleY < 0.5) {
    const midW = Math.round(srcW * 0.5);
    const midH = Math.round(srcH * 0.5);
    const midCanvas = new OffscreenCanvas(midW, midH);
    const midCtx = require2dContext(midCanvas);
    midCtx.imageSmoothingEnabled = true;
    midCtx.imageSmoothingQuality = 'high';
    midCtx.drawImage(bitmap, 0, 0, midW, midH);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(midCanvas, 0, 0, outW, outH);
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, outW, outH);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatToMime(format: CompressJob['format']): string {
  const map: Record<CompressJob['format'], string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    png: 'image/png',
  };
  return map[format];
}
