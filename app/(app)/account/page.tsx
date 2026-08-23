import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { creaClientServer, utenteCorrente } from "@/lib/supabase/server";
import { Contenitore, TitoloSezione } from "@/components/ui";

export const metadata: Metadata = {
  title: "Il tuo account",
  robots: { index: false, follow: false },
};

// La pagina dipende dalla sessione: mai statica.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await creaClientServer();

  if (!supabase) {
    return (
      <Contenitore className="py-12">
        <h1 className="text-3xl font-extrabold text-notte">Il tuo account</h1>
        <p className="mt-4 max-w-xl text-lg text-notte-tenue">
          L&apos;account non è ancora attivo su questo ambiente: mancano le chiavi
          Supabase. I giochi funzionano lo stesso.
        </p>
        <Link
          href="/giochi"
          className="mt-6 inline-block font-bold text-viola underline underline-offset-4"
        >
          Vai ai giochi
        </Link>
      </Contenitore>
    );
  }

  const utente = await utenteCorrente();
  if (!utente) redirect("/accedi");

  const { data: profilo } = await supabase
    .from("profiles")
    .select("parent_name, city, profession")
    .eq("id", utente.id)
    .maybeSingle();

  return (
    <Contenitore className="py-12">
      <h1 className="text-3xl font-extrabold text-notte">
        Ciao{profilo?.parent_name ? ` ${profilo.parent_name}` : ""}
      </h1>
      <p className="mt-2 text-lg text-notte-tenue">{utente.email}</p>

      <section className="mt-10">
        <TitoloSezione>I tuoi bambini</TitoloSezione>
        <p className="rounded-morbido border-2 border-crema-scuro bg-white p-5 text-notte-tenue">
          Qui compariranno le fasce d&apos;età che hai indicato e i giochi già
          completati. Del bambino chiediamo solo la fascia d&apos;età e, se vuoi,
          un soprannome.
        </p>
      </section>

      <form action="/auth/esci" method="post" className="mt-10">
        <button
          type="submit"
          className="rounded-bolla border-2 border-crema-scuro bg-white px-8 py-4 text-lg font-bold text-notte"
        >
          Esci
        </button>
      </form>
    </Contenitore>
  );
}
