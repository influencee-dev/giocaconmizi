import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { games } from "@/games/registry";
import { BottoneLink, Contenitore, TitoloSezione } from "@/components/ui";
import { Blob, Onda, Stelline } from "@/components/decor";
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
import { immagineMizi } from "@/lib/immagini";
import { Disegno, type NomeFigura } from "@/games/_engine/arte";
import { tutteLeStorie } from "@/lib/content";
import { eta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Giochi educativi per bambini dai 3 ai 12 anni",
  description:
    "Giochi educativi, storie da leggere, coding e biglietti di compleanno per bambini dai 3 ai 12 anni. Gratis, senza pubblicità e senza timer.",
  alternates: { canonical: "/" },
};

/* Le tessere-competenza: icona del catalogo + colore della palette. */
const COMPETENZE: { slug: string; nome: string; figura: NomeFigura; colore: string }[] = [
  { slug: "lettere", nome: "Lettere", figura: "libro", colore: "bg-rosa/15" },
  { slug: "numeri", nome: "Numeri", figura: "pesce", colore: "bg-azzurro/15" },
  { slug: "colori", nome: "Colori", figura: "fiore", colore: "bg-giallo/20" },
  { slug: "forme", nome: "Forme", figura: "stella", colore: "bg-viola/15" },
  { slug: "memoria", nome: "Memoria", figura: "gatto", colore: "bg-arancione/15" },
  { slug: "logica", nome: "Logica", figura: "razzo", colore: "bg-azzurro/15" },
  { slug: "matematica", nome: "Matematica", figura: "mela", colore: "bg-rosa/15" },
  { slug: "lettura", nome: "Lettura", figura: "libro", colore: "bg-giallo/20" },
  { slug: "inglese", nome: "Inglese", figura: "cane", colore: "bg-viola/15" },
  { slug: "emozioni", nome: "Emozioni", figura: "sole", colore: "bg-arancione/15" },
];

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

/** Slot immagine: la PNG di Mizi se è arrivata, altrimenti la scena SVG. */
function Slot({ src, alt, fallback }: { src: string | null; alt: string; fallback: React.ReactNode }) {
  if (!src) return <>{fallback}</>;
  return (
    <Image src={src} alt={alt} width={480} height={480} className="h-full w-auto object-contain" />
  );
}

export default function Home() {
  const inVetrina = IN_VETRINA.map((slug) => games.find((g) => g.slug === slug)).filter(
    (g): g is NonNullable<typeof g> => Boolean(g),
  );
  const storie = tutteLeStorie().length;

  const saluto = immagineMizi("mizi-saluto") ?? immagineMizi("mizi-logo");
  const SEZIONI = [
    {
      href: "/storie",
      nome: "Storie da leggere",
      testo:
        "Un testo, tre caratteri: stampatello, minuscolo, corsivo. Con la lettura ad alta voce, per chi impara a leggere.",
      cta: "Leggi una storia",
      img: immagineMizi("mizi-lettura"),
      scena: <ScenaStorie />,
    },
    {
      href: "/coding",
      nome: "Coding",
      testo:
        "Dalle frecce ai blocchi, fino al codice vero: otto giochi per imparare a programmare, dai 3 ai 12 anni.",
      cta: "Inizia a programmare",
      img: immagineMizi("mizi-coding"),
      scena: <ScenaCoding />,
    },
    {
      href: "/biglietti",
      nome: "Biglietti di compleanno",
      testo:
        "Inviti, auguri e ringraziamenti da personalizzare con nome ed età: si scaricano e si stampano gratis.",
      cta: "Crea un biglietto",
      img: immagineMizi("mizi-compleanno"),
      scena: <ScenaBiglietti />,
    },
    {
      href: "/compiti-vacanze/prima-elementare",
      nome: "Compiti delle vacanze",
      testo: "Schede per classe, dalla prima alla quinta: da fare online o da stampare.",
      cta: "Vai alle schede",
      img: immagineMizi("mizi-maestra"),
      scena: <ScenaCompiti />,
    },
  ];

  return (
    <>
      {/* ---------- HERO su crema, con mascotte nel blob ---------- */}
      <div className="relative overflow-hidden">
        <Stelline />
        <Contenitore className="pb-6 pt-10 sm:pb-10">
          <div className="flex flex-col-reverse items-center gap-8 sm:flex-row sm:justify-between">
            <div className="flex max-w-xl flex-col items-center gap-5 text-center sm:items-start sm:text-left">
              <span className="rounded-bolla bg-giallo/40 px-4 py-1.5 text-sm font-extrabold text-notte">
                Gratis · senza pubblicità · senza timer
              </span>
              <h1 className="text-3xl font-extrabold leading-tight text-notte sm:text-5xl">
                Giochi educativi per bambini dai 3 ai 12 anni
              </h1>
              <p className="text-lg text-notte-tenue">
                Si giocano con un dito, la voce di Mizi spiega cosa fare e
                nessuno mette fretta. Giochi, storie, coding e biglietti di
                compleanno: tutto qui, tutto gratis.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                <BottoneLink href="/giochi">Gioca ora</BottoneLink>
                <BottoneLink href="/storie" variante="chiaro">
                  Leggi una storia
                </BottoneLink>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {[`${games.length} giochi`, `${storie} storie`, "3–12 anni"].map((v) => (
                  <span
                    key={v}
                    className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-1.5 text-sm font-extrabold text-notte-tenue"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <Blob className="h-52 w-52 shrink-0 sm:h-72 sm:w-72">
              <div className="h-[85%] w-[85%]">
                <Slot src={saluto} alt="Mizi, la pinguina di Gioca con Mizi, saluta" fallback={<MiziIntero />} />
              </div>
            </Blob>
          </div>
        </Contenitore>
        <Onda colore="#FFFFFF" />
      </div>

      {/* ---------- Banda bianca: competenze + età ---------- */}
      <div className="bg-white">
        <Contenitore className="py-10">
          <TitoloSezione>Cosa vuole imparare oggi?</TitoloSezione>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {COMPETENZE.map((c) => (
              <Link
                key={c.slug}
                href={`/giochi/competenza/${c.slug}`}
                data-tap
                className="flex items-center gap-3 rounded-morbido border-2 border-crema-scuro bg-white p-3 transition-transform hover:-translate-y-0.5 hover:border-viola"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${c.colore}`}>
                  <span className="h-8 w-8">
                    <Disegno id={c.figura} />
                  </span>
                </span>
                <span className="font-extrabold text-notte">{c.nome}</span>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <TitoloSezione>Oppure scegli l&apos;età</TitoloSezione>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            {eta.map((anni, i) => {
              const sfondo = ["bg-rosa text-white", "bg-azzurro text-white", "bg-giallo text-notte", "bg-viola text-white", "bg-arancione text-white"][i % 5];
              return (
                <Link
                  key={anni}
                  href={`/giochi/eta/${anni}-anni`}
                  data-tap
                  aria-label={`Giochi per ${anni} anni`}
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold transition-transform hover:-translate-y-1 ${sfondo}`}
                >
                  {anni}
                </Link>
              );
            })}
          </div>
        </Contenitore>
        <Onda colore="#FFF3E6" />
      </div>

      {/* ---------- Banda crema: come funziona ---------- */}
      <div>
        <Contenitore className="py-10">
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
        </Contenitore>
        <Onda colore="#FFFFFF" />
      </div>

      {/* ---------- Banda bianca: giochi in evidenza ---------- */}
      <div className="bg-white">
        <Contenitore className="py-10">
          <TitoloSezione>Prova subito un gioco</TitoloSezione>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {inVetrina.map((g) => (
              <Link
                key={g.slug}
                href={`/giochi/${g.slug}`}
                data-tap
                className="group flex flex-col overflow-hidden rounded-morbido border-2 border-crema-scuro bg-white transition-transform hover:-translate-y-1 hover:border-viola"
              >
                <div className="flex h-24 items-center justify-center bg-crema p-2 sm:h-28" aria-hidden>
                  <IllustrazioneSkill skill={g.skill} />
                </div>
                <div className="flex grow flex-col gap-1 p-3">
                  <span className="font-extrabold leading-tight text-notte">{g.title}</span>
                  <span className="text-sm text-notte-tenue">
                    {g.ageMin}–{g.ageMax} anni
                  </span>
                  <span className="mt-auto pt-2">
                    <span className="inline-block rounded-bolla bg-rosa px-4 py-1.5 text-sm font-extrabold text-white transition-colors group-hover:bg-viola">
                      Gioca →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-5 text-center text-notte-tenue sm:text-left">
            In catalogo {games.length} giochi.{" "}
            <Link href="/giochi" className="font-bold text-viola underline underline-offset-4">
              Vedili tutti
            </Link>
            {" · "}
            <Link href="/metodo" className="font-bold text-viola underline underline-offset-4">
              Come li scegliamo
            </Link>
          </p>
        </Contenitore>
        <Onda colore="#9B6DD6" />
      </div>

      {/* ---------- Banda viola: i valori ---------- */}
      <div className="bg-viola">
        <Contenitore className="py-8">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {[
              ["0", "pubblicità"],
              ["0", "timer"],
              ["100%", "gratis"],
              [String(games.length), "giochi"],
            ].map(([numero, parola]) => (
              <div key={parola} className="flex flex-col">
                <span className="text-3xl font-extrabold text-white sm:text-4xl">{numero}</span>
                <span className="font-bold text-white/80">{parola}</span>
              </div>
            ))}
          </div>
        </Contenitore>
        <Onda colore="#FFF3E6" />
      </div>

      {/* ---------- Bande alternate: le sezioni ---------- */}
      <Contenitore className="py-10">
        <div className="flex flex-col gap-10">
          {SEZIONI.map((s, i) => (
            <div
              key={s.href}
              className={`flex flex-col items-center gap-6 sm:gap-10 ${
                i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
            >
              <div className="flex h-40 w-full items-center justify-center rounded-morbido bg-white p-4 sm:h-52 sm:w-2/5"
                aria-hidden
              >
                <Slot src={s.img} alt="" fallback={s.scena} />
              </div>
              <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
                <h2 className="text-2xl font-extrabold text-notte sm:text-3xl">{s.nome}</h2>
                <p className="max-w-xl text-lg text-notte-tenue">{s.testo}</p>
                <BottoneLink href={s.href} variante={i % 2 === 0 ? "azzurro" : "rosa"}>
                  {s.cta}
                </BottoneLink>
              </div>
            </div>
          ))}
        </div>
      </Contenitore>

      {/* ---------- CTA finale ---------- */}
      <Contenitore className="pb-12">
        <div className="relative overflow-hidden rounded-morbido bg-giallo/30 p-8 text-center sm:p-12">
          <Stelline />
          <div className="relative mx-auto mb-4 h-24 w-24">
            <Slot
              src={immagineMizi("mizi-festa") ?? saluto}
              alt=""
              fallback={<MiziIntero />}
            />
          </div>
          <h2 className="text-2xl font-extrabold text-notte sm:text-3xl">
            Pronti a giocare con Mizi?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-lg text-notte-tenue">
            Niente registrazione, niente installazione: si sceglie un gioco e si comincia.
          </p>
          <div className="relative mt-5">
            <BottoneLink href="/giochi">Vai ai giochi</BottoneLink>
          </div>
        </div>
      </Contenitore>
    </>
  );
}
