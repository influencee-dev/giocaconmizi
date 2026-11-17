/**
 * L'identificativo di una frase registrata: lo stesso conto lo fanno il sito
 * (per sapere quale file suonare) e lo script che registra (per dare il nome
 * al file). Niente tabella testo → file da tenere allineata: il nome del file
 * È la frase. Cambia il testo di una virgola e diventa un'altra registrazione.
 *
 * cyrb53: 53 bit, veloce e sincrono (crypto.subtle è asincrono e nei giochi
 * la voce deve partire nello stesso tocco).
 */
export function idFrase(testo: string, lingua: string): string {
  const s = `${lingua}|${testo.trim().replace(/\s+/g, " ")}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
