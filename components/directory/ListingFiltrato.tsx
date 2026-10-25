"use client";

import { useMemo, useState } from "react";
import type { DatiCard } from "@/lib/directory";
import { CardAttivita } from "./CardAttivita";

/**
 * Il listing con i filtri: sul desktop una colonna di caselle a sinistra,
 * su tablet e telefono una fila di chip che scorre. Si filtra solo su dati
 * veri (zona e tipo di spazio): i servizi arriveranno con le schede reclamate.
 */
export function ListingFiltrato({ schede, nome }: { schede: DatiCard[]; nome: string }) {
  const zone = useMemo(() => [...new Set(schede.map((s) => s.zona))], [schede]);
  const tipi = useMemo(() => [...new Set(schede.map((s) => s.tipo))], [schede]);
  const [zoneOn, setZoneOn] = useState<string[]>([]);
  const [tipiOn, setTipiOn] = useState<string[]>([]);

  const scambia = (lista: string[], v: string) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);
  const visibili = schede.filter(
    (s) => (!zoneOn.length || zoneOn.includes(s.zona)) && (!tipiOn.length || tipiOn.includes(s.tipo)),
  );
  const azzera = () => {
    setZoneOn([]);
    setTipiOn([]);
  };

  const Casella = ({ v, on, cambia }: { v: string; on: boolean; cambia: () => void }) => (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm font-semibold text-notte">
      <input type="checkbox" checked={on} onChange={cambia} className="h-5 w-5 shrink-0 accent-[#9B6DD6]" />
      <span>{v}</span>
    </label>
  );

  return (
    <div className="lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:items-start lg:gap-8">
      {/* Desktop: filtri a sinistra */}
      <aside className="hidden rounded-morbido border-2 border-crema-scuro bg-white p-5 lg:sticky lg:top-24 lg:block">
        <div className="flex items-center justify-between">
          <span className="text-lg font-extrabold text-notte">Filtri</span>
          <button type="button" onClick={azzera} className="text-sm font-bold text-viola">
            Azzera
          </button>
        </div>
        <p className="mt-5 text-sm font-extrabold text-notte">Zona</p>
        {zone.map((z) => (
          <Casella key={z} v={z} on={zoneOn.includes(z)} cambia={() => setZoneOn((l) => scambia(l, z))} />
        ))}
        {tipi.length > 1 && (
          <>
            <p className="mt-5 text-sm font-extrabold text-notte">Tipo di spazio</p>
            {tipi.map((t) => (
              <Casella key={t} v={t} on={tipiOn.includes(t)} cambia={() => setTipiOn((l) => scambia(l, t))} />
            ))}
          </>
        )}
      </aside>

      <div className="flex min-w-0 flex-col gap-5">
        {/* Tablet e telefono: chip delle zone che scorrono */}
        <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
          <button
            type="button"
            onClick={azzera}
            aria-pressed={!zoneOn.length}
            className={`shrink-0 rounded-bolla border-2 px-4 py-2 text-sm font-bold ${!zoneOn.length ? "border-notte bg-notte text-white" : "border-crema-scuro bg-white text-notte"}`}
          >
            Tutte le zone
          </button>
          {zone.map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setZoneOn((l) => scambia(l, z))}
              aria-pressed={zoneOn.includes(z)}
              className={`shrink-0 rounded-bolla border-2 px-4 py-2 text-sm font-bold ${zoneOn.includes(z) ? "border-viola bg-viola text-white" : "border-crema-scuro bg-white text-notte"}`}
            >
              {z}
            </button>
          ))}
        </div>

        <p className="text-lg font-extrabold text-notte" aria-live="polite">
          {visibili.length} {visibili.length === 1 ? "risultato" : nome.toLowerCase()}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibili.map((s) => (
            <CardAttivita key={s.chiave} s={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
