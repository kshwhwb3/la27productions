import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: SitePage,
  head: () => ({
    meta: [
      { title: "LA 27 Productions — Sonido de Lujo · Barcelona" },
      {
        name: "description",
        content:
          "Música instrumental 100% exclusiva para anuncios y contenido de marca. Sin librerías, sin royalties. Estudio en Barcelona.",
      },
    ],
  }),
});

function SitePage() {
  return (
    <iframe
      src="/la27/index.html"
      title="LA 27 Productions"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: 0,
        margin: 0,
        padding: 0,
      }}
    />
  );
}
