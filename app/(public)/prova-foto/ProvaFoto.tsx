"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Carica la stessa foto in più modi (percorso, nome, formato) e dice quali
 * arrivano: serve a capire che cosa, sul telefono, ferma le foto del sito.
 * L'esito va anche a /api/prova-foto, così chi ripara lo legge senza screenshot.
 */

const FOTO = "/immagini/festa-di-compleanno-per-bambini-ludoteca-640.webp";
const PROVE: { id: string; cosa: string; src: string }[] = [
  { id: "A", cosa: "la foto del sito (WebP in /immagini)", src: FOTO },
  { id: "B", cosa: "la stessa foto, altro indirizzo", src: "/app/prova-a.webp" },
  { id: "C", cosa: "la stessa foto in JPEG", src: "/app/prova-b.jpg" },
  { id: "D", cosa: "la stessa foto in PNG", src: "/app/prova-c.png" },
  { id: "E", cosa: "il logo (WebP)", src: "/mizi/giocamizi-logo-orizzontale.webp" },
  { id: "F", cosa: "un ritratto in /immagini", src: "/immagini/giorgia-palazzo-giocamizi.webp" },
  { id: "G", cosa: "un'icona (PNG)", src: "/icone/pinguino.png" },
];

type Esito = Record<string, string>;

function provaImmagine(src: string): Promise<string> {
  return new Promise((fine) => {
    const img = new window.Image();
    const scade = window.setTimeout(() => fine("img: nessuna risposta in 15 s"), 15000);
    img.onload = () => {
      window.clearTimeout(scade);
      fine(`img: ok ${img.naturalWidth}x${img.naturalHeight}`);
    };
    img.onerror = () => {
      window.clearTimeout(scade);
      fine("img: ERRORE");
    };
    img.src = `${src}?prova=${Date.now()}`;
  });
}

async function provaScarico(src: string): Promise<string> {
  try {
    const r = await fetch(`${src}?scarico=${Date.now()}`, { cache: "no-store" });
    const dati = await r.arrayBuffer();
    return `scarico: ${r.status} ${r.headers.get("content-type") ?? "?"} ${dati.byteLength} byte`;
  } catch (e) {
    return `scarico: FALLITO (${e instanceof Error ? e.message : "?"})`;
  }
}

export function ProvaFoto() {
  const [esito, setEsito] = useState<Esito | null>(null);
  const [inviato, setInviato] = useState<"attesa" | "si" | "no">("attesa");
  const componente = useRef("in attesa");

  useEffect(() => {
    let vivo = true;
    (async () => {
      const e: Esito = {};
      for (const p of PROVE) e[p.id] = `${await provaImmagine(p.src)} | ${await provaScarico(p.src)}`;
      // Un momento in più per il riquadro fatto come quelli del sito.
      await new Promise((r) => window.setTimeout(r, 2500));
      e.H = `riquadro del sito: ${componente.current}`;
      e.telefono = navigator.userAgent;
      e.app = String(window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
      e.schermo = `${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}`;
      e.servizio = navigator.serviceWorker?.controller?.scriptURL ?? "nessuno";
      e.rete = String(navigator.onLine);
      e.quando = new Date().toISOString();
      if (!vivo) return;
      setEsito(e);
      const r = await fetch("/api/prova-foto", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }).catch(() => null);
      if (vivo) setInviato(r?.ok ? "si" : "no");
    })();
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <p className="rounded-morbido bg-white p-4 text-lg font-bold text-notte" data-stato-prova={esito ? inviato : "prova"}>
        {!esito
          ? "Sto provando le foto… aspetta qualche secondo."
          : inviato === "si"
            ? "Fatto, grazie! L'esito è arrivato. Puoi chiudere questa pagina."
            : inviato === "no"
              ? "Fatto, ma l'esito non è partito: fai uno screenshot di questa pagina."
              : "Fatto, invio l'esito…"}
      </p>

      <figure className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-morbido bg-crema-scuro">
        <Image
          src="/immagini/festa-di-compleanno-per-bambini-ludoteca-1440.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          onLoad={(ev) => {
            componente.current = `ok ${ev.currentTarget.currentSrc.split("/").pop()}`;
          }}
          onError={(ev) => {
            componente.current = `ERRORE ${ev.currentTarget.currentSrc.split("/").pop()}`;
          }}
        />
      </figure>

      <ul className="flex flex-col gap-2 text-sm text-notte">
        {PROVE.map((p) => (
          <li key={p.id} className="rounded-morbido bg-white p-3">
            <strong>
              {p.id}. {p.cosa}
            </strong>
            {/* eslint-disable-next-line @next/next/no-img-element -- qui si prova proprio l'immagine nuda */}
            <img src={p.src} alt="" className="mt-2 h-16 w-auto" />
            <span className="mt-1 block break-words">{esito?.[p.id] ?? "…"}</span>
          </li>
        ))}
        {esito && (
          <li className="break-words rounded-morbido bg-white p-3">
            {esito.H}
            <br />
            {esito.telefono}
            <br />
            app: {esito.app} · {esito.schermo} · servizio: {esito.servizio}
          </li>
        )}
      </ul>
    </div>
  );
}
