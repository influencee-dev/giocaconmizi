"use client";

import { useEffect, useState } from "react";
import { annuncia } from "@/components/ui/Esito";
import { leggiElenco, possibile, scaricaGiochi, statoSenzaRete, togliGiochi, type StatoSenzaRete } from "@/lib/giochi/offline";

/**
 * «Gioca anche senza connessione»: il riquadro da cui si scaricano i giochi
 * sul telefono (aereo, treno, macchina). Tutto parte dal tocco; dice quanto
 * pesa prima di cominciare e si può sempre togliere.
 */
export function GiochiSenzaRete() {
  const [pronto, setPronto] = useState(false);
  const [stato, setStato] = useState<StatoSenzaRete | null>(null);
  const [megabyte, setMegabyte] = useState<number | null>(null);
  const [avanti, setAvanti] = useState<number | null>(null);
  const [errore, setErrore] = useState(false);

  useEffect(() => {
    if (!possibile()) return;
    setPronto(true);
    setStato(statoSenzaRete());
    leggiElenco()
      .then((e) => setMegabyte(Math.ceil(e.peso / 1048576)))
      .catch(() => setMegabyte(null));
  }, []);

  if (!pronto) return null;

  const scarica = async () => {
    setErrore(false);
    setAvanti(0);
    try {
      const nuovo = await scaricaGiochi(setAvanti);
      setStato(nuovo);
      annuncia("Fatto! I giochi ora funzionano anche senza connessione.", true);
    } catch {
      setErrore(true);
    } finally {
      setAvanti(null);
    }
  };

  const togli = async () => {
    await togliGiochi();
    setStato(null);
    annuncia("Giochi tolti dal telefono.", false);
  };

  const inCorso = avanti !== null;

  return (
    <section
      aria-labelledby="titolo-senza-rete"
      className="rounded-morbido border-2 border-crema-scuro bg-white p-5"
      data-senza-rete={stato ? "scaricati" : inCorso ? "in-corso" : "da-scaricare"}
    >
      <h2 id="titolo-senza-rete" className="text-xl font-extrabold text-notte">
        Gioca anche senza connessione
      </h2>

      {stato && !inCorso ? (
        <>
          <p className="mt-2 text-notte-tenue">
            <strong className="text-notte">{stato.giochi} giochi sono su questo telefono</strong>, con la voce di Mizi e i disegni: funzionano anche in
            modalità aereo. Quando esce un gioco nuovo si aggiornano da soli, alla prima apertura con la rete.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={scarica} className="min-h-14 rounded-bolla bg-viola-forte px-6 py-3 text-lg font-extrabold text-white" data-scarica-giochi>
              Aggiorna adesso
            </button>
            <button type="button" onClick={togli} className="min-h-14 rounded-bolla border-2 border-crema-scuro bg-white px-6 py-3 text-lg font-bold text-notte" data-togli-giochi>
              Togli i giochi dal telefono
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-notte-tenue">
            In aereo, in treno o in macchina: scarica i giochi adesso e funzioneranno anche senza rete, con la voce di Mizi.
            {megabyte ? ` Sono circa ${megabyte} MB: meglio farlo col Wi-Fi.` : ""} Si possono togliere quando vuoi.
          </p>
          {inCorso ? (
            <div className="mt-4" role="status" aria-live="polite">
              <div className="h-4 overflow-hidden rounded-full bg-crema-scuro">
                <div className="h-full rounded-full bg-viola-forte transition-[width] duration-200" style={{ width: `${Math.round((avanti ?? 0) * 100)}%` }} />
              </div>
              <p className="mt-2 font-bold text-notte">Sto scaricando i giochi… {Math.round((avanti ?? 0) * 100)}%. Tieni aperta questa pagina.</p>
            </div>
          ) : (
            <button type="button" onClick={scarica} className="mt-4 min-h-14 rounded-bolla bg-viola-forte px-6 py-3 text-lg font-extrabold text-white" data-scarica-giochi>
              Scarica i giochi
            </button>
          )}
          {errore && (
            <p role="alert" className="mt-3 rounded-2xl bg-giallo/30 px-4 py-3 font-bold text-notte">
              Non sono riuscita a scaricare tutto: forse la rete è caduta. Riprova tra poco.
            </p>
          )}
        </>
      )}
    </section>
  );
}
