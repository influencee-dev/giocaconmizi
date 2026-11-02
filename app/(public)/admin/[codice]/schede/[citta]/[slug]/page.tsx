import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore } from "@/components/ui";
import { adminValido } from "@/lib/admin";
import { SCHEDE, percorsoScheda } from "@/lib/directory";
import { adminDati, chiaveScheda } from "@/lib/directory-db";
import { gscConfigurato, ricerchePerPagina } from "@/lib/gsc";
import { url } from "@/lib/seo";
import { EVENTI, NOME_EVENTO, contatti, perScheda, statisticheAdmin, type Evento } from "@/lib/statistiche";
import { MenuAdmin } from "../../../MenuAdmin";
import { DaAttivare, NonDisponibile, Numero } from "../../../NonDisponibile";

/** Il dettaglio di una scheda: traffico giorno per giorno, contatti, ricerche Google, risposte del locale. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Scheda", robots: { index: false, follow: false } };

const GIORNI = 30;

type P = { params: Promise<{ codice: string; citta: string; slug: string }> };

export default async function SchedaAdminPage({ params }: P) {
  const { codice, citta, slug } = await params;
  if (!(await adminValido(codice))) return <NonDisponibile />;
  const s = SCHEDE.find((x) => x.cittaSlug === citta && x.slug === slug);
  if (!s) notFound();
  const chiave = chiaveScheda(s);
  const indirizzo = url(percorsoScheda(s));

  const [righe, dati, ricerche] = await Promise.all([
    statisticheAdmin(codice, GIORNI),
    adminDati(codice),
    ricerchePerPagina(indirizzo),
  ]);
  const mie = (righe ?? []).filter((r) => r.chiave === chiave);
  const totali = perScheda(mie).get(chiave) ?? (Object.fromEntries(EVENTI.map((e) => [e, 0])) as Record<Evento, number>);

  // Un giorno per colonna, dal più vecchio a oggi.
  const giorni = Array.from({ length: GIORNI }, (_, i) =>
    new Date(Date.now() - (GIORNI - 1 - i) * 86400000).toISOString().slice(0, 10),
  );
  const perGiorno = giorni.map((g) => {
    const delGiorno = mie.filter((r) => r.giorno === g);
    const viste = delGiorno.filter((r) => r.evento === "vista").reduce((a, r) => a + r.conteggio, 0);
    const clic = delGiorno.filter((r) => r.evento !== "vista" && r.evento !== "invito").reduce((a, r) => a + r.conteggio, 0);
    return { g, viste, clic };
  });
  const massimo = Math.max(1, ...perGiorno.map((d) => d.viste));
  const invito = dati?.inviti.find((i) => i.chiave === chiave);
  const risposte = (dati?.richieste ?? []).filter((r) => r.chiave === chiave);

  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/schede" />
      <p className="text-sm font-bold text-notte-tenue">
        <Link href={`/admin/${codice}/schede`} className="underline">
          Schede
        </Link>{" "}
        › {s.citta}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold text-notte">{s.nome}</h1>
      <p className="mt-1 text-notte-tenue">
        {s.categoria.nome} · {s.citta} ({s.zona}) ·{" "}
        <a href={percorsoScheda(s)} target="_blank" rel="noopener" className="font-bold text-viola underline">
          apri la scheda pubblica
        </a>
      </p>

      <h2 className="mt-8 text-xl font-extrabold text-notte">Traffico, ultimi {GIORNI} giorni</h2>
      {righe === null ? (
        <div className="mt-3">
          <DaAttivare titolo="Contatori non attivi">
            Incolla <code>supabase/backoffice.sql</code> nel SQL Editor di Supabase: da lì in poi i numeri arrivano da soli.
          </DaAttivare>
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-6">
            {EVENTI.map((e) => (
              <Numero key={e} valore={totali[e]} etichetta={NOME_EVENTO[e]} />
            ))}
          </div>
          <p className="mt-3 text-sm text-notte-tenue">
            Tasso di contatto: {totali.vista ? Math.round((contatti(totali) / totali.vista) * 100) : 0}% delle visite tocca un contatto.
          </p>
          <svg viewBox={`0 0 ${GIORNI * 12} 120`} className="mt-4 h-40 w-full rounded-[1.4rem] border border-notte/10 bg-white p-2" role="img" aria-label="Visite e contatti per giorno">
            {perGiorno.map((d, i) => (
              <g key={d.g}>
                <title>{`${d.g}: ${d.viste} visite, ${d.clic} contatti`}</title>
                <rect x={i * 12 + 1} y={110 - (d.viste / massimo) * 100} width="10" height={(d.viste / massimo) * 100} rx="2" fill="#E2D6F5" />
                <rect x={i * 12 + 3} y={110 - (d.clic / massimo) * 100} width="6" height={(d.clic / massimo) * 100} rx="2" fill="#9B6DD6" />
              </g>
            ))}
            <line x1="0" y1="110" x2={GIORNI * 12} y2="110" stroke="#1F2430" strokeOpacity="0.2" />
          </svg>
          <p className="mt-1 text-xs text-notte-tenue">Barra chiara: visite. Barra viola: clic su WhatsApp, telefono, sito e social.</p>
        </>
      )}

      <h2 className="mt-10 text-xl font-extrabold text-notte">Ricerche Google che portano qui</h2>
      {!gscConfigurato() ? (
        <div className="mt-3">
          <DaAttivare titolo="Collega Search Console (una volta sola)">
            <ol className="list-decimal pl-5">
              <li>Google Cloud Console → crea un progetto → abilita «Google Search Console API».</li>
              <li>IAM → Service account → creane uno → Chiavi → Aggiungi chiave JSON (si scarica un file).</li>
              <li>Search Console → giocamizi.it → Impostazioni → Utenti → aggiungi l&apos;email del service account con permesso «Limitato».</li>
              <li>Vercel → progetto → Settings → Environment Variables → <code>GSC_SERVICE_ACCOUNT</code> = tutto il contenuto del file JSON. Poi Redeploy.</li>
            </ol>
          </DaAttivare>
        </div>
      ) : ricerche === null ? (
        <p className="mt-3 text-notte-tenue">Search Console non risponde ora: riprova più tardi.</p>
      ) : ricerche.length === 0 ? (
        <p className="mt-3 text-notte-tenue">Ancora nessuna ricerca registrata per questa pagina (servono di solito qualche settimana).</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-[1.4rem] border border-notte/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-notte-tenue">
              <tr>
                <th className="p-3">Ricerca</th>
                <th className="p-3">Clic</th>
                <th className="p-3">Impressioni</th>
                <th className="p-3">Posizione</th>
              </tr>
            </thead>
            <tbody>
              {ricerche.map((r) => (
                <tr key={r.query} className="border-t border-notte/10">
                  <td className="p-3 font-bold text-notte">{r.query}</td>
                  <td className="p-3">{r.clic}</td>
                  <td className="p-3">{r.impressioni}</td>
                  <td className="p-3">{r.posizione}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-10 text-xl font-extrabold text-notte">Rapporto con l&apos;attività</h2>
      <p className="mt-2 text-notte-tenue">
        Link personale: {invito ? `${invito.stato}${invito.aperto_il ? `, aperto il ${new Date(invito.aperto_il).toLocaleDateString("it-IT")}` : ""}` : "non ancora inviato"}.
        {" "}Risposte del locale: {risposte.length}.
      </p>
      <p className="mt-2 text-sm text-notte-tenue">
        Le richieste di informazioni delle famiglie (modulo «Chiedi informazioni») arriveranno qui con la fase D del piano.
      </p>
    </Contenitore>
  );
}
