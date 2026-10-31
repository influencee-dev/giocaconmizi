"use client";

import { useState } from "react";

/**
 * Reel Instagram "a scatto": finché non si tocca, nella pagina non c'è
 * NESSUN codice di Instagram — niente script, niente cookie di terzi, in
 * coerenza con la promessa del sito (e col banner consensi che non copre
 * i social). Al tocco si carica il player ufficiale via iframe /embed.
 */
export function ReelInstagram({ url, nome }: { url: string; nome: string }) {
  const [aperto, setAperto] = useState(false);
  const incorporo = `${url.replace(/\/+$/, "")}/embed`;

  if (!aperto) {
    return (
      <button
        type="button"
        onClick={() => setAperto(true)}
        className="flex w-full max-w-xs flex-col items-center gap-1 rounded-morbido border-2 border-crema-scuro bg-crema px-4 py-5 text-center transition-colors hover:border-viola"
      >
        <span className="font-extrabold text-notte">▶ Guarda il reel di {nome}</span>
        <span className="text-xs text-notte-tenue">
          Si apre il player di Instagram: i suoi cookie partono solo da quel momento.
        </span>
      </button>
    );
  }

  return (
    <iframe
      src={incorporo}
      title={`Reel Instagram di ${nome}`}
      className="aspect-[9/16] w-full max-w-xs rounded-[1.4rem] border border-notte/10 bg-white"
      loading="lazy"
      allowFullScreen
    />
  );
}
