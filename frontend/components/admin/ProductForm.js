"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import { listCollections } from "@/lib/adminApi";

const empty = {
  title: "",
  price: "",
  currency: "PKR",
  collectionSlug: "",
  medium: "",
  dimensions: "",
  description: "",
  images: [],
  featured: false,
  inStock: true,
};

export default function ProductForm({ initial, onSubmit, submitLabel = "Save" }) {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listCollections().then(setCollections).catch(() => {});
  }, []);

  useEffect(() => {
    if (initial) setForm({ ...empty, ...initial, price: String(initial.price ?? "") });
  }, [initial]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
      });
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-muted">Price (PKR) *</label>
          <input
            required type="number" min="0" value={form.price}
            onChange={(e) => update("price", e.target.value)} className={field}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Collection *</label>
          <select
            required value={form.collectionSlug}
            onChange={(e) => update("collectionSlug", e.target.value)} className={field}
          >
            <option value="">Select…</option>
            {collections.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-muted">Medium</label>
          <input value={form.medium} onChange={(e) => update("medium", e.target.value)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Dimensions</label>
          <input value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} className={field} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Description</label>
        <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className={field} />
      </div>

      <ImageUploader images={form.images} onChange={(imgs) => update("images", imgs)} />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
          Featured on home
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.inStock} onChange={(e) => update("inStock", e.target.checked)} />
          In stock
        </label>
      </div>

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
