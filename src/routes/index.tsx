import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LANGS, translations, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LA 27 PRODUCTIONS — Sound of Luxury" },
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
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`transition-colors duration-200 ${
            lang === l.code
              ? "text-red"
              : "text-white/40 hover:text-white"
          }`}
          aria-label={`Switch to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function VideoCard({
  caption,
  index,
  vimeoId,
}: {
  caption: string;
  index: string;
  vimeoId: string;
}) {
  return (
    <figure className="group">
      <div className="flex items-end justify-between mb-3 px-1">
        <span className="text-[10px] tracking-luxe uppercase text-red">
          {index}
        </span>
        <span className="text-[10px] tracking-luxe uppercase text-white/40">
          {caption}
        </span>
      </div>
      <div className="relative aspect-video w-full overflow-hidden bg-black border border-hairline">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&dnt=1`}
          title={caption}
          className="absolute inset-0 w-full h-full"
          frameBorder={0}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </figure>
  );
}

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-5 md:py-6 flex items-center justify-between bg-black/60 backdrop-blur-sm">
        <a
          href="#top"
          className="text-[11px] tracking-luxe uppercase text-white"
        >
          LA 27<span className="text-red">.</span>
        </a>
        <LanguageSelector lang={lang} setLang={setLang} />
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative min-h-screen flex flex-col justify-between px-5 md:px-10 pt-28 md:pt-36 pb-8"
      >
        <div className="flex items-center justify-between text-[10px] tracking-luxe uppercase text-white/40">
          <span>EST · Barcelona</span>
          <span className="text-red">● Live</span>
        </div>

        <div>
          <h1 className="font-black tracking-tightest leading-[0.82] text-white text-[26vw] md:text-[19vw]">
            <span className="block">{t.heroLine1}</span>
            <span className="block pl-[0.2em] text-white/30">{t.heroLine2}</span>
            <span className="block text-red">{t.heroAccent}</span>
          </h1>
        </div>

        <div className="flex items-end justify-between gap-6">
          <span className="text-[11px] md:text-xs tracking-luxe uppercase text-white/60 max-w-xs">
            {t.heroTag}
          </span>
          <span className="text-[10px] tracking-luxe uppercase text-white/30">
            ↓ Scroll
          </span>
        </div>
      </section>

      {/* Work */}
      <section className="px-5 md:px-10 py-20 md:py-32 border-t border-hairline">
        <div className="flex items-end justify-between mb-12 md:mb-20">
          <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.9] text-white">
            {t.workTitle}<span className="text-red">.</span>
          </h2>
          <span className="hidden md:block text-[10px] tracking-luxe uppercase text-white/40">
            {t.workKicker}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6">
          <VideoCard caption={t.video1} index="01 / Ferrari" vimeoId="1192292542" />
          <VideoCard caption={t.video2} index="02 / Dior" vimeoId="1192292538" />
        </div>
      </section>

      {/* Contact */}
      <section className="px-5 md:px-10 py-24 md:py-40 border-t border-hairline">
        <h2 className="text-6xl md:text-[10rem] font-black tracking-tightest leading-[0.85] text-white mb-12 md:mb-16">
          {t.contactTitle}
          <br />
          <span className="text-red">{t.contactAccent}</span>
        </h2>

        <a
          href={`mailto:${EMAIL}?subject=LA%2027%20Productions%20%E2%80%94%20Inquiry`}
          className="group inline-flex items-center gap-4 border-b-2 border-white hover:border-red pb-2 transition-colors duration-300"
        >
          <span className="text-2xl md:text-4xl font-medium tracking-tight text-white group-hover:text-red transition-colors">
            {t.contactCta}
          </span>
          <span className="text-2xl md:text-4xl text-red">→</span>
        </a>

        <div className="mt-8 text-[11px] tracking-luxe uppercase text-white/50">
          {EMAIL}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 md:px-10 py-6 border-t border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[10px] tracking-luxe uppercase text-white/40">
        <span>© LA 27 Productions</span>
        <span>{t.footer}</span>
        <span>All Rights Reserved</span>
      </footer>
    </div>
  );
}
