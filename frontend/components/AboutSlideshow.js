"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeMediaUrl } from "@/lib/api";

export default function AboutSlideshow({
  slides = [],
  title = "ABOUT THE ARTIST",
  text1 = "",
  text2 = "",
}) {
  const gallery = useMemo(() => {
    const normalized = (slides || [])
      .map((src) => normalizeMediaUrl(src))
      .filter(Boolean);
    return normalized.length > 0
      ? normalized
      : ["https://picsum.photos/seed/nk-studio-1/1000/900"];
  }, [slides]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState({});

  const next = useCallback(() => setIndex((i) => (i + 1) % gallery.length), [gallery.length]);
  const prev = () => setIndex((i) => (i - 1 + gallery.length) % gallery.length);

  useEffect(() => {
    setIndex(0);
    setFailed({});
  }, [gallery]);

  useEffect(() => {
    if (!playing || gallery.length < 2) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [playing, next, gallery.length]);

  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8">
      <div className="order-2 md:order-1">
        <div className="relative aspect-[10/9] w-full overflow-hidden bg-[#f4f2ee]">
          {gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${src}-${i}`}
              src={src}
              alt={`Studio ${i + 1}`}
              onError={() => setFailed((prev) => ({ ...prev, [i]: true }))}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === index && !failed[i] ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {failed[index] && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
              Image failed to load
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted">
          <button aria-label="Previous slide" onClick={prev} className="transition hover:text-foreground">
            &#8249;
          </button>
          <span>
            {index + 1}/{gallery.length}
          </span>
          <button aria-label="Next slide" onClick={next} className="transition hover:text-foreground">
            &#8250;
          </button>
          <button
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            onClick={() => setPlaying((p) => !p)}
            className="ml-2 transition hover:text-foreground"
          >
            {playing ? "❙❙" : "▶"}
          </button>
        </div>
      </div>

      <div className="order-1 md:order-2">
        <h2 className="mb-6 text-3xl font-medium tracking-wide md:text-4xl">{title}</h2>
        {text1 && <p className="mb-4 leading-relaxed text-foreground/80 whitespace-pre-line">{text1}</p>}
        {text2 && <p className="leading-relaxed text-foreground/80 whitespace-pre-line">{text2}</p>}
      </div>
    </section>
  );
}
