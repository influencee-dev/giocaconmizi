/**
 * «Prompt del giorno» (cartella Drive «Giocamizi · Prompt immagini / 02 Prompt
 * del giorno»): le foto che servono in un giorno. Dal 12/11/2026 lo carica la
 * routine articoli delle 9:00 per il giorno DOPO e l'attività programmata di
 * ChatGPT delle 9:30 genera le foto in «99 Immagini pronte» (docs/bacheca.md);
 * la sera Claude le importa. Stesse foto e stessi prompt: lib/foto-del-giorno.ts.
 *
 *   npm run prompt-del-giorno -- [--quante 2] [--data 2026-11-12]
 */
import { fotoDelGiorno, promptFoto, titoloNeutro } from "../lib/foto-del-giorno";
import { nomeConsegna } from "../lib/foto-in-arrivo";

const arg = (nome: string) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const quante = Math.max(0, Number(arg("quante") ?? 2));
const data = arg("data") ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
const { prenotate, mancanti, oggi } = fotoDelGiorno(data, quante);

const righe: string[] = [
  `# Prompt del giorno · ${data.split("-").reverse().join("/")}`,
  "",
  oggi.length
    ? `${oggi.length === 1 ? "C'è 1 foto" : `Ci sono ${oggi.length} foto`} per questo giorno (${prenotate.length} prenotate per i contenuti, poi ${oggi.length - prenotate.length} delle ${mancanti.length} che mancano al sito). Le genera l'attività programmata di ChatGPT delle 9:30 del giorno prima; se una manca o non piace si rifà a mano. Per ognuna: una conversazione nuova in ChatGPT, l'immagine di Mizi come riferimento (3 Risorse / Mizi e brand), il prompt intero, poi il PNG nella cartella «99 Immagini pronte» con il nome indicato. Claude la importa la sera alle 21:00.`
    : "Per questo giorno non manca nessuna foto: il sito le ha tutte.",
  "",
];

// Niente titoli né nomi di file con marchi o nomi di giochi: il generatore li
// rifiuta (11/11/2026). Nome neutro; foto-arrivate lo riconduce al nome vero.
oggi.forEach((f, i) => {
  const file = nomeConsegna(f.nomeFile);
  righe.push(
    "-----",
    "",
    `## ${i + 1}. ${titoloNeutro(f)}`,
    "",
    `Nome del file da caricare: ${file}.png`,
    "",
    "### Prompt da incollare",
    "",
    promptFoto(f),
    "",
    `CONSEGNA: salva la foto come PNG chiamato esattamente ${file}.png nella cartella Google Drive «Giocamizi · Prompt immagini / 99 Immagini pronte». Se non riesci a salvarla da solo, mostrala e indica il nome ${file}.png, così la carica Giorgia.`,
    "",
  );
});

console.log(righe.join("\n"));
