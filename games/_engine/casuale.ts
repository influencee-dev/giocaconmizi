/**
 * Mescolamento. Gira solo nel browser (i giochi sono client component), quindi
 * Math.random non tocca il rendering sul server e non crea mismatch di idratazione.
 */

export function mescola<T>(elenco: readonly T[]): T[] {
  const copia = [...elenco];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Un elemento a caso. */
export function uno<T>(elenco: readonly T[]): T {
  return elenco[Math.floor(Math.random() * elenco.length)];
}

/** `quanti` elementi distinti, escludendo quelli in `senza`. */
export function alcuni<T>(elenco: readonly T[], quanti: number, senza: readonly T[] = []): T[] {
  return mescola(elenco.filter((e) => !senza.includes(e))).slice(0, quanti);
}

/** Numero intero fra min e max inclusi. */
export function numero(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}
