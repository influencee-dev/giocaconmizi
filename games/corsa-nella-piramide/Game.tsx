"use client";

import { Corsa } from "@/games/_engine/Corsa";
import type { SpecTratto } from "@/games/_engine/corsa-logica";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * La corsa nella piramide (6–10 anni).
 * Mizi sale i cinque piani di una piramide correndo in un corridoio a tre
 * strade: si scorre col dito per cambiare strada e si tocca per saltare.
 *
 * Ogni piano porta una cosa nuova sola (casse, blocchi, fossi), poi le mette
 * insieme. Non ci sono vite né tempo: un urto fa ripartire piano, e al terzo
 * urto dello stesso piano la strada libera si illumina.
 *
 * Tutto quello che Mizi dice sta nel copione della voce, content/voce-mizi.json
 * sotto «corsa-nella-piramide».
 */
const PIANI: SpecTratto[] = [
  {
    istruzione: "Scorri col dito per cambiare strada. Prendi le gemme e rompi le casse!",
    fatto: "Primo piano fatto!",
    schemi: ["casse"],
  },
  {
    istruzione: "Arrivano i blocchi di pietra. Cambia strada per passare.",
    fatto: "Secondo piano fatto!",
    schemi: ["blocco"],
  },
  {
    istruzione: "Ora c'è un fosso. Tocca lo schermo per saltare.",
    fatto: "Terzo piano fatto!",
    schemi: ["fosso"],
  },
  {
    istruzione: "Blocchi e fossi insieme. Guarda bene la strada.",
    fatto: "Quarto piano fatto!",
    schemi: ["due-blocchi", "fosso"],
  },
  {
    istruzione: "Ultimo piano! Prendi la stella: ti protegge.",
    fatto: "Sei in cima alla piramide!",
    schemi: ["blocco", "due-blocchi", "fosso"],
    stella: true,
  },
];

export default function Game(props: GameProps) {
  return <Corsa titolo="La corsa nella piramide" tratti={PIANI} {...props} />;
}
