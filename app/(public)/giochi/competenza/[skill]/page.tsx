import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games, type Skill } from "@/games/registry";
import { CardGioco, Contenitore, Griglia } from "@/components/ui";
import { IconaGioco } from "@/components/icone";
import { JsonLd, jsonLdBreadcrumb, jsonLdElenco } from "@/components/seo/JsonLd";

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
  colori: { skills: ["colori"], nome: "Giochi con i colori", descrizione: "Giochi gratis con i colori, dai 3 anni: abbinare ogni oggetto al suo colore e colorare i disegni con Mizi. Senza pubblicità e senza tempo." },
  forme: { skills: ["forme"], nome: "Giochi con le forme", descrizione: "Giochi gratis per riconoscere cerchio, quadrato, triangolo e le altre forme, dai 3 anni. Mizi dice il nome di ogni forma. Senza pubblicità." },
  memoria: { skills: ["memoria"], nome: "Giochi di memoria", descrizione: "Memory e giochi di memoria visiva per bambini dai 3 anni: livelli che crescono piano e un aiuto quando serve. Gratis, senza pubblicità." },
  logica: { skills: ["logica"], nome: "Giochi di logica", descrizione: "Giochi di logica gratis per bambini dai 3 anni: grande e piccolo, sequenze da completare e un labirinto da esplorare. Senza tempo e senza pubblicità." },
  matematica: { skills: ["matematica"], nome: "Giochi di matematica", descrizione: "Giochi di matematica gratis per la scuola primaria: addizioni, tabelline, frazioni e monete in euro, con figure che aiutano a capire. Senza pubblicità." },
  lettura: { skills: ["lettura", "comprensione"], nome: "Giochi per imparare a leggere", descrizione: "Giochi gratis per imparare a leggere: sillabe da unire, prime parole e piccoli testi da capire, dai 5 anni. Senza pubblicità e senza tempo." },
  inglese: { skills: ["inglese"], nome: "Giochi in inglese", descrizione: "Giochi gratis per le prime parole in inglese: colori, animali e numeri detti a voce, dai 5 anni. Senza pubblicità e senza registrazione." },
  emozioni: { skills: ["emozioni"], nome: "Giochi sulle emozioni", descrizione: "Giochi gratis per riconoscere e dare un nome alle emozioni con Mizi: gioia, tristezza, rabbia, paura e sorpresa. Dai 3 anni, senza pubblicità." },
  coding: { skills: ["coding"], nome: "Giochi di coding", descrizione: "Giochi di coding gratis per bambini dai 3 ai 12 anni: dalle frecce ai blocchi, fino al comando «ripeti». Niente da installare, senza pubblicità." },
  attenzione: { skills: ["attenzione"], nome: "Giochi di attenzione", descrizione: "Giochi di attenzione gratis per bambini dai 5 anni: trova le differenze tra due disegni quasi uguali, con un aiuto quando serve. Senza tempo e senza pubblicità." },
  spazio: { skills: ["spazio"], nome: "Giochi di orientamento", descrizione: "Puzzle gratis per orientarsi nello spazio, dai 3 anni: pezzi grandi da mettere al posto giusto, con la figura guida in trasparenza. Senza pubblicità." },
  ascolto: { skills: ["ascolto"], nome: "Giochi di ascolto", descrizione: "Giochi di ascolto gratis per bambini dai 3 anni: si sente un verso e si tocca l'animale giusto. Senza pubblicità e senza registrazione." },
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
      {/* L'elenco dei giochi di questa competenza, leggibile dai motori e dalle AI. */}
      <JsonLd
        data={jsonLdElenco(
          `${voce.nome} — giochi educativi`,
          selezione.map((g) => ({ nome: g.title, percorso: `/giochi/${g.slug}` })),
        )}
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
              illustrazione={<IconaGioco slug={g.slug} skill={g.skill} />}
            />
          ))}
        </Griglia>
      </div>
    </Contenitore>
  );
}
