import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LA 27 Productions — Sonido de Lujo · Barcelona" },
      {
        name: "description",
        content:
          "Música instrumental 100% exclusiva para anuncios y contenido de marca. Sin librerías, sin royalties. Estudio en Barcelona.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "stylesheet", href: "/styles.css" },
    ],
  }),
  shellComponent: RootShell,
  notFoundComponent: () => (
    <div style={{ padding: 40, color: "#fff", background: "#000", minHeight: "100vh" }}>
      <h1>404</h1>
      <a href="/" style={{ color: "#e63946" }}>Volver al inicio</a>
    </div>
  ),
});

function RootShell() {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
