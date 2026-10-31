"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { rispondi, type Esito } from "./azioni";

type Scelta = "approva" | "modifica" | "rimuovi";

interface Valori {
  descrizione: string;
  indirizzo: string;
  sito: string;
  instagram: string;
}

const SCELTE: { id: Scelta; titolo: string; testo: string }[] = [
  { id: "approva", titolo: "Approvo", testo: "La scheda va bene così: la pubblichiamo come verificata." },
  { id: "modifica", titolo: "Voglio modificarla", testo: "Aggiungo WhatsApp, telefono, orari, pacchetti festa, video…" },
  { id: "rimuovi", titolo: "Non voglio comparire", testo: "Togliamo la scheda dal sito, senza domande." },
];

function Campo({ nome, etichetta, valore, aiuto, area, tipo = "text" }: { nome: string; etichetta: string; valore?: string; aiuto?: string; area?: boolean; tipo?: string }) {
  const classe = "w-full rounded-xl border-2 border-crema-scuro bg-white px-4 py-3 text-base text-notte";
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-extrabold text-notte">{etichetta}</span>
      {area ? (
        <textarea name={nome} defaultValue={valore} rows={4} className={classe} />
      ) : (
        <input name={nome} type={tipo} defaultValue={valore} className={classe} />
      )}
      {aiuto && <span className="text-xs font-semibold text-notte-tenue">{aiuto}</span>}
    </label>
  );
}

export function ModuloRisposta({ codice, valori, nome }: { codice: string; valori: Valori; nome: string }) {
  const [scelta, setScelta] = useState<Scelta | null>(null);
  const [esito, invia, inviando] = useActionState<Esito, FormData>(rispondi, { stato: "fermo" });
  const [inTransizione, avvia] = useTransition();
  const inCorso = inviando || inTransizione;

  if (esito.stato === "ok") {
    return (
      <div className="rounded-morbido border-2 border-verde bg-white p-6">
        <p className="text-xl font-extrabold text-notte">Grazie, risposta ricevuta!</p>
        <p className="mt-2 text-notte-tenue">
          {esito.tipo === "rimuovi"
            ? `Togliamo ${nome} dal sito entro 48 ore e ti scriviamo per conferma.`
            : `Controlliamo e pubblichiamo entro 48 ore: ${nome} comparirà con il bollino «Verificata dal titolare». Ti scriviamo quando è online.`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {SCELTE.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScelta(s.id)}
            aria-pressed={scelta === s.id}
            className={`flex flex-col gap-1 rounded-morbido border-2 p-4 text-left transition-colors ${scelta === s.id ? "border-viola bg-viola/10" : "border-crema-scuro bg-white hover:border-viola"}`}
          >
            <span className="text-lg font-extrabold text-notte">{s.titolo}</span>
            <span className="text-sm font-semibold text-notte-tenue">{s.testo}</span>
          </button>
        ))}
      </div>

      {scelta && (
        <form
          // onSubmit e non action={}: con action React svuota il modulo a ogni
          // invio, e dopo un errore il titolare dovrebbe riscrivere tutto.
          onSubmit={(e) => {
            e.preventDefault();
            const dati = new FormData(e.currentTarget);
            avvia(() => invia(dati));
          }}
          className="flex flex-col gap-4 rounded-[1.4rem] border border-notte/10 bg-white p-5"
        >
          <input type="hidden" name="codice" value={codice} />
          <input type="hidden" name="tipo" value={scelta} />

          {scelta === "modifica" && (
            <>
              <p className="font-extrabold text-notte">I dati della scheda</p>
              <p className="-mt-2 text-sm font-semibold text-notte-tenue">
                Più la scheda è completa, più le famiglie vi contattano: WhatsApp e pacchetti festa sono i dati che cercano di più.
              </p>
              <Campo nome="descrizione" etichetta="Descrizione" valore={valori.descrizione} area aiuto="Cosa offrite, per che età, cosa rende speciale il posto." />
              <Campo nome="indirizzo" etichetta="Indirizzo" valore={valori.indirizzo} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo nome="whatsapp" etichetta="WhatsApp" tipo="tel" aiuto="Diventa il bottone «Scrivi su WhatsApp» della scheda." />
                <Campo nome="telefono" etichetta="Telefono" tipo="tel" />
                <Campo nome="sito" etichetta="Sito" valore={valori.sito} tipo="url" />
                <Campo nome="instagram" etichetta="Instagram" valore={valori.instagram} tipo="url" />
                <Campo nome="facebook" etichetta="Facebook" tipo="url" />
                <Campo nome="tiktok" etichetta="TikTok" tipo="url" />
              </div>
              <Campo nome="video" etichetta="Video della struttura" tipo="url" aiuto="Link di un video YouTube, Instagram o TikTok." />
              <Campo nome="orari" etichetta="Orari" area aiuto="Esempio: lun–ven 16–19, sabato e domenica 10–20." />
              <Campo nome="pacchetti" etichetta="Pacchetti festa e prezzi" area aiuto="Durata, cosa è incluso, prezzo a bambino o a forfait." />
              <p className="rounded-xl bg-crema px-4 py-3 text-sm font-bold text-notte">
                Le foto: rispondete pure all&apos;email con 3–15 foto della struttura, le carichiamo noi. Presto potrete farlo dalla vostra area.
              </p>
            </>
          )}

          {scelta === "rimuovi" && <Campo nome="motivo" etichetta="Vuoi dirci perché? (facoltativo)" area />}

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo nome="referente" etichetta="Il tuo nome" />
            <Campo nome="email" etichetta="La tua email" tipo="email" aiuto="Ti scriviamo qui quando la scheda è online." />
          </div>

          {scelta !== "rimuovi" && (
            <label className="flex items-start gap-3 text-sm font-semibold text-notte">
              <input type="checkbox" name="termini" value="si" className="mt-0.5 h-5 w-5 shrink-0 accent-[#9B6DD6]" />
              <span>
                Accetto i{" "}
                <Link href="/termini-attivita" target="_blank" className="font-extrabold text-viola underline">
                  termini e condizioni per le attività
                </Link>{" "}
                e confermo di poter rappresentare {nome}.
              </span>
            </label>
          )}

          {esito.stato === "errore" && (
            <p role="alert" className="rounded-xl bg-rosso/10 px-4 py-3 text-sm font-bold text-rosso">{esito.messaggio}</p>
          )}

          <button type="submit" disabled={inCorso} className="self-start rounded-2xl bg-viola px-6 py-3 font-extrabold text-white disabled:opacity-60">
            {inCorso ? "Invio…" : scelta === "rimuovi" ? "Toglietela dal sito" : scelta === "approva" ? "Approvo la scheda" : "Invia le modifiche"}
          </button>
        </form>
      )}
    </div>
  );
}
