import type { Metadata } from "next";
import Link from "next/link";
import { TITOLARE } from "@/lib/legal";
import { Contenitore } from "@/components/ui";

export const metadata: Metadata = {
  title: "Termini e condizioni per le attività",
  description: "Le regole della scheda gratuita delle attività per bambini su Giocamizi: cosa pubblichiamo, cosa ci autorizzate a usare e come togliere la scheda.",
  alternates: { canonical: "/termini-attivita" },
};

const VOCI: { titolo: string; testo: string }[] = [
  { titolo: "Cos'è la scheda", testo: "Giocamizi è un sito gratuito per le famiglie. La scheda della vostra attività è gratuita: non chiediamo commissioni sulle feste né pagamenti per comparire. Le famiglie vi contattano direttamente, con i recapiti che scegliete voi." },
  { titolo: "Chi può approvarla o modificarla", testo: "Approvando o modificando la scheda dichiarate di essere titolari dell'attività o di avere il permesso di rappresentarla." },
  { titolo: "I dati che pubblichiamo", testo: "Pubblichiamo i dati dell'attività che ci fornite o che l'attività ha già reso pubblici (nome, zona, tipo di spazio, descrizione, sito, social, recapiti di lavoro). L'email e il nome di chi risponde al link restano riservati: servono solo a scrivervi." },
  { titolo: "Testi, foto e video", testo: "Per i testi, le foto e i video che ci inviate ci concedete una licenza gratuita e non esclusiva per mostrarli sulla vostra scheda e nelle pagine di Giocamizi che parlano della vostra attività, finché la scheda resta online. Garantite di averne i diritti e che le persone riconoscibili, in particolare i bambini, abbiano dato il consenso. Possiamo ridimensionarli o non pubblicare contenuti non adatti a un sito per famiglie." },
  { titolo: "Controllo e completamento dei dati", testo: "Possiamo verificare e completare i dati della scheda con informazioni pubbliche sull'attività (sito ufficiale, profili social, elenchi pubblici). Ogni modifica che ci mandate viene controllata prima di andare online." },
  { titolo: "Statistiche", testo: "Quando sarà attiva l'area riservata vi mostreremo solo numeri aggregati (visualizzazioni della scheda, clic sui recapiti), mai i dati delle singole famiglie." },
  { titolo: "Condivisione", testo: "Vi chiediamo, se vi fa piacere, di condividere la scheda sui vostri canali: aiuta le famiglie a trovarvi. Non è un obbligo." },
  { titolo: "Togliere la scheda", testo: "Potete chiedere di togliere la scheda in qualsiasi momento, dal vostro link personale o scrivendoci: la togliamo entro 48 ore. Possiamo togliere o sospendere una scheda con dati non veri o contenuti non adatti." },
  { titolo: "Responsabilità", testo: "I prezzi, gli orari e i servizi indicati nella scheda sono responsabilità dell'attività. Giocamizi non partecipa agli accordi tra famiglie e attività." },
];

export default function TerminiAttivitaPage() {
  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Termini e condizioni per le attività</h1>
      <p className="mt-3 text-lg text-notte-tenue">
        Le regole della scheda gratuita su Giocamizi, in parole semplici. Titolare: {TITOLARE.nome}. Per i dati personali vale la{" "}
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
      <p className="mt-8 text-sm text-notte-tenue">Versione del 25 ottobre 2026.</p>
    </Contenitore>
  );
}
