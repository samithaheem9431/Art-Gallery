import { getCollections, getProducts } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);

  const staticRoutes = ["", "/collections", "/contact"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
