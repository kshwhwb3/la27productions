// src/routes/index.tsx
// LA 27 Productions — Full page component for TanStack Start
// Drop this file directly into src/routes/index.tsx — no other changes needed.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── i18n dictionary ────────────────────────────────────────────────────────

type LangCode = "es" | "en" | "de" | "fr" | "pt";

const T: Record<LangCode, Record<string, string>> = {
  es: {
    "lang.label": "Español", "lang.code": "ES",
    "nav.work": "Trabajo", "nav.studio": "Estudio", "nav.founder": "Founder", "nav.contact": "Contacto",
    "hero.meta": "001 / Intro", "hero.location": "Barcelona — ES",
    "hero.title": `<span class="word"><span>Sonido</span></span> <span class="word"><span>de</span></span> <span class="word"><span class="it">Lujo.</span></span><br /><span class="word"><span>Audio</span></span> <span class="word"><span>a</span></span> <span class="word"><span class="it">medida.</span></span>`,
    "hero.sub": "Música instrumental exclusiva para marcas, agencias y film. Compuesta desde cero — sin librerías, sin royalties.",
    "hero.scroll": "Scroll",
    "trust.text": "Confiado por agencias y marcas en 15+ países",
    "work.eyebrow": "Reels",
    "work.title": `Trabajo<br /><span class="it">Seleccionado.</span>`,
    "work.ferrari.title": `Roma <span class="it">Spider</span>`,
    "work.ferrari.meta1": "Automotriz", "work.ferrari.meta2": "Rock Score",
    "work.ferrari.desc": "Rock Texas-style, crudo y potente. Guitarras eléctricas, batería en vivo y un bajo que empuja el corte como un motor en sexta. Compuesto y grabado íntegramente en el estudio.",
    "work.dior.title": `Maison <span class="it">Perfume</span>`,
    "work.dior.meta1": "Perfumería", "work.dior.meta2": "Voz & Guitarra",
    "work.dior.desc": "Una voz femenina suspendida sobre una guitarra de paraíso. Aire, sensualidad y un decorado sonoro tan delicado como el frasco — escrito sólo para esta campaña.",
    "why.eyebrow": "El Estudio",
    "why.title": `Todo bajo<br /><span class="it">un mismo techo.</span>`,
    "why.lede": `Estudio propio en Barcelona — <em>ciudad del arte y la música</em> — con la tecnología y la calidad más avanzadas. Producimos cada pieza enteramente in-house, desde el primer sonido hasta el master final, con master de televisión incluido o el formato que prefiera el cliente. <span class="hl">Servicio 100%.</span>`,
    "pillar.01.title": `Estudio en <span class="it">Barcelona.</span>`, "pillar.01.body": "Instalaciones tratadas acústicamente, monitoreo de referencia y una colección de instrumentos físicos lista para grabar.",
    "pillar.02.title": `100% <span class="it">Exclusivo.</span>`, "pillar.02.body": "Cada pieza compuesta desde cero para tu proyecto. Sin librerías, sin stock, nunca reutilizada.",
    "pillar.03.title": `Sin <span class="it">Royalties.</span>`, "pillar.03.body": "La música es tuya. Para siempre. Sin licencias, sin renovaciones, sin gestores intermediarios.",
    "founder.eyebrow": "Quiénes somos",
    "founder.title": `El <span class="it">Founder.</span>`,
    "founder.quote": `"Cada marca <span class="it">merece</span> su propio sonido. No una librería compartida con cien anuncios más."`,
    "founder.bio": "Tim Helmes es compositor y director musical con sede en Barcelona. LA 27 PRODUCTIONS nació de una convicción simple: música instrumental 100% exclusiva, compuesta desde cero, sin librerías, sin royalties.",
    "founder.role": "Founder & Music Director — LA 27",
    "contact.title": `Asegura tu<br /><span class="it">sonido.</span>`,
    "contact.aside": "Cuéntanos en qué estás trabajando. Te respondemos con un primer enfoque sonoro y propuesta de tiempos.",
    "contact.direct": "O escríbenos directamente", "contact.status": "Respuesta en menos de 24h",
    "form.name": "Nombre", "form.email": "Email", "form.company": "Empresa", "form.type": "Tipo de proyecto", "form.message": "Mensaje",
    "form.type.placeholder": "— Elegir —", "form.type.opt1": "Spot / Campaña", "form.type.opt2": "Film / Cortometraje", "form.type.opt3": "Desfile / Evento", "form.type.opt4": "Sound Branding", "form.type.opt5": "Otro",
    "form.submit": "Enviar", "form.success": "Recibido. Tim responde en menos de 24h.",
    "index.intro": "Intro", "index.reels": "Reels", "index.studio": "Estudio", "index.founder": "Founder", "index.contact": "Contacto",
    "footer.copy": "© LA 27 Productions · Barcelona", "footer.mastered": "Mastered in Barcelona",
  },
  en: {
    "lang.label": "English", "lang.code": "EN",
    "nav.work": "Work", "nav.studio": "Studio", "nav.founder": "Founder", "nav.contact": "Contact",
    "hero.meta": "001 / Intro", "hero.location": "Barcelona — ES",
    "hero.title": `<span class="word"><span>Luxury</span></span> <span class="word"><span class="it">Sound.</span></span><br /><span class="word"><span>Tailored</span></span> <span class="word"><span class="it">Audio.</span></span>`,
    "hero.sub": "Exclusive instrumental music for brands, agencies and film. Composed from scratch — no libraries, no royalties.",
    "hero.scroll": "Scroll",
    "trust.text": "Trusted by agencies and brands across 15+ countries",
    "work.eyebrow": "Reels",
    "work.title": `Selected<br /><span class="it">Work.</span>`,
    "work.ferrari.title": `Roma <span class="it">Spider</span>`,
    "work.ferrari.meta1": "Automotive", "work.ferrari.meta2": "Rock Score",
    "work.ferrari.desc": "Raw, powerful Texas-style rock. Electric guitars, live drums and a bass line that pushes the cut like a sixth-gear engine. Composed and recorded entirely in-house.",
    "work.dior.title": `Maison <span class="it">Perfume</span>`,
    "work.dior.meta1": "Perfumery", "work.dior.meta2": "Voice & Guitar",
    "work.dior.desc": "A female voice suspended over a paradisiacal guitar. Air, sensuality and a sonic décor as delicate as the bottle — written for this campaign alone.",
    "why.eyebrow": "The Studio",
    "why.title": `Everything under<br /><span class="it">one roof.</span>`,
    "why.lede": `In-house studio in Barcelona — <em>city of art and music</em> — with the most advanced technology and quality. We produce every piece entirely in-house, from the first sound to the final master, with broadcast master included or whatever format the client prefers. <span class="hl">100% service.</span>`,
    "pillar.01.title": `Studio in <span class="it">Barcelona.</span>`, "pillar.01.body": "Acoustically treated rooms, reference monitoring and a curated collection of physical instruments ready to record.",
    "pillar.02.title": `100% <span class="it">Exclusive.</span>`, "pillar.02.body": "Each piece composed from scratch for your project. No libraries, no stock, never reused.",
    "pillar.03.title": `No <span class="it">Royalties.</span>`, "pillar.03.body": "The music is yours. Forever. No licenses, no renewals, no middlemen.",
    "founder.eyebrow": "Who we are",
    "founder.title": `The <span class="it">Founder.</span>`,
    "founder.quote": `"Every brand <span class="it">deserves</span> its own sound. Not a library shared with a hundred other ads."`,
    "founder.bio": "Tim Helmes is a composer and music director based in Barcelona. LA 27 PRODUCTIONS was born from a simple conviction: 100% exclusive instrumental music, composed from scratch, with no libraries and no royalties.",
    "founder.role": "Founder & Music Director — LA 27",
    "contact.title": `Lock in your<br /><span class="it">sound.</span>`,
    "contact.aside": "Tell us what you're working on. We'll come back with an initial sonic approach and a timing proposal.",
    "contact.direct": "Or write to us directly", "contact.status": "Reply within 24h",
    "form.name": "Name", "form.email": "Email", "form.company": "Company", "form.type": "Project type", "form.message": "Message",
    "form.type.placeholder": "— Select —", "form.type.opt1": "Spot / Campaign", "form.type.opt2": "Film / Short Film", "form.type.opt3": "Show / Event", "form.type.opt4": "Sound Branding", "form.type.opt5": "Other",
    "form.submit": "Send", "form.success": "Received. Tim replies within 24h.",
    "index.intro": "Intro", "index.reels": "Reels", "index.studio": "Studio", "index.founder": "Founder", "index.contact": "Contact",
    "footer.copy": "© LA 27 Productions · Barcelona", "footer.mastered": "Mastered in Barcelona",
  },
  de: {
    "lang.label": "Deutsch", "lang.code": "DE",
    "nav.work": "Arbeiten", "nav.studio": "Studio", "nav.founder": "Founder", "nav.contact": "Kontakt",
    "hero.meta": "001 / Intro", "hero.location": "Barcelona — ES",
    "hero.title": `<span class="word"><span>Luxuriöser</span></span> <span class="word"><span class="it">Klang.</span></span><br /><span class="word"><span>Maßgeschneidertes</span></span> <span class="word"><span class="it">Audio.</span></span>`,
    "hero.sub": "Exklusive Instrumentalmusik für Marken, Agenturen und Film. Von Grund auf komponiert — keine Bibliotheken, keine Lizenzgebühren.",
    "hero.scroll": "Scroll",
    "trust.text": "Vertraut von Agenturen und Marken in 15+ Ländern",
    "work.eyebrow": "Reels",
    "work.title": `Ausgewählte<br /><span class="it">Arbeiten.</span>`,
    "work.ferrari.title": `Roma <span class="it">Spider</span>`,
    "work.ferrari.meta1": "Automotive", "work.ferrari.meta2": "Rock-Score",
    "work.ferrari.desc": "Roher, kraftvoller Rock im Texas-Stil. E-Gitarren, Live-Schlagzeug und ein Bass, der den Schnitt vorantreibt wie ein Motor im sechsten Gang. Vollständig im Studio komponiert und aufgenommen.",
    "work.dior.title": `Maison <span class="it">Perfume</span>`,
    "work.dior.meta1": "Parfümerie", "work.dior.meta2": "Stimme & Gitarre",
    "work.dior.desc": "Eine weibliche Stimme schwebt über einer paradiesischen Gitarre. Luft, Sinnlichkeit und ein Klangdekor so zart wie der Flakon — eigens für diese Kampagne geschrieben.",
    "why.eyebrow": "Das Studio",
    "why.title": `Alles unter<br /><span class="it">einem Dach.</span>`,
    "why.lede": `Eigenes Studio in Barcelona — <em>Stadt der Kunst und Musik</em> — mit der modernsten Technologie und Qualität. Wir produzieren jedes Stück vollständig in-house, vom ersten Klang bis zum finalen Master, inklusive Broadcast-Master oder dem vom Kunden gewünschten Format. <span class="hl">100% Service.</span>`,
    "pillar.01.title": `Studio in <span class="it">Barcelona.</span>`, "pillar.01.body": "Akustisch behandelte Räume, Referenz-Monitoring und eine kuratierte Sammlung physischer Instrumente bereit zur Aufnahme.",
    "pillar.02.title": `100% <span class="it">Exklusiv.</span>`, "pillar.02.body": "Jedes Stück von Grund auf für dein Projekt komponiert. Keine Bibliotheken, kein Stock, niemals wiederverwendet.",
    "pillar.03.title": `Keine <span class="it">Lizenzgebühren.</span>`, "pillar.03.body": "Die Musik gehört dir. Für immer. Keine Lizenzen, keine Verlängerungen, keine Vermittler.",
    "founder.eyebrow": "Wer wir sind",
    "founder.title": `Der <span class="it">Founder.</span>`,
    "founder.quote": `„Jede Marke <span class="it">verdient</span> ihren eigenen Klang. Keine Bibliothek, geteilt mit hundert anderen Werbespots."`,
    "founder.bio": "Tim Helmes ist Komponist und musikalischer Leiter mit Sitz in Barcelona. LA 27 PRODUCTIONS entstand aus einer einfachen Überzeugung: 100% exklusive Instrumentalmusik, von Grund auf komponiert, ohne Bibliotheken und ohne Lizenzgebühren.",
    "founder.role": "Founder & Music Director — LA 27",
    "contact.title": `Sichere deinen<br /><span class="it">Klang.</span>`,
    "contact.aside": "Erzähl uns, woran du arbeitest. Wir antworten mit einem ersten klanglichen Konzept und einem Zeitplan.",
    "contact.direct": "Oder schreib uns direkt", "contact.status": "Antwort innerhalb von 24 Std.",
    "form.name": "Name", "form.email": "E-Mail", "form.company": "Firma", "form.type": "Projekttyp", "form.message": "Nachricht",
    "form.type.placeholder": "— Auswählen —", "form.type.opt1": "Spot / Kampagne", "form.type.opt2": "Film / Kurzfilm", "form.type.opt3": "Show / Event", "form.type.opt4": "Sound Branding", "form.type.opt5": "Andere",
    "form.submit": "Senden", "form.success": "Erhalten. Tim antwortet innerhalb von 24 Stunden.",
    "index.intro": "Intro", "index.reels": "Reels", "index.studio": "Studio", "index.founder": "Founder", "index.contact": "Kontakt",
    "footer.copy": "© LA 27 Productions · Barcelona", "footer.mastered": "Mastered in Barcelona",
  },
  fr: {
    "lang.label": "Français", "lang.code": "FR",
    "nav.work": "Travaux", "nav.studio": "Studio", "nav.founder": "Founder", "nav.contact": "Contact",
    "hero.meta": "001 / Intro", "hero.location": "Barcelona — ES",
    "hero.title": `<span class="word"><span>Son</span></span> <span class="word"><span>de</span></span> <span class="word"><span class="it">Luxe.</span></span><br /><span class="word"><span>Audio</span></span> <span class="word"><span>sur</span></span> <span class="word"><span class="it">mesure.</span></span>`,
    "hero.sub": "Musique instrumentale exclusive pour marques, agences et films. Composée à partir de zéro — sans bibliothèques, sans droits d'auteur.",
    "hero.scroll": "Scroll",
    "trust.text": "La confiance d'agences et de marques dans plus de 15 pays",
    "work.eyebrow": "Reels",
    "work.title": `Travaux<br /><span class="it">Sélectionnés.</span>`,
    "work.ferrari.title": `Roma <span class="it">Spider</span>`,
    "work.ferrari.meta1": "Automobile", "work.ferrari.meta2": "Score Rock",
    "work.ferrari.desc": "Rock texan brut et puissant. Guitares électriques, batterie live et une basse qui pousse le montage comme un moteur en sixième. Composé et enregistré entièrement en studio.",
    "work.dior.title": `Maison <span class="it">Perfume</span>`,
    "work.dior.meta1": "Parfumerie", "work.dior.meta2": "Voix & Guitare",
    "work.dior.desc": "Une voix féminine suspendue sur une guitare paradisiaque. Air, sensualité et un décor sonore aussi délicat que le flacon — écrit uniquement pour cette campagne.",
    "why.eyebrow": "Le Studio",
    "why.title": `Tout sous<br /><span class="it">un même toit.</span>`,
    "why.lede": `Studio propre à Barcelone — <em>ville de l'art et de la musique</em> — avec la technologie et la qualité les plus avancées. Nous produisons chaque pièce entièrement en interne, du premier son au master final, master broadcast inclus ou le format préféré du client. <span class="hl">Service 100%.</span>`,
    "pillar.01.title": `Studio à <span class="it">Barcelone.</span>`, "pillar.01.body": "Salles traitées acoustiquement, monitoring de référence et une collection d'instruments physiques prêts à enregistrer.",
    "pillar.02.title": `100% <span class="it">Exclusif.</span>`, "pillar.02.body": "Chaque pièce composée à partir de zéro pour votre projet. Sans bibliothèques, sans stock, jamais réutilisée.",
    "pillar.03.title": `Sans <span class="it">Droits.</span>`, "pillar.03.body": "La musique est à vous. Pour toujours. Sans licences, sans renouvellements, sans intermédiaires.",
    "founder.eyebrow": "Qui nous sommes",
    "founder.title": `Le <span class="it">Founder.</span>`,
    "founder.quote": `« Chaque marque <span class="it">mérite</span> son propre son. Pas une bibliothèque partagée avec cent autres publicités. »`,
    "founder.bio": "Tim Helmes est compositeur et directeur musical basé à Barcelone. LA 27 PRODUCTIONS est né d'une conviction simple : une musique instrumentale 100% exclusive, composée à partir de zéro, sans bibliothèques et sans droits d'auteur.",
    "founder.role": "Founder & Music Director — LA 27",
    "contact.title": `Réservez votre<br /><span class="it">son.</span>`,
    "contact.aside": "Dites-nous sur quoi vous travaillez. Nous reviendrons avec une première approche sonore et une proposition de calendrier.",
    "contact.direct": "Ou écrivez-nous directement", "contact.status": "Réponse sous 24h",
    "form.name": "Nom", "form.email": "Email", "form.company": "Entreprise", "form.type": "Type de projet", "form.message": "Message",
    "form.type.placeholder": "— Choisir —", "form.type.opt1": "Spot / Campagne", "form.type.opt2": "Film / Court métrage", "form.type.opt3": "Défilé / Événement", "form.type.opt4": "Sound Branding", "form.type.opt5": "Autre",
    "form.submit": "Envoyer", "form.success": "Reçu. Tim répond sous 24 heures.",
    "index.intro": "Intro", "index.reels": "Reels", "index.studio": "Studio", "index.founder": "Founder", "index.contact": "Contact",
    "footer.copy": "© LA 27 Productions · Barcelona", "footer.mastered": "Mastered in Barcelona",
  },
  pt: {
    "lang.label": "Português", "lang.code": "PT",
    "nav.work": "Trabalho", "nav.studio": "Estúdio", "nav.founder": "Founder", "nav.contact": "Contacto",
    "hero.meta": "001 / Intro", "hero.location": "Barcelona — ES",
    "hero.title": `<span class="word"><span>Som</span></span> <span class="word"><span>de</span></span> <span class="word"><span class="it">Luxo.</span></span><br /><span class="word"><span>Áudio</span></span> <span class="word"><span>sob</span></span> <span class="word"><span class="it">medida.</span></span>`,
    "hero.sub": "Música instrumental exclusiva para marcas, agências e cinema. Composta do zero — sem bibliotecas, sem royalties.",
    "hero.scroll": "Scroll",
    "trust.text": "Confiado por agências e marcas em mais de 15 países",
    "work.eyebrow": "Reels",
    "work.title": `Trabalho<br /><span class="it">Selecionado.</span>`,
    "work.ferrari.title": `Roma <span class="it">Spider</span>`,
    "work.ferrari.meta1": "Automotivo", "work.ferrari.meta2": "Rock Score",
    "work.ferrari.desc": "Rock estilo Texas, cru e poderoso. Guitarras elétricas, bateria ao vivo e um baixo que empurra o corte como um motor em sexta. Composto e gravado integralmente em estúdio.",
    "work.dior.title": `Maison <span class="it">Perfume</span>`,
    "work.dior.meta1": "Perfumaria", "work.dior.meta2": "Voz & Guitarra",
    "work.dior.desc": "Uma voz feminina suspensa sobre uma guitarra de paraíso. Ar, sensualidade e um cenário sonoro tão delicado quanto o frasco — escrito apenas para esta campanha.",
    "why.eyebrow": "O Estúdio",
    "why.title": `Tudo sob<br /><span class="it">um mesmo teto.</span>`,
    "why.lede": `Estúdio próprio em Barcelona — <em>cidade da arte e da música</em> — com a tecnologia e a qualidade mais avançadas. Produzimos cada peça inteiramente in-house, desde o primeiro som até ao master final, com master de televisão incluído ou o formato preferido pelo cliente. <span class="hl">Serviço 100%.</span>`,
    "pillar.01.title": `Estúdio em <span class="it">Barcelona.</span>`, "pillar.01.body": "Instalações tratadas acusticamente, monitorização de referência e uma coleção de instrumentos físicos pronta para gravar.",
    "pillar.02.title": `100% <span class="it">Exclusivo.</span>`, "pillar.02.body": "Cada peça composta do zero para o teu projeto. Sem bibliotecas, sem stock, nunca reutilizada.",
    "pillar.03.title": `Sem <span class="it">Royalties.</span>`, "pillar.03.body": "A música é tua. Para sempre. Sem licenças, sem renovações, sem intermediários.",
    "founder.eyebrow": "Quem somos",
    "founder.title": `O <span class="it">Founder.</span>`,
    "founder.quote": `"Cada marca <span class="it">merece</span> o seu próprio som. Não uma biblioteca partilhada com cem outros anúncios."`,
    "founder.bio": "Tim Helmes é compositor e diretor musical sediado em Barcelona. A LA 27 PRODUCTIONS nasceu de uma convicção simples: música instrumental 100% exclusiva, composta do zero, sem bibliotecas e sem royalties.",
    "founder.role": "Founder & Music Director — LA 27",
    "contact.title": `Garante o teu<br /><span class="it">som.</span>`,
    "contact.aside": "Conta-nos no que estás a trabalhar. Respondemos com uma primeira abordagem sonora e proposta de tempos.",
    "contact.direct": "Ou escreve-nos diretamente", "contact.status": "Resposta em menos de 24h",
    "form.name": "Nome", "form.email": "Email", "form.company": "Empresa", "form.type": "Tipo de projeto", "form.message": "Mensagem",
    "form.type.placeholder": "— Escolher —", "form.type.opt1": "Spot / Campanha", "form.type.opt2": "Filme / Curta", "form.type.opt3": "Desfile / Evento", "form.type.opt4": "Sound Branding", "form.type.opt5": "Outro",
    "form.submit": "Enviar", "form.success": "Recebido. O Tim responde em menos de 24h.",
    "index.intro": "Intro", "index.reels": "Reels", "index.studio": "Estúdio", "index.founder": "Founder", "index.contact": "Contacto",
    "footer.copy": "© LA 27 Productions · Barcelona", "footer.mastered": "Mastered in Barcelona",
  },
};

const LANG_STORAGE_KEY = "la27.lang";

const getLangFromStorage = (): LangCode | null => {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    if (v && v in T) return v as LangCode;
    return null;
  } catch { return null; }
};

const saveLang = (lang: LangCode) => {
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch {}
};

// ─── Waveform bar data (generated once) ────────────────────────────────────

const WAVE_BARS = Array.from({ length: 84 }, (_, i) => {
  const t = i / 84;
  const env = Math.sin(t * Math.PI);
  const noise = 0.4 + 0.6 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6));
  const h = Math.max(6, env * noise * 72);
  return { h, delay: i * 0.04, dur: 1.6 + (i % 5) * 0.2 };
});

// ─── Global styles injected once ───────────────────────────────────────────

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #0a0a0a; --bg-2: #111111;
  --ink: #f5f1ef; --ink-dim: #8a8480; --ink-mute: #4a4644;
  --line: #1f1c1c;
  --accent: oklch(0.58 0.22 25);
  --accent-bright: oklch(0.64 0.25 25);
  --accent-deep: oklch(0.42 0.18 25);
  --font-display: "Instrument Serif","Times New Roman",serif;
  --font-sans: "Space Grotesk",system-ui,sans-serif;
  --font-mono: "JetBrains Mono",ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--ink);font-family:var(--font-sans);font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none;}
body.is-locked{overflow:hidden;height:100vh;}
a,button{cursor:none;}
::selection{background:var(--accent);color:var(--bg);}

/* Cursor */
.la27-cursor{position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;background:var(--ink);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .3s cubic-bezier(.16,1,.3,1),height .3s cubic-bezier(.16,1,.3,1),background .3s ease,mix-blend-mode .3s ease;mix-blend-mode:difference;}
.la27-cursor.is-hover{width:56px;height:56px;}
.la27-cursor.is-play{width:88px;height:88px;background:var(--accent);mix-blend-mode:normal;}
.la27-cursor .cursor-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--bg);opacity:0;transition:opacity .2s ease;pointer-events:none;}
.la27-cursor.is-play .cursor-label{opacity:1;}
@media(hover:none){body{cursor:auto;}.la27-cursor{display:none;}a,button{cursor:auto;}}

/* Scroll progress */
.la27-scroll-progress{position:fixed;top:0;left:0;height:1px;background:var(--accent);z-index:99;transition:width .15s linear;}

/* Lang overlay */
.la27-lang-overlay{position:fixed;inset:0;z-index:1000;background:#050505;display:flex;align-items:center;justify-content:center;padding:48px;opacity:1;transition:opacity .7s cubic-bezier(.16,1,.3,1);}
.la27-lang-overlay.is-hidden{opacity:0;pointer-events:none;}
.la27-lang-overlay-inner{width:100%;max-width:720px;display:grid;gap:56px;}
.la27-lang-overlay-brand{display:flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-dim);}
.la27-lang-overlay-brand .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:la27pulse 2.4s ease-in-out infinite;}
.la27-overlay-titles{display:grid;gap:6px;font-family:var(--font-display);font-size:clamp(28px,4.4vw,56px);line-height:1.15;letter-spacing:-.015em;}
.la27-overlay-line{color:var(--ink-mute);font-style:italic;opacity:0;transform:translateY(12px);animation:la27lineIn .8s cubic-bezier(.16,1,.3,1) forwards;}
.la27-overlay-line:nth-child(1){animation-delay:.1s;color:var(--ink);}
.la27-overlay-line:nth-child(2){animation-delay:.18s;}
.la27-overlay-line:nth-child(3){animation-delay:.26s;}
.la27-overlay-line:nth-child(4){animation-delay:.34s;}
.la27-overlay-line:nth-child(5){animation-delay:.42s;}
@keyframes la27lineIn{to{opacity:1;transform:translateY(0);}}
.la27-overlay-list{list-style:none;display:grid;gap:1px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
.la27-overlay-list li{background:#050505;}
.la27-overlay-list a{display:grid;grid-template-columns:56px 1fr auto;align-items:center;gap:24px;padding:18px 4px;color:var(--ink);text-decoration:none;font-family:var(--font-sans);font-size:18px;transition:padding .4s cubic-bezier(.16,1,.3,1),color .3s ease,background .3s ease;opacity:0;transform:translateY(8px);animation:la27lineIn .6s cubic-bezier(.16,1,.3,1) forwards;}
.la27-overlay-list li:nth-child(1) a{animation-delay:.55s;}
.la27-overlay-list li:nth-child(2) a{animation-delay:.6s;}
.la27-overlay-list li:nth-child(3) a{animation-delay:.65s;}
.la27-overlay-list li:nth-child(4) a{animation-delay:.7s;}
.la27-overlay-list li:nth-child(5) a{animation-delay:.75s;}
.la27-overlay-list a .code{font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;color:var(--ink-dim);transition:color .3s ease;}
.la27-overlay-list a .name{font-family:var(--font-display);font-style:italic;font-size:clamp(20px,2.6vw,30px);}
.la27-overlay-list a .arrow{font-family:var(--font-display);font-style:italic;font-size:24px;color:var(--ink-mute);transform:translateX(-8px);opacity:0;transition:transform .4s cubic-bezier(.16,1,.3,1),opacity .3s ease,color .3s ease;}
.la27-overlay-list a:hover{padding-left:16px;padding-right:16px;background:#0a0a0a;}
.la27-overlay-list a:hover .code,.la27-overlay-list a:hover .arrow{color:var(--accent);}
.la27-overlay-list a:hover .arrow{transform:translateX(0);opacity:1;}
.la27-overlay-foot{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-mute);}
@media(max-width:600px){.la27-lang-overlay{padding:24px;}.la27-lang-overlay-inner{gap:32px;}.la27-overlay-titles{font-size:28px;}.la27-overlay-list a{grid-template-columns:40px 1fr auto;gap:16px;padding:16px 4px;}}

/* Nav */
.la27-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:24px 48px;display:flex;align-items:center;justify-content:space-between;mix-blend-mode:difference;color:#fff;}
.la27-nav-brand{font-family:var(--font-mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;color:inherit;}
.la27-nav-brand strong{font-weight:600;}
.la27-nav-links{display:flex;gap:32px;list-style:none;font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;}
.la27-nav-links a{color:inherit;text-decoration:none;opacity:.7;transition:opacity .2s ease;}
.la27-nav-links a:hover{opacity:1;}
.la27-nav-right{display:flex;align-items:center;gap:24px;}
.la27-nav-meta{font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;opacity:.7;}
.la27-nav-meta .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent);margin-right:8px;vertical-align:middle;animation:la27pulse 2.4s ease-in-out infinite;}
@keyframes la27pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.4);}}
.la27-lang-switch{position:relative;font-family:var(--font-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;}
.la27-lang-switch-btn{appearance:none;background:transparent;border:0;color:inherit;cursor:none;display:inline-flex;align-items:center;gap:6px;padding:6px 0;font:inherit;letter-spacing:inherit;text-transform:inherit;opacity:.85;transition:opacity .2s ease;}
.la27-lang-switch-btn:hover{opacity:1;}
.la27-lang-switch-btn svg{transition:transform .3s ease;}
.la27-lang-switch.is-open .la27-lang-switch-btn svg{transform:rotate(180deg);}
.la27-lang-switch-menu{position:absolute;top:calc(100% + 8px);right:0;list-style:none;background:#0a0a0a;border:1px solid var(--line);border-radius:4px;padding:6px;min-width:160px;display:flex;flex-direction:column;gap:2px;opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .25s ease,transform .25s cubic-bezier(.16,1,.3,1);z-index:200;}
.la27-lang-switch.is-open .la27-lang-switch-menu{opacity:1;transform:translateY(0);pointer-events:auto;}
.la27-lang-switch-menu a{display:flex;align-items:center;gap:10px;padding:8px 12px;color:var(--ink);text-decoration:none;border-radius:2px;font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.7;transition:opacity .2s ease,background .2s ease;}
.la27-lang-switch-menu a:hover,.la27-lang-switch-menu a.is-active{opacity:1;background:rgba(255,255,255,.04);}
.la27-lang-switch-menu a .code{color:var(--accent);font-weight:500;}
@media(max-width:768px){.la27-nav{padding:20px 24px;}.la27-nav-links,.la27-nav-meta{display:none;}.la27-nav-right{gap:12px;}}

/* Section index */
.la27-section-index{position:fixed;right:32px;top:50%;transform:translateY(-50%);z-index:50;display:flex;flex-direction:column;gap:18px;mix-blend-mode:difference;color:#fff;}
.la27-section-index a{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none;font-family:var(--font-mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.45;transition:opacity .3s ease;}
.la27-section-index a.is-active{opacity:1;}
.la27-section-index .num{width:28px;}
.la27-section-index .label{width:0;overflow:hidden;white-space:nowrap;transition:width .4s cubic-bezier(.16,1,.3,1);}
.la27-section-index a.is-active .label,.la27-section-index a:hover .label{width:80px;}
@media(max-width:1024px){.la27-section-index{display:none;}}

/* Hero */
.la27-hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:0 48px;overflow:hidden;}
.la27-hero-meta{position:absolute;top:96px;left:48px;right:48px;display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim);}
.la27-hero-title{font-family:var(--font-display);font-weight:400;font-size:clamp(72px,14vw,220px);line-height:.92;letter-spacing:-.02em;margin-bottom:.05em;}
.la27-hero-title .it{font-style:italic;color:var(--accent);}
.la27-hero-title .word{display:inline-block;overflow:hidden;vertical-align:bottom;}
.la27-hero-title .word > span{display:inline-block;transform:translateY(110%);animation:la27wordRise 1.1s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes la27wordRise{to{transform:translateY(0);}}
.la27-hero-sub{margin-top:48px;display:flex;justify-content:space-between;align-items:flex-end;gap:48px;opacity:0;transform:translateY(20px);animation:la27fadeUp 1s cubic-bezier(.16,1,.3,1) .8s forwards;}
@keyframes la27fadeUp{to{opacity:1;transform:translateY(0);}}
.la27-hero-sub-left{font-family:var(--font-mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);max-width:320px;line-height:1.6;}
.la27-scroll-cue{display:inline-flex;align-items:center;gap:12px;color:var(--ink);text-decoration:none;}
.la27-scroll-cue .arrow{width:24px;height:24px;border:1px solid var(--ink);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;animation:la27bounce 2s ease-in-out infinite;}
@keyframes la27bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(4px);}}

/* Waveform */
.la27-waveform{position:absolute;left:48px;right:48px;bottom:18vh;height:80px;display:flex;align-items:center;gap:3px;pointer-events:none;opacity:0;animation:la27fadeIn 1.4s ease 1s forwards;z-index:-1;}
@keyframes la27fadeIn{to{opacity:.5;}}
.la27-waveform .bar{flex:1;background:var(--ink);border-radius:1px;transform-origin:center;animation:la27wave 1.4s ease-in-out infinite;}
@keyframes la27wave{0%,100%{transform:scaleY(.4);}50%{transform:scaleY(1);}}

/* Trust strip */
.la27-trust{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:28px 0;overflow:hidden;}
.la27-trust-inner{display:flex;align-items:center;gap:80px;white-space:nowrap;animation:la27marquee 36s linear infinite;font-family:var(--font-display);font-style:italic;font-size:32px;color:var(--ink-mute);}
.la27-trust-inner span{display:inline-flex;align-items:center;gap:80px;}
.la27-trust-inner .sep{display:inline-block;width:4px;height:4px;border-radius:50%;background:var(--accent);}
@keyframes la27marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}

/* Section base */
.la27-section-header{display:flex;justify-content:space-between;align-items:flex-end;padding:96px 0 48px;border-bottom:1px solid var(--line);margin-bottom:56px;}
.la27-section-eyebrow{font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-dim);display:flex;align-items:center;gap:12px;}
.la27-section-eyebrow .num{color:var(--accent);font-weight:600;}
.la27-section-title{font-family:var(--font-display);font-size:clamp(48px,8vw,120px);line-height:.95;letter-spacing:-.02em;font-weight:400;}
.la27-section-title .it{font-style:italic;color:var(--accent);}
.la27-reveal{opacity:0;transform:translateY(40px);transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1);}
.la27-reveal.is-in{opacity:1;transform:translateY(0);}

/* Work */
.la27-work{padding:0 48px;}
.la27-work-grid{display:grid;gap:80px;padding-bottom:120px;}
.la27-work-item{display:grid;grid-template-columns:1.4fr 1fr;gap:56px;align-items:center;}
.la27-work-item:nth-child(even){direction:rtl;}
.la27-work-item:nth-child(even) > *{direction:ltr;}
.la27-work-media{position:relative;aspect-ratio:16/9;background:var(--bg-2);overflow:hidden;border-radius:2px;border:1px solid var(--line);transition:border-color .4s ease,box-shadow .4s ease;}
.la27-work-media:hover{border-color:var(--accent);box-shadow:0 24px 80px -20px rgba(220,38,38,.18);}
.la27-video-frame{position:absolute;inset:0;background:#000;}
.la27-video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;}
.la27-work-info{padding:0 24px;}
.la27-work-index{font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:24px;}
.la27-work-title{font-family:var(--font-display);font-size:clamp(56px,7vw,96px);line-height:.95;letter-spacing:-.02em;margin-bottom:16px;}
.la27-work-title .it{font-style:italic;}
.la27-work-meta{font-family:var(--font-mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:32px;display:flex;align-items:center;gap:16px;}
.la27-work-meta .sep{width:24px;height:1px;background:var(--ink-mute);}
.la27-work-desc{color:var(--ink-dim);font-size:15px;line-height:1.65;max-width:420px;}
@media(max-width:900px){.la27-work-item{grid-template-columns:1fr;gap:32px;}.la27-work-item:nth-child(even){direction:ltr;}.la27-work-info{padding:0;}}

/* Why / Studio */
.la27-why{padding:0 48px;}
.la27-why-lede{max-width:920px;margin:0 auto 96px;padding:0 24px;font-family:var(--font-display);font-size:clamp(28px,3.2vw,44px);line-height:1.25;letter-spacing:-.01em;text-align:center;text-wrap:balance;}
.la27-why-lede em{font-style:italic;color:var(--accent);}
.la27-why-lede .hl{font-style:italic;display:inline-block;border-bottom:1px solid var(--accent);padding-bottom:2px;}
.la27-pillars-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding-bottom:1px;margin-bottom:120px;}
.la27-pillar-card{background:var(--bg);padding:56px 40px 64px;display:flex;flex-direction:column;gap:24px;min-height:380px;}
.la27-pillar-num{font-family:var(--font-display);font-style:italic;font-size:88px;line-height:.9;color:var(--accent);}
.la27-pillar-title{font-family:var(--font-display);font-size:clamp(32px,3.4vw,44px);line-height:1;letter-spacing:-.015em;}
.la27-pillar-title .it{font-style:italic;}
.la27-pillar-body{color:var(--ink-dim);font-size:15px;line-height:1.65;margin-top:auto;}
@media(max-width:900px){.la27-pillars-grid{grid-template-columns:1fr;}.la27-pillar-card{min-height:auto;padding:48px 32px;}.la27-why-lede{font-size:24px;padding:0;}}

/* Founder */
.la27-studio{padding:0 48px;}
.la27-studio-grid{display:grid;grid-template-columns:5fr 7fr;gap:80px;padding-bottom:120px;}
.la27-studio-portrait{position:relative;aspect-ratio:4/5;background:var(--bg-2);border-radius:2px;overflow:hidden;}
.la27-studio-portrait img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.05) contrast(1.02);transition:transform 1.4s cubic-bezier(.16,1,.3,1),filter 1.4s ease;}
.la27-studio-portrait:hover img{transform:scale(1.04);filter:grayscale(0) contrast(1.05);}
.la27-studio-portrait::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.45) 100%);pointer-events:none;}
.la27-studio-text{padding-top:24px;}
.la27-studio-quote{font-family:var(--font-display);font-size:clamp(28px,3vw,42px);line-height:1.2;letter-spacing:-.01em;margin-bottom:40px;}
.la27-studio-quote .it{font-style:italic;color:var(--accent);}
.la27-studio-bio{color:var(--ink-dim);font-size:16px;line-height:1.7;max-width:540px;margin-bottom:40px;}
.la27-studio-sig{display:flex;align-items:center;justify-content:space-between;padding-top:32px;border-top:1px solid var(--line);max-width:540px;}
.la27-studio-sig .name{font-family:var(--font-display);font-style:italic;font-size:22px;}
.la27-studio-sig .role{font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim);margin-top:4px;}
.la27-linkedin{font-family:var(--font-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:1px solid var(--line);border-radius:999px;transition:border-color .3s ease,background .3s ease,color .3s ease;}
.la27-linkedin:hover{border-color:var(--accent);background:rgba(220,38,38,.06);color:var(--accent);}
@media(max-width:900px){.la27-studio-grid{grid-template-columns:1fr;gap:40px;}}

/* Contact */
.la27-contact{padding:0 48px 80px;border-top:1px solid var(--line);}
.la27-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:96px;padding-top:96px;}
.la27-contact-title{font-family:var(--font-display);font-size:clamp(72px,11vw,180px);line-height:.9;letter-spacing:-.025em;}
.la27-contact-title .it{font-style:italic;color:var(--accent);}
.la27-contact-aside{margin-top:40px;color:var(--ink-dim);font-size:15px;line-height:1.7;max-width:380px;}
.la27-contact-direct{margin-top:48px;padding-top:32px;border-top:1px solid var(--line);max-width:380px;}
.la27-contact-direct .lab{font-family:var(--font-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:8px;}
.la27-contact-direct .mail{font-family:var(--font-display);font-style:italic;font-size:28px;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--ink-mute);transition:border-color .3s ease;}
.la27-contact-direct .mail:hover{border-color:var(--accent);}
.la27-contact-status{margin-top:24px;display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim);}
.la27-contact-status .dot{width:8px;height:8px;border-radius:50%;background:oklch(.7 .15 145);box-shadow:0 0 0 4px oklch(.7 .15 145 /.12);animation:la27pulse 2.4s ease-in-out infinite;}
@media(max-width:900px){.la27-contact-grid{grid-template-columns:1fr;gap:48px;padding-top:64px;}}

/* Form */
.la27-form{display:grid;gap:4px;align-self:start;margin-top:24px;}
.la27-field{position:relative;border-bottom:1px solid var(--line);padding:24px 0 14px;transition:border-color .3s ease;}
.la27-field:hover{border-color:var(--ink-mute);}
.la27-field:focus-within{border-color:var(--accent);}
.la27-field label{position:absolute;top:24px;left:0;font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);pointer-events:none;transition:transform .3s cubic-bezier(.16,1,.3,1),color .3s ease,font-size .3s ease;transform-origin:left top;}
.la27-field input,.la27-field textarea,.la27-field select{width:100%;background:transparent;border:0;outline:0;color:var(--ink);font-family:var(--font-sans);font-size:18px;padding:0;margin-top:4px;resize:none;font-weight:400;}
.la27-field textarea{min-height:84px;line-height:1.5;}
.la27-field select{appearance:none;cursor:none;background-image:linear-gradient(45deg,transparent 50%,var(--ink-dim) 50%),linear-gradient(135deg,var(--ink-dim) 50%,transparent 50%);background-position:calc(100% - 12px) 12px,calc(100% - 6px) 12px;background-size:6px 6px,6px 6px;background-repeat:no-repeat;}
.la27-field option{background:var(--bg-2);color:var(--ink);}
.la27-field.is-filled label,.la27-field:focus-within label{transform:translateY(-24px) scale(.85);color:var(--accent);}
.la27-form-submit{margin-top:32px;}
.la27-btn{appearance:none;border:0;background:var(--ink);color:var(--bg);font-family:var(--font-mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase;padding:18px 28px;border-radius:999px;display:inline-flex;align-items:center;gap:12px;cursor:none;transition:transform .3s cubic-bezier(.16,1,.3,1),background .3s ease,color .3s ease;}
.la27-btn:hover{background:var(--accent);color:var(--bg);transform:translateX(4px);}
.la27-form-success{padding:48px 0;font-family:var(--font-display);font-style:italic;font-size:28px;color:var(--accent);opacity:0;transform:translateY(8px);transition:opacity .6s ease,transform .6s ease;}
.la27-form-success.is-shown{opacity:1;transform:translateY(0);}

/* Footer */
.la27-footer{border-top:1px solid var(--line);padding:48px;display:flex;align-items:center;justify-content:space-between;font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);}
.la27-footer .right{display:flex;gap:32px;}
@media(max-width:768px){.la27-footer{padding:32px 24px;flex-direction:column;gap:16px;align-items:flex-start;}}

/* Video lightbox */
.la27-vlightbox{position:fixed;inset:0;z-index:1500;display:flex;align-items:center;justify-content:center;padding:40px;opacity:0;pointer-events:none;transition:opacity .5s cubic-bezier(.16,1,.3,1);}
.la27-vlightbox.is-open{opacity:1;pointer-events:auto;}
.la27-vlightbox-backdrop{position:absolute;inset:0;background:rgba(2,2,2,.88);backdrop-filter:blur(18px);}
.la27-vlightbox-inner{position:relative;width:100%;max-width:1280px;display:grid;gap:16px;transform:scale(.98);transition:transform .6s cubic-bezier(.16,1,.3,1);}
.la27-vlightbox.is-open .la27-vlightbox-inner{transform:scale(1);}
.la27-vlightbox-top{display:flex;justify-content:space-between;align-items:center;}
.la27-vlightbox-title{display:flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-dim);}
.la27-vlightbox-title .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:la27pulse 2.4s ease-in-out infinite;}
.la27-vlightbox-title-text{color:var(--ink);}
.la27-vlightbox-close{appearance:none;background:transparent;border:1px solid var(--line);color:var(--ink);font-family:var(--font-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;padding:10px 14px;border-radius:999px;cursor:none;display:inline-flex;align-items:center;gap:10px;transition:border-color .3s ease,color .3s ease;}
.la27-vlightbox-close:hover{border-color:var(--accent);color:var(--accent);}
.la27-vlightbox-frame{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:4px;overflow:hidden;box-shadow:0 40px 120px -20px rgba(0,0,0,.7);}
.la27-vlightbox-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;}
.la27-vlightbox-hint{display:flex;gap:10px;font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-mute);justify-content:center;}
@media(max-width:768px){.la27-vlightbox{padding:16px;}.la27-vlightbox-hint{display:none;}.la27-vlightbox-close span{display:none;}.la27-vlightbox-close{padding:10px;}}

/* Reduced motion */
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;}.la27-hero-title .word > span{transform:translateY(0);}.la27-reveal{opacity:1;transform:none;}}
`;

// ─── Main component ─────────────────────────────────────────────────────────

function LA27Page() {
  const stored = getLangFromStorage();
  const [lang, setLangState] = useState<LangCode>(stored ?? "es");
  const [overlayHidden, setOverlayHidden] = useState(!!stored);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [bcnTime, setBcnTime] = useState("—:— BCN");
  const [activeSectionId, setActiveSectionId] = useState("hero");
  const [vlightboxOpen, setVlightboxOpen] = useState(false);
  const [vlightboxSrc, setVlightboxSrc] = useState("");
  const [vlightboxTitle, setVlightboxTitle] = useState("LA 27 PRODUCTIONS");
  const [formFields, setFormFields] = useState({ name: "", email: "", company: "", type: "", message: "" });
  const [formSuccess, setFormSuccess] = useState(false);

  // Cursor
  const cursorRef = useRef<HTMLDivElement>(null);
  const cxRef = useRef(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const cyRef = useRef(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const txRef = useRef(cxRef.current);
  const tyRef = useRef(cyRef.current);
  const [cursorHover, setCursorHover] = useState(false);
  const [cursorPlay, setCursorPlay] = useState(false);

  const dict = T[lang];
  const t = (key: string) => dict[key] ?? key;

  // Apply lang
  const applyLang = useCallback((l: LangCode, fromOverlay = false) => {
    setLangState(l);
    saveLang(l);
    if (fromOverlay) setOverlayHidden(true);
  }, []);

  // Inject global CSS once
  useEffect(() => {
    const id = "la27-global-css";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    // Lock body if overlay visible
    if (!overlayHidden) document.body.classList.add("is-locked");
    return () => { document.body.classList.remove("is-locked"); };
  }, []);

  useEffect(() => {
    if (overlayHidden) document.body.classList.remove("is-locked");
  }, [overlayHidden]);

  // Cursor rAF
  useEffect(() => {
    const onMove = (e: MouseEvent) => { txRef.current = e.clientX; tyRef.current = e.clientY; };
    window.addEventListener("mousemove", onMove);
    let raf: number;
    const loop = () => {
      cxRef.current += (txRef.current - cxRef.current) * 0.22;
      cyRef.current += (tyRef.current - cyRef.current) * 0.22;
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${cxRef.current}px,${cyRef.current}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Scroll handlers
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? Math.min(1, window.scrollY / h) * 100 : 0);
      // Active section
      const sectionIds = ["hero", "work", "why", "founder", "contact"];
      const mid = window.scrollY + window.innerHeight * 0.4;
      let active = "hero";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) active = id;
      }
      setActiveSectionId(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".la27-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  // BCN time
  useEffect(() => {
    const update = () => {
      try {
        const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Madrid" });
        setBcnTime(fmt.format(new Date()) + " BCN");
      } catch {
        const d = new Date();
        setBcnTime(String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + " BCN");
      }
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  // Keyboard / click to close switcher
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSwitcherOpen(false);
        if (vlightboxOpen) closeVideo();
      }
    };
    const onClick = () => setSwitcherOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, [vlightboxOpen]);

  // Hero parallax
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLDivElement>(null);
  const heroWaveRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY, h = window.innerHeight, p = Math.min(1, y / h);
      if (heroTitleRef.current) {
        heroTitleRef.current.style.transform = `translateY(${y * 0.18}px)`;
        heroTitleRef.current.style.opacity = String(1 - p * 0.85);
      }
      if (heroSubRef.current) {
        heroSubRef.current.style.opacity = String(1 - p * 1.5);
        heroSubRef.current.style.transform = `translateY(${y * 0.3}px)`;
      }
      if (heroWaveRef.current) heroWaveRef.current.style.transform = `translateY(${y * 0.4}px) scaleY(${1 - p * 0.4})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor hover state via delegation
  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest("[data-cursor='play']")) { setCursorPlay(true); setCursorHover(false); }
      else if (t.closest("[data-cursor='hover']")) { setCursorHover(true); setCursorPlay(false); }
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as Element;
      const rel = (e as MouseEvent & { relatedTarget: Element | null }).relatedTarget;
      if (t.closest("[data-cursor='play']") && !rel?.closest("[data-cursor='play']")) setCursorPlay(false);
      if (t.closest("[data-cursor='hover']") && !rel?.closest("[data-cursor='hover']")) setCursorHover(false);
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => { document.removeEventListener("mouseover", onOver); document.removeEventListener("mouseout", onOut); };
  }, []);

  // Video lightbox
  const openVideo = (id: string, title: string) => {
    setVlightboxSrc(`https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&badge=0&color=ffffff&dnt=1`);
    setVlightboxTitle(title);
    setVlightboxOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeVideo = () => {
    setVlightboxOpen(false);
    document.body.style.overflow = "";
    setTimeout(() => setVlightboxSrc(""), 500);
  };

  // Form
  const handleFieldChange = (field: keyof typeof formFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormFields((prev) => ({ ...prev, [field]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(true);
    setFormFields({ name: "", email: "", company: "", type: "", message: "" });
  };

  const LANGS: { code: LangCode; label: string }[] = [
    { code: "es", label: "Español" }, { code: "en", label: "English" },
    { code: "de", label: "Deutsch" }, { code: "fr", label: "Français" },
    { code: "pt", label: "Português" },
  ];

  return (
    <>
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className={`la27-cursor${cursorHover ? " is-hover" : ""}${cursorPlay ? " is-play" : ""}`}
        aria-hidden="true"
      >
        <span className="cursor-label">Play</span>
      </div>

      {/* Scroll progress */}
      <div className="la27-scroll-progress" style={{ width: `${scrollPct}%` }} aria-hidden="true" />

      {/* Language overlay */}
      <div className={`la27-lang-overlay${overlayHidden ? " is-hidden" : ""}`} role="dialog" aria-modal="true">
        <div className="la27-lang-overlay-inner">
          <div className="la27-lang-overlay-brand">
            <span className="dot" />
            <span>LA 27 PRODUCTIONS</span>
          </div>
          <div className="la27-overlay-titles">
            {["Selecciona idioma.", "Select language.", "Sprache wählen.", "Choisir la langue.", "Selecione o idioma."].map((line) => (
              <div key={line} className="la27-overlay-line">{line}</div>
            ))}
          </div>
          <ul className="la27-overlay-list">
            {LANGS.map(({ code, label }) => (
              <li key={code}>
                <a href="#" data-cursor="hover" onClick={(e) => { e.preventDefault(); applyLang(code, true); }}>
                  <span className="code">{code.toUpperCase()}</span>
                  <span className="name">{label}</span>
                  <span className="arrow">→</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="la27-overlay-foot">
            <span>Barcelona — ES</span>
            <span>© LA 27</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <header className="la27-nav">
        <a href="#top" className="la27-nav-brand" data-cursor="hover">
          <strong>LA 27</strong>&nbsp;Productions
        </a>
        <nav>
          <ul className="la27-nav-links">
            {(["work", "studio", "founder", "contact"] as const).map((k) => (
              <li key={k}>
                <a href={`#${k === "studio" ? "why" : k}`} data-cursor="hover">{t(`nav.${k}`)}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="la27-nav-right">
          {/* Lang switcher */}
          <div
            className={`la27-lang-switch${switcherOpen ? " is-open" : ""}`}
            data-cursor="hover"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="la27-lang-switch-btn"
              type="button"
              aria-haspopup="true"
              aria-expanded={switcherOpen}
              onClick={() => setSwitcherOpen((v) => !v)}
            >
              <span className="lang-switch-current">{t("lang.code")}</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 3l2.5 2.5L6.5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
            </button>
            <ul className="la27-lang-switch-menu" role="menu">
              {LANGS.map(({ code, label }) => (
                <li key={code}>
                  <a
                    href="#"
                    data-cursor="hover"
                    className={lang === code ? "is-active" : ""}
                    onClick={(e) => { e.preventDefault(); applyLang(code); setSwitcherOpen(false); }}
                  >
                    <span className="code">{code.toUpperCase()}</span> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="la27-nav-meta">
            <span className="dot" />
            <span>{bcnTime}</span>
          </div>
        </div>
      </header>

      {/* Section index */}
      <aside className="la27-section-index" aria-hidden="true">
        {[
          { href: "#hero", num: "001", labelKey: "index.intro", id: "hero" },
          { href: "#work", num: "002", labelKey: "index.reels", id: "work" },
          { href: "#why", num: "003", labelKey: "index.studio", id: "why" },
          { href: "#founder", num: "004", labelKey: "index.founder", id: "founder" },
          { href: "#contact", num: "005", labelKey: "index.contact", id: "contact" },
        ].map(({ href, num, labelKey, id }) => (
          <a key={id} href={href} data-cursor="hover" className={activeSectionId === id ? "is-active" : ""}>
            <span className="num">{num}</span>
            <span className="label">{t(labelKey)}</span>
          </a>
        ))}
      </aside>

      <main id="top">
        {/* HERO */}
        <section id="hero" className="la27-hero" data-section>
          <div className="la27-hero-meta">
            <span>{t("hero.meta")}</span>
            <span>{t("hero.location")}</span>
          </div>
          <h1
            ref={heroTitleRef}
            className="la27-hero-title"
            dangerouslySetInnerHTML={{ __html: t("hero.title") }}
          />
          <div ref={heroWaveRef} className="la27-waveform" aria-hidden="true">
            {WAVE_BARS.map((b, i) => (
              <div
                key={i}
                className="bar"
                style={{ height: `${b.h}px`, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
              />
            ))}
          </div>
          <div ref={heroSubRef} className="la27-hero-sub">
            <p className="la27-hero-sub-left">{t("hero.sub")}</p>
            <a className="la27-scroll-cue" href="#work" data-cursor="hover">
              <span>{t("hero.scroll")}</span>
              <span className="arrow">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M2 6l3 3 3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="la27-trust" aria-label="Trust">
          <div className="la27-trust-inner">
            {[0, 1].map((n) => (
              <span key={n} aria-hidden={n === 1 ? "true" : undefined}>
                <em style={{ fontStyle: "italic" }}>{t("trust.text")}</em>
                {["Ferrari", "Dior", "Loewe", "Estrella Damm", "Mango", "Volkswagen", "Banco Sabadell"].map((b) => (
                  <span key={b} style={{ display: "contents" }}>
                    <i className="sep" />
                    {b}
                  </span>
                ))}
                <i className="sep" />
              </span>
            ))}
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="la27-work" data-section>
          <div className="la27-section-header la27-reveal">
            <div className="la27-section-eyebrow">
              <span className="num">002</span>
              <span>{t("work.eyebrow")}</span>
            </div>
            <h2 className="la27-section-title" dangerouslySetInnerHTML={{ __html: t("work.title") }} />
          </div>
          <div className="la27-work-grid">
            {[
              { idx: "01 / Ferrari", titleKey: "work.ferrari.title", meta1: "work.ferrari.meta1", meta2: "work.ferrari.meta2", descKey: "work.ferrari.desc", vimeoId: "1192292542", year: "2025" },
              { idx: "02 / Dior", titleKey: "work.dior.title", meta1: "work.dior.meta1", meta2: "work.dior.meta2", descKey: "work.dior.desc", vimeoId: "1192292538", year: "2026" },
            ].map(({ idx, titleKey, meta1, meta2, descKey, vimeoId, year }) => (
              <article key={idx} className="la27-work-item la27-reveal">
                <div className="la27-work-media">
                  <div className="la27-video-frame">
                    <iframe
                      src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&badge=0&color=ffffff&dnt=1`}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      title={idx}
                    />
                  </div>
                </div>
                <div className="la27-work-info">
                  <div className="la27-work-index">{idx}</div>
                  <h3 className="la27-work-title" dangerouslySetInnerHTML={{ __html: t(titleKey) }} />
                  <div className="la27-work-meta">
                    <span>{t(meta1)}</span>
                    <span className="sep" />
                    <span>{t(meta2)}</span>
                    <span className="sep" />
                    <span>{year}</span>
                  </div>
                  <p className="la27-work-desc">{t(descKey)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* WHY / STUDIO */}
        <section id="why" className="la27-why" data-section>
          <div className="la27-section-header la27-reveal">
            <div className="la27-section-eyebrow">
              <span className="num">003</span>
              <span>{t("why.eyebrow")}</span>
            </div>
            <h2 className="la27-section-title" dangerouslySetInnerHTML={{ __html: t("why.title") }} />
          </div>
          <div className="la27-why-lede la27-reveal" dangerouslySetInnerHTML={{ __html: `<p>${t("why.lede")}</p>` }} />
          <div className="la27-pillars-grid">
            {(["01", "02", "03"] as const).map((n) => (
              <div key={n} className="la27-pillar-card la27-reveal">
                <div className="la27-pillar-num">{n}</div>
                <h3 className="la27-pillar-title" dangerouslySetInnerHTML={{ __html: t(`pillar.${n}.title`) }} />
                <p className="la27-pillar-body">{t(`pillar.${n}.body`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOUNDER */}
        <section id="founder" className="la27-studio" data-section>
          <div className="la27-section-header la27-reveal">
            <div className="la27-section-eyebrow">
              <span className="num">004</span>
              <span>{t("founder.eyebrow")}</span>
            </div>
            <h2 className="la27-section-title" dangerouslySetInnerHTML={{ __html: t("founder.title") }} />
          </div>
          <div className="la27-studio-grid">
            <div className="la27-studio-portrait la27-reveal">
              <img src="assets/tim-helmes.png" alt="Tim Helmes — Founder & Music Director, LA 27 Productions" />
            </div>
            <div className="la27-studio-text la27-reveal">
              <p className="la27-studio-quote" dangerouslySetInnerHTML={{ __html: t("founder.quote") }} />
              <p className="la27-studio-bio">{t("founder.bio")}</p>
              <div className="la27-studio-sig">
                <div>
                  <div className="name">Tim Helmes</div>
                  <div className="role">{t("founder.role")}</div>
                </div>
                <a href="https://www.linkedin.com/in/tim-helmes-boschi-9b9244246/" target="_blank" rel="noopener noreferrer" className="la27-linkedin" data-cursor="hover">
                  LinkedIn
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H3M8 2v5" stroke="currentColor" strokeWidth="1" /></svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="la27-contact" data-section>
          <div className="la27-contact-grid">
            <div className="la27-reveal">
              <h2 className="la27-contact-title" dangerouslySetInnerHTML={{ __html: t("contact.title") }} />
              <p className="la27-contact-aside">{t("contact.aside")}</p>
              <div className="la27-contact-direct">
                <div className="lab">{t("contact.direct")}</div>
                <a className="mail" href="mailto:la27productions@gmail.com" data-cursor="hover">la27productions@gmail.com</a>
                <div className="la27-contact-status">
                  <span className="dot" />
                  <span>{t("contact.status")}</span>
                </div>
              </div>
            </div>
            <form className="la27-form la27-reveal" autoComplete="off" onSubmit={handleSubmit}>
              {(["name", "email", "company", "message"] as const).map((field) => (
                <div key={field} className={`la27-field${formFields[field] ? " is-filled" : ""}`}>
                  <label htmlFor={`f-${field}`}>{t(`form.${field}`)}</label>
                  {field === "message" ? (
                    <textarea id={`f-${field}`} rows={2} value={formFields[field]} onChange={handleFieldChange(field)} />
                  ) : (
                    <input id={`f-${field}`} type={field === "email" ? "email" : "text"} value={formFields[field]} onChange={handleFieldChange(field)} />
                  )}
                </div>
              ))}
              <div className={`la27-field${formFields.type ? " is-filled" : ""}`}>
                <label htmlFor="f-type">{t("form.type")}</label>
                <select id="f-type" value={formFields.type} onChange={handleFieldChange("type")}>
                  <option value="">{t("form.type.placeholder")}</option>
                  {(["opt1", "opt2", "opt3", "opt4", "opt5"] as const).map((o) => (
                    <option key={o} value={t(`form.type.${o}`)}>{t(`form.type.${o}`)}</option>
                  ))}
                </select>
              </div>
              <div className="la27-form-submit">
                <button type="submit" className="la27-btn" data-cursor="hover">
                  <span>{t("form.submit")}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <p className={`la27-form-success${formSuccess ? " is-shown" : ""}`}>{t("form.success")}</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="la27-footer">
        <div>{t("footer.copy")}</div>
        <div className="right">
          <span>{t("footer.mastered")}</span>
          <span>v2026</span>
        </div>
      </footer>

      {/* Video lightbox */}
      <div className={`la27-vlightbox${vlightboxOpen ? " is-open" : ""}`} aria-hidden={!vlightboxOpen}>
        <div className="la27-vlightbox-backdrop" onClick={closeVideo} />
        <div className="la27-vlightbox-inner">
          <div className="la27-vlightbox-top">
            <div className="la27-vlightbox-title">
              <span className="dot" />
              <span className="la27-vlightbox-title-text">{vlightboxTitle}</span>
            </div>
            <button className="la27-vlightbox-close" type="button" onClick={closeVideo} data-cursor="hover">
              <span>Cerrar</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
          </div>
          <div className="la27-vlightbox-frame">
            {vlightboxSrc && <iframe src={vlightboxSrc} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={vlightboxTitle} />}
          </div>
          <div className="la27-vlightbox-hint">
            <span>ESC para cerrar</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── TanStack Start route ────────────────────────────────────────────────────

export const Route = createFileRoute("/")({
  component: LA27Page,
});
