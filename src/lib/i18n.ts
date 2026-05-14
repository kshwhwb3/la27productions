export type Lang = "en" | "es" | "fr" | "de";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
];

type Dict = {
  heroLine1: string;
  heroLine2: string;
  heroAccent: string;
  heroTag: string;
  workTitle: string;
  workKicker: string;
  video1: string;
  video2: string;
  contactTitle: string;
  contactAccent: string;
  contactCta: string;
  footer: string;
};

export const translations: Record<Lang, Dict> = {
  en: {
    heroLine1: "Sound",
    heroLine2: "of",
    heroAccent: "Luxury.",
    heroTag: "Bespoke audio. Barcelona.",
    workTitle: "Selected Work",
    workKicker: "002 Reels",
    video1: "Automotive — Score",
    video2: "Couture — Design",
    contactTitle: "Secure your",
    contactAccent: "sound.",
    contactCta: "Contact Studio",
    footer: "Barcelona — Worldwide",
  },
  es: {
    heroLine1: "Sonido",
    heroLine2: "del",
    heroAccent: "Lujo.",
    heroTag: "Audio a medida. Barcelona.",
    workTitle: "Trabajo Seleccionado",
    workKicker: "002 Reels",
    video1: "Automotriz — Score",
    video2: "Alta Costura — Diseño",
    contactTitle: "Asegura tu",
    contactAccent: "sonido.",
    contactCta: "Contactar Estudio",
    footer: "Barcelona — Mundial",
  },
  fr: {
    heroLine1: "Son",
    heroLine2: "du",
    heroAccent: "Luxe.",
    heroTag: "Audio sur mesure. Barcelone.",
    workTitle: "Travaux Sélectionnés",
    workKicker: "002 Reels",
    video1: "Automobile — Score",
    video2: "Haute Couture — Design",
    contactTitle: "Sécurisez votre",
    contactAccent: "son.",
    contactCta: "Contacter Studio",
    footer: "Barcelone — International",
  },
  de: {
    heroLine1: "Klang",
    heroLine2: "des",
    heroAccent: "Luxus.",
    heroTag: "Maßgefertigtes Audio. Barcelona.",
    workTitle: "Ausgewählte Arbeiten",
    workKicker: "002 Reels",
    video1: "Automotive — Score",
    video2: "Couture — Design",
    contactTitle: "Sichern Sie Ihren",
    contactAccent: "Klang.",
    contactCta: "Studio Kontaktieren",
    footer: "Barcelona — Weltweit",
  },
};
