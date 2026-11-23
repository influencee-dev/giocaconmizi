import { games } from "@/games/registry";
import { dimensioniOg, immagineOg } from "@/lib/seo/og";

export const alt = "Gioco educativo gratis per bambini — Giocamizi";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima di condivisione di un gioco: il nome del gioco e l'età. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = games.find((x) => x.slug === slug);
  return immagineOg({
    titolo: g ? g.title : "Giochi educativi per bambini",
    etichetta: g ? `Gioco gratis · ${g.ageMin}-${g.ageMax} anni · ${g.minutes} minuti` : "Gioco gratis",
    sottotitolo: "Si gioca dal telefono, senza app e senza pubblicità",
    tinta: "azzurro",
    invito: "Gioca su giocamizi.it",
  });
}
