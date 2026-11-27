import type { Metadata } from "next";
import { Contenitore, Faq } from "@/components/ui";
import { PercorsoSottoPressione } from "@/components/genitori/PercorsoSottoPressione";
import { CondividiTest } from "@/components/genitori/CondividiTest";
import { metaDi } from "@/games/registry";
import { guida } from "@/lib/contenuti/guide";
import { FONTI_PERCORSO, LETTURE, PERCORSO, PERCORSO_PUBBLICO, SPINTE, TITOLI_PAGINE } from "@/lib/famiglia/sotto-pressione";

// Con PERCORSO_PUBBLICO false la pagina è una bozza: si apre dal link,
// ma i motori di ricerca non la prendono e nessuna pagina del sito la collega.
// Il titolo per Google e per l'anteprima social è quello che invoglia
// («E tu che mamma diventi…»); in pagina resta il titolo per tutti i genitori.
export const metadata: Metadata = {
  title: PERCORSO.titoloSocial,
  description: PERCORSO.descrizione,
  alternates: { canonical: PERCORSO.percorso },
  openGraph: { title: PERCORSO.titoloSocial, description: PERCORSO.descrizione, url: PERCORSO.percorso, type: "website" },
  robots: PERCORSO_PUBBLICO ? undefined : { index: false, follow: false },
};

/** Il testo di ogni collegamento è il titolo vero della pagina di arrivo. */
function titoliDeiCollegamenti(): Record<string, string> {
  const titoli: Record<string, string> = { ...TITOLI_PAGINE };
  for (const k of SPINTE)
    for (const href of LETTURE[k].suGiocamizi) {
      const [, zona, slug] = href.split("/");
      if (zona === "guide") titoli[href] = guida(slug)?.titolo ?? href;
      else if (zona === "giochi") titoli[href] = `Gioco: ${metaDi(slug).title}`;
    }
  return titoli;
}

const DOMANDE = [
  {
    domanda: "È un test psicologico?",
    risposta:
      "No. È un percorso per riflettere, scritto da noi a partire da un modello dell'Analisi Transazionale. Non è stato validato con una ricerca e non fa diagnosi: ti restituisce come hai risposto oggi, con parole che puoi usare per pensarci su.",
  },
  {
    domanda: "Dove finiscono le mie risposte?",
    risposta:
      "Da nessuna parte: restano nel tuo browser. Non le riceviamo, non le salviamo e non le usiamo per le statistiche. Si cancellano quando chiudi la scheda, oppure subito con il bottone «Cancella le mie risposte».",
  },
  {
    domanda: "Che cosa sono le cinque spinte?",
    risposta:
      "Sono cinque messaggi che molte persone si ripetono senza accorgersene: sii perfetto, sii forte, sforzati, sbrigati, compiaci gli altri. Li ha descritti lo psicologo Taibi Kahler negli anni Settanta. Ognuno ha un lato utile; diventano un problema quando, sotto pressione, decidono al posto nostro.",
  },
  {
    domanda: "Riguarda anche i bambini?",
    risposta:
      "No: le domande sono solo per l'adulto che compila. Non chiediamo niente sui figli e non diamo nessun profilo dei bambini.",
  },
];

export default function SottoPressionePage() {
  return (
    <Contenitore className="pb-12 pt-8">
      <header className="mb-8 flex flex-col gap-4">
        <span className="w-fit rounded-full bg-crema-scuro px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-notte">
          Per i genitori · 10 minuti
        </span>
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">{PERCORSO.titolo}</h1>
        <p className="max-w-2xl text-lg text-notte-tenue">
          Le scarpe che non si infilano, il bicchiere rovesciato, il «no» al supermercato. In quei momenti spesso non scegliamo:
          reagiamo come siamo abituati. Questo percorso ti aiuta a riconoscere la tua reazione più frequente, per poterne
          scegliere un&apos;altra quando serve.
        </p>
        <CondividiTest compatto />
      </header>

      <PercorsoSottoPressione titoli={titoliDeiCollegamenti()} />

      <section className="mt-12 flex flex-col gap-4 print:hidden">
        <h2 className="text-2xl font-extrabold text-notte">Che cosa è, e che cosa non è</h2>
        <p className="text-lg text-notte-tenue">
          È uno spunto per conoscerti meglio come genitore. <strong className="text-notte">Non è una diagnosi</strong>, non è un test
          validato e non dice che genitore sei: dice come hai risposto oggi. Le frasi usano «può» e «potrebbe» perché nessun
          questionario sa che cosa succede davvero a casa tua.
        </p>
        <p className="text-lg text-notte-tenue">
          Il punteggio è un conto semplice, sempre uguale: per ogni spinta si sommano le tue sette risposte e la somma diventa un
          numero da 0 a 100. Nessuna intelligenza artificiale decide o ritocca il risultato, e le letture sono scritte a mano.
        </p>
      </section>

      <div className="print:hidden">
        <Faq voci={DOMANDE} />
      </div>

      <section className="mt-10 flex flex-col gap-3 print:hidden">
        <h2 className="text-2xl font-extrabold text-notte">Da dove viene</h2>
        <p className="text-lg text-notte-tenue">
          Le cinque spinte vengono dall&apos;Analisi Transazionale. Le domande e le letture di questa pagina sono originali di
          Giocamizi.
        </p>
        <ul className="list-disc pl-6 text-base text-notte-tenue">
          {FONTI_PERCORSO.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>
    </Contenitore>
  );
}
