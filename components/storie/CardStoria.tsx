import Link from "next/link";
import { Icone, type NomeIcona } from "@/components/icone";

/**
 * Card di una storia, con la fascia illustrata come le card dei giochi:
 * prima erano solo testo e la pagina sembrava un elenco di documenti.
 * L'icona gira su una piccola giostra, scelta dall'indice: stabile tra un
 * render e l'altro, diversa tra una card e la vicina.
 */

const GIOSTRA: NomeIcona[] = ["libro", "stella", "gatto", "pesce", "razzo", "torta", "pinguino", "mucca"];

export function CardStoria({
  slug,
  titolo,
  sommario,
  eta,
  minuti,
  indice,
}: {
  slug: string;
  titolo: string;
  sommario?: string;
  /** Testo pronto, es. "5 anni" — assente negli hub già filtrati per età. */
  eta?: string;
  minuti: number;
  indice: number;
}) {
  return (
    <Link
      href={`/storie/${slug}`}
      data-tap
      className="flex flex-col gap-2 overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white p-5 transition-colors hover:border-viola"
    >
      <span aria-hidden className="-mx-5 -mt-5 mb-1 flex h-16 items-center justify-center bg-crema p-2">
        <Icone nomi={[GIOSTRA[indice % GIOSTRA.length]]} lato="h-10 w-10" />
      </span>
      <span className="text-xl font-extrabold text-notte">{titolo}</span>
      {sommario && <span className="text-notte-tenue">{sommario}</span>}
      <span className="mt-auto pt-2 text-sm font-bold text-viola">
        {eta ? `${eta} · ` : ""}{minuti} minuti
      </span>
    </Link>
  );
}
