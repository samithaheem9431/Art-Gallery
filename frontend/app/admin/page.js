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
  const [aboutTitle, setAboutTitle] = useState("ABOUT THE ARTIST");
  const [aboutText1, setAboutText1] = useState("");
  const [aboutText2, setAboutText2] = useState("");
  const [savingAbout, setSavingAbout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

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
      setAboutTitle(settings.aboutTitle || "ABOUT THE ARTIST");
      setAboutText1(settings.aboutText1 || "");
      setAboutText2(settings.aboutText2 || "");
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

  async function handleSaveAbout() {
    setSavingAbout(true);
    setError("");
    setSavedMsg("");
    try {
      const updated = await updateSiteSettings({
        aboutSlides: aboutSlides.map(normalizeMediaUrl).filter(Boolean),
        aboutTitle,
        aboutText1,
        aboutText2,
      });
      setAboutSlides((updated.aboutSlides || []).map(normalizeMediaUrl).filter(Boolean));
      setAboutTitle(updated.aboutTitle || "ABOUT THE ARTIST");
      setAboutText1(updated.aboutText1 || "");
      setAboutText2(updated.aboutText2 || "");
      setSavedMsg("About section saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingAbout(false);
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const field =
    "w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-foreground";

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

      {/* About section settings */}
      <section className="border border-border p-5 md:p-6">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-medium">About Section</h2>
          <p className="mt-1 text-sm text-muted">
            Edit the homepage &quot;About the Artist&quot; title, text, and slideshow images.
          </p>
        </div>

        <div className="mb-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-muted">Title</label>
            <input
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              className={field}
              placeholder="ABOUT THE ARTIST"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Paragraph 1</label>
            <textarea
              rows={4}
              value={aboutText1}
              onChange={(e) => setAboutText1(e.target.value)}
              className={field}
              placeholder="First about paragraph…"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Paragraph 2</label>
            <textarea
              rows={3}
              value={aboutText2}
              onChange={(e) => setAboutText2(e.target.value)}
              className={field}
              placeholder="Second about paragraph…"
            />
          </div>
        </div>

        <ImageUploader images={aboutSlides} onChange={setAboutSlides} />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSaveAbout}
            disabled={savingAbout}
            className="bg-foreground px-4 py-2 text-sm text-background transition hover:opacity-85 disabled:opacity-50"
          >
            {savingAbout ? "Saving..." : "Save about section"}
          </button>
          <span className="text-xs text-muted">
            {aboutSlides.length} image{aboutSlides.length === 1 ? "" : "s"} selected
          </span>
          {savedMsg && <span className="text-xs text-green-700">{savedMsg}</span>}
        </div>
      </section>
    </div>
  );
}
