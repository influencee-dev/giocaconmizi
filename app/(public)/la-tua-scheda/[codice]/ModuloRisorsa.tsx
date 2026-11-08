"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { rispondiRisorsa, type Esito } from "./azioni";

/**
 * Il link personale di una risorsa educativa: approva, completa (con logo) o
 * togli la scheda. Come ModuloRisposta delle attività, con i campi delle risorse.
 */

type Scelta = "approva" | "modifica" | "rimuovi";

export interface ValoriRisorsa {
  descrizione: string;
  cosaFa: string;
  perChi: string;
  comeSiUsa: string;
  costi: string;
  sito: string;
}

const SCELTE: { id: Scelta; titolo: string; testo: string }[] = [
  { id: "approva", titolo: "Approvo", testo: "La scheda va bene così: la pubblichiamo come verificata, con la vostra pagina." },
  { id: "modifica", titolo: "Voglio completarla", testo: "Correggo i testi e aggiungo contatti, sede, orari e social." },
  { id: "rimuovi", titolo: "Non voglio comparire", testo: "Togliamo la scheda dal sito, senza domande." },
];

const COSTI = ["Gratuito", "A pagamento", "In parte gratuito", "Da verificare sul sito"];
const CLASSE = "w-full rounded-xl border-2 border-crema-scuro bg-white px-4 py-3 text-base text-notte";

function Campo({ nome, etichetta, valore, aiuto, area, tipo = "text" }: { nome: string; etichetta: string; valore?: string; aiuto?: string; area?: boolean; tipo?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-extrabold text-notte">{etichetta}</span>
      {area ? <textarea name={nome} defaultValue={valore} rows={3} className={CLASSE} /> : <input name={nome} type={tipo} defaultValue={valore} className={CLASSE} />}
      {aiuto && <span className="text-xs font-semibold text-notte-tenue">{aiuto}</span>}
    </label>
  );
}

/** Riduce il logo nel browser (lato massimo 512 px) prima di mandarlo: invio leggero anche dal telefono. */
async function riduci(file: File): Promise<Blob> {
  const img = await createImageBitmap(file);
  const scala = Math.min(1, 512 / Math.max(img.width, img.height));
  const tela = document.createElement("canvas");
  tela.width = Math.max(1, Math.round(img.width * scala));
  tela.height = Math.max(1, Math.round(img.height * scala));
  tela.getContext("2d")!.drawImage(img, 0, 0, tela.width, tela.height);
  return new Promise((ok, ko) => tela.toBlob((b) => (b ? ok(b) : ko(new Error("immagine"))), "image/png"));
}

export function ModuloRisorsa({ codice, valori, nome }: { codice: string; valori: ValoriRisorsa; nome: string }) {
  const [scelta, setScelta] = useState<Scelta | null>(null);
  const [logo, setLogo] = useState<{ blob: Blob; anteprima: string } | null>(null);
  const [erroreLogo, setErroreLogo] = useState("");
  const [esito, invia, inviando] = useActionState<Esito, FormData>(rispondiRisorsa, { stato: "fermo" });
  const [inTransizione, avvia] = useTransition();
  const inCorso = inviando || inTransizione;

  if (esito.stato === "ok") {
    return (
      <div className="rounded-morbido border-2 border-verde bg-white p-6">
        <p className="text-xl font-extrabold text-notte">Grazie, risposta ricevuta!</p>
        <p className="mt-2 text-notte-tenue">
          {esito.tipo === "rimuovi"
            ? `Togliamo ${nome} dal sito entro 48 ore e ti scriviamo per conferma.`
            : `Controlliamo e pubblichiamo entro 48 ore: ${nome} avrà la sua pagina con il bollino «Scheda verificata». Ti scriviamo quando è online.`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {SCELTE.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScelta(s.id)}
            aria-pressed={scelta === s.id}
            className={`flex flex-col gap-1 rounded-morbido border-2 p-4 text-left transition-colors ${scelta === s.id ? "border-viola bg-viola/10" : "border-crema-scuro bg-white hover:border-viola"}`}
          >
            <span className="text-lg font-extrabold text-notte">{s.titolo}</span>
            <span className="text-sm font-semibold text-notte-tenue">{s.testo}</span>
          </button>
        ))}
      </div>

      {scelta && (
        <form
          // onSubmit e non action={}: dopo un errore il modulo non si svuota.
          onSubmit={(e) => {
            e.preventDefault();
            const dati = new FormData(e.currentTarget);
            dati.delete("logo-file");
            if (logo) dati.set("logo", logo.blob, "logo.png");
            avvia(() => invia(dati));
          }}
          className="flex flex-col gap-4 rounded-[1.4rem] border border-notte/10 bg-white p-5"
        >
          <input type="hidden" name="codice" value={codice} />
          <input type="hidden" name="tipo" value={scelta} />

          {scelta !== "rimuovi" && (
            <div className="flex flex-col gap-2 rounded-xl bg-crema px-4 py-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-extrabold text-notte">Il vostro logo (facoltativo)</span>
                <input
                  name="logo-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="text-sm text-notte file:mr-3 file:rounded-xl file:border-0 file:bg-viola file:px-4 file:py-2 file:font-extrabold file:text-white"
                  onChange={async (e) => {
                    setErroreLogo("");
                    const f = e.currentTarget.files?.[0];
                    if (!f) return setLogo(null);
                    if (f.size > 8_000_000) return setErroreLogo("L'immagine è troppo grande (massimo 8 MB).");
                    try {
                      const blob = await riduci(f);
                      setLogo({ blob, anteprima: URL.createObjectURL(blob) });
                    } catch {
                      setErroreLogo("Non riusciamo a leggere questa immagine: prova con un PNG o un JPG.");
                    }
                  }}
                />
                <span className="text-xs font-semibold text-notte-tenue">
                  PNG, JPG o WebP, meglio quadrato e su fondo chiaro. Caricandolo confermate di poterlo usare: lo mostriamo solo sulla vostra scheda, dopo averlo controllato.
                </span>
              </label>
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element -- anteprima locale (blob:)
                <img src={logo.anteprima} alt="Anteprima del logo" width={64} height={64} className="h-16 w-16 rounded-2xl border border-notte/10 bg-white object-contain p-1" />
              )}
              {erroreLogo && <p role="alert" className="text-sm font-bold text-rosso">{erroreLogo}</p>}
            </div>
          )}

          {scelta === "modifica" && (
            <>
              <p className="font-extrabold text-notte">I dati della scheda</p>
              <p className="-mt-2 text-sm font-semibold text-notte-tenue">
                Scrivete come lo spieghereste a un genitore o a un&apos;insegnante: cosa fate, per che età, come si partecipa.
              </p>
              <Campo nome="descrizione" etichetta="In una frase" valore={valori.descrizione} area aiuto="Compare nella card dell'elenco." />
              <Campo nome="cosaFa" etichetta="Cosa fate" valore={valori.cosaFa} area />
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo nome="perChi" etichetta="Per chi" valore={valori.perChi} aiuto="Età, classi, famiglie, insegnanti…" />
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-extrabold text-notte">Costi</span>
                  <select name="costi" defaultValue={valori.costi} className={CLASSE}>
                    {COSTI.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <Campo nome="comeSiUsa" etichetta="Come si partecipa" valore={valori.comeSiUsa} area aiuto="Esempio: corsi in sede su iscrizione, schede da scaricare, laboratori nelle scuole su richiesta." />
              <Campo nome="sede" etichetta="Sede o zona" aiuto="Città e, se volete, l'indirizzo. Lasciate vuoto se lavorate solo online." />
              <Campo nome="orari" etichetta="Orari" area />
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo nome="sito" etichetta="Sito" valore={valori.sito} tipo="url" />
                <Campo nome="email" etichetta="Email pubblica" tipo="email" aiuto="Solo se volete che le famiglie vi scrivano dalla scheda." />
                <Campo nome="telefono" etichetta="Telefono pubblico" tipo="tel" />
                <Campo nome="instagram" etichetta="Instagram" />
                <Campo nome="facebook" etichetta="Facebook" />
                <Campo nome="tiktok" etichetta="TikTok" />
                <Campo nome="youtube" etichetta="YouTube" />
              </div>
            </>
          )}

          {scelta === "rimuovi" && <Campo nome="motivo" etichetta="Vuoi dirci perché? (facoltativo)" area />}

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo nome="referente" etichetta="Il tuo nome" />
            {/* «contatto» e non «email»: l'email pubblica della scheda è un altro campo. */}
            <Campo nome="contatto" etichetta="La tua email" tipo="email" aiuto="Solo per risponderti: non compare sulla scheda." />
          </div>

          {scelta !== "rimuovi" && (
            <label className="flex items-start gap-3 text-sm font-semibold text-notte">
              <input type="checkbox" name="termini" value="si" className="mt-0.5 h-5 w-5 shrink-0 accent-[#9B6DD6]" />
              <span>
                Accetto i{" "}
                <Link href="/termini-attivita" target="_blank" className="font-extrabold text-viola underline">
                  termini e condizioni
                </Link>{" "}
                e confermo di poter rappresentare {nome}.
              </span>
            </label>
          )}

          {esito.stato === "errore" && <p role="alert" className="rounded-xl bg-rosso/10 px-4 py-3 text-sm font-bold text-rosso">{esito.messaggio}</p>}

          <button type="submit" disabled={inCorso} className="self-start rounded-2xl bg-viola px-6 py-3 font-extrabold text-white disabled:opacity-60">
            {inCorso ? "Invio…" : scelta === "rimuovi" ? "Toglietela dal sito" : scelta === "approva" ? "Approvo la scheda" : "Invia le modifiche"}
          </button>
        </form>
      )}
    </div>
  );
}
