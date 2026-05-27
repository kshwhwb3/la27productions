import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { LANGS, translations, type Lang } from "@/lib/i18n";
import timHelmes from "@/assets/tim-helmes.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LA 27 PRODUCTIONS — Música Exclusiva para Publicidad | Barcelona" },
      {
        name: "description",
        content:
          "Música instrumental 100% exclusiva para anuncios y contenido de marca. Sin librerías, sin royalties. Estudio en Barcelona.",
      },
      { property: "og:title", content: "LA 27 PRODUCTIONS — Música Exclusiva para Publicidad" },
      {
        property: "og:description",
        content:
          "Música instrumental 100% exclusiva para anuncios y contenido de marca. Sin librerías, sin royalties. Estudio en Barcelona.",
      },
    ],
  }),
});

const EMAIL = "la27productions@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/tim-helmes-boschi-9b9244246/";

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
            lang === l.code ? "text-red" : "text-white/40 hover:text-white"
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
        <span className="text-[10px] tracking-luxe uppercase text-red">{index}</span>
        <span className="text-[10px] tracking-luxe uppercase text-white/40">{caption}</span>
      </div>
      <div className="relative aspect-video w-full overflow-hidden bg-black border border-hairline">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&dnt=1&autopause=0`}
          className="absolute inset-0 w-full h-full"
          frameBorder={0}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </figure>
  );
}

function ContactForm({ t }: { t: ReturnType<typeof getT> }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").slice(0, 100);
    const email = String(fd.get("email") ?? "").slice(0, 200);
    const company = String(fd.get("company") ?? "").slice(0, 150);
    const projectType = String(fd.get("projectType") ?? "").slice(0, 100);
    const message = String(fd.get("message") ?? "").slice(0, 2000);
    const subject = `LA 27 — ${name}${projectType ? ` · ${projectType}` : ""}`;
    const body = `${projectType ? `[${projectType}]\n\n` : ""}${message}\n\n— ${name}\n${email}${company ? `\n${company}` : ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const inputCls =
    "w-full bg-transparent border-b border-hairline focus:border-white outline-none py-3 text-base md:text-lg text-white placeholder:text-white/30 transition-colors";

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 max-w-3xl">
      <input required name="name" placeholder={t.formName} className={inputCls} maxLength={100} />
      <input required type="email" name="email" placeholder={t.formEmail} className={inputCls} maxLength={200} />
      <input name="company" placeholder={t.formCompany} className={`${inputCls} md:col-span-2`} maxLength={150} />
      <select
        required
        name="projectType"
        defaultValue=""
        className={`${inputCls} md:col-span-2 appearance-none cursor-pointer`}
      >
        <option value="" disabled className="bg-black text-white/40">{t.formProjectType}</option>
        <option value={t.projectSpot} className="bg-black text-white">{t.projectSpot}</option>
        <option value={t.projectIdentity} className="bg-black text-white">{t.projectIdentity}</option>
        <option value={t.projectDigital} className="bg-black text-white">{t.projectDigital}</option>
        <option value={t.projectOther} className="bg-black text-white">{t.projectOther}</option>
      </select>
      <textarea
        required
        name="message"
        placeholder={t.formMessage}
        rows={4}
        className={`${inputCls} md:col-span-2 resize-none`}
        maxLength={2000}
      />
      <div className="md:col-span-2 pt-8">
        <button
          type="submit"
          className="group inline-flex items-center gap-4 bg-red hover:bg-white text-white hover:text-black px-8 py-4 transition-colors duration-300"
        >
          <span className="text-xl md:text-2xl font-medium tracking-tight">
            {sent ? "✓" : t.formSend}
          </span>
          <span className="text-xl md:text-2xl">→</span>
        </button>
      </div>
    </form>
  );
}

function getT(lang: Lang) {
  return translations[lang];
}

function Index() {
  const [lang, setLang] = useState<Lang>("es");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-5 md:py-6 flex items-center justify-between bg-black/60 backdrop-blur-sm">
        <a href="#top" className="text-[11px] tracking-luxe uppercase text-white">
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

        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-6">
            <span className="text-[11px] md:text-xs tracking-luxe uppercase text-white/60 max-w-xs">
              {t.heroTag}
            </span>
            <span className="text-[10px] tracking-luxe uppercase text-white/30">↓ Scroll</span>
          </div>
          <div className="text-[11px] md:text-xs tracking-luxe uppercase text-white/70 border-t border-hairline pt-4">
            {t.heroProof}
          </div>
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

      {/* Trust / Credibility */}
      <section className="px-5 md:px-10 py-20 md:py-28 border-t border-hairline">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {[
            { t: t.trust1Title, b: t.trust1Body, n: "01" },
            { t: t.trust2Title, b: t.trust2Body, n: "02" },
            { t: t.trust3Title, b: t.trust3Body, n: "03" },
          ].map((item) => (
            <div key={item.n} className="border-t border-hairline pt-6">
              <div className="text-[10px] tracking-luxe uppercase text-red mb-6">{item.n}</div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tightest leading-tight text-white mb-3">
                {item.t}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">{item.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="px-5 md:px-10">
        <div className="h-px bg-white/20" />
      </div>

      {/* Founder */}
      <section className="px-5 md:px-10 py-20 md:py-32">
        <div className="flex items-center justify-between mb-10 md:mb-16">
          <span className="text-[10px] tracking-luxe uppercase text-red">{t.studioKicker}</span>
          <span className="text-[10px] tracking-luxe uppercase text-white/40">003</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-5">
            <div className="relative aspect-square w-full overflow-hidden bg-black border border-hairline grayscale">
              <img
                src={timHelmes}
                alt="Tim Helmes — Founder & Music Director"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7 md:pt-4">
            <h2 className="text-5xl md:text-7xl font-black tracking-tightest leading-[0.9] text-white mb-8">
              {t.studioTitle}<span className="text-red">.</span>
            </h2>
            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl mb-10">
              {t.bio}
            </p>
            <div className="border-t border-hairline pt-6">
              <div className="text-xl md:text-2xl font-medium text-white tracking-tight">
                Tim Helmes
              </div>
              <div className="text-[10px] tracking-luxe uppercase text-white/40 mt-2">
                {t.role}
              </div>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-3 mt-6 border-b border-white/60 hover:border-red pb-1 transition-colors"
              >
                <span className="text-sm tracking-luxe uppercase text-white group-hover:text-red transition-colors">
                  {t.linkedin}
                </span>
                <span className="text-sm text-red">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-5 md:px-10 py-24 md:py-40 border-t border-hairline">
        <h2 className="text-6xl md:text-[10rem] font-black tracking-tightest leading-[0.85] text-white mb-12 md:mb-16">
          {t.contactTitle}
          <br />
          <span className="text-red">{t.contactAccent}</span>
        </h2>

        <ContactForm t={t} />

        <div className="mt-16 border-t border-hairline pt-8 flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
          <span className="text-[10px] tracking-luxe uppercase text-white/40">{t.formOr}</span>
          <a
            href={`mailto:${EMAIL}?subject=LA%2027%20Productions%20%E2%80%94%20Inquiry`}
            className="text-base md:text-lg text-white hover:text-red transition-colors tracking-tight"
          >
            {EMAIL}
          </a>
          <span className="text-[10px] tracking-luxe uppercase text-red md:ml-auto">● {t.replyTime}</span>
        </div>
      </section>

      <footer className="px-5 md:px-10 py-6 border-t border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[10px] tracking-luxe uppercase text-white/40">
        <span>© LA 27 Productions</span>
        <span>{t.footer}</span>
        <span>All Rights Reserved</span>
      </footer>
    </div>
  );
}
