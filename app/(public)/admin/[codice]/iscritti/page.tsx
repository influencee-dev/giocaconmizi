import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { adminValido } from "@/lib/admin";
import { iscrittiAdmin } from "@/lib/brevo";
import { MenuAdmin } from "../MenuAdmin";
import { DaAttivare, NonDisponibile, Numero } from "../NonDisponibile";
import { EsportaCsv } from "./EsportaCsv";

/** Gli iscritti alle email (liste Brevo «Giocamizi · Genitori» e «Insegnanti»). */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Iscritti", robots: { index: false, follow: false } };

const data = (d?: string) => (d ? new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" }) : "—");

export default async function IscrittiPage({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  if (!(await adminValido(codice))) return <NonDisponibile />;
  const dati = await iscrittiAdmin();
  const settimana = new Date(Date.now() - 7 * 86400000).toISOString();

  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/iscritti" />
      <h1 className="text-3xl font-extrabold text-notte">Iscritti</h1>
      {!dati ? (
        <div className="mt-6">
          <DaAttivare titolo="Brevo non è collegato">
            Su Vercel → progetto giocaconmizi → Settings → Environment Variables aggiungi <code>BREVO_API_KEY</code> (Brevo →
            SMTP &amp; API → Chiavi API → Genera), poi Redeploy. Le liste si creano da sole al primo iscritto.
          </DaAttivare>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Numero valore={dati.totali.genitori.iscritti} etichetta="Genitori iscritti" />
            <Numero valore={dati.totali.insegnanti.iscritti} etichetta="Insegnanti iscritti" />
            <Numero valore={dati.elenco.filter((i) => i.creato >= settimana).length} etichetta="Nuovi, 7 giorni" />
            <Numero valore={dati.totali.genitori.disiscritti + dati.totali.insegnanti.disiscritti} etichetta="Disiscritti" />
          </div>
          <p className="mt-3 text-sm text-notte-tenue">
            Qui compaiono solo gli iscritti che hanno confermato dall&apos;email (doppio opt-in). Dati personali: non
            condividere schermate di questa pagina.
          </p>
          <div className="mt-6">
            <EsportaCsv righe={dati.elenco} />
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {dati.elenco.slice(0, 100).map((i) => (
              <li key={`${i.lista}-${i.email}`} className="rounded-2xl border border-notte/10 bg-white p-3 text-sm">
                <p className="truncate font-extrabold text-notte">
                  {i.email} {i.disiscritto && <span className="text-rosso">· disiscritto</span>}
                </p>
                <p className="text-notte-tenue">
                  {i.lista} · {i.citta || "città —"} · iscritto il {data(i.creato)} · consenso {data(i.consensoData)} ({i.consensoFonte ?? i.origine ?? "fonte —"})
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </Contenitore>
  );
}
