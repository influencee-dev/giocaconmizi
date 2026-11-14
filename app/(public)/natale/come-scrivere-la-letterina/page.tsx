import type { Metadata } from "next";
import Link from "next/link";
import { Contenitore, Faq } from "@/components/ui";
import { InBreve, TestataPagina } from "@/components/vetrina";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import { FASCE } from "@/lib/natale/letterina";
import {
  CONSIGLI_PER_ETA,
  FAQ_COME_SCRIVERE,
  PARTI_LETTERINA,
  RISPOSTA_COME_SCRIVERE,
  esempioLetterina,
} from "@/lib/natale/pagine";

export const metadata: Metadata = {
  title: "Come scrivere la letterina a Babbo Natale: esempi per età",
  description:
    "Le quattro parti della letterina a Babbo Natale, consigli per 3-5, 6-8 e 9-12 anni e tre esempi completi da cui partire. Con la versione da stampare.",
  alternates: { canonical: "/natale/come-scrivere-la-letterina" },
};

export default function ComeScrivereLetterinaPage() {
  return (
    <Contenitore className="pb-10 pt-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Il Natale di Mizi", percorso: "/natale" },
          { nome: "Come scrivere la letterina", percorso: "/natale/come-scrivere-la-letterina" },
        ])}
      />
      <JsonLd data={jsonLdFaq(FAQ_COME_SCRIVERE)} />

      <TestataPagina occhiello="Il Natale di Mizi" tono="rosa">
        <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">Come scrivere la letterina a Babbo Natale</h1>
        <p className="mt-2 max-w-2xl text-lg text-notte-tenue">Le parti della lettera, i consigli per ogni età e tre esempi completi.</p>
      </TestataPagina>

      <InBreve>{RISPOSTA_COME_SCRIVERE}</InBreve>

      <Link
        href="/natale/lettera-a-babbo-natale"
        data-tap
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-viola px-8 py-5 text-xl font-extrabold text-white"
      >
        Scrivi la letterina con Mizi
      </Link>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-notte">Le quattro parti della letterina</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {PARTI_LETTERINA.map((p, i) => (
            <li key={p.titolo} className="rounded-[1.2rem] border border-notte/10 bg-white p-5">
              <span className="font-extrabold text-notte">
                {i + 1}. {p.titolo}
              </span>
              <p className="mt-1 text-notte-tenue">{p.testo}</p>
            </li>
          ))}
        </ol>
      </section>

      {CONSIGLI_PER_ETA.map((c) => {
        const esempio = esempioLetterina(c.fascia);
        const fascia = FASCE.find((f) => f.id === c.fascia)!;
        return (
          <section key={c.fascia} className="mt-12" data-esempio-letterina={c.fascia}>
            <h2 className="text-2xl font-extrabold text-notte">{c.titolo}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-notte-tenue">
              {c.consigli.map((consiglio) => (
                <li key={consiglio}>{consiglio}</li>
              ))}
            </ul>
            <figure className="mt-5 rounded-[1.4rem] border-2 border-rosa/40 bg-[#FFFDF8] p-6">
              <figcaption className="mb-3 text-sm font-extrabold uppercase tracking-wide text-notte-tenue">
                Esempio di letterina, {fascia.etichetta}
              </figcaption>
              <p className="text-xl font-extrabold text-notte">{esempio.apertura}</p>
              {esempio.prima.map((p) => (
                <p key={p} className="mt-3 text-notte">
                  {p}
                </p>
              ))}
              {esempio.desideri.length > 0 && (
                <>
                  <p className="mt-3 font-extrabold text-notte">Per Natale vorrei:</p>
                  <ul className="mt-1 list-disc pl-6 text-notte">
                    {esempio.desideri.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </>
              )}
              {esempio.dopo.map((p) => (
                <p key={p} className="mt-3 text-notte">
                  {p}
                </p>
              ))}
              <p className="mt-4 text-right text-lg font-extrabold text-notte">{esempio.firma}</p>
            </figure>
          </section>
        );
      })}

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-notte">E dopo averla scritta?</h2>
        <p className="mt-2 text-notte-tenue">
          Ogni famiglia ha il suo rito: c&apos;è chi la lascia vicino all&apos;albero o al presepe, chi la legge ad alta
          voce a cena, chi la conserva per rileggerla da grandi. Se la stampi dalla{" "}
          <Link href="/natale/lettera-a-babbo-natale" className="font-bold text-viola underline">pagina della letterina</Link>, puoi
          scegliere la versione da colorare: il bambino la decora prima di consegnarla.
        </p>
      </section>

      <Faq voci={FAQ_COME_SCRIVERE} />
    </Contenitore>
  );
}
