"use client";

import { useSearchParams } from "next/navigation";

const COMPLEANNO = "Crea il tuo biglietto di compleanno";

/**
 * Il titolo del creatore (24/11/2026): con lo sfondo di Natale («?tema=natale»,
 * il link dei biglietti di Natale e dei reel) dice «di Natale», non «di
 * compleanno». La pagina resta statica: Google e la prima pittura vedono il
 * titolo di sempre, il cambio avviene nel browser.
 */
function Titolo() {
  const tema = useSearchParams().get("tema");
  return <>{tema === "natale" ? "Crea il tuo biglietto di Natale" : COMPLEANNO}</>;
}

export { Titolo as TitoloCreaDinamico, COMPLEANNO as TITOLO_CREA };
