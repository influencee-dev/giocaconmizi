"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Biglietto, type DatiBiglietto } from "./Biglietto";
import { CATALOGO_STICKER } from "./stickers";
import { biglietoInPng, datiPerLink, leggiDatiDaLink, linkInvito, numeroWhatsApp } from "@/lib/condivisione";
import { FORMATI, frasi, misure, temi, TIPI, type FormatoId, type Tipo } from "@/lib/biglietti";
import type { Variante } from "./Sfondo";

/**
 * Il tool dei biglietti (piano §14.3).
 *
 * Tutto lato client: niente backend, niente login, niente filigrana.
 * Lo stato vive nell'URL, quindi "salva il link" e "arriva già precompilato da
 * una pagina tema" sono la stessa funzione. La foto è l'unica eccezione:
 * resta nel dispositivo (entra nel PNG, mai nel link).
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
  stickers: [],
};

/** Dove atterrano gli adesivi appena aggiunti: angoli e bordi, mai sul testo. */
const POSTI_LIBERI: [number, number][] = [
  [18, 16], [82, 16], [16, 72], [84, 66], [50, 12], [14, 44], [86, 44], [50, 94],
];

const MASSIMO_STICKER = 6;

export function Editor() {
  const parametri = useSearchParams();
  const [dati, setDati] = useState<DatiBiglietto>(VUOTO);
  const [formato, setFormato] = useState<FormatoId>("a6");
  const [copiato, setCopiato] = useState(false);
  const contenitore = useRef<HTMLDivElement>(null);
  const trascinato = useRef<number | null>(null);

  // Precompilazione da querystring: è il link che arriva dalle pagine SEO.
  useEffect(() => {
    const tipo = parametri.get("tipo") as Tipo | null;
    const tema = parametri.get("tema");
    const eta = parametri.get("eta");
    const formatoUrl = parametri.get("formato") as FormatoId | null;
    const stato = parametri.get("b");

    if (stato) {
      const salvato = leggiDatiDaLink(stato);
      // Link rovinato: si riparte dal biglietto vuoto senza messaggi d'errore.
      if (salvato) {
        setDati((d) => ({ ...d, ...salvato }));
        return;
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

  /* ---------- Adesivi ---------- */

  const stickers = dati.stickers ?? [];

  const aggiungiSticker = useCallback((id: string) => {
    setDati((d) => {
      const attuali = d.stickers ?? [];
      if (attuali.length >= MASSIMO_STICKER) return d;
      const [x, y] = POSTI_LIBERI[attuali.length % POSTI_LIBERI.length];
      return { ...d, stickers: [...attuali, { id, x, y, s: 1 }] };
    });
  }, []);

  const modificaSticker = useCallback((indice: number, cambio: Partial<{ x: number; y: number; s: number }>) => {
    setDati((d) => ({
      ...d,
      stickers: (d.stickers ?? []).map((st, i) => (i === indice ? { ...st, ...cambio } : st)),
    }));
  }, []);

  const togliSticker = useCallback((indice: number) => {
    setDati((d) => ({ ...d, stickers: (d.stickers ?? []).filter((_, i) => i !== indice) }));
  }, []);

  /* Trascinamento col dito o col mouse, direttamente sull'anteprima. */
  const spostaDalPuntatore = useCallback(
    (e: React.PointerEvent) => {
      const indice = trascinato.current;
      const box = contenitore.current?.getBoundingClientRect();
      if (indice === null || !box) return;
      const x = Math.min(92, Math.max(8, ((e.clientX - box.left) / box.width) * 100));
      const y = Math.min(94, Math.max(6, ((e.clientY - box.top) / box.height) * 100));
      modificaSticker(indice, { x, y });
    },
    [modificaSticker],
  );

  const iniziaTrascinamento = useCallback((e: React.PointerEvent) => {
    const bersaglio = (e.target as Element).closest("[data-sticker]");
    if (!bersaglio) return;
    trascinato.current = Number(bersaglio.getAttribute("data-sticker"));
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, []);

  const fineTrascinamento = useCallback(() => {
    trascinato.current = null;
  }, []);

  /* ---------- Foto ---------- */

  const caricaFoto = useCallback((file: File | undefined) => {
    if (!file) return;
    const lettore = new FileReader();
    lettore.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Ridotta a 600px: abbastanza per la stampa A5, leggera per il browser.
        const lato = Math.min(600, Math.max(img.width, img.height));
        const scala = lato / Math.max(img.width, img.height);
        const tela = document.createElement("canvas");
        tela.width = Math.round(img.width * scala);
        tela.height = Math.round(img.height * scala);
        tela.getContext("2d")?.drawImage(img, 0, 0, tela.width, tela.height);
        setDati((d) => ({ ...d, foto: tela.toDataURL("image/jpeg", 0.85) }));
      };
      img.src = String(lettore.result);
    };
    lettore.readAsDataURL(file);
  }, []);

  /* ---------- Uscite: PNG, link, WhatsApp ---------- */

  const scarica = useCallback(async () => {
    const svg = contenitore.current?.querySelector("svg");
    if (!svg) return;
    const png = await biglietoInPng(svg, larghezza, altezza);
    const link = document.createElement("a");
    link.download = `${dati.tipo}-${dati.nome || "compleanno"}.png`.toLowerCase().replace(/\s+/g, "-");
    link.href = png;
    link.click();
  }, [altezza, larghezza, dati.nome, dati.tipo]);

  const salvaNelLink = useCallback(() => {
    const codificato = datiPerLink(dati);
    const url = `${window.location.pathname}?b=${codificato}`;
    window.history.replaceState(null, "", url);
    void navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    setCopiato(true);
    window.setTimeout(() => setCopiato(false), 2500);
  }, [dati]);

  const invitoDigitale = useMemo(() => linkInvito(dati), [dati]);

  const mandaSuWhatsApp = useCallback(() => {
    const testo = `${dati.nome ? `La festa di ${dati.nome}` : "Sei invitato!"} 🎉 Apri l'invito: ${window.location.origin}${invitoDigitale}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(testo)}`, "_blank", "noopener");
  }, [dati.nome, invitoDigitale]);

  const condividi = useCallback(async () => {
    const url = `${window.location.origin}${invitoDigitale}`;
    if (navigator.share) {
      await navigator
        .share({ title: "Il mio biglietto", text: dati.frase || "Guarda il biglietto che ho fatto", url })
        .catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(url).catch(() => undefined);
      setCopiato(true);
      window.setTimeout(() => setCopiato(false), 2500);
    }
  }, [dati.frase, invitoDigitale]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,22rem)]">
      {/* Anteprima */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-20">
          <div
            ref={contenitore}
            onPointerDown={iniziaTrascinamento}
            onPointerMove={spostaDalPuntatore}
            onPointerUp={fineTrascinamento}
            onPointerCancel={fineTrascinamento}
            className="mx-auto max-w-xs overflow-hidden rounded-morbido shadow-lg"
            style={{ aspectRatio: `${larghezza} / ${altezza}`, touchAction: "none" }}
          >
            <Biglietto dati={dati} larghezza={larghezza} altezza={altezza} />
          </div>
          {stickers.length > 0 && (
            <p className="mt-2 text-center text-sm font-bold text-notte-tenue">
              Trascina gli adesivi col dito per sistemarli
            </p>
          )}

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
              onClick={mandaSuWhatsApp}
              className="rounded-bolla bg-verde px-5 py-4 font-extrabold text-white"
            >
              Invia su WhatsApp
            </button>
            <button
              type="button"
              onClick={condividi}
              className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-4 font-bold text-notte"
            >
              Condividi
            </button>
            <button
              type="button"
              onClick={salvaNelLink}
              className="rounded-bolla border-2 border-crema-scuro bg-white px-5 py-4 font-bold text-notte"
            >
              {copiato ? "Link copiato" : "Salva il link"}
            </button>
          </div>
          {dati.tipo === "invito" && numeroWhatsApp(dati.conferma) && (
            <p className="mt-2 text-center text-sm text-notte-tenue">
              Chi riceve l&apos;invito troverà il bottone{" "}
              <strong>&quot;Confermo, ci saremo!&quot;</strong> che ti scrive su WhatsApp.
            </p>
          )}
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
                etichetta="Conferma a (numero WhatsApp)"
                valore={dati.conferma}
                onCambia={(v) => aggiorna("conferma", v)}
                placeholder="333 1234567"
              />
            </>
          )}

          <Campo etichetta="Firma" valore={dati.firma} onCambia={(v) => aggiorna("firma", v)} placeholder="Sofia e mamma" />
        </Gruppo>

        <Gruppo titolo="4. Adesivi">
          <div className="grid grid-cols-4 gap-2">
            {CATALOGO_STICKER.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => aggiungiSticker(v.id)}
                aria-label={`Aggiungi ${v.nome}`}
                title={v.nome}
                disabled={stickers.length >= MASSIMO_STICKER}
                className="rounded-morbido border-2 border-crema-scuro bg-white p-2 disabled:opacity-40"
                style={{ minHeight: 0, minWidth: 0 }}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
                  {v.disegno}
                </svg>
              </button>
            ))}
          </div>
          {stickers.length > 0 && (
            <div className="flex flex-col gap-2">
              {stickers.map((st, i) => {
                const voce = CATALOGO_STICKER.find((v) => v.id === st.id);
                return (
                  <div key={i} className="flex items-center gap-2 rounded-morbido border-2 border-crema-scuro bg-white p-2">
                    <svg viewBox="0 0 100 100" className="h-9 w-9 shrink-0" aria-hidden>
                      {voce?.disegno}
                    </svg>
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-notte">{voce?.nome}</span>
                    <button
                      type="button"
                      onClick={() => modificaSticker(i, { s: Math.max(0.6, st.s - 0.2) })}
                      aria-label={`Rimpicciolisci ${voce?.nome}`}
                      className="h-10 w-10 rounded-full border-2 border-crema-scuro font-extrabold text-notte"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => modificaSticker(i, { s: Math.min(2, st.s + 0.2) })}
                      aria-label={`Ingrandisci ${voce?.nome}`}
                      className="h-10 w-10 rounded-full border-2 border-crema-scuro font-extrabold text-notte"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => togliSticker(i)}
                      aria-label={`Togli ${voce?.nome}`}
                      className="h-10 w-10 rounded-full border-2 border-crema-scuro font-extrabold text-rosso"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-sm text-notte-tenue">
            Disegni nostri, senza personaggi con copyright: si possono stampare e
            regalare in tutta tranquillità.
          </p>
        </Gruppo>

        <Gruppo titolo="5. La foto del festeggiato">
          {dati.foto ? (
            <div className="flex items-center gap-3">
              {/* L'anteprima tonda replica il ritaglio sul biglietto. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dati.foto} alt="Foto scelta" className="h-16 w-16 rounded-full object-cover" />
              <button
                type="button"
                onClick={() => setDati((d) => ({ ...d, foto: undefined }))}
                className="rounded-bolla border-2 border-crema-scuro bg-white px-4 py-3 font-bold text-notte"
              >
                Togli la foto
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center rounded-morbido border-2 border-dashed border-crema-scuro bg-white p-4 font-bold text-notte-tenue">
              Scegli una foto dal telefono
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => caricaFoto(e.target.files?.[0])}
              />
            </label>
          )}
          <p className="text-sm text-notte-tenue">
            La foto resta sul tuo dispositivo: entra nel biglietto scaricato, mai
            nei link che condividi.
          </p>
        </Gruppo>

        <Gruppo titolo="6. Ritocchi">
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
