"use client";

import { useEffect, useState } from "react";
import { azzeraConsenso, consensoStatistiche } from "./analytics";

/**
 * Nella cookie policy: mostra la scelta fatta sulle statistiche e permette
 * di cambiarla. Azzerare la scelta ricarica la pagina, così il banner
 * ricompare e — se prima era un sì — lo script non viene più caricato.
 */
export function ScegliDiNuovo() {
  const [scelta, setScelta] = useState<"si" | "no" | null>(null);

  useEffect(() => {
    setScelta(consensoStatistiche());
  }, []);

  return (
    <div className="rounded-morbido border-2 border-crema-scuro bg-white p-5">
      <p className="font-extrabold text-notte">La tua scelta sulle statistiche</p>
      <p className="mt-1 text-notte-tenue">
        {scelta === "si" && "Hai accettato le statistiche anonime."}
        {scelta === "no" && "Hai rifiutato le statistiche: nessun dato viene raccolto."}
        {scelta === null && "Non hai ancora scelto: il banner comparirà al prossimo caricamento."}
      </p>
      {scelta !== null && (
        <button
          type="button"
          onClick={() => {
            azzeraConsenso();
            window.location.reload();
          }}
          className="mt-3 rounded-bolla border-2 border-crema-scuro bg-white px-5 py-3 font-extrabold text-notte hover:border-viola"
          style={{ minHeight: "2.75rem" }}
        >
          Cambia la tua scelta
        </button>
      )}
    </div>
  );
}
