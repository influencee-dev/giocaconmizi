import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { ritornoSicuro } from "../ritorno";

export const metadata: Metadata = { title: "Pagamento annullato", robots: { index: false, follow: false } };

export default async function Annullato({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <Contenitore className="py-16">
      <div data-pagamento="annullato" className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[1.4rem] border border-notte/10 bg-white p-8 text-center">
        <h1 className="text-3xl font-extrabold text-notte">Nessun pagamento</h1>
        <p className="text-notte-tenue">Hai annullato prima di pagare: non ti è stato addebitato niente. Puoi riprovare quando vuoi.</p>
        <Link href={ritornoSicuro(q.ritorno)} className="rounded-2xl bg-viola-forte px-6 py-3 font-extrabold text-white">
          Torna indietro
        </Link>
      </div>
    </Contenitore>
  );
}
