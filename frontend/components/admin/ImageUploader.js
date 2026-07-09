"use client";

import { useEffect, useState } from "react";
import { deleteImage, uploadImages } from "@/lib/adminApi";
import { getDisplayImageUrl } from "@/lib/api";

export default function ImageUploader({ images = [], onChange, onPersist }) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState("");
  const [error, setError] = useState("");
  const [localPreviews, setLocalPreviews] = useState([]);

  useEffect(() => {
    return () => {
      localPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [localPreviews]);

  async function handleFiles(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError("");

    const previewUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setLocalPreviews(previewUrls);
    setUploading(true);

    try {
      const urls = (await uploadImages(files)).map(getDisplayImageUrl).filter(Boolean);
      if (urls.length === 0) throw new Error("Upload returned no image URLs");
      const next = [...images, ...urls];
      onChange(next);
      if (onPersist) await onPersist(next);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setLocalPreviews([]);
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

  const previewItems = [
    ...images.map((url) => ({ key: url, src: getDisplayImageUrl(url), removable: url })),
    ...localPreviews.map((url) => ({ key: url, src: url, removable: null })),
  ];

  return (
    <div>
      <label className="mb-2 block text-sm text-muted">Slideshow images</label>

      {previewItems.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-3">
          {previewItems.map((item, idx) => {
            const busy = item.removable && removing === item.removable;
            return (
              <div
                key={`${item.key}-${idx}`}
                className="relative h-24 w-24 overflow-hidden border border-border bg-[#f4f2ee]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0.3";
                  }}
                />
                {item.removable && (
                  <button
                    type="button"
                    onClick={() => removeImage(item.removable)}
                    disabled={busy || uploading}
                    className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-black/70 text-xs text-white disabled:opacity-50"
                    aria-label="Remove image"
                  >
                    {busy ? "…" : "×"}
                  </button>
                )}
                {!item.removable && uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs text-white">
                    …
                  </div>
                )}
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
