import Link from "next/link";
import type { DatiCard } from "@/lib/directory";
import { Illustrazione } from "./Illustrazione";

/** La card di un'attività nei listing (componente «Card attività» del Figma). */
export function CardAttivita({ s }: { s: DatiCard }) {
  return (
    <Link
      href={s.href}
      data-tap
      className="flex flex-col overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white transition-colors hover:border-viola"
    >
      <div className="relative">
        <Illustrazione colore={s.colore} icona={s.icona} />
        <span className="absolute bottom-3 left-3 rounded-bolla bg-white px-3 py-1 text-xs font-extrabold text-viola">
          Fa feste di compleanno
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-lg font-extrabold text-notte">{s.nome}</span>
        <span className="flex items-start gap-1.5 text-sm font-bold text-notte-tenue">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="#9B6DD6" strokeWidth="2" aria-hidden>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{s.zona} · {s.tipo}</span>
        </span>
        <p className="text-sm leading-relaxed text-notte-tenue">{s.descrizione}</p>
        <span className="mt-auto flex items-center justify-between border-t-2 border-crema pt-3 text-sm font-extrabold">
          <span className="text-notte">{s.citta}</span>
          <span className="text-viola">Vedi scheda ›</span>
        </span>
      </div>
    </Link>
  );
}
