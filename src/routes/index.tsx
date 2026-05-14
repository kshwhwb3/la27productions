import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LANGS, translations, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LA 27 PRODUCTIONS — High-End Sonic Engineering" },
      {
        name: "description",
        content:
          "Bespoke commercial audio and sonic identities for luxury brands. Born in Barcelona.",
      },
    ],
  }),
});

const EMAIL = "la27productions@gmail.com";

function LanguageSelector({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <div className="flex items-center gap-3 text-[10px] tracking-luxe uppercase">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-3">
          <button
            onClick={() => setLang(l.code)}
            className={`transition-opacity duration-300 ${
              lang === l.code
                ? "text-bone opacity-100"
                : "text-bone opacity-30 hover:opacity-70"
            }`}
            aria-label={`Switch language to ${l.label}`}
          >
            {l.label}
          </button>
          {i < LANGS.length - 1 && (
            <span className="text-bone opacity-20">/</span>
          )}
        </span>
      ))}
    </div>
  );
}

function VideoPlaceholder({ caption, label }: { caption: string; label: string }) {
  return (
    <figure className="group">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#050505] border border-hairline">
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,1) 75%)",
          }}
        />
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        {/* Center play indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 transition-transform duration-700 group-hover:scale-[1.02]">
            <div className="h-px w-24 bg-bone/40" />
            <div className="flex items-center justify-center w-16 h-16 rounded-full border border-bone/30 group-hover:border-bone/70 transition-colors">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                className="text-bone ml-[2px]"
              >
                <path d="M0 0L14 8L0 16V0Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[10px] tracking-luxe uppercase text-bone/50">
              {label}
            </span>
          </div>
        </div>
        {/* Corner ticks */}
        <div className="absolute top-4 left-4 text-[10px] tracking-luxe uppercase text-bone/40">
          REEL · 01
        </div>
        <div className="absolute bottom-4 right-4 text-[10px] tracking-luxe uppercase text-bone/40">
          LA 27
        </div>
      </div>
      <figcaption className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
        <span className="text-[11px] md:text-xs tracking-luxe uppercase text-bone">
          {caption}
        </span>
        <span className="text-[10px] tracking-luxe uppercase text-bone/40">
          ⏵ Concept Mockup
        </span>
      </figcaption>
    </figure>
  );
}

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-black text-bone">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-hairline">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 h-16 flex items-center justify-between">
          <a
            href="#top"
            className="text-[11px] tracking-luxe uppercase text-bone"
          >
            LA 27 <span className="opacity-50">— Productions</span>
          </a>
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-10 pt-28 pb-24"
      >
        {/* Top label */}
        <div className="absolute top-24 left-6 md:left-10 text-[10px] tracking-luxe uppercase text-bone/40">
          EST. Barcelona
        </div>
        <div className="absolute top-24 right-6 md:right-10 text-[10px] tracking-luxe uppercase text-bone/40">
          {t.navStudio} / 001
        </div>

        <h1 className="text-center font-light tracking-tightest leading-[0.88] text-bone text-[18vw] md:text-[12vw] lg:text-[10.5rem]">
          LA 27
        </h1>
        <div className="mt-2 text-center text-[11px] md:text-sm tracking-luxe uppercase text-bone/70">
          Productions
        </div>

        <div className="mt-16 md:mt-20 max-w-2xl text-center">
          <p className="text-lg md:text-2xl font-light tracking-tight text-bone">
            {t.heroSubtitle}
          </p>
          <p className="mt-8 text-sm md:text-[15px] leading-relaxed text-bone/55 font-light">
            {t.heroDesc}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[10px] tracking-luxe uppercase text-bone/40">
            Scroll
          </span>
          <div className="h-10 w-px bg-bone/30" />
        </div>
      </section>

      {/* Portfolio */}
      <section className="px-6 md:px-10 py-32 md:py-48 border-t border-hairline">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 md:mb-32">
            <div>
              <div className="text-[10px] tracking-luxe uppercase text-bone/40 mb-6">
                — Portfolio
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tightest leading-[0.95] text-bone max-w-3xl">
                {t.portfolioTitle}
              </h2>
            </div>
            <p className="md:max-w-md text-sm leading-relaxed text-bone/50 font-light">
              {t.portfolioIntro}
            </p>
          </div>

          <div className="space-y-24 md:space-y-40">
            <VideoPlaceholder caption={t.video1} label="Ferrari · Mockup" />
            <VideoPlaceholder caption={t.video2} label="Dior · Mockup" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 md:px-10 py-32 md:py-56 border-t border-hairline">
        <div className="mx-auto max-w-[1400px] text-center">
          <div className="text-[10px] tracking-luxe uppercase text-bone/40 mb-10">
            — Contact
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tightest leading-[0.95] text-bone">
            {t.contactTitle}
          </h2>
          <p className="mt-12 max-w-xl mx-auto text-sm md:text-base leading-relaxed text-bone/55 font-light">
            {t.contactBody}
          </p>

          <div className="mt-20">
            <a
              href={`mailto:${EMAIL}?subject=LA%2027%20Productions%20%E2%80%94%20Inquiry`}
              className="group inline-flex items-center justify-center w-full max-w-2xl border border-bone/30 hover:border-bone hover:bg-bone hover:text-black transition-all duration-500 px-12 py-8 md:py-10"
            >
              <span className="text-[11px] md:text-xs tracking-luxe uppercase">
                {t.contactCta}
              </span>
              <span className="ml-6 text-[11px] md:text-xs tracking-luxe uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                ↗
              </span>
            </a>
            <div className="mt-8 text-[10px] tracking-luxe uppercase text-bone/40">
              {EMAIL}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline px-6 md:px-10 py-10">
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-luxe uppercase text-bone/40">
          <span>© LA 27 Productions</span>
          <span>{t.footer}</span>
          <span>All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
