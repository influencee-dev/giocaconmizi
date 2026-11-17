"use client";

import { Check, Heart, Map as IconaMappa, SlidersHorizontal, X } from "lucide-react";
import { Icona, type NomeIcona } from "@/components/icone";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DatiCard } from "@/lib/directory/directory";
import { ESPERIENZE, GRUPPI, type IdEsperienza } from "@/lib/directory/esperienze";
import type { IdEtichetta } from "@/lib/directory/etichette";
import { CardRicerca } from "./CardRicerca";
import { EVENTO_PREFERITI, leggiPreferiti } from "./BottoneSalva";
import { MappaLocali, type Punto } from "@/components/mappa/MappaLocali";
import type { Posizione } from "@/lib/directory/posizioni";

/**
 * I risultati di ricerca di una categoria in una città.
 *
 * Filtri pensati per il telefono in una mano (15/11/2026, prima erano tendine
 * con caselline che su telefono si aprivano sotto il bordo dello schermo):
 * - nella barra, sempre in vista: «Filtri» (apre tutto), «Mappa», e i filtri
 *   più usati come pillole da accendere con un tocco;
 * - «Filtri» apre un foglio dal basso con tutti i gruppi (per la festa, per
 *   giocare, comodità, dove, tipo di posto, zona): pillole grandi, col numero
 *   di posti che resterebbero, e in fondo «Mostra N posti».
 * I filtri usano SOLO ciò che è scritto nelle schede (lib/directory/esperienze.ts) e
 * finiscono nell'indirizzo (?servizi=…&tipo=…&zona=…) per condividere la
 * ricerca; la pagina indicizzata resta una.
 */

type Ordine = "consigliati" | "contatti" | "nome";
type Tendina = (typeof GRUPPI)[number] | "Tipo di posto" | "Zona";

const scambia = <T,>(lista: T[], v: T) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);

export function ListingFiltrato({
  schede,
  nome,
  posizioni = {},
  centro,
}: {
  schede: DatiCard[];
  nome: string;
  /** Posizioni per DatiCard.chiave (lib/directory/posizioni.ts). */
  posizioni?: Record<string, Posizione>;
  centro?: [number, number];
}) {
  const [servizi, setServizi] = useState<IdEsperienza[]>([]);
  const [tipi, setTipi] = useState<IdEtichetta[]>([]);
  const [zone, setZone] = useState<string[]>([]);
  const [ordine, setOrdine] = useState<Ordine>("consigliati");
  const [foglio, setFoglio] = useState(false);
  const chiudiFoglio = useRef<HTMLButtonElement>(null);
  const [conMappa, setConMappa] = useState(false);
  const [soloSalvati, setSoloSalvati] = useState(false);
  const [salvati, setSalvati] = useState<string[]>([]);
  useEffect(() => {
    const aggiorna = () => setSalvati(leggiPreferiti());
    aggiorna();
    window.addEventListener(EVENTO_PREFERITI, aggiorna);
    return () => window.removeEventListener(EVENTO_PREFERITI, aggiorna);
  }, []);

  // Filtri dall'indirizzo all'apertura, e nell'indirizzo a ogni cambio.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const lista = (k: string) => (q.get(k) ?? "").split(",").filter(Boolean);
    setServizi(lista("servizi").filter((s) => ESPERIENZE.some((e) => e.id === s)) as IdEsperienza[]);
    setTipi(lista("tipo") as IdEtichetta[]);
    setZone(lista("zona"));
  }, []);
  useEffect(() => {
    const q = new URLSearchParams();
    if (servizi.length) q.set("servizi", servizi.join(","));
    if (tipi.length) q.set("tipo", tipi.join(","));
    if (zone.length) q.set("zona", zone.join(","));
    const nuovo = `${window.location.pathname}${q.size ? `?${q}` : ""}`;
    if (nuovo !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", nuovo);
  }, [servizi, tipi, zone]);

  const passa = (s: DatiCard, salta?: "servizi" | "tipi" | "zone") =>
    (salta === "servizi" || servizi.every((x) => s.esperienze.includes(x))) &&
    (salta === "tipi" || !tipi.length || tipi.includes(s.etichetta.id)) &&
    (salta === "zone" || !zone.length || zone.includes(s.zona));

  const visibili = useMemo(() => {
    const filtrate = schede.filter((s) => passa(s) && (!soloSalvati || salvati.includes(s.chiave)));
    const punteggio = (s: DatiCard) => s.esperienze.length + (s.verificata ? 5 : 0) + (s.contatti.whatsapp || s.contatti.telefono ? 2 : 0);
    const contatti = (s: DatiCard) => Object.values(s.contatti).filter(Boolean).length;
    return [...filtrate].sort((a, b) =>
      ordine === "nome" ? a.nome.localeCompare(b.nome) : ordine === "contatti" ? contatti(b) - contatti(a) : punteggio(b) - punteggio(a),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schede, servizi, tipi, zone, ordine, soloSalvati, salvati]);

  // Quanti risultati darebbe ogni opzione, con gli altri filtri già attivi.
  const conta = {
    servizio: (id: IdEsperienza) => schede.filter((s) => passa(s, "servizi") && [...servizi, id].every((x) => s.esperienze.includes(x))).length,
    tipo: (id: IdEtichetta) => schede.filter((s) => passa(s, "tipi") && s.etichetta.id === id).length,
    zona: (z: string) => schede.filter((s) => passa(s, "zone") && s.zona === z).length,
  };
  const tuttiTipi = useMemo(() => [...new Map(schede.map((s) => [s.etichetta.id, s.etichetta])).values()], [schede]);
  const tutteZone = useMemo(() => [...new Set(schede.map((s) => s.zona))].sort(), [schede]);
  const presenti = ESPERIENZE.filter((e) => schede.some((s) => s.esperienze.includes(e.id)));
  const azzera = () => {
    setServizi([]);
    setTipi([]);
    setZone([]);
  };
  const puntiMappa = visibili
    .filter((s) => posizioni[s.chiave])
    .map(
      (s): Punto => ({
        ...posizioni[s.chiave],
        approssimativa: posizioni[s.chiave].precisione === "zona",
        nome: s.nome,
        href: s.href,
        icona: s.etichetta.icona,
        colore: s.etichetta.pieno,
        sotto: `${s.etichetta.nome} · ${s.zona}`,
      }),
    );
  const mappaPossibile = Boolean(centro) && Object.keys(posizioni).length > 0;

  // Le tendine della fila filtri: una per gruppo, poi tipo e zona.
  const tendine: { id: Tendina; voci: { chiave: string; nome: string; icona?: NomeIcona; n: number; on: boolean; cambia: () => void }[] }[] = [
    ...GRUPPI.map((g) => ({
      id: g as Tendina,
      voci: presenti
        .filter((e) => e.gruppo === g)
        .map((e) => ({
          chiave: e.id,
          nome: e.nome,
          icona: e.icona,
          n: conta.servizio(e.id),
          on: servizi.includes(e.id),
          cambia: () => setServizi((l) => scambia(l, e.id)),
        })),
    })),
    {
      id: "Tipo di posto" as Tendina,
      voci:
        tuttiTipi.length > 1
          ? tuttiTipi.map((t) => ({ chiave: t.id, nome: t.nome, icona: t.icona, n: conta.tipo(t.id), on: tipi.includes(t.id), cambia: () => setTipi((l) => scambia(l, t.id)) }))
          : [],
    },
    {
      id: "Zona" as Tendina,
      voci:
        tutteZone.length > 1
          ? tutteZone.map((z) => ({ chiave: z, nome: z, n: conta.zona(z), on: zone.includes(z), cambia: () => setZone((l) => scambia(l, z)) }))
          : [],
    },
  ].filter((t) => t.voci.length > 0);

  const pillole = [
    ...servizi.map((id) => ({ nome: ESPERIENZE.find((e) => e.id === id)!.nome, togli: () => setServizi((l) => l.filter((x) => x !== id)) })),
    ...tipi.map((id) => ({ nome: tuttiTipi.find((t) => t.id === id)?.nome ?? id, togli: () => setTipi((l) => l.filter((x) => x !== id)) })),
    ...zone.map((z) => ({ nome: z, togli: () => setZone((l) => l.filter((x) => x !== z)) })),
  ];
  const attivi = servizi.length + tipi.length + zone.length;
  // Le pillole rapide della barra: i servizi accesi, poi i più presenti nelle schede.
  const rapidi = [...presenti]
    .map((e) => ({ e, n: conta.servizio(e.id), on: servizi.includes(e.id) }))
    .filter((x) => x.on || x.n > 0)
    .sort((a, b) => Number(b.on) - Number(a.on) || b.n - a.n)
    .slice(0, 6);
  const quantiSalvati = salvati.filter((k) => schede.some((sc) => sc.chiave === k)).length;

  // Foglio aperto: la pagina sotto non scorre, Esc chiude, il fuoco va sulla X.
  useEffect(() => {
    if (!foglio) return;
    const prima = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    chiudiFoglio.current?.focus();
    const tasto = (e: KeyboardEvent) => e.key === "Escape" && setFoglio(false);
    window.addEventListener("keydown", tasto);
    return () => {
      document.body.style.overflow = prima;
      window.removeEventListener("keydown", tasto);
    };
  }, [foglio]);

  return (
    <div className="flex flex-col gap-4">
      {/* La barra: «Filtri» e «Mappa» fermi a sinistra, i filtri più usati scorrono accanto. */}
      <div className="sticky top-[5.25rem] z-30 rounded-2xl border border-notte/10 bg-crema/95 p-2 backdrop-blur sm:p-3" role="toolbar" aria-label="Filtri">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFoglio(true)}
            aria-haspopup="dialog"
            aria-expanded={foglio}
            className={`flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-base font-extrabold ${
              attivi ? "border-viola-forte bg-viola-forte text-white" : "border-notte bg-white text-notte"
            }`}
            data-apri-filtri
          >
            <SlidersHorizontal className="h-5 w-5" strokeWidth={2.6} aria-hidden />
            Filtri
            {attivi > 0 && <span className="rounded-full bg-white px-2 text-sm text-viola-forte">{attivi}</span>}
          </button>
          {mappaPossibile && (
            <button
              type="button"
              role="switch"
              aria-checked={conMappa}
              onClick={() => setConMappa((v) => !v)}
              className={`flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-base font-extrabold ${
                conMappa ? "border-notte bg-notte text-white" : "border-notte bg-white text-notte"
              }`}
              data-interruttore-mappa
            >
              <IconaMappa className="h-5 w-5" strokeWidth={2.4} aria-hidden />
              Mappa
            </button>
          )}
          <div className="relative min-w-0 flex-1">
            <div className="flex items-center gap-2 overflow-x-auto pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-filtri-rapidi>
              {quantiSalvati > 0 && (
                <button
                  type="button"
                  aria-pressed={soloSalvati}
                  onClick={() => setSoloSalvati((v) => !v)}
                  className={`flex min-h-12 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-extrabold ${
                    soloSalvati ? "border-rosa-forte bg-rosa-forte text-white" : "border-crema-scuro bg-white text-notte"
                  }`}
                >
                  <Heart className="h-4 w-4" fill="currentColor" aria-hidden /> Salvati ({quantiSalvati})
                </button>
              )}
              {rapidi.map(({ e, on }) => (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setServizi((l) => scambia(l, e.id))}
                  className={`flex min-h-12 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-extrabold ${
                    on ? "border-viola-forte bg-viola-forte text-white" : "border-crema-scuro bg-white text-notte"
                  }`}
                  data-filtro-rapido={e.id}
                >
                  {on ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <Icona nome={e.icona} className="h-5 w-5" />}
                  {e.nome}
                </button>
              ))}
            </div>
            {/* La sfumatura a destra dice che la fila continua. */}
            <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-crema to-transparent" />
          </div>
        </div>
      </div>

      {foglio && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" data-foglio-filtri>
          <button type="button" aria-label="Chiudi i filtri" onClick={() => setFoglio(false)} className="absolute inset-0 bg-notte/50" style={{ minHeight: 0 }} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtri"
            className="relative flex max-h-[88dvh] w-full flex-col rounded-t-[1.8rem] bg-crema shadow-2xl sm:max-w-2xl sm:rounded-[1.8rem]"
            style={{ animation: "comparsa 0.15s ease-out" }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-notte/10 px-5 py-4">
              <h2 className="text-2xl font-black text-notte">Filtri</h2>
              <button
                ref={chiudiFoglio}
                type="button"
                onClick={() => setFoglio(false)}
                aria-label="Chiudi"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-notte"
              >
                <X className="h-6 w-6" strokeWidth={2.6} aria-hidden />
              </button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto px-5 py-5">
              {tendine.map((t) => (
                <fieldset key={t.id} data-gruppo-filtri={t.id}>
                  <legend className="mb-2 text-lg font-black text-notte">{t.id}</legend>
                  <div className="flex flex-wrap gap-2">
                    {t.voci.map((v) => {
                      const spenta = v.n === 0 && !v.on;
                      return (
                        <label
                          key={v.chiave}
                          className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-base font-extrabold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-notte ${
                            v.on ? "border-viola-forte bg-viola-forte text-white" : spenta ? "border-crema-scuro bg-crema text-notte/35" : "border-crema-scuro bg-white text-notte"
                          }`}
                        >
                          <input type="checkbox" checked={v.on} onChange={v.cambia} disabled={spenta} className="sr-only" />
                          {v.on ? <Check className="h-5 w-5" strokeWidth={3} aria-hidden /> : v.icona ? <Icona nome={v.icona} className={`h-5 w-5 ${spenta ? "opacity-40" : ""}`} /> : null}
                          <span>{v.nome}</span>
                          <span className={`text-sm font-bold ${v.on ? "text-white/80" : "text-notte-tenue"}`}>{v.n}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
              <p className="text-sm text-notte-tenue">
                Se un servizio non è indicato non vuol dire che manchi: nella scheda trovi le domande da fare al locale.
              </p>
            </div>

            <div className="flex items-center gap-3 border-t border-notte/10 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-b-[1.8rem]">
              <button type="button" onClick={azzera} disabled={attivi === 0} className="min-h-14 shrink-0 px-2 text-base font-extrabold text-viola-forte underline underline-offset-4 disabled:text-notte/30 disabled:no-underline">
                Togli tutti
              </button>
              <button type="button" onClick={() => setFoglio(false)} className="min-h-14 flex-1 rounded-full bg-viola-forte px-5 text-lg font-black text-white" data-mostra-risultati>
                {visibili.length === 0 ? "Nessun posto così" : visibili.length === 1 ? "Mostra 1 posto" : `Mostra ${visibili.length} posti`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-black text-notte" aria-live="polite" data-risultati={visibili.length}>
          {visibili.length} {visibili.length === 1 ? "posto trovato" : `${nome.toLowerCase()} ${/^(ludoteche|sale|fattorie|associazioni)\b/i.test(nome) ? "trovate" : "trovati"}`}
        </p>
        <label className="flex items-center gap-2 text-sm font-bold text-notte">
          Ordina
          <select value={ordine} onChange={(e) => setOrdine(e.target.value as Ordine)} className="rounded-xl border-2 border-crema-scuro bg-white px-3 py-1.5">
            <option value="consigliati">Consigliati</option>
            <option value="contatti">Con più contatti</option>
            <option value="nome">Nome A-Z</option>
          </select>
        </label>
      </div>

      {pillole.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {pillole.map((p) => (
            <button
              key={p.nome}
              type="button"
              onClick={p.togli}
              className="flex items-center gap-1.5 rounded-full bg-notte px-3 py-1.5 text-xs font-extrabold text-white"
              aria-label={`Togli il filtro ${p.nome}`}
            >
              {p.nome} <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
            </button>
          ))}
          <button type="button" onClick={azzera} className="text-sm font-bold text-viola underline underline-offset-4">
            Togli tutti
          </button>
        </div>
      )}

      <div className={conMappa ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-6" : ""}>
        {conMappa && centro && (
          <div className="mb-4 lg:sticky lg:top-44 lg:order-2 lg:mb-0">
            <MappaLocali subito centro={centro} punti={puntiMappa} alta="h-72 sm:h-96 lg:h-[calc(100vh-13rem)]" />
            {puntiMappa.length < visibili.length && (
              <p className="mt-2 text-xs font-bold text-notte-tenue">
                {visibili.length - puntiMappa.length} posti non hanno ancora la posizione sulla mappa.
              </p>
            )}
          </div>
        )}
        {visibili.length === 0 ? (
          <div className="rounded-[1.4rem] border-2 border-dashed border-crema-scuro bg-white p-6 text-center">
            <p className="text-lg font-black text-notte">Nessun posto con tutti questi filtri</p>
            <p className="mt-1 text-notte-tenue">Prova a toglierne uno: molti servizi i locali li offrono anche se non li scrivono.</p>
            <button type="button" onClick={azzera} className="mt-4 rounded-xl bg-viola px-5 py-2.5 font-extrabold text-white">
              Mostra tutti
            </button>
          </div>
        ) : (
          <div className={`grid gap-5 sm:grid-cols-2 ${conMappa ? "" : "xl:grid-cols-3"}`}>
            {visibili.map((s) => (
              <CardRicerca key={s.chiave} s={s} cercate={servizi} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
