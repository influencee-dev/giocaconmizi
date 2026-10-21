import { ImageResponse } from "next/og";
import { dimensioniOg, ImmagineOg } from "@/lib/og";

export const alt = "Gioca con Mizi — giochi educativi gratis per bambini dai 3 ai 12 anni";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima di default per tutto il sito (home comprese le pagine senza immagine propria). */
export default function Image() {
  return new ImageResponse(
    (
      <ImmagineOg
        titolo="Giochi educativi per bambini dai 3 ai 12 anni"
        sottotitolo="giochi · storie · coding · biglietti"
      />
    ),
    size,
  );
}
