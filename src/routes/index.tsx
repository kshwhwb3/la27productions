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
    <div className="flex items-center gap-2 text-[10px] tracking-luxe uppercase rounded-full bg-soft border border-hairline px-3 py-1.5">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2">
          <button
            onClick={() => setLang(l.code)}
            className={`transition-opacity duration-300 ${
              lang === l.code
                ? "text-bone opacity-100"
                : "text-bone opacity-40 hover:opacity-80"
            }`}
            aria-label={`Switch language to ${l.label}`}
          >
            {l.label}
          </button>
          {i < LANGS.length - 1 && (
            <span className="text-bone opacity-20">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

function VideoCard({
  caption,
  label,
  index,
}: {
  caption: string;
  label: string;
  index: string;
}) {
  return (
    <figure className="group">
      <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-soft border border-hairline">
        {/* Soft radial highlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(21,22,26,0) 70%)",
          }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        {/* Center play */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-5 transition-transform duration-700 group-hover:scale-[1.03]">
            <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-bone/5 backdrop-blur-sm border border-bone/20 group-hover:border-bone/60 group-hover:bg-bone/10 transition-all">
              <svg
                width="18"
                height="20"
                viewBox="0 0 14 16"
                fill="none"
                className="text-bone ml-[3px]"
              >
                <path d="M0 0L14 8L0 16V0Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[10px] tracking-luxe uppercase text-bone/60">
              {label}
            </span>
          </div>
        </div>
        {/* Corners */}
        <div className="absolute top-5 left-6 text-[10px] tracking-luxe uppercase text-bone/45">
          REEL · {index}
        </div>
        <div className="absolute top-5 right-6 text-[10px] tracking-luxe uppercase text-bone/45">
          LA 27
        </div>
      </div>
      <figcaption className="mt-5 px-2 flex items-center justify-between gap-4">
        <span className="text-[11px] md:text-xs tracking-luxe uppercase text-bone">
          {caption}
        </span>
        <span className="text-[10px] tracking-luxe uppercase text-bone/40 shrink-0">
          ⏵ Concept
        </span>
      </figcaption>
    </figure>
  );
}

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-base text-bone">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-4">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between rounded-full bg-soft/80 backdrop-blur-xl border border-hairline pl-5 pr-2 py-2">
          <a
            href="#top"
            className="text-[11px] tracking-luxe uppercase text-bone"
          >
            LA 27 <span className="opacity-50">— Productions</span>
          </a>
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      </header>

      {/* Hero — tighter */}
      <section
        id="top"
        className="relative px-4 md:px-8 pt-28 md:pt-32 pb-12 md:pb-16"
      >
        <div className="mx-auto max-w-[1600px] rounded-3xl md:rounded-[2.5rem] bg-soft border border-hairline px-6 md:px-12 py-14 md:py-20 relative overflow-hidden">
          {/* Soft glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(21,22,26,0) 60%)",
            }}
          />

          <div className="relative flex items-center justify-between text-[10px] tracking-luxe uppercase text-bone/40 mb-10 md:mb-12">
            <span>EST. Barcelona</span>
            <span>Studio / 001</span>
          </div>

          <h1 className="relative text-center font-light tracking-tightest leading-[0.88] text-bone text-[19vw] md:text-[11vw] lg:text-[9rem]">
            LA 27
          </h1>
          <div className="relative mt-1 text-center text-[11px] md:text-sm tracking-luxe uppercase text-bone/70">
            Productions
          </div>

          <div className="relative mt-10 md:mt-12 max-w-2xl mx-auto text-center">
            <p className="text-xl md:text-3xl font-light tracking-tight text-bone">
              {t.heroSubtitle}
            </p>
            <p className="mt-6 text-sm md:text-[15px] leading-relaxed text-bone/60 font-light">
              {t.heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio — close to top */}
      <section className="px-4 md:px-8 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14 px-2">
            <div>
              <div className="text-[10px] tracking-luxe uppercase text-bone/40 mb-4">
                — Portfolio
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tightest leading-[0.95] text-bone max-w-3xl">
                {t.portfolioTitle}
              </h2>
            </div>
            <p className="md:max-w-sm text-sm leading-relaxed text-bone/55 font-light">
              {t.portfolioIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <VideoCard caption={t.video1} label="Ferrari · Mockup" index="01" />
            <VideoCard caption={t.video2} label="Dior · Mockup" index="02" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 md:px-8 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1600px] rounded-3xl md:rounded-[2.5rem] bg-soft border border-hairline px-6 md:px-16 py-20 md:py-32 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.05) 0%, rgba(21,22,26,0) 60%)",
            }}
          />
          <div className="relative">
            <div className="text-[10px] tracking-luxe uppercase text-bone/40 mb-8">
              — Contact
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tightest leading-[0.95] text-bone">
              {t.contactTitle}
            </h2>
            <p className="mt-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed text-bone/60 font-light">
              {t.contactBody}
            </p>

            <div className="mt-12 md:mt-14">
              <a
                href={`mailto:${EMAIL}?subject=LA%2027%20Productions%20%E2%80%94%20Inquiry`}
                className="group inline-flex items-center justify-between w-full max-w-2xl rounded-full border border-bone/25 bg-softer hover:bg-bone hover:text-[#15161a] hover:border-bone transition-all duration-500 pl-8 pr-3 py-3"
              >
                <span className="text-[11px] md:text-xs tracking-luxe uppercase">
                  {t.contactCta}
                </span>
                <span className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-bone text-[#15161a] group-hover:bg-[#15161a] group-hover:text-bone transition-all">
                  ↗
                </span>
              </a>
              <div className="mt-6 text-[10px] tracking-luxe uppercase text-bone/40">
                {EMAIL}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 pb-6">
        <div className="mx-auto max-w-[1600px] rounded-full bg-soft border border-hairline px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] tracking-luxe uppercase text-bone/45">
          <span>© LA 27 Productions</span>
          <span>{t.footer}</span>
          <span>All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
