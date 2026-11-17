import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Il nome NEUTRO con cui ChatGPT salva una foto (es. foto-3fa91c2e): niente
 * slug con marchi o nomi di giochi (Minecraft, Roblox…), che il generatore di
 * immagini tende a rifiutare. È deterministico: foto-arrivate lo riconduce
 * al nome vero ricalcolandolo su tutti i nomi possibili.
 */
export function nomeConsegna(nomeFile: string): string {
  return `foto-${createHash("sha1").update(nomeFile).digest("hex").slice(0, 8)}`;
}

/**
 * La coda unica delle foto da far generare a ChatGPT (content/foto-in-arrivo.json).
 *
 * Regola: chi prepara un contenuto (routine articoli, routine delle 7:00,
 * qualsiasi chat) PRENOTA qui le foto che gli serviranno almeno un giorno
 * prima (`npm run foto:prenota`). Alle 21:00 la routine «Prompt della sera»
 * mette nel documento del giorno dopo tutte le prenotazioni di quel giorno
 * (`npm run prompt-del-giorno -- --data <domani>`), alle 6:00 la routine
 * ChatGPT di Giorgia le genera in Drive «99 Immagini pronte», e chi lavora
 * dopo le importa con `npm run foto-arrivate` (che riconosce anche le foto
 * prenotate di pagine non ancora pubblicate). Procedura: docs/foto-sera.md.
 */

export interface Prenotazione {
  /** Nome del file senza estensione: guida-<slug> per gli articoli, altrimenti libero (minuscolo, trattini). */
  nomeFile: string;
  /** Giorno (AAAA-MM-GG) in cui la foto serve: va nel documento della sera prima. */
  perIl: string;
  titolo: string;
  /** La scena del prompt: niente personaggi protetti, loghi, schermate di terzi, persone reali. */
  scena: string;
  alt: string;
  /** Larghezza/altezza: 16/9 per le guide. */
  rapporto: number;
  /** Chi l'ha prenotata (routine articoli, routine 7:00, chat …). */
  chi: string;
  prenotataIl: string;
}

export interface CodaFoto {
  descrizione: string;
  prenotazioni: Prenotazione[];
}

export const FILE_CODA = path.join(process.cwd(), "content", "foto-in-arrivo.json");

export function leggiCoda(): CodaFoto {
  if (!fs.existsSync(FILE_CODA)) return { descrizione: "", prenotazioni: [] };
  return JSON.parse(fs.readFileSync(FILE_CODA, "utf8")) as CodaFoto;
}

export function scriviCoda(coda: CodaFoto) {
  fs.writeFileSync(FILE_CODA, `${JSON.stringify(coda, null, 2)}\n`);
}

/** Una foto è arrivata quando almeno una sua variante WebP è in public/immagini. */
export function fotoArrivata(nomeFile: string, larghezze: readonly number[]) {
  return larghezze.some((l) => fs.existsSync(path.join(process.cwd(), "public", "immagini", `${nomeFile}-${l}.webp`)));
}
