/**
 * Le domande di «Tabelline con Mizi» (21/11/2026): logica pura, senza React.
 * La usano lo schermo e le prove.
 *
 * Prima le domande uscivano a caso: in otto domande sulla tabellina del 7
 * potevano uscire tre volte «7 × 10» e mai «7 × 8». Ora:
 * - una tabellina = dieci domande, ogni «per» una volta sola, dalle più facili
 *   (per 1, 2, 5, 10) alle più difficili (per 6, 7, 8);
 * - «tutte insieme» = dieci domande diverse, adatte all'età, dalla più piccola
 *   alla più grande, senza la stessa coppia girata (3 × 7 e 7 × 3);
 * - sempre quattro risposte diverse, e quelle sbagliate sono gli errori veri
 *   (un «per» in più o in meno, la tabellina accanto);
 * - dopo un errore Mizi dice un trucco per arrivarci, non la risposta.
 */

export interface Domanda {
  tabellina: number;
  fattore: number;
  risultato: number;
  /** Quattro numeri diversi, risultato compreso, già mescolati. */
  opzioni: number[];
  /** Il trucco che Mizi dice e mostra dopo un errore. */
  trucco: string;
}

export const TABELLINE = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const DOMANDE_PER_PARTITA = 10;

type Mescola = <T>(elenco: readonly T[]) => T[];

/** I «per» dal più facile al più difficile: dentro ogni gruppo l'ordine cambia a ogni partita. */
const GRUPPI = [
  [1, 2, 10, 5],
  [3, 4, 9],
  [6, 7, 8],
];

/** Come arrivare al risultato partendo da una moltiplicazione più facile. */
export function truccoDi(tabellina: number, fattore: number): string {
  const t = tabellina;
  if (fattore === 1) return `Una volta sola: resta ${t}.`;
  if (t === 10) return `Per dieci: scrivi ${fattore} e metti uno zero.`;
  switch (fattore) {
    case 2:
      return `Fai ${t} più ${t}.`;
    case 3:
      return `${t} per 2 fa ${t * 2}. Aggiungi un ${t}.`;
    case 4:
      return `${t} per 2 fa ${t * 2}. Fai il doppio.`;
    case 5:
      return `${t} per 10 fa ${t * 10}. Fai la metà.`;
    case 6:
      return `${t} per 5 fa ${t * 5}. Aggiungi un ${t}.`;
    case 7:
      return `${t} per 5 fa ${t * 5}, ${t} per 2 fa ${t * 2}. Sommali.`;
    case 8:
      return `${t} per 4 fa ${t * 4}. Fai il doppio.`;
    case 9:
      return `${t} per 10 fa ${t * 10}. Togli un ${t}.`;
    default:
      return `Per dieci: scrivi ${t} e metti uno zero.`;
  }
}

/** Il risultato e tre errori veri: quattro numeri diversi, tutti sopra lo zero. */
export function opzioniDi(tabellina: number, fattore: number, mescola: Mescola): number[] {
  const risultato = tabellina * fattore;
  const buono = (n: number) => n > 0 && n !== risultato;
  // Gli errori più comuni: aver contato una volta in più o in meno.
  const vicini = [tabellina * (fattore + 1), tabellina * (fattore - 1)].filter(buono);
  // Poi la tabellina accanto e la decina sbagliata.
  const altri = mescola([(tabellina + 1) * fattore, (tabellina - 1) * fattore, risultato + 10, risultato - 10].filter(buono));
  const sbagliate = [...new Set([...vicini, ...altri])].slice(0, 3);
  // Non dovrebbe servire mai: è la rete di sicurezza per avere sempre quattro risposte.
  for (let n = risultato + 1; sbagliate.length < 3; n++) if (!sbagliate.includes(n)) sbagliate.push(n);
  return mescola([risultato, ...sbagliate]);
}

const domanda = (tabellina: number, fattore: number, mescola: Mescola): Domanda => ({
  tabellina,
  fattore,
  risultato: tabellina * fattore,
  opzioni: opzioniDi(tabellina, fattore, mescola),
  trucco: truccoDi(tabellina, fattore),
});

/** Una tabellina intera: i dieci «per», ognuno una volta, dai facili ai difficili. */
export function domandeDi(tabellina: number, mescola: Mescola): Domanda[] {
  return GRUPPI.flatMap((gruppo) => mescola(gruppo)).map((fattore) => domanda(tabellina, fattore, mescola));
}

/**
 * Tutte insieme, a misura d'età: a 7 anni le tabelline che si fanno per prime
 * (2, 3, 4, 5, 10), a 8 tutte, da 9 il nocciolo duro (dal 3 al 9 per 3-9).
 */
export function domandeMiste(eta: number, mescola: Mescola): Domanda[] {
  const tabelline = eta <= 7 ? [2, 3, 4, 5, 10] : eta === 8 ? TABELLINE : [3, 4, 5, 6, 7, 8, 9];
  const fattori = eta >= 9 ? [3, 4, 5, 6, 7, 8, 9] : [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const viste = new Set<string>();
  const scelte: Domanda[] = [];
  for (const [t, f] of mescola(tabelline.flatMap((t) => fattori.map((f) => [t, f] as const)))) {
    // 3 × 7 e 7 × 3 sono la stessa cosa da ricordare: ne entra una sola.
    const chiave = `${Math.min(t, f)}x${Math.max(t, f)}`;
    if (viste.has(chiave)) continue;
    viste.add(chiave);
    scelte.push(domanda(t, f, mescola));
    if (scelte.length === DOMANDE_PER_PARTITA) break;
  }
  return scelte.sort((a, b) => a.risultato - b.risultato);
}
