const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const defaultAboutSlides = [
  "https://picsum.photos/seed/nk-studio-1/1000/900",
  "https://picsum.photos/seed/nk-studio-2/1000/900",
  "https://picsum.photos/seed/nk-studio-3/1000/900",
];

const fetchOpts = { cache: "no-store" };

async function safeFetch(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, fetchOpts);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch {
    return null;
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
