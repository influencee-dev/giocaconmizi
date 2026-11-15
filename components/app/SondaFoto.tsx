"use client";

import { useEffect } from "react";

/**
 * TEMPORANEA (15/11/2026). Nell'app installata sull'iPhone di Giorgia le foto
 * non si caricano, mentre nel browser sì. Questa sonda parte da sola, solo
 * nell'app installata, qualche secondo dopo l'apertura: guarda quali immagini
 * della pagina sono rotte, riprova la stessa foto in tre modi e manda l'esito
 * a /api/prova-foto (finisce nei log, niente database, niente cookie, nessun
 * dato che identifichi qualcuno). Da togliere a guasto risolto.
 */

const FOTO = "/immagini/festa-di-compleanno-per-bambini-ludoteca-640.webp";

function provaImmagine(src: string): Promise<string> {
  return new Promise((fine) => {
    const img = new window.Image();
    const scade = window.setTimeout(() => fine("img: nessuna risposta in 12 s"), 12000);
    img.onload = () => {
      window.clearTimeout(scade);
      fine(`img: ok ${img.naturalWidth}x${img.naturalHeight}`);
    };
    img.onerror = () => {
      window.clearTimeout(scade);
      fine("img: ERRORE");
    };
    img.src = src;
  });
}

async function provaScarico(src: string, cache: RequestCache): Promise<string> {
  try {
    const r = await fetch(src, { cache });
    const dati = await r.arrayBuffer();
    return `scarico: ${r.status} ${r.headers.get("content-type") ?? "?"} ${dati.byteLength} byte`;
  } catch (e) {
    return `scarico: FALLITO (${e instanceof Error ? e.message : "?"})`;
  }
}

export function SondaFoto() {
  useEffect(() => {
    const installata = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (!installata) return;
    const t = window.setTimeout(async () => {
      const immagini = [...document.images];
      const corto = (i: HTMLImageElement) => (i.currentSrc || i.src).replace(window.location.origin, "").slice(0, 150);
      const esito = {
        tipo: "sonda",
        pagina: window.location.pathname,
        immagini: immagini.length,
        rotte: immagini.filter((i) => i.complete && i.naturalWidth === 0).map(corto).slice(0, 6),
        ferme: immagini.filter((i) => !i.complete && i.loading !== "lazy").map(corto).slice(0, 6),
        buone: immagini.filter((i) => i.complete && i.naturalWidth > 0).map(corto).slice(0, 4),
        foto: `${await provaImmagine(FOTO)} | ${await provaScarico(FOTO, "default")}`,
        fotoNuova: `${await provaImmagine(`${FOTO}?s=${Date.now()}`)} | ${await provaScarico(`${FOTO}?t=${Date.now()}`, "no-store")}`,
        fotoJpeg: `${await provaImmagine("/app/prova-b.jpg")} | ${await provaScarico("/app/prova-b.jpg", "default")}`,
        logo: await provaImmagine("/mizi/giocamizi-logo-orizzontale.webp"),
        telefono: navigator.userAgent,
        schermo: `${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}`,
        servizio: navigator.serviceWorker?.controller?.scriptURL ?? "nessuno",
        quando: new Date().toISOString(),
      };
      void fetch("/api/prova-foto", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(esito) }).catch(() => undefined);
    }, 6000);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
