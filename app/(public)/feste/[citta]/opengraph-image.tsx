import { ImageResponse } from "next/og";
import { cittaFeste } from "@/lib/feste";
import { dimensioniOg, ImmagineOg } from "@/lib/og";

export const alt = "Festa di compleanno per bambini — Gioca con Mizi";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima di condivisione di una pagina città: la keyword locale in grande. */
export default async function Image({ params }: { params: Promise<{ citta: string }> }) {
  const { citta } = await params;
  const voce = cittaFeste(citta);

  return new ImageResponse(
    (
      <ImmagineOg
        titolo={
          voce
            ? `Festa di compleanno per bambini a ${voce.citta}`
            : "Feste di compleanno per bambini"
        }
        sottotitolo={voce ? `${voce.locali.length} location, zona per zona` : "città per città"}
      />
    ),
    size,
  );
}
