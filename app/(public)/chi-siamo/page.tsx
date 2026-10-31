import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { MiziIntero } from "@/components/illustrazioni";
import { JsonLd, jsonLdFaq } from "@/components/seo/JsonLd";
import { FaqVetrina, InBreve, TestataPagina, TitoloVetrina, TONI, type Tono } from "@/components/vetrina";
import { url } from "@/lib/seo";
import { TITOLARE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Giocamizi (Gioca con Mizi) è nato da una mamma, Giorgia, e da sua figlia Domiziana, che non voleva mai fare i compiti. Giochi gratis, senza pubblicità, per tutte le mamme.",
  alternates: { canonical: "/chi-siamo" },
};

// La foto entra nel sito appena il file esiste in public/: fino ad allora la
// pagina funziona uguale, senza immagini rotte.
const FOTO = "foto-giorgia-domiziana.jpg";
const fotoDisponibile = () => existsSync(join(process.cwd(), "public", FOTO));

const REGOLE: [Tono, string][] = [
  ["azzurro", "Un gioco insegna una cosa sola, e la insegna bene."],
  ["rosa", "Nessun timer, nessun «hai perso»: se sbaglia, si riprova."],
  ["giallo", "La voce spiega cosa fare, così giocano anche i bambini che non leggono."],
  ["viola", "Ogni gioco viene provato da una bambina vera, Domiziana, prima di essere pubblicato."],
  ["arancione", "Le idee delle mamme diventano giochi: quello che serve davvero lo decidete voi."],
];

const FAQ = [
  { domanda: "Chi ha creato Giocamizi?", risposta: "Giorgia Palazzo, mamma di Domiziana. Giocamizi è nato perché la figlia non voleva fare i compiti. Il sito è gestito da Partidea SRL, la società di cui Giorgia è founder." },
  { domanda: "Chi è Mizi?", risposta: "Una piccola pinguina con i capelli di Domiziana: il suo nome è un pezzetto del nome della bambina. Nei giochi spiega a voce cosa fare e non sgrida mai." },
  { domanda: "Come posso proporre un'idea o segnalare un errore?", risposta: "Scrivendo a ciao@giocamizi.it: le segnalazioni dei genitori e delle maestre sono la fonte principale dei giochi nuovi." },
];

export default function ChiSiamoPage() {
  const conFoto = fotoDisponibile();

  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Giorgia Palazzo",
          description: "Mamma di Domiziana e creatrice di Giocamizi (Gioca con Mizi)",
          url: url("/chi-siamo"),
        }}
      />
      <JsonLd data={jsonLdFaq(FAQ)} />
      <TestataPagina occhiello="La nostra storia" tono="viola">
        <h1>Chi siamo</h1>
        <p className="text-notte-tenue">Una mamma, una figlia e una pinguina che spiega i giochi senza mettere fretta.</p>
      </TestataPagina>

      <InBreve className="mx-auto max-w-4xl">
        Giocamizi è un&apos;idea di Giorgia Palazzo, founder di Influencee, nata per la figlia Domiziana: Mizi, la
        pinguina dei giochi, porta un pezzetto del suo nome. Il sito è gestito da Partidea SRL ed è gratis e senza
        pubblicità.
      </InBreve>

      <div className="mx-auto mt-12 flex max-w-5xl flex-col items-start gap-8 md:flex-row">
        {conFoto ? (
          <figure className="w-full shrink-0 md:w-80">
            <div className="overflow-hidden rounded-[1.6rem] border-4 border-white shadow-lg">
              <Image
                src={`/${FOTO}`}
                alt="Giorgia e Domiziana, che hanno creato Gioca con Mizi"
                width={640}
                height={800}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <figcaption className="mt-2 text-center text-sm font-bold text-notte-tenue">
              Giorgia e Domiziana 🐧
            </figcaption>
          </figure>
        ) : (
          <div aria-hidden className="mx-auto flex h-64 w-64 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-viola/25 via-white to-rosa/25 p-10 shadow-lg md:mx-0">
            <MiziIntero className="h-full w-auto" />
          </div>
        )}

        <div className="flex max-w-2xl flex-col gap-4 text-lg text-notte-tenue">
          <p>
            Sono <strong className="text-notte">Giorgia</strong>, una mamma. Questo
            sito è nato perché mia figlia non voleva mai fare i compiti — e
            perché, soprattutto, avevo voglia di fare qualcosa per lei.
          </p>
          <p>
            Mia figlia si chiama <strong className="text-notte">Domiziana</strong>.
            Quando abbiamo cercato un nome per il sito, l&apos;abbiamo chiesto
            all&apos;intelligenza artificiale: ne è uscita una piccola pinguina
            con i capelli di Domiziana, che si chiama{" "}
            <strong className="text-notte">Mizi</strong> — un pezzetto del nome di
            mia figlia. Da allora Mizi è la maestra gentile di tutti i giochi:
            spiega a voce, non mette fretta e non sgrida mai.
          </p>
          <p>
            Nella vita ho fondato Influencee, un&apos;agenzia di comunicazione, ma
            qui faccio la mamma che ha voglia di aiutare le altre mamme. Il mio impegno è
            migliorarlo un pezzo alla volta e riempirlo di cose{" "}
            <em>davvero utili e credibili</em> — quelle che arrivano segnalate
            direttamente da voi.
          </p>
          <p>
            Hai un&apos;idea, un gioco che vorresti, una cosa che non funziona?
            Scrivimi:{" "}
            <a
              href={`mailto:${TITOLARE.email}`}
              className="font-bold text-viola underline underline-offset-4"
            >
              {TITOLARE.email}
            </a>
            . Questo sito lo costruiamo insieme.
          </p>
        </div>
      </div>

      <section className="mt-20">
        <TitoloVetrina>Come lavoriamo</TitoloVetrina>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {REGOLE.map(([tono, testo]) => (
            <li key={testo} className={`rounded-[1.4rem] border-2 p-5 text-[15px] font-bold leading-relaxed text-notte ${TONI[tono].card}`}>
              {testo}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-3xl rounded-[1.8rem] bg-white p-6 sm:p-10">
        <h2 className="text-3xl font-black tracking-tight text-notte">Quanto costa</h2>
        <p className="mt-3 text-lg text-notte-tenue">
          Niente. I giochi sono gratis, senza pubblicità e senza acquisti
          nascosti, e resteranno così. Se vuoi restare aggiornata sulle novità c&apos;è solo
          una newsletter facoltativa, e i tuoi dati restano tuoi (
          <Link href="/privacy" className="font-bold text-viola underline underline-offset-4">
            come li trattiamo
          </Link>
          ).
        </p>
      </section>

      <section className="mx-auto mt-20 max-w-5xl">
        <TitoloVetrina>Domande frequenti</TitoloVetrina>
        <div className="mt-8">
          <FaqVetrina voci={FAQ} />
        </div>
      </section>
    </Contenitore>
  );
}
