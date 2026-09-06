import Link from "next/link";
import type { Metadata } from "next";
import { games } from "@/games/registry";
import { BottoneLink, Contenitore, TitoloSezione } from "@/components/ui";
import {
  IllustrazioneSkill,
  MiziIntero,
  ScenaBiglietti,
  ScenaCoding,
  ScenaCompiti,
  ScenaMiziSpiega,
  ScenaScegliEta,
  ScenaSenzaFretta,
  ScenaStorie,
} from "@/components/illustrazioni";
import { eta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Giochi educativi per bambini dai 3 ai 12 anni",
  description:
    "Giochi educativi, storie da leggere, coding e biglietti di compleanno per bambini dai 3 ai 12 anni. Gratis, senza pubblicità e senza timer.",
  alternates: { canonical: "/" },
};

const competenze = [
  { slug: "lettere", nome: "Lettere" },
  { slug: "numeri", nome: "Numeri" },
  { slug: "colori", nome: "Colori" },
  { slug: "forme", nome: "Forme" },
  { slug: "memoria", nome: "Memoria" },
  { slug: "logica", nome: "Logica" },
  { slug: "matematica", nome: "Matematica" },
  { slug: "lettura", nome: "Lettura" },
  { slug: "inglese", nome: "Inglese" },
  { slug: "emozioni", nome: "Emozioni" },
];

/** I giochi in vetrina: uno per fascia, i più immediati da capire. */
const IN_VETRINA = [
  "conta-fino-a-10",
  "abbina-i-colori",
  "memory-animali",
  "le-emozioni-di-mizi",
  "tocca-la-lettera",
  "guida-mizi",
  "tabelline",
  "labirinto-a-blocchi",
];

const PASSI = [
  {
    titolo: "1. Scegli l'età",
    testo: "Ogni anno ha la sua pagina: solo giochi adatti, niente da configurare.",
    scena: <ScenaScegliEta />,
  },
  {
    titolo: "2. Mizi spiega il gioco",
    testo: "L'istruzione è scritta nel fumetto e detta a voce: giocano anche i bambini che non leggono.",
    scena: <ScenaMiziSpiega />,
  },
  {
    titolo: "3. Si gioca senza fretta",
    testo: "Niente timer, niente game over: se sbagli riprovi, e alla fine c'è la festa.",
    scena: <ScenaSenzaFretta />,
  },
];

const SEZIONI = [
  {
    href: "/storie",
    nome: "Storie da leggere",
    testo: "Un testo, tre caratteri: stampatello, minuscolo, corsivo. Con la lettura ad alta voce.",
    scena: <ScenaStorie />,
  },
  {
    href: "/coding",
    nome: "Coding",
    testo: "Dalle frecce ai blocchi, fino al codice vero. Dai 3 ai 12 anni.",
    scena: <ScenaCoding />,
  },
  {
    href: "/biglietti",
    nome: "Biglietti di compleanno",
    testo: "Inviti e auguri da personalizzare con nome ed età, da stampare o mandare.",
    scena: <ScenaBiglietti />,
  },
  {
    href: "/compiti-vacanze/prima-elementare",
    nome: "Compiti delle vacanze",
    testo: "Schede per classe, da fare online o da stampare.",
    scena: <ScenaCompiti />,
  },
];

export default function Home() {
  const inVetrina = IN_VETRINA.map((slug) => games.find((g) => g.slug === slug)).filter(
    (g): g is NonNullable<typeof g> => Boolean(g),
  );

  return (
    <Contenitore className="py-10">
      {/* Hero con Mizi che saluta */}
      <section className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl flex-col gap-5">
          <h1 className="text-3xl font-extrabold leading-tight text-notte sm:text-4xl">
            Giochi educativi per bambini dai 3 ai 12 anni
          </h1>
          <p className="text-lg text-notte-tenue">
            Giochi, storie da leggere, coding e biglietti di compleanno. Si
            giocano con un dito, la voce di Mizi spiega cosa fare e non c&apos;è
            nessun timer. Tutto gratis, senza pubblicità.
          </p>
          <div className="flex flex-wrap gap-3">
            <BottoneLink href="/giochi">Vai ai giochi</BottoneLink>
            <BottoneLink href="/storie" variante="chiaro">
              Leggi una storia
            </BottoneLink>
          </div>
        </div>
        <div className="relative h-44 w-40 shrink-0 sm:h-56 sm:w-52" aria-hidden>
          <div className="absolute inset-x-2 bottom-1 top-6 rounded-full bg-azzurro/20" />
          <MiziIntero className="relative h-full w-full" />
        </div>
      </section>

      {/* Come funziona, coi disegni */}
      <section className="mt-14">
        <TitoloSezione>Come funziona</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-3">
          {PASSI.map((p) => (
            <div
              key={p.titolo}
              className="flex flex-col gap-3 rounded-morbido border-2 border-crema-scuro bg-white p-5"
            >
              <div className="h-28" aria-hidden>{p.scena}</div>
              <p className="text-xl font-extrabold text-notte">{p.titolo}</p>
              <p className="text-notte-tenue">{p.testo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vetrina dei giochi, con le scenette */}
      <section className="mt-14">
        <TitoloSezione>Prova subito un gioco</TitoloSezione>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {inVetrina.map((g) => (
            <Link
              key={g.slug}
              href={`/giochi/${g.slug}`}
              data-tap
              className="flex flex-col overflow-hidden rounded-morbido border-2 border-crema-scuro bg-white transition-colors hover:border-viola"
            >
              <div className="flex h-24 items-center justify-center bg-crema p-2 sm:h-28" aria-hidden>
                <IllustrazioneSkill skill={g.skill} />
              </div>
              <div className="flex flex-col gap-1 p-3">
                <span className="font-extrabold leading-tight text-notte">{g.title}</span>
                <span className="text-sm text-notte-tenue">
                  {g.ageMin}–{g.ageMax} anni
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-notte-tenue">
          In catalogo {games.length} giochi.{" "}
          <Link href="/giochi" className="font-bold text-viola underline underline-offset-4">
            Vedili tutti
          </Link>
          {" · "}
          <Link href="/metodo" className="font-bold text-viola underline underline-offset-4">
            Come li scegliamo
          </Link>
        </p>
      </section>

      {/* Hub per età: la porta d'ingresso principale */}
      <section className="mt-14">
        <TitoloSezione>Scegli l&apos;età</TitoloSezione>
        <div className="flex flex-wrap gap-3">
          {eta.map((anni) => (
            <Link
              key={anni}
              href={`/giochi/eta/${anni}-anni`}
              data-tap
              className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-6 text-xl font-extrabold text-notte transition-colors hover:border-viola hover:text-viola"
            >
              {anni} anni
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <TitoloSezione>Scegli la competenza</TitoloSezione>
        <div className="flex flex-wrap gap-3">
          {competenze.map((c) => (
            <Link
              key={c.slug}
              href={`/giochi/competenza/${c.slug}`}
              data-tap
              className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-6 text-lg font-bold text-notte transition-colors hover:border-viola hover:text-viola"
            >
              {c.nome}
            </Link>
          ))}
        </div>
      </section>

      {/* Le altre sezioni del sito, illustrate */}
      <section className="mt-14">
        <TitoloSezione>Anche qui</TitoloSezione>
        <div className="grid gap-4 sm:grid-cols-2">
          {SEZIONI.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              data-tap
              className="flex flex-col gap-2 overflow-hidden rounded-morbido border-2 border-crema-scuro bg-white transition-colors hover:border-viola"
            >
              <div className="h-28 bg-crema p-3" aria-hidden>{s.scena}</div>
              <div className="flex flex-col gap-1 p-5 pt-2">
                <span className="text-xl font-extrabold text-notte">{s.nome}</span>
                <span className="text-notte-tenue">{s.testo}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Contenitore>
  );
}
