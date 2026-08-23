import type { Metadata } from "next";
import Link from "next/link";
import { tutteLeStorie } from "@/lib/content";
import { Contenitore, Griglia, TitoloSezione } from "@/components/ui";

export const metadata: Metadata = {
  title: "Storie per bambini da leggere",
  description:
    "Storie brevi per bambini da leggere in stampatello, minuscolo o corsivo. Gratis, con il pulsante Ascolta.",
  alternates: { canonical: "/storie" },
};

const caratteri = [
  { slug: "stampatello", nome: "In stampatello" },
  { slug: "minuscolo", nome: "In minuscolo" },
  { slug: "corsivo", nome: "In corsivo" },
];

export default function StoriePage() {
  const storie = tutteLeStorie();

  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
        Storie da leggere
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
        Un testo, tre caratteri: stampatello maiuscolo per chi inizia, minuscolo
        per la prima elementare, corsivo per la seconda. Con il pulsante Ascolta.
      </p>

      <section className="mt-8">
        <TitoloSezione>Per età</TitoloSezione>
        <div className="flex flex-wrap gap-3">
          {[5, 6, 7].map((anni) => (
            <Link
              key={anni}
              href={`/storie/eta/${anni}-anni`}
              data-tap
              className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-6 text-xl font-extrabold text-notte hover:border-viola hover:text-viola"
            >
              {anni} anni
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <TitoloSezione>Per carattere</TitoloSezione>
        <div className="flex flex-wrap gap-3">
          {caratteri.map((c) => (
            <Link
              key={c.slug}
              href={`/storie/${c.slug}`}
              data-tap
              className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-6 text-lg font-bold text-notte hover:border-viola hover:text-viola"
            >
              {c.nome}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <TitoloSezione>Tutte le storie</TitoloSezione>
        {storie.length === 0 ? (
          <p className="rounded-morbido border-2 border-crema-scuro bg-white p-5 text-notte-tenue">
            Le prime 12 storie sono in scrittura. Il piano è in
            content/stories/_index.md.
          </p>
        ) : (
          <Griglia>
            {storie.map((s) => (
              <Link
                key={s.slug}
                href={`/storie/${s.slug}`}
                data-tap
                className="flex flex-col gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-5 hover:border-viola"
              >
                <span className="text-xl font-extrabold text-notte">{s.title}</span>
                {s.summary && <span className="text-notte-tenue">{s.summary}</span>}
                <span className="mt-auto pt-2 text-sm font-bold text-viola">
                  {s.age} anni · {s.minutes} minuti
                </span>
              </Link>
            ))}
          </Griglia>
        )}
      </section>
    </Contenitore>
  );
}
