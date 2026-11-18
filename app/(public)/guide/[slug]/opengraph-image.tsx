import { ImageResponse } from "next/og";
import { guida } from "@/lib/contenuti/guide";
import { dimensioniOg, ImmagineOg } from "@/lib/seo/og";

export const alt = "Guida per i genitori — Gioca con Mizi";
export const size = dimensioniOg;
export const contentType = "image/png";

/** L'anteprima di condivisione di una guida: il titolo-domanda in grande. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const voce = guida(slug);

  return new ImageResponse(
    (
      <ImmagineOg
        titolo={voce?.titolo ?? "Guide per i genitori"}
        sottotitolo={voce ? `guida per i genitori · ${voce.minutiLettura} minuti` : "guide per i genitori"}
      />
    ),
    size,
  );
}
