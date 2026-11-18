"use client";

import Link from "next/link";
import type { Skill } from "@/games/registry";
import { FigurinaGioco } from "@/components/icone";
import { useAlbum } from "@/lib/giochi/album";

/**
 * La figurina del gioco, nella sua pagina: dice se è già nell'album di Mizi
 * (con le stelle migliori) o se si prende finendo il gioco. È il collegamento
 * tra la pagina di ogni gioco e l'album (16/11/2026): prima l'album si vedeva
 * solo nel catalogo e alla festa finale.
 *
 * L'album sta nel dispositivo: sul server e al primo disegno la riga è neutra,
 * così la pagina resta statica e non «salta» quando arriva il dato.
 */
export function FigurinaDelGioco({ slug, skill }: { slug: string; skill: Skill }) {
  const { album, pronto } = useAlbum();
  const figurina = pronto ? album.giochi[slug] : undefined;
  const stelle = figurina ? Math.max(1, Math.min(3, figurina.stelle)) : 0;

  return (
    <Link
      href="/giochi/album"
      data-figurina-gioco={!pronto ? "attesa" : figurina ? "presa" : "da-prendere"}
      className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-crema-scuro bg-white p-2 pr-3 text-notte hover:border-viola"
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl p-1.5 ${figurina ? "bg-[#EFE6FB]" : "border-2 border-dashed border-crema-scuro bg-crema opacity-60 grayscale"}`}
        aria-hidden
      >
        <FigurinaGioco slug={slug} skill={skill} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        {figurina ? (
          <>
            <span className="font-extrabold">Figurina presa</span>
            <span className="flex items-center gap-2 text-sm font-bold text-notte-tenue">
              <span role="img" aria-label={`${stelle} ${stelle === 1 ? "stella" : "stelle"} su 3`} data-stelle-figurina={stelle}>
                {"★".repeat(stelle)}
                <span className="opacity-30">{"★".repeat(3 - stelle)}</span>
              </span>
              {figurina.volte === 1 ? "giocato una volta" : `giocato ${figurina.volte} volte`}
            </span>
          </>
        ) : (
          <>
            <span className="font-extrabold">Finiscilo e prendi la figurina</span>
            <span className="text-sm font-bold text-notte-tenue">Va nell&apos;album di Mizi</span>
          </>
        )}
      </span>
      <span className="text-sm font-extrabold text-viola-forte" aria-hidden>
        Album →
      </span>
    </Link>
  );
}
