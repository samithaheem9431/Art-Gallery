"use client";

import { useCallback, useEffect, useState } from "react";

const slides = [
  "https://picsum.photos/seed/nk-studio-1/1000/900",
  "https://picsum.photos/seed/nk-studio-2/1000/900",
  "https://picsum.photos/seed/nk-studio-3/1000/900",
];

export default function AboutSlideshow() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

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
          {slides.map((src, i) => (
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
          <span>
            {index + 1}/{slides.length}
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

      {/* Text */}
      <div className="order-1 md:order-2">
        <h2 className="mb-6 text-3xl font-medium tracking-wide md:text-4xl">
          ABOUT THE ARTIST
        </h2>
        <p className="mb-4 leading-relaxed text-foreground/80">
          Naimal Khawar is a painter based in Islamabad, Pakistan. After graduating with a
          distinction from NCA (National College of Arts), she joined the University of Arts London
          where she further studied different techniques of painting.
        </p>
        <p className="leading-relaxed text-foreground/80">
          Khawar aims to achieve a balance between colour luminosity but also to break contrast
          between harmony and chaos.
        </p>
      </div>
    </section>
  );
}
