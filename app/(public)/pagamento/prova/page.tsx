import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore } from "@/components/ui";
import { CONTRIBUTI, eTipoContributo, euro } from "@/lib/pagamenti/contributi";
import { inServerDiProva } from "@/lib/pagamenti/stripe";
import { ritornoSicuro } from "../ritorno";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pagamento di prova", robots: { index: false, follow: false } };

/** Solo nel server delle verifiche: al posto della pagina di Stripe. Sul sito vero non esiste. */
export default async function Prova({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!inServerDiProva()) notFound();
  const q = await searchParams;
  const tipo = eTipoContributo(q.tipo) ? q.tipo : "mamma_anno";
  const c = CONTRIBUTI[tipo];
  const ritorno = ritornoSicuro(q.ritorno);
  return (
    <Contenitore className="py-16">
      <div data-pagamento-prova className="mx-auto flex max-w-xl flex-col gap-4 rounded-[1.4rem] border-2 border-dashed border-crema-scuro bg-white p-8">
        <p className="text-sm font-extrabold uppercase text-notte-tenue">Pagamento di prova (qui ci sarebbe Stripe)</p>
        <h1 className="text-2xl font-extrabold text-notte">{c.nome}</h1>
        <p className="text-notte-tenue">{c.descrizione}</p>
        <p className="text-3xl font-black text-notte">{euro(c.importoCent)}</p>
        <Link href={`/pagamento/grazie?prova=1&ritorno=${encodeURIComponent(ritorno)}`} className="rounded-2xl bg-viola-forte px-6 py-3 text-center font-extrabold text-white">
          Paga (finto)
        </Link>
        <Link href={`/pagamento/annullato?ritorno=${encodeURIComponent(ritorno)}`} className="text-center font-extrabold text-viola">
          Annulla
        </Link>
      </div>
    </Contenitore>
  );
}
