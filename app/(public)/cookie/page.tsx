import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore } from "@/components/ui";
import { FacciaMizi } from "@/games/_engine/arte";
import { AGGIORNATA, REGISTRO, TITOLARE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "Cosa salva Gioca con Mizi nel tuo browser: solo elementi tecnici, nessun tracciatore di terze parti, nessun cookie pubblicitario. Per questo non c'è il banner.",
  alternates: { canonical: "/cookie" },
};

export default function CookiePage() {
  const cookieVeri = REGISTRO.filter((v) => v.tipo === "cookie");
  const archivioLocale = REGISTRO.filter((v) => v.tipo === "localStorage");

  return (
    <Contenitore className="py-10">
      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Cookie policy</h1>
      <p className="mt-2 text-sm font-bold text-notte-tenue">
        Ultimo aggiornamento: {AGGIORNATA} · Direttiva ePrivacy e provvedimenti del Garante
        sui cookie
      </p>

      <div className="mt-6 flex items-start gap-4 rounded-morbido border-2 border-crema-scuro bg-white p-5">
        <span className="h-14 w-14 shrink-0" aria-hidden>
          <FacciaMizi emozione="felice" />
        </span>
        <div className="flex flex-col gap-2 text-notte">
          <p className="font-extrabold">Perché non vedi il banner dei cookie</p>
          <p className="text-notte-tenue">
            Perché non serve: il banner è obbligatorio per i cookie di profilazione e di
            terze parti, e qui non ce ne sono. Questo sito salva nel tuo browser solo le
            poche cose tecniche elencate sotto, che servono a farlo funzionare e non
            escono dal tuo dispositivo se non per l&apos;accesso all&apos;area genitori.
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-2 text-xl font-extrabold text-notte sm:text-2xl">
          Cookie (tecnici, solo se accedi)
        </h2>
        <p className="mb-4 leading-relaxed text-notte-tenue">
          Navigando e giocando senza account, questo sito non imposta nessun cookie.
        </p>
        <div className="flex flex-col gap-4">
          {cookieVeri.map((v) => (
            <div key={v.nome} className="rounded-morbido border-2 border-crema-scuro bg-white p-5">
              <p className="break-all font-mono text-sm font-bold text-viola">{v.nome}</p>
              <p className="mt-2 text-notte-tenue">{v.scopo}</p>
              <p className="mt-2 text-sm font-bold text-notte-tenue">
                Compare: {v.quando} · Durata: {v.durata} · Impostato da: {v.chi} ·{" "}
                {v.necessario ? "Tecnico, non richiede consenso" : "Richiede consenso"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-xl font-extrabold text-notte sm:text-2xl">
          Dati salvati nel browser (localStorage)
        </h2>
        <p className="mb-4 leading-relaxed text-notte-tenue">
          Il localStorage è un cassetto del tuo browser: quello che ci mettiamo resta sul
          tuo dispositivo e non viene inviato a nessuno.
        </p>
        <div className="flex flex-col gap-4">
          {archivioLocale.map((v) => (
            <div key={v.nome} className="rounded-morbido border-2 border-crema-scuro bg-white p-5">
              <p className="break-all font-mono text-sm font-bold text-viola">{v.nome}</p>
              <p className="mt-2 text-notte-tenue">{v.scopo}</p>
              <p className="mt-2 text-sm font-bold text-notte-tenue">
                Compare: {v.quando} · Durata: {v.durata}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-3 leading-relaxed text-notte-tenue">
        <h2 className="text-xl font-extrabold text-notte sm:text-2xl">Cosa NON c&apos;è</h2>
        <p>
          Nessun cookie pubblicitario, nessun cookie di profilazione, nessun pixel di
          social network, nessuno strumento di statistica di terze parti. I biglietti di
          compleanno e i giochi creati con l&apos;editor si salvano dentro il link che
          generi tu: non li conserviamo noi.
        </p>
        <h2 className="mt-4 text-xl font-extrabold text-notte sm:text-2xl">Come cancellare tutto</h2>
        <p>
          Puoi eliminare cookie e localStorage in qualsiasi momento dalle impostazioni del
          browser (di solito sotto &quot;Cancella dati di navigazione&quot;). Il sito
          continuerà a funzionare: al massimo ti riproporrà l&apos;invito alle novità.
        </p>
        <h2 className="mt-4 text-xl font-extrabold text-notte sm:text-2xl">Se qualcosa cambierà</h2>
        <p>
          Ogni nuovo cookie o strumento entrerà prima in questa pagina, con la data
          aggiornata; se non sarà tecnico, prima di attivarlo ti chiederemo il consenso
          con un banner chiaro. Domande? Scrivi a{" "}
          <a href={`mailto:${TITOLARE.email}`} className="font-bold text-viola underline underline-offset-4">
            {TITOLARE.email}
          </a>{" "}
          o leggi la{" "}
          <Link href="/privacy" className="font-bold text-viola underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </section>
    </Contenitore>
  );
}
