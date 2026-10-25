import type { Metadata } from "next";
import Link from "next/link";
import { SCHEDE, datiCard, percorsoScheda } from "@/lib/directory";
import { apriInvito } from "@/lib/directory-db";
import { Contenitore } from "@/components/ui";
import { CardAttivita } from "@/components/directory/CardAttivita";
import { ModuloRisposta } from "./ModuloRisposta";

/**
 * Il link personale che riceve ogni attività: anteprima della sua scheda e
 * tre scelte (approva, modifica, rimuovi). Mai in Google: il codice nel link
 * è la sola chiave d'accesso.
 */

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "La tua scheda su Giocamizi",
  robots: { index: false, follow: false },
};

export default async function LaTuaSchedaPage({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  const invito = await apriInvito(codice);
  const s = invito && SCHEDE.find((x) => `${x.cittaSlug}/${x.slug}` === invito.chiave);

  if (!s) {
    return (
      <Contenitore className="py-16">
        <h1 className="text-3xl font-extrabold text-notte">Questo link non funziona</h1>
        <p className="mt-4 text-lg text-notte-tenue">
          Forse è scaduto o è stato copiato a metà. Rispondi all&apos;email che hai ricevuto e te ne mandiamo uno nuovo.
        </p>
      </Contenitore>
    );
  }

  const gia = invito.stato === "approvato" || invito.stato === "modifica" || invito.stato === "rimozione";

  return (
    <Contenitore largo className="py-10">
      <p className="text-sm font-extrabold uppercase tracking-widest text-viola">La tua scheda</p>
      <h1 className="mt-2 text-3xl font-extrabold text-notte sm:text-4xl">Ciao! Ecco {s.nome} su Giocamizi</h1>
      <p className="mt-3 max-w-2xl text-lg text-notte-tenue">
        Abbiamo inserito {s.nome} nella guida gratuita ai posti per bambini di {s.citta}, perché è tra quelli di cui le
        famiglie parlano di più. Qui sotto vedi la scheda come la vedono loro: approvala, completala o, se preferisci, toglila.
      </p>
      {gia && (
        <p className="mt-4 rounded-xl bg-[#E3F4E8] px-4 py-3 font-bold text-[#2E7D4A]">
          Abbiamo già ricevuto una tua risposta: se vuoi cambiare qualcosa, puoi inviarne un&apos;altra.
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-3">
          <CardAttivita s={datiCard(s)} />
          <Link href={percorsoScheda(s)} target="_blank" className="text-center font-extrabold text-viola">
            Apri la scheda completa ›
          </Link>
          <p className="text-sm font-semibold text-notte-tenue">
            È gratis e lo resta: nessuna commissione, le famiglie vi contattano direttamente.
          </p>
        </div>
        <ModuloRisposta
          codice={codice}
          nome={s.nome}
          valori={{ descrizione: s.descrizione, indirizzo: `${s.zona}, ${s.citta}`, sito: s.sito ?? "", instagram: s.instagram ?? "" }}
        />
      </div>
    </Contenitore>
  );
}
