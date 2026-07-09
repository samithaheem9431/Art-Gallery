import Image from "next/image";
import Link from "next/link";

export default function CollectionsGrid({ collections, heading = "Shop Collections" }) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
      <h2 className="mb-10 text-4xl font-medium md:text-5xl">{heading}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="group block">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f4f2ee]">
              <Image
                src={c.image || "https://picsum.photos/seed/nk-collection/900/1100"}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
              <h3 className="absolute inset-x-0 bottom-6 text-center font-display text-3xl font-medium text-white drop-shadow">
                {c.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
