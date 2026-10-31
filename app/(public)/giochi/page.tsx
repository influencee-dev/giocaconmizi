import { TestataPagina } from "@/components/vetrina";
import type { Metadata } from "next";
import { games } from "@/games/registry";
import { Contenitore } from "@/components/ui";
import { CatalogoGiochi } from "@/components/giochi/CatalogoGiochi";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Tutti i giochi educativi",
  description:
    "Tutti i giochi educativi di Gioca con Mizi: colori, forme, numeri, lettere, logica, coding. Gratis, senza pubblicità, dai 3 ai 12 anni.",
  alternates: { canonical: "/giochi" },
};

export default function GiochiPage() {
  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd data={jsonLdBreadcrumb([{ nome: "Giochi", percorso: "/giochi" }])} />
      <JsonLd
        data={jsonLdElenco(
          "Tutti i giochi educativi — Gioca con Mizi",
          games.map((g) => ({ nome: g.title, percorso: `/giochi/${g.slug}` })),
        )}
      />

      <TestataPagina occhiello="Gratis, senza timer" tono="azzurro" foto="G-01">
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">
          Tutti i giochi
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-notte-tenue">
          Un gioco, una competenza. Nessun timer, nessun punteggio da battere:
          si gioca finché si ha voglia.
        </p>
      </TestataPagina>

      <CatalogoGiochi
        giochi={games.map((g) => ({
          slug: g.slug,
          title: g.title,
          subskill: g.subskill,
          ageMin: g.ageMin,
          ageMax: g.ageMax,
          minutes: g.minutes,
          skill: g.skill,
        }))}
      />
    </Contenitore>
  );
}
