"use client";

import { useCallback, useMemo, useState } from "react";
import { FOTO, LARGHEZZE, type CodiceFoto } from "@/lib/foto-dati";
import { creaZip } from "@/lib/immagini/zip";

/**
 * L'ottimizzatore immagini del pannello. Il browser legge la foto (anche la
 * HEIC dell'iPhone), la gira nel verso giusto e, se è enorme, la riduce
 * prima di spedirla; il server trova la qualità WebP più bassa che resta
 * identica a occhio e restituisce i file. Niente viene salvato sul server.
 */

type Fedelta = "leggera" | "equilibrata" | "fedele";
const FEDELTA: { id: Fedelta; nome: string; spiega: string }[] = [
  { id: "leggera", nome: "Più leggera", spiega: "per sfondi e foto piccole" },
  { id: "equilibrata", nome: "Equilibrata", spiega: "consigliata: differenze invisibili" },
  { id: "fedele", nome: "Più fedele", spiega: "per foto con tanti dettagli fini" },
];
const LATI = [2560, 1920, 1440, 1080];
/** Sotto questa soglia la foto parte com'è (il server la legge meglio). */
const INVIA_DIRETTO = 3.5 * 1024 * 1024;

interface Uscita {
  nome: string;
  larghezza: number;
  altezza: number;
  byte: number;
  dati: Uint8Array;
}
interface Voce {
  id: string;
  file: File;
  codice: CodiceFoto | "";
  stato: "pronta" | "lavoro" | "fatta" | "errore";
  errore?: string;
  qualita?: number;
  psnr?: number;
  uscite?: Uscita[];
  anteprima?: string;
}

const kb = (b: number) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
const pulito = (n: string) =>
  n
    .replace(/\.[a-z0-9]+$/i, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "immagine";

/** Se serve, ridisegna la foto nel browser: girata, ridotta, senza metadati. */
async function preparaPerInvio(file: File, lato: number): Promise<Blob> {
  const leggibile = /^image\/(jpeg|png|webp)$/.test(file.type);
  if (leggibile && file.size <= INVIA_DIRETTO) return file;
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scala = Math.min(1, lato / Math.max(bitmap.width, bitmap.height));
  const tela = document.createElement("canvas");
  tela.width = Math.round(bitmap.width * scala);
  tela.height = Math.round(bitmap.height * scala);
  tela.getContext("2d")?.drawImage(bitmap, 0, 0, tela.width, tela.height);
  const blob = (tipo: string, q?: number) =>
    new Promise<Blob>((ok, ko) => tela.toBlob((b) => (b ? ok(b) : ko(new Error("conversione"))), tipo, q));
  const png = await blob("image/png");
  return png.size <= INVIA_DIRETTO ? png : blob("image/jpeg", 0.96);
}

function scarica(nome: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function Ottimizzatore({ codice }: { codice: string }) {
  const [voci, setVoci] = useState<Voce[]>([]);
  const [lato, setLato] = useState(1920);
  const [fedelta, setFedelta] = useState<Fedelta>("equilibrata");
  const [conVarianti, setConVarianti] = useState(true);
  const [occupato, setOccupato] = useState(false);

  const aggiungi = useCallback((lista: FileList | null) => {
    if (!lista) return;
    const nuove = Array.from(lista)
      .filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))
      .map((file, i) => ({ id: `${Date.now()}-${i}-${file.name}`, file, codice: "" as const, stato: "pronta" as const }));
    setVoci((v) => [...v, ...nuove]);
  }, []);

  const cambia = (id: string, parte: Partial<Voce>) => setVoci((v) => v.map((x) => (x.id === id ? { ...x, ...parte } : x)));

  const ottimizzaTutte = useCallback(async () => {
    setOccupato(true);
    for (const voce of voci.filter((x) => x.stato !== "fatta")) {
      cambia(voce.id, { stato: "lavoro", errore: undefined });
      try {
        const scheda = voce.codice ? FOTO[voce.codice] : null;
        const modulo = new FormData();
        modulo.set("file", await preparaPerInvio(voce.file, lato));
        modulo.set("latoMassimo", String(lato));
        modulo.set("fedelta", fedelta);
        if (scheda) modulo.set("rapporto", String(scheda.rapporto));
        // Con un codice foto le varianti sono quelle che il sito si aspetta.
        if (scheda || conVarianti) modulo.set("varianti", LARGHEZZE.join(","));
        const risposta = await fetch("/api/admin/immagini", {
          method: "POST",
          headers: { "x-admin-codice": codice },
          body: modulo,
        });
        const json = await risposta.json();
        if (!risposta.ok) throw new Error(json.errore ?? "errore");
        const base = scheda ? scheda.file : pulito(voce.file.name);
        const decodifica = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        type Parte = { larghezza: number; altezza: number; byte: number; base64: string };
        const principale: Parte = json.principale;
        const uscite: Uscita[] = [principale, ...(json.varianti as Parte[])].map((p, i) => ({
          nome: i === 0 && !scheda ? `${base}.webp` : `${base}-${p.larghezza}.webp`,
          larghezza: p.larghezza,
          altezza: p.altezza,
          byte: p.byte,
          dati: decodifica(p.base64),
        }));
        cambia(voce.id, {
          stato: "fatta",
          qualita: json.qualita,
          psnr: json.psnr,
          uscite,
          anteprima: `data:image/webp;base64,${principale.base64}`,
        });
      } catch (e) {
        cambia(voce.id, { stato: "errore", errore: e instanceof Error ? e.message : "errore" });
      }
    }
    setOccupato(false);
  }, [codice, conVarianti, fedelta, lato, voci]);

  const fatte = useMemo(() => voci.filter((v) => v.stato === "fatta"), [voci]);
  const prima = fatte.reduce((a, v) => a + v.file.size, 0);
  const dopo = fatte.reduce((a, v) => a + (v.uscite?.[0]?.byte ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <label
        className="flex cursor-pointer flex-col items-center gap-2 rounded-[1.4rem] border-2 border-dashed border-viola/50 bg-viola/5 p-8 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          aggiungi(e.dataTransfer.files);
        }}
      >
        <span className="text-lg font-extrabold text-notte">Scegli o trascina le immagini</span>
        <span className="text-sm text-notte-tenue">JPG, PNG, WebP o HEIC dell&apos;iPhone. Restano tue: il server non le salva.</span>
        <input type="file" accept="image/*,.heic,.heif" multiple className="sr-only" onChange={(e) => aggiungi(e.target.files)} aria-label="Immagini da ottimizzare" />
      </label>

      <div className="grid gap-4 rounded-[1.4rem] border border-notte/10 bg-white p-5 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="font-bold text-notte">Lato lungo massimo</span>
          <select value={lato} onChange={(e) => setLato(Number(e.target.value))} className="rounded-xl border-2 border-crema-scuro px-3 py-2">
            {LATI.map((l) => (
              <option key={l} value={l}>
                {l} px{l === 1920 ? " (consigliato)" : ""}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="flex flex-col gap-1">
          <legend className="font-bold text-notte">Fedeltà</legend>
          {FEDELTA.map((f) => (
            <label key={f.id} className="flex items-center gap-2 text-sm text-notte">
              <input type="radio" name="fedelta" checked={fedelta === f.id} onChange={() => setFedelta(f.id)} className="accent-[#9B6DD6]" />
              <span>
                <strong>{f.nome}</strong> · {f.spiega}
              </span>
            </label>
          ))}
        </fieldset>
        <label className="flex items-start gap-2 text-sm text-notte">
          <input type="checkbox" checked={conVarianti} onChange={(e) => setConVarianti(e.target.checked)} className="mt-1 accent-[#9B6DD6]" />
          <span>
            <strong>Anche le misure per telefono e tablet</strong> (1440, 960, 800, 640, 480 px)
          </span>
        </label>
      </div>

      {voci.length > 0 && (
        <ul className="flex flex-col gap-3">
          {voci.map((v) => (
            <li key={v.id} data-voce={v.stato} className="rounded-[1.4rem] border border-notte/10 bg-white p-4">
              <div className="flex flex-wrap items-center gap-3">
                {v.anteprima && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.anteprima} alt="" className="h-20 w-28 rounded-xl object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold text-notte">{v.file.name}</p>
                  <p className="text-sm text-notte-tenue">
                    {kb(v.file.size)}
                    {v.uscite && (
                      <>
                        {" → "}
                        <strong className="text-verde" data-dopo={v.uscite[0].byte}>
                          {kb(v.uscite[0].byte)}
                        </strong>{" "}
                        ({v.uscite[0].larghezza}×{v.uscite[0].altezza}, −{Math.max(0, Math.round((1 - v.uscite[0].byte / v.file.size) * 100))}%, qualità{" "}
                        {v.qualita}, {v.psnr} dB)
                      </>
                    )}
                    {v.stato === "lavoro" && " · sto ottimizzando…"}
                    {v.stato === "errore" && <span className="text-rosso"> · {v.errore}</span>}
                  </p>
                </div>
                {v.stato !== "fatta" ? (
                  <label className="flex flex-col text-sm">
                    <span className="font-bold text-notte">Foto del sito (facoltativo)</span>
                    <select
                      value={v.codice}
                      onChange={(e) => cambia(v.id, { codice: e.target.value as CodiceFoto | "" })}
                      className="max-w-56 rounded-xl border-2 border-crema-scuro px-2 py-1"
                    >
                      <option value="">— nessuna, nome dal file —</option>
                      {(Object.keys(FOTO) as CodiceFoto[]).map((c) => (
                        <option key={c} value={c}>
                          {c} · {FOTO[c].file}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {v.uscite?.map((u) => (
                      <button
                        key={u.nome}
                        type="button"
                        onClick={() => scarica(u.nome, new Blob([u.dati as BlobPart], { type: "image/webp" }))}
                        className="rounded-xl border-2 border-crema-scuro px-3 py-1 text-sm font-bold text-notte"
                      >
                        {u.larghezza} px · {kb(u.byte)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={ottimizzaTutte}
          disabled={occupato || voci.every((v) => v.stato === "fatta")}
          className="rounded-2xl bg-viola px-6 py-4 text-lg font-extrabold text-white disabled:opacity-50"
        >
          {occupato ? "Sto ottimizzando…" : "Ottimizza le immagini"}
        </button>
        {fatte.length > 0 && (
          <button
            type="button"
            onClick={() =>
              scarica(
                "immagini-giocamizi.zip",
                creaZip(fatte.flatMap((v) => v.uscite ?? []).map((u) => ({ nome: u.nome, dati: u.dati }))),
              )
            }
            className="rounded-2xl border-2 border-notte bg-white px-6 py-4 text-lg font-extrabold text-notte"
          >
            Scarica tutto (ZIP)
          </button>
        )}
        {fatte.length > 0 && (
          <p className="text-sm font-bold text-notte" data-risparmio={Math.round((1 - dopo / prima) * 100)}>
            {kb(prima)} → {kb(dopo)}: −{Math.round((1 - dopo / prima) * 100)}%
          </p>
        )}
      </div>
    </div>
  );
}
