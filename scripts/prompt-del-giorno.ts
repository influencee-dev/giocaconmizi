/**
 * «Prompt del giorno» (cartella Drive «Giocamizi · Prompt immagini / 02 Prompt
 * del giorno»): le foto da generare per un giorno, ognuna con un prompt intero.
 * Prima TUTTE le foto prenotate per quel giorno (content/foto-in-arrivo.json,
 * es. la foto dell'articolo che esce quel giorno), poi fino a --quante foto
 * che mancano al sito (guide, poi riquadri del sito).
 * Giro (docs/foto-sera.md): alle 21:00 la routine «Prompt della sera» lo genera
 * con --data <domani> e lo carica su Drive; alle 6:00 la routine ChatGPT di
 * Giorgia genera le foto in «99 Immagini pronte»; dalle 9:00 chi lavora le
 * importa con `npm run foto-arrivate`.
 *
 *   npm run prompt-del-giorno -- [--quante 3] [--data 2026-11-09]
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { GUIDE } from "../lib/guide";
import { FOTO, LARGHEZZE, LARGHEZZE_GUIDA, fotoSito, type CodiceFoto } from "../lib/foto";
import { BLOCCO_FOTO, BLOCCO_MIZI, REGOLE_PERSONE } from "./blocchi-prompt";
import { fotoArrivata, leggiCoda } from "../lib/foto-in-arrivo";

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

// Le prenotazioni per quel giorno (o rimaste indietro e non ancora arrivate).
const prenotate: Foto[] = leggiCoda()
  .prenotazioni.filter(
    (p) => p.perIl <= data && !fotoArrivata(p.nomeFile, p.nomeFile.startsWith("guida-") ? LARGHEZZE_GUIDA : LARGHEZZE),
  )
  .map((p) => ({ nomeFile: p.nomeFile, titolo: p.titolo, scena: p.scena, formato: formato(p.rapporto) }));
const giaPrenotate = new Set(prenotate.map((p) => p.nomeFile));

const coda: Foto[] = [
  ...GUIDE.filter((g) => !guidaFatta(g.slug) && !giaPrenotate.has(`guida-${g.slug}`)).map((g) => ({
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
const oggi = [...prenotate, ...coda.slice(0, quante)];

const righe: string[] = [
  `# Prompt del giorno · ${data.split("-").reverse().join("/")}`,
  "",
  oggi.length
    ? `Oggi ${oggi.length === 1 ? "c'è 1 foto" : `ci sono ${oggi.length} foto`} da fare (${prenotate.length} prenotate per i contenuti di oggi, poi ${oggi.length - prenotate.length} delle ${coda.length} che mancano al sito). Le prenotate sono le più importanti: falle per prime. Per ognuna: una conversazione nuova, la foto di riferimento di Mizi (cartella «01 Mizi pupazzo (riferimento)»), il prompt intero, poi il PNG nella cartella «99 Immagini pronte» con il nome indicato. Dalle 9:00 Claude le importa da sola.`
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
    `CONSEGNA: salva la foto come PNG chiamato esattamente ${f.nomeFile}.png nella cartella Google Drive «Giocamizi · Prompt immagini / 99 Immagini pronte». Se non riesci a salvarla da solo, mostrala e indica il nome ${f.nomeFile}.png, così la carica Giorgia.`,
    "",
    "CONTROLLO: Mizi ha il caschetto castano, la bandana rosa a pois, il cuore sulla pancia, becco e zampe arancioni ed è chiaramente un pupazzo di stoffa. Nessuna scritta né numero leggibile. Mani e dita corrette.",
    "",
  );
});

console.log(righe.join("\n"));
