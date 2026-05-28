import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  useEffect(() => {
    const s1 = document.createElement("script");
    s1.src = "/i18n.js";
    s1.async = false;
    document.body.appendChild(s1);
    const s2 = document.createElement("script");
    s2.src = "/script.js";
    s2.async = false;
    s1.onload = () => document.body.appendChild(s2);
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  return (
    <>

  {/* =========== LANGUAGE OVERLAY (first visit) =========== */}
  <div
    className="lang-overlay"
    id="lang-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="lang-overlay-title"
  >
    <div className="lang-overlay-inner">
      <div className="lang-overlay-brand">
        <span className="dot" />
        <span>LA 27 PRODUCTIONS</span>
      </div>
      <div className="lang-overlay-titles">
        <div className="lang-overlay-line" id="lang-overlay-title">
          Selecciona idioma.
        </div>
        <div className="lang-overlay-line">Select language.</div>
        <div className="lang-overlay-line">Sprache wählen.</div>
        <div className="lang-overlay-line">Choisir la langue.</div>
        <div className="lang-overlay-line">Selecione o idioma.</div>
      </div>
      <ul className="lang-overlay-list">
        <li>
          <a href="#" data-lang="es" data-cursor="hover">
            <span className="code">ES</span>
            <span className="name">Español</span>
            <span className="arrow">→</span>
          </a>
        </li>
        <li>
          <a href="#" data-lang="en" data-cursor="hover">
            <span className="code">EN</span>
            <span className="name">English</span>
            <span className="arrow">→</span>
          </a>
        </li>
        <li>
          <a href="#" data-lang="de" data-cursor="hover">
            <span className="code">DE</span>
            <span className="name">Deutsch</span>
            <span className="arrow">→</span>
          </a>
        </li>
        <li>
          <a href="#" data-lang="fr" data-cursor="hover">
            <span className="code">FR</span>
            <span className="name">Français</span>
            <span className="arrow">→</span>
          </a>
        </li>
        <li>
          <a href="#" data-lang="pt" data-cursor="hover">
            <span className="code">PT</span>
            <span className="name">Português</span>
            <span className="arrow">→</span>
          </a>
        </li>
      </ul>
      <div className="lang-overlay-foot">
        <span>Barcelona — ES</span>
        <span>© LA 27</span>
      </div>
    </div>
  </div>
  <div className="cursor" aria-hidden="true">
    <span className="cursor-label">Play</span>
  </div>
  <div className="scroll-progress" aria-hidden="true" />
  <header className="nav">
    <a href="#top" className="nav-brand" data-cursor="hover">
      <strong>LA 27</strong> &nbsp;Productions
    </a>
    <nav>
      <ul className="nav-links">
        <li>
          <a href="#work" data-cursor="hover" data-i18n="nav.work">
            Trabajo
          </a>
        </li>
        <li>
          <a href="#why" data-cursor="hover" data-i18n="nav.studio">
            Estudio
          </a>
        </li>
        <li>
          <a href="#founder" data-cursor="hover" data-i18n="nav.founder">
            Founder
          </a>
        </li>
        <li>
          <a href="#contact" data-cursor="hover" data-i18n="nav.contact">
            Contacto
          </a>
        </li>
      </ul>
    </nav>
    <div className="nav-right">
      <div className="lang-switch" data-cursor="hover">
        <button
          className="lang-switch-btn"
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="lang-switch-current">ES</span>
          <svg width={8} height={8} viewBox="0 0 8 8" fill="none">
            <path
              d="M1.5 3l2.5 2.5L6.5 3"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
            />
          </svg>
        </button>
        <ul className="lang-switch-menu" role="menu">
          <li>
            <a href="#" data-lang="es" data-cursor="hover">
              <span className="code">ES</span> Español
            </a>
          </li>
          <li>
            <a href="#" data-lang="en" data-cursor="hover">
              <span className="code">EN</span> English
            </a>
          </li>
          <li>
            <a href="#" data-lang="de" data-cursor="hover">
              <span className="code">DE</span> Deutsch
            </a>
          </li>
          <li>
            <a href="#" data-lang="fr" data-cursor="hover">
              <span className="code">FR</span> Français
            </a>
          </li>
          <li>
            <a href="#" data-lang="pt" data-cursor="hover">
              <span className="code">PT</span> Português
            </a>
          </li>
        </ul>
      </div>
      <div className="nav-meta">
        <span className="dot" />
        <span data-bcn-time="">—:— BCN</span>
      </div>
    </div>
  </header>
  <aside className="section-index" aria-hidden="true">
    <a href="#hero" data-cursor="hover">
      <span className="num">001</span>
      <span className="label" data-i18n="index.intro">
        Intro
      </span>
    </a>
    <a href="#work" data-cursor="hover">
      <span className="num">002</span>
      <span className="label" data-i18n="index.reels">
        Reels
      </span>
    </a>
    <a href="#why" data-cursor="hover">
      <span className="num">003</span>
      <span className="label" data-i18n="index.studio">
        Estudio
      </span>
    </a>
    <a href="#founder" data-cursor="hover">
      <span className="num">004</span>
      <span className="label" data-i18n="index.founder">
        Founder
      </span>
    </a>
    <a href="#contact" data-cursor="hover">
      <span className="num">005</span>
      <span className="label" data-i18n="index.contact">
        Contacto
      </span>
    </a>
  </aside>
  <main id="top">
    {/* =========== HERO =========== */}
    <section
      id="hero"
      className="hero"
      data-section=""
      data-screen-label="Hero"
    >
      <div className="hero-meta">
        <span data-i18n="hero.meta">001 / Intro</span>
        <span data-i18n="hero.location">Barcelona — ES</span>
      </div>
      <h1 className="hero-title" data-i18n-html="hero.title">
        <span className="word">
          <span>Sonido</span>
        </span>
        <span className="word">
          <span>de</span>
        </span>
        <span className="word">
          <span className="it">Lujo.</span>
        </span>
        <br />
        <span className="word">
          <span>Audio</span>
        </span>
        <span className="word">
          <span>a</span>
        </span>
        <span className="word">
          <span className="it">medida.</span>
        </span>
      </h1>
      <div className="waveform" aria-hidden="true" />
      <div className="hero-sub">
        <p className="hero-sub-left" data-i18n="hero.sub">
          Música instrumental exclusiva para marcas, agencias y film. Compuesta
          desde cero — sin librerías, sin royalties.
        </p>
        <a className="scroll-cue" href="#work" data-cursor="hover">
          <span data-i18n="hero.scroll">Scroll</span>
          <span className="arrow">
            <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
              <path
                d="M5 1v8M2 6l3 3 3-3"
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
    {/* =========== TRUST STRIP =========== */}
    <section className="trust" aria-label="Trust">
      <div className="trust-inner">
        <span>
          <em style={{ fontStyle: "italic" }} data-i18n="trust.text">
            Confiado por agencias y marcas en 15+ países
          </em>
          <i className="sep" /> Ferrari
          <i className="sep" /> Dior
          <i className="sep" /> Loewe
          <i className="sep" /> Estrella Damm
          <i className="sep" /> Mango
          <i className="sep" /> Volkswagen
          <i className="sep" /> Banco Sabadell
          <i className="sep" />
        </span>
        <span aria-hidden="true">
          <em style={{ fontStyle: "italic" }} data-i18n="trust.text">
            Confiado por agencias y marcas en 15+ países
          </em>
          <i className="sep" /> Ferrari
          <i className="sep" /> Dior
          <i className="sep" /> Loewe
          <i className="sep" /> Estrella Damm
          <i className="sep" /> Mango
          <i className="sep" /> Volkswagen
          <i className="sep" /> Banco Sabadell
          <i className="sep" />
        </span>
      </div>
    </section>
    {/* =========== WORK =========== */}
    <section
      id="work"
      className="work"
      data-section=""
      data-screen-label="Trabajo Seleccionado"
    >
      <div className="section-header reveal">
        <div className="section-eyebrow">
          <span className="num">002</span>
          <span data-i18n="work.eyebrow">Reels</span>
        </div>
        <h2 className="section-title" data-i18n-html="work.title">
          Trabajo
          <br />
          <span className="it">Seleccionado.</span>
        </h2>
      </div>
      <div className="work-grid">
        <article className="work-item reveal">
          <div className="work-media">
            <div className="video-frame">
              <iframe
                src="https://player.vimeo.com/video/1192292542?title=0&byline=0&portrait=0&badge=0&color=ffffff&dnt=1"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen={true}
                loading="lazy"
                title="Ferrari — Roma Spider"
              />
            </div>
          </div>
          <div className="work-info">
            <div className="work-index">01 / Ferrari</div>
            <h3 className="work-title" data-i18n-html="work.ferrari.title">
              Roma <span className="it">Spider</span>
            </h3>
            <div className="work-meta">
              <span data-i18n="work.ferrari.meta1">Automotriz</span>
              <span className="sep" />
              <span data-i18n="work.ferrari.meta2">Rock Score</span>
              <span className="sep" />
              <span>2025</span>
            </div>
            <p className="work-desc" data-i18n="work.ferrari.desc">
              Rock Texas-style, crudo y potente. Guitarras eléctricas, batería
              en vivo y un bajo que empuja el corte como un motor en sexta.
              Compuesto y grabado íntegramente en el estudio.
            </p>
          </div>
        </article>
        <article className="work-item reveal">
          <div className="work-media">
            <div className="video-frame">
              <iframe
                src="https://player.vimeo.com/video/1192292538?title=0&byline=0&portrait=0&badge=0&color=ffffff&dnt=1"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen={true}
                loading="lazy"
                title="Dior — Maison Perfume"
              />
            </div>
          </div>
          <div className="work-info">
            <div className="work-index">02 / Dior</div>
            <h3 className="work-title" data-i18n-html="work.dior.title">
              Maison <span className="it">Perfume</span>
            </h3>
            <div className="work-meta">
              <span data-i18n="work.dior.meta1">Perfumería</span>
              <span className="sep" />
              <span data-i18n="work.dior.meta2">Voz &amp; Guitarra</span>
              <span className="sep" />
              <span>2026</span>
            </div>
            <p className="work-desc" data-i18n="work.dior.desc">
              Una voz femenina suspendida sobre una guitarra de paraíso. Aire,
              sensualidad y un decorado sonoro tan delicado como el frasco —
              escrito sólo para esta campaña.
            </p>
          </div>
        </article>
      </div>
    </section>
    {/* =========== WHY / STUDIO (no photo) =========== */}
    <section
      id="why"
      className="why"
      data-section=""
      data-screen-label="El Estudio"
    >
      <div className="section-header reveal">
        <div className="section-eyebrow">
          <span className="num">003</span>
          <span data-i18n="why.eyebrow">El Estudio</span>
        </div>
        <h2 className="section-title" data-i18n-html="why.title">
          Todo bajo
          <br />
          <span className="it">un mismo techo.</span>
        </h2>
      </div>
      <div className="why-lede reveal" data-i18n-html="why.lede">
        <p>
          Estudio propio en Barcelona — <em>ciudad del arte y la música</em> —
          con la tecnología y la calidad más avanzadas. Producimos cada pieza
          enteramente in-house, desde el primer sonido hasta el master final,
          con master de televisión incluido o el formato que prefiera el
          cliente. <span className="hl">Servicio 100%.</span>
        </p>
      </div>
      <div className="pillars-grid">
        <div className="pillar-card reveal">
          <div className="pillar-num">01</div>
          <h3 className="pillar-title" data-i18n-html="pillar.01.title">
            Estudio en <span className="it">Barcelona.</span>
          </h3>
          <p className="pillar-body" data-i18n="pillar.01.body">
            Instalaciones tratadas acústicamente, monitoreo de referencia y una
            colección de instrumentos físicos lista para grabar.
          </p>
        </div>
        <div className="pillar-card reveal">
          <div className="pillar-num">02</div>
          <h3 className="pillar-title" data-i18n-html="pillar.02.title">
            100% <span className="it">Exclusivo.</span>
          </h3>
          <p className="pillar-body" data-i18n="pillar.02.body">
            Cada pieza compuesta desde cero para tu proyecto. Sin librerías, sin
            stock, nunca reutilizada.
          </p>
        </div>
        <div className="pillar-card reveal">
          <div className="pillar-num">03</div>
          <h3 className="pillar-title" data-i18n-html="pillar.03.title">
            Sin <span className="it">Royalties.</span>
          </h3>
          <p className="pillar-body" data-i18n="pillar.03.body">
            La música es tuya. Para siempre. Sin licencias, sin renovaciones,
            sin gestores intermediarios.
          </p>
        </div>
      </div>
    </section>
    {/* =========== FOUNDER =========== */}
    <section
      id="founder"
      className="studio"
      data-section=""
      data-screen-label="Founder · Tim Helmes"
    >
      <div className="section-header reveal">
        <div className="section-eyebrow">
          <span className="num">004</span>
          <span data-i18n="founder.eyebrow">Quiénes somos</span>
        </div>
        <h2 className="section-title" data-i18n-html="founder.title">
          El <span className="it">Founder.</span>
        </h2>
      </div>
      <div className="studio-grid">
        <div className="studio-portrait reveal">
          <img
            src="assets/tim-helmes.png"
            alt="Tim Helmes — Founder & Music Director, LA 27 Productions"
          />
        </div>
        <div className="studio-text reveal">
          <p className="studio-quote" data-i18n-html="founder.quote">
            "Cada marca <span className="it">merece</span> su propio sonido. No
            una librería compartida con cien anuncios más."
          </p>
          <p className="studio-bio" data-i18n="founder.bio">
            Tim Helmes es compositor y director musical con sede en Barcelona.
            LA 27 PRODUCTIONS nació de una convicción simple: música
            instrumental 100% exclusiva, compuesta desde cero, sin librerías,
            sin royalties.
          </p>
          <div className="studio-signature">
            <div>
              <div className="name">Tim Helmes</div>
              <div className="role" data-i18n="founder.role">
                Founder &amp; Music Director — LA 27
              </div>
            </div>
            <a
              href="https://www.linkedin.com/in/tim-helmes-boschi-9b9244246/"
              target="_blank"
              rel="noopener"
              className="linkedin"
              data-cursor="hover"
            >
              LinkedIn
              <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 8L8 2M8 2H3M8 2v5"
                  stroke="currentColor"
                  strokeWidth={1}
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
    {/* =========== CONTACT =========== */}
    <section
      id="contact"
      className="contact"
      data-section=""
      data-screen-label="Contacto"
    >
      <div className="contact-grid">
        <div className="reveal">
          <h2 className="contact-title" data-i18n-html="contact.title">
            Asegura tu
            <br />
            <span className="it">sonido.</span>
          </h2>
          <p className="contact-aside" data-i18n="contact.aside">
            Cuéntanos en qué estás trabajando. Te respondemos con un primer
            enfoque sonoro y propuesta de tiempos.
          </p>
          <div className="contact-direct">
            <div className="lab" data-i18n="contact.direct">
              O escríbenos directamente
            </div>
            <a
              className="mail"
              href="mailto:la27productions@gmail.com"
              data-cursor="hover"
            >
              la27productions@gmail.com
            </a>
            <div className="contact-status">
              <span className="dot" />
              <span data-i18n="contact.status">Respuesta en menos de 24h</span>
            </div>
          </div>
        </div>
        <form className="form reveal" autoComplete="off">
          <div className="field">
            <label htmlFor="f-name" data-i18n="form.name">
              Nombre
            </label>
            <input id="f-name" type="text" />
          </div>
          <div className="field">
            <label htmlFor="f-email" data-i18n="form.email">
              Email
            </label>
            <input id="f-email" type="email" />
          </div>
          <div className="field">
            <label htmlFor="f-company" data-i18n="form.company">
              Empresa
            </label>
            <input id="f-company" type="text" />
          </div>
          <div className="field is-filled">
            <label htmlFor="f-type" data-i18n="form.type">
              Tipo de proyecto
            </label>
            <select id="f-type">
              <option value="" data-i18n="form.type.placeholder">
                — Elegir —
              </option>
              <option data-i18n="form.type.opt1">Spot / Campaña</option>
              <option data-i18n="form.type.opt2">Film / Cortometraje</option>
              <option data-i18n="form.type.opt3">Desfile / Evento</option>
              <option data-i18n="form.type.opt4">Sound Branding</option>
              <option data-i18n="form.type.opt5">Otro</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-message" data-i18n="form.message">
              Mensaje
            </label>
            <textarea id="f-message" rows={2} defaultValue={""} />
          </div>
          <div className="form-submit">
            <button type="submit" className="btn" data-cursor="hover">
              <span data-i18n="form.submit">Enviar</span>
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="form-success" data-i18n="form.success">
            Recibido. Tim responde en menos de 24h.
          </p>
        </form>
      </div>
    </section>
  </main>
  <footer>
    <div data-i18n="footer.copy">© LA 27 Productions · Barcelona</div>
    <div className="right">
      <span data-i18n="footer.mastered">Mastered in Barcelona</span>
      <span>v2026</span>
    </div>
  </footer>
</>
