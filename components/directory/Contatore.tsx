"use client";

import { useEffect } from "react";

/**
 * Il contatore della scheda: una visita all'apertura e un clic per ogni
 * contatto toccato (gli elementi con data-traccia="whatsapp|telefono|…").
 * Solo un numero in più nel giorno: niente cookie, niente dati salvati sul
 * dispositivo, niente identificativi.
 */
export function Contatore({ scheda }: { scheda: string }) {
  useEffect(() => {
    const manda = (evento: string) => {
      const corpo = JSON.stringify({ scheda, evento });
      if (!navigator.sendBeacon?.("/api/eventi", corpo)) {
        void fetch("/api/eventi", { method: "POST", body: corpo, keepalive: true }).catch(() => undefined);
      }
    };
    manda("vista");
    const clic = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-traccia]");
      const evento = el?.getAttribute("data-traccia");
      if (evento) manda(evento);
    };
    document.addEventListener("click", clic, { capture: true });
    return () => document.removeEventListener("click", clic, { capture: true });
  }, [scheda]);
  return null;
}
