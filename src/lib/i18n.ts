export type Lang = "es" | "en" | "fr" | "de";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
];

type Dict = {
  heroLine1: string;
  heroLine2: string;
  heroAccent: string;
  heroTag: string;
  heroProof: string;
  workTitle: string;
  workKicker: string;
  video1: string;
  video2: string;
  studioKicker: string;
  studioTitle: string;
  bio: string;
  role: string;
  linkedin: string;
  trust1Title: string;
  trust1Body: string;
  trust2Title: string;
  trust2Body: string;
  trust3Title: string;
  trust3Body: string;
  contactTitle: string;
  contactAccent: string;
  contactCta: string;
  formName: string;
  formEmail: string;
  formCompany: string;
  formMessage: string;
  formSend: string;
  formOr: string;
  footer: string;
};

export const translations: Record<Lang, Dict> = {
  es: {
    heroLine1: "Sonido",
    heroLine2: "de",
    heroAccent: "Lujo.",
    heroTag: "Audio a medida. Barcelona.",
    heroProof: "Confiado por agencias y marcas en 15+ países",
    workTitle: "Trabajo Seleccionado",
    workKicker: "002 Reels",
    video1: "Automotriz — Score",
    video2: "Alta Costura — Diseño",
    studioKicker: "El Estudio",
    studioTitle: "Quiénes somos",
    bio: "Compositor y director creativo con sede en Barcelona. LA 27 PRODUCTIONS nació de una convicción simple: cada marca merece su propio sonido. Trabajamos con agencias y marcas de primer nivel para crear música instrumental 100% exclusiva — compuesta desde cero, sin librerías, sin royalties.",
    role: "Founder & Music Director — LA 27 PRODUCTIONS",
    linkedin: "LinkedIn",
    trust1Title: "Estudio en Barcelona",
    trust1Body: "Instalaciones de grabación y producción de alto nivel técnico y auditivo.",
    trust2Title: "100% Exclusivo",
    trust2Body: "Cada pieza compuesta desde cero para tu proyecto. Nunca reutilizada.",
    trust3Title: "Sin Royalties",
    trust3Body: "La música es tuya. Para siempre. Sin licencias ni complicaciones legales.",
    contactTitle: "Asegura tu",
    contactAccent: "sonido.",
    contactCta: "Contactar Estudio",
    formName: "Nombre",
    formEmail: "Email",
    formCompany: "Empresa",
    formMessage: "Mensaje",
    formSend: "Enviar",
    formOr: "o escríbenos directamente",
    footer: "Barcelona — Mundial",
  },
  en: {
    heroLine1: "Sound",
    heroLine2: "of",
    heroAccent: "Luxury.",
    heroTag: "Bespoke audio. Barcelona.",
    heroProof: "Trusted by agencies and brands in 15+ countries",
    workTitle: "Selected Work",
    workKicker: "002 Reels",
    video1: "Automotive — Score",
    video2: "Couture — Design",
    studioKicker: "The Studio",
    studioTitle: "Who we are",
    bio: "Composer and creative director based in Barcelona. LA 27 PRODUCTIONS was born from a simple conviction: every brand deserves its own sound. We work with top-tier agencies and brands to create 100% exclusive instrumental music — composed from scratch, no libraries, no royalties.",
    role: "Founder & Music Director — LA 27 PRODUCTIONS",
    linkedin: "LinkedIn",
    trust1Title: "Barcelona Studio",
    trust1Body: "High-end recording and production facilities, technically and sonically.",
    trust2Title: "100% Exclusive",
    trust2Body: "Every piece composed from scratch for your project. Never reused.",
    trust3Title: "Royalty-Free",
    trust3Body: "The music is yours. Forever. No licenses, no legal complications.",
    contactTitle: "Secure your",
    contactAccent: "sound.",
    contactCta: "Contact Studio",
    formName: "Name",
    formEmail: "Email",
    formCompany: "Company",
    formMessage: "Message",
    formSend: "Send",
    formOr: "or email us directly",
    footer: "Barcelona — Worldwide",
  },
  fr: {
    heroLine1: "Son",
    heroLine2: "du",
    heroAccent: "Luxe.",
    heroTag: "Audio sur mesure. Barcelone.",
    heroProof: "Approuvé par des agences et marques dans 15+ pays",
    workTitle: "Travaux Sélectionnés",
    workKicker: "002 Reels",
    video1: "Automobile — Score",
    video2: "Haute Couture — Design",
    studioKicker: "Le Studio",
    studioTitle: "Qui sommes-nous",
    bio: "Compositeur et directeur créatif basé à Barcelone. LA 27 PRODUCTIONS est née d'une conviction simple : chaque marque mérite son propre son. Nous collaborons avec des agences et marques de premier plan pour créer une musique instrumentale 100% exclusive — composée à partir de zéro, sans bibliothèques, sans royalties.",
    role: "Founder & Music Director — LA 27 PRODUCTIONS",
    linkedin: "LinkedIn",
    trust1Title: "Studio à Barcelone",
    trust1Body: "Installations d'enregistrement et de production de haut niveau.",
    trust2Title: "100% Exclusif",
    trust2Body: "Chaque pièce composée à partir de zéro pour votre projet. Jamais réutilisée.",
    trust3Title: "Sans Royalties",
    trust3Body: "La musique est à vous. Pour toujours. Sans licences ni complications.",
    contactTitle: "Sécurisez votre",
    contactAccent: "son.",
    contactCta: "Contacter Studio",
    formName: "Nom",
    formEmail: "Email",
    formCompany: "Entreprise",
    formMessage: "Message",
    formSend: "Envoyer",
    formOr: "ou écrivez-nous directement",
    footer: "Barcelone — International",
  },
  de: {
    heroLine1: "Klang",
    heroLine2: "des",
    heroAccent: "Luxus.",
    heroTag: "Maßgefertigtes Audio. Barcelona.",
    heroProof: "Vertraut von Agenturen und Marken in 15+ Ländern",
    workTitle: "Ausgewählte Arbeiten",
    workKicker: "002 Reels",
    video1: "Automotive — Score",
    video2: "Couture — Design",
    studioKicker: "Das Studio",
    studioTitle: "Wer wir sind",
    bio: "Komponist und Creative Director mit Sitz in Barcelona. LA 27 PRODUCTIONS entstand aus einer einfachen Überzeugung: Jede Marke verdient ihren eigenen Klang. Wir arbeiten mit erstklassigen Agenturen und Marken zusammen, um 100% exklusive Instrumentalmusik zu schaffen — von Grund auf komponiert, ohne Bibliotheken, ohne Royalties.",
    role: "Founder & Music Director — LA 27 PRODUCTIONS",
    linkedin: "LinkedIn",
    trust1Title: "Studio in Barcelona",
    trust1Body: "Aufnahme- und Produktionsanlagen auf höchstem technischem Niveau.",
    trust2Title: "100% Exklusiv",
    trust2Body: "Jedes Stück von Grund auf für Ihr Projekt komponiert. Nie wiederverwendet.",
    trust3Title: "Ohne Royalties",
    trust3Body: "Die Musik gehört Ihnen. Für immer. Keine Lizenzen, keine Komplikationen.",
    contactTitle: "Sichern Sie Ihren",
    contactAccent: "Klang.",
    contactCta: "Studio Kontaktieren",
    formName: "Name",
    formEmail: "Email",
    formCompany: "Unternehmen",
    formMessage: "Nachricht",
    formSend: "Senden",
    formOr: "oder schreiben Sie uns direkt",
    footer: "Barcelona — Weltweit",
  },
};
