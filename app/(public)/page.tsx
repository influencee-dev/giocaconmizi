import Link from "next/link";
import type { Metadata } from "next";
import { games } from "@/games/registry";
import { BottoneLink, Contenitore, Griglia, TitoloSezione } from "@/components/ui";
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

export default function Home() {
  return (
    <Contenitore className="py-10">
      <section className="flex flex-col gap-5">
        <h1 className="text-3xl font-extrabold leading-tight text-notte sm:text-4xl">
          Giochi educativi per bambini dai 3 ai 12 anni
        </h1>
        <p className="max-w-2xl text-lg text-notte-tenue">
          Giochi, storie da leggere, coding e biglietti di compleanno. Si giocano
          con un dito, la voce di Mizi spiega cosa fare e non c&apos;è nessun timer.
          Tutto gratis, senza pubblicità.
        </p>
        <div className="flex flex-wrap gap-3">
          <BottoneLink href="/giochi">Vai ai giochi</BottoneLink>
          <BottoneLink href="/storie" variante="chiaro">
            Leggi una storia
          </BottoneLink>
        </div>
      </section>

      <section className="mt-12">
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

      <section className="mt-12">
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

      <section className="mt-12">
        <TitoloSezione>Anche qui</TitoloSezione>
        <Griglia>
          <Scheda
            href="/coding"
            titolo="Coding"
            testo="Dalle frecce ai blocchi, fino al codice vero. Dai 3 ai 12 anni."
          />
          <Scheda
            href="/biglietti"
            titolo="Biglietti di compleanno"
            testo="Inviti e auguri da personalizzare e stampare. 50 sfondi."
          />
          <Scheda
            href="/compiti-vacanze/prima-elementare"
            titolo="Compiti delle vacanze"
            testo="Schede per classe, da fare online o da stampare."
          />
          <Scheda
            href="/storie"
            titolo="Storie da leggere"
            testo="Un testo, tre caratteri: stampatello, minuscolo, corsivo."
          />
        </Griglia>
      </section>

      <p className="mt-12 text-notte-tenue">
        In catalogo {games.length} giochi.{" "}
        <Link href="/metodo" className="font-bold text-viola underline underline-offset-4">
          Come li scegliamo
        </Link>
        .
      </p>
    </Contenitore>
  );
}

function Scheda({ href, titolo, testo }: { href: string; titolo: string; testo: string }) {
  return (
    <Link
      href={href}
      data-tap
      className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5 transition-colors hover:border-viola"
    >
      <span className="text-xl font-extrabold text-notte">{titolo}</span>
      <span className="text-notte-tenue">{testo}</span>
    </Link>
  );
}
