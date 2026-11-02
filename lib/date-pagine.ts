import DATE from "./date-pagine.json";

/**
 * Il giorno dell'ultima modifica vera di una pagina, per il lastmod della
 * sitemap. Le chiavi sono percorsi del repo (content/games/x.md,
 * games/<slug>, app/(public)/.../page.tsx) e il file lo scrive
 * scripts/date-pagine.mjs dalla storia git.
 *
 * Restituisce la data più recente fra quelle passate (stringhe "AAAA-MM-GG"
 * o percorsi), oppure undefined: meglio nessun lastmod che uno falso.
 */
const tabella: Record<string, string> = DATE;

export function dataDi(...voci: (string | undefined)[]): Date | undefined {
  let massima: string | undefined;
  for (const voce of voci) {
    if (!voce) continue;
    const giorno = /^\d{4}-\d{2}-\d{2}$/.test(voce) ? voce : tabella[voce];
    if (giorno && (!massima || giorno > massima)) massima = giorno;
  }
  return massima ? new Date(`${massima}T00:00:00.000Z`) : undefined;
}

/** La pagina di un gioco: il codice e la scheda markdown. */
export const dataGioco = (slug: string) => dataDi(`games/${slug}`, `content/games/${slug}.md`);
