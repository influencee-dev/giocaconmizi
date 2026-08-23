"use client";

import { useState } from "react";

/**
 * Il form dei genitori (piano §11 e §2, decisione 1).
 *
 * Regole che il piano fissa e che questo componente rispetta:
 * - nessun dato del bambino oltre alla fascia d'età; nessun nome del bambino
 * - solo l'email è obbligatoria; tutto il resto è facoltativo e lo si dice
 * - consenso esplicito, non spuntato in partenza (GDPR art. 8)
 * - non blocca niente: i giochi restano liberi anche se non lo si compila
 */

export type Origine = "dopo-il-gioco" | "footer" | "biglietti" | "pdf";

type Stato = { tipo: "fermo" } | { tipo: "invio" } | { tipo: "fatto" } | { tipo: "errore"; messaggio: string };

export function FormGenitore({
  origine,
  titolo,
  sottotitolo,
  onChiudi,
}: {
  origine: Origine;
  titolo: string;
  sottotitolo: string;
  onChiudi?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [citta, setCitta] = useState("");
  const [professione, setProfessione] = useState("");
  const [etaFiglio, setEtaFiglio] = useState("");
  const [consenso, setConsenso] = useState(false);
  const [stato, setStato] = useState<Stato>({ tipo: "fermo" });

  async function invia(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!consenso) {
      setStato({ tipo: "errore", messaggio: "Serve la spunta sul consenso per poterti scrivere." });
      return;
    }

    setStato({ tipo: "invio" });

    const risposta = await fetch("/api/brevo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        azione: "contatto",
        email,
        nomeGenitore: nome || undefined,
        citta: citta || undefined,
        professione: professione || undefined,
        etaFiglio: etaFiglio ? Number(etaFiglio) : undefined,
        origine,
        consenso,
      }),
    }).catch(() => null);

    if (!risposta?.ok) {
      setStato({
        tipo: "errore",
        messaggio: "Non siamo riusciti a registrare la mail. Riprova più tardi.",
      });
      return;
    }

    setStato({ tipo: "fatto" });
  }

  if (stato.tipo === "fatto") {
    return (
      <div className="rounded-morbido border-2 border-verde bg-white p-6">
        <p className="text-lg font-bold text-notte">Fatto, grazie.</p>
        <p className="mt-2 text-notte-tenue">
          Ti scriveremo solo quando c&apos;è qualcosa di nuovo che vale la pena
          guardare. Puoi cancellarti da ogni email con un clic.
        </p>
        {onChiudi && (
          <button
            type="button"
            onClick={onChiudi}
            className="mt-4 rounded-bolla bg-viola px-6 py-3 font-bold text-white"
          >
            Torna a giocare
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={invia} className="flex flex-col gap-4 rounded-morbido border-2 border-crema-scuro bg-white p-6">
      <div>
        <p className="text-xl font-extrabold text-notte">{titolo}</p>
        <p className="mt-1 text-notte-tenue">{sottotitolo}</p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="font-bold text-notte">La tua email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mamma@esempio.it"
          className="rounded-morbido border-2 border-crema-scuro px-4 py-3 text-lg text-notte"
          style={{ minHeight: "3.25rem" }}
        />
      </label>

      <details className="text-notte-tenue">
        <summary className="cursor-pointer font-bold">
          Vuoi dirci qualcosa in più? (facoltativo)
        </summary>
        <div className="mt-3 flex flex-col gap-3">
          <Campo etichetta="Come ti chiami" valore={nome} onCambia={setNome} />
          <Campo etichetta="Città" valore={citta} onCambia={setCitta} />
          <Campo
            etichetta="Che lavoro fai"
            valore={professione}
            onCambia={setProfessione}
            aiuto="Se sei insegnante te lo scriviamo: riceverai le cose per la classe."
          />
          <label className="flex flex-col gap-1">
            <span className="font-bold text-notte">Quanti anni ha tuo figlio</span>
            <select
              value={etaFiglio}
              onChange={(e) => setEtaFiglio(e.target.value)}
              className="rounded-morbido border-2 border-crema-scuro bg-white px-4 py-3 text-lg text-notte"
              style={{ minHeight: "3.25rem" }}
            >
              <option value="">Preferisco non dirlo</option>
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((a) => (
                <option key={a} value={a}>
                  {a} anni
                </option>
              ))}
            </select>
            <span className="text-sm text-notte-tenue">
              Chiediamo solo l&apos;età, mai il nome del bambino.
            </span>
          </label>
        </div>
      </details>

      <label className="flex items-start gap-3 text-notte">
        <input
          type="checkbox"
          checked={consenso}
          onChange={(e) => setConsenso(e.target.checked)}
          className="mt-1 h-6 w-6 shrink-0 accent-[#9B6DD6]"
        />
        <span>
          Acconsento a ricevere email da Gioca con Mizi e ho letto come trattiamo
          i dati. Posso cancellarmi quando voglio.
        </span>
      </label>

      {stato.tipo === "errore" && (
        <p role="alert" className="font-bold text-arancione">
          {stato.messaggio}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={stato.tipo === "invio"}
          className="rounded-bolla bg-rosa px-8 py-4 text-lg font-extrabold text-white disabled:opacity-60"
        >
          {stato.tipo === "invio" ? "Un attimo…" : "Va bene"}
        </button>
        {onChiudi && (
          <button
            type="button"
            onClick={onChiudi}
            className="rounded-bolla border-2 border-crema-scuro bg-white px-6 py-4 font-bold text-notte-tenue"
          >
            No, grazie
          </button>
        )}
      </div>
    </form>
  );
}

function Campo({
  etichetta,
  valore,
  onCambia,
  aiuto,
}: {
  etichetta: string;
  valore: string;
  onCambia: (v: string) => void;
  aiuto?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-bold text-notte">{etichetta}</span>
      <input
        type="text"
        value={valore}
        onChange={(e) => onCambia(e.target.value)}
        className="rounded-morbido border-2 border-crema-scuro px-4 py-3 text-lg text-notte"
        style={{ minHeight: "3.25rem" }}
      />
      {aiuto && <span className="text-sm text-notte-tenue">{aiuto}</span>}
    </label>
  );
}
