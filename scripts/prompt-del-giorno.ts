/**
 * «Prompt del giorno» (cartella Drive «Giocamizi · Prompt immagini / 02 Prompt
 * del giorno»): la RISERVA manuale delle foto di un giorno. Dall'11/11/2026 le
 * foto le genera la routine serale con l'API di OpenAI (scripts/foto-genera.ts);
 * questo documento resta su Drive per rifarle a mano in ChatGPT se l'API non
 * risponde o una foto non piace. Stesse foto e stessi prompt: lib/foto-del-giorno.ts.
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
    ? `${oggi.length === 1 ? "C'è 1 foto" : `Ci sono ${oggi.length} foto`} per questo giorno (${prenotate.length} prenotate per i contenuti, poi ${oggi.length - prenotate.length} delle ${mancanti.length} che mancano al sito). Di solito le genera già la routine serale di Claude: questo documento serve per rifarle a mano se una non è arrivata o non piace. Per ognuna: una conversazione nuova in ChatGPT, l'immagine di Mizi come riferimento, il prompt intero, poi il PNG nella cartella «99 Immagini pronte» con il nome indicato. Claude le importa da sola il mattino dopo.`
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
