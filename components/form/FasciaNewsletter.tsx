"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { MiziIntero } from "@/components/illustrazioni";

/**
 * La fascia newsletter «La posta di Mizi», prima del piè di pagina in tutto il
 * sito. Deve far venire voglia di iscriversi senza trucchi: vantaggi concreti,
 * numeri veri del sito, un campo solo obbligatorio (l'email), consenso NON
 * spuntato in partenza, nessuna frase che colpevolizza chi non si iscrive.
 * Doppio opt-in: Brevo manda l'email di conferma (lib/brevo.ts).
 *
 * Non compare dove disturba: dentro un gioco, nel pannello, nelle pagine di
 * servizio e subito dopo l'iscrizione.
 */

const NASCOSTA = [/^\/giochi\/[^/]+\/gioca/, /^\/admin\//, /^\/la-tua-scheda\//, /^\/iscrizione-confermata/, /^\/accedi/, /^\/biglietti\/vedi/];

type Stato = "fermo" | "invio" | "fatto" | "errore";

export function FasciaNewsletter({ giochi, guide, citta }: { giochi: number; guide: number; citta: number }) {
  const percorso = usePathname() ?? "/";
  const [email, setEmail] = useState("");
  const [eta, setEta] = useState<number | null>(null);
  const [consenso, setConsenso] = useState(false);
  const [trappola, setTrappola] = useState("");
  const [stato, setStato] = useState<Stato>("fermo");
  const [avviso, setAvviso] = useState("");

  if (NASCOSTA.some((r) => r.test(percorso))) return null;

  const VANTAGGI = [
    ["🎮", "Il gioco nuovo della settimana", "pronto da aprire, con l'età giusta scritta sopra"],
    ["📖", "Una guida pratica in 3 minuti", "compiti, lettura, emozioni: cosa fare stasera"],
    ["🎂", "Idee per il prossimo compleanno", "inviti gratis e posti per festeggiare nella tua città"],
    ["💜", "Zero pubblicità, mai", "ti cancelli con un clic, quando vuoi"],
  ] as const;

  async function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consenso) {
      setAvviso("Manca solo la spunta qui sopra: senza non possiamo scriverti.");
      setStato("errore");
      return;
    }
    setStato("invio");
    const r = await fetch("/api/brevo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        azione: "contatto",
        email,
        etaFiglio: eta ?? undefined,
        origine: "fascia-newsletter",
        consenso,
        maggiorenne: consenso,
        sito: trappola,
      }),
    }).catch(() => null);
    if (!r?.ok) {
      setAvviso("Non siamo riusciti a registrare la mail. Riprova tra poco.");
      setStato("errore");
      return;
    }
    setStato("fatto");
  }

  return (
    <section id="newsletter" aria-labelledby="titolo-newsletter" className="mx-auto mt-20 max-w-6xl px-4 sm:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-notte text-white">
        {/* Luci di colore sullo sfondo, come i cerchi della fascia finale. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(155,109,214,0.55)_0_16rem,transparent_16.1rem),radial-gradient(circle_at_100%_100%,rgba(242,138,178,0.35)_0_14rem,transparent_14.1rem),radial-gradient(circle_at_70%_-10%,rgba(249,200,70,0.25)_0_9rem,transparent_9.1rem)]"
        />
        <div className="relative grid gap-8 p-5 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-14">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-lg">
                <MiziIntero className="h-full w-auto" />
              </span>
              <span className="rounded-full bg-giallo px-3.5 py-1 text-xs font-black uppercase tracking-wide text-notte">
                La posta di Mizi
              </span>
            </div>
            <h2 id="titolo-newsletter" className="text-[2rem] font-black leading-[1.05] tracking-tight sm:text-5xl">
              Ogni settimana, un gioco nuovo arriva da te.
            </h2>
            <p className="text-lg text-white/80">
              Una sola email a settimana, scritta da una mamma: cose che si usano subito, il pomeriggio stesso.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {VANTAGGI.map(([icona, titolo, testo]) => (
                <li key={titolo} className="flex gap-3 rounded-2xl bg-white/10 p-3 sm:p-3.5">
                  <span aria-hidden className="text-2xl leading-none">
                    {icona}
                  </span>
                  <span>
                    <span className="block font-extrabold">{titolo}</span>
                    <span className="hidden text-sm text-white/70 sm:block">{testo}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm font-bold text-white/70">
              Già online: {giochi} giochi · {guide} guide · feste in {citta} città
            </p>
          </div>

          {stato === "fatto" ? (
            <div className="flex flex-col justify-center gap-4 rounded-[1.6rem] bg-white p-6 text-notte sm:p-8" role="status">
              <span className="text-5xl" aria-hidden>
                📬
              </span>
              <p className="text-2xl font-black">Quasi fatto: apri la tua email!</p>
              <p className="text-notte-tenue">
                Ti abbiamo scritto adesso. Tocca il bottone «Confermo l&apos;iscrizione» e la prima posta di Mizi arriva con il
                prossimo invio. Se non la vedi, guarda nella posta indesiderata o in «Promozioni».
              </p>
            </div>
          ) : (
            <form onSubmit={invia} className="flex min-w-0 flex-col gap-4 rounded-[1.6rem] bg-white p-5 text-notte sm:p-8">
              <label className="flex flex-col gap-1.5">
                <span className="font-extrabold">La tua email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@esempio.it"
                  className="w-full min-w-0 rounded-2xl border-2 border-crema-scuro px-4 py-3.5 text-lg"
                />
              </label>

              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 font-extrabold">
                  Quanti anni ha tuo figlio? <span className="font-bold text-notte-tenue">(facoltativo)</span>
                </legend>
                <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={eta === a}
                      onClick={() => setEta(eta === a ? null : a)}
                      style={{ minWidth: 0, minHeight: 0 }}
                      className={`h-11 w-full rounded-xl border-2 font-extrabold ${
                        eta === a ? "border-viola bg-viola text-white" : "border-crema-scuro bg-white text-notte"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-notte-tenue">Così ti mandiamo i giochi giusti. Mai il nome del bambino.</span>
              </fieldset>

              {/* Campo trappola per i bot: nascosto a persone e lettori di schermo. */}
              <input
                type="text"
                name="sito"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={trappola}
                onChange={(e) => setTrappola(e.target.value)}
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={consenso}
                  onChange={(e) => setConsenso(e.target.checked)}
                  className="mt-0.5 h-6 w-6 shrink-0 accent-[#9B6DD6]"
                />
                <span>
                  Ho almeno 18 anni e voglio ricevere la posta di Mizi. Ho letto{" "}
                  <a href="/privacy" target="_blank" rel="noopener" className="font-bold text-viola underline underline-offset-4">
                    come trattiamo i dati
                  </a>
                  .
                </span>
              </label>

              {stato === "errore" && (
                <p role="alert" className="font-bold text-arancione">
                  {avviso}
                </p>
              )}

              <button
                type="submit"
                disabled={stato === "invio"}
                className="flex items-center justify-center gap-2 rounded-2xl bg-viola px-6 py-4 text-lg font-black text-white shadow-[0_10px_24px_-8px_rgba(155,109,214,0.8)] transition-colors hover:bg-notte disabled:opacity-60"
              >
                {stato === "invio" ? "Un attimo…" : "Sì, voglio la posta di Mizi"}
              </button>
              <p className="text-center text-sm text-notte-tenue">Gratis · 1 email a settimana · ti cancelli con un clic</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
