import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Contenitore } from "@/components/ui";
import { SvuotaCarrello } from "@/components/negozio/BottoneCarrello";
import { GIORNI_SCARICO, euro, fileAcquistati } from "@/lib/negozio/catalogo";
import { leggiAcquisto, sessioneValida } from "@/lib/negozio/stripe";

/**
 * La pagina dei PDF acquistati: ci arriva Stripe dopo il pagamento, e ci riporta
 * il link dell'email. Il codice della sessione nell'indirizzo è la «chiave»:
 * lungo e impossibile da indovinare, e ogni scarico lo ricontrolla su Stripe.
 */

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "I tuoi PDF",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function GraziePage({ searchParams }: { searchParams: Promise<{ sessione?: string }> }) {
  const { sessione } = await searchParams;
  const acquisto = sessioneValida(sessione) ? await leggiAcquisto(sessione) : null;

  if (!acquisto) {
    return (
      <Contenitore className="max-w-2xl py-10">
        <h1 className="text-3xl font-extrabold text-notte">Non troviamo questo acquisto</h1>
        <p className="mt-3 text-lg text-notte-tenue">
          Controlla di aver aperto il link completo dell&apos;email. Se il problema resta, scrivici a{" "}
          <a href="mailto:ciao@giocamizi.it" className="font-bold text-viola underline">ciao@giocamizi.it</a> con
          l&apos;email usata per pagare.
        </p>
      </Contenitore>
    );
  }

  if (!acquisto.pagato) {
    return (
      <Contenitore className="max-w-2xl py-10">
        <h1 className="text-3xl font-extrabold text-notte">Stiamo aspettando la conferma del pagamento</h1>
        <p className="mt-3 text-lg text-notte-tenue">
          Con alcuni metodi di pagamento ci vuole qualche minuto. Appena arriva ti mandiamo i PDF per email; puoi anche
          ricaricare questa pagina tra poco.
        </p>
      </Contenitore>
    );
  }

  const scaduto = Date.now() - acquisto.creato > GIORNI_SCARICO * 86_400_000;
  const voci = fileAcquistati(acquisto.codici);
  const link = (codice: string, chiave: string) =>
    `/api/negozio/scarica?sessione=${encodeURIComponent(acquisto.id)}&prodotto=${encodeURIComponent(codice)}&file=${encodeURIComponent(chiave)}`;

  return (
    <Contenitore className="max-w-2xl py-10">
      <SvuotaCarrello />
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Grazie! Ecco i tuoi PDF</h1>
      <p className="mt-3 text-lg text-notte-tenue">
        Hai pagato {euro(acquisto.totale)}.{" "}
        {acquisto.email ? <>Ti abbiamo mandato questo link anche per email ({acquisto.email}).</> : null}
      </p>
      {scaduto ? (
        <p className="mt-8 rounded-2xl bg-crema p-4 font-bold text-notte">
          Il link è scaduto. Scrivici a ciao@giocamizi.it con l&apos;email dell&apos;acquisto e te lo rimandiamo.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {voci.map(({ prodotto, file }) => (
            <li key={file.percorso}>
              <a
                href={link(prodotto.codice, file.chiave)}
                rel="nofollow"
                className="flex items-center gap-4 rounded-[1.4rem] border-2 border-transparent bg-white p-4 hover:border-viola"
              >
                <Download className="h-6 w-6 shrink-0 text-viola" aria-hidden />
                <span className="min-w-0">
                  <span className="block font-extrabold text-notte">{prodotto.nome}</span>
                  <span className="block break-all text-sm text-notte-tenue">{file.nome}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 rounded-[1.4rem] bg-crema-scuro/60 p-5 text-notte">
        <p className="font-extrabold">Come stamparli</p>
        <p className="mt-1 text-notte-tenue">
          Carta A4 normale, stampa «a dimensione reale» (non «adatta alla pagina»). I PDF con due pagine per foglio si
          tagliano a metà lungo la linea tratteggiata. Puoi tornare su questa pagina per {GIORNI_SCARICO} giorni.
        </p>
      </div>
      <p className="mt-8">
        <Link href="/giochi" className="font-extrabold text-viola underline underline-offset-4">Intanto, si gioca con Mizi</Link>
      </p>
    </Contenitore>
  );
}
