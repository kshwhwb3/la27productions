import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const TARGET = "https://kshwhwb3.github.io/la27productions/";

export const Route = createFileRoute("/")({
  component: RedirectPage,
  head: () => ({
    meta: [
      { title: "LA 27 Productions — Sonido de Lujo · Barcelona" },
      {
        name: "description",
        content:
          "Música instrumental 100% exclusiva para anuncios y contenido de marca. Sin librerías, sin royalties. Estudio en Barcelona.",
      },
      { httpEquiv: "refresh", content: `0; url=${TARGET}` },
    ],
    links: [{ rel: "canonical", href: TARGET }],
  }),
});

function RedirectPage() {
  useEffect(() => {
    window.location.replace(TARGET);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 500, margin: 0 }}>
          LA 27 PRODUCTIONS
        </h1>
        <p style={{ opacity: 0.6, marginTop: "0.75rem" }}>
          Redirigiendo…{" "}
          <a href={TARGET} style={{ color: "#E10600" }}>
            Continuar
          </a>
        </p>
      </div>
    </main>
  );
}
