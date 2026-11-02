import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { MiziIntero } from "@/components/illustrazioni";
import { JsonLd, jsonLdFaq } from "@/components/seo/JsonLd";
import { Bollino, FasciaFinale, FaqVetrina, InBreve, TitoloVetrina, TONI, type Tono } from "@/components/vetrina";
import { url } from "@/lib/seo";
import { SOCIETA, TITOLARE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Chi siamo: Giorgia, Domiziana e Mizi",
  description:
    "Giocamizi (Gioca con Mizi) è nato da una mamma, Giorgia Palazzo, e da sua figlia Domiziana, che non voleva mai fare i compiti. Giochi gratis e senza pubblicità, provati da una bambina vera.",
  alternates: { canonical: "/chi-siamo" },
  openGraph: { images: [{ url: "/immagini/giorgia-e-domiziana-giocamizi-960.webp", width: 960, height: 960 }] },
};

/** Le foto vere di Giorgia e Domiziana (non AI), senza metadati né posizione. */
const FOTO = {
  insieme: "/immagini/giorgia-e-domiziana-giocamizi.webp",
  giorgia: "/immagini/giorgia-palazzo-giocamizi.webp",
  domiziana: "/immagini/domiziana-giocamizi.webp",
};

const STORIA: { tono: Tono; tappa: string; titolo: string; testo: string }[] = [
  {
    tono: "rosa",
    tappa: "1",
    titolo: "I compiti",
    testo:
      "Mia figlia Domiziana non voleva mai fare i compiti. E io avevo voglia di fare qualcosa per lei.",
  },
  {
    tono: "giallo",
    tappa: "2",
    titolo: "Imparare giocando",
    testo:
      "Così sono nati giochi gentili, uno per ogni cosa da imparare: senza pubblicità, senza timer e senza «hai perso».",
  },
  {
    tono: "azzurro",
    tappa: "3",
    titolo: "Nasce Mizi",
    testo:
      "Cercando un nome l'abbiamo chiesto all'intelligenza artificiale: è uscita una piccola pinguina con i capelli di Domiziana. Si chiama Mizi, un pezzetto del suo nome.",
  },
];

const PERSONE: { foto?: string; nome: string; ruolo: string; testo: string; tono: Tono }[] = [
  {
    foto: FOTO.giorgia,
    nome: "Giorgia",
    ruolo: "La mamma che l'ha inventato",
    testo:
      "Founder di Partidea e Influencee: nella vita fa comunicazione, qui fa la mamma che ha voglia di aiutare le altre mamme.",
    tono: "rosa",
  },
  {
    foto: FOTO.domiziana,
    nome: "Domiziana",
    ruolo: "La tester ufficiale",
    testo: "Ogni gioco lo prova lei prima che venga pubblicato: è il primo test di ogni novità.",
    tono: "giallo",
  },
  {
    nome: "Mizi",
    ruolo: "La maestra gentile",
    testo: "Spiega a voce cosa fare, così giocano anche i bambini che non sanno ancora leggere. Non mette fretta e non sgrida mai.",
    tono: "azzurro",
  },
];

const REGOLE: [Tono, string][] = [
  ["azzurro", "Un gioco insegna una cosa sola, e la insegna bene."],
  ["rosa", "Nessun timer, nessun «hai perso»: se sbaglia, si riprova."],
  ["giallo", "La voce spiega cosa fare, così giocano anche i bambini che non leggono."],
  ["viola", "Ogni gioco viene provato da una bambina vera, Domiziana, prima di essere pubblicato."],
  ["arancione", "Le idee delle mamme diventano giochi: quello che serve davvero lo decidete voi."],
];

const FAQ = [
  {
    domanda: "Chi ha creato Giocamizi?",
    risposta:
      "Giorgia Palazzo, mamma di Domiziana. Giocamizi è nato perché la figlia non voleva fare i compiti. Il sito è gestito da Partidea SRL, la società di cui Giorgia è founder.",
  },
  {
    domanda: "Chi è Mizi?",
    risposta:
      "Una piccola pinguina con i capelli di Domiziana: il suo nome è un pezzetto del nome della bambina. Nei giochi spiega a voce cosa fare e non sgrida mai.",
  },
  {
    domanda: "Le foto dei bambini sul sito sono vere?",
    risposta:
      "In questa pagina sì: sono Giorgia e Domiziana. Le altre foto del sito sono illustrazioni realizzate con l'intelligenza artificiale e lo dice il piccolo segno «AI» nell'angolo.",
  },
  {
    domanda: "Come posso proporre un'idea o segnalare un errore?",
    risposta:
      "Scrivendo a ciao@giocamizi.it: le segnalazioni dei genitori e delle maestre sono la fonte principale dei giochi nuovi.",
  },
];

export default function ChiSiamoPage() {
  return (
    <>
      <Contenitore largo className="pb-16 pt-8">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: url("/chi-siamo"),
            name: "Chi siamo: Giorgia, Domiziana e Mizi",
            mainEntity: {
              "@type": "Person",
              name: "Giorgia Palazzo",
              description: "Mamma di Domiziana, ideatrice di Giocamizi (Gioca con Mizi), founder di Partidea e Influencee",
              image: url("/immagini/giorgia-palazzo-giocamizi.webp"),
              worksFor: { "@type": "Organization", name: SOCIETA.ragioneSociale },
            },
          }}
        />
        <JsonLd data={jsonLdFaq(FAQ)} />

        {/* Testata: la storia a sinistra, la foto vera a destra. */}
        <section className={`overflow-hidden rounded-[2rem] border-2 ${TONI.viola.card}`}>
          <div className="grid items-center gap-8 p-5 sm:p-8 md:grid-cols-[1.1fr_1fr] lg:p-12">
            <div className="testata flex min-w-0 flex-col gap-4">
              <span className="w-fit rounded-full bg-white px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-notte">
                La nostra storia
              </span>
              <h1>Una mamma, una figlia e una pinguina</h1>
              <p className="text-notte-tenue">
                Giocamizi è nato perché mia figlia non voleva mai fare i compiti. Io sono Giorgia, lei è Domiziana, e Mizi
                porta un pezzetto del suo nome.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/giochi" className="rounded-2xl bg-viola px-6 py-3.5 font-extrabold text-white hover:bg-notte">
                  Prova i giochi
                </Link>
                <a href={`mailto:${TITOLARE.email}`} className="rounded-2xl border-2 border-notte bg-white px-6 py-3.5 font-extrabold text-notte">
                  Scrivimi
                </a>
              </div>
            </div>
            <figure className="relative mx-auto w-full max-w-md">
              <div className="relative aspect-square overflow-hidden rounded-[1.8rem] border-[6px] border-white shadow-xl">
                <Image
                  src={FOTO.insieme}
                  alt="Giorgia Palazzo abbraccia la figlia Domiziana: insieme hanno inventato Giocamizi"
                  fill
                  priority
                  sizes="(min-width: 768px) 28rem, 100vw"
                  className="object-cover"
                />
              </div>
              <Bollino className="absolute -bottom-6 -left-2 h-28 w-28 sm:-left-8 sm:h-32 sm:w-32">Da qui nasce Mizi</Bollino>
              <figcaption className="mt-3 text-right text-sm font-bold text-notte-tenue">Giorgia e Domiziana</figcaption>
            </figure>
          </div>
        </section>

        <InBreve className="mx-auto mt-14 max-w-4xl">
          Giocamizi è un&apos;idea di Giorgia Palazzo, founder di Partidea e Influencee, nata per la figlia Domiziana: Mizi, la
          pinguina dei giochi, porta un pezzetto del suo nome. Il sito è gestito da {SOCIETA.ragioneSociale} ed è gratis e
          senza pubblicità.
        </InBreve>

        {/* La storia in tre tappe. */}
        <section className="mt-20">
          <TitoloVetrina>Com&apos;è cominciata</TitoloVetrina>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STORIA.map((t) => (
              <li key={t.tappa} className={`flex flex-col gap-3 rounded-[1.6rem] border-2 p-6 ${TONI[t.tono].card}`}>
                <span className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-black text-white ${TONI[t.tono].pieno}`}>
                  {t.tappa}
                </span>
                <h3 className="text-xl font-black text-notte">{t.titolo}</h3>
                <p className="leading-relaxed text-notte-tenue">{t.testo}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* La frase di Giorgia. */}
        <figure className="mx-auto mt-20 max-w-3xl rounded-[1.8rem] bg-white p-8 text-center sm:p-12">
          <blockquote className="text-2xl font-black leading-snug tracking-tight text-notte sm:text-3xl">
            «Qui faccio la mamma che ha voglia di aiutare le altre mamme: questo sito lo costruiamo insieme.»
          </blockquote>
          <figcaption className="mt-5 flex items-center justify-center gap-3 font-bold text-notte-tenue">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow">
              <Image src={FOTO.giorgia} alt="" fill sizes="48px" className="object-cover" />
            </span>
            Giorgia Palazzo, mamma di Domiziana
          </figcaption>
        </figure>

        {/* Chi c'è dietro. */}
        <section className="mt-20">
          <TitoloVetrina>Chi c&apos;è dietro</TitoloVetrina>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {PERSONE.map((p) => (
              <li key={p.nome} className={`flex flex-col items-center gap-3 rounded-[1.6rem] border-2 p-6 text-center ${TONI[p.tono].card}`}>
                <span className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
                  {p.foto ? (
                    <Image src={p.foto} alt={`${p.nome}, ${p.ruolo.toLowerCase()} di Giocamizi`} fill sizes="112px" className="object-cover" />
                  ) : (
                    <MiziIntero className="h-24 w-auto" />
                  )}
                </span>
                <div>
                  <h3 className="text-xl font-black text-notte">{p.nome}</h3>
                  <p className="text-sm font-extrabold uppercase tracking-wide text-notte-tenue">{p.ruolo}</p>
                </div>
                <p className="leading-relaxed text-notte-tenue">{p.testo}</p>
              </li>
            ))}
          </ul>
        </section>

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
            Niente. I giochi sono gratis, senza pubblicità e senza acquisti nascosti, e resteranno così. Se vuoi restare
            aggiornata sulle novità c&apos;è solo una newsletter facoltativa, e i tuoi dati restano tuoi (
            <Link href="/privacy" className="font-bold text-viola underline underline-offset-4">
              come li trattiamo
            </Link>
            ).
          </p>
          <p className="mt-4 text-lg text-notte-tenue">
            Hai un&apos;idea, un gioco che vorresti, una cosa che non funziona? Scrivimi a{" "}
            <a href={`mailto:${TITOLARE.email}`} className="font-bold text-viola underline underline-offset-4">
              {TITOLARE.email}
            </a>
            : questo sito lo costruiamo insieme.
          </p>
        </section>

        <section className="mx-auto mt-20 max-w-5xl">
          <TitoloVetrina>Domande frequenti</TitoloVetrina>
          <div className="mt-8">
            <FaqVetrina voci={FAQ} />
          </div>
        </section>
      </Contenitore>

      <FasciaFinale
        titolo="Gioca con Mizi"
        testo="Scegli un gioco per l'età di tuo figlio: gratis, senza pubblicità e senza fretta."
        azioni={[
          { href: "/giochi", etichetta: "Tutti i giochi" },
          { href: "/biglietti/crea", etichetta: "Crea un invito" },
        ]}
      />
    </>
  );
}
