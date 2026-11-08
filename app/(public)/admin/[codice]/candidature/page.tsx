import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIE, SCHEDE, percorsoScheda } from "@/lib/directory";
import { adminCandidature, chiaveScheda } from "@/lib/directory-db";
import { adminValido } from "@/lib/admin";
import { Contenitore } from "@/components/ui";
import { MenuAdmin } from "../MenuAdmin";
import { NonDisponibile } from "../NonDisponibile";
import { decidiCandidatura } from "./azioni";
import { MandaLink } from "./MandaLink";

/**
 * Le attività che si sono proposte da /aggiungi-attivita. Niente va online da
 * solo: «Accetta» vuol dire «la verifico e la aggiungo» (attività nuova: va
 * controllata col sito ufficiale e inserita in lib/feste.ts; accesso: si manda
 * il link personale della scheda dalla sezione Schede).
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Candidature", robots: { index: false, follow: false } };

const quando = (d: string) => new Date(d).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const ETICHETTE: Record<string, string> = {
  nome: "Nome", categoria: "Categoria", citta: "Città", indirizzo: "Indirizzo o zona", descrizione: "Cosa fanno", eta: "Età",
  sito: "Sito", instagram: "Social", telefono: "Telefono", ruolo: "Ruolo", messaggio: "Messaggio",
};

export default async function Candidature({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  if (!(await adminValido(codice))) return <NonDisponibile />;
  const elenco = await adminCandidature(codice);

  if (!elenco) {
    return (
      <Contenitore largo className="py-10">
        <MenuAdmin codice={codice} attivo="/candidature" />
        <h1 className="text-3xl font-extrabold text-notte">Candidature</h1>
        <p className="mt-4 max-w-2xl text-notte-tenue">
          Il database non risponde alle candidature: va incollato in Supabase il file <strong>supabase/candidature.sql</strong> (SQL Editor, Run).
        </p>
      </Contenitore>
    );
  }
  const attesa = elenco.filter((c) => c.stato === "in_attesa");

  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/candidature" />
      <h1 className="text-3xl font-extrabold text-notte">Candidature</h1>
      <p className="mt-2 max-w-2xl text-notte-tenue">
        Le attività che si sono proposte dalla pagina{" "}
        <Link href="/aggiungi-attivita" target="_blank" className="font-bold text-viola underline">
          Aggiungi la tua attività
        </Link>
        . Accettare non pubblica nulla da solo: un&apos;attività nuova va verificata sul sito ufficiale e aggiunta, un accesso si chiude con «Manda il link personale» (parte per email; se Brevo non è collegato ti mostra il link da copiare).
      </p>

      <h2 className="mt-8 text-2xl font-extrabold text-notte">Da decidere ({attesa.length})</h2>
      {attesa.length === 0 && <p className="mt-3 text-notte-tenue">Nessuna candidatura in attesa.</p>}
      <div className="mt-4 flex flex-col gap-4">
        {attesa.map((c) => {
          const s = c.chiave ? SCHEDE.find((x) => chiaveScheda(x) === c.chiave) : undefined;
          const cat = CATEGORIE.find((x) => x.slug === c.dati.categoria);
          return (
            <article key={c.id} className="rounded-[1.4rem] border border-notte/10 bg-white p-5" data-candidatura={c.tipo}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="break-words text-xl font-extrabold text-notte">
                  {c.dati.nome ?? "—"} <span className="text-base font-bold text-notte-tenue">· {s?.citta ?? c.dati.citta}</span>
                </p>
                <span className={`rounded-bolla px-3 py-1 text-xs font-extrabold ${c.tipo === "nuova" ? "bg-verde/15 text-verde" : "bg-viola/10 text-viola"}`}>
                  {c.tipo === "nuova" ? `Attività nuova${cat ? ` · ${cat.nome}` : ""}` : "Chiede l'accesso alla scheda"}
                </span>
              </div>
              <p className="mt-1 break-words text-sm font-semibold text-notte-tenue">
                {c.referente} · {c.email} · {quando(c.creato_il)}
              </p>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {Object.entries(c.dati)
                  .filter(([k]) => k !== "nome" && k !== "categoria")
                  .map(([k, v]) => (
                    <div key={k} className={`rounded-xl bg-crema px-3 py-2 ${k === "descrizione" || k === "messaggio" ? "sm:col-span-2" : ""}`}>
                      <dt className="text-xs font-extrabold uppercase text-notte-tenue">{ETICHETTE[k] ?? k}</dt>
                      <dd className="whitespace-pre-line break-words text-sm text-notte">{v}</dd>
                    </div>
                  ))}
              </dl>
              {s && (
                <Link href={percorsoScheda(s)} target="_blank" className="mt-3 inline-block text-sm font-extrabold text-viola">
                  Vedi la scheda ›
                </Link>
              )}
              {c.tipo === "accesso" && c.chiave && <MandaLink codice={codice} id={c.id} email={c.email} />}
              <form action={decidiCandidatura.bind(null, "rifiutata")} className="mt-4 flex flex-wrap items-center gap-2">
                <input type="hidden" name="codice" value={codice} />
                <input type="hidden" name="id" value={c.id} />
                <textarea name="nota" rows={1} placeholder="Nota (facoltativa)" className="min-w-0 flex-1 resize-y rounded-xl border-2 border-crema-scuro px-3 py-2 text-sm" />
                <button formAction={decidiCandidatura.bind(null, "accettata")} className="rounded-bolla bg-verde px-5 py-2.5 font-extrabold text-white" data-accetta>
                  Accetta
                </button>
                <button formAction={decidiCandidatura.bind(null, "rifiutata")} className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-2.5 font-extrabold text-notte">
                  Rifiuta
                </button>
              </form>
            </article>
          );
        })}
      </div>

      <h2 className="mt-10 text-2xl font-extrabold text-notte">Storico</h2>
      <ul className="mt-3 flex flex-col gap-1 text-sm">
        {elenco.filter((c) => c.stato !== "in_attesa").map((c) => (
          <li key={c.id} className="break-words text-notte-tenue" data-storico>
            {quando(c.creato_il)} · {c.dati.nome} · {c.tipo === "nuova" ? "nuova" : "accesso"} · <strong>{c.stato}</strong>
            {c.nota ? ` · ${c.nota}` : ""}
          </li>
        ))}
      </ul>
    </Contenitore>
  );
}
