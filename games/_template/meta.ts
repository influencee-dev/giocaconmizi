import type { GameMeta } from "@/games/registry";

/**
 * Scheda tecnica del gioco. Va tenuta allineata alla riga corrispondente in
 * games/registry.ts: il registry è l'elenco, questo file è il dettaglio.
 */
export const meta: GameMeta = {
  slug: "_template",
  title: "Template",
  ageMin: 3,
  ageMax: 12,
  skill: "logica",
  subskill: "descrivi qui la singola competenza",
  difficulty: 1,
  minutes: 4,
  mechanic: "Una riga che spiega la meccanica a chi costruirà il gioco.",
  status: "planned",
};

/** Numero di round: la checklist di design chiede da 5 a 8, difficoltà crescente. */
export const TOTALE_ROUND = 6;
