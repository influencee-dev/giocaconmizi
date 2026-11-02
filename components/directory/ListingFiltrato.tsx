"use client";

import { ChevronDown, Heart, X } from "lucide-react";
import { Icona, type NomeIcona } from "@/components/icone";
import { useEffect, useMemo, useState } from "react";
import type { DatiCard } from "@/lib/directory";
import { ESPERIENZE, GRUPPI, type IdEsperienza } from "@/lib/esperienze";
import type { IdEtichetta } from "@/lib/etichette";
import { CardRicerca } from "./CardRicerca";
import { EVENTO_PREFERITI, leggiPreferiti } from "./BottoneSalva";
import { MappaLocali, type Punto } from "@/components/mappa/MappaLocali";
import type { Posizione } from "@/lib/posizioni";

/**
 * I risultati di ricerca con l'impostazione di matrimonio.com e lo stile di
 * Giocamizi: una fila orizzontale di filtri a tendina (Per la festa, Per
 * giocare, Comodità, Tipo, Zona), i filtri attivi come pillole da togliere,
 * conteggio, ordinamento e l'interruttore «Mappa» che affianca la mappa ai
 * risultati; i risultati sono una griglia di card verticali.
 * I filtri usano SOLO ciò che è scritto nelle schede (lib/esperienze.ts) e
 * finiscono nell'indirizzo (?servizi=…&tipo=…&zona=…) per condividere la
 * ricerca; la pagina indicizzata resta una.
 */

type Ordine = "consigliati" | "contatti" | "nome";
type Tendina = (typeof GRUPPI)[number] | "Tipo" | "Zona";

const scambia = <T,>(lista: T[], v: T) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);

export function ListingFiltrato({
  schede,
  nome,
  posizioni = {},
  centro,
}: {
  schede: DatiCard[];
  nome: string;
  /** Posizioni per DatiCard.chiave (lib/posizioni.ts). */
  posizioni?: Record<string, Posizione>;
  centro?: [number, number];
}) {
  const [servizi, setServizi] = useState<IdEsperienza[]>([]);
  const [tipi, setTipi] = useState<IdEtichetta[]>([]);
  const [zone, setZone] = useState<string[]>([]);
  const [ordine, setOrdine] = useState<Ordine>("consigliati");
  const [aperta, setAperta] = useState<Tendina | null>(null);
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
      id: "Tipo" as Tendina,
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
  const tendinaAperta = tendine.find((t) => t.id === aperta);

  return (
    <div className="flex flex-col gap-4">
      {/* La fila dei filtri, come matrimonio.com: bottoni a tendina che scorrono. */}
      <div className="sticky top-[5.25rem] z-30 rounded-2xl border border-notte/10 bg-crema/95 px-3 py-3 backdrop-blur sm:px-4">
        <div className="flex items-center gap-2 overflow-x-auto" role="toolbar" aria-label="Filtri">
          {tendine.map((t) => {
            const attiviQui = t.voci.filter((v) => v.on).length;
            const sopra = aperta === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-expanded={sopra}
                onClick={() => setAperta(sopra ? null : t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-extrabold ${
                  attiviQui ? "border-viola bg-viola text-white" : sopra ? "border-notte bg-white text-notte" : "border-crema-scuro bg-white text-notte"
                }`}
              >
                {t.id}
                {attiviQui > 0 && <span className="rounded-full bg-white px-1.5 text-xs text-viola">{attiviQui}</span>}
                <ChevronDown className={`h-4 w-4 transition-transform ${sopra ? "rotate-180" : ""}`} strokeWidth={2.6} aria-hidden />
              </button>
            );
          })}
          {salvati.some((k) => schede.some((s) => s.chiave === k)) && (
            <button
              type="button"
              aria-pressed={soloSalvati}
              onClick={() => setSoloSalvati((v) => !v)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-extrabold ${
                soloSalvati ? "border-rosa bg-rosa text-white" : "border-crema-scuro bg-white text-notte"
              }`}
            >
              <Heart className="h-4 w-4" fill="currentColor" aria-hidden /> Salvati ({salvati.filter((k) => schede.some((s) => s.chiave === k)).length})
            </button>
          )}
          {mappaPossibile && (
            <button
              type="button"
              role="switch"
              aria-checked={conMappa}
              onClick={() => setConMappa((v) => !v)}
              className="ml-auto flex shrink-0 items-center gap-2 rounded-full border-2 border-notte bg-white px-4 py-2 text-sm font-extrabold text-notte"
              data-interruttore-mappa
            >
              <span className={`relative h-5 w-9 rounded-full transition-colors ${conMappa ? "bg-viola" : "bg-notte/20"}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${conMappa ? "left-[1.1rem]" : "left-0.5"}`} />
              </span>
              Mappa
            </button>
          )}
        </div>

        {tendinaAperta && (
          <div className="mt-3 rounded-2xl border border-notte/10 bg-white p-4" data-tendina={tendinaAperta.id}>
            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {tendinaAperta.voci.map((v) => (
                <label
                  key={v.chiave}
                  className={`flex cursor-pointer items-center gap-2.5 py-2 text-sm font-semibold ${v.n === 0 && !v.on ? "text-notte/35" : "text-notte"}`}
                >
                  <input
                    type="checkbox"
                    checked={v.on}
                    onChange={v.cambia}
                    disabled={v.n === 0 && !v.on}
                    className="h-5 w-5 shrink-0 accent-[#9B6DD6]"
                  />
                  <span className="flex-1">
                    {v.icona && <Icona nome={v.icona} className="mr-1 h-5 w-5 align-[-4px]" />}
                    {v.nome}
                  </span>
                  <span className="text-xs font-bold text-notte-tenue">{v.n}</span>
                </label>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-notte/10 pt-3">
              <p className="text-xs text-notte-tenue">
                Se un servizio non è indicato non vuol dire che manchi: nella scheda trovi le domande da fare.
              </p>
              <button type="button" onClick={() => setAperta(null)} className="shrink-0 rounded-xl bg-viola px-4 py-2 text-sm font-black text-white">
                Mostra {visibili.length}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-black text-notte" aria-live="polite" data-risultati={visibili.length}>
          {visibili.length} {visibili.length === 1 ? "posto trovato" : `${nome.toLowerCase()} trovate`}
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
