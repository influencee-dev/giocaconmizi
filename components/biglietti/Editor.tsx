"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Biglietto, type DatiBiglietto } from "./Biglietto";
import { FORMATI, frasi, misure, temi, TIPI, type FormatoId, type Tipo } from "@/lib/biglietti";
import type { Variante } from "./Sfondo";

/**
 * Il tool dei biglietti (piano §14.3).
 *
 * Tutto lato client: niente backend, niente login, niente filigrana.
 * Lo stato vive nell'URL, quindi "salva il link" e "arriva già precompilato da
 * una pagina tema" sono la stessa funzione.
 */

const VUOTO: DatiBiglietto = {
  tipo: "invito",
  tema: "palloncini",
  variante: "chiaro",
  nome: "",
  eta: "",
  frase: "",
  data: "",
  ora: "",
  luogo: "",
  conferma: "",
  firma: "",
  conMizi: false,
  carattere: "tondo",
};

export function Editor() {
  const parametri = useSearchParams();
  const [dati, setDati] = useState<DatiBiglietto>(VUOTO);
  const [formato, setFormato] = useState<FormatoId>("a6");
  const [copiato, setCopiato] = useState(false);
  const contenitore = useRef<HTMLDivElement>(null);

  // Precompilazione da querystring: è il link che arriva dalle pagine SEO.
  useEffect(() => {
    const tipo = parametri.get("tipo") as Tipo | null;
    const tema = parametri.get("tema");
    const eta = parametri.get("eta");
    const formatoUrl = parametri.get("formato") as FormatoId | null;
    const stato = parametri.get("b");

    if (stato) {
      try {
        const salvato = JSON.parse(atob(decodeURIComponent(stato))) as Partial<DatiBiglietto>;
        setDati((d) => ({ ...d, ...salvato }));
        return;
      } catch {
        // Link rovinato: si riparte dal biglietto vuoto senza messaggi d'errore.
      }
    }

    setDati((d) => ({
      ...d,
      tipo: tipo && TIPI.includes(tipo) ? tipo : d.tipo,
      tema: tema && temi.some((t) => t.theme === tema) ? tema : d.tema,
      eta: eta ?? d.eta,
    }));
    if (formatoUrl && FORMATI.some((f) => f.id === formatoUrl)) setFormato(formatoUrl);
  }, [parametri]);

  const [larghezza, altezza] = misure(formato);

  const fraseSuggerite = useMemo(
    () => frasi(dati.tipo, dati.nome || "{nome}", dati.eta || "{eta}"),
    [dati.tipo, dati.nome, dati.eta],
  );

  const aggiorna = useCallback(<K extends keyof DatiBiglietto>(chiave: K, valore: DatiBiglietto[K]) => {
    setDati((d) => ({ ...d, [chiave]: valore }));
  }, []);

  /** Trasforma l'SVG dell'anteprima in un PNG alla dimensione vera del formato. */
  const scarica = useCallback(async () => {
    const svg = contenitore.current?.querySelector("svg");
    if (!svg) return;

    const sorgente = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([sorgente], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const immagine = new Image();
    immagine.crossOrigin = "anonymous";

    await new Promise<void>((risolvi, rifiuta) => {
      immagine.onload = () => risolvi();
      immagine.onerror = () => rifiuta(new Error("immagine non caricata"));
      immagine.src = url;
    });

    const tela = document.createElement("canvas");
    tela.width = larghezza;
    tela.height = altezza;
    const pennello = tela.getContext("2d");
    if (!pennello) return;
    pennello.drawImage(immagine, 0, 0, larghezza, altezza);
    URL.revokeObjectURL(url);

    const link = document.createElement("a");
    link.download = `${dati.tipo}-${dati.nome || "compleanno"}.png`.toLowerCase().replace(/\s+/g, "-");
    link.href = tela.toDataURL("image/png");
    link.click();
  }, [altezza, larghezza, dati.nome, dati.tipo]);

  const salvaNelLink = useCallback(() => {
    const codificato = encodeURIComponent(btoa(JSON.stringify(dati)));
    const url = `${window.location.pathname}?b=${codificato}`;
    window.history.replaceState(null, "", url);
    void navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    setCopiato(true);
    window.setTimeout(() => setCopiato(false), 2500);
  }, [dati]);

  const condividi = useCallback(async () => {
    if (!navigator.share) return;
    await navigator
      .share({
        title: "Il mio biglietto",
        text: dati.frase || "Guarda il biglietto che ho fatto",
        url: window.location.href,
      })
      .catch(() => undefined);
  }, [dati.frase]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,22rem)]">
      {/* Anteprima */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-6">
          <div
            ref={contenitore}
            className="mx-auto max-w-xs overflow-hidden rounded-morbido shadow-lg"
            style={{ aspectRatio: `${larghezza} / ${altezza}` }}
          >
            <Biglietto dati={dati} larghezza={larghezza} altezza={altezza} />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={scarica}
              className="rounded-bolla bg-rosa px-6 py-4 text-lg font-extrabold text-white"
            >
              Scarica
            </button>
            <button
              type="button"
              onClick={salvaNelLink}
              className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-4 font-bold text-notte"
            >
              {copiato ? "Link copiato" : "Salva il link"}
            </button>
            <button
              type="button"
              onClick={condividi}
              className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-4 font-bold text-notte"
            >
              Condividi
            </button>
          </div>
        </div>
      </div>

      {/* Comandi */}
      <div className="order-2 flex flex-col gap-6 lg:order-1">
        <Gruppo titolo="1. Che biglietto è">
          <Scelte
            valore={dati.tipo}
            opzioni={TIPI.map((t) => ({ id: t, etichetta: t === "auguri" ? "Auguri" : t === "invito" ? "Invito" : "Grazie" }))}
            onCambia={(v) => aggiorna("tipo", v as Tipo)}
          />
          <Scelte
            valore={formato}
            opzioni={FORMATI.map((f) => ({ id: f.id, etichetta: f.nome }))}
            onCambia={(v) => setFormato(v as FormatoId)}
          />
        </Gruppo>

        <Gruppo titolo="2. Lo sfondo">
          <div className="grid grid-cols-4 gap-2">
            {temi.map((t) => (
              <button
                key={t.theme}
                type="button"
                onClick={() => aggiorna("tema", t.theme)}
                aria-pressed={dati.tema === t.theme}
                aria-label={t.label}
                title={t.label}
                className={`overflow-hidden rounded-lg border-4 ${dati.tema === t.theme ? "border-viola" : "border-transparent"}`}
                style={{ minHeight: 0, minWidth: 0 }}
              >
                <Biglietto
                  dati={{ ...VUOTO, tema: t.theme, variante: dati.variante }}
                  larghezza={100}
                  altezza={140}
                />
              </button>
            ))}
          </div>
          <Scelte
            valore={dati.variante}
            opzioni={[
              { id: "chiaro", etichetta: "Chiaro" },
              { id: "colorato", etichetta: "Colorato" },
            ]}
            onCambia={(v) => aggiorna("variante", v as Variante)}
          />
        </Gruppo>

        <Gruppo titolo="3. Che cosa c'è scritto">
          <Campo etichetta="Nome" valore={dati.nome} onCambia={(v) => aggiorna("nome", v)} placeholder="Sofia" />
          <Campo etichetta="Età" valore={dati.eta} onCambia={(v) => aggiorna("eta", v)} placeholder="5" />

          <div className="flex flex-col gap-2">
            <span className="font-bold text-notte">Frase</span>
            {fraseSuggerite.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => aggiorna("frase", f)}
                className={`rounded-morbido border-2 p-3 text-left text-sm ${
                  dati.frase === f ? "border-viola bg-viola/10" : "border-crema-scuro bg-white"
                }`}
                style={{ minHeight: 0 }}
              >
                {f}
              </button>
            ))}
            <Campo
              etichetta="Oppure scrivila tu"
              valore={dati.frase}
              onCambia={(v) => aggiorna("frase", v)}
              placeholder="Ti aspetto alla mia festa"
            />
          </div>

          {dati.tipo === "invito" && (
            <>
              <Campo etichetta="Data" valore={dati.data} onCambia={(v) => aggiorna("data", v)} placeholder="sabato 12 aprile" />
              <Campo etichetta="Ora" valore={dati.ora} onCambia={(v) => aggiorna("ora", v)} placeholder="dalle 16 alle 19" />
              <Campo etichetta="Dove" valore={dati.luogo} onCambia={(v) => aggiorna("luogo", v)} placeholder="Via dei Tigli 4" />
              <Campo
                etichetta="Conferma a"
                valore={dati.conferma}
                onCambia={(v) => aggiorna("conferma", v)}
                placeholder="333 1234567"
              />
            </>
          )}

          <Campo etichetta="Firma" valore={dati.firma} onCambia={(v) => aggiorna("firma", v)} placeholder="Sofia e mamma" />
        </Gruppo>

        <Gruppo titolo="4. Ritocchi">
          <Scelte
            valore={dati.carattere}
            opzioni={[
              { id: "tondo", etichetta: "Tondo" },
              { id: "stampatello", etichetta: "STAMPATELLO" },
            ]}
            onCambia={(v) => aggiorna("carattere", v as DatiBiglietto["carattere"])}
          />
          <label className="flex items-center gap-3 font-bold text-notte">
            <input
              type="checkbox"
              checked={dati.conMizi}
              onChange={(e) => aggiorna("conMizi", e.target.checked)}
              className="h-6 w-6 accent-[#9B6DD6]"
            />
            Metti Mizi nell&apos;angolo
          </label>
        </Gruppo>
      </div>
    </div>
  );
}

function Gruppo({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-morbido border-2 border-crema-scuro bg-white p-4">
      <h2 className="text-lg font-extrabold text-notte">{titolo}</h2>
      {children}
    </section>
  );
}

function Campo({
  etichetta,
  valore,
  onCambia,
  placeholder,
}: {
  etichetta: string;
  valore: string;
  onCambia: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-bold text-notte">{etichetta}</span>
      <input
        type="text"
        value={valore}
        placeholder={placeholder}
        onChange={(e) => onCambia(e.target.value)}
        className="rounded-morbido border-2 border-crema-scuro bg-white px-4 py-3 text-lg text-notte"
        style={{ minHeight: "3.25rem" }}
      />
    </label>
  );
}

function Scelte({
  valore,
  opzioni,
  onCambia,
}: {
  valore: string;
  opzioni: { id: string; etichetta: string }[];
  onCambia: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opzioni.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onCambia(o.id)}
          aria-pressed={valore === o.id}
          className={`rounded-bolla px-4 py-3 font-bold ${
            valore === o.id ? "bg-viola text-white" : "border-2 border-crema-scuro bg-white text-notte"
          }`}
          style={{ minHeight: "3rem", minWidth: 0 }}
        >
          {o.etichetta}
        </button>
      ))}
    </div>
  );
}
