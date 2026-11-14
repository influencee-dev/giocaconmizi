"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { FOGLIO_A4 } from "@/components/biglietti/Etichette";
import { VARIANTI, type Variante } from "@/components/biglietti/Sfondo";
import { FoglioBusta } from "@/components/natale/FoglioBusta";
import { FoglioLetterina, type ModoLetterina } from "@/components/natale/FoglioLetterina";
import { MOTIVI } from "@/components/biglietti/motivi";
import {
  CORNICI,
  ESEMPI_DESIDERI,
  FASCE,
  FRASI,
  GRUPPI,
  MAX_CARATTERI_DESIDERIO,
  MAX_DESIDERI,
  MAX_NOME,
  MAX_TESTO_LIBERO,
  TESTO_CONDIVISIONE,
  frasiIniziali,
  nomePulito,
  testoLetterina,
  type Cornice,
  type Fascia,
  type GruppoFrasi,
  type SceltaLetterina,
} from "@/lib/natale/letterina";
import {
  condividiImmagine,
  foglioInPng,
  nomeFileLetterina,
  pngInPdf,
  scaricaUrl,
  stampaImmagine,
} from "@/lib/natale/esporta";

/**
 * L'editor della letterina. Lo stato vive solo nella pagina: niente link
 * salvabile, niente memoria del browser, niente server. Chiusa la pagina,
 * nome e desideri spariscono (lo dice anche il testo sotto i bottoni).
 */

const MODI: { id: ModoLetterina; etichetta: string; nota: string }[] = [
  { id: "scritta", etichetta: "Già scritta", nota: "scegli le frasi qui sotto" },
  { id: "righe", etichetta: "A righe, da scrivere a mano", nota: "per chi scrive da solo" },
];

const { larghezza: W, altezza: H } = FOGLIO_A4;

export function EditorLetterina() {
  const [scelta, setScelta] = useState<SceltaLetterina>({
    fascia: "6-8",
    nome: "",
    eta: "",
    frasi: frasiIniziali(),
    testoLibero: "",
    desideri: ["", "", ""],
  });
  const [variante, setVariante] = useState<Variante>("chiaro");
  const [modo, setModo] = useState<ModoLetterina>("scritta");
  const [cornice, setCornice] = useState<Cornice>("natale");
  const [stato, setStato] = useState("");
  const foglio = useRef<HTMLDivElement>(null);
  const busta = useRef<HTMLDivElement>(null);

  const testo = useMemo(() => testoLetterina(scelta), [scelta]);
  const nomeFile = nomePulito(scelta.nome);

  const cambiaFascia = (fascia: Fascia) => setScelta((s) => ({ ...s, fascia, frasi: frasiIniziali() }));

  const spunta = (gruppo: GruppoFrasi, indice: number) =>
    setScelta((s) => {
      const attuali = s.frasi[gruppo] ?? [];
      const nuove = attuali.includes(indice) ? attuali.filter((i) => i !== indice) : [...attuali, indice];
      return { ...s, frasi: { ...s.frasi, [gruppo]: nuove } };
    });

  const cambiaDesiderio = (i: number, valore: string) =>
    setScelta((s) => {
      const desideri = [...s.desideri];
      desideri[i] = valore.slice(0, MAX_CARATTERI_DESIDERIO);
      return { ...s, desideri };
    });

  const png = useCallback(async () => {
    const svg = foglio.current?.querySelector("svg");
    if (!svg) throw new Error("foglio non pronto");
    return foglioInPng(svg, W, H);
  }, []);

  const pngBusta = useCallback(async () => {
    const svg = busta.current?.querySelector("svg");
    if (!svg) throw new Error("busta non pronta");
    return foglioInPng(svg, W, H);
  }, []);

  const esegui = useCallback(
    async (azione: () => Promise<string | void>, messaggio: string) => {
      setStato("Preparo il foglio…");
      try {
        const esito = await azione();
        setStato(esito || messaggio);
      } catch {
        setStato("Non sono riuscita a preparare il foglio: riprova tra un attimo.");
      }
    },
    [],
  );

  const scaricaPng = () =>
    esegui(async () => scaricaUrl(await png(), nomeFileLetterina(nomeFile, "png")), "Fatto: trovi l'immagine nei download.");

  const scaricaPdf = () =>
    esegui(async () => {
      const pdf = await pngInPdf(await png(), W, H);
      const url = URL.createObjectURL(pdf);
      scaricaUrl(url, nomeFileLetterina(nomeFile, "pdf"));
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    }, "Fatto: trovi il PDF nei download, pronto da stampare in A4.");

  const stampa = () => esegui(async () => stampaImmagine(await png()), "Si apre la finestra di stampa: scegli A4.");

  const scaricaBusta = () =>
    esegui(async () => {
      const pdf = await pngInPdf(await pngBusta(), W, H);
      const url = URL.createObjectURL(pdf);
      scaricaUrl(url, nomeFileLetterina(nomeFile, "pdf").replace("letterina-", "busta-"));
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    }, "Fatto: la busta da colorare è nei download.");

  const stampaBusta = () => esegui(async () => stampaImmagine(await pngBusta()), "Si apre la finestra di stampa della busta: scegli A4.");

  const condividi = () =>
    esegui(async () => {
      const esito = await condividiImmagine(await png(), nomeFileLetterina(nomeFile, "png"), TESTO_CONDIVISIONE);
      return esito === "condivisa" ? "Condivisa!" : "Il telefono non permette la condivisione diretta: l'immagine è nei download.";
    }, "");

  const fascia = FASCE.find((f) => f.id === scelta.fascia)!;
  const esempi = ESEMPI_DESIDERI[scelta.fascia];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,24rem)]" data-editor-letterina>
      {/* Anteprima */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-20">
          <div
            ref={foglio}
            className="mx-auto max-w-sm overflow-hidden rounded-morbido bg-white shadow-lg [&>svg]:h-full [&>svg]:w-full"
            style={{ aspectRatio: `${W} / ${H}` }}
          >
            <FoglioLetterina testo={testo} variante={variante} modo={modo} cornice={cornice} />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={scaricaPdf} className="rounded-bolla bg-rosa px-6 py-4 text-lg font-extrabold text-white" data-scarica-letterina-pdf>
              Scarica il PDF
            </button>
            <button type="button" onClick={stampa} className="rounded-bolla bg-viola px-5 py-4 font-extrabold text-white" data-stampa-letterina>
              Stampa
            </button>
            <button type="button" onClick={scaricaPng} className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-4 font-bold text-notte" data-scarica-letterina-png>
              Immagine (PNG)
            </button>
            <button type="button" onClick={condividi} className="rounded-bolla bg-verde px-5 py-4 font-extrabold text-white" data-condividi-letterina>
              Condividi
            </button>
          </div>
          <p className="mt-3 text-center text-sm font-bold text-notte-tenue" role="status" aria-live="polite" data-stato-letterina>
            {stato}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-notte-tenue">
            Nome e desideri restano sul tuo telefono: non li riceviamo e non li salviamo. Chiusa la pagina, spariscono.
          </p>
        </div>
      </div>

      {/* Scelte */}
      <div className="order-2 flex flex-col gap-8 lg:order-1">
        <section>
          <h2 className="text-xl font-extrabold text-notte">1. Chi scrive</h2>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Età di chi scrive">
            {FASCE.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={scelta.fascia === f.id}
                onClick={() => cambiaFascia(f.id)}
                className={`rounded-bolla px-5 py-3 font-extrabold ${scelta.fascia === f.id ? "bg-viola text-white" : "border-2 border-crema-scuro bg-white text-notte"}`}
                data-fascia={f.id}
              >
                {f.etichetta}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-notte-tenue">{fascia.nota}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_8rem]">
            <label className="flex flex-col gap-1 font-bold text-notte">
              Nome
              <input
                value={scelta.nome}
                maxLength={MAX_NOME}
                onChange={(e) => setScelta((s) => ({ ...s, nome: e.target.value }))}
                placeholder="Lascia vuoto per scriverlo a penna"
                className="rounded-morbido border-2 border-crema-scuro bg-white px-4 py-3 font-normal"
                autoComplete="off"
                data-campo-nome-letterina
              />
            </label>
            <label className="flex flex-col gap-1 font-bold text-notte">
              Anni
              <input
                value={scelta.eta}
                inputMode="numeric"
                maxLength={2}
                onChange={(e) => setScelta((s) => ({ ...s, eta: e.target.value.replace(/\D/g, "") }))}
                className="rounded-morbido border-2 border-crema-scuro bg-white px-4 py-3 font-normal"
                autoComplete="off"
                data-campo-eta-letterina
              />
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-notte">2. Il foglio</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {MODI.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={modo === m.id}
                onClick={() => setModo(m.id)}
                className={`rounded-bolla px-5 py-3 font-extrabold ${modo === m.id ? "bg-viola text-white" : "border-2 border-crema-scuro bg-white text-notte"}`}
                data-modo-letterina={m.id}
              >
                {m.etichetta}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Cornice">
            {CORNICI.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={cornice === c.id}
                onClick={() => setCornice(c.id)}
                className={`flex flex-col items-center gap-1 rounded-morbido border-4 bg-white p-2 text-xs font-bold text-notte ${cornice === c.id ? "border-viola" : "border-crema-scuro"}`}
                data-cornice-letterina={c.id}
              >
                <svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden>
                  {MOTIVI[c.id].motivo(MOTIVI[c.id].tinte)}
                </svg>
                {c.etichetta}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {VARIANTI.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={variante === v.id}
                onClick={() => setVariante(v.id)}
                className={`rounded-bolla px-4 py-2 font-bold ${variante === v.id ? "bg-notte text-white" : "border-2 border-crema-scuro bg-white text-notte"}`}
                data-variante-letterina={v.id}
              >
                {v.etichetta}
              </button>
            ))}
          </div>
        </section>

        {modo === "scritta" && (
          <>
            <section>
              <h2 className="text-xl font-extrabold text-notte">3. Le frasi</h2>
              <p className="mt-1 text-sm text-notte-tenue">Tocca le frasi che vuoi nella letterina: si possono scegliere anche tutte.</p>
              <div className="mt-3 flex flex-col gap-5">
                {GRUPPI.map((g) => (
                  <fieldset key={g.id} className="flex flex-col gap-2">
                    <legend className="mb-1 font-bold text-notte">{g.titolo}</legend>
                    {FRASI[scelta.fascia][g.id].map((frase, i) => (
                      <label key={i} className="flex items-start gap-3 text-notte">
                        <input
                          type="checkbox"
                          checked={(scelta.frasi[g.id] ?? []).includes(i)}
                          onChange={() => spunta(g.id, i)}
                          className="mt-1 h-5 w-5 shrink-0 accent-[#9B6DD6]"
                          data-frase-letterina={`${g.id}-${i}`}
                        />
                        <span>{frase.replaceAll("{nome}", nomePulito(scelta.nome) || "…").replaceAll("{eta}", scelta.eta || "…")}</span>
                      </label>
                    ))}
                  </fieldset>
                ))}
                <label className="flex flex-col gap-1 font-bold text-notte">
                  Scrivi tu (facoltativo)
                  <textarea
                    value={scelta.testoLibero}
                    maxLength={MAX_TESTO_LIBERO}
                    rows={3}
                    onChange={(e) => setScelta((s) => ({ ...s, testoLibero: e.target.value }))}
                    className="rounded-morbido border-2 border-crema-scuro bg-white px-4 py-3 font-normal"
                    data-testo-libero-letterina
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-notte">4. I desideri</h2>
              <p className="mt-1 text-sm text-notte-tenue">Fino a {MAX_DESIDERI}. Le caselle vuote non compaiono.</p>
              <div className="mt-3 flex flex-col gap-2">
                {scelta.desideri.map((d, i) => (
                  <input
                    key={i}
                    value={d}
                    maxLength={MAX_CARATTERI_DESIDERIO}
                    onChange={(e) => cambiaDesiderio(i, e.target.value)}
                    placeholder={esempi[i] ? `Per esempio: ${esempi[i]}` : "Un altro desiderio"}
                    aria-label={`Desiderio ${i + 1}`}
                    className="rounded-morbido border-2 border-crema-scuro bg-white px-4 py-3"
                    autoComplete="off"
                    data-campo-desiderio={i + 1}
                  />
                ))}
                {scelta.desideri.length < MAX_DESIDERI && (
                  <button
                    type="button"
                    onClick={() => setScelta((s) => ({ ...s, desideri: [...s.desideri, ""] }))}
                    className="self-start rounded-bolla border-2 border-dashed border-crema-scuro bg-white px-4 py-2 font-bold text-notte"
                    data-aggiungi-desiderio
                  >
                    + Aggiungi un desiderio
                  </button>
                )}
              </div>
            </section>
          </>
        )}

        <section data-sezione-busta>
          <h2 className="text-xl font-extrabold text-notte">{modo === "scritta" ? "5" : "3"}. La busta da colorare</h2>
          <p className="mt-1 text-sm text-notte-tenue">
            Si stampa su un A4, si colora, si ritaglia e si piega: dentro ci sta la letterina piegata in quattro.
            Davanti c&apos;è «A: Babbo Natale» e il francobollo da colorare{scelta.nome.trim() ? ", con il nome di chi scrive" : ""}.
          </p>
          <div className="mt-3 grid items-start gap-4 sm:grid-cols-[10rem_1fr]">
            <div
              ref={busta}
              className="w-40 overflow-hidden rounded-morbido border-2 border-crema-scuro bg-white [&>svg]:h-full [&>svg]:w-full"
              style={{ aspectRatio: `${W} / ${H}` }}
            >
              <FoglioBusta mittente={nomePulito(scelta.nome)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={scaricaBusta} className="rounded-bolla bg-rosa px-5 py-3 font-extrabold text-white" data-scarica-busta>
                Scarica la busta (PDF)
              </button>
              <button type="button" onClick={stampaBusta} className="rounded-bolla bg-viola px-5 py-3 font-extrabold text-white" data-stampa-busta>
                Stampa la busta
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
