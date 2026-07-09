import CollectionsGrid from "@/components/CollectionsGrid";
import ProductCard from "@/components/ProductCard";
import ApiNotice from "@/components/ApiNotice";
import { getCollections, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collections",
  description: "Browse all collections and original paintings by Zarmina Bashir.",
};

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);

  return (
    <div className="pt-6">
      <div className="mx-auto max-w-[1400px] px-5 pt-10 text-center md:px-8">
        <p className="eyebrow mb-3 text-muted">Shop all</p>
        <h1 className="text-4xl font-medium md:text-5xl">All Artwork</h1>
      </div>

      <CollectionsGrid collections={collections} heading="Browse by Collection" />
      {collections.length === 0 && <ApiNotice />}

      <section className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">
        <h2 className="mb-10 text-3xl font-medium md:text-4xl">All Paintings</h2>
        {products.length === 0 ? (
          <p className="text-center text-muted">No paintings available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
