"use client";

import Link from "next/link";
import { useState } from "react";
import { PERCORSO } from "@/lib/famiglia/sotto-pressione";

/**
 * Il passaggio tra l'ultima domanda del test «sotto pressione» e il profilo
 * (decisione di Giorgia del 23/11/2026: il test porta iscritti alla Posta di
 * Mizi). Chi compila lascia nome, cognome, email, fascia d'età, città ed età
 * del figlio, e si iscrive con doppia conferma via email (Brevo, origine
 * «test-sotto-pressione»). Al server va SOLO questo modulo: le risposte del
 * test e il profilo restano nel browser.
 *
 * Se il server non risponde (Brevo giù, rete assente) il profilo si apre lo
 * stesso: chi ha risposto a 45 domande non resta chiuso fuori per un guasto nostro.
 */

const CHIAVE_SBLOCCO = `${PERCORSO.chiave}-dati`;

/** Il modulo è già stato inviato in questa scheda: il profilo si apre subito. */
export function sbloccato(): boolean {
  try {
    return sessionStorage.getItem(CHIAVE_SBLOCCO) === "1";
  } catch {
    return false;
  }
}

function sblocca() {
  try {
    sessionStorage.setItem(CHIAVE_SBLOCCO, "1");
  } catch {
    // navigazione privata: il profilo si apre comunque in questa visita
  }
}

export const FASCE_ETA = ["18–24 anni", "25–34 anni", "35–44 anni", "45–54 anni", "55 anni o più"] as const;

const ETA_FIGLIO: { valore: number; testo: string }[] = [
  { valore: 0, testo: "Meno di 1 anno" },
  ...Array.from({ length: 12 }, (_, i) => ({ valore: i + 1, testo: i === 0 ? "1 anno" : `${i + 1} anni` })),
  { valore: 13, testo: "13 anni o più" },
];

type Stato = { tipo: "fermo" } | { tipo: "invio" } | { tipo: "errore"; messaggio: string };

export function ModuloDati({ onFatto }: { onFatto: () => void }) {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [fascia, setFascia] = useState("");
  const [citta, setCitta] = useState("");
  const [etaFiglio, setEtaFiglio] = useState("");
  const [consenso, setConsenso] = useState(false);
  const [trappola, setTrappola] = useState("");
  const [stato, setStato] = useState<Stato>({ tipo: "fermo" });

  async function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consenso) {
      setStato({ tipo: "errore", messaggio: "Serve la spunta per iscriverti e vedere il profilo." });
      return;
    }
    setStato({ tipo: "invio" });
    const risposta = await fetch("/api/brevo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        azione: "contatto",
        email,
        nomeGenitore: nome,
        cognome,
        etaGenitore: fascia,
        citta,
        etaFiglio: Number(etaFiglio),
        origine: "test-sotto-pressione",
        consenso,
        // la spunta dichiara anche la maggiore età (testo qui sotto), e la fascia parte da 18
        maggiorenne: consenso,
        sito: trappola,
      }),
    }).catch(() => null);

    // 400 = dato sbagliato (di solito l'email): si corregge e si riprova
    if (risposta?.status === 400) {
      setStato({ tipo: "errore", messaggio: "Controlla l'email: sembra scritta male." });
      return;
    }
    // ok, oppure guasto nostro: il profilo si apre in ogni caso
    sblocca();
    onFatto();
  }

  const campo = "rounded-2xl border-2 border-crema-scuro bg-white px-4 py-3 text-lg text-notte min-h-14 w-full";

  return (
    <form onSubmit={invia} className="flex flex-col gap-5" data-modulo-dati>
      <div>
        <p className="text-sm font-extrabold uppercase tracking-wide text-viola-forte">Hai finito le 45 domande</p>
        <h2 className="mt-1 text-2xl font-extrabold text-notte sm:text-3xl">Il tuo profilo è pronto. Ci dici chi sei?</h2>
        <p className="mt-2 text-lg text-notte-tenue">
          Lascia i tuoi dati e ti iscrivi alla Posta di Mizi: idee per i genitori, giochi nuovi e guide pratiche, gratis. Il profilo lo
          vedi subito qui sotto. Le tue risposte al test non ci arrivano: restano su questo telefono.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Voce etichetta="Nome">
          <input name="nome" required autoComplete="given-name" value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
        </Voce>
        <Voce etichetta="Cognome">
          <input name="cognome" required autoComplete="family-name" value={cognome} onChange={(e) => setCognome(e.target.value)} className={campo} />
        </Voce>
        <Voce etichetta="Email">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@esempio.it"
            className={campo}
          />
        </Voce>
        <Voce etichetta="Quanti anni hai">
          <select name="eta" required value={fascia} onChange={(e) => setFascia(e.target.value)} className={campo}>
            <option value="" disabled>
              Scegli
            </option>
            {FASCE_ETA.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Voce>
        <Voce etichetta="In che città vivi">
          <input name="citta" required autoComplete="address-level2" value={citta} onChange={(e) => setCitta(e.target.value)} className={campo} />
        </Voce>
        <Voce etichetta="Quanti anni ha tuo figlio o tua figlia" aiuto="Se sono più di uno, il più piccolo.">
          <select name="etaFiglio" required value={etaFiglio} onChange={(e) => setEtaFiglio(e.target.value)} className={campo}>
            <option value="" disabled>
              Scegli
            </option>
            {ETA_FIGLIO.map((o) => (
              <option key={o.valore} value={o.valore}>
                {o.testo}
              </option>
            ))}
          </select>
        </Voce>
      </div>

      {/* campo trappola per i bot: invisibile alle persone */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={trappola}
        onChange={(e) => setTrappola(e.target.value)}
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      <label className="flex items-start gap-3 text-base text-notte-tenue">
        <input
          type="checkbox"
          name="consenso"
          checked={consenso}
          onChange={(e) => setConsenso(e.target.checked)}
          className="mt-1 h-6 w-6 shrink-0 accent-[var(--color-viola)]"
        />
        <span>
          Ho almeno 18 anni e voglio ricevere la Posta di Mizi. Ho letto la{" "}
          <Link href="/privacy" className="font-bold text-viola-forte underline underline-offset-4">
            privacy
          </Link>
          : posso cancellarmi con un clic da ogni email.
        </span>
      </label>

      {stato.tipo === "errore" && (
        <p role="alert" className="rounded-2xl bg-rosa/15 p-3 font-bold text-notte">
          {stato.messaggio}
        </p>
      )}

      <button
        type="submit"
        disabled={stato.tipo === "invio"}
        data-vedi-profilo
        className="min-h-14 rounded-2xl bg-viola-forte px-6 py-4 text-lg font-extrabold text-white hover:bg-notte disabled:opacity-60"
      >
        {stato.tipo === "invio" ? "Un attimo…" : "Vedi il mio profilo"}
      </button>
      <p className="text-sm text-notte-tenue">
        Ti mandiamo un&apos;email con il bottone «Confermo l&apos;iscrizione»: finché non lo tocchi non ti scriviamo nient&apos;altro.
      </p>
    </form>
  );
}

function Voce({ etichetta, aiuto, children }: { etichetta: string; aiuto?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-extrabold text-notte">{etichetta}</span>
      {children}
      {aiuto && <span className="text-sm text-notte-tenue">{aiuto}</span>}
    </label>
  );
}
