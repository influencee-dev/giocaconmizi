"use client";

import { useCallback, useEffect, useState } from "react";
import { GameShell } from "@/components/game-shell/GameShell";
import { COLORI, type NomeColore } from "./arte";
import { parla } from "@/lib/audio";
import { stelle, type GameProps } from "./tipi";

/**
 * Pixel art: colorare una griglia seguendo un codice.
 *
 * Livello 1 (dai 4 anni): la legenda dice riga per riga quali celle colorare.
 * Livello 2 (dai 7): coordinate tipo B3, cioè il primo passo verso l'idea che
 * una posizione si possa scrivere. Modalità libera in fondo, senza obiettivo.
 */

export interface Quadro {
  nome: string;
  /** Una riga per stringa, un carattere per cella: "." = vuota, iniziale del colore. */
  righe: string[];
  legenda: Record<string, NomeColore>;
}

export interface PixelArtProps extends GameProps {
  titolo: string;
  quadri: Quadro[];
}

const LETTERE = "ABCDEFGHIJ";

export function PixelArt({ titolo, quadri, age, onProgress, onComplete, demo = false }: PixelArtProps) {
  const [indice, setIndice] = useState(0);
  const [griglia, setGriglia] = useState<string[][]>([]);
  const [colore, setColore] = useState<string>("");
  const [punti, setPunti] = useState(0);
  const [finito, setFinito] = useState(false);

  const quadro = quadri[Math.min(indice, quadri.length - 1)];
  const totale = quadri.length;
  const conCoordinate = age >= 7;

  const svuota = useCallback(() => {
    setGriglia(quadro.righe.map((riga) => riga.split("").map(() => ".")));
    setColore(Object.keys(quadro.legenda)[0] ?? "");
  }, [quadro]);

  useEffect(() => {
    svuota();
  }, [svuota]);

  const completo =
    griglia.length > 0 &&
    griglia.every((riga, y) => riga.every((cella, x) => cella === quadro.righe[y][x]));

  const dipingi = useCallback(
    (x: number, y: number) => {
      if (finito) return;
      setGriglia((precedente) =>
        precedente.map((riga, ry) =>
          ry === y ? riga.map((cella, rx) => (rx === x ? (cella === colore ? "." : colore) : cella)) : riga,
        ),
      );
    },
    [colore, finito],
  );

  useEffect(() => {
    if (!completo || finito) return;
    parla(`Bravissimo! È ${quadro.nome}.`);
    const nuoviPunti = punti + 1;
    setPunti(nuoviPunti);

    const t = window.setTimeout(() => {
      const prossimo = indice + 1;
      if (prossimo >= totale) {
        setFinito(true);
        onComplete?.({ score: nuoviPunti, stars: stelle(nuoviPunti, totale) });
        return;
      }
      setIndice(prossimo);
      onProgress?.(prossimo, totale);
    }, 2200);
    return () => window.clearTimeout(t);
    // punti resta fuori dalle dipendenze: cambia dentro l'effetto e lo rifarebbe partire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completo, finito, indice, totale, quadro.nome, onComplete, onProgress]);

  // Demo: dipinge da sola le celle mancanti.
  useEffect(() => {
    if (!demo || finito || completo || griglia.length === 0) return;
    const t = window.setTimeout(() => {
      for (let y = 0; y < griglia.length; y++) {
        for (let x = 0; x < griglia[y].length; x++) {
          if (griglia[y][x] !== quadro.righe[y][x]) {
            setColore(quadro.righe[y][x] === "." ? colore : quadro.righe[y][x]);
            setGriglia((p) => p.map((r, ry) => (ry === y ? r.map((c, rx) => (rx === x ? quadro.righe[y][x] : c)) : r)));
            return;
          }
        }
      }
    }, 160);
    return () => window.clearTimeout(t);
  }, [demo, finito, completo, griglia, quadro.righe, colore]);

  const ricomincia = useCallback(() => {
    setIndice(0);
    setPunti(0);
    setFinito(false);
    svuota();
  }, [svuota]);

  const lato = quadro.righe[0]?.length ?? 6;

  /** Le istruzioni: righe di celle da colorare, oppure coordinate. */
  const istruzioni = quadro.righe.map((riga, y) => {
    const gruppi: string[] = [];
    Object.entries(quadro.legenda).forEach(([simbolo, nomeColore]) => {
      const celle = riga
        .split("")
        .map((c, x) => (c === simbolo ? x : -1))
        .filter((x) => x >= 0);
      if (celle.length === 0) return;
      const etichette = conCoordinate
        ? celle.map((x) => `${LETTERE[x]}${y + 1}`).join(" ")
        : `${celle.length} ${celle.length === 1 ? "cella" : "celle"}`;
      gruppi.push(`${nomeColore}: ${etichette}`);
    });
    return { riga: y + 1, gruppi };
  });

  return (
    <GameShell
      titolo={titolo}
      istruzione={
        conCoordinate
          ? "Colora le celle indicate dalle coordinate. La lettera è la colonna, il numero è la riga."
          : "Scegli un colore e colora le celle indicate riga per riga."
      }
      round={indice}
      totaleRound={totale}
      finito={finito}
      stelle={stelle(punti, totale)}
      onAncora={ricomincia}
    >
      <div className="flex h-full w-full max-w-md flex-col items-center justify-center gap-3 overflow-y-auto">
        {/* Tavolozza */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(quadro.legenda).map(([simbolo, nomeColore]) => (
            <button
              key={simbolo}
              type="button"
              onClick={() => setColore(simbolo)}
              aria-label={nomeColore}
              aria-pressed={colore === simbolo}
              className={`h-14 w-14 rounded-full border-4 ${colore === simbolo ? "border-notte" : "border-white"}`}
              style={{ backgroundColor: COLORI[nomeColore] }}
            />
          ))}
        </div>

        {/* La griglia */}
        <div className="w-full rounded-morbido bg-white p-2">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${lato}, minmax(0, 1fr))` }}>
            {griglia.map((riga, y) =>
              riga.map((cella, x) => (
                <button
                  key={`${x},${y}`}
                  type="button"
                  onClick={() => dipingi(x, y)}
                  aria-label={`Cella ${LETTERE[x]}${y + 1}`}
                  className="aspect-square rounded-sm border border-crema-scuro"
                  style={{
                    backgroundColor: cella === "." ? "#FFFFFF" : COLORI[quadro.legenda[cella]],
                    minHeight: 0,
                    minWidth: 0,
                  }}
                />
              )),
            )}
          </div>
        </div>

        {/* Il "codice" da seguire */}
        <ol className="w-full rounded-morbido bg-white p-3 text-sm text-notte">
          {istruzioni.map((i) => (
            <li key={i.riga} className="border-b border-crema last:border-0 py-1">
              <strong>Riga {i.riga}:</strong>{" "}
              {i.gruppi.length ? i.gruppi.join(" · ") : "niente da colorare"}
            </li>
          ))}
        </ol>
      </div>
    </GameShell>
  );
}
