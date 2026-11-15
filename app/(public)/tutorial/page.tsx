import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore, Faq } from "@/components/ui";
import { Briciole, InBreve } from "@/components/directory/Briciole";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco, jsonLdFaq } from "@/components/seo/JsonLd";
import { GRUPPI, IN_ARRIVO, PERCORSO_TUTORIAL, TUTORIAL, minuti, percorsoTutorial, tutorialDi, type GruppoTutorial } from "@/lib/tutorial";

/** L'hub dei video tutorial di Mizi, in due gruppi: partner e utenti (lib/tutorial.ts). */

const TITOLO = "Video tutorial di Giocamizi, spiegati da Mizi";
const DESCRIZIONE =
  "Brevi video in cui Mizi la pinguina spiega come usare Giocamizi: per le attività, le scuole e le associazioni, e per le famiglie e gli insegnanti. Gratis, con sottotitoli.";

export const metadata: Metadata = {
  title: TITOLO,
  description: DESCRIZIONE,
  alternates: { canonical: PERCORSO_TUTORIAL },
  openGraph: { title: TITOLO, description: DESCRIZIONE, url: PERCORSO_TUTORIAL, type: "website" },
};

const RISPOSTA =
  "I video tutorial di Giocamizi sono brevi spiegazioni, tra uno e due minuti, in cui Mizi la pinguina mostra le schermate vere del sito passo per passo. Ci sono video per chi gestisce un'attività, una scuola o un'associazione, e video per famiglie e insegnanti. Hanno i sottotitoli e il testo completo sotto.";

const FAQ = [
  { domanda: "I video tutorial sono gratuiti?", risposta: "Sì, come tutto Giocamizi: si guardano dal sito, senza registrazione, senza pubblicità e senza cookie di terzi." },
  { domanda: "Si possono guardare senza audio?", risposta: "Sì: i sottotitoli sono dentro il video e accesi nel lettore, e sotto ogni video c'è il testo completo di quello che dice Mizi." },
  { domanda: "Chi è Mizi?", risposta: "Mizi è la pinguina di Giocamizi, la mascotte che guida i bambini nei giochi e che nei video spiega come funziona il sito." },
];

const ORDINE: GruppoTutorial[] = ["partner", "utenti"];

export default function HubTutorial() {
  return (
    <Contenitore largo className="py-8 sm:py-10">
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Tutorial", percorso: PERCORSO_TUTORIAL }])} />
      <JsonLd data={jsonLdElenco(TITOLO, TUTORIAL.map((t) => ({ nome: t.titolo, percorso: percorsoTutorial(t) })))} />
      <JsonLd data={jsonLdFaq(FAQ)} />

      <Briciole voci={[{ nome: "Tutorial" }]} />
      <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-notte sm:text-5xl">{TITOLO}</h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">{DESCRIZIONE}</p>
      <div className="mt-6">
        <InBreve testo={RISPOSTA} />
      </div>

      {ORDINE.map((g) => {
        const video = tutorialDi(g);
        return (
          <section key={g} className="mt-12" aria-labelledby={`gruppo-${g}`}>
            <h2 id={`gruppo-${g}`} className="text-[1.75rem] font-black leading-tight tracking-tight text-notte sm:text-4xl">
              {GRUPPI[g].titolo}
            </h2>
            <p className="mb-5 mt-1 max-w-2xl text-notte-tenue">{GRUPPI[g].descrizione}</p>
            {video.length > 0 && (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {video.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={percorsoTutorial(t)}
                      data-tap
                      className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-notte/10 bg-white transition-shadow hover:shadow-[0_16px_36px_-18px_rgba(31,36,48,0.45)]"
                    >
                      <span className="relative block">
                        {/* eslint-disable-next-line @next/next/no-img-element -- poster WebP già piccolo, dal nostro dominio */}
                        <img src={t.video.poster} alt="" loading="lazy" className="aspect-video w-full object-cover" />
                        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-viola text-2xl text-white shadow-lg transition-transform group-hover:scale-110">▶</span>
                        </span>
                        <span className="absolute bottom-2 right-2 rounded-lg bg-notte/85 px-2 py-0.5 text-xs font-extrabold text-white">{minuti(t.video.secondi)}</span>
                      </span>
                      <span className="flex flex-1 flex-col gap-1 p-4">
                        <span className="text-lg font-black leading-tight text-notte">{t.titolo}</span>
                        <span className="text-sm text-notte-tenue">{t.descrizione}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {IN_ARRIVO[g].length > 0 && (
              <div className="mt-5 rounded-[1.2rem] border-2 border-dashed border-crema-scuro bg-white/60 p-5">
                <p className="font-extrabold text-notte">In arrivo</p>
                <ul className="mt-2 grid gap-1 text-notte-tenue sm:grid-cols-2">
                  {IN_ARRIVO[g].map((titolo) => (
                    <li key={titolo}>· {titolo}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        );
      })}

      <Faq voci={FAQ} />
    </Contenitore>
  );
}
