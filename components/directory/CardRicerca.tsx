import { MapPin } from "lucide-react";
import { Icona } from "@/components/icone";
import Link from "next/link";
import type { DatiCard } from "@/lib/directory";
import { esperienza, type IdEsperienza } from "@/lib/esperienze";
import { Illustrazione } from "./Illustrazione";
import { Etichetta } from "./Etichetta";
import { BottoneSalva } from "./BottoneSalva";

/**
 * La card dei risultati di ricerca, impostata come matrimonio.com: immagine
 * grande in alto con l'etichetta del tipo, poi nome, dove, cosa offre (con
 * evidenziate le esperienze filtrate), età, come si contatta e il bottone.
 * Colori e grassetti di Giocamizi.
 */
export function CardRicerca({ s, cercate = [] }: { s: DatiCard; cercate?: IdEsperienza[] }) {
  const offre = s.esperienze.filter((e) => e !== "coperto" && e !== "aperto");
  const ordinate = [...offre.filter((e) => cercate.includes(e)), ...offre.filter((e) => !cercate.includes(e))];
  const dove = s.esperienze.includes("aperto") ? "All'aperto" : s.esperienze.includes("coperto") ? "Al coperto" : null;
  const canali = [s.contatti.whatsapp && "WhatsApp", s.contatti.telefono && "telefono", s.contatti.sito && "sito"].filter(Boolean) as string[];

  return (
    <article
      data-risultato={s.chiave}
      className="group flex flex-col overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white transition-shadow hover:shadow-[0_16px_36px_-18px_rgba(31,36,48,0.45)]"
    >
      <div className="relative">
        <Link href={s.href} className="block" tabIndex={-1} aria-hidden>
          <Illustrazione colore={s.etichetta.fondo} icona={s.icona} alta="h-40" />
        </Link>
        <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Etichetta e={s.etichetta} />
          {s.verificata && <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#2E7D4A]">✓ Verificata</span>}
        </span>
        <span className="absolute right-3 top-3">
          <BottoneSalva chiave={s.chiave} nome={s.nome} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-black leading-tight text-notte">
          <Link href={s.href} className="hover:text-viola">
            {s.nome}
          </Link>
        </h3>
        <p className="flex items-start gap-1.5 text-sm font-bold text-notte-tenue">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-viola" strokeWidth={2.4} aria-hidden />
          <span>
            {s.zona}
            {dove && ` · ${dove}`}
          </span>
        </p>
        {/* La riga delle caratteristiche, come i metri quadri e i locali di immobiliare.it. */}
        {(ordinate.length > 0 || s.eta) && (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 border-y border-notte/10 py-2 text-[13px] font-extrabold text-notte" aria-label="Cosa offre">
            {s.eta && (
              <li className="flex items-center gap-1">
                <Icona nome="bebe" className="h-4 w-4" /> {s.eta}
              </li>
            )}
            {ordinate.slice(0, 3).map((id: IdEsperienza) => (
              <li key={id} className={`flex items-center gap-1 ${cercate.includes(id) ? "text-verde" : ""}`}>
                <Icona nome={esperienza(id).icona} className="h-4 w-4" /> {esperienza(id).nome}
              </li>
            ))}
            {ordinate.length > 3 && <li className="text-notte-tenue">+{ordinate.length - 3}</li>}
          </ul>
        )}
        <p className="line-clamp-2 text-sm leading-relaxed text-notte-tenue">{s.descrizione}</p>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <span className="text-xs font-bold text-notte-tenue">{canali.length ? `Contatti: ${canali.join(", ")}` : "Contatti in arrivo"}</span>
          <Link href={s.href} className="rounded-xl bg-viola py-2.5 text-center text-sm font-black text-white transition-colors group-hover:bg-notte">
            Vedi la scheda
          </Link>
        </div>
      </div>
    </article>
  );
}
