/**
 * Il documento per ChatGPT con le foto delle guide («00 PROMPT GUIDE» nella
 * cartella Drive «Giocamizi · Prompt immagini»). Si rigenera da lib/guide.ts:
 * `npm run prompt-guide` scrive il testo su stdout, da incollare (o caricare)
 * nel documento Drive ogni volta che arriva una guida nuova.
 * Blocchi MIZI e FOTO identici a «00 PROMPT UNICO»: le foto devono sembrare
 * della stessa serie.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { GUIDE } from "../lib/guide";
import { LARGHEZZE_GUIDA } from "../lib/foto";
import { BLOCCO_FOTO, BLOCCO_MIZI } from "./blocchi-prompt";

const consegnata = (slug: string) =>
  LARGHEZZE_GUIDA.some((l) => existsSync(join(process.cwd(), "public", "immagini", `guida-${slug}-${l}.webp`)));

const righe: string[] = [];
const scrivi = (...r: string[]) => righe.push(...r);

scrivi(
  "# Giocamizi · Prompt per le foto delle guide (articoli)",
  "",
  "Questo documento serve solo per le foto in testa alle guide per i genitori (giocamizi.it/guide). Per tutte le altre foto del sito vale «00 PROMPT UNICO». Il documento si aggiorna da solo: ogni guida nuova aggiunge qui la sua scheda.",
  "",
  "## Il tuo ruolo",
  "",
  "Sei il fotografo e l'art director di Giocamizi, un sito gratuito di giochi educativi, storie e feste per bambini dai 3 ai 12 anni. Per ogni guida crei una foto realistica, della stessa serie delle altre foto del sito, con Mizi che compare come pupazzo di stoffa. La consegni pronta per il web con il nome file esatto della scheda: il sito la riconosce dal nome e la mostra da sola in cima alla guida.",
  "",
  "## Prima di cominciare",
  "",
  "- Allega sempre l'immagine di riferimento di Mizi (cartella «01 Mizi pupazzo (riferimento)») e, se c'è, la scheda M-01 approvata.",
  "- Fai una foto alla volta, mostrala a Giorgia e aspetta l'ok prima di passare alla successiva.",
  "- Comincia dalle schede segnate «DA FARE», nell'ordine.",
  "",
  "## Blocco MIZI (sempre all'inizio di ogni prompt)",
  "",
  BLOCCO_MIZI,
  "",
  "## Blocco FOTO (sempre dopo il Blocco MIZI)",
  "",
  BLOCCO_FOTO,
  "",
  "## Regole su bambini e persone",
  "",
  "- Bambini e adulti sono generati e non devono somigliare a persone reali. Mai foto di persone vere come riferimento. Giorgia e Domiziana non vanno mai generate.",
  "- Solo situazioni serene e sicure, abbigliamento completo e adatto all'età. Con i bambini piccoli c'è sempre un adulto vicino.",
  "- Famiglie varie, come nell'Italia di oggi: mamme, papà, nonni, fratelli, origini diverse.",
  "- Le foto sono illustrative: il sito mostra il segno «AI». Non presentarle mai come foto vere.",
  "",
  "## Formato, nomi file e ottimizzazione",
  "",
  "- Formato 16:9 orizzontale: genera a 1536×1024 e ritaglia a 16:9 centrando i soggetti; lascia un po' d'aria sopra le teste.",
  "- Con Python e Pillow crea tre larghezze: 1440, 960 e 640 px. Non ingrandire mai oltre l'originale.",
  "- WebP qualità 78, method 6, profilo sRGB, niente metadati EXIF o XMP. Peso massimo: 180 KB a 1440 px, 110 KB a 960 px, 70 KB a 640 px; se pesa di più abbassa la qualità di 4 punti alla volta fino a 62.",
  "- NOME FILE: esattamente il «Nome file» della scheda, un trattino, la larghezza e .webp. Esempio: guida-paghetta-ai-bambini-1440.webp. Non cambiare nemmeno una lettera.",
  "",
  "## Consegna",
  "",
  "- Uno ZIP chiamato giocamizi-guide-CODICI.zip (per esempio giocamizi-guide-GU01-GU04.zip) con i file .webp e un manifest.md (codice, nome file, larghezza × altezza, peso in KB, alt).",
  "- Alla fine scrivi a Giorgia: «Carica lo ZIP nella cartella 99 Immagini pronte su Drive e avvisa Claude.»",
  "",
  "## Controllo prima di consegnare",
  "",
  "Mizi ha il caschetto castano, la bandana rosa a pois, il cuore sulla pancia, becco e zampe arancioni ed è chiaramente un pupazzo di stoffa. Nessuna scritta né numero leggibile. Mani e dita corrette. Nome file identico alla scheda.",
  "",
  "-----",
  "",
  "# Le schede",
  "",
);

GUIDE.forEach((g, i) => {
  const codice = `GU-${String(i + 1).padStart(2, "0")}`;
  scrivi(
    `## ${codice} · ${g.titoloBreve} ${consegnata(g.slug) ? "(FATTA)" : "(DA FARE)"}`,
    "",
    `- Guida: «${g.titolo}» (giocamizi.it/guide/${g.slug}), per bambini ${g.etaMin}-${g.etaMax} anni.`,
    "- Formato: 16:9. Larghezze 1440, 960 e 640.",
    `- Nome file: guida-${g.slug}`,
    `- Scena: ${g.foto.scena}`,
    `- Alt: ${g.foto.alt}`,
    "",
  );
});

console.log(righe.join("\n"));
