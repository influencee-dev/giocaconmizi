/**
 * Prenota una foto per un giorno: finisce nel «Prompt del giorno» della sera
 * prima e ChatGPT la genera la mattina (lib/foto-in-arrivo.ts, docs/foto-sera.md).
 *
 *   npm run foto:prenota -- --file guida-minecraft-vs-roblox --per 2026-11-09 \
 *     --titolo "Foto dell'articolo «Minecraft vs Roblox»" --scena "…" --alt "…" \
 *     [--rapporto 16:9] [--chi "routine articoli"]
 *
 * Rieseguirla con lo stesso --file aggiorna la prenotazione (niente doppioni).
 * Senza argomenti mostra le prenotazioni ancora da arrivare.
 */
import { LARGHEZZE, LARGHEZZE_GUIDA } from "../lib/foto";
import { fotoArrivata, leggiCoda, scriviCoda, type Prenotazione } from "../lib/foto-in-arrivo";

const arg = (nome: string) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const oggi = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
const coda = leggiCoda();
const larghezzeDi = (f: string) => (f.startsWith("guida-") ? LARGHEZZE_GUIDA : LARGHEZZE);

const file = arg("file");
if (!file) {
  const aperte = coda.prenotazioni.filter((p) => !fotoArrivata(p.nomeFile, larghezzeDi(p.nomeFile)));
  console.log(aperte.length ? "Foto prenotate e non ancora arrivate:" : "Nessuna foto prenotata in attesa.");
  for (const p of aperte) console.log(`  ${p.perIl} · ${p.nomeFile} · ${p.chi}`);
  process.exit(0);
}

const errori: string[] = [];
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(file)) errori.push("--file: solo minuscole, numeri e trattini, senza estensione");
const perIl = arg("per") ?? "";
if (!/^\d{4}-\d{2}-\d{2}$/.test(perIl)) errori.push("--per: data AAAA-MM-GG");
const scena = arg("scena") ?? "";
const alt = arg("alt") ?? "";
if (scena.length < 40) errori.push("--scena: descrivi la scena per intero (almeno una frase vera)");
if (!alt) errori.push("--alt: serve il testo alternativo");
const [l, a] = (arg("rapporto") ?? "16:9").split(":").map(Number);
if (!(l > 0 && a > 0)) errori.push("--rapporto: tipo 16:9, 4:3, 1:1");
if (errori.length) {
  for (const e of errori) console.error(`ERRORE ${e}`);
  process.exit(1);
}

const voce: Prenotazione = {
  nomeFile: file,
  perIl,
  titolo: arg("titolo") ?? `Foto ${file}`,
  scena,
  alt,
  rapporto: l / a,
  chi: arg("chi") ?? "non indicato",
  prenotataIl: oggi,
};
const i = coda.prenotazioni.findIndex((p) => p.nomeFile === file);
if (i >= 0) coda.prenotazioni[i] = voce;
else coda.prenotazioni.push(voce);
coda.prenotazioni.sort((x, y) => x.perIl.localeCompare(y.perIl) || x.nomeFile.localeCompare(y.nomeFile));
scriviCoda(coda);
console.log(`${i >= 0 ? "Aggiornata" : "Prenotata"}: ${file} per il ${perIl}${perIl <= oggi ? " (ATTENZIONE: è oggi o già passato, il prompt della sera è già uscito)" : ""}`);
