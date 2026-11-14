import Link from "next/link";
import { Globe, MapPin } from "lucide-react";
import { Illustrazione } from "@/components/directory/Illustrazione";
import { LogoRisorsa } from "./CardRisorsa";
import { percorsoRisorsa } from "@/lib/risorse-educative";
import { categoriaDiRisorsa } from "@/lib/risorse-categorie";
import type { RisorsaVista } from "@/lib/risorse-reclamo";

/**
 * La card di una risorsa nella directory, gemella di CardRicerca delle feste:
 * fascia illustrata con l'etichetta della categoria, nome, dove, descrizione
 * e il bottone verso la scheda. Il logo compare solo se l'ha caricato la
 * realtà (mai loghi presi dai siti).
 */
export function CardRisorsaDirectory({ r }: { r: RisorsaVista }) {
  const cat = categoriaDiRisorsa(r);
  const href = percorsoRisorsa(r);
  return (
    <article
      data-risultato={r.slug}
      className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white transition-shadow hover:shadow-[0_16px_36px_-18px_rgba(31,36,48,0.45)]"
    >
      <div className="relative">
        <Link href={href} className="block" tabIndex={-1} aria-hidden>
          <Illustrazione colore={cat.colore} icona={cat.icona} alta="h-36" />
        </Link>
        <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-notte">{cat.breve}</span>
          {r.reclamata && <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#2E7D4A]">✓ Verificata</span>}
        </span>
        {r.logo && (
          <span className="absolute bottom-3 right-3">
            <LogoRisorsa risorsa={r} logo lato={52} />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-black leading-tight text-notte [overflow-wrap:anywhere]">
          <Link href={href} className="hover:text-viola">
            {r.nome}
          </Link>
        </h3>
        <p className="flex items-start gap-1.5 text-sm font-bold text-notte-tenue">
          {cat.ambito === "territorio" || r.localita ? (
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-viola" strokeWidth={2.4} aria-hidden />
          ) : (
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-viola" strokeWidth={2.4} aria-hidden />
          )}
          <span>{r.localita ?? "Online, in tutta Italia"}</span>
        </p>
        <p className="line-clamp-3 text-sm leading-relaxed text-notte-tenue">{r.descrizione}</p>
        <p className="line-clamp-2 text-xs font-bold text-notte-tenue">Per chi: {r.perChi}</p>
        <div className="mt-auto pt-2">
          <Link href={href} className="block rounded-xl bg-viola py-2.5 text-center text-sm font-black text-white transition-colors group-hover:bg-notte">
            Vedi la scheda
          </Link>
        </div>
      </div>
    </article>
  );
}
