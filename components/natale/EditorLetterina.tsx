"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VARIANTI, type Variante } from "@/components/biglietti/Sfondo";
import { FOGLIO_A4 } from "@/components/biglietti/Etichette";
import { MOTIVI } from "@/components/biglietti/motivi";
import { annuncia, MessaggioEsito } from "@/components/ui/Esito";
import { FacciaMizi } from "@/games/_engine/arte";
import { parla, zittisci } from "@/lib/audio";
import {
  APERTURE,
  CARTE,
  CHIUSURE,
  DATA_RISPOSTA,
  FASCE,
  IDEE_DESIDERI,
  MAX_CARATTERI_DESIDERIO,
  MAX_CARATTERI_FRASE,
  MAX_DESIDERI,
  PENSIERI,
  QUEST_ANNO,
  RISPOSTA_BABBO_NATALE,
  TESTO_CONDIVISIONE,
  riempi,
  type Fascia,
} from "@/lib/natale";
import { condividiImmagine, foglioInPng, nomeFileLetterina, pngInPdf, scaricaUrl, stampaImmagine } from "@/lib/natale-esporta";
import { FoglioBusta } from "./FoglioBusta";
import { FoglioLetterina, FoglioRisposta, type DatiLetterina } from "./FoglioLetterina";

/**
 * Lo strumento della letterina a Babbo Natale.
 *
 * Tutto nel browser: niente link con i dati, niente server, niente
 * salvataggi. Nome, età e desideri del bambino restano sul dispositivo
 * (regola del sito: dati dei bambini al minimo). Il download è libero;
 * dopo, si propone la posta di Mizi, senza condizioni.
 *
 * 14/11/2026, dopo lo studio UX: cornici a figura, PDF e stampa diretta, la
 * busta da colorare, il messaggio «Fatto!» con i coriandoli, scelte grandi da
 * toccare, contatori sui campi e, sul telefono, l'anteprima sempre a portata
 * di dito (quando l'anteprima esce dallo schermo compare una miniatura in alto a destra, che si apre a tutto schermo).
 */

const MAX_NOME = 24;

/**
 * La letterina a passi, come i giochi (studio UX del 14/11/2026): un compito
 * per schermata, Mizi che lo dice nel fumetto e a voce, bottoni grandi
 * «Avanti» e «Indietro». «Vedi tutto in una pagina» è la modalità dei grandi.
 */
const PASSI = [
  { titolo: "Chi scrive", mizi: "Ciao! Quanti anni hai? Se vuoi, scrivi anche il tuo nome." },
  { titolo: "La carta", mizi: "Tocca il disegno che ti piace di più per la tua carta da lettera." },
  { titolo: "Come cominci", mizi: "Tocca una frase per cominciare. Te la leggo io!" },
  { titolo: "I desideri", mizi: "Cosa vorresti per Natale? Tocca un'idea o scrivila tu." },
  { titolo: "Il saluto", mizi: "Ultima cosa: come vuoi salutare Babbo Natale?" },
  { titolo: "Fatto!", mizi: "Evviva, la tua letterina è pronta! Chiedi a un grande di stamparla, poi colora la busta." },
] as const;
const { larghezza: W, altezza: H } = FOGLIO_A4;

export function EditorLetterina() {
  const [fascia, setFascia] = useState<Fascia>("medi");
  const [nome, setNome] = useState("");
  const [eta, setEta] = useState("");
  const [carta, setCarta] = useState<string>("natale");
  const [variante, setVariante] = useState<Variante>("chiaro");
  const [apertura, setApertura] = useState(APERTURE.medi[0]);
  const [questAnno, setQuestAnno] = useState(QUEST_ANNO.medi[0]);
  const [desideri, setDesideri] = useState<string[]>(["", "", ""]);
  const [pensiero, setPensiero] = useState("");
  const [chiusura, setChiusura] = useState(CHIUSURE.medi[0]);
  const [conMizi, setConMizi] = useState(true);
  const [scaricata, setScaricata] = useState(false);
  const [rispostaPronta, setRispostaPronta] = useState(false);
  const [grande, setGrande] = useState(false);
  const [anteprimaFuori, setAnteprimaFuori] = useState(false);
  const [passo, setPasso] = useState(0);
  const [tutto, setTutto] = useState(false);
  const [voce, setVoce] = useState(true);
  const inizio = useRef<HTMLDivElement>(null);

  /** Mizi legge ad alta voce, se la voce è accesa. */
  const dici = useCallback((testo: string) => {
    if (voce && testo.trim()) parla(testo);
  }, [voce]);

  const vaiA = useCallback((n: number) => {
    const nuovo = Math.max(0, Math.min(PASSI.length - 1, n));
    setPasso(nuovo);
    zittisci();
    if (voce) parla(PASSI[nuovo].mizi);
    if (nuovo === PASSI.length - 1) annuncia("Evviva! La letterina è pronta.", true);
    inizio.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [voce]);
  const foglio = useRef<HTMLDivElement>(null);
  const foglioBusta = useRef<HTMLDivElement>(null);
  const foglioRisposta = useRef<HTMLDivElement>(null);

  // La miniatura fissa compare solo quando serve davvero (vedi sotto).
  useEffect(() => {
    // La miniatura fissa serve solo quando sono fuori schermo sia il foglio
    // grande sia la barra di Mizi (che ha la sua miniatura): così non copre niente.
    const elementi = [foglio.current, inizio.current].filter((e): e is HTMLDivElement => Boolean(e));
    if (!elementi.length || typeof IntersectionObserver === "undefined") return;
    const visibili = new Map<Element, boolean>();
    const osserva = new IntersectionObserver(
      (voci) => {
        for (const v of voci) visibili.set(v.target, v.isIntersecting);
        setAnteprimaFuori(![...visibili.values()].some(Boolean));
      },
      { threshold: 0.15 },
    );
    elementi.forEach((e) => osserva.observe(e));
    return () => osserva.disconnect();
  }, []);

  // La data si controlla nel browser: la pagina è statica.
  useEffect(() => {
    setRispostaPronta(new Date().toISOString().slice(0, 10) >= DATA_RISPOSTA);
  }, []);

  const cambiaFascia = useCallback((f: Fascia) => {
    setFascia(f);
    setApertura(APERTURE[f][0]);
    setQuestAnno(QUEST_ANNO[f][0]);
    setChiusura(CHIUSURE[f][0]);
  }, []);

  const dati: DatiLetterina = useMemo(
    () => ({
      carta,
      variante,
      apertura: riempi(apertura, nome, eta),
      questAnno,
      desideri,
      pensiero,
      chiusura,
      firma: nome,
      conMizi,
    }),
    [carta, variante, apertura, nome, eta, questAnno, desideri, pensiero, chiusura, conMizi],
  );

  /** Il PNG di uno dei fogli in pagina (letterina, busta o risposta). */
  const png = useCallback(async (contenitore: HTMLDivElement | null) => {
    const svg = contenitore?.querySelector("svg");
    if (!svg) throw new Error("foglio non pronto");
    return foglioInPng(svg, W, H);
  }, []);

  /** Ogni uscita passa da qui: un solo messaggio, sempre visibile, in basso. */
  const esegui = useCallback(async (azione: () => Promise<string>) => {
    try {
      const messaggio = await azione();
      annuncia(messaggio, true);
      setScaricata(true);
    } catch {
      annuncia("Non sono riuscita a preparare il foglio: riprova tra un attimo.");
    }
  }, []);

  const nomeFile = nome.trim();

  const scaricaPdf = () =>
    esegui(async () => {
      const pdf = await pngInPdf(await png(foglio.current), W, H);
      const url = URL.createObjectURL(pdf);
      scaricaUrl(url, nomeFileLetterina(nomeFile, "pdf"));
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      return "Fatto! Il PDF della letterina è nei download.";
    });

  const stampa = () =>
    esegui(async () => {
      stampaImmagine(await png(foglio.current));
      return "Si apre la stampa: scegli il foglio A4.";
    });

  const scaricaPng = () =>
    esegui(async () => {
      scaricaUrl(await png(foglio.current), nomeFileLetterina(nomeFile, "png"));
      return "Fatto! L'immagine è nei download.";
    });

  const condividi = () =>
    esegui(async () => {
      const esito = await condividiImmagine(await png(foglio.current), nomeFileLetterina(nomeFile, "png"), TESTO_CONDIVISIONE);
      return esito === "condivisa" ? "Letterina condivisa!" : "Il telefono non la condivide da qui: l'immagine è nei download.";
    });

  const scaricaBusta = () =>
    esegui(async () => {
      const pdf = await pngInPdf(await png(foglioBusta.current), W, H);
      const url = URL.createObjectURL(pdf);
      scaricaUrl(url, nomeFileLetterina(nomeFile, "pdf").replace("letterina-", "busta-"));
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      return "Fatto! La busta da colorare è nei download.";
    });

  const stampaBusta = () =>
    esegui(async () => {
      stampaImmagine(await png(foglioBusta.current));
      return "Si apre la stampa della busta: scegli il foglio A4.";
    });

  const scaricaRisposta = () =>
    esegui(async () => {
      scaricaUrl(await png(foglioRisposta.current), "risposta-di-babbo-natale.png");
      return "Fatto! La risposta di Babbo Natale è nei download.";
    });

  const scegli = "min-h-14 rounded-bolla border-2 px-5 py-3 text-base font-extrabold";
  const attivo = "border-viola-forte bg-viola-forte text-white";
  const spento = "border-notte/15 bg-white text-notte hover:border-viola";

  const bottoni = (
    <div className="grid gap-2">
      <button type="button" onClick={scaricaPdf} className="min-h-14 rounded-bolla bg-rosa-forte px-5 py-3 text-lg font-extrabold text-white" data-scarica-letterina-pdf>
        Scarica il PDF da stampare
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={stampa} className="min-h-14 rounded-bolla bg-viola-forte px-4 py-3 font-extrabold text-white" data-stampa-letterina>
          Stampa
        </button>
        <button type="button" onClick={condividi} className="min-h-14 rounded-bolla bg-verde-forte px-4 py-3 font-extrabold text-white" data-condividi-letterina>
          Condividi
        </button>
      </div>
      <button type="button" onClick={scaricaPng} className="text-sm font-bold text-viola-forte underline underline-offset-2" data-scarica-letterina>
        oppure scarica l&apos;immagine (PNG)
      </button>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]" data-editor-letterina>
      <MessaggioEsito />

      <div className="order-1 min-w-0 lg:order-2">
        <div className="lg:sticky lg:top-20">
          <div ref={foglio} className="mx-auto max-w-xs overflow-hidden rounded-morbido shadow-lg [&_svg]:h-auto [&_svg]:w-full" data-anteprima-letterina>
            <FoglioLetterina dati={dati} />
          </div>
          <div className="mx-auto mt-4 max-w-xs">
            {bottoni}
            <p className="mt-2 text-center text-xs text-notte-tenue">
              Nome e desideri restano su questo dispositivo: la letterina si crea qui, non sui nostri server.
            </p>
          </div>
        </div>
      </div>

      <form className="order-2 grid min-w-0 scroll-mt-28 gap-8 lg:order-1" onSubmit={(e) => e.preventDefault()} data-passo={tutto ? "tutto" : passo}>
        <div ref={inizio} className="grid scroll-mt-28 gap-3">
          <button
            type="button"
            onClick={() => parla(tutto ? "Qui vedi tutta la letterina in una pagina." : PASSI[passo].mizi)}
            aria-label="Mizi ripete a voce"
            className="flex items-center gap-3 text-left"
            data-mizi-guida
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <FacciaMizi emozione="felice" className="h-12 w-12" />
            </span>
            <span className="fumetto relative flex-1 rounded-morbido border-2 border-crema-scuro bg-white px-4 py-3">
              <span className="block text-lg font-extrabold leading-snug text-notte">
                {tutto ? "Ecco tutta la letterina in una pagina: cambia quello che vuoi." : PASSI[passo].mizi}
              </span>
              <span className="mt-1 block text-sm font-bold text-viola-forte">🔊 tocca per sentirlo</span>
            </span>
          </button>
          {/* Telefono: la letterina in piccolo accanto a Mizi, si apre a tutto schermo. */}
          <button
            type="button"
            onClick={() => setGrande(true)}
            className="-mt-1 flex items-center gap-3 self-end rounded-xl bg-white p-1.5 pr-3 text-sm font-extrabold text-notte shadow-sm lg:hidden"
            aria-label="Guarda la letterina a tutto schermo"
            data-miniatura-guida
          >
            <span className="w-12 overflow-hidden rounded-md border border-crema-scuro [&_svg]:h-auto [&_svg]:w-full">
              <FoglioLetterina dati={dati} />
            </span>
            Guarda la letterina
          </button>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {!tutto && (
              <ol className="flex gap-1.5" aria-label={`Passo ${passo + 1} di ${PASSI.length}`}>
                {PASSI.map((p, i) => (
                  <li key={p.titolo} className={`h-3 w-3 rounded-full ${i <= passo ? "bg-viola-forte" : "bg-crema-scuro"}`} />
                ))}
              </ol>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setVoce((v) => !v);
                  zittisci();
                }}
                aria-pressed={voce}
                className="min-h-12 rounded-bolla border-2 border-notte/15 bg-white px-3 text-sm font-bold text-notte"
                data-voce-mizi
              >
                {voce ? "🔊 Voce sì" : "🔇 Voce no"}
              </button>
              <button type="button" onClick={() => setTutto((t) => !t)} className="min-h-12 rounded-bolla border-2 border-notte/15 bg-white px-3 text-sm font-bold text-notte" data-vedi-tutto>
                {tutto ? "Torna ai passi" : "Vedi tutto in una pagina"}
              </button>
            </div>
          </div>
        </div>

        {(tutto || passo === 0) && (
        <>
        <fieldset className="grid gap-2">
          <legend className="text-lg font-extrabold text-notte">1. Per che età</legend>
          <div className="flex flex-wrap gap-2">
            {FASCE.map((f) => (
              <button key={f.id} type="button" onClick={() => cambiaFascia(f.id)} className={`${scegli} ${fascia === f.id ? attivo : spento}`} data-fascia={f.id} aria-pressed={fascia === f.id}>
                {f.etichetta}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
          <Campo etichetta="Nome (facoltativo)" id="letterina-nome" valore={nome} massimo={MAX_NOME} onChange={setNome} />
          <label className="grid min-w-0 gap-1 font-bold text-notte">
            Anni
            <input id="letterina-eta" value={eta} inputMode="numeric" maxLength={2} onChange={(e) => setEta(e.target.value.replace(/\D/g, ""))} className="min-h-14 w-full min-w-0 rounded-xl border-2 border-notte/15 px-3 py-2 text-lg font-normal" />
          </label>
        </div>

        </>
        )}

        {(tutto || passo === 1) && (
        <fieldset className="grid gap-3">
          <legend className="text-lg font-extrabold text-notte">2. La carta da lettera</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Carta da lettera">
            {CARTE.map((c) => {
              const motivo = MOTIVI[c.tema];
              return (
                <button
                  key={c.tema}
                  type="button"
                  role="radio"
                  aria-checked={carta === c.tema}
                  onClick={() => setCarta(c.tema)}
                  className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-morbido border-4 bg-white p-2 text-xs font-extrabold text-notte ${carta === c.tema ? "border-viola-forte" : "border-crema-scuro"}`}
                  data-carta-letterina={c.tema}
                >
                  {motivo && (
                    <svg viewBox="0 0 40 40" className="h-12 w-12 rounded-xl bg-crema" aria-hidden>
                      {motivo.motivo(motivo.tinte)}
                    </svg>
                  )}
                  {c.etichetta}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {VARIANTI.map((v) => (
              <button key={v.id} type="button" onClick={() => setVariante(v.id)} className={`${scegli} ${variante === v.id ? attivo : spento}`} data-variante-letterina={v.id} aria-pressed={variante === v.id}>
                {v.etichetta}
              </button>
            ))}
          </div>
        </fieldset>

        )}

        {(tutto || passo === 2) && (
        <>
        <Frase titolo="3. Come cominci" valore={apertura} scelte={APERTURE[fascia].map((f) => riempi(f, nome, eta))} onChange={setApertura} onScelta={dici} id="letterina-apertura" />
        <Frase titolo="4. Com'è andato l'anno" valore={questAnno} scelte={QUEST_ANNO[fascia]} onChange={setQuestAnno} onScelta={dici} id="letterina-anno" />
        </>
        )}

        {(tutto || passo === 3) && (
        <fieldset className="grid gap-2">
          <legend className="text-lg font-extrabold text-notte">5. I desideri (al massimo {MAX_DESIDERI})</legend>
          <p className="text-notte-tenue">Tocca un&apos;idea oppure scrivi tu:</p>
          <div className="flex flex-wrap gap-2">
            {IDEE_DESIDERI[fascia].map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => {
                  dici(idea);
                  setDesideri((v) => {
                    const vuoto = v.findIndex((x) => !x.trim());
                    if (vuoto >= 0) return v.map((x, k) => (k === vuoto ? idea : x));
                    return v.length < MAX_DESIDERI ? [...v, idea] : v;
                  });
                }}
                className="min-h-12 rounded-bolla border-2 border-crema-scuro bg-crema px-4 py-2 text-base font-bold text-notte hover:border-viola"
                data-idea-desiderio
              >
                + {idea}
              </button>
            ))}
          </div>
          {desideri.map((d, i) => (
            <Campo
              key={i}
              etichetta={`Desiderio ${i + 1}`}
              id={`letterina-desiderio-${i + 1}`}
              valore={d}
              massimo={MAX_CARATTERI_DESIDERIO}
              onChange={(valore) => setDesideri((v) => v.map((x, k) => (k === i ? valore : x)))}
              nascondiEtichetta
            />
          ))}
          {desideri.length < MAX_DESIDERI && (
            <button type="button" onClick={() => setDesideri((v) => [...v, ""])} className="min-h-12 w-fit rounded-bolla border-2 border-dashed border-crema-scuro bg-white px-4 py-2 font-bold text-notte">
              + un altro desiderio
            </button>
          )}
        </fieldset>
        )}

        {(tutto || passo === 4) && (
        <>
        <Frase titolo="6. Un pensiero per gli altri (facoltativo)" valore={pensiero} scelte={PENSIERI} onChange={setPensiero} onScelta={dici} id="letterina-pensiero" />
        <Frase titolo="7. Come saluti" valore={chiusura} scelte={CHIUSURE[fascia]} onChange={setChiusura} onScelta={dici} id="letterina-chiusura" />

        <label className="flex min-h-12 items-center gap-3 font-bold text-notte">
          <input type="checkbox" checked={conMizi} onChange={(e) => setConMizi(e.target.checked)} className="h-6 w-6 accent-[#7B4CC4]" /> Metti Mizi nella letterina
        </label>
        <p className="text-notte-tenue">Lascia vuoti i campi che vuoi scrivere a mano: sul foglio diventano righe.</p>
        </>
        )}

        {(tutto || passo === PASSI.length - 1) && (
          <div className="grid gap-3" data-passo-fatto>
            {!tutto && (
              <div className="mx-auto w-full max-w-xs overflow-hidden rounded-morbido shadow-lg lg:hidden [&_svg]:h-auto [&_svg]:w-full">
                <FoglioLetterina dati={dati} />
              </div>
            )}
            {/* Sul telefono i bottoni stanno anche qui: niente su e giù. */}
            <div className="lg:hidden">{bottoni}</div>
            {!tutto && (
              <a href="#busta" className="text-center font-extrabold text-viola-forte underline underline-offset-2">
                Ora stampa la busta da colorare ↓
              </a>
            )}
          </div>
        )}

        {!tutto && (
          <div className="grid grid-cols-2 gap-3" data-navigazione-passi>
            <button
              type="button"
              onClick={() => vaiA(passo - 1)}
              disabled={passo === 0}
              className="min-h-16 rounded-bolla border-2 border-notte/15 bg-white px-5 text-lg font-extrabold text-notte disabled:opacity-40"
              data-indietro
            >
              ← Indietro
            </button>
            {passo < PASSI.length - 1 ? (
              <button type="button" onClick={() => vaiA(passo + 1)} className="min-h-16 rounded-bolla bg-viola-forte px-5 text-lg font-extrabold text-white" data-avanti>
                Avanti →
              </button>
            ) : (
              <button type="button" onClick={() => vaiA(0)} className="min-h-16 rounded-bolla border-2 border-viola-forte bg-white px-5 text-lg font-extrabold text-viola-forte" data-ricomincia>
                Rifalla da capo
              </button>
            )}
          </div>
        )}
      </form>

      <section id="busta" className="order-3 scroll-mt-28 rounded-morbido border border-notte/10 bg-white p-5 lg:col-span-2" data-sezione-busta>
        <h2 className="text-xl font-extrabold text-notte">La busta da colorare</h2>
        <p className="mt-1 text-notte-tenue">
          Si stampa su un A4, si colora, si ritaglia e si piega: dentro ci sta la letterina piegata in quattro. Davanti c&apos;è
          «A: Babbo Natale» e il francobollo da colorare{nome.trim() ? ", con il nome di chi scrive" : ""}.
        </p>
        <div className="mt-3 grid items-start gap-4 sm:grid-cols-[10rem_1fr]">
          <div ref={foglioBusta} className="w-40 overflow-hidden rounded-morbido border-2 border-crema-scuro bg-white [&>svg]:h-auto [&>svg]:w-full">
            <FoglioBusta mittente={nome.trim().slice(0, MAX_NOME)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={scaricaBusta} className="min-h-14 rounded-bolla bg-rosa-forte px-5 py-3 font-extrabold text-white" data-scarica-busta>
              Scarica la busta (PDF)
            </button>
            <button type="button" onClick={stampaBusta} className="min-h-14 rounded-bolla bg-viola-forte px-5 py-3 font-extrabold text-white" data-stampa-busta>
              Stampa la busta
            </button>
          </div>
        </div>
      </section>

      {scaricata && (
        <div className="order-4 rounded-morbido border-2 border-viola/40 bg-viola/10 p-5 lg:col-span-2" data-dopo-letterina>
          <p className="font-extrabold text-viola-forte">E la risposta di Babbo Natale?</p>
          <p className="mt-1 text-notte">
            Dal 20 dicembre, in questa pagina, si scarica la risposta di Babbo Natale da stampare: il nome lo scrivi tu a mano.
            Se vuoi il promemoria, iscriviti alla <a href="#newsletter" className="font-bold text-viola-forte underline">posta di Mizi</a>: è
            gratis e ti cancelli quando vuoi. La letterina resta tua in ogni caso.
          </p>
        </div>
      )}

      <section className="order-5 rounded-morbido border border-notte/10 bg-white p-5 lg:col-span-2" aria-labelledby="titolo-risposta">
        <h2 id="titolo-risposta" className="text-xl font-extrabold text-notte">La risposta di Babbo Natale</h2>
        {rispostaPronta ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,12rem)_1fr] sm:items-start">
            <div ref={foglioRisposta} className="overflow-hidden rounded-xl shadow [&_svg]:h-auto [&_svg]:w-full">
              <FoglioRisposta paragrafi={RISPOSTA_BABBO_NATALE} carta={carta} variante={variante} />
            </div>
            <div className="grid gap-2">
              <p className="text-notte">Stampala, scrivi il nome a mano e lasciala sotto l&apos;albero la notte di Natale.</p>
              <button type="button" onClick={scaricaRisposta} className="min-h-14 w-fit rounded-bolla bg-viola-forte px-5 py-3 font-extrabold text-white" data-scarica-risposta>
                Scarica la risposta (A4)
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-notte">
            Arriva il 20 dicembre: un foglio A4 con la lettera di Babbo Natale e lo spazio per il nome, da stampare e lasciare
            sotto l&apos;albero.
          </p>
        )}
      </section>

      {/* Telefono e tablet: la miniatura resta sempre in vista e si aggiorna mentre
          si sceglie; toccandola la letterina si apre a tutto schermo. */}
      {anteprimaFuori && (
      <button
        type="button"
        onClick={() => setGrande(true)}
        className="fixed right-2 top-28 z-30 w-16 overflow-hidden rounded-xl border-4 border-white bg-white shadow-xl lg:hidden [&_svg]:h-auto [&_svg]:w-full"
        aria-label="Guarda la letterina a tutto schermo"
        data-miniatura-letterina
      >
        <FoglioLetterina dati={dati} />
      </button>
      )}
      {grande && (
        <div className="fixed inset-0 z-50 flex flex-col bg-notte/90 p-4 lg:hidden" role="dialog" aria-label="La tua letterina" data-letterina-grande>
          <div className="mx-auto w-full max-w-sm flex-1 overflow-auto rounded-morbido bg-white [&_svg]:h-auto [&_svg]:w-full">
            <FoglioLetterina dati={dati} />
          </div>
          <div className="mx-auto mt-3 grid w-full max-w-sm gap-2">
            {bottoni}
            <button type="button" onClick={() => setGrande(false)} className="min-h-14 rounded-bolla bg-white px-5 py-3 text-lg font-extrabold text-notte" data-chiudi-grande>
              Torna a scrivere
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({
  etichetta,
  id,
  valore,
  massimo,
  onChange,
  nascondiEtichetta = false,
}: {
  etichetta: string;
  id: string;
  valore: string;
  massimo: number;
  onChange: (v: string) => void;
  nascondiEtichetta?: boolean;
}) {
  const vicino = valore.length >= massimo - 4;
  return (
    <label className="grid min-w-0 gap-1 font-bold text-notte">
      <span className={nascondiEtichetta ? "sr-only" : undefined}>{etichetta}</span>
      <input
        id={id}
        value={valore}
        maxLength={massimo}
        placeholder={nascondiEtichetta ? etichetta : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-14 w-full min-w-0 rounded-xl border-2 border-notte/15 px-3 py-2 text-lg font-normal"
        autoComplete="off"
      />
      {valore.length > 0 && (
        <span className={`text-right text-xs ${vicino ? "font-extrabold text-rosa-forte" : "font-normal text-notte-tenue"}`} data-contatore={id}>
          {valore.length}/{massimo}
        </span>
      )}
    </label>
  );
}

function Frase({
  titolo,
  valore,
  scelte,
  onChange,
  onScelta,
  id,
}: {
  titolo: string;
  valore: string;
  scelte: string[];
  onChange: (v: string) => void;
  /** Quando si tocca una frase pronta (Mizi la legge ad alta voce). */
  onScelta?: (v: string) => void;
  id: string;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-lg font-extrabold text-notte">{titolo}</legend>
      <div className="grid gap-2">
        {scelte.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              onChange(s);
              onScelta?.(s);
            }}
            aria-pressed={valore === s}
            className={`min-h-14 rounded-2xl border-2 px-4 py-3 text-left text-base ${valore === s ? "border-viola-forte bg-viola/10 font-extrabold text-notte" : "border-notte/10 bg-white text-notte hover:border-viola"}`}
          >
            {valore === s ? "✓ " : ""}
            {s}
          </button>
        ))}
      </div>
      <textarea
        id={id}
        value={valore}
        maxLength={MAX_CARATTERI_FRASE}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${titolo}: scrivi o modifica`}
        className="rounded-xl border-2 border-notte/15 px-3 py-2 text-base"
      />
    </fieldset>
  );
}
