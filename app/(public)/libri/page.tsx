import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { JsonLd, jsonLdFaq } from "@/components/seo/JsonLd";
import { FasciaFinale, FaqVetrina, InBreve, TitoloVetrina, TONI, type Tono } from "@/components/vetrina";
import { url } from "@/lib/seo/seo";
import { LIBRI, PERCORSO_LIBRI, STORIA_AUTRICI } from "@/lib/contenuti/libri";

const TITOLO = "I libri di Mizi da leggere e colorare";
const DESCRIZIONE =
  "Albi illustrati per bambini dai 3 ai 7 anni: una storia di Mizi la pinguina con 12 disegni da colorare, attività e domande per parlarne insieme. Si comprano su Amazon.";

export const metadata: Metadata = {
  title: TITOLO,
  description: DESCRIZIONE,
  alternates: { canonical: PERCORSO_LIBRI },
  openGraph: LIBRI[0] ? { images: [{ url: LIBRI[0].copertina, width: 960, height: 960 }] } : undefined,
};

const DENTRO: { tono: Tono; titolo: string; testo: string }[] = [
  { tono: "rosa", titolo: "Una storia in 12 scene", testo: "Da leggere ad alta voce in pochi minuti: ogni pagina di testo ha accanto il suo disegno." },
  { tono: "giallo", titolo: "12 disegni da colorare", testo: "L'interno è in bianco e nero, con tratti grandi e spazi ampi, pensati per le mani dei più piccoli." },
  { tono: "azzurro", titolo: "Tre attività", testo: "Una pagina da disegnare, una domanda a cui rispondere con tre disegni e un labirinto." },
  { tono: "viola", titolo: "«Parliamone»", testo: "Tre domande per i grandi, per tornare sulla storia insieme dopo averla letta." },
];

const FAQ = [
  {
    domanda: "Dove si comprano i libri di Mizi?",
    risposta:
      "Su Amazon, in versione cartacea con copertina morbida. Sul sito c'è la presentazione di ogni libro e il pulsante che porta alla sua pagina Amazon. Giocamizi non vende libri direttamente.",
  },
  {
    domanda: "Per che età sono?",
    risposta: "Per bambini dai 3 ai 7 anni: i più piccoli ascoltano la storia e colorano, i più grandi la leggono da soli e fanno le attività.",
  },
  {
    domanda: "Com'è fatto il libro?",
    risposta: `È un albo quadrato di ${LIBRI[0]?.latoCm ?? "21,6"} centimetri per lato e ${LIBRI[0]?.pagine ?? 32} pagine. La copertina è a colori, l'interno in bianco e nero per poterlo colorare.`,
  },
  {
    domanda: "Chi ha scritto i libri di Mizi?",
    risposta:
      "Giorgia Palazzo e sua figlia Domiziana, le stesse di Giocamizi. Testi e illustrazioni sono realizzati con il supporto dell'intelligenza artificiale, e lo scriviamo anche nel libro.",
  },
  {
    domanda: "I giochi di Giocamizi restano gratis?",
    risposta: "Sì. I giochi sul sito sono e restano gratis e senza pubblicità; i libri sono una cosa a parte, per chi vuole una storia di Mizi da tenere in mano.",
  },
];

export default function LibriPage() {
  return (
    <>
      <Contenitore largo className="pb-16 pt-8">
        <JsonLd data={jsonLdFaq(FAQ)} />
        {LIBRI.map((l) => (
          <JsonLd
            key={l.codice}
            data={{
              "@context": "https://schema.org",
              "@type": "Book",
              name: l.titolo,
              url: url(`${PERCORSO_LIBRI}#${l.codice.toLowerCase()}`),
              image: url(l.copertina),
              author: l.autrici.split(" e ").map((nome) => ({ "@type": "Person", name: nome })),
              inLanguage: "it",
              bookFormat: "https://schema.org/Paperback",
              numberOfPages: l.pagine,
              typicalAgeRange: "3-7",
              description: l.quarta.join(" "),
              ...(l.amazon ? { sameAs: l.amazon } : {}),
            }}
          />
        ))}

        <section className={`overflow-hidden rounded-[2rem] border-2 ${TONI.giallo.card}`}>
          <div className="testata flex flex-col gap-4 p-5 sm:p-8 lg:p-12">
            <span className="w-fit rounded-full bg-white px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-notte">
              Su Amazon
            </span>
            <h1>I libri di Mizi</h1>
            <p className="max-w-2xl text-notte-tenue">
              Storie da leggere insieme e da colorare, con Mizi la pinguina e i suoi amici Tobia, Lilla e Nocciola.
            </p>
          </div>
        </section>

        <InBreve className="mx-auto mt-14 max-w-4xl">
          I libri di Mizi sono albi illustrati per bambini dai 3 ai 7 anni: una storia di Mizi la pinguina in 12 scene, con
          12 disegni da colorare, tre attività e tre domande per parlarne insieme. Sono di Giorgia Palazzo e Domiziana, le
          autrici di Giocamizi, e si comprano su Amazon in versione cartacea.
        </InBreve>

        <section className="mt-16 flex flex-col gap-10">
          {LIBRI.map((l) => (
            <article
              key={l.codice}
              id={l.codice.toLowerCase()}
              className="grid scroll-mt-28 items-center gap-8 rounded-[2rem] bg-white p-5 sm:p-8 md:grid-cols-[minmax(0,26rem)_1fr] lg:p-10"
            >
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[1.4rem] shadow-xl">
                <Image src={l.copertina} alt={l.alt} fill priority sizes="(min-width: 768px) 26rem, 100vw" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <p className="text-sm font-extrabold uppercase tracking-wide text-notte-tenue">
                  Volume {l.volume} · {l.tema} · {l.eta}
                </p>
                <h2 className="text-3xl font-black tracking-tight text-notte sm:text-4xl">{l.titolo}</h2>
                {l.quarta.map((p) => (
                  <p key={p} className="text-lg leading-relaxed text-notte-tenue">
                    {p}
                  </p>
                ))}
                <p className="text-sm font-bold text-notte-tenue">
                  Un libro di {l.autrici} · {l.pagine} pagine · {l.latoCm} × {l.latoCm} cm · copertina morbida
                </p>
                {l.amazon ? (
                  <a
                    href={l.amazon}
                    rel="nofollow noopener"
                    target="_blank"
                    data-libro-amazon={l.codice}
                    className="flex min-h-14 w-fit items-center rounded-2xl bg-viola-forte px-7 font-extrabold text-white hover:bg-notte"
                  >
                    Compralo su Amazon
                  </a>
                ) : (
                  <p
                    data-libro-in-arrivo={l.codice}
                    className="w-fit rounded-2xl border-2 border-dashed border-notte/30 px-5 py-3 font-extrabold text-notte"
                  >
                    In arrivo su Amazon
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-20">
          <TitoloVetrina>Cosa c&apos;è in ogni libro</TitoloVetrina>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DENTRO.map((d) => (
              <li key={d.titolo} className={`flex flex-col gap-2 rounded-[1.6rem] border-2 p-6 ${TONI[d.tono].card}`}>
                <h3 className="text-xl font-black text-notte">{d.titolo}</h3>
                <p className="leading-relaxed text-notte-tenue">{d.testo}</p>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-3xl text-center text-lg text-notte-tenue">
            Nell&apos;attesa, Mizi si colora anche sul telefono con il{" "}
            <Link href="/giochi/colora-con-mizi" className="font-bold text-viola underline underline-offset-4">
              gioco da colorare di Giocamizi
            </Link>
            , e le{" "}
            <Link href="/storie" className="font-bold text-viola underline underline-offset-4">
              storie della buonanotte
            </Link>{" "}
            si leggono gratis sul sito.
          </p>
        </section>

        <section className="mx-auto mt-20 grid max-w-3xl items-center gap-6 rounded-[1.8rem] bg-white p-6 sm:grid-cols-[8rem_1fr] sm:p-10">
          <span className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md">
            <Image src={STORIA_AUTRICI.foto} alt="Giorgia Palazzo con la figlia Domiziana" fill sizes="128px" className="object-cover" />
          </span>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-notte">{STORIA_AUTRICI.titolo}</h2>
            <p className="mt-2 text-lg leading-relaxed text-notte-tenue">{STORIA_AUTRICI.righe.join(" ")}</p>
            <Link href="/chi-siamo" className="mt-3 inline-block font-bold text-viola underline underline-offset-4">
              Chi siamo
            </Link>
          </div>
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
        testo="I giochi di Giocamizi restano gratis, senza pubblicità e senza fretta."
        azioni={[
          { href: "/giochi", etichetta: "Tutti i giochi" },
          { href: "/storie", etichetta: "Le storie" },
        ]}
      />
    </>
  );
}
