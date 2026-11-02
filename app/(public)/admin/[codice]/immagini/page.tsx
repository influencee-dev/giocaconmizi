import type { Metadata } from "next";
import { Contenitore } from "@/components/ui";
import { adminValido } from "@/lib/admin";
import { MenuAdmin } from "../MenuAdmin";
import { Ottimizzatore } from "./Ottimizzatore";

/** Il «plugin» immagini del pannello: WebP alla massima risoluzione e al minimo peso. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ottimizza immagini", robots: { index: false, follow: false } };

export default async function ImmaginiPage({ params }: { params: Promise<{ codice: string }> }) {
  const { codice } = await params;
  if (!(await adminValido(codice))) {
    return (
      <Contenitore className="py-16">
        <h1 className="text-3xl font-extrabold text-notte">Pannello non disponibile</h1>
        <p className="mt-4 text-notte-tenue">Il codice non è valido, oppure il database non risponde (forse è in pausa su Supabase).</p>
      </Contenitore>
    );
  }
  return (
    <Contenitore largo className="py-10">
      <MenuAdmin codice={codice} attivo="/immagini" />
      <h1 className="text-3xl font-extrabold text-notte">Ottimizza immagini</h1>
      <p className="mt-2 max-w-2xl text-notte-tenue">
        Ogni foto diventa un WebP alla risoluzione che scegli, con la qualità più bassa che resta identica a occhio:
        il peso scende anche del 90%. Se la assegni a una foto del sito, il ritaglio e i nomi dei file sono già quelli giusti
        per <code>public/immagini/</code>.
      </p>
      <div className="mt-8">
        <Ottimizzatore codice={codice} />
      </div>
    </Contenitore>
  );
}
