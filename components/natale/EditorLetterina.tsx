"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VARIANTI, type Variante } from "@/components/biglietti/Sfondo";
import { FOGLIO_A4 } from "@/components/biglietti/Etichette";
import { biglietoInPng } from "@/lib/condivisione";
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
  riempi,
  type Fascia,
} from "@/lib/natale";
import { FoglioLetterina, FoglioRisposta, type DatiLetterina } from "./FoglioLetterina";

/**
 * Lo strumento della letterina a Babbo Natale.
 *
 * Tutto nel browser: niente link con i dati, niente server, niente
 * salvataggi. Nome, età e desideri del bambino restano sul dispositivo
 * (regola del sito: dati dei bambini al minimo). Il download è libero;
 * dopo, si propone la posta di Mizi, senza condizioni.
 */

function scaricaPng(png: string, nome: string) {
  const link = document.createElement("a");
  link.download = nome;
  link.href = png;
  link.click();
}

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
  const foglio = useRef<HTMLDivElement>(null);
  const foglioRisposta = useRef<HTMLDivElement>(null);

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

  const scarica = useCallback(async () => {
    const svg = foglio.current?.querySelector("svg");
    if (!svg) return;
    const png = await biglietoInPng(svg, FOGLIO_A4.larghezza, FOGLIO_A4.altezza);
    scaricaPng(png, `letterina-babbo-natale${nome ? `-${nome}` : ""}.png`.toLowerCase().replace(/\s+/g, "-"));
    setScaricata(true);
  }, [nome]);

  const condividi = useCallback(async () => {
    const svg = foglio.current?.querySelector("svg");
    if (!svg) return;
    const png = await biglietoInPng(svg, FOGLIO_A4.larghezza, FOGLIO_A4.altezza);
    const blob = await (await fetch(png)).blob();
    const file = new File([blob], "letterina-babbo-natale.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "La mia letterina a Babbo Natale" }).catch(() => undefined);
    } else {
      scaricaPng(png, "letterina-babbo-natale.png");
    }
    setScaricata(true);
  }, []);

  const scaricaRisposta = useCallback(async () => {
    const svg = foglioRisposta.current?.querySelector("svg");
    if (!svg) return;
    const png = await biglietoInPng(svg, FOGLIO_A4.larghezza, FOGLIO_A4.altezza);
    scaricaPng(png, "risposta-di-babbo-natale.png");
  }, []);

  const scegli = "rounded-bolla border-2 px-3 py-2 text-sm font-bold";
  const attivo = "border-viola bg-viola text-white";
  const spento = "border-notte/15 bg-white text-notte hover:border-viola";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <div className="order-1 min-w-0 lg:order-2">
        <div className="lg:sticky lg:top-20">
          <div ref={foglio} className="mx-auto max-w-xs overflow-hidden rounded-morbido shadow-lg [&_svg]:h-auto [&_svg]:w-full" data-anteprima-letterina>
            <FoglioLetterina dati={dati} />
          </div>
          <div className="mx-auto mt-4 grid max-w-xs gap-2">
            <button type="button" onClick={scarica} className="rounded-bolla bg-viola px-5 py-3 font-extrabold text-white" data-scarica-letterina>
              Scarica la letterina (A4)
            </button>
            <button type="button" onClick={condividi} className="rounded-bolla border-2 border-viola px-5 py-2 font-extrabold text-viola">
              Condividi o manda su WhatsApp
            </button>
            <p className="text-center text-xs text-notte-tenue">
              Nome e desideri restano su questo dispositivo: la letterina si crea qui, non sui nostri server.
            </p>
          </div>
        </div>
      </div>

      <form className="order-2 grid min-w-0 gap-6 lg:order-1" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="grid gap-2">
          <legend className="font-extrabold text-notte">1. Per che età</legend>
          <div className="flex flex-wrap gap-2">
            {FASCE.map((f) => (
              <button key={f.id} type="button" onClick={() => cambiaFascia(f.id)} className={`${scegli} ${fascia === f.id ? attivo : spento}`}>
                {f.etichetta}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 font-bold text-notte">
            Nome (facoltativo)
            <input id="letterina-nome" value={nome} maxLength={24} onChange={(e) => setNome(e.target.value)} className="rounded-xl border-2 border-notte/15 px-3 py-2 font-normal" />
          </label>
          <label className="grid gap-1 font-bold text-notte">
            Anni (facoltativo)
            <input id="letterina-eta" value={eta} inputMode="numeric" maxLength={2} onChange={(e) => setEta(e.target.value.replace(/\D/g, ""))} className="rounded-xl border-2 border-notte/15 px-3 py-2 font-normal" />
          </label>
        </div>

        <fieldset className="grid gap-2">
          <legend className="font-extrabold text-notte">2. La carta da lettera</legend>
          <div className="flex flex-wrap gap-2">
            {CARTE.map((c) => (
              <button key={c.tema} type="button" onClick={() => setCarta(c.tema)} className={`${scegli} ${carta === c.tema ? attivo : spento}`}>
                {c.etichetta}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {VARIANTI.map((v) => (
              <button key={v.id} type="button" onClick={() => setVariante(v.id)} className={`${scegli} ${variante === v.id ? attivo : spento}`}>
                {v.etichetta}
              </button>
            ))}
          </div>
        </fieldset>

        <Frase titolo="3. Come cominci" valore={apertura} scelte={APERTURE[fascia].map((f) => riempi(f, nome, eta))} onChange={setApertura} id="letterina-apertura" />
        <Frase titolo="4. Com'è andato l'anno" valore={questAnno} scelte={QUEST_ANNO[fascia]} onChange={setQuestAnno} id="letterina-anno" />

        <fieldset className="grid gap-2">
          <legend className="font-extrabold text-notte">5. I desideri (al massimo {MAX_DESIDERI})</legend>
          {desideri.map((d, i) => (
            <input
              key={i}
              id={`letterina-desiderio-${i + 1}`}
              value={d}
              maxLength={MAX_CARATTERI_DESIDERIO}
              placeholder={`Desiderio ${i + 1}`}
              onChange={(e) => setDesideri((v) => v.map((x, k) => (k === i ? e.target.value : x)))}
              className="rounded-xl border-2 border-notte/15 px-3 py-2"
            />
          ))}
          {desideri.length < MAX_DESIDERI && (
            <button type="button" onClick={() => setDesideri((v) => [...v, ""])} className="w-fit text-sm font-bold text-viola underline underline-offset-2">
              + un altro desiderio
            </button>
          )}
          <p className="text-sm text-notte-tenue">Idee da toccare:</p>
          <div className="flex flex-wrap gap-2">
            {IDEE_DESIDERI[fascia].map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() =>
                  setDesideri((v) => {
                    const vuoto = v.findIndex((x) => !x.trim());
                    if (vuoto >= 0) return v.map((x, k) => (k === vuoto ? idea : x));
                    return v.length < MAX_DESIDERI ? [...v, idea] : v;
                  })
                }
                className="rounded-bolla bg-crema px-3 py-1 text-sm font-bold text-notte hover:bg-viola/10"
              >
                {idea}
              </button>
            ))}
          </div>
        </fieldset>

        <Frase titolo="6. Un pensiero per gli altri (facoltativo)" valore={pensiero} scelte={PENSIERI} onChange={setPensiero} id="letterina-pensiero" />
        <Frase titolo="7. Come saluti" valore={chiusura} scelte={CHIUSURE[fascia]} onChange={setChiusura} id="letterina-chiusura" />

        <label className="flex items-center gap-2 font-bold text-notte">
          <input type="checkbox" checked={conMizi} onChange={(e) => setConMizi(e.target.checked)} /> Metti Mizi nella letterina
        </label>
        <p className="text-sm text-notte-tenue">Lascia vuoti i campi che vuoi scrivere a mano: sul foglio diventano righe.</p>
      </form>

      {scaricata && (
        <div className="order-3 rounded-morbido border-2 border-viola/40 bg-viola/10 p-5 lg:col-span-2" data-dopo-letterina>
          <p className="font-extrabold text-viola">E la risposta di Babbo Natale?</p>
          <p className="mt-1 text-notte">
            Dal 20 dicembre, in questa pagina, si scarica la risposta di Babbo Natale da stampare: il nome lo scrivi tu a mano.
            Se vuoi il promemoria, iscriviti alla <a href="#newsletter" className="font-bold text-viola underline">posta di Mizi</a>: è
            gratis e ti cancelli quando vuoi. La letterina resta tua in ogni caso.
          </p>
        </div>
      )}

      <section className="order-4 rounded-morbido border border-notte/10 bg-white p-5 lg:col-span-2" aria-labelledby="titolo-risposta">
        <h2 id="titolo-risposta" className="text-xl font-extrabold text-notte">La risposta di Babbo Natale</h2>
        {rispostaPronta ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,12rem)_1fr] sm:items-start">
            <div ref={foglioRisposta} className="overflow-hidden rounded-xl shadow [&_svg]:h-auto [&_svg]:w-full">
              <FoglioRisposta paragrafi={RISPOSTA_BABBO_NATALE} carta={carta} variante={variante} />
            </div>
            <div className="grid gap-2">
              <p className="text-notte">Stampala, scrivi il nome a mano e lasciala sotto l&apos;albero la notte di Natale.</p>
              <button type="button" onClick={scaricaRisposta} className="w-fit rounded-bolla bg-viola px-5 py-3 font-extrabold text-white" data-scarica-risposta>
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
    </div>
  );
}

function Frase({
  titolo,
  valore,
  scelte,
  onChange,
  id,
}: {
  titolo: string;
  valore: string;
  scelte: string[];
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="font-extrabold text-notte">{titolo}</legend>
      <div className="grid gap-2">
        {scelte.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`rounded-xl border-2 px-3 py-2 text-left text-sm ${valore === s ? "border-viola bg-viola/10 font-bold text-notte" : "border-notte/10 bg-white text-notte hover:border-viola"}`}
          >
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
        className="rounded-xl border-2 border-notte/15 px-3 py-2"
      />
    </fieldset>
  );
}
