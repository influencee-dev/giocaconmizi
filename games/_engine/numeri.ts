import { mescola } from "./casuale";

/**
 * Le risposte dei giochi coi numeri: quella giusta più due sbagliate, scelte
 * fra gli errori tipici passati dal gioco (uno in più, la decina sbagliata, le
 * cifre scambiate…). Mai due uguali, mai sotto zero; se gli errori tipici non
 * bastano si prendono i numeri vicini.
 */
export function scelteNumeriche(giusto: number, erroriTipici: number[], quante = 3) {
  const sbagliati: number[] = [];
  for (const n of [...mescola(erroriTipici), giusto + 2, giusto - 2, giusto + 3, giusto + 4]) {
    if (sbagliati.length === quante - 1) break;
    if (n >= 0 && n !== giusto && !sbagliati.includes(n)) sbagliati.push(n);
  }
  return mescola([giusto, ...sbagliati]).map((n) => ({ id: String(n), etichetta: String(n), descrizione: `Numero ${n}` }));
}

/** Fin dove arrivano i numeri: 20 a sei anni, 60 a sette (seconda elementare a novembre), 100 dagli otto. */
export function limitePerEta(eta: number): 20 | 60 | 100 {
  return eta <= 6 ? 20 : eta === 7 ? 60 : 100;
}
