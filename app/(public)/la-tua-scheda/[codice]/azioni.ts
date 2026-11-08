"use server";

import { CAMPI, inviaRichiesta, type DatiModifica } from "@/lib/directory-db";

export type Esito = { stato: "fermo" } | { stato: "ok"; tipo: string } | { stato: "errore"; messaggio: string };

const pulito = (v: FormDataEntryValue | null, max = 600) => String(v ?? "").trim().slice(0, max);

/** La risposta del locale dal suo link personale: approva, modifica o rimuovi. */
export async function rispondi(_prima: Esito, form: FormData): Promise<Esito> {
  const tipo = pulito(form.get("tipo"), 20) as "approva" | "modifica" | "rimuovi";
  if (!["approva", "modifica", "rimuovi"].includes(tipo)) return { stato: "errore", messaggio: "Scelta non valida." };
  const email = pulito(form.get("email"), 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { stato: "errore", messaggio: "Serve un'email valida per risponderti." };
  const termini = form.get("termini") === "si";
  if (tipo !== "rimuovi" && !termini) return { stato: "errore", messaggio: "Per pubblicare la scheda serve accettare i termini e condizioni." };

  const dati: DatiModifica = {};
  if (tipo === "modifica") {
    for (const c of CAMPI) {
      const v = pulito(form.get(c), c === "descrizione" || c === "pacchetti" || c === "orari" ? 1200 : 300);
      if (v) dati[c] = v;
    }
  }
  const motivo = pulito(form.get("motivo"), 600);
  if (motivo) (dati as Record<string, string>).motivo = motivo;

  const r = await inviaRichiesta({
    codice: pulito(form.get("codice"), 100), tipo, dati, email, referente: pulito(form.get("referente"), 200), termini,
  });
  if (!r.ok) return { stato: "errore", messaggio: r.errore.includes("non valido") ? "Il link non è più valido: scrivici e te ne mandiamo uno nuovo." : "Non siamo riusciti a salvare la risposta. Riprova tra qualche minuto." };
  return { stato: "ok", tipo };
}

// ---------- Risorse educative: stessa logica, campi propri e logo ----------

/**
 * Il logo: il server lo ricodifica sempre (sharp) in un WebP quadrato da 256 px,
 * su fondo bianco, senza metadati. Si accettano solo PNG, JPEG e WebP: niente SVG
 * (potrebbero contenere script). Il logo resta in attesa finché Giorgia lo approva.
 */
async function logoPulito(file: File): Promise<string | null> {
  if (file.size === 0) return null;
  if (file.size > 900_000 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("formato");
  const { default: sharp } = await import("sharp");
  const ingresso = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(ingresso).metadata();
  if (!meta.width || !meta.height || meta.width > 6000 || meta.height > 6000) throw new Error("formato");
  const webp = await sharp(ingresso)
    .rotate()
    .resize(256, 256, { fit: "contain", background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 88 })
    .toBuffer();
  return webp.toString("base64");
}

export async function rispondiRisorsa(_prima: Esito, form: FormData): Promise<Esito> {
  const { CAMPI_RISORSA, COSTI } = await import("@/lib/risorse-reclamo");
  const { inviaLogo } = await import("@/lib/directory-db");
  const tipo = pulito(form.get("tipo"), 20) as "approva" | "modifica" | "rimuovi";
  if (!["approva", "modifica", "rimuovi"].includes(tipo)) return { stato: "errore", messaggio: "Scelta non valida." };
  const email = pulito(form.get("contatto"), 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { stato: "errore", messaggio: "Serve un'email valida per risponderti." };
  const termini = form.get("termini") === "si";
  if (tipo !== "rimuovi" && !termini) return { stato: "errore", messaggio: "Per pubblicare la scheda serve accettare i termini e condizioni." };
  const codice = pulito(form.get("codice"), 100);

  let logo: string | null = null;
  const file = form.get("logo");
  if (tipo !== "rimuovi" && file instanceof File) {
    try {
      logo = await logoPulito(file);
    } catch {
      return { stato: "errore", messaggio: "Il logo deve essere un'immagine PNG, JPG o WebP sotto 1 MB." };
    }
  }

  const dati: Record<string, string> = {};
  if (tipo === "modifica") {
    for (const c of CAMPI_RISORSA) {
      const v = pulito(form.get(c), ["descrizione", "cosaFa", "comeSiUsa", "orari"].includes(c) ? 1200 : 300);
      if (v) dati[c] = v;
    }
    if (dati.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dati.email)) delete dati.email;
    if (dati.sito && !/^https?:\/\//.test(dati.sito)) dati.sito = `https://${dati.sito}`;
    if (dati.costi && !COSTI.includes(dati.costi as (typeof COSTI)[number])) delete dati.costi;
  }
  const motivo = pulito(form.get("motivo"), 600);
  if (motivo) dati.motivo = motivo;

  const r = await inviaRichiesta({ codice, tipo, dati: dati as DatiModifica, email, referente: pulito(form.get("referente"), 200), termini });
  if (!r.ok) return { stato: "errore", messaggio: r.errore.includes("non valido") ? "Il link non è più valido: scrivici e te ne mandiamo uno nuovo." : "Non siamo riusciti a salvare la risposta. Riprova tra qualche minuto." };
  if (logo) {
    const l = await inviaLogo(codice, logo);
    if (!l.ok) return { stato: "errore", messaggio: "La scheda è arrivata, ma il logo no: riprova a caricarlo tra qualche minuto." };
  }
  return { stato: "ok", tipo };
}
