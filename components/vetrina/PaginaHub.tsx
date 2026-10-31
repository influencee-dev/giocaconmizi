import type { ReactNode } from "react";
import type { CodiceFoto } from "@/lib/foto";
import { Contenitore, Prosa } from "@/components/ui";
import { JsonLd, jsonLdFaq } from "@/components/seo/JsonLd";
import { FaqVetrina, InBreve, TestataPagina, TitoloVetrina, type Tono } from "./index";

/**
 * Pagina istituzionale scritta in markdown (content/hubs): testata del
 * template, risposta "In breve", il testo e le domande frequenti.
 */
export function PaginaHub({
  titolo,
  html,
  occhiello,
  tono,
  foto,
  inBreve,
  faq,
  dopo,
}: {
  titolo: string;
  html: string;
  occhiello: string;
  tono: Tono;
  foto: CodiceFoto;
  inBreve: string;
  faq: { domanda: string; risposta: string }[];
  dopo?: ReactNode;
}) {
  // L'H1 lo mette la testata: tolto dal markdown per non averne due.
  const corpo = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "");
  return (
    <Contenitore largo className="pb-10 pt-8">
      <JsonLd data={jsonLdFaq(faq)} />
      <TestataPagina occhiello={occhiello} tono={tono} foto={foto}>
        <h1>{titolo}</h1>
        <p className="text-notte-tenue">Giorgia Palazzo · Giocamizi</p>
      </TestataPagina>
      <div className="mx-auto max-w-3xl">
        <InBreve>{inBreve}</InBreve>
        <div className="mt-10">
          <Prosa html={corpo} />
        </div>
        {dopo}
      </div>
      <section className="mx-auto mt-16 max-w-5xl">
        <TitoloVetrina>Domande frequenti</TitoloVetrina>
        <div className="mt-8">
          <FaqVetrina voci={faq} />
        </div>
      </section>
    </Contenitore>
  );
}
