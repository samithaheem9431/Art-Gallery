"use client";

import { useState } from "react";
import { uploadImages } from "@/lib/adminApi";

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      onChange([...images, ...urls]);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file
    }
  }

  function removeImage(url) {
    onChange(images.filter((i) => i !== url));
  }

  return (
    <div>
      <label className="mb-2 block text-sm text-muted">Images</label>

      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-black/70 text-xs text-white"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={uploading}
        className="block w-full text-sm text-muted file:mr-4 file:border file:border-border file:bg-background file:px-4 file:py-2 file:text-sm file:text-foreground hover:file:bg-foreground/5"
      />
      {uploading && <p className="mt-2 text-sm text-muted">Uploading…</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
