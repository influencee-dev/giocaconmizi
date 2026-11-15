"use client";

import Link from "next/link";
import { GIOCHI_PER_COCCARDA, fattiOggi, useAlbum } from "@/lib/album";

/** La fascia in testa al catalogo dei giochi: l'album di Mizi a colpo d'occhio. */
export function FasciaAlbum({ totale }: { totale: number }) {
  const { album, pronto } = useAlbum();
  const figurine = Object.keys(album.giochi).length;
  const oggi = fattiOggi(album);

  return (
    <Link
      href="/giochi/album"
      className="mt-6 flex min-h-16 items-center gap-3 rounded-morbido border-2 border-viola/40 bg-[#EFE6FB] p-3 pr-4 text-notte hover:border-viola"
      data-fascia-album={pronto ? figurine : "attesa"}
    >
      <span className="text-3xl" aria-hidden>
        📒
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-lg font-extrabold leading-tight">
          {figurine === 0 ? "L'album di Mizi: ogni gioco finito regala una figurina" : `L'album di Mizi: ${figurine} di ${totale} figurine`}
        </span>
        <span className="flex items-center gap-2 text-sm font-bold text-notte-tenue">
          <span className="flex gap-1" aria-hidden>
            {Array.from({ length: GIOCHI_PER_COCCARDA }, (_, i) => (
              <span key={i} className={`h-3 w-3 rounded-full ${i < oggi ? "bg-arancione" : "bg-white"}`} />
            ))}
          </span>
          {oggi >= GIOCHI_PER_COCCARDA ? "coccarda di oggi presa" : "tre giochi diversi oggi = una coccarda"}
        </span>
      </span>
      <span className="font-extrabold text-viola-forte" aria-hidden>
        Apri →
      </span>
    </Link>
  );
}
