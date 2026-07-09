import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/api";

export default function ProductCard({ product }) {
  const image = product.images?.[0] || "https://picsum.photos/seed/nk-placeholder/800/1000";
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f4f2ee]">
        <Image
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-display text-xl font-medium">{product.title}</h3>
        <p className="mt-1 text-sm text-muted">{formatPrice(product.price, product.currency)}</p>
      </div>
    </Link>
  );
}
