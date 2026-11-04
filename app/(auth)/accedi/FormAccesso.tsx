"use client";

import { Mail, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { leggiProfilo } from "@/lib/profilo";
import { creaClientBrowser } from "@/lib/supabase/client";

type Stato =
  | { tipo: "fermo" }
  | { tipo: "invio" }
  | { tipo: "inviato" }
  | { tipo: "errore"; messaggio: string };

/** Gli errori che arrivano dal link nell'email (app/auth/callback). */
const ERRORI_LINK: Record<string, string> = {
  "link-scaduto": "Il link è scaduto o è già stato usato. Chiedine uno nuovo qui sotto: arriva in un attimo.",
  "link-non-valido": "Quel link non è completo. Chiedine uno nuovo qui sotto.",
  "supabase-non-configurato": "L'accesso è in manutenzione in questo momento. I giochi funzionano lo stesso, senza accedere.",
};

/** Le risposte di Supabase, dette come le direbbe una persona. */
function spiega(errore: { message?: string; status?: number }): string {
  const m = (errore.message ?? "").toLowerCase();
  if (errore.status === 429 || m.includes("rate limit") || m.includes("security purposes")) {
    return "Ti abbiamo appena mandato un link: aspetta un minuto e, se non arriva, riprova.";
  }
  if (m.includes("invalid") && m.includes("email")) return "Controlla l'email: sembra scritta male.";
  return "Non siamo riusciti a mandare il link. Riprova tra poco.";
}

const ATTESA = 60;

/**
 * Accesso senza password: un link via email (Supabase). Solo l'email, niente
 * dati del bimbo (minimizzazione). Se sul telefono c'è il profilo, l'email è
 * già scritta.
 */
export function FormAccesso({ errore }: { errore?: string }) {
  const [email, setEmail] = useState("");
  const [stato, setStato] = useState<Stato>(errore && ERRORI_LINK[errore] ? { tipo: "errore", messaggio: ERRORI_LINK[errore] } : { tipo: "fermo" });
  const [attesa, setAttesa] = useState(0);

  useEffect(() => {
    const p = leggiProfilo();
    if (p?.email) setEmail(p.email);
  }, []);

  useEffect(() => {
    if (attesa <= 0) return;
    const t = window.setTimeout(() => setAttesa((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [attesa]);

  async function manda() {
    setStato({ tipo: "invio" });
    const supabase = creaClientBrowser();
    if (!supabase) {
      setStato({ tipo: "errore", messaggio: ERRORI_LINK["supabase-non-configurato"] });
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setStato({ tipo: "errore", messaggio: spiega(error) });
        return;
      }
    } catch {
      setStato({ tipo: "errore", messaggio: "Non siamo riusciti a mandare il link. Controlla la connessione e riprova." });
      return;
    }
    setAttesa(ATTESA);
    setStato({ tipo: "inviato" });
  }

  if (stato.tipo === "inviato") {
    return (
      <div className="rounded-[1.5rem] bg-white p-6 shadow-[0_8px_20px_-14px_rgba(31,36,48,0.4)]" role="status" data-link-inviato>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-viola/15 text-viola">
          <Mail className="h-7 w-7" strokeWidth={2.4} aria-hidden />
        </span>
        <h2 className="mt-4 text-2xl font-black text-notte">Controlla la posta</h2>
        <p className="mt-2 text-lg text-notte">
          Ti abbiamo mandato un link a <strong className="break-words">{email}</strong>. Aprilo da questo telefono o computer e sei dentro.
        </p>
        <p className="mt-2 text-notte-tenue">Non lo trovi? Guarda in Spam o in Promozioni: a volte finisce lì.</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void manda()}
            disabled={attesa > 0}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-viola px-5 py-3 font-black text-viola disabled:border-crema-scuro disabled:text-notte-tenue"
            data-rimanda
          >
            <RotateCw className="h-5 w-5" strokeWidth={2.6} aria-hidden />
            {attesa > 0 ? `Rimanda tra ${attesa} s` : "Rimanda il link"}
          </button>
          <button type="button" onClick={() => setStato({ tipo: "fermo" })} className="rounded-2xl px-5 py-3 font-black text-notte-tenue" data-cambia-email>
            Ho sbagliato email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void manda();
      }}
      className="flex flex-col gap-4"
    >
      <label htmlFor="email" className="text-lg font-extrabold text-notte">
        La tua email
      </label>
      <input
        id="email"
        type="email"
        inputMode="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="mamma@esempio.it"
        className="w-full min-w-0 rounded-[1.1rem] border-[2.5px] border-viola bg-white px-4 py-3.5 text-lg font-bold text-notte"
      />

      <label className="flex items-start gap-3 text-notte">
        <input type="checkbox" required className="mt-0.5 h-6 w-6 shrink-0 accent-[#9B6DD6]" />
        <span className="font-semibold">
          Ho almeno 18 anni e ho letto{" "}
          <a href="/privacy" target="_blank" rel="noopener" className="font-bold text-viola underline underline-offset-4">
            come trattiamo i dati
          </a>
          .
        </span>
      </label>

      {stato.tipo === "errore" && (
        <p role="alert" className="rounded-2xl bg-arancione/15 px-4 py-3 font-bold text-notte">
          {stato.messaggio}
        </p>
      )}

      <button
        type="submit"
        disabled={stato.tipo === "invio"}
        className="rounded-[1.4rem] bg-viola py-4 text-xl font-black text-white shadow-[0_12px_28px_-10px_rgba(155,109,214,0.9)] disabled:opacity-60"
      >
        {stato.tipo === "invio" ? "Invio in corso…" : "Mandami il link"}
      </button>
    </form>
  );
}
