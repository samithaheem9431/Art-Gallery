import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCollection } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) return { title: "Collection not found" };
  return {
    title: data.collection.title,
    description: data.collection.description,
  };
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) notFound();

  const { collection, products } = data;

  return (
    <div>
      <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8">
        <nav className="eyebrow mb-4 text-muted">
          <Link href="/collections" className="hover:text-foreground">
            Collections
          </Link>{" "}
          / {collection.title}
        </nav>
        <h1 className="text-4xl font-medium md:text-5xl">{collection.title}</h1>
        {collection.description && (
          <p className="mt-4 leading-relaxed text-foreground/70">{collection.description}</p>
        )}
      </div>

      <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8">
        {products.length === 0 ? (
          <p className="text-center text-muted">No paintings in this collection yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
