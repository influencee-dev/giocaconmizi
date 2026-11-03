"use client";

import { ChevronLeft, Lock, Plus, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  appInstallata,
  CHIAVE_RIMANDATO,
  ETA,
  EVENTO_APRI_BENVENUTO,
  iscriviPosta,
  leggiProfilo,
  salvaProfilo,
  type Bimbo,
} from "@/lib/profilo";

/**
 * Il benvenuto a tutto schermo del telefono (le schermate di Figma, pagina
 * «App mobile»): Mizi saluta, poi tre passi, uno alla volta, nome della mamma,
 * nome ed età del bimbo, email. I dati restano sul telefono (lib/profilo.ts).
 *
 * Quando compare:
 * - solo sotto i 768 px e solo se non c'è ancora un profilo;
 * - nell'app installata è obbligatorio; sul sito si chiude con «Più tardi»
 *   e torna dopo 7 giorni;
 * - chi arriva da un motore di ricerca lo vede dalla seconda pagina, non
 *   sopra la pagina che ha cercato (Google penalizza le schermate che coprono
 *   il risultato appena aperto); i robot e i browser automatici non lo vedono;
 * - mai sull'invito ricevuto, nelle pagine legali, nel pannello, nei giochi.
 * Dalla seconda apertura dell'app installata: «Bentornata, …!» per un attimo.
 */

const MAI = [/^\/biglietti\/vedi/, /^\/admin/, /^\/la-tua-scheda\//, /^\/(privacy|cookie|note-legali|termini-attivita)/, /^\/accedi/, /^\/auth/, /^\/giochi\/[^/]+\/gioca/, /^\/iscrizione-confermata/];
const SETTE_GIORNI = 7 * 24 * 60 * 60 * 1000;
const CHIAVE_PAGINE = "giocamizi-pagine-visita";
const ROBOT = /bot|crawl|spider|slurp|lighthouse|inspectiontool|headless|preview/i;
const MOTORI = /(google|bing|yahoo|duckduckgo|ecosia|qwant|yandex|baidu)\./i;

type Passo = 0 | 1 | 2 | 3;

function rimandatoDaPoco(): boolean {
  try {
    const t = Number(window.localStorage.getItem(CHIAVE_RIMANDATO) ?? 0);
    return Date.now() - t < SETTE_GIORNI;
  } catch {
    return false;
  }
}

/** Pagine viste in questa visita (sessionStorage): la prima da Google resta libera. */
function contaPagina(): number {
  try {
    const n = Number(window.sessionStorage.getItem(CHIAVE_PAGINE) ?? 0) + 1;
    window.sessionStorage.setItem(CHIAVE_PAGINE, String(n));
    return n;
  } catch {
    return 2;
  }
}

export function Benvenuto() {
  const percorso = usePathname() ?? "/";
  const [aperto, setAperto] = useState(false);
  const [obbligatorio, setObbligatorio] = useState(false);
  const [bentornata, setBentornata] = useState<string | null>(null);
  const [passo, setPasso] = useState<Passo>(0);
  const [mamma, setMamma] = useState("");
  const [bimbi, setBimbi] = useState<Bimbo[]>([{ nome: "", eta: 0 }]);
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [posta, setPosta] = useState(false);
  const [avviso, setAvviso] = useState("");
  const [invio, setInvio] = useState(false);
  const daMotore = useRef(false);
  const campo = useRef<HTMLInputElement>(null);

  // Una volta per visita: da dove arriva, è l'app installata, è un robot?
  useEffect(() => {
    daMotore.current = MOTORI.test(document.referrer);
    const installata = appInstallata();
    setObbligatorio(installata);
    const p = leggiProfilo();
    if (p && installata) {
      try {
        if (!window.sessionStorage.getItem("giocamizi-bentornata")) {
          window.sessionStorage.setItem("giocamizi-bentornata", "1");
          setBentornata(p.mamma);
          window.setTimeout(() => setBentornata(null), 1400);
        }
      } catch {
        /* niente saluto, si entra e basta */
      }
    }
    const apri = () => {
      setPasso(1);
      setAperto(true);
    };
    window.addEventListener(EVENTO_APRI_BENVENUTO, apri);
    return () => window.removeEventListener(EVENTO_APRI_BENVENUTO, apri);
  }, []);

  // A ogni pagina: è il momento di proporlo?
  useEffect(() => {
    const pagine = contaPagina();
    if (aperto) return;
    const telefono = window.matchMedia("(max-width: 767px)").matches;
    const automatico = navigator.webdriver || ROBOT.test(navigator.userAgent);
    if (!telefono || automatico || leggiProfilo() || MAI.some((r) => r.test(percorso))) return;
    if (!appInstallata() && (rimandatoDaPoco() || (daMotore.current && pagine < 2))) return;
    setPasso(0);
    setAperto(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percorso]);

  // Il campo del passo prende il fuoco (tastiera pronta).
  useEffect(() => {
    if (aperto && passo > 0) window.setTimeout(() => campo.current?.focus(), 250);
  }, [aperto, passo]);

  // Sotto il benvenuto la pagina non scorre.
  useEffect(() => {
    if (!aperto) return;
    const prima = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prima;
    };
  }, [aperto]);

  if (bentornata && !aperto) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-viola px-6 text-center text-white md:hidden" role="status" data-bentornata>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mizi/mizi-intera.webp" alt="" width={200} height={253} className="h-56 w-auto animate-bounce" />
        <p className="text-3xl font-black">Bentornata, {bentornata}!</p>
      </div>
    );
  }
  if (!aperto) return null;

  const rimanda = () => {
    try {
      window.localStorage.setItem(CHIAVE_RIMANDATO, String(Date.now()));
    } catch {
      /* tornerà alla prossima visita */
    }
    setAperto(false);
  };

  const avanti = async () => {
    setAvviso("");
    if (passo === 1) {
      if (!mamma.trim()) return setAvviso("Scrivi il tuo nome, anche solo quello di battesimo.");
      return setPasso(2);
    }
    if (passo === 2) {
      if (bimbi.some((b) => !b.nome.trim())) return setAvviso("Manca il nome del bimbo.");
      if (bimbi.some((b) => !b.eta)) return setAvviso("Tocca l'età del bimbo.");
      return setPasso(3);
    }
    if (passo === 3) {
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) return setAvviso("Controlla l'email: sembra incompleta.");
      if (!privacy) return setAvviso("Manca la spunta sulla privacy.");
      setInvio(true);
      let postaAttiva = false;
      if (posta) postaAttiva = await iscriviPosta(email.trim(), bimbi[0]?.eta);
      salvaProfilo({
        mamma: mamma.trim(),
        bimbi: bimbi.map((b) => ({ nome: b.nome.trim(), eta: b.eta })),
        attivo: 0,
        email: email.trim().toLowerCase(),
        posta: postaAttiva,
        creato: new Date().toISOString(),
      });
      setInvio(false);
      setAperto(false);
    }
  };

  const indietro = () => setPasso((p) => (p > 0 ? ((p - 1) as Passo) : p));
  const mettiBimbo = (i: number, b: Partial<Bimbo>) => setBimbi((l) => l.map((x, j) => (j === i ? { ...x, ...b } : x)));

  // ---- Passo 0: il benvenuto viola ----
  if (passo === 0) {
    return (
      <div role="dialog" aria-modal="true" aria-labelledby="benvenuto-titolo" className="fixed inset-0 z-[60] overflow-y-auto bg-viola text-white md:hidden" data-benvenuto>
        <span aria-hidden className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-giallo/35" />
        <span aria-hidden className="absolute -left-12 top-[58%] h-36 w-36 rounded-full bg-rosa/45" />
        <span aria-hidden className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-white/10" />
        <div className="relative mx-auto flex min-h-full max-w-md flex-col items-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <span className="mt-2 rounded-full bg-white px-4 py-1.5 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mizi/giocamizi-logo-orizzontale.webp" alt="Giocamizi" width={513} height={176} className="h-12 w-auto" />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mizi/mizi-intera.webp" alt="Mizi, la pinguina di Giocamizi, che saluta" width={300} height={380} className="mt-6 h-[min(17rem,38vh)] w-auto drop-shadow-2xl" />
          <h2 id="benvenuto-titolo" className="mt-4 text-center text-[2.4rem] font-black leading-none">
            Ciao! Io sono Mizi
          </h2>
          <p className="mt-3 max-w-xs text-center text-lg font-semibold text-white/90">
            Giochi, storie e feste per bambini dai 3 ai 12 anni. Gratis e senza pubblicità.
          </p>
          <div className="mt-auto w-full pt-8">
            <button type="button" onClick={() => setPasso(1)} className="w-full rounded-[1.4rem] bg-giallo py-4 text-xl font-black text-notte shadow-[0_12px_28px_-10px_rgba(31,36,48,0.6)]" data-inizia>
              Iniziamo
            </button>
            {obbligatorio ? (
              <p className="mt-3 text-center text-sm font-bold text-white/80">Ci vogliono 30 secondi, una volta sola</p>
            ) : (
              <button type="button" onClick={rimanda} className="mt-2 w-full py-3 text-center text-base font-extrabold text-white/90 underline-offset-4 hover:underline" data-piu-tardi>
                Più tardi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- Passi 1-3 ----
  const FUMETTO = { 1: "Piacere! Io sono Mizi. Tu come ti chiami?", 2: `Ciao ${mamma.trim() || "mamma"}! Per chi scegliamo i giochi?`, 3: "Ultima cosa e poi si gioca!" } as const;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="passo-titolo" className="fixed inset-0 z-[60] overflow-y-auto bg-crema text-notte md:hidden" data-benvenuto data-passo={passo}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void avanti();
        }}
        className="mx-auto flex min-h-full max-w-md flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]"
      >
        <div className="flex items-center gap-3">
          <button type="button" onClick={indietro} aria-label="Indietro" className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full" style={{ minHeight: 0, minWidth: 0 }}>
            <ChevronLeft className="h-7 w-7" strokeWidth={2.6} aria-hidden />
          </button>
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {[1, 2, 3].map((i) => (
              <span key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= passo ? "bg-viola" : "bg-crema-scuro"}`} />
            ))}
          </div>
          <span className="text-sm font-extrabold text-notte-tenue">{passo} di 3</span>
          {!obbligatorio && (
            <button type="button" onClick={rimanda} aria-label="Più tardi" className="flex h-11 w-11 items-center justify-center rounded-full text-notte-tenue" style={{ minHeight: 0, minWidth: 0 }}>
              <X className="h-6 w-6" strokeWidth={2.4} aria-hidden />
            </button>
          )}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mizi/giocamizi-logo-orizzontale.webp" alt="Giocamizi" width={513} height={176} className="mx-auto mt-3 h-9 w-auto" />

        <div className="mt-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mizi/mizi-intera.webp" alt="" width={300} height={380} className="h-[4.5rem] w-auto shrink-0" />
          <p className="rounded-[1.2rem] rounded-bl-sm bg-white px-4 py-3 font-bold shadow-[0_8px_20px_-12px_rgba(31,36,48,0.4)]">{FUMETTO[passo]}</p>
        </div>

        {passo === 1 && (
          <div className="mt-6 flex flex-col gap-3">
            <h2 id="passo-titolo" className="text-3xl font-black">Come ti chiami?</h2>
            <label className="flex flex-col gap-2">
              <span className="font-extrabold">Il tuo nome</span>
              <input ref={campo} value={mamma} onChange={(e) => setMamma(e.target.value)} autoComplete="given-name" maxLength={40} enterKeyHint="next" className="w-full min-w-0 rounded-[1.1rem] border-[2.5px] border-viola bg-white px-4 py-3.5 text-lg font-bold" data-campo="mamma" />
            </label>
            <p className="text-sm font-semibold text-notte-tenue">Così ti salutiamo per nome quando apri Giocamizi.</p>
          </div>
        )}

        {passo === 2 && (
          <div className="mt-6 flex flex-col gap-5">
            <h2 id="passo-titolo" className="sr-only">Il tuo bimbo</h2>
            {bimbi.map((b, i) => (
              <div key={i} className="flex flex-col gap-3">
                <label className="flex flex-col gap-2">
                  <span className="flex items-center justify-between font-extrabold">
                    {i === 0 ? "Come si chiama il tuo bimbo?" : `Come si chiama il bimbo n. ${i + 1}?`}
                    {i > 0 && (
                      <button type="button" onClick={() => setBimbi((l) => l.filter((_, j) => j !== i))} className="text-sm font-black text-arancione" style={{ minHeight: 0, minWidth: 0 }}>
                        Togli
                      </button>
                    )}
                  </span>
                  <input ref={i === 0 ? campo : undefined} value={b.nome} onChange={(e) => mettiBimbo(i, { nome: e.target.value })} autoComplete="off" maxLength={30} className="w-full min-w-0 rounded-[1.1rem] border-[2.5px] border-viola bg-white px-4 py-3.5 text-lg font-bold" data-campo={`bimbo-${i}`} />
                </label>
                <fieldset>
                  <legend className="mb-2 font-extrabold">Quanti anni ha?</legend>
                  <div className="grid grid-cols-5 gap-2">
                    {ETA.map((a) => (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={b.eta === a}
                        onClick={() => mettiBimbo(i, { eta: a })}
                        style={{ minHeight: 0, minWidth: 0 }}
                        className={`h-12 rounded-2xl border-2 text-lg font-black ${b.eta === a ? "border-viola bg-viola text-white" : "border-crema-scuro bg-white text-notte"}`}
                        data-eta={a}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            ))}
            <p className="flex items-start gap-2.5 rounded-2xl bg-viola/10 px-4 py-3 text-sm font-bold">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-viola" strokeWidth={2.4} aria-hidden />
              I nomi restano solo su questo telefono: a noi non arrivano.
            </p>
            {bimbi.length < 4 && (
              <button type="button" onClick={() => setBimbi((l) => [...l, { nome: "", eta: 0 }])} className="flex w-fit items-center gap-1.5 text-base font-black text-viola" style={{ minHeight: 0 }} data-altro-bimbo>
                <Plus className="h-5 w-5" strokeWidth={3} aria-hidden /> Ho più di un bimbo
              </button>
            )}
          </div>
        )}

        {passo === 3 && (
          <div className="mt-6 flex flex-col gap-4">
            <h2 id="passo-titolo" className="text-3xl font-black">La tua email</h2>
            <label className="flex flex-col gap-2">
              <span className="font-extrabold">Email</span>
              <input ref={campo} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full min-w-0 rounded-[1.1rem] border-[2.5px] border-viola bg-white px-4 py-3.5 text-lg font-bold" data-campo="email" />
            </label>
            <p className="text-sm font-semibold text-notte-tenue">Resta su questo telefono. Ti scriviamo solo se accendi la posta di Mizi qui sotto. Niente pubblicità, mai.</p>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-[#9B6DD6]" data-spunta="privacy" />
              <span className="font-bold">
                Ho almeno 18 anni e ho letto{" "}
                <a href="/privacy" target="_blank" rel="noopener" className="text-viola underline underline-offset-4">
                  come trattiamo i dati
                </a>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={posta} onChange={(e) => setPosta(e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-[#9B6DD6]" data-spunta="posta" />
              <span>
                <span className="block font-bold">Voglio anche la posta di Mizi: un gioco nuovo a settimana</span>
                <span className="block text-sm font-semibold text-notte-tenue">Facoltativa: puoi dire di no e usare Giocamizi uguale.</span>
              </span>
            </label>
          </div>
        )}

        {avviso && (
          <p role="alert" className="mt-4 font-bold text-arancione">
            {avviso}
          </p>
        )}

        <div className="mt-auto pt-8">
          <button type="submit" disabled={invio} className="w-full rounded-[1.4rem] bg-viola py-4 text-xl font-black text-white shadow-[0_12px_28px_-10px_rgba(155,109,214,0.9)] disabled:opacity-60" data-avanti>
            {invio ? "Un attimo…" : passo === 3 ? "Entra in Giocamizi" : "Avanti"}
          </button>
        </div>
      </form>
    </div>
  );
}
