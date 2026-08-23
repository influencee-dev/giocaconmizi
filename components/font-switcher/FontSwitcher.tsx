"use client";

import { useState } from "react";
import { parla, zittisci } from "@/lib/audio";

/**
 * Lettore delle storie: un testo, tre caratteri (piano §2, decisione 5).
 * STAMPATELLO MAIUSCOLO per chi inizia, minuscolo per la prima elementare,
 * corsivo per la seconda. Più dimensione testo e pulsante Ascolta.
 */

const caratteri = [
  { id: "stampatello", etichetta: "STAMPATELLO" },
  { id: "minuscolo", etichetta: "minuscolo" },
  { id: "corsivo", etichetta: "corsivo" },
] as const;

type Carattere = (typeof caratteri)[number]["id"];

const dimensioni = [
  { id: "normale", etichetta: "A", classe: "text-xl" },
  { id: "grande", etichetta: "A", classe: "text-2xl" },
  { id: "enorme", etichetta: "A", classe: "text-3xl" },
] as const;

export function LettoreStoria({ testo }: { testo: string }) {
  const [carattere, setCarattere] = useState<Carattere>("stampatello");
  const [dimensione, setDimensione] = useState<(typeof dimensioni)[number]["id"]>("grande");
  const [inLettura, setInLettura] = useState(false);

  const classeDimensione =
    dimensioni.find((d) => d.id === dimensione)?.classe ?? "text-2xl";

  function ascolta() {
    if (inLettura) {
      zittisci();
      setInLettura(false);
      return;
    }
    parla(testo);
    setInLettura(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Scegli il carattere">
          {caratteri.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCarattere(c.id)}
              aria-pressed={carattere === c.id}
              className={`rounded-bolla px-5 py-3 text-base font-bold transition-colors ${
                carattere === c.id
                  ? "bg-viola text-white"
                  : "border-2 border-crema-scuro bg-white text-notte"
              } ${c.id === "corsivo" ? "italic" : ""}`}
            >
              {c.etichetta}
            </button>
          ))}
        </div>

        <div className="flex gap-2" role="group" aria-label="Dimensione del testo">
          {dimensioni.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDimensione(d.id)}
              aria-pressed={dimensione === d.id}
              aria-label={`Testo ${d.id}`}
              className={`rounded-bolla border-2 px-4 font-extrabold ${
                dimensione === d.id
                  ? "border-viola bg-viola text-white"
                  : "border-crema-scuro bg-white text-notte"
              }`}
              style={{ fontSize: `${1 + i * 0.35}rem` }}
            >
              {d.etichetta}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={ascolta}
          className="rounded-bolla bg-azzurro px-6 py-3 text-lg font-bold text-white"
        >
          {inLettura ? "⏸ Ferma" : "🔊 Ascolta"}
        </button>
      </div>

      <article
        data-carattere={carattere}
        className={`testo-lettura whitespace-pre-line rounded-morbido bg-white p-6 ${classeDimensione} ${
          carattere === "corsivo" ? "italic" : ""
        }`}
      >
        {testo}
      </article>
    </div>
  );
}
