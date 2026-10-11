"use client";

import { useMemo, useState } from "react";
import { CardGioco } from "@/components/ui";
import { IconaGioco } from "@/components/icone";
import type { Skill } from "@/games/registry";

/**
 * Il catalogo dei giochi con i filtri: 31 giochi in colonna unica erano un
 * tunnel da novemila pixel. Qui: barra di filtri sticky (età + competenza),
 * card compatte su 2 colonne dal telefono (3 dal tablet, 4 dal desktop).
 * Senza filtri restano le tre fasce d'età di sempre, con le ancore.
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

const ETA = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
  const [eta, setEta] = useState<number | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);

  const competenze = useMemo(() => [...new Set(giochi.map((g) => g.skill))], [giochi]);

  const filtrati = giochi.filter(
    (g) =>
      (eta === null || (g.ageMin <= eta && eta <= g.ageMax)) &&
      (skill === null || g.skill === skill),
  );
  const filtroAttivo = eta !== null || skill !== null;

  const fasce = [
    { titolo: "Dai 3 ai 5 anni", giochi: giochi.filter((g) => g.ageMin <= 5) },
    { titolo: "Dai 6 agli 8 anni", giochi: giochi.filter((g) => g.ageMin >= 6 && g.ageMin <= 8) },
    { titolo: "Dai 9 anni in su", giochi: giochi.filter((g) => g.ageMin >= 9) },
  ];

  return (
    <div className="mt-6">
      <div className="sticky top-0 z-30 bg-crema/95 py-3 backdrop-blur">
        <div
          role="group"
          aria-label="Filtra per età"
          className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible"
        >
          <Chip attivo={eta === null} onClick={() => setEta(null)}>
            Tutte le età
          </Chip>
          {ETA.map((anni) => (
            <Chip key={anni} attivo={eta === anni} onClick={() => setEta(eta === anni ? null : anni)}>
              {anni} anni
            </Chip>
          ))}
        </div>
        <div
          role="group"
          aria-label="Filtra per competenza"
          className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible"
        >
          <Chip attivo={skill === null} onClick={() => setSkill(null)}>
            Tutte le competenze
          </Chip>
          {competenze.map((s) => (
            <Chip key={s} attivo={skill === s} onClick={() => setSkill(skill === s ? null : s)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      {filtroAttivo ? (
        <section className="mt-6" aria-live="polite">
          <p className="mb-4 font-bold text-notte-tenue">
            {filtrati.length === 1 ? "1 gioco" : `${filtrati.length} giochi`}
            {eta !== null && ` per ${eta} anni`}
            {skill !== null && ` di ${skill}`}
          </p>
          {filtrati.length > 0 ? (
            <GrigliaCompatta giochi={filtrati} />
          ) : (
            <p className="rounded-morbido border-2 border-crema-scuro bg-white p-5 text-notte-tenue">
              Con questi filtri non c&apos;è ancora nessun gioco: prova a togliere
              la competenza o a cambiare età.
            </p>
          )}
        </section>
      ) : (
        fasce.map((gruppo) => (
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
