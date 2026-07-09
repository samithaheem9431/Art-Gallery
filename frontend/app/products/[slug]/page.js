import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import { getProduct, formatPrice } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Painting not found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images?.length ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
      <nav className="eyebrow mb-8 text-muted">
        <Link href="/collections" className="hover:text-foreground">
          Collections
        </Link>{" "}
        /{" "}
        <Link href={`/collections/${product.collectionSlug}`} className="capitalize hover:text-foreground">
          {product.collectionSlug}
        </Link>{" "}
        / {product.title}
      </nav>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <ProductGallery images={product.images} title={product.title} />

        <div className="md:pt-6">
          <h1 className="text-4xl font-medium md:text-5xl">{product.title}</h1>
          <p className="mt-4 text-2xl text-foreground/80">
            {formatPrice(product.price, product.currency)}
          </p>

          <div className="mt-8 space-y-1 text-sm text-muted">
            {product.medium && <p>Medium: {product.medium}</p>}
            {product.dimensions && <p>Dimensions: {product.dimensions}</p>}
            <p>{product.inStock ? "In stock — ready to ship" : "Sold"}</p>
          </div>

          {product.description && (
            <p className="mt-6 leading-relaxed text-foreground/80">{product.description}</p>
          )}

          <AddToCartButton product={product} />

          <div className="mt-10 border-t border-border pt-6 text-sm leading-relaxed text-muted">
            <p>
              Shipped Monday–Friday. Delivery 3–5 business days within Pakistan, 3–14 days
              internationally. International paintings ship rolled without the frame.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
