"use server";

import { adminValido } from "@/lib/admin";
import { postDaId } from "@/lib/social/post";
import { ErroreInstagram, giaPubblicato, pubblicaSuInstagram } from "@/lib/social/instagram";

export type EsitoPubblicazione = { ok: true; permalink: string; gia?: boolean } | { ok: false; errore: string };

/** Il tocco di Giorgia: pubblica un post del giorno su Instagram. */
export async function pubblicaPost(codice: string, id: string, didascalia: string): Promise<EsitoPubblicazione> {
  if (!(await adminValido(codice))) return { ok: false, errore: "Codice del pannello non valido." };
  const post = postDaId(id);
  if (!post) return { ok: false, errore: "Questo post non esiste più (contenuto tolto dal sito?)." };
  try {
    const gia = await giaPubblicato(post);
    if (gia) return { ok: true, permalink: gia, gia: true };
    return { ok: true, permalink: await pubblicaSuInstagram(post, didascalia.trim()) };
  } catch (e) {
    return { ok: false, errore: e instanceof ErroreInstagram ? e.message : "Errore imprevisto: riprova tra poco." };
  }
}
