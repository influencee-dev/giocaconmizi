import type { Metadata } from "next";
import Link from "next/link";
import { SCHEDE, percorsoScheda } from "@/lib/directory";
import { adminDati } from "@/lib/directory-db";
import { Contenitore } from "@/components/ui";
import { decidi } from "./azioni";

/** Il pannello di Giorgia: le risposte dei locali da accettare e lo stato degli inviti. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pannello attività", robots: { index: false, follow: false } };

const ETICHETTA = { approva: "Approva la scheda", modifica: "Modifiche", rimuovi: "Chiede la rimozione" } as const;
const quando = (d: string) => new Date(d).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function AdminPage({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  const dati = await adminDati(codice);
  if (!dati) {
    return (
      <Contenitore className="py-16">
        <h1 className="text-3xl font-extrabold text-notte">Pannello non disponibile</h1>
        <p className="mt-4 text-notte-tenue">Il codice non è valido, oppure il database non risponde (forse è in pausa su Supabase).</p>
      </Contenitore>
    );
  }
  const scheda = (chiave: string) => SCHEDE.find((s) => `${s.cittaSlug}/${s.slug}` === chiave);
  const attesa = dati.richieste.filter((r) => r.stato === "in_attesa");
  const conta = (stato: string) => dati.inviti.filter((i) => i.stato === stato).length;

  return (
    <Contenitore largo className="py-10">
      <h1 className="text-3xl font-extrabold text-notte">Pannello attività</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["Inviti", dati.inviti.length],
          ["Non aperti", conta("inviato")],
          ["Aperti", conta("aperto")],
          ["Approvate o modificate", conta("approvato") + conta("modifica")],
          ["Rimozioni", conta("rimozione")],
        ].map(([t, n]) => (
          <div key={t} className="rounded-morbido border-2 border-crema-scuro bg-white p-4">
            <p className="text-3xl font-extrabold text-notte">{n}</p>
            <p className="text-sm font-bold text-notte-tenue">{t}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-extrabold text-notte">Da decidere ({attesa.length})</h2>
      {attesa.length === 0 && <p className="mt-3 text-notte-tenue">Nessuna risposta in attesa.</p>}
      <div className="mt-4 flex flex-col gap-4">
        {attesa.map((r) => {
          const s = scheda(r.chiave);
          return (
            <article key={r.id} className="rounded-morbido border-2 border-crema-scuro bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-xl font-extrabold text-notte">
                  {s?.nome ?? r.chiave} <span className="text-base font-bold text-notte-tenue">· {s?.citta}</span>
                </p>
                <span className={`rounded-bolla px-3 py-1 text-xs font-extrabold ${r.tipo === "rimuovi" ? "bg-rosso/10 text-rosso" : "bg-viola/10 text-viola"}`}>
                  {ETICHETTA[r.tipo]}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-notte-tenue">
                {r.referente || "—"} · {r.email} · {quando(r.creato_il)} · termini {r.termini_accettati ? "accettati" : "no"}
              </p>
              {Object.keys(r.dati).length > 0 && (
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {Object.entries(r.dati).map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-crema px-3 py-2">
                      <dt className="text-xs font-extrabold uppercase text-notte-tenue">{k}</dt>
                      <dd className="whitespace-pre-line text-sm text-notte">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {s && (
                <Link href={percorsoScheda(s)} target="_blank" className="mt-3 inline-block text-sm font-extrabold text-viola">
                  Vedi la scheda attuale ›
                </Link>
              )}
              <form action={decidi.bind(null, "rifiutata")} className="mt-4 flex flex-wrap items-center gap-2">
                <input type="hidden" name="codice" value={codice} />
                <input type="hidden" name="id" value={r.id} />
                <textarea name="nota" rows={1} placeholder="Nota (facoltativa)" className="min-w-0 flex-1 resize-y rounded-xl border-2 border-crema-scuro px-3 py-2 text-sm" />
                <button formAction={decidi.bind(null, "accettata")} className="rounded-bolla bg-verde px-5 py-2.5 font-extrabold text-white">
                  {r.tipo === "rimuovi" ? "Togli la scheda" : "Pubblica"}
                </button>
                <button formAction={decidi.bind(null, "rifiutata")} className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-2.5 font-extrabold text-notte">
                  Rifiuta
                </button>
              </form>
            </article>
          );
        })}
      </div>

      <h2 className="mt-10 text-2xl font-extrabold text-notte">Storico</h2>
      <ul className="mt-3 flex flex-col gap-1 text-sm">
        {dati.richieste.filter((r) => r.stato !== "in_attesa").map((r) => (
          <li key={r.id} className="text-notte-tenue">
            {quando(r.creato_il)} · {scheda(r.chiave)?.nome ?? r.chiave} · {ETICHETTA[r.tipo]} · <strong>{r.stato}</strong>
          </li>
        ))}
      </ul>
    </Contenitore>
  );
}
