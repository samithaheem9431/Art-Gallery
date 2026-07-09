"use client";

import { useCallback, useEffect, useState } from "react";

export default function AboutSlideshow({ slides = [] }) {
  const gallery = slides.length > 0 ? slides : [];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => {
    if (gallery.length === 0) return;
    setIndex((i) => (i + 1) % gallery.length);
  }, [gallery.length]);
  const prev = () => {
    if (gallery.length === 0) return;
    setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  };

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [playing, next]);

  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8">
      {/* Slideshow */}
      <div className="order-2 md:order-1">
        <div className="relative aspect-[10/9] w-full overflow-hidden">
          {gallery.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f4f2ee] text-sm text-muted">
              No slideshow images set in admin panel
            </div>
          )}
          {gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`Studio ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted">
          <button aria-label="Previous slide" onClick={prev} className="transition hover:text-foreground">
            &#8249;
          </button>
          <span>{gallery.length === 0 ? "0/0" : `${index + 1}/${gallery.length}`}</span>
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

      {/* Text */}
      <div className="order-1 md:order-2">
        <h2 className="mb-6 text-3xl font-medium tracking-wide md:text-4xl">
          ABOUT THE ARTIST
        </h2>
        <p className="mb-4 leading-relaxed text-foreground/80">
          Zarmina Bashir is a painter based in Islamabad, Pakistan. After graduating with a
          distinction from NCA (National College of Arts), she joined the University of Arts London
          where she further studied different techniques of painting.
        </p>
        <p className="leading-relaxed text-foreground/80">
          Bashir aims to achieve a balance between colour luminosity but also to break contrast
          between harmony and chaos.
        </p>
      </div>
    </section>
  );
}
