import { fallbackCollections, fallbackProducts } from "./fallbackData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const ENABLE_FALLBACK_DATA = process.env.NEXT_PUBLIC_ENABLE_FALLBACK_DATA === "true";
const defaultAboutSlides = [
  "https://picsum.photos/seed/nk-studio-1/1000/900",
  "https://picsum.photos/seed/nk-studio-2/1000/900",
  "https://picsum.photos/seed/nk-studio-3/1000/900",
];

// Always read fresh data so admin updates appear immediately on the site.
const fetchOpts = { cache: "no-store" };

async function safeFetch(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, fetchOpts);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    if (ENABLE_FALLBACK_DATA) return null;
    throw new Error(`API fetch failed for ${path}: ${error.message}`);
  }
}

export async function getCollections() {
  const data = await safeFetch("/collections");
  return data || fallbackCollections;
}

export async function getCollection(slug) {
  const data = await safeFetch(`/collections/${slug}`);
  if (data) return data;
  const collection = fallbackCollections.find((c) => c.slug === slug) || null;
  const products = fallbackProducts.filter((p) => p.collectionSlug === slug);
  return collection ? { collection, products } : null;
}

export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const data = await safeFetch(`/products${query ? `?${query}` : ""}`);
  if (data) return data;
  let products = fallbackProducts;
  if (params.collection) products = products.filter((p) => p.collectionSlug === params.collection);
  if (params.featured === "true") products = products.filter((p) => p.featured);
  return products;
}

export async function getProduct(slug) {
  const data = await safeFetch(`/products/${slug}`);
  return data || fallbackProducts.find((p) => p.slug === slug) || null;
}

export async function getSiteSettings() {
  const data = await safeFetch("/site-settings");
  if (!data) return { aboutSlides: defaultAboutSlides };
  return {
    ...data,
    aboutSlides:
      Array.isArray(data.aboutSlides) && data.aboutSlides.length > 0
        ? data.aboutSlides
        : defaultAboutSlides,
  };
}

export function getApiUrl() {
  return API_URL;
}

export function formatPrice(value, currency = "PKR") {
  const symbol = currency === "PKR" ? "₨" : currency + " ";
  return `${symbol} ${Number(value).toLocaleString("en-PK")}`;
}
