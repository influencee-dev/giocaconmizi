"use client";

import { useState } from "react";
import { LINK_CANALE, MESSAGGIO_PASSAPAROLA } from "@/lib/email/serie-benvenuto";

/**
 * I tasti della pagina /passaparola (27/11/2026). Il bottone WhatsApp della
 * terza email di benvenuto apriva WhatsApp e si fermava lì: il link wa.me senza
 * numero, passato dal contatore dei clic di Brevo e dal browser dell'app di
 * posta, non arriva alla scelta della chat. Ora l'email porta qui, e da una
 * pagina vera il telefono apre il suo foglio di condivisione con il messaggio
 * già scritto (WhatsApp, gruppo della classe, Messenger…).
 */
const LINK = "https://giocamizi.it/?utm_source=passaparola&utm_medium=social&utm_campaign=benvenuto-3";
const TESTO = MESSAGGIO_PASSAPAROLA.replace("https://giocamizi.it", "").trim();
const TUTTO = `${TESTO} ${LINK}`;

export function Passaparola() {
  const [copiato, setCopiato] = useState(false);

  async function condividi() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Giocamizi", text: TESTO, url: LINK });
        return;
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    window.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(TUTTO)}`;
  }

  async function copia() {
    try {
      await navigator.clipboard.writeText(TUTTO);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2500);
    } catch {
      setCopiato(false);
    }
  }

  return (
    <div className="flex flex-col gap-4" data-passaparola>
      <button
        type="button"
        onClick={condividi}
        className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-rosa-forte px-6 py-3 text-lg font-extrabold text-white hover:bg-notte sm:w-fit"
        data-passaparola-condividi
      >
        Mandalo a un&apos;amica
      </button>
      <blockquote className="rounded-2xl border-2 border-crema-scuro bg-white p-4 text-base text-notte">
        {TESTO} <span className="font-bold text-viola-forte">giocamizi.it</span>
      </blockquote>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(TUTTO)}`}
          className="inline-flex min-h-12 items-center rounded-full border-2 border-notte/15 bg-white px-4 py-2 font-extrabold text-notte hover:border-viola"
          data-passaparola-whatsapp
        >
          WhatsApp
        </a>
        <button
          type="button"
          onClick={copia}
          className="inline-flex min-h-12 items-center rounded-full border-2 border-notte/15 bg-white px-4 py-2 font-extrabold text-notte hover:border-viola"
        >
          {copiato ? "Messaggio copiato!" : "Copia il messaggio"}
        </button>
        <a
          href={LINK_CANALE}
          className="inline-flex min-h-12 items-center rounded-full border-2 border-notte/15 bg-white px-4 py-2 font-extrabold text-notte hover:border-viola"
        >
          Il canale delle mamme su Instagram
        </a>
      </div>
    </div>
  );
}
