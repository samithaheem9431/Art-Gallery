import Hero from "@/components/Hero";
import AboutSlideshow from "@/components/AboutSlideshow";
import ShippingPolicy from "@/components/ShippingPolicy";
import CollectionsGrid from "@/components/CollectionsGrid";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { getCollections, getProducts } from "@/lib/api";

export default async function HomePage() {
  const [collections, featured] = await Promise.all([
    getCollections(),
    getProducts({ featured: "true" }),
  ]);

  return (
    <>
      <Hero />
      <AboutSlideshow />
      <ShippingPolicy />
      <CollectionsGrid collections={collections} />

      {featured.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-4xl font-medium md:text-5xl">Featured Works</h2>
            <Link href="/collections" className="text-sm text-muted transition hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
