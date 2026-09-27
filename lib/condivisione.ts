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
