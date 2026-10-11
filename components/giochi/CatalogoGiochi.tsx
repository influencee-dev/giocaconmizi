"use client";

import { useMemo, useState } from "react";
import { CardGioco } from "@/components/ui";
import { IconaGioco } from "@/components/icone";
import type { Skill } from "@/games/registry";

/**
 * Il catalogo dei giochi con i filtri: 31 giochi in colonna unica erano un
 * tunnel da novemila pixel. Qui: barra di filtri sticky (si aggancia sotto
 * l'header, alto 86px) e card compatte su 2 colonne dal telefono (3 dal
 * tablet, 4 dal desktop). Pochi filtri larghi, non uno per micro-competenza:
 * le fasce d'età sono le stesse tre delle sezioni, le competenze sono 9 aree.
 * Senza filtri restano le tre fasce d'età di sempre.
 */

export interface GiocoInCatalogo {
  slug: string;
  title: string;
  subskill: string;
  ageMin: number;
  ageMax: number;
  minutes: number;
  skill: Skill;
}

const FASCE_ETA = [
  { nome: "3–5 anni", da: 3, a: 5 },
  { nome: "6–8 anni", da: 6, a: 8 },
  { nome: "9–12 anni", da: 9, a: 12 },
];

const AREE: { slug: string; nome: string; skills: Skill[] }[] = [
  { slug: "lettere", nome: "lettere e parole", skills: ["alfabeto", "fonetica", "lettura", "ortografia", "comprensione", "ascolto"] },
  { slug: "numeri", nome: "numeri e matematica", skills: ["numeri", "matematica"] },
  { slug: "colori-forme", nome: "colori e forme", skills: ["colori", "forme"] },
  { slug: "memoria", nome: "memoria e attenzione", skills: ["memoria", "attenzione"] },
  { slug: "logica", nome: "logica", skills: ["logica", "spazio"] },
  { slug: "inglese", nome: "inglese", skills: ["inglese"] },
  { slug: "emozioni", nome: "emozioni", skills: ["emozioni"] },
  { slug: "coding", nome: "coding", skills: ["coding"] },
  { slug: "tempo", nome: "orologio", skills: ["tempo"] },
];

function Chip({
  attivo,
  onClick,
  children,
}: {
  attivo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={attivo}
      className={`shrink-0 whitespace-nowrap rounded-bolla border-2 px-4 py-2 text-sm font-extrabold transition-colors ${
        attivo
          ? "border-viola bg-viola text-white"
          : "border-crema-scuro bg-white text-notte hover:border-viola"
      }`}
      style={{ minHeight: "2.75rem" }}
    >
      {children}
    </button>
  );
}

function GrigliaCompatta({ giochi }: { giochi: GiocoInCatalogo[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {giochi.map((g) => (
        <CardGioco
          key={g.slug}
          compatta
          slug={g.slug}
          titolo={g.title}
          descrizione={g.subskill}
          eta={`${g.ageMin}–${g.ageMax}`}
          minuti={g.minutes}
          illustrazione={<IconaGioco slug={g.slug} skill={g.skill} lato="h-8 w-8" />}
        />
      ))}
    </div>
  );
}

export function CatalogoGiochi({ giochi }: { giochi: GiocoInCatalogo[] }) {
  const [fascia, setFascia] = useState<number | null>(null);
  const [area, setArea] = useState<string | null>(null);

  // Solo le aree che hanno davvero almeno un gioco.
  const aree = useMemo(
    () => AREE.filter((a) => giochi.some((g) => a.skills.includes(g.skill))),
    [giochi],
  );

  const fasciaScelta = fascia !== null ? FASCE_ETA[fascia] : null;
  const areaScelta = area !== null ? aree.find((a) => a.slug === area) ?? null : null;

  const filtrati = giochi.filter(
    (g) =>
      (fasciaScelta === null || (g.ageMin <= fasciaScelta.a && g.ageMax >= fasciaScelta.da)) &&
      (areaScelta === null || areaScelta.skills.includes(g.skill)),
  );
  const filtroAttivo = fasciaScelta !== null || areaScelta !== null;

  const sezioni = [
    { titolo: "Dai 3 ai 5 anni", giochi: giochi.filter((g) => g.ageMin <= 5) },
    { titolo: "Dai 6 agli 8 anni", giochi: giochi.filter((g) => g.ageMin >= 6 && g.ageMin <= 8) },
    { titolo: "Dai 9 anni in su", giochi: giochi.filter((g) => g.ageMin >= 9) },
  ];

  return (
    <div className="mt-6">
      {/* top-[84px]: 2px sotto gli 86px dell'header sticky, z sotto il suo z-30. */}
      <div className="sticky top-[84px] z-20 bg-crema/95 py-3 backdrop-blur">
        <div role="group" aria-label="Filtra per età" className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible">
          <Chip attivo={fascia === null} onClick={() => setFascia(null)}>
            Tutte le età
          </Chip>
          {FASCE_ETA.map((f, i) => (
            <Chip key={f.nome} attivo={fascia === i} onClick={() => setFascia(fascia === i ? null : i)}>
              {f.nome}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Filtra per competenza" className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible">
          <Chip attivo={area === null} onClick={() => setArea(null)}>
            Tutto
          </Chip>
          {aree.map((a) => (
            <Chip key={a.slug} attivo={area === a.slug} onClick={() => setArea(area === a.slug ? null : a.slug)}>
              {a.nome}
            </Chip>
          ))}
        </div>
      </div>

      {filtroAttivo ? (
        <section className="mt-6" aria-live="polite">
          <p className="mb-4 font-bold text-notte-tenue">
            {filtrati.length === 1 ? "1 gioco" : `${filtrati.length} giochi`}
            {areaScelta && ` di ${areaScelta.nome}`}
            {fasciaScelta && ` per ${fasciaScelta.nome}`}
          </p>
          {filtrati.length > 0 ? (
            <GrigliaCompatta giochi={filtrati} />
          ) : (
            <p className="rounded-morbido border-2 border-crema-scuro bg-white p-5 text-notte-tenue">
              Con questi filtri non c&apos;è ancora nessun gioco: prova a
              togliere la competenza o a cambiare fascia d&apos;età.
            </p>
          )}
        </section>
      ) : (
        sezioni.map((gruppo) => (
          <section key={gruppo.titolo} className="mt-8">
            <h2 className="mb-4 text-2xl font-extrabold text-notte sm:text-3xl">
              {gruppo.titolo}
            </h2>
            <GrigliaCompatta giochi={gruppo.giochi} />
          </section>
        ))
      )}
    </div>
  );
}
