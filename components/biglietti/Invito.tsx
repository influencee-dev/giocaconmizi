"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Biglietto, type DatiBiglietto } from "./Biglietto";
import { biglietoInPng, leggiDatiDaLink, numeroWhatsApp } from "@/lib/condivisione";
import { misure } from "@/lib/biglietti";

/**
 * L'invito digitale: la pagina che riceve chi apre il link dell'invito.
 * Mostra il biglietto e, se c'è un numero, il bottone di conferma che apre
 * WhatsApp con il messaggio già scritto — l'RSVP più semplice del mondo.
 */

const VUOTO: DatiBiglietto = {
  tipo: "invito",
  tema: "palloncini",
  variante: "chiaro",
  nome: "",
  eta: "",
  frase: "",
  data: "",
  ora: "",
  luogo: "",
  conferma: "",
  firma: "",
  conMizi: false,
  carattere: "tondo",
  stickers: [],
};

export function Invito() {
  const parametri = useSearchParams();
  const [dati, setDati] = useState<DatiBiglietto | null>(null);
  const contenitore = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stato = parametri.get("b");
    const salvato = stato ? leggiDatiDaLink(stato) : null;
    setDati(salvato ? { ...VUOTO, ...salvato } : VUOTO);
  }, [parametri]);

  const numero = useMemo(() => (dati ? numeroWhatsApp(dati.conferma) : null), [dati]);
  const [larghezza, altezza] = misure("a6");

  if (!dati) return null;

  const conferma = () => {
    const testo = `Confermo, ci saremo! 🎉${dati.nome ? ` (festa di ${dati.nome})` : ""}`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(testo)}`, "_blank", "noopener");
  };

  const scarica = async () => {
    const svg = contenitore.current?.querySelector("svg");
    if (!svg) return;
    const png = await biglietoInPng(svg, larghezza, altezza);
    const link = document.createElement("a");
    link.download = `invito-${dati.nome || "compleanno"}.png`.toLowerCase().replace(/\s+/g, "-");
    link.href = png;
    link.click();
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5">
      <div
        ref={contenitore}
        className="w-full overflow-hidden rounded-morbido shadow-lg"
        style={{ aspectRatio: `${larghezza} / ${altezza}` }}
      >
        <Biglietto dati={dati} larghezza={larghezza} altezza={altezza} />
      </div>

      {numero && (
        <button
          type="button"
          onClick={conferma}
          className="w-full rounded-bolla bg-verde px-8 py-5 text-xl font-extrabold text-white"
        >
          ✓ Confermo, ci saremo!
        </button>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={scarica}
          className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-3 font-bold text-notte"
        >
          Scarica il biglietto
        </button>
        <Link
          href="/biglietti/crea"
          data-tap
          className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-3 font-bold text-viola"
        >
          Creane uno anche tu, gratis
        </Link>
      </div>

      <p className="text-center text-sm text-notte-tenue">
        Fatto con <Link href="/" className="font-bold text-viola underline underline-offset-4">Gioca con Mizi</Link>
        {" "}— giochi educativi gratis per bambini, senza pubblicità.
      </p>
    </div>
  );
}
