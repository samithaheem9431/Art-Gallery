"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  listProducts,
  listCollections,
  deleteProduct,
  deleteCollection,
  getSiteSettings,
  updateSiteSettings,
} from "@/lib/adminApi";
import { formatPrice, normalizeMediaUrl } from "@/lib/api";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [aboutSlides, setAboutSlides] = useState([]);
  const [savingSlides, setSavingSlides] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [p, c, settings] = await Promise.all([
        listProducts(),
        listCollections(),
        getSiteSettings(),
      ]);
      setProducts(p);
      setCollections(c);
      setAboutSlides((settings.aboutSlides || []).map(normalizeMediaUrl).filter(Boolean));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDeleteProduct(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  async function handleDeleteCollection(id, title) {
    if (!confirm(`Delete collection "${title}"?`)) return;
    await deleteCollection(id);
    setCollections((prev) => prev.filter((c) => c._id !== id));
  }

  async function handleSaveSlides() {
    setSavingSlides(true);
    setError("");
    try {
      const updated = await updateSiteSettings({
        aboutSlides: aboutSlides.map(normalizeMediaUrl).filter(Boolean),
      });
      setAboutSlides((updated.aboutSlides || []).map(normalizeMediaUrl).filter(Boolean));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSlides(false);
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-12">
      {/* Products */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium">Products ({products.length})</h2>
          <Link
            href="/admin/products/new"
            className="bg-foreground px-4 py-2 text-sm text-background transition hover:opacity-85"
          >
            + Add product
          </Link>
        </div>
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-foreground/[0.03] text-muted">
              <tr>
                <th className="px-4 py-3 font-normal">Image</th>
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal">Collection</th>
                <th className="px-4 py-3 font-normal">Price</th>
                <th className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.images?.[0] || "https://picsum.photos/seed/x/80/80"}
                      alt=""
                      className="h-12 w-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{p.title}</td>
                  <td className="px-4 py-2 capitalize text-muted">{p.collectionSlug}</td>
                  <td className="px-4 py-2">{formatPrice(p.price, p.currency)}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3">
                      <Link href={`/admin/products/${p._id}`} className="underline hover:text-foreground">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(p._id, p.title)}
                        className="text-red-600 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Collections */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium">Collections ({collections.length})</h2>
          <Link
            href="/admin/collections/new"
            className="bg-foreground px-4 py-2 text-sm text-background transition hover:opacity-85"
          >
            + Add collection
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <div key={c._id} className="border border-border p-4">
              <div className="mb-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image || "https://picsum.photos/seed/x/80/80"}
                  alt=""
                  className="h-14 w-14 object-cover"
                />
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted">/{c.slug}</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Link href={`/admin/collections/${c._id}`} className="underline hover:text-foreground">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteCollection(c._id, c.title)}
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {collections.length === 0 && (
            <p className="text-muted">No collections yet.</p>
          )}
        </div>
      </section>

      {/* About slideshow settings */}
      <section className="border border-border p-5 md:p-6">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-medium">About Section Slideshow</h2>
          <p className="mt-1 text-sm text-muted">
            These images are shown in the homepage transition slider under "About the Artist".
          </p>
        </div>

        <ImageUploader images={aboutSlides} onChange={setAboutSlides} />

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleSaveSlides}
            disabled={savingSlides}
            className="bg-foreground px-4 py-2 text-sm text-background transition hover:opacity-85 disabled:opacity-50"
          >
            {savingSlides ? "Saving..." : "Save slideshow images"}
          </button>
          <span className="text-xs text-muted">
            {aboutSlides.length} image{aboutSlides.length === 1 ? "" : "s"} selected
          </span>
        </div>
      </section>
    </div>
  );
}
