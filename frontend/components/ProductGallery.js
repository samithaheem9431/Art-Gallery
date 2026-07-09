"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, title }) {
  const gallery = images?.length ? images : ["https://picsum.photos/seed/nk-art/900/1100"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f4f2ee]">
        <Image
          src={gallery[active]}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3">
          {gallery.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative aspect-square w-20 overflow-hidden border ${
                i === active ? "border-foreground" : "border-border"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
