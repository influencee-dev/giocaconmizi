/**
 * Genera i PDF delle storie e delle schede stampabili e li carica su Supabase
 * Storage (piano §4.1: Storage per PDF e audio).
 *
 *   npm run export-pdf
 *
 * Il download dei PDF è riservato a chi è registrato (§7, prompt "Storie"):
 * i file vanno in un bucket privato e si servono con URL firmati.
 *
 * TODO giorno 2: rendering vero. La scelta è fra Playwright (stampa la pagina
 * /storie/[slug] così com'è, con il carattere selezionato) e una libreria PDF
 * lato server. Playwright è già disponibile in CI e riusa l'impaginazione web,
 * quindi è il candidato principale.
 */

import { tutteLeStorie } from "../lib/content";

async function main() {
  const storie = tutteLeStorie();

  if (storie.length === 0) {
    console.log("Nessuna storia da esportare: content/stories/ è ancora vuota.");
    return;
  }

  for (const storia of storie) {
    // Tre caratteri = tre PDF per storia (stampatello, minuscolo, corsivo).
    console.log(
      `Da generare: ${storia.slug} (${storia.age} anni) → stampatello, minuscolo, corsivo`,
    );
  }

  console.log(
    `\n${storie.length} storie × 3 caratteri = ${storie.length * 3} PDF da produrre.`,
  );
}

main().catch((errore) => {
  console.error(errore);
  process.exit(1);
});
