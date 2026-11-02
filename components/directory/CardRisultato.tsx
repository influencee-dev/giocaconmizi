import Link from "next/link";
import type { DatiCard } from "@/lib/directory";
import { esperienza, type IdEsperienza } from "@/lib/esperienze";
import { Illustrazione } from "./Illustrazione";
import { Etichetta } from "./Etichetta";

/**
 * La card orizzontale dei listing, in stile Booking: illustrazione a
 * sinistra, a destra etichetta, nome, zona, cosa offre (con evidenziate le
 * esperienze cercate), descrizione e come si contatta.
 */
export function CardRisultato({ s, cercate = [] }: { s: DatiCard; cercate?: IdEsperienza[] }) {
  const mostrate = [...s.esperienze.filter((e) => cercate.includes(e)), ...s.esperienze.filter((e) => !cercate.includes(e))].filter(
    (e) => e !== "coperto" && e !== "aperto",
  );
  const dove = s.esperienze.includes("aperto") ? "All'aperto" : s.esperienze.includes("coperto") ? "Al coperto" : null;
  const canali = [
    s.contatti.whatsapp && "WhatsApp",
    s.contatti.telefono && "telefono",
    s.contatti.sito && "sito",
    s.contatti.social && "social",
  ].filter(Boolean) as string[];

  return (
    <article
      data-risultato={s.chiave}
      className="group grid overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white transition-shadow hover:shadow-[0_14px_34px_-16px_rgba(31,36,48,0.4)] sm:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)]"
    >
      <Link href={s.href} className="relative block" tabIndex={-1} aria-hidden>
        <Illustrazione colore={s.etichetta.fondo} icona={s.icona} alta="h-28 sm:h-full sm:min-h-52" />
        <span className="absolute left-3 top-3 text-3xl drop-shadow" aria-hidden>
          {s.etichetta.icona}
        </span>
      </Link>
      <div className="flex min-w-0 flex-col gap-2.5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Etichetta e={s.etichetta} />
          {s.verificata && (
            <span className="rounded-full bg-[#E3F4E8] px-2.5 py-0.5 text-xs font-extrabold text-[#2E7D4A]">✓ Verificata</span>
          )}
          {s.eta && <span className="rounded-full bg-crema px-2.5 py-0.5 text-xs font-extrabold text-notte">{s.eta}</span>}
        </div>
        <h3 className="text-xl font-black leading-tight text-notte">
          <Link href={s.href} className="hover:text-viola">
            {s.nome}
          </Link>
        </h3>
        <p className="flex items-start gap-1.5 text-sm font-bold text-notte-tenue">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="#9B6DD6" strokeWidth="2" aria-hidden>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>
            {s.zona}, {s.citta}
            {dove && ` · ${dove}`}
          </span>
        </p>
        {mostrate.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Cosa offre">
            {mostrate.slice(0, 5).map((id) => {
              const e = esperienza(id);
              const cercata = cercate.includes(id);
              return (
                <li
                  key={id}
                  className={`rounded-lg px-2 py-1 text-xs font-extrabold ${cercata ? "bg-verde text-white" : "bg-[#E3F4E7] text-[#2E7D4A]"}`}
                >
                  ✓ {e.nome}
                </li>
              );
            })}
            {mostrate.length > 5 && <li className="px-1 py-1 text-xs font-extrabold text-notte-tenue">+{mostrate.length - 5}</li>}
          </ul>
        )}
        <p className="line-clamp-2 text-sm leading-relaxed text-notte-tenue">{s.descrizione}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-notte/10 pt-3">
          <span className="text-xs font-bold text-notte-tenue">
            {canali.length ? `Contatti: ${canali.join(", ")}` : "Contatti in arrivo"}
          </span>
          <Link href={s.href} className="rounded-xl bg-viola px-4 py-2 text-sm font-extrabold text-white group-hover:bg-notte">
            Vedi la scheda
          </Link>
        </div>
      </div>
    </article>
  );
}
