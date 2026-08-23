import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games, type Skill } from "@/games/registry";
import { CardGioco, Contenitore, Griglia } from "@/components/ui";
import { JsonLd, jsonLdBreadcrumb } from "@/components/seo/JsonLd";

type Params = { params: Promise<{ skill: string }> };

/**
 * Alcuni slug SEO non coincidono con la Skill tecnica del registry:
 * la gente cerca "lettere", non "alfabeto" (CONTENT-GUIDE, keyword per hub).
 */
const alias: Record<string, { skills: Skill[]; nome: string; descrizione: string }> = {
  lettere: {
    skills: ["alfabeto", "fonetica", "lettura"],
    nome: "Giochi con le lettere",
    descrizione:
      "Giochi per imparare le lettere, i suoni e le prime parole. Gratis, senza pubblicità.",
  },
  numeri: {
    skills: ["numeri"],
    nome: "Giochi con i numeri",
    descrizione:
      "Giochi per contare, riconoscere i numeri e le quantità. Gratis, senza pubblicità.",
  },
  colori: { skills: ["colori"], nome: "Giochi con i colori", descrizione: "Giochi per riconoscere e abbinare i colori." },
  forme: { skills: ["forme"], nome: "Giochi con le forme", descrizione: "Giochi per riconoscere cerchio, quadrato, triangolo e le altre forme." },
  memoria: { skills: ["memoria"], nome: "Giochi di memoria", descrizione: "Memory e giochi di memoria visiva per bambini." },
  logica: { skills: ["logica"], nome: "Giochi di logica", descrizione: "Giochi di logica, confronti e sequenze." },
  matematica: { skills: ["matematica"], nome: "Giochi di matematica", descrizione: "Addizioni, sottrazioni e tabelline con supporto visivo." },
  lettura: { skills: ["lettura", "comprensione"], nome: "Giochi per imparare a leggere", descrizione: "Sillabe, parole e comprensione del testo." },
  inglese: { skills: ["inglese"], nome: "Giochi in inglese", descrizione: "Prime parole in inglese: colori, animali, numeri." },
  emozioni: { skills: ["emozioni"], nome: "Giochi sulle emozioni", descrizione: "Riconoscere e nominare le emozioni con Mizi." },
  coding: { skills: ["coding"], nome: "Giochi di coding", descrizione: "Dalle frecce ai blocchi: coding per bambini e ragazzi." },
  attenzione: { skills: ["attenzione"], nome: "Giochi di attenzione", descrizione: "Trova le differenze e giochi di attenzione visiva." },
  spazio: { skills: ["spazio"], nome: "Giochi di orientamento", descrizione: "Puzzle e giochi di orientamento nello spazio." },
  ascolto: { skills: ["ascolto"], nome: "Giochi di ascolto", descrizione: "Riconoscere suoni e versi degli animali." },
};

export function generateStaticParams() {
  return Object.keys(alias).map((skill) => ({ skill }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { skill } = await params;
  const voce = alias[skill];
  if (!voce) return {};
  return {
    title: voce.nome,
    description: voce.descrizione,
    alternates: { canonical: `/giochi/competenza/${skill}` },
  };
}

export default async function HubCompetenzaPage({ params }: Params) {
  const { skill } = await params;
  const voce = alias[skill];
  if (!voce) notFound();

  const selezione = games.filter((g) => voce.skills.includes(g.skill));

  return (
    <Contenitore className="py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Giochi", percorso: "/giochi" },
          { nome: voce.nome, percorso: `/giochi/competenza/${skill}` },
        ])}
      />

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">{voce.nome}</h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">{voce.descrizione}</p>

      <div className="mt-8">
        <Griglia>
          {selezione.map((g) => (
            <CardGioco
              key={g.slug}
              slug={g.slug}
              titolo={g.title}
              descrizione={g.subskill}
              eta={`${g.ageMin}–${g.ageMax}`}
              minuti={g.minutes}
            />
          ))}
        </Griglia>
      </div>
    </Contenitore>
  );
}
