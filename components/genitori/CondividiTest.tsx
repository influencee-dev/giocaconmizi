"use client";

import { useState } from "react";
import { PERCORSO } from "@/lib/famiglia/sotto-pressione";
import { url } from "@/lib/seo/seo";

/**
 * Il tasto «Condividi» del test «sotto pressione». Sul telefono apre il foglio
 * di condivisione del sistema (WhatsApp, Instagram, Messenger…); altrove, o se
 * non c'è, mostra WhatsApp, Facebook, Telegram, email e «Copia il link».
 * Nel messaggio c'è solo l'invito e l'indirizzo: MAI il risultato di chi ha
 * compilato, che resta privato. Nessuna richiesta parte finché non si tocca.
 */
export function CondividiTest({ compatto = false }: { compatto?: boolean }) {
  const [aperto, setAperto] = useState(false);
  const [copiato, setCopiato] = useState(false);
  const link = `${url(PERCORSO.percorso)}?utm_source=condivisione&utm_medium=social&utm_campaign=test-sotto-pressione`;
  const testo = PERCORSO.testoCondividi;
  const tutto = `${testo}\n${link}`;

  async function condividi() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: PERCORSO.titoloSocial, text: testo, url: link });
        return;
      } catch (e) {
        // annullato da chi condivide: non si apre altro
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    setAperto((a) => !a);
  }

  async function copia() {
    try {
      await navigator.clipboard.writeText(tutto);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2500);
    } catch {
      setCopiato(false);
    }
  }

  const voci = [
    { nome: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(tutto)}` },
    { nome: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` },
    { nome: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(testo)}` },
    { nome: "Email", href: `mailto:?subject=${encodeURIComponent(PERCORSO.titoloSocial)}&body=${encodeURIComponent(tutto)}` },
  ];

  return (
    <div className="flex flex-col gap-3 print:hidden" data-condividi-test>
      <button
        type="button"
        onClick={condividi}
        aria-expanded={aperto}
        className={`inline-flex min-h-14 w-fit items-center gap-2 rounded-2xl bg-rosa-forte px-6 py-3 font-extrabold text-white hover:bg-notte ${compatto ? "text-base" : "text-lg"}`}
      >
        <span aria-hidden>📣</span> Condividi il test con le amiche
      </button>
      {aperto && (
        <div className="flex flex-wrap gap-2" data-condividi-voci>
          {voci.map((v) => (
            <a
              key={v.nome}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-2xl border-2 border-notte/15 bg-white px-4 py-2 font-extrabold text-notte hover:border-viola"
            >
              {v.nome}
            </a>
          ))}
          <button
            type="button"
            onClick={copia}
            className="inline-flex min-h-12 items-center rounded-2xl border-2 border-notte/15 bg-white px-4 py-2 font-extrabold text-notte hover:border-viola"
          >
            {copiato ? "Link copiato!" : "Copia il link"}
          </button>
          <p className="w-full text-sm text-notte-tenue">
            Su Instagram: copia il link e incollalo nella storia con lo sticker «Link».
          </p>
        </div>
      )}
    </div>
  );
}
