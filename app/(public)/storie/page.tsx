import { TestataPagina } from "@/components/vetrina";
import { ScenaStorie } from "@/components/illustrazioni";
import type { Metadata } from "next";
import Link from "next/link";
import { tutteLeStorie } from "@/lib/content";
import { Contenitore, Griglia, TitoloSezione } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco } from "@/components/seo/JsonLd";
import { CardStoria } from "@/components/storie/CardStoria";

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
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Storie", percorso: "/storie" }])} />
      <JsonLd
        data={jsonLdElenco(
          "Storie per bambini da leggere — Gioca con Mizi",
          storie.map((s) => ({ nome: s.title, percorso: `/storie/${s.slug}` })),
        )}
      />
      <TestataPagina occhiello="Da leggere insieme" tono="viola" foto="S-01" ripiego={<ScenaStorie />}>
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
          Storie da leggere
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
          Un testo, tre caratteri: stampatello maiuscolo per chi inizia, minuscolo
          per la prima elementare, corsivo per la seconda. Con il pulsante Ascolta.
        </p>
      </TestataPagina>

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
          <p className="rounded-[1.4rem] border border-notte/10 bg-white p-5 text-notte-tenue">
            Le prime 12 storie sono in scrittura. Il piano è in
            content/stories/_index.md.
          </p>
        ) : (
          <Griglia>
            {storie.map((s, i) => (
              <CardStoria
                key={s.slug}
                slug={s.slug}
                titolo={s.title}
                sommario={s.summary}
                eta={`${s.age} anni`}
                minuti={s.minutes}
                indice={i}
              />
            ))}
          </Griglia>
        )}
      </section>
    </Contenitore>
  );
}
