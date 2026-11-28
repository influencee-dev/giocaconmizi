/**
 * Scrive l'HTML delle tre email della serie di benvenuto, pronte da caricare
 * in Brevo come modelli dell'automazione (lib/email/serie-benvenuto.ts).
 *
 *   npx tsx scripts/email-serie.ts <cartella>
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SERIE_BENVENUTO } from "../lib/email/serie-benvenuto";

const cartella = process.argv[2];
if (!cartella) {
  console.error("Uso: npx tsx scripts/email-serie.ts <cartella>");
  process.exit(1);
}
mkdirSync(cartella, { recursive: true });
for (const e of SERIE_BENVENUTO) {
  // L'email 1 la manda il sito (params), le altre due l'automazione (contatto).
  const file = join(cartella, `benvenuto-${e.numero}.html`);
  writeFileSync(file, e.html(e.numero === 1 ? "params" : "contatto"));
  console.log(`${file} · «${e.oggetto}»`);
}
