"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PREZZI, controllaCarrello, euro } from "@/lib/negozio/catalogo";
import { useCarrello } from "./carrello";

/**
 * Il carrello: righe, totale, la spunta sulla consegna immediata e il bottone
 * che porta alla pagina di pagamento di Stripe. I prezzi mostrati qui sono
 * quelli del catalogo; il server li ricalcola comunque prima di far pagare.
 */
export function Carrello({ prova }: { prova: boolean }) {
  const { codici, pronto, togli } = useCarrello();
  const [recesso, setRecesso] = useState(false);
  const [trappola, setTrappola] = useState("");
  const [invio, setInvio] = useState(false);
  const [avviso, setAvviso] = useState("");

  if (!pronto) return <p className="mt-8 text-notte-tenue">Un attimo…</p>;

  const esito = controllaCarrello(codici, prova);
  const tolti = codici.filter((c) => !esito.prodotti.some((p) => p.codice === c));

  if (codici.length === 0 || esito.prodotti.length === 0) {
    return (
      <div className="mt-8 rounded-[1.4rem] border border-notte/10 bg-white p-6">
        <p className="text-lg font-bold text-notte">Il carrello è vuoto.</p>
        <Link href="/negozio" className="mt-3 inline-block font-extrabold text-viola underline underline-offset-4">
          Guarda i libretti e i disegni
        </Link>
      </div>
    );
  }

  const paga = async () => {
    setAvviso("");
    if (!recesso) {
      setAvviso("Per ricevere subito i PDF serve la spunta qui sopra.");
      return;
    }
    setInvio(true);
    try {
      const r = await fetch("/api/negozio/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prodotti: esito.prodotti.map((p) => p.codice), recesso: true, sito: trappola }),
      });
      const j = (await r.json().catch(() => ({}))) as { url?: string; errore?: string };
      if (r.ok && j.url) {
        window.location.assign(j.url);
        return;
      }
      setAvviso(j.errore ?? "Il pagamento non è partito. Riprova tra poco.");
    } catch {
      setAvviso("Sembra che manchi la connessione. Riprova tra poco.");
    }
    setInvio(false);
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      {prova && (
        <p className="rounded-2xl bg-giallo/40 p-4 text-sm font-bold text-notte">
          Negozio in prova: si paga con le carte finte di Stripe (4242 4242 4242 4242), nessun soldo vero.
        </p>
      )}
      <ul className="flex flex-col divide-y divide-notte/10 rounded-[1.4rem] border border-notte/10 bg-white">
        {esito.prodotti.map((p) => (
          <li key={p.codice} className="flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-notte">{p.nome}</p>
              <p className="text-sm text-notte-tenue">{p.volume.titolo}</p>
            </div>
            <p className="shrink-0 font-extrabold text-notte">{euro(p.prezzo)}</p>
            <button
              type="button"
              onClick={() => togli(p.codice)}
              aria-label={`Togli dal carrello: ${p.nome}`}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-notte-tenue hover:bg-crema hover:text-notte"
            >
              <Trash2 className="h-5 w-5" aria-hidden />
            </button>
          </li>
        ))}
        <li className="flex items-center justify-between p-4">
          <p className="font-extrabold text-notte">Totale, IVA inclusa</p>
          <p className="text-xl font-extrabold text-notte">{euro(esito.totale)}</p>
        </li>
      </ul>

      {tolti.length > 0 && (
        <p className="text-sm text-notte-tenue">
          Alcuni disegni singoli non sono nel conto: sono già dentro il pacchetto o il libricino che hai scelto.
        </p>
      )}

      {esito.sottoMinimo ? (
        <p className="rounded-2xl bg-crema p-4 font-bold text-notte">
          L&apos;ordine minimo è {euro(PREZZI.minimo_ordine)}: aggiungi un altro disegno o un pacchetto.
        </p>
      ) : (
        <>
          <label className="flex cursor-pointer gap-3 rounded-[1.4rem] border-2 border-notte/15 bg-white p-4">
            <input
              type="checkbox"
              checked={recesso}
              onChange={(e) => setRecesso(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-viola"
            />
            <span className="text-sm leading-relaxed text-notte">
              Voglio ricevere subito i PDF. So che, una volta pagato e messi a disposizione i file, perdo il diritto di
              recesso (art. 59, lettera o, del Codice del consumo). Ho letto le{" "}
              <Link href="/negozio/condizioni" prefetch={false} className="font-bold text-viola underline underline-offset-2">
                condizioni di vendita
              </Link>
              .
            </span>
          </label>
          {/* Campo trappola per i bot: invisibile e fuori dall'accessibilità. */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={trappola}
            onChange={(e) => setTrappola(e.target.value)}
            className="hidden"
            name="sito"
          />
          <button
            type="button"
            onClick={paga}
            disabled={invio}
            className="min-h-14 rounded-2xl bg-viola px-6 text-lg font-extrabold text-white hover:bg-viola-forte disabled:opacity-60"
          >
            {invio ? "Ti porto al pagamento…" : `Paga ${euro(esito.totale)}`}
          </button>
          <p className="text-sm text-notte-tenue">
            Il pagamento avviene sulla pagina sicura di Stripe: noi non vediamo i dati della carta. Ti chiediamo solo
            l&apos;email, per mandarti i PDF.
          </p>
        </>
      )}
      {avviso && (
        <p role="alert" className="rounded-2xl bg-rosa/40 p-4 font-bold text-notte">
          {avviso}
        </p>
      )}
    </div>
  );
}
