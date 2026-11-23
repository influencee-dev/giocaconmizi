import type { Metadata } from "next";
import Link from "next/link";
import { SOCIETA, TITOLARE } from "@/lib/contenuti/legal";
import { Contenitore } from "@/components/ui";
import { GIORNI_SCARICO, NEGOZIO_APERTO } from "@/lib/negozio/catalogo";

/**
 * Condizioni di vendita dei PDF. BOZZA del 23/11/2026: va riletta dal
 * consulente di Partidea prima di accendere NEGOZIO_APERTO (docs/negozio.md).
 */
export const metadata: Metadata = {
  title: "Condizioni di vendita dei PDF",
  description: "Chi vende, cosa compri, come paghi e come scarichi i libretti e i disegni da stampare di Giocamizi.",
  alternates: { canonical: "/negozio/condizioni" },
  robots: NEGOZIO_APERTO ? undefined : { index: false, follow: false },
};

const VOCI: { titolo: string; testo: string }[] = [
  {
    titolo: "Chi vende",
    testo: `${SOCIETA.ragioneSociale}, ${SOCIETA.sede}, P.IVA ${SOCIETA.piva}, REA ${SOCIETA.rea}. Per qualsiasi domanda: ${TITOLARE.email}.`,
  },
  {
    titolo: "Cosa compri",
    testo: "File PDF da stampare: libretti illustrati di Mizi e disegni da colorare. Non spediamo niente di stampato. Prima dell'acquisto vedi il titolo, cosa contiene ogni file, i formati (A4, oppure due pagine per foglio A4) e il prezzo.",
  },
  {
    titolo: "Prezzi e pagamento",
    testo: "I prezzi sono in euro, IVA inclusa, senza altri costi. Si paga con carta o con gli altri metodi proposti nella pagina di pagamento di Stripe: noi non vediamo e non conserviamo i dati della carta. Il contratto è concluso quando Stripe conferma il pagamento. Ricevi la ricevuta all'email che indichi.",
  },
  {
    titolo: "Consegna",
    testo: `Subito dopo il pagamento trovi i link per scaricare i PDF nella pagina di conferma, e te li mandiamo per email. I link funzionano per ${GIORNI_SCARICO} giorni: puoi scaricare i file più volte, anche da altri dispositivi. Conserva una copia dei file sul tuo dispositivo.`,
  },
  {
    titolo: "Diritto di recesso",
    testo: "Sono contenuti digitali forniti subito. Prima di pagare ci chiedi espressamente la consegna immediata e prendi atto che, una volta messi a disposizione i file, perdi il diritto di recesso (art. 59, comma 1, lettera o, del Codice del consumo). Ti confermiamo questa scelta nella ricevuta.",
  },
  {
    titolo: "Se un file non funziona",
    testo: "Se un PDF non si apre, è incompleto o non corrisponde a quello che hai comprato, scrivici entro 30 giorni: te lo correggiamo o lo sostituiamo e, se non ci riusciamo, ti rimborsiamo. Restano i diritti della garanzia legale sui contenuti digitali (artt. 135-octies e seguenti del Codice del consumo).",
  },
  {
    titolo: "Come puoi usarli",
    testo: "Puoi stampare i file tutte le volte che vuoi per la tua famiglia, per una festa o per la tua classe. Non puoi rivenderli, metterli online, condividerli in gruppi o usarli per prodotti in vendita. Testi e disegni restano di Giorgia Palazzo e di Partidea SRL.",
  },
  {
    titolo: "Dati personali",
    testo: "Per vendere ci servono l'email e i dati del pagamento, che tratta Stripe. Li usiamo solo per consegnarti i file, per l'assistenza e per gli obblighi fiscali, che chiedono di conservare i dati delle vendite per dieci anni. I dettagli sono nella privacy policy.",
  },
  {
    titolo: "Reclami e controversie",
    testo: `Per un reclamo scrivi a ${TITOLARE.email}: rispondiamo entro 7 giorni. Vale la legge italiana. Se sei un consumatore, è competente il giudice del luogo dove abiti.`,
  },
];

export default function CondizioniVenditaPage() {
  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Condizioni di vendita dei PDF</h1>
      <p className="mt-3 text-lg text-notte-tenue">
        Le regole del negozio di Giocamizi, in parole semplici. Per i dati personali vale la{" "}
        <Link href="/privacy" className="font-bold text-viola underline">privacy policy</Link>.
      </p>
      <ol className="mt-8 flex flex-col gap-5">
        {VOCI.map((v, i) => (
          <li key={v.titolo} className="rounded-[1.4rem] border border-notte/10 bg-white p-5">
            <p className="font-extrabold text-notte">{i + 1}. {v.titolo}</p>
            <p className="mt-1 leading-relaxed text-notte-tenue">{v.testo}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm text-notte-tenue">Versione del 23 novembre 2026.</p>
    </Contenitore>
  );
}
