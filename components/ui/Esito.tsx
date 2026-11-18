"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Il messaggio «Fatto!» degli strumenti (biglietti, letterina): fisso in basso,
 * sopra la barra del telefono, così si vede anche quando il bottone toccato è
 * lontano. Con `festa` cadono i coriandoli, una volta sola. Studio UX del
 * 14/11/2026: dopo un download non si vedeva nessun riscontro.
 *
 * Chi vuole dire qualcosa chiama `annuncia(testo, festa)`; <MessaggioEsito />,
 * messo una volta nella pagina, lo mostra. Un evento della finestra invece di
 * un contesto: i bottoni non devono ricevere niente.
 */

const EVENTO = "giocamizi:esito";

export function annuncia(testo: string, festa = false) {
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { testo, festa } }));
}

const COLORI = ["#F28AB2", "#F9C846", "#3DB5E6", "#9B6DD6", "#F59A23", "#4CAF6D"];

export function MessaggioEsito() {
  const [esito, setEsito] = useState<{ testo: string; festa: boolean; chiave: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const ascolta = (e: Event) => {
      const { testo, festa } = (e as CustomEvent<{ testo: string; festa: boolean }>).detail;
      window.clearTimeout(timer.current);
      setEsito({ testo, festa, chiave: Date.now() });
      timer.current = window.setTimeout(() => setEsito(null), festa ? 5000 : 4000);
    };
    window.addEventListener(EVENTO, ascolta);
    return () => {
      window.removeEventListener(EVENTO, ascolta);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8"
    >
      {esito && (
        <div
          key={esito.chiave}
          className="relative max-w-md rounded-bolla bg-notte px-6 py-4 text-center text-lg font-extrabold text-white shadow-xl"
          style={{ animation: "comparsa 0.2s ease-out" }}
          data-esito
        >
          {esito.festa && (
            <span aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
              {Array.from({ length: 18 }, (_, i) => (
                <span
                  key={i}
                  className="coriandolo-uno"
                  style={{
                    left: `${(i * 5.7 + 3) % 100}%`,
                    animationDelay: `${(i % 6) * 0.08}s`,
                    backgroundColor: COLORI[i % COLORI.length],
                  }}
                />
              ))}
            </span>
          )}
          <span className="relative">{esito.testo}</span>
        </div>
      )}
    </div>
  );
}
