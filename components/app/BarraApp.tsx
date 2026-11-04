"use client";

import { Download, Share, SquarePlus, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { consensoStatistiche } from "@/components/legal/analytics";

/**
 * La barretta «Scarica Giocamizi sul tuo telefono»: fissa in basso, SOLO sul
 * telefono (sotto i 768 px). Giocamizi è una web app (app/manifest.ts +
 * public/sw.js): si aggiunge alla schermata Home e si apre a tutto schermo,
 * senza passare dagli store.
 *
 * - Android/Chrome: il bottone apre la finestra di installazione del browser.
 * - iPhone/iPad (Safari): Apple non lo permette dal sito, quindi spieghiamo i
 *   due tocchi (Condividi → Aggiungi alla schermata Home).
 * - Altri browser: le istruzioni dal menu.
 *
 * Non compare: se l'app è già aperta come app, se l'hai chiusa (per 30 giorni,
 * ricordato in localStorage, vedi lib/legal.ts), finché c'è il banner dei
 * cookie, dentro i giochi e il pannello, e dove la pagina ha già una sua barra
 * fissa in basso ([data-barra-fissa], es. la scheda di un locale).
 */

export const CHIAVE_APP_CHIUSA = "giocamizi-app-chiusa";
const TRENTA_GIORNI = 30 * 24 * 60 * 60 * 1000;
const NASCOSTA = [/^\/giochi\/[^/]+\/gioca/, /^\/admin\//, /^\/la-tua-scheda\//, /^\/biglietti\/crea/, /^\/biglietti\/vedi/, /^\/accedi/, /^\/aggiungi-attivita/];

interface EventoInstallazione extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Piattaforma = "ios" | "android" | "altro";

function chiusaDaPoco(): boolean {
  try {
    const t = Number(window.localStorage.getItem(CHIAVE_APP_CHIUSA) ?? 0);
    return Number.isFinite(t) && Date.now() - t < TRENTA_GIORNI;
  } catch {
    return false;
  }
}

function giaApp(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function piattaforma(): Piattaforma {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "altro";
}

export function BarraApp() {
  const percorso = usePathname() ?? "/";
  const [pronta, setPronta] = useState(false);
  const [chiusa, setChiusa] = useState(true);
  const [banner, setBanner] = useState(true);
  const [altraBarra, setAltraBarra] = useState(false);
  const [richiesta, setRichiesta] = useState<EventoInstallazione | null>(null);
  const [os, setOs] = useState<Piattaforma>("altro");
  const [aiuto, setAiuto] = useState(false);

  // Una volta sola: service worker, piattaforma, stato salvato, eventi del browser.
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* senza service worker il sito funziona uguale */
      });
    }
    setOs(piattaforma());
    setChiusa(giaApp() || chiusaDaPoco());
    setBanner(consensoStatistiche() === null);
    setPronta(true);

    const suRichiesta = (e: Event) => {
      e.preventDefault();
      setRichiesta(e as EventoInstallazione);
    };
    const suInstallata = () => setChiusa(true);
    const suConsenso = () => setBanner(false);
    window.addEventListener("beforeinstallprompt", suRichiesta);
    window.addEventListener("appinstalled", suInstallata);
    window.addEventListener("giocamizi-consenso", suConsenso);
    return () => {
      window.removeEventListener("beforeinstallprompt", suRichiesta);
      window.removeEventListener("appinstalled", suInstallata);
      window.removeEventListener("giocamizi-consenso", suConsenso);
    };
  }, []);

  // A ogni pagina: c'è già un'altra barra fissa in basso?
  useEffect(() => {
    setAltraBarra(document.querySelector("[data-barra-fissa]") !== null);
    setAiuto(false);
  }, [percorso]);

  const visibile = pronta && !chiusa && !banner && !altraBarra && !NASCOSTA.some((r) => r.test(percorso));
  if (!visibile) return null;

  const chiudi = () => {
    try {
      window.localStorage.setItem(CHIAVE_APP_CHIUSA, String(Date.now()));
    } catch {
      /* senza spazio la barra tornerà alla prossima visita */
    }
    setChiusa(true);
  };

  const installa = async () => {
    if (richiesta) {
      await richiesta.prompt();
      const { outcome } = await richiesta.userChoice;
      setRichiesta(null);
      if (outcome === "accepted") setChiusa(true);
      return;
    }
    setAiuto((a) => !a);
  };

  return (
    <>
      {/* Spazio in fondo alla pagina, così la barra non copre il piè di pagina. */}
      <div aria-hidden className="h-20 md:hidden" />
      <div
        role="region"
        aria-label="Installa Giocamizi sul telefono"
        style={{ bottom: "var(--barra-schede, 0px)" }}
        className="fixed inset-x-0 z-30 px-3 pb-3 md:hidden"
        data-barra-app
      >
        {aiuto && (
          <div className="mb-2 rounded-[1.4rem] bg-white p-4 text-notte shadow-[0_14px_40px_-12px_rgba(31,36,48,0.45)]" role="dialog" aria-label="Come installare Giocamizi">
            <p className="font-black">Due tocchi e Mizi è sul tuo telefono</p>
            {os === "ios" ? (
              <ol className="mt-2 flex flex-col gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crema font-black">1</span>
                  Tocca <Share className="h-4 w-4 shrink-0 text-azzurro" strokeWidth={2.6} aria-label="Condividi" /> <b>Condividi</b> nella barra di Safari
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crema font-black">2</span>
                  Scegli <SquarePlus className="h-4 w-4 shrink-0" strokeWidth={2.6} aria-hidden /> <b>Aggiungi alla schermata Home</b>
                </li>
              </ol>
            ) : (
              <ol className="mt-2 flex flex-col gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crema font-black">1</span>
                  Apri il menu del browser (i tre puntini <b>⋮</b>)
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crema font-black">2</span>
                  Tocca <b>Installa app</b> o <b>Aggiungi a schermata Home</b>
                </li>
              </ol>
            )}
            <p className="mt-2 text-xs text-notte-tenue">Gratis, niente store, niente pubblicità. Si apre a tutto schermo come un&apos;app.</p>
          </div>
        )}
        <div className="flex items-center gap-3 rounded-[1.4rem] bg-notte py-2 pl-2 pr-1.5 text-white shadow-[0_14px_40px_-12px_rgba(31,36,48,0.6)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/icona-192.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl" />
          <p className="min-w-0 flex-1 text-sm font-extrabold leading-tight">
            Scarica Giocamizi sul tuo telefono
            <span className="block text-xs font-bold text-white/70">Gratis · come un&apos;app</span>
          </p>
          <button
            type="button"
            onClick={installa}
            className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-giallo px-3.5 py-2.5 text-sm font-black text-notte"
            style={{ minHeight: 0 }}
            data-installa
          >
            {!aiuto && <Download className="h-4 w-4" strokeWidth={2.8} aria-hidden />}
            {richiesta ? "Installa" : aiuto ? "Ok" : "Scarica"}
          </button>
          <button
            type="button"
            onClick={chiudi}
            aria-label="Non ora"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 hover:text-white"
            style={{ minHeight: 0, minWidth: 0 }}
            data-chiudi-app
          >
            <X className="h-5 w-5" strokeWidth={2.6} aria-hidden />
          </button>
        </div>
      </div>
    </>
  );
}
