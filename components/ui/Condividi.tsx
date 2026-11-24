"use client";

import { useState } from "react";
import { url } from "@/lib/seo/seo";

/**
 * Il tasto «Condividi» di Giocamizi (23/11/2026), uguale su articoli, giochi,
 * schede delle attività e test. Sul telefono apre il foglio di condivisione
 * del sistema (WhatsApp, Instagram, Messenger…); altrove, o se non c'è,
 * mostra WhatsApp, Facebook, Telegram, email e «Copia il link».
 *
 * Tutto punta a portare la gente SUL SITO: il messaggio è un invito breve più
 * il link con gli UTM (utm_source=condivisione, utm_campaign=<campagna>), e
 * l'anteprima che compare è l'opengraph-image della pagina (lib/seo/og.tsx).
 * Nessuna richiesta parte finché non si tocca; niente pulsanti di terzi caricati.
 */
export function Condividi({
  percorso,
  titolo,
  testo,
  campagna,
  etichetta = "Condividi",
  compatto = false,
  piccolo = false,
}: {
  /** La pagina da condividere (es. /giochi/tabelline). */
  percorso: string;
  /** Il titolo per il foglio di condivisione e per l'oggetto dell'email. */
  titolo: string;
  /** L'invito che parte col link: breve, caldo, che fa venire voglia di aprirlo. */
  testo: string;
  /** Per contare da dove arrivano le visite: guida, gioco, attivita, test… */
  campagna: string;
  etichetta?: string;
  compatto?: boolean;
  /**
   * La pillola discreta (23/11 sera, richiesta di Giorgia): accanto ai link, non
   * invade. È per gli adulti: alta 40 px invece dei 64 della regola generale dei
   * bottoni (globals.css, pensata per i bambini), sopra il minimo WCAG di 24 px.
   */
  piccolo?: boolean;
}) {
  const [aperto, setAperto] = useState(false);
  const [copiato, setCopiato] = useState(false);
  const link = `${url(percorso)}?utm_source=condivisione&utm_medium=social&utm_campaign=${encodeURIComponent(campagna)}`;
  const tutto = `${testo}\n${link}`;

  async function condividi() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: titolo, text: testo, url: link });
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
    { nome: "Email", href: `mailto:?subject=${encodeURIComponent(titolo)}&body=${encodeURIComponent(tutto)}` },
  ];

  return (
    <div className={`flex flex-col print:hidden ${piccolo ? "gap-2" : "gap-3"}`} data-condividi={campagna}>
      <button
        type="button"
        onClick={condividi}
        aria-expanded={aperto}
        className={
          piccolo
            ? "inline-flex !min-h-10 !min-w-0 w-fit items-center gap-1.5 rounded-full border-2 border-notte/15 bg-white px-3.5 py-1.5 text-sm font-extrabold text-notte hover:border-rosa-forte hover:text-rosa-forte"
            : `inline-flex min-h-14 w-fit items-center gap-2.5 rounded-2xl bg-rosa-forte px-6 py-3 font-extrabold text-white shadow-[0_10px_24px_-14px_rgba(196,42,107,0.9)] hover:bg-notte ${compatto ? "text-base" : "text-lg"}`
        }
      >
        <svg aria-hidden viewBox="0 0 24 24" width={piccolo ? 16 : 22} height={piccolo ? 16 : 22} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        {etichetta}
      </button>
      {aperto && (
        <div className="flex flex-wrap gap-2" data-condividi-voci>
          {voci.map((v) => (
            <a
              key={v.nome}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center rounded-full border-2 border-notte/15 bg-white font-extrabold text-notte hover:border-viola ${piccolo ? "!min-h-10 !min-w-0 px-3 py-1 text-sm" : "min-h-12 px-4 py-2"}`}
            >
              {v.nome}
            </a>
          ))}
          <button
            type="button"
            onClick={copia}
            className={`inline-flex items-center rounded-full border-2 border-notte/15 bg-white font-extrabold text-notte hover:border-viola ${piccolo ? "!min-h-10 !min-w-0 px-3 py-1 text-sm" : "min-h-12 px-4 py-2"}`}
          >
            {copiato ? "Link copiato!" : "Copia il link"}
          </button>
          <p className="w-full text-sm text-notte-tenue">Su Instagram: copia il link e incollalo nella storia con lo sticker «Link».</p>
        </div>
      )}
    </div>
  );
}
