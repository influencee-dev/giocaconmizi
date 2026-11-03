import type { MetadataRoute } from "next";

/**
 * Giocamizi come app (PWA): si installa sulla schermata Home del telefono e
 * si apre a tutto schermo, senza barra del browser. Le icone vengono dai
 * loghi di Giorgia (public/app/). La barretta che lo propone è
 * components/app/BarraApp.tsx.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Giocamizi — giochi, storie e feste per bambini",
    short_name: "Giocamizi",
    description: "Giochi educativi gratis, storie, inviti e feste per bambini dai 3 ai 12 anni. Senza pubblicità.",
    id: "/",
    start_url: "/?app=1",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF3E6",
    theme_color: "#9B6DD6",
    lang: "it",
    categories: ["education", "kids", "games"],
    icons: [
      { src: "/app/icona-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app/icona-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app/icona-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Giochi", url: "/giochi", icons: [{ src: "/icone/gamepad.png", sizes: "256x256" }] },
      { name: "Crea un invito", url: "/biglietti/crea", icons: [{ src: "/icone/torta.png", sizes: "256x256" }] },
      { name: "Feste in città", url: "/feste", icons: [{ src: "/icone/festa.png", sizes: "96x96" }] },
    ],
  };
}
