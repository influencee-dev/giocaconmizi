import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { AGGIORNATA, TITOLARE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Note legali",
  description:
    "Chi gestisce Giocamizi, diritti sui contenuti, immagini realizzate con l'AI, informazioni sui locali, come segnalare un contenuto e accessibilità.",
  alternates: { canonical: "/note-legali" },
};

function Sezione({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-extrabold text-notte sm:text-2xl">{titolo}</h2>
      <div className="flex flex-col gap-3 leading-relaxed text-notte-tenue">{children}</div>
    </section>
  );
}

const Email = () => (
  <a href={`mailto:${TITOLARE.email}`} className="font-bold text-viola underline underline-offset-4">
    {TITOLARE.email}
  </a>
);

export default function NoteLegaliPage() {
  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Note legali</h1>
      <p className="mt-2 text-sm font-bold text-notte-tenue">Ultimo aggiornamento: {AGGIORNATA}</p>

      <Sezione titolo="Chi gestisce il sito">
        <p>
          Giocamizi (giocamizi.it), chiamato anche Gioca con Mizi, è gestito da {TITOLARE.nome},{" "}
          {TITOLARE.ruolo}. Il sito non vende nulla, non ospita pubblicità e non ha accordi
          commerciali con le attività citate. Contatto unico per ogni comunicazione, anche da
          parte delle autorità: <Email />.
        </p>
        <p>
          Come trattiamo i dati personali è spiegato nella{" "}
          <Link href="/privacy" className="font-bold text-viola underline underline-offset-4">privacy policy</Link>{" "}
          e nella{" "}
          <Link href="/cookie" className="font-bold text-viola underline underline-offset-4">cookie policy</Link>; le
          regole per le attività sono nei{" "}
          <Link href="/termini-attivita" className="font-bold text-viola underline underline-offset-4">termini per le attività</Link>.
        </p>
      </Sezione>

      <Sezione titolo="Diritti sui contenuti">
        <p>
          Testi, giochi, storie, illustrazioni e codice del sito sono opera di Giocamizi e
          protetti dalla legge sul diritto d&apos;autore (L. 633/1941). Puoi usarli liberamente
          per giocare, stampare le schede e i biglietti per uso personale o in classe; per
          altri usi scrivici. Non usiamo personaggi protetti da diritti di terzi. Le icone
          vengono da Fluent Emoji (licenza MIT) e Twemoji (licenza CC-BY 4.0).
        </p>
      </Sezione>

      <Sezione titolo="Immagini realizzate con l'intelligenza artificiale">
        <p>
          Alcune foto del sito sono illustrative e realizzate con l&apos;intelligenza
          artificiale: lo dice la scritta «Foto illustrativa AI» sulla foto stessa, come
          chiede il Regolamento europeo sull&apos;intelligenza artificiale (Reg. UE 2024/1689,
          art. 50). Le persone che vi compaiono non esistono e non ritraggono clienti,
          locali o famiglie reali.
        </p>
      </Sezione>

      <Sezione titolo="Le informazioni sui locali">
        <p>
          Le schede di ludoteche, sale feste, parchi e musei sono scritte a partire da fonti
          pubbliche, soprattutto i siti ufficiali delle attività, e vengono verificate prima
          della pubblicazione. Orari, servizi e prezzi però cambiano: prima di prenotare
          controlla sempre sul sito dell&apos;attività. Citare un locale non è una
          raccomandazione a pagamento, e i link esterni portano a siti di cui non siamo
          responsabili.
        </p>
      </Sezione>

      <Sezione titolo="Segnalare un contenuto">
        <p>
          Se pensi che una pagina contenga un&apos;informazione sbagliata, un contenuto
          illecito o che violi i tuoi diritti, scrivi a <Email /> con l&apos;indirizzo della
          pagina, che cosa non va e perché, e il tuo nome e la tua email (Reg. UE 2022/2065,
          Digital Services Act, artt. 11, 12 e 16). Ti rispondiamo appena possibile, ti
          diciamo che cosa abbiamo deciso e perché, e se togliamo o modifichiamo un
          contenuto inviato da un&apos;attività lo spieghiamo anche a lei. Le attività
          possono correggere o togliere la propria scheda anche da sole, con il link
          personale che ricevono via email.
        </p>
      </Sezione>

      <Sezione titolo="Accessibilità">
        <p>
          Vogliamo che il sito sia usabile da tutti: testi leggibili, contrasto alto,
          bottoni grandi, navigazione da tastiera, istruzioni dei giochi lette ad alta voce e
          un carattere ad alta leggibilità per le storie. Il riferimento sono le linee guida
          WCAG 2.1 di livello AA. Se trovi una barriera, scrivici a <Email />: la
          correggiamo il prima possibile.
        </p>
      </Sezione>

      <Sezione titolo="Legge applicabile">
        <p>
          Il sito e queste note sono regolati dalla legge italiana e dalle norme
          dell&apos;Unione europea.
        </p>
      </Sezione>
    </Contenitore>
  );
}
