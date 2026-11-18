"use client";

import { useMemo, useState, useTransition } from "react";
import { CircleAlert, CircleCheck, ExternalLink, LoaderCircle, Sparkles } from "lucide-react";
import { campiPerCategoria, testoValore, type IdCampo } from "@/lib/directory/scheda-campi";
import { proponi, salva, type EsitoProposta, type EsitoSalva } from "./azioni";

export interface SchedaScelta {
  chiave: string;
  nome: string;
  citta: string;
  categoria: string;
  nomeCategoria: string;
  sito?: string;
  instagram?: string;
}

/**
 * L'importazione con l'AI nel pannello: scegli la scheda, controlla i link,
 * l'AI propone i campi con la frase della fonte accanto, tu tieni quelli giusti
 * e decidi se pubblicare subito o lasciarli pronti per l'attività.
 */
export function Importatore({ codice, schede }: { codice: string; schede: SchedaScelta[] }) {
  const [cerca, setCerca] = useState("");
  const [scelta, setScelta] = useState<SchedaScelta | null>(null);
  const [link, setLink] = useState<string[]>(["", "", ""]);
  const [esito, setEsito] = useState<EsitoProposta | null>(null);
  const [tieni, setTieni] = useState<Set<string>>(new Set());
  const [salvato, setSalvato] = useState<EsitoSalva | null>(null);
  const [inCorso, avvia] = useTransition();

  const trovate = useMemo(() => {
    const q = cerca.trim().toLowerCase();
    if (q.length < 2) return [];
    return schede.filter((s) => `${s.nome} ${s.citta}`.toLowerCase().includes(q)).slice(0, 8);
  }, [cerca, schede]);

  function scegli(s: SchedaScelta) {
    setScelta(s);
    setCerca("");
    setLink([s.sito ?? "", s.instagram ?? "", ""]);
    setEsito(null);
    setSalvato(null);
  }

  function chiediAllAi() {
    if (!scelta) return;
    setSalvato(null);
    avvia(async () => {
      const r = await proponi(codice, scelta.chiave, link);
      setEsito(r);
      if (r.stato === "ok") setTieni(new Set(Object.keys(r.proposta.scheda.valori)));
    });
  }

  function registra(pubblica: boolean) {
    if (!scelta || esito?.stato !== "ok") return;
    avvia(async () => setSalvato(await salva(codice, scelta.chiave, esito.proposta.scheda, [...tieni], pubblica)));
  }

  const campi = scelta ? campiPerCategoria(scelta.categoria) : [];

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[1.4rem] border border-notte/10 bg-white p-5">
        <label className="font-extrabold text-notte" htmlFor="cerca-scheda">1. Quale scheda?</label>
        {scelta ? (
          <p className="mt-2 flex flex-wrap items-center gap-3 text-lg font-extrabold text-notte">
            {scelta.nome} <span className="text-base font-bold text-notte-tenue">· {scelta.citta} · {scelta.nomeCategoria}</span>
            <button type="button" onClick={() => setScelta(null)} className="text-sm font-extrabold text-viola">Cambia</button>
          </p>
        ) : (
          <>
            <input
              id="cerca-scheda"
              value={cerca}
              onChange={(e) => setCerca(e.target.value)}
              placeholder="Scrivi il nome del locale o la città"
              className="mt-2 w-full rounded-2xl border-2 border-crema-scuro px-4 py-3"
            />
            <ul className="mt-2 flex flex-col gap-1">
              {trovate.map((s) => (
                <li key={s.chiave}>
                  <button type="button" onClick={() => scegli(s)} className="w-full rounded-xl px-3 py-2 text-left hover:bg-crema">
                    <span className="font-extrabold text-notte">{s.nome}</span> <span className="text-sm text-notte-tenue">· {s.citta} · {s.nomeCategoria}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {scelta && (
        <section className="rounded-[1.4rem] border border-notte/10 bg-white p-5">
          <p className="font-extrabold text-notte">2. Da dove leggere</p>
          <p className="mt-1 text-sm text-notte-tenue">
            Sito ufficiale e link di post, reel o video pubblici (Instagram, YouTube, TikTok). Il profilo Instagram intero non si legge: serve il link di un post.
            Si leggono solo i testi: nessuna foto viene presa.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {link.map((v, i) => (
              <input
                key={i}
                value={v}
                onChange={(e) => setLink(link.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={i === 0 ? "https://sito-ufficiale.it" : "https://www.instagram.com/p/…"}
                className="rounded-2xl border-2 border-crema-scuro px-4 py-2.5"
              />
            ))}
            {link.length < 6 && (
              <button type="button" onClick={() => setLink([...link, ""])} className="self-start text-sm font-extrabold text-viola">+ un altro link</button>
            )}
          </div>
          <button
            type="button"
            onClick={chiediAllAi}
            disabled={inCorso || !link.some((x) => x.trim())}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-viola px-5 py-3 font-extrabold text-white disabled:opacity-50"
          >
            {inCorso ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Sparkles className="h-5 w-5" aria-hidden />}
            {inCorso ? "L'AI sta leggendo…" : "Proponi la scheda con l'AI"}
          </button>
        </section>
      )}

      {esito && (
        <section className="rounded-[1.4rem] border border-notte/10 bg-white p-5" data-proposta>
          {esito.esiti && (
            <ul className="mb-4 flex flex-col gap-1 text-sm">
              {esito.esiti.map((f) => (
                <li key={f.url} className={`flex items-start gap-2 ${f.ok ? "text-[#2E7D4A]" : "text-rosso"}`}>
                  {f.ok ? <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
                  <span className="break-all">{f.url}: {f.nota}</span>
                </li>
              ))}
            </ul>
          )}
          {esito.stato === "errore" ? (
            <p className="rounded-xl bg-rosso/10 px-4 py-3 font-bold text-rosso">{esito.messaggio}</p>
          ) : (
            <>
              <p className="font-extrabold text-notte">3. Controlla: tieni solo quello che è giusto</p>
              {esito.proposta.note && <p className="mt-1 text-sm text-notte-tenue">Nota dell&apos;AI: {esito.proposta.note}</p>}
              {Object.keys(esito.proposta.scheda.valori).length === 0 && (
                <p className="mt-3 font-bold text-notte">Nelle fonti non c&apos;era niente di utilizzabile per la scheda.</p>
              )}
              <ul className="mt-3 flex flex-col gap-2">
                {campi
                  .filter((c) => esito.proposta.scheda.valori[c.id as IdCampo] !== undefined)
                  .map((c) => {
                    const cit = esito.proposta.citazioni[c.id];
                    const on = tieni.has(c.id);
                    return (
                      <li key={c.id} className={`rounded-xl border-2 px-4 py-3 ${on ? "border-viola/40 bg-viola/5" : "border-crema-scuro bg-white opacity-60"}`}>
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => {
                              const n = new Set(tieni);
                              if (on) n.delete(c.id);
                              else n.add(c.id);
                              setTieni(n);
                            }}
                            className="mt-1 h-5 w-5 accent-viola"
                          />
                          <span className="min-w-0">
                            <span className="block text-xs font-extrabold uppercase text-notte-tenue">{c.etichetta}</span>
                            <span className="block whitespace-pre-line font-bold text-notte">{testoValore(c, esito.proposta.scheda.valori[c.id as IdCampo]!)}</span>
                            {cit && (
                              <span className="mt-1 block text-xs text-notte-tenue">
                                «{cit.citazione}» ·{" "}
                                <a href={cit.fonte} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold text-viola">
                                  fonte <ExternalLink className="h-3 w-3" aria-hidden />
                                </a>
                              </span>
                            )}
                          </span>
                        </label>
                      </li>
                    );
                  })}
              </ul>
              {esito.proposta.scartati.length > 0 && (
                <p className="mt-3 text-xs text-notte-tenue">Scartati in automatico: {esito.proposta.scartati.join("; ")}</p>
              )}
              {Object.keys(esito.proposta.scheda.valori).length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" disabled={inCorso || !tieni.size} onClick={() => registra(true)} className="rounded-2xl bg-viola px-5 py-3 font-extrabold text-white disabled:opacity-50">
                    Pubblica sulla scheda ({tieni.size} campi)
                  </button>
                  <button type="button" disabled={inCorso || !tieni.size} onClick={() => registra(false)} className="rounded-2xl border-2 border-crema-scuro bg-white px-5 py-3 font-extrabold text-notte disabled:opacity-50">
                    Salva solo per l&apos;attività
                  </button>
                </div>
              )}
              <p className="mt-2 text-xs text-notte-tenue">
                Pubblicata, la scheda dice «Dati presi dal sito ufficiale · da confermare»: il bollino «Verificata» arriva solo quando conferma l&apos;attività.
              </p>
            </>
          )}
        </section>
      )}

      {salvato && (
        <p className={`rounded-xl px-4 py-3 font-bold ${salvato.stato === "ok" ? "bg-[#E3F4E7] text-[#2E7D4A]" : "bg-rosso/10 text-rosso"}`} data-salvato>
          {salvato.messaggio}{" "}
          {salvato.stato === "ok" && salvato.href && (
            <a href={salvato.href} target="_blank" rel="noopener noreferrer" className="underline">Apri la scheda</a>
          )}
        </p>
      )}
    </div>
  );
}
