const defaultAboutSlides = [
  "https://picsum.photos/seed/nk-studio-1/1000/900",
  "https://picsum.photos/seed/nk-studio-2/1000/900",
  "https://picsum.photos/seed/nk-studio-3/1000/900",
];

const defaultAbout = {
  aboutTitle: "ABOUT THE ARTIST",
  aboutText1:
    "Zarmina Bashir is a painter based in Islamabad, Pakistan. After graduating with a distinction from NCA (National College of Arts), she joined the University of Arts London where she further studied different techniques of painting.",
  aboutText2:
    "Bashir aims to achieve a balance between colour luminosity but also to break contrast between harmony and chaos.",
};

const fetchOpts = { cache: "no-store" };

function trimUrl(url) {
  return url?.replace(/\/$/, "") || "";
}

export function getBackendBaseUrl() {
  const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
  return trimUrl(raw)
    .replace(/\/api$/i, "")
    .replace(/localhost/i, "127.0.0.1");
}

function isLocalUrl(url) {
  return /localhost|127\.0\.0\.1/i.test(url || "");
}

export function getApiUrl() {
  const configured = trimUrl(process.env.NEXT_PUBLIC_API_URL);
  const backend = trimUrl(process.env.BACKEND_URL);

  if (typeof window === "undefined") {
    if (backend) return `${backend}/api`;
    if (configured && !isLocalUrl(configured)) {
      return configured.endsWith("/api") ? configured : `${configured}/api`;
    }
    return "http://127.0.0.1:5000/api";
  }

  // Browser: use configured API URL when set (including localhost for admin uploads)
  if (configured) {
    const api = configured.endsWith("/api") ? configured : `${configured}/api`;
    return api.replace(/localhost/i, "127.0.0.1");
  }

  return "/api";
}

export function normalizeMediaUrl(url) {
  if (!url || typeof url !== "string") return url;

  const match = url.match(/\/api\/images\/([a-f0-9]{24})/i);
  if (match) return `/api/images/${match[1]}`;

  if (isLocalUrl(url)) {
    return url.replace(/^https?:\/\/[^/]+/, "");
  }

  return url;
}

// Absolute backend URL for displaying Mongo/Multer images (admin + public site)
export function getDisplayImageUrl(url) {
  if (!url || typeof url !== "string") return url;

  const match = url.match(/\/api\/images\/([a-f0-9]{24})/i);
  if (match) {
    return `${getBackendBaseUrl()}/api/images/${match[1]}`;
  }

  if (isLocalUrl(url)) {
    return url.replace(/localhost/i, "127.0.0.1");
  }

  return url;
}

function normalizeProduct(product) {
  if (!product) return product;
  return {
    ...product,
    images: Array.isArray(product.images) ? product.images.map(getDisplayImageUrl) : [],
  };
}

function normalizeCollection(collection) {
  if (!collection) return collection;
  return {
    ...collection,
    image: getDisplayImageUrl(collection.image),
  };
}

async function safeFetch(path) {
  const url = `${getApiUrl()}${path}`;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(url, fetchOpts);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return await res.json();
    } catch (error) {
      if (attempt === 2) {
        if (process.env.NODE_ENV === "development") {
          console.error(`[api] ${url} failed:`, error.message);
        }
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  return null;
}

export async function getCollections() {
  const data = await safeFetch("/collections");
  return Array.isArray(data) ? data.map(normalizeCollection) : [];
}

export async function getCollection(slug) {
  const data = await safeFetch(`/collections/${slug}`);
  if (!data) return null;
  return {
    ...data,
    collection: normalizeCollection(data.collection),
    products: Array.isArray(data.products) ? data.products.map(normalizeProduct) : [],
  };
}

export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const data = await safeFetch(`/products${query ? `?${query}` : ""}`);
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
}

export async function getProduct(slug) {
  const data = await safeFetch(`/products/${slug}`);
  return normalizeProduct(data);
}

export async function getSiteSettings() {
  const data = await safeFetch("/site-settings");
  if (!data) {
    return {
      aboutSlides: defaultAboutSlides,
      ...defaultAbout,
    };
  }
  return {
    ...data,
    aboutSlides:
      Array.isArray(data.aboutSlides) && data.aboutSlides.length > 0
        ? data.aboutSlides.map(getDisplayImageUrl)
        : defaultAboutSlides,
    aboutTitle: data.aboutTitle || defaultAbout.aboutTitle,
    aboutText1: data.aboutText1 || defaultAbout.aboutText1,
    aboutText2: data.aboutText2 || defaultAbout.aboutText2,
  };
}

export function formatPrice(value, currency = "PKR") {
  const symbol = currency === "PKR" ? "₨" : currency + " ";
  return `${symbol} ${Number(value).toLocaleString("en-PK")}`;
}
