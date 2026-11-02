"use client";

import { useEffect, useMemo, useState } from "react";
import type { DatiCard } from "@/lib/directory";
import { ESPERIENZE, GRUPPI, type IdEsperienza } from "@/lib/esperienze";
import type { IdEtichetta } from "@/lib/etichette";
import { CardRisultato } from "./CardRisultato";

/**
 * Il listing in stile Booking: filtri per «esperienze» (ciò che le mamme
 * cercano per la festa), tipo di attività e zona, ognuno col numero di
 * risultati accanto; ordinamento; card orizzontali. Su desktop i filtri
 * stanno a sinistra, su telefono in un pannello che si apre dal bottone
 * «Filtri», con le esperienze più cercate anche come chip in alto.
 * I filtri finiscono nell'indirizzo (?servizi=…&tipo=…&zona=…), così una
 * ricerca si può mandare su WhatsApp; la pagina indicizzata resta una.
 */

type Ordine = "consigliati" | "contatti" | "nome";
const RAPIDE: IdEsperienza[] = ["animazione", "gonfiabili", "buffet", "esclusiva", "tema", "piccoli"];

const scambia = <T,>(lista: T[], v: T) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);

export function ListingFiltrato({ schede, nome }: { schede: DatiCard[]; nome: string }) {
  const [servizi, setServizi] = useState<IdEsperienza[]>([]);
  const [tipi, setTipi] = useState<IdEtichetta[]>([]);
  const [zone, setZone] = useState<string[]>([]);
  const [ordine, setOrdine] = useState<Ordine>("consigliati");
  const [aperto, setAperto] = useState(false);

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
    const filtrate = schede.filter((s) => passa(s));
    const punteggio = (s: DatiCard) => s.esperienze.length + (s.verificata ? 5 : 0) + (s.contatti.whatsapp || s.contatti.telefono ? 2 : 0);
    const contatti = (s: DatiCard) => Object.values(s.contatti).filter(Boolean).length;
    return [...filtrate].sort((a, b) =>
      ordine === "nome" ? a.nome.localeCompare(b.nome) : ordine === "contatti" ? contatti(b) - contatti(a) : punteggio(b) - punteggio(a),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schede, servizi, tipi, zone, ordine]);

  // Quanti risultati darebbe ogni opzione, con gli altri filtri già attivi (come Booking).
  const conta = {
    servizio: (id: IdEsperienza) => schede.filter((s) => passa(s, "servizi") && [...servizi, id].every((x) => s.esperienze.includes(x))).length,
    tipo: (id: IdEtichetta) => schede.filter((s) => passa(s, "tipi") && s.etichetta.id === id).length,
    zona: (z: string) => schede.filter((s) => passa(s, "zone") && s.zona === z).length,
  };
  const tuttiTipi = useMemo(() => [...new Map(schede.map((s) => [s.etichetta.id, s.etichetta])).values()], [schede]);
  const tutteZone = useMemo(() => [...new Set(schede.map((s) => s.zona))].sort(), [schede]);
  const esperienzePresenti = ESPERIENZE.filter((e) => schede.some((s) => s.esperienze.includes(e.id)));
  const attivi = servizi.length + tipi.length + zone.length;
  const azzera = () => {
    setServizi([]);
    setTipi([]);
    setZone([]);
  };

  const Casella = ({ etichetta, n, on, cambia }: { etichetta: React.ReactNode; n: number; on: boolean; cambia: () => void }) => (
    <label className={`flex cursor-pointer items-center gap-2.5 py-1.5 text-sm font-semibold ${n === 0 && !on ? "text-notte/35" : "text-notte"}`}>
      <input type="checkbox" checked={on} onChange={cambia} disabled={n === 0 && !on} className="h-5 w-5 shrink-0 accent-[#9B6DD6]" />
      <span className="flex-1">{etichetta}</span>
      <span className="text-xs font-bold text-notte-tenue">{n}</span>
    </label>
  );

  const pannello = (
    <div className="flex flex-col gap-6">
      {GRUPPI.map((g) => {
        const voci = esperienzePresenti.filter((e) => e.gruppo === g);
        if (!voci.length) return null;
        return (
          <fieldset key={g}>
            <legend className="mb-1 text-sm font-black uppercase tracking-wide text-notte">{g}</legend>
            {voci.map((e) => (
              <Casella
                key={e.id}
                etichetta={
                  <>
                    <span aria-hidden>{e.icona}</span> {e.nome}
                  </>
                }
                n={conta.servizio(e.id)}
                on={servizi.includes(e.id)}
                cambia={() => setServizi((l) => scambia(l, e.id))}
              />
            ))}
          </fieldset>
        );
      })}
      {tuttiTipi.length > 1 && (
        <fieldset>
          <legend className="mb-1 text-sm font-black uppercase tracking-wide text-notte">Tipo di attività</legend>
          {tuttiTipi.map((t) => (
            <Casella
              key={t.id}
              etichetta={
                <>
                  <span aria-hidden>{t.icona}</span> {t.nome}
                </>
              }
              n={conta.tipo(t.id)}
              on={tipi.includes(t.id)}
              cambia={() => setTipi((l) => scambia(l, t.id))}
            />
          ))}
        </fieldset>
      )}
      {tutteZone.length > 1 && (
        <fieldset>
          <legend className="mb-1 text-sm font-black uppercase tracking-wide text-notte">Zona</legend>
          {tutteZone.map((z) => (
            <Casella key={z} etichetta={z} n={conta.zona(z)} on={zone.includes(z)} cambia={() => setZone((l) => scambia(l, z))} />
          ))}
        </fieldset>
      )}
      <p className="rounded-xl bg-crema p-3 text-xs leading-relaxed text-notte-tenue">
        I servizi vengono da quello che scrive il locale o dalle sue fonti ufficiali. Se un servizio non è indicato, non vuol
        dire che manchi: chiedilo, nella scheda trovi le domande pronte.
      </p>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-8">
      <aside className="hidden rounded-[1.4rem] border border-notte/10 bg-white p-5 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-black text-notte">Filtra per</span>
          {attivi > 0 && (
            <button type="button" onClick={azzera} className="text-sm font-bold text-viola">
              Azzera
            </button>
          )}
        </div>
        {pannello}
      </aside>

      <div className="flex min-w-0 flex-col gap-4">
        {/* Le esperienze più cercate, a portata di pollice. */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setAperto(true)}
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-notte bg-notte px-4 py-2 text-sm font-extrabold text-white lg:hidden"
          >
            Filtri{attivi > 0 && <span className="rounded-full bg-white px-1.5 text-xs text-notte">{attivi}</span>}
          </button>
          {RAPIDE.filter((id) => esperienzePresenti.some((e) => e.id === id)).map((id) => {
            const e = ESPERIENZE.find((x) => x.id === id)!;
            const on = servizi.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setServizi((l) => scambia(l, id))}
                className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-extrabold ${on ? "border-viola bg-viola text-white" : "border-crema-scuro bg-white text-notte"}`}
              >
                {e.icona} {e.nome}
              </button>
            );
          })}
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

        {visibili.length === 0 ? (
          <div className="rounded-[1.4rem] border-2 border-dashed border-crema-scuro bg-white p-6 text-center">
            <p className="text-lg font-black text-notte">Nessun posto con tutti questi filtri</p>
            <p className="mt-1 text-notte-tenue">Prova a toglierne uno: molti servizi i locali li offrono anche se non li scrivono.</p>
            <button type="button" onClick={azzera} className="mt-4 rounded-xl bg-viola px-5 py-2.5 font-extrabold text-white">
              Mostra tutti
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visibili.map((s) => (
              <CardRisultato key={s.chiave} s={s} cercate={servizi} />
            ))}
          </div>
        )}
      </div>

      {/* Telefono e tablet: i filtri in un pannello che sale dal basso. */}
      {aperto && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-notte/50 lg:hidden" role="dialog" aria-modal aria-label="Filtri">
          <div className="max-h-[85vh] overflow-y-auto rounded-t-[1.6rem] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xl font-black text-notte">Filtra per</span>
              <button type="button" onClick={azzera} className="text-sm font-bold text-viola">
                Azzera
              </button>
            </div>
            {pannello}
          </div>
          <div className="border-t border-notte/10 bg-white p-4">
            <button type="button" onClick={() => setAperto(false)} className="w-full rounded-2xl bg-viola py-3.5 text-lg font-black text-white">
              Mostra {visibili.length} {visibili.length === 1 ? "risultato" : "risultati"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
