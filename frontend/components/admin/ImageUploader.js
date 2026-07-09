"use client";

import { useState } from "react";
import { deleteImage, uploadImages } from "@/lib/adminApi";
import { normalizeMediaUrl } from "@/lib/api";

export default function ImageUploader({ images = [], onChange, onPersist }) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState("");
  const [error, setError] = useState("");

  async function handleFiles(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const urls = (await uploadImages(files)).map(normalizeMediaUrl).filter(Boolean);
      if (urls.length === 0) throw new Error("Upload returned no image URLs");
      const next = [...images, ...urls];
      onChange(next);
      if (onPersist) await onPersist(next);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeImage(url) {
    setError("");
    setRemoving(url);
    const previous = images;
    const next = images.filter((i) => i !== url);
    try {
      onChange(next);
      if (onPersist) await onPersist(next);
      try {
        await deleteImage(url);
      } catch {
        // Slideshow already updated; orphaned DB file is non-blocking
      }
    } catch (err) {
      onChange(previous);
      setError(err.message || "Delete failed");
    } finally {
      setRemoving("");
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm text-muted">Slideshow images</label>

      {images.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((url, idx) => {
            const src = normalizeMediaUrl(url);
            const busy = removing === url;
            return (
              <div
                key={`${src}-${idx}`}
                className="relative h-24 w-24 overflow-hidden border border-border bg-[#f4f2ee]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  disabled={busy || uploading}
                  className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-black/70 text-xs text-white disabled:opacity-50"
                  aria-label="Remove image"
                >
                  {busy ? "…" : "×"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mb-3 text-sm text-muted">No slideshow images yet. Upload one or more below.</p>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={uploading || Boolean(removing)}
        className="block w-full text-sm text-muted file:mr-4 file:border file:border-border file:bg-background file:px-4 file:py-2 file:text-sm file:text-foreground hover:file:bg-foreground/5"
      />
      {uploading && <p className="mt-2 text-sm text-muted">Uploading…</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
