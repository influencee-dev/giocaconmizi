"use client";

import type { DatiBiglietto } from "@/components/biglietti/Biglietto";

/**
 * Condivisione dei biglietti: PNG, link salvabile e invito digitale con
 * conferma su WhatsApp. Tutto lato client, come il resto del tool.
 */

/** L'SVG dell'anteprima diventa un PNG alla dimensione vera del formato. */
export async function biglietoInPng(svg: SVGElement, larghezza: number, altezza: number): Promise<string> {
  const sorgente = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([sorgente], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const immagine = new Image();
  immagine.crossOrigin = "anonymous";
  await new Promise<void>((risolvi, rifiuta) => {
    immagine.onload = () => risolvi();
    immagine.onerror = () => rifiuta(new Error("immagine non caricata"));
    immagine.src = url;
  });

  const tela = document.createElement("canvas");
  tela.width = larghezza;
  tela.height = altezza;
  tela.getContext("2d")?.drawImage(immagine, 0, 0, larghezza, altezza);
  URL.revokeObjectURL(url);
  return tela.toDataURL("image/png");
}

/**
 * Quattro copie del biglietto su un foglio A4 (300 dpi), coi segni di taglio
 * agli angoli: la promessa della pagina "inviti da stampare" ("ne entrano
 * quattro in un A4") mantenuta con un bottone. Pensato per l'A6: 2×2 copie.
 */
export async function foglioA4(svg: SVGElement, larghezza: number, altezza: number): Promise<string> {
  const biglietto = await biglietoInPng(svg, larghezza, altezza);
  const img = new Image();
  await new Promise<void>((risolvi, rifiuta) => {
    img.onload = () => risolvi();
    img.onerror = () => rifiuta(new Error("foglio non componibile"));
    img.src = biglietto;
  });

  const FOGLIO = { w: 2480, h: 3508 }; // A4 a 300 dpi, verticale
  const margine = 72; // ~6 mm: dentro l'area stampabile di casa
  const spazio = 36;
  const scala = Math.min(
    (FOGLIO.w - margine * 2 - spazio) / 2 / larghezza,
    (FOGLIO.h - margine * 2 - spazio) / 2 / altezza,
  );
  const w = Math.round(larghezza * scala);
  const h = Math.round(altezza * scala);
  const x0 = Math.round((FOGLIO.w - w * 2 - spazio) / 2);
  const y0 = Math.round((FOGLIO.h - h * 2 - spazio) / 2);

  const tela = document.createElement("canvas");
  tela.width = FOGLIO.w;
  tela.height = FOGLIO.h;
  const contesto = tela.getContext("2d");
  if (!contesto) return biglietto;
  contesto.fillStyle = "#FFFFFF";
  contesto.fillRect(0, 0, FOGLIO.w, FOGLIO.h);
  contesto.strokeStyle = "#B9B9B9";
  contesto.lineWidth = 2;

  for (const riga of [0, 1]) {
    for (const colonna of [0, 1]) {
      const x = x0 + colonna * (w + spazio);
      const y = y0 + riga * (h + spazio);
      contesto.drawImage(img, x, y, w, h);
      // Segni di taglio: trattini appena fuori dai quattro angoli della copia.
      for (const [ax, ay] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
        const sx = ax === x ? -1 : 1;
        const sy = ay === y ? -1 : 1;
        contesto.beginPath();
        contesto.moveTo(ax + sx * 8, ay);
        contesto.lineTo(ax + sx * 30, ay);
        contesto.moveTo(ax, ay + sy * 8);
        contesto.lineTo(ax, ay + sy * 30);
        contesto.stroke();
      }
    }
  }
  return tela.toDataURL("image/png");
}

/**
 * Il biglietto codificato per l'URL. La foto NON entra mai nel link:
 * è pesante e soprattutto è un dato del bambino che non deve viaggiare.
 */
export function datiPerLink(dati: DatiBiglietto): string {
  const senzaFoto: DatiBiglietto = { ...dati, foto: undefined };
  return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(senzaFoto)))));
}

export function leggiDatiDaLink(codificato: string): Partial<DatiBiglietto> | null {
  try {
    const grezzo = atob(decodeURIComponent(codificato));
    try {
      // Codifica nuova: JSON in UTF-8 vero (regge accenti ed emoji).
      return JSON.parse(decodeURIComponent(escape(grezzo))) as Partial<DatiBiglietto>;
    } catch {
      // Link salvati prima di questa versione: btoa diretto del JSON.
      return JSON.parse(grezzo) as Partial<DatiBiglietto>;
    }
  } catch {
    return null;
  }
}

/** La pagina-invito da mandare agli ospiti. */
export function linkInvito(dati: DatiBiglietto): string {
  return `/biglietti/vedi?b=${datiPerLink(dati)}`;
}

// numeroWhatsApp vive in lib/biglietti.ts (serve anche al Biglietto, che
// disegna il QR ed è usato da pagine server); da qui si riesporta per i
// componenti che già la importavano.
export { numeroWhatsApp } from "@/lib/biglietti";
