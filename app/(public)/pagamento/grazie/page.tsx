import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, CircleAlert } from "lucide-react";
import { Contenitore } from "@/components/ui";
import { confermaDaRitorno, inServerDiProva } from "@/lib/pagamenti/stripe";
import { ritornoSicuro } from "../ritorno";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Grazie del contributo", robots: { index: false, follow: false } };

/**
 * Ritorno da Stripe. Non si fida dell'indirizzo: rilegge la sessione da Stripe
 * e la registra (se il webhook non l'ha già fatto).
 */
export default async function Grazie({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const ritorno = ritornoSicuro(q.ritorno);
  const prova = q.prova === "1" && inServerDiProva();
  const esito = prova ? { ok: true } : await confermaDaRitorno(q.sessione ?? "");
  return (
    <Contenitore className="py-16">
      <div data-pagamento={esito.ok ? "ok" : "da-controllare"} className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[1.4rem] border border-notte/10 bg-white p-8 text-center">
        {esito.ok ? (
          <CircleCheck className="h-14 w-14 text-[#2E7D4A]" aria-hidden />
        ) : (
          <CircleAlert className="h-14 w-14 text-[#7A5A00]" aria-hidden />
        )}
        <h1 className="text-3xl font-extrabold text-notte">{esito.ok ? "Grazie, è tutto attivo" : "Stiamo controllando il pagamento"}</h1>
        <p className="text-notte-tenue">
          {esito.ok
            ? "La ricevuta ti arriva per email da Stripe. Puoi tornare dove eri e usare subito l'AI."
            : "Se il pagamento è andato a buon fine, l'accesso si apre entro qualche minuto. Se dopo un'ora non lo vedi, scrivici a ciao@giocamizi.it."}
        </p>
        {prova && <p className="rounded-xl bg-[#FFF3CF] px-4 py-2 text-sm font-bold text-[#7A5A00]">Pagamento finto: siamo nella copia di prova.</p>}
        <Link href={ritorno} className="rounded-2xl bg-viola-forte px-6 py-3 font-extrabold text-white">
          Torna indietro
        </Link>
      </div>
    </Contenitore>
  );
}
