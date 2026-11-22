"use client";

import { useMemo } from "react";
import { SceltaMultipla, type Round } from "@/games/_engine/SceltaMultipla";
import { mescola, numero } from "@/games/_engine/casuale";
import { limitePerEta, scelteNumeriche } from "@/games/_engine/numeri";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Problemi con Mizi (6–8 anni).
 * Quattro problemi brevi, ognuno in due passi come sul quaderno: prima si
 * sceglie l'operazione (addizione o sottrazione), poi si fa il calcolo. Il
 * testo del problema resta sempre visibile. I numeri cambiano a ogni partita
 * e crescono con l'età: entro 20 a sei anni, entro 60 a sette, entro 100 dagli otto.
 */

type Operazione = "addizione" | "sottrazione";

interface Modello {
  operazione: Operazione;
  testo: (a: number, b: number) => string;
}

export const MODELLI: Modello[] = [
  { operazione: "addizione", testo: (a, b) => `Leo ha ${a} figurine. La nonna gliene regala ${b}. Quante figurine ha adesso?` },
  { operazione: "addizione", testo: (a, b) => `Sul ramo ci sono ${a} uccellini. Ne arrivano altri ${b}. Quanti uccellini ci sono in tutto?` },
  { operazione: "addizione", testo: (a, b) => `In un cesto ci sono ${a} mele rosse e ${b} mele verdi. Quante mele ci sono in tutto?` },
  { operazione: "addizione", testo: (a, b) => `Sara ha letto ${a} pagine ieri e ${b} pagine oggi. Quante pagine ha letto in tutto?` },
  { operazione: "addizione", testo: (a, b) => `Nel parcheggio ci sono ${a} macchine. Ne entrano altre ${b}. Quante macchine ci sono adesso?` },
  { operazione: "sottrazione", testo: (a, b) => `Sara ha ${a} caramelle. Ne regala ${b} agli amici. Quante caramelle le restano?` },
  { operazione: "sottrazione", testo: (a, b) => `Sull'autobus ci sono ${a} persone. Alla fermata ne scendono ${b}. Quante persone restano sull'autobus?` },
  { operazione: "sottrazione", testo: (a, b) => `Il fornaio ha fatto ${a} panini. Ne ha già venduti ${b}. Quanti panini gli restano?` },
  { operazione: "sottrazione", testo: (a, b) => `Nel vaso ci sono ${a} fiori. ${b} sono appassiti. Quanti fiori sono ancora freschi?` },
  { operazione: "sottrazione", testo: (a, b) => `Leo ha ${a} biglie, Sara ne ha ${b}. Quante biglie ha in più Leo?` },
];

export const FRASI_PROBLEMI = {
  operazione: "Leggi il problema. Quale operazione serve?",
  calcolo: "Adesso fai il calcolo. Quanto fa?",
  aiutoAddizione: "Le cose si mettono insieme o aumentano: serve l'addizione.",
  aiutoSottrazione: "Qualcosa va via, oppure si cerca la differenza: serve la sottrazione.",
  aiutoCalcolo: "Conta con calma: puoi usare le dita o la linea dei numeri.",
  addizione: "Addizione!",
  sottrazione: "Sottrazione!",
} as const;

/** I due numeri del problema: il secondo è piccolo, il risultato resta dentro il limite e sopra zero. */
export function numeriDelProblema(operazione: Operazione, eta: number): [number, number] {
  const limite = limitePerEta(eta);
  const b = numero(2, limite === 20 ? 6 : limite === 60 ? 9 : 20);
  const a = operazione === "addizione" ? numero(limite === 20 ? 3 : 12, limite - b) : numero(b + 2, limite);
  return [a, b];
}

function Testo({ testo, conto }: { testo: string; conto?: string }) {
  return (
    <div className="max-w-md rounded-morbido bg-white p-4 text-center" data-problema>
      <p className="text-xl font-bold leading-relaxed text-notte">{testo}</p>
      {conto && <p className="mt-3 text-4xl font-extrabold text-viola" data-conto>{conto}</p>}
    </div>
  );
}

export default function Game(props: GameProps) {
  const round = useMemo<Round[]>(() => {
    const addizioni = mescola(MODELLI.filter((m) => m.operazione === "addizione")).slice(0, 2);
    const sottrazioni = mescola(MODELLI.filter((m) => m.operazione === "sottrazione")).slice(0, 2);

    return mescola([...addizioni, ...sottrazioni]).flatMap((modello): Round[] => {
      const [a, b] = numeriDelProblema(modello.operazione, props.age);
      const somma = modello.operazione === "addizione";
      const risultato = somma ? a + b : a - b;
      const testo = modello.testo(a, b);

      return [
        {
          istruzione: FRASI_PROBLEMI.operazione,
          opzioni: [
            { id: "addizione", etichetta: "+", descrizione: "addizione" },
            { id: "sottrazione", etichetta: "−", descrizione: "sottrazione" },
          ],
          correttaId: modello.operazione,
          lode: FRASI_PROBLEMI[modello.operazione],
          aiuto: somma ? FRASI_PROBLEMI.aiutoAddizione : FRASI_PROBLEMI.aiutoSottrazione,
          centro: <Testo testo={testo} />,
          colonne: 2,
        },
        {
          istruzione: FRASI_PROBLEMI.calcolo,
          opzioni: scelteNumeriche(risultato, [somma ? a - b : a + b, risultato + 1, risultato - 1, risultato + 10, risultato - 10]),
          correttaId: String(risultato),
          aiuto: FRASI_PROBLEMI.aiutoCalcolo,
          centro: <Testo testo={testo} conto={`${a} ${somma ? "+" : "−"} ${b} =`} />,
          colonne: 3,
        },
      ];
    });
  }, [props.age]);

  return <SceltaMultipla titolo="Problemi con Mizi" round={round} {...props} />;
}
