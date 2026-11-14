"use client";

import { biglietoInPng } from "@/lib/condivisione";

/**
 * Le uscite della letterina, tutte nel browser: PNG, PDF A4, stampa e
 * condivisione. Il foglio non passa mai dal server.
 */

export async function foglioInPng(svg: SVGElement, larghezza: number, altezza: number) {
  return biglietoInPng(svg, larghezza, altezza);
}

function caricaImmagine(src: string) {
  return new Promise<HTMLImageElement>((risolvi, rifiuta) => {
    const img = new Image();
    img.onload = () => risolvi(img);
    img.onerror = () => rifiuta(new Error("immagine non caricata"));
    img.src = src;
  });
}

export function scaricaUrl(href: string, nomeFile: string) {
  const link = document.createElement("a");
  link.download = nomeFile;
  link.href = href;
  link.click();
}

/** Un nome di file pulito: «letterina-di-sofia.pdf». */
export const nomeFileLetterina = (nome: string, estensione: string) =>
  `letterina-babbo-natale${nome ? `-di-${nome}` : ""}.${estensione}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-");

/**
 * Un PDF A4 con una sola immagine JPEG a pagina piena. Il formato PDF per
 * un'immagine è piccolo e stabile, quindi lo scriviamo a mano invece di
 * aggiungere una libreria: cinque oggetti e la tabella xref.
 */
export function pdfDaJpeg(jpeg: Uint8Array, larghezzaPx: number, altezzaPx: number): Blob {
  const A4 = { w: 595.28, h: 841.89 };
  const testo = new TextEncoder();
  const parti: Uint8Array[] = [];
  const offset: number[] = [];
  let lunghezza = 0;
  const aggiungi = (p: Uint8Array | string) => {
    const b = typeof p === "string" ? testo.encode(p) : p;
    parti.push(b);
    lunghezza += b.length;
  };
  const oggetto = (n: number, corpo: string) => {
    offset[n] = lunghezza;
    aggiungi(`${n} 0 obj\n${corpo}\nendobj\n`);
  };

  aggiungi("%PDF-1.4\n%âãÏÓ\n");
  oggetto(1, "<< /Type /Catalog /Pages 2 0 R >>");
  oggetto(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  oggetto(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4.w} ${A4.h}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`,
  );
  const disegno = `q ${A4.w} 0 0 ${A4.h} 0 0 cm /Im0 Do Q`;
  oggetto(4, `<< /Length ${disegno.length} >>\nstream\n${disegno}\nendstream`);
  offset[5] = lunghezza;
  aggiungi(
    `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${larghezzaPx} /Height ${altezzaPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  aggiungi(jpeg);
  aggiungi("\nendstream\nendobj\n");

  const xref = lunghezza;
  const righe = [1, 2, 3, 4, 5].map((n) => `${String(offset[n]).padStart(10, "0")} 00000 n \n`).join("");
  aggiungi(`xref\n0 6\n0000000000 65535 f \n${righe}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parti as BlobPart[], { type: "application/pdf" });
}

/** Il PNG del foglio diventa un PDF A4 (JPEG di qualità alta su fondo bianco). */
export async function pngInPdf(png: string, larghezza: number, altezza: number): Promise<Blob> {
  const img = await caricaImmagine(png);
  const tela = document.createElement("canvas");
  tela.width = larghezza;
  tela.height = altezza;
  const ctx = tela.getContext("2d");
  if (!ctx) throw new Error("canvas non disponibile");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, larghezza, altezza);
  ctx.drawImage(img, 0, 0, larghezza, altezza);
  const jpeg = tela.toDataURL("image/jpeg", 0.9);
  const binario = atob(jpeg.split(",")[1]);
  const byte = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) byte[i] = binario.charCodeAt(i);
  return pdfDaJpeg(byte, larghezza, altezza);
}

/**
 * Stampa il foglio senza aprire finestre: un iframe invisibile con
 * l'immagine a pagina piena (A4, margini zero) e la finestra di stampa.
 */
export function stampaImmagine(png: string) {
  const cornice = document.createElement("iframe");
  cornice.setAttribute("aria-hidden", "true");
  cornice.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
  cornice.srcdoc = `<!doctype html><html><head><style>@page{size:A4;margin:0}html,body{margin:0}img{width:100%;height:auto;display:block}</style></head><body><img src="${png}"></body></html>`;
  cornice.onload = () => {
    const finestra = cornice.contentWindow;
    if (!finestra) return;
    finestra.focus();
    finestra.print();
    setTimeout(() => cornice.remove(), 60_000);
  };
  document.body.appendChild(cornice);
}

/** Condivide l'immagine (WhatsApp, storie) dove il telefono lo permette. */
export async function condividiImmagine(png: string, nomeFile: string, testo: string): Promise<"condivisa" | "scaricata"> {
  try {
    const blob = await (await fetch(png)).blob();
    const file = new File([blob], nomeFile, { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: testo });
      return "condivisa";
    }
  } catch {
    // Annullata o non disponibile: si scarica e basta.
  }
  scaricaUrl(png, nomeFile);
  return "scaricata";
}
