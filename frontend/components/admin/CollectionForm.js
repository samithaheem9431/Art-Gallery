"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";

const empty = { title: "", description: "", image: "" };

export default function CollectionForm({ initial, onSubmit, submitLabel = "Save" }) {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setForm({ ...empty, ...initial });
  }, [initial]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Save failed");
      setSaving(false);
    }
  }

  const field = "w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-foreground";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1 block text-sm text-muted">Title *</label>
        <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={field} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted">Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className={field} />
      </div>

      {/* Single cover image — reuse uploader but keep only the last one */}
      <ImageUploader
        images={form.image ? [form.image] : []}
        onChange={(imgs) => update("image", imgs[imgs.length - 1] || "")}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit" disabled={saving}
          className="bg-foreground px-6 py-3 text-sm text-background transition hover:opacity-85 disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        <button type="button" onClick={() => router.push("/admin")} className="px-6 py-3 text-sm text-muted underline">
          Cancel
        </button>
      </div>
    </form>
  );
}
