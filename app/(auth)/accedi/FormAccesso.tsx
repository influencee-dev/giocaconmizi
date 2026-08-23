"use client";

import { useState } from "react";
import { creaClientBrowser } from "@/lib/supabase/client";

type Stato =
  | { tipo: "fermo" }
  | { tipo: "invio" }
  | { tipo: "inviato" }
  | { tipo: "errore"; messaggio: string };

/**
 * Accesso passwordless via magic link (piano §4.1: niente password per i genitori).
 * I dati del bambino non si chiedono qui: solo email, per rispettare la
 * minimizzazione decisa in §2, decisione 2.
 */
export function FormAccesso() {
  const [email, setEmail] = useState("");
  const [stato, setStato] = useState<Stato>({ tipo: "fermo" });

  async function invia(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setStato({ tipo: "invio" });

    const supabase = creaClientBrowser();
    if (!supabase) {
      setStato({
        tipo: "errore",
        messaggio:
          "L'accesso non è ancora attivo su questo ambiente: mancano le chiavi Supabase.",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStato({ tipo: "errore", messaggio: error.message });
      return;
    }

    setStato({ tipo: "inviato" });
  }

  if (stato.tipo === "inviato") {
    return (
      <p className="rounded-morbido border-2 border-azzurro bg-white p-6 text-lg text-notte">
        Fatto. Ti abbiamo mandato un link a <strong>{email}</strong>: aprilo dal
        telefono o dal computer e sei dentro.
      </p>
    );
  }

  return (
    <form onSubmit={invia} className="flex flex-col gap-4">
      <label htmlFor="email" className="text-lg font-bold text-notte">
        La tua email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="mamma@esempio.it"
        className="rounded-morbido border-2 border-crema-scuro bg-white px-5 py-4 text-lg text-notte"
        style={{ minHeight: "4rem" }}
      />

      <button
        type="submit"
        disabled={stato.tipo === "invio"}
        className="rounded-bolla bg-rosa px-8 py-4 text-xl font-extrabold text-white disabled:opacity-60"
      >
        {stato.tipo === "invio" ? "Invio in corso…" : "Mandami il link"}
      </button>

      {stato.tipo === "errore" && (
        <p role="alert" className="text-lg font-bold text-arancione">
          {stato.messaggio}
        </p>
      )}
    </form>
  );
}
