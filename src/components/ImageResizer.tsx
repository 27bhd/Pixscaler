/**
 * ImageResizer.tsx
 *
 * Interactive image workspace. Rendered as a React island (client:load).
 *
 * UX order:
 *  1. Dropzone shown immediately — purpose is obvious on arrival
 *  2. Settings panel appears only after files are added
 *  3. Compact horizontal settings bar — one row, not a tall panel
 */

import React, { useCallback, useEffect, useId, useReducer, useRef, useState } from 'react';
import type { CompressJob, CompressResult } from '../workers/compressor.worker';

// ─── Types ───────────────────────────────────────────────────────────────────

type Format = 'webp' | 'avif' | 'jpeg' | 'png';
type FileStatus = 'queued' | 'processing' | 'done' | 'error';

interface FileEntry {
  id: string;
  file: File;
  status: FileStatus;
  originalSize: number;
  compressedSize?: number;
  width?: number;
  height?: number;
  blob?: Blob;
  error?: string;
  previewUrl?: string;
}

interface Settings {
  targetWidth: string;
  targetHeight: string;
  lockAspect: boolean;
  quality: number;
  format: Format;
}

type Action =
  | { type: 'ADD_FILES'; files: File[] }
  | { type: 'SET_STATUS'; id: string; status: FileStatus }
  | { type: 'SET_RESULT'; id: string; result: CompressResult }
  | { type: 'CLEAR_ALL' }
  | { type: 'REMOVE_FILE'; id: string };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: FileEntry[], action: Action): FileEntry[] {
  switch (action.type) {
    case 'ADD_FILES':
      return [
        ...state,
        ...action.files.map((file) => ({
          id: crypto.randomUUID(),
          file,
          status: 'queued' as FileStatus,
          originalSize: file.size,
          previewUrl: URL.createObjectURL(file),
        })),
      ];
    case 'SET_STATUS':
      return state.map((e) => (e.id === action.id ? { ...e, status: action.status } : e));
    case 'SET_RESULT':
      return state.map((e) =>
        e.id === action.id
          ? {
              ...e,
              status: action.result.error ? 'error' : 'done',
              compressedSize: action.result.compressedSize,
              width: action.result.width,
              height: action.result.height,
              blob: action.result.blob,
              error: action.result.error,
            }
          : e,
      );
    case 'REMOVE_FILE': {
      const entry = state.find((e) => e.id === action.id);
      if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
      return state.filter((e) => e.id !== action.id);
    }
    case 'CLEAR_ALL':
      state.forEach((e) => e.previewUrl && URL.revokeObjectURL(e.previewUrl));
      return [];
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function savingsPercent(orig: number, compressed: number): string {
  return `${Math.round(((orig - compressed) / orig) * 100)}%`;
}

function outputFilename(original: string, format: Format): string {
  const base = original.replace(/\.[^.]+$/, '');
  return `${base}.${format}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ImageResizerProps {
  presetWidth?: number;
  presetHeight?: number;
  presetFormat?: Format;
  /** When true, output dimensions are fixed to the preset; lock control is hidden. */
  isPresetWorkspace?: boolean;
}

export default function ImageResizer({
  presetWidth,
  presetHeight,
  presetFormat,
  isPresetWorkspace = false,
}: ImageResizerProps) {
  const [files, dispatch] = useReducer(reducer, []);
  const [settings, setSettings] = useState<Settings>({
    targetWidth: presetWidth ? String(presetWidth) : '',
    targetHeight: presetHeight ? String(presetHeight) : '',
    lockAspect: true,
    quality: 80,
    format: presetFormat ?? 'webp',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<Set<string>>(new Set());
  const uid = useId();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/compressor.worker.ts', import.meta.url),
      { type: 'module' },
    );
    workerRef.current.addEventListener('message', (ev: MessageEvent<CompressResult>) => {
      const result = ev.data;
      dispatch({ type: 'SET_RESULT', id: result.id, result });
      pendingRef.current.delete(result.id);
      if (pendingRef.current.size === 0) setIsRunning(false);
    });
    return () => workerRef.current?.terminate();
  }, []);

  const ingestFiles = useCallback((incoming: FileList | File[]) => {
    const accepted = Array.from(incoming)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 50);
    if (accepted.length > 0) dispatch({ type: 'ADD_FILES', files: accepted });
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) ingestFiles(e.target.files);
      e.target.value = '';
    },
    [ingestFiles],
  );

  const handleClearAll = useCallback(() => {
    setZipError(null);
    dispatch({ type: 'CLEAR_ALL' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      ingestFiles(e.dataTransfer.files);
    },
    [ingestFiles],
  );

  const runCompression = useCallback(() => {
    const queued = files.filter((f) => f.status === 'queued');
    if (!queued.length || !workerRef.current) return;
    setIsRunning(true);
    queued.forEach((entry) => {
      dispatch({ type: 'SET_STATUS', id: entry.id, status: 'processing' });
      pendingRef.current.add(entry.id);
      const job: CompressJob = {
        id: entry.id,
        file: entry.file,
        targetWidth: settings.targetWidth ? Number(settings.targetWidth) : undefined,
        targetHeight: settings.targetHeight ? Number(settings.targetHeight) : undefined,
        lockAspect: settings.lockAspect,
        format: settings.format,
        quality: settings.quality / 100,
      };
      workerRef.current!.postMessage(job);
    });
  }, [files, settings]);

  const downloadFile = (entry: FileEntry) => {
    if (!entry.blob) return;
    const url = URL.createObjectURL(entry.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFilename(entry.file.name, settings.format);
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadZip = async () => {
    const done = files.filter((f) => f.status === 'done' && f.blob);
    if (!done.length) return;
    setIsZipping(true);
    setZipError(null);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      done.forEach((entry) => {
        zip.file(outputFilename(entry.file.name, settings.format), entry.blob!);
      });
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pixscaler-optimized.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not build the ZIP. Try downloading files individually.';
      setZipError(message);
      done.forEach(downloadFile);
    } finally {
      setIsZipping(false);
    }
  };

  const set =
    (key: keyof Settings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setSettings((prev) => ({ ...prev, [key]: value }));
    };

  const hasFiles = files.length > 0;
  const queuedCount = files.filter((f) => f.status === 'queued').length;
  const processingCount = files.filter((f) => f.status === 'processing').length;
  const doneCount = files.filter((f) => f.status === 'done').length;
  const errorCount = files.filter((f) => f.status === 'error').length;

  const dimReadOnly = isPresetWorkspace && presetWidth != null && presetHeight != null;

  return (
    <div className="resizer">

      <div
        className={`resizer__dropzone${isDragging ? ' resizer__dropzone--active' : ''}${hasFiles ? ' resizer__dropzone--compact' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        aria-label="Drop images here or click to browse"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          fileInputRef.current?.click();
        }}
      >
        <svg className="resizer__dropzone-icon" width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="6" y="10" width="36" height="28" rx="5" stroke="currentColor" strokeWidth="2"/>
          <circle cx="17" cy="20" r="3.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 32l10-8 8 6 8-10 10 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M28 10V2M28 2l-4 4M28 2l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="resizer__dropzone-text-wrap">
          <p className="resizer__dropzone-text">
            {hasFiles
              ? 'Drop more images to add them'
              : <>Drag and drop images here, or <span className="resizer__dropzone-browse">browse files</span></>
            }
          </p>
          {!hasFiles && (
            <p className="resizer__dropzone-sub">PNG, JPEG, WebP, AVIF. Up to 50 files at once.</p>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          aria-hidden="true"
          tabIndex={-1}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
      </div>

      {hasFiles && (
        <div className="resizer__settings-bar card">
          {/* Row 1: format + quality */}
          <div className="settings-row">
            <div className="settings-field">
              <label htmlFor={`${uid}-format`} className="settings-label">Format</label>
              <select
                id={`${uid}-format`}
                className="resizer__select"
                value={settings.format}
                onChange={set('format')}
              >
                <option value="webp">WebP</option>
                <option value="avif">AVIF</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG (lossless)</option>
              </select>
            </div>

            <div className="settings-field settings-field--wide">
              <label htmlFor={`${uid}-quality`} className="settings-label">
                Quality: <strong>{settings.quality}%</strong>
              </label>
              <input
                id={`${uid}-quality`}
                type="range"
                min={10}
                max={100}
                step={5}
                value={settings.quality}
                onChange={set('quality')}
                className="resizer__range"
              />
            </div>
          </div>

          <div className="settings-row settings-row--dim">
            <span className="settings-label settings-label--block">
              {isPresetWorkspace ? 'Output size' : 'Resize (optional)'}
            </span>
            <div className="dim-inputs">
              <input
                id={`${uid}-width`}
                type="number"
                className={`resizer__input resizer__input--dim${dimReadOnly ? ' resizer__input--readonly' : ''}`}
                placeholder="Width px"
                min={1}
                max={10000}
                value={settings.targetWidth}
                onChange={set('targetWidth')}
                readOnly={dimReadOnly}
                aria-label="Target width in pixels"
              />
              <span className="dim-sep" aria-hidden="true">×</span>
              <input
                id={`${uid}-height`}
                type="number"
                className={`resizer__input resizer__input--dim${dimReadOnly ? ' resizer__input--readonly' : ''}`}
                placeholder="Height px"
                min={1}
                max={10000}
                value={settings.targetHeight}
                onChange={set('targetHeight')}
                readOnly={dimReadOnly}
                aria-label="Target height in pixels"
              />
              {!isPresetWorkspace && (
                <label className="resizer__lock" title="When only width or height is set, keep source aspect ratio">
                  <input
                    type="checkbox"
                    checked={settings.lockAspect}
                    onChange={set('lockAspect')}
                  />
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <rect x="4" y="8" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="sr-only">Lock aspect ratio when using a single dimension</span>
                </label>
              )}
            </div>
          </div>

          <p className="settings-privacy">
            Processed locally in your browser. Files never leave your device.
          </p>
        </div>
      )}

      {hasFiles && (
        <div className="resizer__actions">
          <div className="resizer__status-summary">
            {queuedCount > 0 && <span className="tag">{queuedCount} queued</span>}
            {processingCount > 0 && <span className="tag resizer__tag--processing">{processingCount} processing</span>}
            {doneCount > 0 && <span className="tag resizer__tag--done">{doneCount} done</span>}
            {errorCount > 0 && <span className="tag resizer__tag--error">{errorCount} failed</span>}
          </div>
          <div className="resizer__action-btns">
            {queuedCount > 0 && (
              <button
                className="btn btn--primary"
                onClick={runCompression}
                disabled={isRunning}
              >
                {isRunning
                  ? 'Compressing...'
                  : `Compress ${queuedCount} image${queuedCount === 1 ? '' : 's'}`}
              </button>
            )}
            {doneCount > 0 && (
              <button
                className="btn btn--secondary"
                onClick={downloadZip}
                disabled={isZipping}
              >
                {isZipping ? 'Preparing...' : `Download all (${doneCount})`}
              </button>
            )}
            <button className="btn btn--ghost" onClick={handleClearAll}>
              Clear
            </button>
          </div>
          {zipError && (
            <p className="resizer__zip-error" role="status">
              ZIP failed ({zipError}). Individual downloads were started instead.
            </p>
          )}
        </div>
      )}

      {hasFiles && (
        <div className="resizer__list" role="list" aria-label="File queue">
          {files.map((entry) => (
            <FileRow
              key={entry.id}
              entry={entry}
              format={settings.format}
              onDownload={() => downloadFile(entry)}
              onRemove={() => dispatch({ type: 'REMOVE_FILE', id: entry.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── File row ─────────────────────────────────────────────────────────────────

function FileRow({
  entry,
  format,
  onDownload,
  onRemove,
}: {
  entry: FileEntry;
  format: Format;
  onDownload: () => void;
  onRemove: () => void;
}) {
  return (
    <div className={`file-row file-row--${entry.status}`} role="listitem">
      {entry.previewUrl && (
        <img
          src={entry.previewUrl}
          alt=""
          aria-hidden="true"
          className="file-row__thumb"
        />
      )}
      <div className="file-row__info">
        <p className="file-row__name" title={entry.file.name}>{entry.file.name}</p>
        <div className="file-row__meta">
          <span className="file-row__size">{formatBytes(entry.originalSize)}</span>
          {entry.compressedSize !== undefined && (
            <>
              <span className="file-row__arrow" aria-label="compressed to">→</span>
              <span className="file-row__size file-row__size--compressed">
                {formatBytes(entry.compressedSize)}
              </span>
              <span className="file-row__savings">
                ({savingsPercent(entry.originalSize, entry.compressedSize)} smaller)
              </span>
              {entry.width && entry.height && (
                <span className="file-row__dims">{entry.width}×{entry.height}px</span>
              )}
            </>
          )}
        </div>
        {entry.error && <p className="file-row__error">{entry.error}</p>}
      </div>
      <div className="file-row__badge-wrap">
        <StatusBadge status={entry.status} />
      </div>
      <div className="file-row__actions">
        {entry.status === 'done' && (
          <button className="btn btn--primary btn--sm" onClick={onDownload}>
            Save {format.toUpperCase()}
          </button>
        )}
        <button
          className="btn btn--ghost btn--sm"
          onClick={onRemove}
          aria-label={`Remove ${entry.file.name}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: FileStatus }) {
  const map: Record<FileStatus, { label: string; cls: string }> = {
    queued:     { label: 'Queued',     cls: '' },
    processing: { label: 'Optimizing', cls: 'badge--processing' },
    done:       { label: 'Compressed', cls: 'badge--done' },
    error:      { label: 'Failed',     cls: 'badge--error' },
  };
  const { label, cls } = map[status];
  return <span className={`badge ${cls}`}>{label}</span>;
}
