"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCarrello } from "./carrello";

/** «Aggiungi al carrello» che diventa «Nel carrello» (e si toglie con un altro tocco). */
export function BottoneCarrello({ codice, nome, piccolo = false }: { codice: string; nome: string; piccolo?: boolean }) {
  const { codici, pronto, aggiungi, togli } = useCarrello();
  const dentro = codici.includes(codice);
  const base = piccolo
    ? "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border-2 px-3 text-sm font-extrabold"
    : "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 px-5 font-extrabold";
  return (
    <button
      type="button"
      disabled={!pronto}
      onClick={() => (dentro ? togli(codice) : aggiungi(codice))}
      aria-pressed={dentro}
      aria-label={dentro ? `${nome}: nel carrello, tocca per toglierlo` : `Aggiungi al carrello: ${nome}`}
      className={`${base} ${dentro ? "border-viola bg-white text-viola" : "border-viola bg-viola text-white hover:bg-viola-forte"}`}
    >
      {dentro ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <ShoppingBag className="h-4 w-4" strokeWidth={2.6} aria-hidden />}
      {dentro ? "Nel carrello" : "Aggiungi"}
    </button>
  );
}

/** Il collegamento al carrello con il numero dei prodotti dentro. */
export function LinkCarrello() {
  const { codici } = useCarrello();
  return (
    <Link
      href="/negozio/carrello"
      prefetch={false}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-notte px-4 text-sm font-bold text-white hover:bg-viola"
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />
      Carrello{codici.length ? ` (${codici.length})` : ""}
    </Link>
  );
}

/** Sulla pagina «grazie»: l'acquisto è fatto, il carrello si svuota. */
export function SvuotaCarrello() {
  const { svuota } = useCarrello();
  useEffect(() => svuota(), [svuota]);
  return null;
}
