import { url } from "@/lib/seo";
import { firmaSlide } from "./disegna";
import type { PostSocial } from "./post";

/**
 * Pubblicazione su Instagram con le API ufficiali (Instagram API con login
 * Instagram, account professionale @giocamizi). Le chiavi stanno SOLO nelle
 * variabili d'ambiente di Vercel, mai nel repo (docs/instagram.md):
 *   INSTAGRAM_USER_ID       l'id numerico dell'account professionale
 *   INSTAGRAM_ACCESS_TOKEN  il token a lunga durata (60 giorni, da rinnovare)
 *   INSTAGRAM_API_VERSION   facoltativo, es. v24.0 (senza: la versione di default)
 * Flusso Meta: un contenitore per ogni immagine → (carosello) un contenitore
 * padre → attesa FINISHED → media_publish → permalink.
 */

export function instagramCollegato() {
  return Boolean(process.env.INSTAGRAM_USER_ID && process.env.INSTAGRAM_ACCESS_TOKEN);
}

const base = () => {
  const v = process.env.INSTAGRAM_API_VERSION?.trim();
  return `https://graph.instagram.com${v ? `/${v}` : ""}`;
};

class ErroreInstagram extends Error {}

async function chiama(percorso: string, parametri: Record<string, string>, metodo: "GET" | "POST" = "POST") {
  const corpo = new URLSearchParams({ ...parametri, access_token: process.env.INSTAGRAM_ACCESS_TOKEN ?? "" });
  const indirizzo = `${base()}${percorso}${metodo === "GET" ? `?${corpo}` : ""}`;
  const r = await fetch(indirizzo, {
    method: metodo,
    body: metodo === "POST" ? corpo : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const dati = (await r.json().catch(() => ({}))) as Record<string, unknown> & { error?: { message?: string; code?: number } };
  if (!r.ok || dati.error) {
    const e = dati.error;
    // Codice 190: token scaduto o revocato. È l'errore più probabile dopo 60 giorni.
    if (e?.code === 190) throw new ErroreInstagram("Il collegamento a Instagram è scaduto: va rinnovato il token (docs/instagram.md).");
    throw new ErroreInstagram(`Instagram ha risposto: ${e?.message ?? `errore ${r.status}`}`);
  }
  return dati;
}

async function attendiPronto(idContenitore: string) {
  for (let i = 0; i < 20; i++) {
    const s = await chiama(`/${idContenitore}`, { fields: "status_code" }, "GET");
    if (s.status_code === "FINISHED") return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new ErroreInstagram("Instagram non è riuscito a preparare l'immagine.");
    await new Promise((ok) => setTimeout(ok, 3000));
  }
  throw new ErroreInstagram("Instagram ci sta mettendo troppo a preparare il post: riprova tra qualche minuto.");
}

/** Già pubblicato? Cerca il link del contenuto negli ultimi post dello stesso tipo. */
export async function giaPubblicato(post: PostSocial): Promise<string | null> {
  const utente = process.env.INSTAGRAM_USER_ID!;
  const r = await chiama(`/${utente}/media`, { fields: "caption,media_type,permalink", limit: "40" }, "GET");
  const tipo = post.tipo === "carosello" ? "CAROUSEL_ALBUM" : "IMAGE";
  const elenco = (r.data as { caption?: string; media_type?: string; permalink?: string }[]) ?? [];
  return elenco.find((m) => m.media_type === tipo && m.caption?.includes(post.link))?.permalink ?? null;
}

/** Pubblica il post e restituisce il permalink. Le immagini le scarica Meta da giocamizi.it. */
export async function pubblicaSuInstagram(post: PostSocial, didascalia: string): Promise<string> {
  if (!instagramCollegato()) throw new ErroreInstagram("Instagram non è ancora collegato (docs/instagram.md).");
  if (!didascalia.includes(post.link)) throw new ErroreInstagram(`La didascalia deve contenere il link ${post.link}.`);
  if (didascalia.length > 2200) throw new ErroreInstagram("La didascalia supera i 2.200 caratteri di Instagram.");
  const utente = process.env.INSTAGRAM_USER_ID!;
  // Indirizzi firmati: solo Meta, con la firma, può scaricare le slide.
  const immagini = post.slides.map((_, i) => url(`/social/${post.id}/${i + 1}.jpg?f=${firmaSlide(post.id, i + 1)}`));

  let creazione: string;
  if (immagini.length === 1) {
    const c = await chiama(`/${utente}/media`, { image_url: immagini[0], caption: didascalia });
    creazione = String(c.id);
  } else {
    const figli: string[] = [];
    for (const image_url of immagini) {
      const c = await chiama(`/${utente}/media`, { image_url, is_carousel_item: "true" });
      figli.push(String(c.id));
    }
    for (const f of figli) await attendiPronto(f);
    const c = await chiama(`/${utente}/media`, { media_type: "CAROUSEL", children: figli.join(","), caption: didascalia });
    creazione = String(c.id);
  }
  await attendiPronto(creazione);
  const pubblicato = await chiama(`/${utente}/media_publish`, { creation_id: creazione });
  const dettagli = await chiama(`/${String(pubblicato.id)}`, { fields: "permalink" }, "GET");
  return String(dettagli.permalink ?? "https://www.instagram.com/giocamizi/");
}

export { ErroreInstagram };
