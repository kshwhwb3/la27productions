export type Lang = "en" | "es" | "fr" | "de";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
];

type Dict = {
  navStudio: string;
  heroSubtitle: string;
  heroDesc: string;
  portfolioTitle: string;
  portfolioIntro: string;
  video1: string;
  video2: string;
  contactTitle: string;
  contactBody: string;
  contactCta: string;
  footer: string;
};

export const translations: Record<Lang, Dict> = {
  en: {
    navStudio: "Studio",
    heroSubtitle: "High-End Sonic Engineering.",
    heroDesc:
      "Born in Barcelona, Spain. For years, we have been crafting bespoke commercial audio and sonic identities for brands that demand perfection. We don't just make music; we engineer the sound of luxury.",
    portfolioTitle: "The Sound of Excellence.",
    portfolioIntro:
      "This is how custom-engineered audio elevates a global campaign. Experience our sound design synchronized with world-class aesthetics.",
    video1: "Automotive Concept — Custom Commercial Score",
    video2: "Haute Couture Concept — Bespoke Sound Design",
    contactTitle: "Secure Your Sound.",
    contactBody:
      "Stop compromising your visual campaigns with generic stock audio. If you are interested in licensing custom, high-fidelity soundtracks with a 24-hour turnaround, reach out to our studio.",
    contactCta: "Contact The Studio",
    footer: "Barcelona — Worldwide",
  },
  es: {
    navStudio: "Estudio",
    heroSubtitle: "Ingeniería Sonora de Alta Gama.",
    heroDesc:
      "Nacidos en Barcelona, España. Durante años hemos creado audio comercial e identidades sonoras a medida para marcas que exigen la perfección. No hacemos música; diseñamos el sonido del lujo.",
    portfolioTitle: "El Sonido de la Excelencia.",
    portfolioIntro:
      "Así es como un audio diseñado a medida eleva una campaña global. Experimenta nuestro diseño sonoro sincronizado con una estética de clase mundial.",
    video1: "Concepto Automotriz — Banda Sonora Comercial a Medida",
    video2: "Concepto Alta Costura — Diseño Sonoro a Medida",
    contactTitle: "Asegure Su Sonido.",
    contactBody:
      "Deje de comprometer sus campañas visuales con audio genérico de stock. Si le interesa licenciar bandas sonoras personalizadas de alta fidelidad con entrega en 24 horas, contacte con nuestro estudio.",
    contactCta: "Contactar Al Estudio",
    footer: "Barcelona — Mundial",
  },
  fr: {
    navStudio: "Studio",
    heroSubtitle: "Ingénierie Sonore Haut de Gamme.",
    heroDesc:
      "Nés à Barcelone, Espagne. Depuis des années, nous concevons un audio commercial sur mesure et des identités sonores pour des marques qui exigent la perfection. Nous ne faisons pas de musique ; nous concevons le son du luxe.",
    portfolioTitle: "Le Son de l'Excellence.",
    portfolioIntro:
      "Voici comment un audio conçu sur mesure sublime une campagne mondiale. Découvrez notre design sonore synchronisé avec une esthétique de classe mondiale.",
    video1: "Concept Automobile — Bande Originale Commerciale Sur Mesure",
    video2: "Concept Haute Couture — Design Sonore Sur Mesure",
    contactTitle: "Sécurisez Votre Son.",
    contactBody:
      "Cessez de compromettre vos campagnes visuelles avec de l'audio générique. Si vous souhaitez licencier des bandes sonores personnalisées haute fidélité livrées en 24 heures, contactez notre studio.",
    contactCta: "Contacter Le Studio",
    footer: "Barcelone — International",
  },
  de: {
    navStudio: "Studio",
    heroSubtitle: "Hochwertiges Sonic Engineering.",
    heroDesc:
      "Geboren in Barcelona, Spanien. Seit Jahren entwickeln wir maßgeschneiderten Werbe-Audio und Klangidentitäten für Marken, die Perfektion verlangen. Wir machen keine Musik; wir entwickeln den Klang des Luxus.",
    portfolioTitle: "Der Klang der Exzellenz.",
    portfolioIntro:
      "So hebt maßgeschneidertes Audio eine globale Kampagne auf das nächste Niveau. Erleben Sie unser Sound Design synchron zu erstklassiger Ästhetik.",
    video1: "Automotive-Konzept — Maßgeschneiderter Commercial Score",
    video2: "Haute-Couture-Konzept — Maßgeschneidertes Sound Design",
    contactTitle: "Sichern Sie Ihren Sound.",
    contactBody:
      "Hören Sie auf, Ihre visuellen Kampagnen mit generischem Stock-Audio zu kompromittieren. Wenn Sie maßgeschneiderte High-Fidelity-Soundtracks mit 24-Stunden-Lieferung lizenzieren möchten, kontaktieren Sie unser Studio.",
    contactCta: "Studio Kontaktieren",
    footer: "Barcelona — Weltweit",
  },
};
