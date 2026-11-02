import { Contenitore } from "@/components/ui";

/** Codice sbagliato o database in pausa: stessa risposta, nessun indizio in più. */
export function NonDisponibile() {
  return (
    <Contenitore className="py-16">
      <h1 className="text-3xl font-extrabold text-notte">Pannello non disponibile</h1>
      <p className="mt-4 text-notte-tenue">Il codice non è valido, oppure il database non risponde (forse è in pausa su Supabase).</p>
    </Contenitore>
  );
}

/** Un numero grande con l'etichetta sotto. */
export function Numero({ valore, etichetta }: { valore: number | string; etichetta: string }) {
  return (
    <div className="rounded-[1.4rem] border border-notte/10 bg-white p-4">
      <p className="text-3xl font-extrabold text-notte">{valore}</p>
      <p className="text-sm font-bold text-notte-tenue">{etichetta}</p>
    </div>
  );
}

/** Un riquadro "da attivare" con i passi per Giorgia. */
export function DaAttivare({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.4rem] border-2 border-dashed border-giallo bg-[#FFF3CF] p-5 text-notte" data-da-attivare>
      <p className="font-extrabold">{titolo}</p>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
