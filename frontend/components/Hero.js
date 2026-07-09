import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex h-[calc(100vh-104px)] min-h-[520px] w-full items-center justify-center overflow-hidden">
      {/* Background image (replace /hero.jpg with the real artist portrait) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://picsum.photos/seed/nk-hero-portrait/1920/1200')",
        }}
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center animate-fade-in">
        <h1 className="font-display text-5xl font-light leading-[1.05] tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl">
          NAIMAL KHAWAR
          <br />
          ART
        </h1>
        <Link
          href="/collections"
          className="mt-10 border border-white px-10 py-3 text-sm tracking-wide text-white transition hover:bg-white hover:text-foreground"
        >
          Shop all
        </Link>
      </div>
    </section>
  );
}
