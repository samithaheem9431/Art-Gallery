const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000/api";

// Revalidate server-fetched data every 60s (ISR-friendly, good for SEO)
const fetchOpts = { next: { revalidate: 60 } };

async function safeFetch(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, fetchOpts);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch {
    return null; // caller falls back to local data
  }
}

export async function getCollections() {
  const data = await safeFetch("/collections");
  return Array.isArray(data) ? data : [];
}

export async function getCollection(slug) {
  const data = await safeFetch(`/collections/${slug}`);
  return data || null;
}

export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const data = await safeFetch(`/products${query ? `?${query}` : ""}`);
  return Array.isArray(data) ? data : [];
}

export async function getProduct(slug) {
  const data = await safeFetch(`/products/${slug}`);
  return data || null;
}

export async function getSiteSettings() {
  try {
    // Always fetch fresh slideshow settings so admin updates appear immediately.
    const res = await fetch(`${API_URL}/site-settings`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();
    return {
      ...data,
      aboutSlides: Array.isArray(data.aboutSlides) ? data.aboutSlides : [],
    };
  } catch {
    return { aboutSlides: [] };
  }
}

export function getApiUrl() {
  return API_URL;
}

export function formatPrice(value, currency = "PKR") {
  const symbol = currency === "PKR" ? "₨" : currency + " ";
  return `${symbol} ${Number(value).toLocaleString("en-PK")}`;
}
