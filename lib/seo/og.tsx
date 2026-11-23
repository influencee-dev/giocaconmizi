import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Le anteprime di condivisione (Open Graph, 1200×630): l'immagine che compare
 * quando un link di Giocamizi si incolla su WhatsApp, Facebook, Telegram o in
 * una storia. Rifatte il 23/11/2026 sul design system del sito: fondo crema,
 * Nunito 800, logo, Mizi intera, un'etichetta nel colore della sezione e il
 * bottone «Apri su giocamizi.it →». Scopo: portare chi le vede sul sito.
 *
 * Satori (next/og) non legge il WebP: logo e Mizi si convertono in PNG con
 * sharp. Ogni div con figli dichiara display:flex (regola di satori). I file
 * letti qui sono inclusi nelle funzioni da outputFileTracingIncludes
 * (next.config.ts, chiavi «…/opengraph-image»).
 */

export const dimensioniOg = { width: 1200, height: 630 };

/** I colori del brand (app/globals.css). */
export const TINTE = {
  viola: { fondo: "#9B6DD6", testo: "#FFFFFF", alone: "#EFE6FA" },
  rosa: { fondo: "#F28AB2", testo: "#1F2430", alone: "#FCE1EC" },
  giallo: { fondo: "#F9C846", testo: "#1F2430", alone: "#FDF0C8" },
  azzurro: { fondo: "#3DB5E6", testo: "#1F2430", alone: "#D9F0FA" },
  arancio: { fondo: "#F59A23", testo: "#1F2430", alone: "#FDE6C6" },
} as const;
export type Tinta = keyof typeof TINTE;

const C = { crema: "#FFF3E6", notte: "#1F2430", notteTenue: "#4A5164", rosaForte: "#C42A6B" };

const caratteri = () =>
  ([600, 800] as const).map((weight) => ({
    name: "Nunito",
    data: fs.readFileSync(path.join(process.cwd(), "lib", "social", "caratteri", `nunito-${weight}.ttf`)),
    weight,
    style: "normal" as const,
  }));

const cache = new Map<string, string>();
async function png(rel: string, larghezza: number) {
  const c = cache.get(rel);
  if (c) return c;
  const dati = await sharp(fs.readFileSync(path.join(process.cwd(), "public", rel))).resize({ width: larghezza }).png().toBuffer();
  const uri = `data:image/png;base64,${dati.toString("base64")}`;
  cache.set(rel, uri);
  return uri;
}

export interface DatiOg {
  /** La frase grande: il titolo della pagina, scritto per far venire voglia di aprirla. */
  titolo: string;
  /** L'etichetta colorata sopra il titolo (es. «Gioco gratis · 5-7 anni»). */
  etichetta: string;
  /** Una riga sotto il titolo (facoltativa). */
  sottotitolo?: string;
  tinta?: Tinta;
  /** Il testo del bottone: porta sempre al sito. */
  invito?: string;
}

/** L'anteprima disegnata: usarla in ogni opengraph-image.tsx. */
export async function immagineOg({ titolo, etichetta, sottotitolo, tinta = "viola", invito = "Apri su giocamizi.it" }: DatiOg) {
  const [mizi, logo] = await Promise.all([png("mizi/mizi-intera.webp", 460), png("mizi/giocamizi-logo-orizzontale.webp", 520)]);
  const t = TINTE[tinta];
  const corpo = titolo.length > 70 ? 50 : titolo.length > 48 ? 58 : 68;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: C.crema, fontFamily: "Nunito" }}>
        {/* alone colorato dietro Mizi e due cerchietti del brand */}
        <div style={{ display: "flex", position: "absolute", right: -120, top: 70, width: 620, height: 620, borderRadius: 999, backgroundColor: t.alone }} />
        <div style={{ display: "flex", position: "absolute", right: 380, top: 46, width: 34, height: 34, borderRadius: 999, backgroundColor: TINTE.giallo.fondo }} />
        <div style={{ display: "flex", position: "absolute", right: 60, top: 40, width: 22, height: 22, borderRadius: 999, backgroundColor: TINTE.azzurro.fondo }} />
        {/* eslint-disable-next-line @next/next/no-img-element -- satori disegna solo <img> */}
        <img src={mizi} width={420} height={420} alt="" style={{ position: "absolute", right: 34, bottom: -6, objectFit: "contain" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 760, height: "100%", padding: "52px 0 56px 64px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori disegna solo <img> */}
          <img src={logo} width={260} height={66} alt="" style={{ objectFit: "contain", objectPosition: "left" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                backgroundColor: t.fondo,
                color: t.testo,
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {etichetta}
            </div>
            <div style={{ display: "flex", fontSize: corpo, fontWeight: 800, color: C.notte, lineHeight: 1.08, letterSpacing: -1 }}>{titolo}</div>
            {sottotitolo && <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: C.notteTenue, lineHeight: 1.3 }}>{sottotitolo}</div>}
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 14,
              backgroundColor: C.rosaForte,
              color: "#FFFFFF",
              borderRadius: 999,
              padding: "16px 32px",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            {invito} →
          </div>
        </div>
      </div>
    ),
    { ...dimensioniOg, fonts: caratteri() },
  );
}
