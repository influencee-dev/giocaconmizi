"use client";

import { useEffect, useState } from "react";
import type { Skill } from "@/games/registry";

/**
 * L'album di Mizi: ogni gioco finito regala la sua figurina, e tre giochi
 * DIVERSI nello stesso giorno regalano la coccarda del giorno. Serve a far
 * venire voglia di provare un altro gioco, non a tenere incollati: niente
 * serie da non perdere, niente punti che scadono, niente classifiche.
 *
 * Resta SOLO sul telefono (localStorage «giocamizi-album», registrato in
 * lib/legal.ts): al server non arriva niente e non identifica nessuno.
 */

export const CHIAVE_ALBUM = "giocamizi-album";
const EVENTO = "giocamizi-album";
/** Quanti giochi diversi in un giorno per la coccarda. */
export const GIOCHI_PER_COCCARDA = 3;

export interface Figurina {
  /** Il risultato migliore, da 1 a 3. */
  stelle: number;
  volte: number;
  /** Ultima partita finita, AAAA-MM-GG. */
  ultimo: string;
}

export interface Album {
  giochi: Record<string, Figurina>;
  /** Il giorno in corso e i giochi diversi finiti oggi. */
  oggi: { giorno: string; slug: string[] };
  coccarde: number;
}

/** Quello che la festa di fine gioco racconta. */
export interface EsitoAlbum {
  /** Prima volta che si finisce questo gioco: figurina nuova. */
  nuova: boolean;
  /** Più stelle dell'ultima volta. */
  record: boolean;
  figurine: number;
  /** Giochi diversi finiti oggi, da 0 a GIOCHI_PER_COCCARDA. */
  oggi: number;
  /** La coccarda di oggi arriva proprio con questa partita. */
  coccardaOra: boolean;
  coccarde: number;
}

export interface GiocoBreve {
  slug: string;
  title: string;
  skill: Skill;
  ageMin: number;
  ageMax: number;
}

const VUOTO: Album = { giochi: {}, oggi: { giorno: "", slug: [] }, coccarde: 0 };

/** Il giorno del telefono (non UTC: a mezzanotte di casa comincia un giorno nuovo). */
export function giornoDiOggi(adesso = new Date()): string {
  const m = String(adesso.getMonth() + 1).padStart(2, "0");
  const g = String(adesso.getDate()).padStart(2, "0");
  return `${adesso.getFullYear()}-${m}-${g}`;
}

export function leggiAlbum(): Album {
  if (typeof window === "undefined") return VUOTO;
  try {
    const a = JSON.parse(window.localStorage.getItem(CHIAVE_ALBUM) ?? "null") as Partial<Album> | null;
    if (!a || typeof a !== "object" || typeof a.giochi !== "object" || a.giochi === null) return VUOTO;
    const oggi = a.oggi && Array.isArray(a.oggi.slug) ? a.oggi : VUOTO.oggi;
    return { giochi: a.giochi, oggi, coccarde: Number(a.coccarde) || 0 };
  } catch {
    return VUOTO;
  }
}

/** I giochi diversi finiti oggi (zero se l'ultimo giorno segnato non è oggi). */
export function fattiOggi(album: Album): number {
  return album.oggi.giorno === giornoDiOggi() ? Math.min(album.oggi.slug.length, GIOCHI_PER_COCCARDA) : 0;
}

/** Segna una partita finita e dice cosa c'è da festeggiare. */
export function registraNellAlbum(slug: string, stelle: number): EsitoAlbum {
  const album = leggiAlbum();
  const giorno = giornoDiOggi();
  const prima = album.giochi[slug];
  const punti = Math.max(1, Math.min(3, Math.round(stelle)));

  const giochi = {
    ...album.giochi,
    [slug]: { stelle: Math.max(prima?.stelle ?? 0, punti), volte: (prima?.volte ?? 0) + 1, ultimo: giorno },
  };
  const diOggi = album.oggi.giorno === giorno ? album.oggi.slug : [];
  const eraFatta = diOggi.length >= GIOCHI_PER_COCCARDA;
  const slugOggi = diOggi.includes(slug) ? diOggi : [...diOggi, slug];
  const coccardaOra = !eraFatta && slugOggi.length >= GIOCHI_PER_COCCARDA;
  const nuovo: Album = { giochi, oggi: { giorno, slug: slugOggi }, coccarde: album.coccarde + (coccardaOra ? 1 : 0) };

  try {
    window.localStorage.setItem(CHIAVE_ALBUM, JSON.stringify(nuovo));
  } catch {
    // Navigazione privata o memoria piena: la festa si fa lo stesso.
  }
  window.dispatchEvent(new Event(EVENTO));

  return {
    nuova: !prima,
    record: Boolean(prima) && punti > prima.stelle,
    figurine: Object.keys(giochi).length,
    oggi: Math.min(slugOggi.length, GIOCHI_PER_COCCARDA),
    coccardaOra,
    coccarde: nuovo.coccarde,
  };
}

/** L'album, aggiornato quando cambia (anche da un'altra scheda). `pronto` = letto dal telefono. */
export function useAlbum(): { album: Album; pronto: boolean } {
  const [stato, setStato] = useState<{ album: Album; pronto: boolean }>({ album: VUOTO, pronto: false });
  useEffect(() => {
    const aggiorna = () => setStato({ album: leggiAlbum(), pronto: true });
    aggiorna();
    window.addEventListener(EVENTO, aggiorna);
    window.addEventListener("storage", aggiorna);
    return () => {
      window.removeEventListener(EVENTO, aggiorna);
      window.removeEventListener("storage", aggiorna);
    };
  }, []);
  return stato;
}

/**
 * I prossimi giochi da proporre, i migliori per primi: adatti all'età, non
 * ancora fatti, di una competenza diversa da quella appena allenata. Quando
 * l'album dell'età è pieno si riparte da quelli con meno stelle.
 */
export function prossimiGiochi(giochi: GiocoBreve[], album: Album, eta: number, appenaFatto?: string, quanti = 3): GiocoBreve[] {
  const attuale = giochi.find((g) => g.slug === appenaFatto);
  const distanza = (g: GiocoBreve) => (eta < g.ageMin ? g.ageMin - eta : eta > g.ageMax ? eta - g.ageMax : 0);
  const voto = (g: GiocoBreve) => {
    const fig = album.giochi[g.slug];
    return (
      distanza(g) * 100 + // prima di tutto l'età giusta
      (fig ? 40 + fig.stelle * 5 : 0) + // poi i giochi mai fatti
      (attuale && g.skill === attuale.skill ? 10 : 0) + // poi una competenza diversa
      (album.oggi.giorno === giornoDiOggi() && album.oggi.slug.includes(g.slug) ? 20 : 0) // non uno già fatto oggi
    );
  };
  return giochi
    .filter((g) => g.slug !== appenaFatto)
    .map((g, i) => ({ g, v: voto(g), i }))
    .sort((a, b) => a.v - b.v || a.i - b.i)
    .slice(0, quanti)
    .map((x) => x.g);
}
