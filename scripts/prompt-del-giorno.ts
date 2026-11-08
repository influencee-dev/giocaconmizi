/**
 * «01 PROMPT DEL GIORNO» (cartella Drive «Giocamizi · Prompt immagini»): le
 * prossime foto che mancano al sito, ognuna con un prompt intero da incollare
 * in ChatGPT così com'è. Prima le foto delle guide, poi i riquadri del sito.
 * La Routine del mattino lo rigenera e lo carica su Drive; la sera Giorgia
 * fa generare le foto e le carica in «99 Immagini pronte»; il mattino dopo
 * `npm run foto-arrivate` le trasforma in WebP per il sito.
 *
 *   npm run prompt-del-giorno -- [--quante 3] [--data 2026-11-08]
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { GUIDE } from "../lib/guide";
import { FOTO, LARGHEZZE_GUIDA, fotoSito, type CodiceFoto } from "../lib/foto";
import { BLOCCO_FOTO, BLOCCO_MIZI, REGOLE_PERSONE } from "./blocchi-prompt";

const arg = (nome: string) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const quante = Math.max(1, Number(arg("quante") ?? 3));
const data = arg("data") ?? new Date().toISOString().slice(0, 10);

interface Foto {
  nomeFile: string;
  titolo: string;
  scena: string;
  formato: string;
}

const FORMATI: [number, string][] = [
  [16 / 9, "16:9 orizzontale: genera a 1536×1024 e ritaglia a 16:9 centrando i soggetti"],
  [2, "2:1 orizzontale: genera a 1536×1024 e ritaglia a 2:1 centrando i soggetti"],
  [3 / 2, "3:2 orizzontale: genera a 1536×1024"],
  [4 / 3, "4:3 orizzontale: genera a 1536×1024 e ritaglia a 4:3 centrando i soggetti"],
  [3 / 4, "3:4 verticale: genera a 1024×1536 e ritaglia a 3:4 centrando i soggetti"],
  [1, "quadrato 1:1: genera a 1024×1024"],
];
const formato = (r: number) => FORMATI.find(([x]) => Math.abs(x - r) < 0.01)?.[1] ?? FORMATI[0][1];

const guidaFatta = (slug: string) =>
  LARGHEZZE_GUIDA.some((l) => existsSync(join(process.cwd(), "public", "immagini", `guida-${slug}-${l}.webp`)));

const coda: Foto[] = [
  ...GUIDE.filter((g) => !guidaFatta(g.slug)).map((g) => ({
    nomeFile: `guida-${g.slug}`,
    titolo: `Foto della guida «${g.titolo}»`,
    scena: g.foto.scena,
    formato: formato(16 / 9),
  })),
  ...(Object.keys(FOTO) as CodiceFoto[])
    .filter((c) => !fotoSito(c))
    .map((c) => ({
      nomeFile: FOTO[c].file,
      titolo: `Foto del sito ${c}`,
      scena: `${FOTO[c].alt}.`,
      formato: formato(FOTO[c].rapporto),
    })),
];
const oggi = coda.slice(0, quante);

const righe: string[] = [
  `# Prompt del giorno · ${data.split("-").reverse().join("/")}`,
  "",
  oggi.length
    ? `Oggi ${oggi.length === 1 ? "c'è 1 foto" : `ci sono ${oggi.length} foto`} da fare (ne mancano ${coda.length} in tutto). Per ognuna: apri una chat nuova di ChatGPT, allega la foto di riferimento di Mizi (cartella «01 Mizi pupazzo (riferimento)»), incolla il prompt intero, scarica il PNG e caricalo nella cartella «99 Immagini pronte» con il nome indicato. Al resto pensa Claude il mattino dopo.`
    : "Oggi non manca nessuna foto: il sito le ha tutte.",
  "",
];

oggi.forEach((f, i) => {
  righe.push(
    "-----",
    "",
    `## ${i + 1}. ${f.titolo}`,
    "",
    `Nome del file da caricare: ${f.nomeFile}.png`,
    "",
    "### Prompt da incollare",
    "",
    "Sei il fotografo di Giocamizi, un sito gratuito di giochi educativi per bambini. Crea una sola fotografia realistica con questa scena. Usa l'immagine allegata come riferimento esatto per Mizi.",
    "",
    `MIZI: ${BLOCCO_MIZI}`,
    "",
    `STILE: ${BLOCCO_FOTO}`,
    "",
    `PERSONE: ${REGOLE_PERSONE.join(" ")}`,
    "",
    `SCENA: ${f.scena}`,
    "",
    `FORMATO: ${f.formato}. Lascia un po' d'aria sopra le teste.`,
    "",
    `CONSEGNA: mostrami la foto. Se la approvo, salvala come PNG chiamato esattamente ${f.nomeFile}.png e dammi il link per scaricarla.`,
    "",
    "CONTROLLO: Mizi ha il caschetto castano, la bandana rosa a pois, il cuore sulla pancia, becco e zampe arancioni ed è chiaramente un pupazzo di stoffa. Nessuna scritta né numero leggibile. Mani e dita corrette.",
    "",
  );
});

console.log(righe.join("\n"));
