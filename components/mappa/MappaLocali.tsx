"use client";

import { Icona, type NomeIcona } from "@/components/icone";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

/**
 * La mappa open source dei locali: Leaflet (BSD) con le mappe di
 * OpenStreetMap (© contributori OSM, ODbL). Si carica SOLO quando la persona
 * tocca «Mostra la mappa»: le immagini della mappa arrivano dai server della
 * OpenStreetMap Foundation, che così riceve l'indirizzo IP (niente cookie).
 * Stessa regola dei reel di Instagram: niente terze parti senza un gesto.
 *
 * Segnaposto: un cerchio del colore dell'etichetta con la sua icona; se la
 * posizione è solo quella della zona, il cerchio è tratteggiato e il fumetto
 * lo dice.
 */

export interface Punto {
  lat: number;
  lng: number;
  nome: string;
  href: string;
  /** Nome dell'icona 3D (public/icone/), come l'etichetta. */
  icona: NomeIcona;
  colore: string;
  sotto: string;
  approssimativa?: boolean;
  /** Numero sul segnaposto (mappa delle città). */
  numero?: number;
}

export function MappaLocali({
  punti,
  centro,
  zoom = 12,
  titolo = "Mostra la mappa",
  nota,
  subito = false,
  alta = "h-80 sm:h-[26rem]",
}: {
  punti: Punto[];
  centro: [number, number];
  zoom?: number;
  titolo?: string;
  nota?: string;
  /** Aperta subito: SOLO quando è già il risultato di un gesto (l'interruttore «Mappa»). */
  subito?: boolean;
  alta?: string;
}) {
  const [aperta, setAperta] = useState(subito);
  const contenitore = useRef<HTMLDivElement>(null);
  const mappa = useRef<import("leaflet").Map | null>(null);
  const strato = useRef<import("leaflet").LayerGroup | null>(null);

  // Crea la mappa la prima volta che si apre.
  useEffect(() => {
    if (!aperta || !contenitore.current || mappa.current) return;
    let annullato = false;
    void import("leaflet").then((L) => {
      if (annullato || !contenitore.current) return;
      const m = L.map(contenitore.current, { scrollWheelZoom: false }).setView(centro, zoom);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(m);
      mappa.current = m;
      strato.current = L.layerGroup().addTo(m);
      disegna(L);
    });
    return () => {
      annullato = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aperta]);

  // Ridisegna i segnaposto quando cambiano (i filtri del listing).
  useEffect(() => {
    if (!mappa.current) return;
    void import("leaflet").then((L) => disegna(L));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [punti]);

  function disegna(L: typeof import("leaflet")) {
    const m = mappa.current;
    const g = strato.current;
    if (!m || !g) return;
    g.clearLayers();
    const confini: [number, number][] = [];
    for (const p of punti) {
      const dentro = p.numero !== undefined ? `<b>${p.numero}</b>` : `<img src="/icone/${p.icona}.png" alt="" width="22" height="22">`;
      const icona = L.divIcon({
        className: "",
        html: `<span style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:999px;background:${p.colore};border:3px ${p.approssimativa ? "dashed" : "solid"} #fff;box-shadow:0 4px 12px rgba(31,36,48,.35);font-size:${p.numero !== undefined ? 15 : 19}px;color:#1F2430;font-family:Nunito,system-ui,sans-serif">${dentro}</span>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -18],
      });
      const sicuro = (t: string) => t.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
      L.marker([p.lat, p.lng], { icon: icona, title: p.nome })
        .bindPopup(
          `<div style="font-family:Nunito,system-ui,sans-serif"><b style="font-size:15px">${sicuro(p.nome)}</b><br><span style="color:#4A5164">${sicuro(p.sotto)}</span>${
            p.approssimativa ? '<br><span style="color:#4A5164;font-size:12px">Posizione indicativa: la zona</span>' : ""
          }<br><a href="${p.href}" style="font-weight:800;color:#9B6DD6">Vedi la scheda ›</a></div>`,
        )
        .addTo(g);
      confini.push([p.lat, p.lng]);
    }
    if (confini.length > 1) m.fitBounds(confini, { padding: [40, 40], maxZoom: 14 });
    else if (confini.length === 1) m.setView(confini[0], 14);
  }

  if (!aperta) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-[1.4rem] border-2 border-dashed border-crema-scuro bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-black text-notte"><Icona nome="mappa" className="h-6 w-6" /> {punti.length} {punti.length === 1 ? "posto" : "posti"} sulla mappa</p>
          <p className="text-sm text-notte-tenue">
            La mappa è di OpenStreetMap e si carica solo se la apri.{nota ? ` ${nota}` : ""}
          </p>
        </div>
        <button type="button" onClick={() => setAperta(true)} className="shrink-0 rounded-2xl bg-notte px-5 py-3 font-extrabold text-white" data-apri-mappa>
          {titolo}
        </button>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-notte/10">
      <div ref={contenitore} className={`w-full ${alta}`} data-mappa />
    </div>
  );
}
