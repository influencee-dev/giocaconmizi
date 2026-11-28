import { dbServizio } from "@/lib/supabase/servizio";
import type { Metadata } from "next";
import { adminValido } from "@/lib/directory/admin";
import { Contenitore } from "@/components/ui";
import { MenuAdmin } from "../MenuAdmin";
import { NonDisponibile, Numero } from "../NonDisponibile";

/** Cosa cercano le famiglie con l'AI (tracciamento deciso da Giorgia il 27/11/2026). */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ricerche con l'AI", robots: { index: false, follow: false } };

type Riga = { quando: string; tipo: string; domanda: string; risultati: number; collegata: boolean; esito: string };
const quando = (d: string) => new Date(d).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function RicercheAi({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  if (!(await adminValido(codice))) return <NonDisponibile />;
  let righe: Riga[] = [];
  const db = dbServizio();
  if (db) {
    const { data } = await db.rpc("ai_admin_ricerche", { p_codice: codice });
    righe = Array.isArray(data) ? data : [];
  }
  const oggi = new Date().toDateString();
  const diOggi = righe.filter((r) => new Date(r.quando).toDateString() === oggi).length;
  const senza = righe.filter((r) => r.risultati === 0).length;
  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/ricerche-ai" />
      <h1 className="text-3xl font-extrabold text-notte">Ricerche con l&apos;AI</h1>
      <p className="mt-2 max-w-2xl text-notte-tenue">
        Per ora la ricerca è gratis per tutti: qui vedi cosa chiedono le famiglie. Si salva la domanda, mai chi l&apos;ha fatta.
        Le ricerche senza risultati dicono cosa manca sul sito.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Numero valore={righe.length} etichetta="Ultime ricerche (max 300)" />
        <Numero valore={diOggi} etichetta="Oggi" />
        <Numero valore={senza} etichetta="Senza risultati" />
        <Numero valore={righe.filter((r) => r.collegata).length} etichetta="Da mamme collegate" />
      </div>
      <ul className="mt-6 flex flex-col gap-2" data-elenco-ricerche>
        {righe.map((r, i) => (
          <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-notte/10 bg-white px-4 py-3">
            <span className="font-bold text-notte">{r.domanda}</span>
            <span className={`text-sm font-extrabold ${r.risultati === 0 ? "text-rosso" : "text-notte-tenue"}`}>
              {r.esito === "errore" ? "errore" : `${r.risultati} risultati`} · {quando(r.quando)}
            </span>
          </li>
        ))}
        {righe.length === 0 && <li className="text-notte-tenue">Ancora nessuna ricerca.</li>}
      </ul>
    </Contenitore>
  );
}
