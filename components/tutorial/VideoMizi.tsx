"use client";

import { forwardRef, useEffect, useState } from "react";

/**
 * Il video di Mizi che si adatta allo schermo (23/11/2026, richiesta di
 * Giorgia): sul telefono la versione verticale 9:16 (come un reel, da
 * guardare a schermo pieno o condividere nelle storie), dal computer quella
 * orizzontale 16:9. Il server disegna l'orizzontale; appena la pagina si apre
 * sul telefono passa alla verticale, prima che si tocchi «play».
 * I due file hanno gli stessi tempi: i passi e ?t= valgono per tutti e due.
 */

const TELEFONO = "(max-width: 767px)";

export interface FileVideo {
  src: string;
  poster: string;
}

export const VideoMizi = forwardRef<
  HTMLVideoElement,
  {
    orizzontale: FileVideo;
    verticale?: FileVideo;
    sottotitoli: string;
    onTimeUpdate?: (secondi: number) => void;
    /** Chiamata quando il video cambia formato (per riportarlo al punto giusto). */
    onCambio?: () => void;
    datiVideo?: Record<string, string>;
  }
>(function VideoMizi({ orizzontale, verticale, sottotitoli, onTimeUpdate, onCambio, datiVideo }, ref) {
  const [vert, setVert] = useState(false);

  useEffect(() => {
    if (!verticale) return;
    const m = window.matchMedia(TELEFONO);
    const aggiorna = () => setVert(m.matches);
    aggiorna();
    m.addEventListener("change", aggiorna);
    return () => m.removeEventListener("change", aggiorna);
  }, [verticale]);

  useEffect(() => {
    onCambio?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambio di formato
  }, [vert]);

  const f = vert && verticale ? verticale : orizzontale;
  return (
    <video
      key={f.src}
      ref={ref}
      controls
      playsInline
      preload="metadata"
      poster={f.poster}
      onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
      data-formato={vert && verticale ? "verticale" : "orizzontale"}
      {...Object.fromEntries(Object.entries(datiVideo ?? {}).map(([k, v]) => [`data-${k}`, v]))}
      className={
        vert && verticale
          ? "mx-auto aspect-[9/16] max-h-[82vh] w-full max-w-[26rem] rounded-[1.4rem] bg-notte shadow-[0_20px_40px_-24px_rgba(31,36,48,0.6)]"
          : "aspect-video w-full rounded-[1.4rem] bg-notte shadow-[0_20px_40px_-24px_rgba(31,36,48,0.6)]"
      }
    >
      <source src={f.src} type="video/mp4" />
      <track kind="captions" src={sottotitoli} srcLang="it" label="Italiano" />
      Il tuo browser non riproduce il video: qui sotto trovi il testo completo.
    </video>
  );
});
