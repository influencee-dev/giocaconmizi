import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { Briciole, InBreve } from "@/components/directory/Briciole";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { url } from "@/lib/seo";
import { PERCORSO_COME_RECLAMARE } from "@/lib/reclamo";
import { PERCORSO_RISORSE } from "@/lib/risorse-educative";

/**
 * Il tutorial per le attività e le realtà educative: come si reclama la
 * scheda che Giocamizi ha già creato (o come se ne propone una nuova).
 * Linkato dal richiamo «Come funziona» di feste, directory e risorse.
 * Il video con la voce arriverà qui (docs/piano-risorse-eventi.md, fase 4).
 */

const TITOLO = "Come reclamare la scheda della tua attività su Giocamizi";
const DESCRIZIONE =
  "La guida passo per passo per ludoteche, sale feste, scuole, cooperative e progetti educativi: trova la scheda, chiedi di gestirla, ricevi il link personale e completala. Gratis.";

export const metadata: Metadata = {
  title: TITOLO,
  description: DESCRIZIONE,
  alternates: { canonical: PERCORSO_COME_RECLAMARE },
  openGraph: { title: TITOLO, description: DESCRIZIONE, url: PERCORSO_COME_RECLAMARE, type: "article" },
};

const RISPOSTA =
  "Per reclamare la scheda della tua attività su Giocamizi apri la scheda, tocca «Reclama la scheda» (nelle feste «Gestisci la scheda») e compila il modulo con il tuo nome e un contatto. Giorgia controlla che tu gestisca davvero quella realtà e ti manda via email un link personale: da lì approvi, completi o togli la scheda. È gratis, senza commissioni e senza pubblicità.";

const PASSI = [
  {
    titolo: "Trova la tua scheda",
    testo:
      "Cerca la tua attività tra le feste di compleanno per città o tra le risorse educative. Se c'è già, aprila: in fondo trovi il bottone per reclamarla.",
  },
  {
    titolo: "Tocca «Reclama la scheda»",
    testo:
      "Si apre il modulo con la tua scheda già scelta. Scrivi chi sei e come ti contattiamo: email e telefono restano nel nostro archivio privato, non vanno sul sito.",
  },
  {
    titolo: "Controlliamo che sia davvero tua",
    testo:
      "Giorgia verifica sul sito ufficiale che il contatto sia davvero della realtà. Niente va online da solo: è il modo per proteggere te e le famiglie da schede false.",
  },
  {
    titolo: "Ricevi il link personale",
    testo:
      "Ti arriva un'email con un link che vale solo per la tua scheda: non serve password, ma non inoltrarlo a chi non deve modificarla.",
  },
  {
    titolo: "Completa la scheda",
    testo:
      "Dal link vedi la scheda come la vedono le famiglie e scegli: approvarla così com'è, completarla (descrizione, contatti, orari, social, logo per le realtà educative, pacchetti festa per i locali) oppure chiedere di toglierla.",
  },
  {
    titolo: "La scheda è verificata",
    testo:
      "Quando Giorgia accetta le modifiche la scheda si aggiorna in pochi minuti e prende il bollino «Verificata». Puoi tornare sul link quando vuoi per cambiare qualcosa.",
  },
];

const FAQ = [
  {
    domanda: "Quanto costa avere la scheda su Giocamizi?",
    risposta: "Niente. La scheda è gratuita e lo resta: nessuna commissione sulle prenotazioni, nessuna pubblicità. Le famiglie vi contattano direttamente.",
  },
  {
    domanda: "Perché la mia attività è già su Giocamizi se non l'ho chiesto?",
    risposta: "Raccogliamo le attività per bambini più citate dalle famiglie e le realtà educative utili, usando solo quello che è scritto sul vostro sito ufficiale. Potete completarla, correggerla o chiederne la rimozione in qualsiasi momento.",
  },
  {
    domanda: "Quanto tempo ci vuole?",
    risposta: "Il modulo si compila in due minuti. Il controllo lo facciamo a mano e ti scriviamo appena è fatto; dopo, le modifiche accettate vanno online in pochi minuti.",
  },
  {
    domanda: "La mia attività non c'è: posso aggiungerla?",
    risposta: "Sì. Dal modulo scegli «Aggiungere la mia attività» e raccontaci cosa fate: dopo il controllo creiamo la scheda e ti mandiamo il link per gestirla.",
  },
  {
    domanda: "Posso mettere le foto della mia attività?",
    risposta: "Non prendiamo mai foto dai vostri siti o dai social: finché non ci mandate le vostre, la scheda mostra un'illustrazione di Giocamizi. Dal link personale le realtà educative caricano il logo e i locali possono indicare il video della struttura.",
  },
  {
    domanda: "Posso togliere la scheda?",
    risposta: "Sì: dal link personale scegli «Non voglio comparire» e la togliamo dal sito e dalla sitemap, senza domande.",
  },
];

export default function ComeReclamare() {
  return (
    <Contenitore className="py-8 sm:py-10">
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Come reclamare la scheda", percorso: PERCORSO_COME_RECLAMARE }])} />
      <JsonLd data={jsonLdFaq(FAQ)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: TITOLO,
          description: DESCRIZIONE,
          url: url(PERCORSO_COME_RECLAMARE),
          totalTime: "PT5M",
          estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
          step: PASSI.map((p, i) => ({ "@type": "HowToStep", position: i + 1, name: p.titolo, text: p.testo })),
        }}
      />

      <Briciole voci={[{ nome: "Come reclamare la scheda" }]} />
      <p className="mt-5 w-fit rounded-full bg-rosa px-4 py-1 text-sm font-black text-white">Per attività e realtà educative · gratis</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-notte sm:text-5xl">{TITOLO}</h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Vale per i posti delle feste (ludoteche, sale feste, fattorie didattiche, laser game…) e per le risorse educative
        (scuole, cooperative, blog e progetti per bambini).
      </p>

      <div className="mt-6">
        <InBreve testo={RISPOSTA} />
      </div>

      <section className="mt-10" aria-labelledby="titolo-passi">
        <h2 id="titolo-passi" className="text-[1.75rem] font-black leading-tight tracking-tight text-notte sm:text-4xl">
          I passi, uno per uno
        </h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {PASSI.map((p, i) => (
            <li key={p.titolo} className="flex gap-4 rounded-[1.3rem] bg-white p-5 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.4)]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-viola text-lg font-black text-white">{i + 1}</span>
              <span>
                <span className="block text-lg font-black text-notte">{p.titolo}</span>
                <span className="mt-1 block text-notte-tenue">{p.testo}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <TitoloSezione>Da dove parti?</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/feste" data-tap className="flex flex-col gap-1 rounded-[1.3rem] bg-[#FCE1EC] p-5 hover:bg-[#F9D0E0]">
            <span className="text-lg font-black text-notte">Ho un posto per le feste</span>
            <span className="text-sm text-notte-tenue">Ludoteche, sale feste, parchi, laser game: cerca la tua città.</span>
            <span className="mt-auto font-extrabold text-viola">Feste per città ›</span>
          </Link>
          <Link href={PERCORSO_RISORSE} data-tap className="flex flex-col gap-1 rounded-[1.3rem] bg-[#E3F4E8] p-5 hover:bg-[#D2EDDA]">
            <span className="text-lg font-black text-notte">Sono una realtà educativa</span>
            <span className="text-sm text-notte-tenue">Scuole, cooperative, blog, progetti di coding e lettura.</span>
            <span className="mt-auto font-extrabold text-viola">Risorse educative ›</span>
          </Link>
          <Link href="/aggiungi-attivita" rel="nofollow" data-tap className="flex flex-col gap-1 rounded-[1.3rem] bg-[#FEF3D1] p-5 hover:bg-[#FCEAB8]">
            <span className="text-lg font-black text-notte">Non trovo la mia scheda</span>
            <span className="text-sm text-notte-tenue">Proponi la tua attività: la controlliamo e la mettiamo online.</span>
            <span className="mt-auto font-extrabold text-viola">Aggiungi la tua attività ›</span>
          </Link>
        </div>
      </section>

      <Faq voci={FAQ} />
    </Contenitore>
  );
}
