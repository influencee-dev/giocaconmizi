import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { adminValido } from "@/lib/admin";
import { SCHEDE } from "@/lib/directory";
import { chiaveScheda } from "@/lib/directory-db";
import { posizioni } from "@/lib/posizioni";
import { MenuAdmin } from "../MenuAdmin";
import { DaAttivare, NonDisponibile, Numero } from "../NonDisponibile";
import { calcolaPosizioni, correggiPosizione } from "./azioni";

/** Le posizioni dei locali sulla mappa: si calcolano con OpenStreetMap e si correggono a mano. */

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const metadata: Metadata = { title: "Posizioni", robots: { index: false, follow: false } };

const NOME_PRECISIONE = { indirizzo: "Indirizzo", nome: "Locale trovato", zona: "Solo la zona", manuale: "Messa a mano" } as const;

export default async function PosizioniPage({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  if (!(await adminValido(codice))) return <NonDisponibile />;
  const pos = await posizioni();
  const schede = [...new Map(SCHEDE.map((s) => [chiaveScheda(s), s])).values()].sort((a, b) => a.citta.localeCompare(b.citta));
  const conPosizione = schede.filter((s) => pos.has(chiaveScheda(s)));
  const zona = conPosizione.filter((s) => pos.get(chiaveScheda(s))?.precisione === "zona").length;

  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/posizioni" />
      <h1 className="text-3xl font-extrabold text-notte">Posizioni sulla mappa</h1>
      <p className="mt-2 max-w-2xl text-notte-tenue">
        Ogni giro cerca 12 locali su OpenStreetMap (una richiesta al secondo, come chiedono le sue regole): prima
        l&apos;indirizzo, poi il nome, poi la zona. Quelli trovati solo per zona hanno il segnaposto tratteggiato: puoi
        correggerli incollando le coordinate da Google Maps (tasto destro sul punto → copia i numeri).
      </p>

      {pos.size === 0 && (
        <div className="mt-6">
          <DaAttivare titolo="Se non succede niente">
            Serve la tabella delle posizioni: incolla di nuovo <code>supabase/backoffice.sql</code> nel SQL Editor di Supabase
            (la parte nuova è in fondo) e premi Run.
          </DaAttivare>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Numero valore={schede.length} etichetta="Schede" />
        <Numero valore={conPosizione.length} etichetta="Sulla mappa" />
        <Numero valore={zona} etichetta="Solo la zona" />
        <Numero valore={schede.length - conPosizione.length} etichetta="Da cercare" />
      </div>

      <form action={calcolaPosizioni.bind(null, codice)} className="mt-6">
        <button type="submit" className="rounded-2xl bg-viola px-6 py-4 text-lg font-extrabold text-white">
          Cerca le prossime 12 posizioni
        </button>
        <p className="mt-2 text-sm text-notte-tenue">Ci mette circa mezzo minuto. Ripeti finché «Da cercare» arriva a zero.</p>
      </form>

      <ul className="mt-8 flex flex-col gap-2">
        {schede.map((s) => {
          const p = pos.get(chiaveScheda(s));
          return (
            <li key={chiaveScheda(s)} className="flex flex-wrap items-center gap-3 rounded-2xl border border-notte/10 bg-white p-3 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block break-words font-extrabold text-notte">{s.nome}</span>
                <span className="block break-words text-notte-tenue">
                  {s.citta} · {s.zona} ·{" "}
                  {p ? (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=17/${p.lat}/${p.lng}`}
                      target="_blank"
                      rel="noopener"
                      className={`font-bold underline ${p.precisione === "zona" ? "text-arancione" : "text-verde"}`}
                    >
                      {NOME_PRECISIONE[p.precisione]}
                    </a>
                  ) : (
                    <span className="font-bold text-notte-tenue">da cercare</span>
                  )}
                </span>
              </span>
              <form action={correggiPosizione.bind(null, codice, chiaveScheda(s))} className="flex gap-2">
                <input
                  name="coordinate"
                  defaultValue={p ? `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}` : ""}
                  placeholder="45.464, 9.190"
                  aria-label={`Coordinate di ${s.nome}`}
                  className="w-44 rounded-xl border-2 border-crema-scuro px-2 py-1"
                />
                <button type="submit" className="rounded-xl border-2 border-notte px-3 py-1 font-bold text-notte">
                  Salva
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </Contenitore>
  );
}
