import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore, Faq, TitoloSezione } from "@/components/ui";
import { Biglietto } from "@/components/biglietti/Biglietto";
import { JsonLd, jsonLdBreadcrumb, jsonLdFaq } from "@/components/seo/JsonLd";
import {
  ETA_BIGLIETTI,
  MODALITA,
  NOMI_TIPO,
  frasi,
  linkAlTool,
  paginaPerSlug,
  temi,
  temiPer,
  tutteLePagine,
  type Pagina,
} from "@/lib/biglietti";
import { url } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

/**
 * Le pagine dei biglietti sono generate da un solo template (pSEO, §14.2):
 * hub, età, età per genere, tema, modalità, frasi e "da colorare".
 * Ogni pagina mostra anteprime vere fatte con il tool, non immagini di repertorio,
 * e ogni anteprima porta al tool con i campi già compilati.
 */

export function generateStaticParams() {
  return tutteLePagine().map(({ slug }) => ({ slug }));
}

/** Titolo, sottotitolo e risposta secca: cambia solo questo fra una pagina e l'altra. */
function descrivi(pagina: Pagina): {
  h1: string;
  titolo: string;
  descrizione: string;
  risposta: string;
} {
  if (pagina.genere === "colorare") {
    return {
      h1: "Biglietti di compleanno da colorare",
      titolo: "Biglietti di compleanno da colorare",
      descrizione:
        "Biglietti di compleanno da stampare e colorare, gratis. Scegli lo sfondo chiaro e lascia che sia il bambino a finirlo.",
      risposta:
        "Puoi creare gratis un biglietto da colorare: scegli un tema e la variante chiara, scrivi il nome e stampalo. I contorni restano leggeri e il bambino può colorarlo come vuole.",
    };
  }

  const nomi = NOMI_TIPO[pagina.tipo];

  if (pagina.genere === "frasi") {
    return {
      h1: `Frasi per ${nomi.plurale} di compleanno per bambini`,
      titolo: `Frasi per ${nomi.plurale} di compleanno`,
      descrizione: `Frasi pronte per ${nomi.plurale} di compleanno per bambini: copiale o usale direttamente nel nostro creatore gratuito.`,
      risposta: `Ecco le frasi che funzionano meglio per ${nomi.plurale} di compleanno dei bambini. Puoi copiarle oppure aprirle già scritte dentro il creatore, dove basta aggiungere il nome.`,
    };
  }

  if (pagina.genere === "modalita") {
    const m = MODALITA[pagina.modalita];
    return {
      h1: `${maiuscola(nomi.plurale)} di compleanno per bambini ${m.nome}`,
      titolo: `${maiuscola(nomi.plurale)} di compleanno ${m.nome}`,
      descrizione: `${maiuscola(nomi.plurale)} di compleanno per bambini ${m.nome}, gratis e senza registrazione. Pronti in due minuti.`,
      risposta: m.risposta,
    };
  }

  if (pagina.genere === "tema") {
    const tema = temi.find((t) => t.theme === pagina.tema);
    const nomeTema = tema?.label.toLowerCase() ?? pagina.tema;
    return {
      h1: `${maiuscola(nomi.plurale)} di compleanno tema ${nomeTema}`,
      titolo: `${maiuscola(nomi.plurale)} di compleanno ${nomeTema}`,
      descrizione: `${maiuscola(nomi.plurale)} di compleanno con tema ${nomeTema}, da personalizzare gratis con nome ed età. Senza registrazione.`,
      risposta: `Puoi creare gratis ${nomi.singolare} di compleanno con il tema ${nomeTema}, scriverci sopra il nome e l'età e scaricarlo subito, senza registrarti e senza filigrana.`,
    };
  }

  if (pagina.genere === "eta-genere") {
    return {
      h1: `${maiuscola(nomi.plurale)} di compleanno per ${pagina.sesso} di ${pagina.eta} anni`,
      titolo: `${maiuscola(nomi.plurale)} compleanno ${pagina.sesso} ${pagina.eta} anni`,
      descrizione: `${maiuscola(nomi.plurale)} di compleanno per ${pagina.sesso} di ${pagina.eta} anni da personalizzare gratis online. Senza registrazione.`,
      risposta: `Puoi creare gratis ${nomi.singolare} di compleanno per ${pagina.sesso === "bambina" ? "una bambina" : "un bambino"} di ${pagina.eta} anni, scaricarlo in un'immagine o inviarlo su WhatsApp, senza registrazione.`,
    };
  }

  if (pagina.genere === "eta") {
    return {
      h1: `${maiuscola(nomi.plurale)} di compleanno ${pagina.eta} anni`,
      titolo: `${maiuscola(nomi.plurale)} di compleanno ${pagina.eta} anni`,
      descrizione: `${maiuscola(nomi.plurale)} di compleanno per bambini di ${pagina.eta} anni, gratis e personalizzabili online. Senza registrazione.`,
      risposta: `Puoi creare gratis ${nomi.singolare} di compleanno per un bambino di ${pagina.eta} anni: scegli il tema, scrivi il nome e scarica. Non serve registrarsi.`,
    };
  }

  return {
    h1: `${maiuscola(nomi.plurale)} di compleanno per bambini`,
    titolo: `${maiuscola(nomi.plurale)} di compleanno per bambini`,
    descrizione: `${maiuscola(nomi.plurale)} di compleanno per bambini da creare gratis online: 25 temi, personalizzabili con nome ed età. Senza registrazione.`,
    risposta: `Puoi creare gratis ${nomi.plurale} di compleanno per bambini scegliendo fra venticinque temi, scriverci nome ed età e scaricarli subito. Non serve registrarsi e non c'è nessuna filigrana.`,
  };
}

const maiuscola = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pagina = paginaPerSlug(slug);
  if (!pagina) return {};
  const testi = descrivi(pagina);
  return {
    title: testi.titolo,
    description: testi.descrizione,
    alternates: { canonical: `/biglietti/${slug}` },
    openGraph: { title: testi.titolo, description: testi.descrizione },
  };
}

export default async function PaginaBiglietti({ params }: Params) {
  const { slug } = await params;
  const pagina = paginaPerSlug(slug);
  if (!pagina) notFound();

  const testi = descrivi(pagina);
  const tipo = pagina.genere === "colorare" ? "auguri" : pagina.tipo;
  const eta = "eta" in pagina ? pagina.eta : undefined;
  const genere = pagina.genere === "eta-genere" ? (pagina.sesso === "bambina" ? "f" : "m") : undefined;
  const temaFisso = pagina.genere === "tema" ? pagina.tema : undefined;

  // Le anteprime sono biglietti veri, fatti con lo stesso componente del tool.
  const anteprime = (temaFisso ? temi.filter((t) => t.theme === temaFisso) : temiPer(eta, genere))
    .slice(0, temaFisso ? 1 : 8);

  const frasiPronte = frasi(tipo, "Sofia", eta ?? 5).slice(0, 3);

  const faq = [
    {
      domanda: "È davvero gratis?",
      risposta:
        "Sì. Non serve registrarsi, non c'è filigrana e non ci sono limiti al numero di biglietti che puoi creare.",
    },
    {
      domanda: "Come lo mando su WhatsApp?",
      risposta:
        "Scegli il formato verticale, premi Scarica e allega l'immagine alla chat. Dal telefono puoi anche usare il pulsante Condividi.",
    },
    {
      domanda: "Che formato devo stampare?",
      risposta:
        "L'A6 è il formato classico dell'invito: ne entrano quattro in un foglio A4 da tagliare. L'A5 è più grande e va bene come biglietto di auguri.",
    },
    {
      domanda: "Posso rifarlo uguale per tutti gli invitati?",
      risposta:
        "Sì: usa Salva il link. Riaprendolo ritrovi il biglietto com'era e puoi cambiare solo il nome dell'invitato.",
    },
  ];

  return (
    <Contenitore className="py-10">
      <JsonLd data={jsonLdFaq(faq)} />
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: "Biglietti", percorso: "/biglietti" },
          { nome: testi.titolo, percorso: `/biglietti/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: testi.titolo,
          url: url(`/biglietti/${slug}`),
          numberOfItems: anteprime.length,
        }}
      />

      <nav aria-label="Percorso" className="mb-4 text-sm font-bold text-notte-tenue">
        <Link href="/biglietti" className="hover:text-viola">
          Biglietti
        </Link>
      </nav>

      <h1 className="text-3xl font-extrabold text-notte sm:text-4xl">{testi.h1}</h1>
      <p className="mt-4 max-w-2xl text-lg text-notte-tenue">{testi.risposta}</p>

      <Link
        href={linkAlTool({ tipo, eta, genere, tema: temaFisso })}
        data-tap
        className="mt-6 inline-flex items-center justify-center rounded-bolla bg-rosa px-8 py-5 text-xl font-extrabold text-white"
      >
        Crea il tuo, gratis
      </Link>

      <section className="mt-12">
        <TitoloSezione>Scegli uno sfondo e personalizzalo</TitoloSezione>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {anteprime.map((t) => (
            <Link
              key={t.theme}
              href={linkAlTool({ tipo, eta, genere, tema: t.theme })}
              className="overflow-hidden rounded-morbido border-4 border-transparent transition-colors hover:border-viola"
              style={{ minHeight: 0, minWidth: 0 }}
            >
              <Biglietto
                dati={{
                  tipo,
                  tema: t.theme,
                  variante: "chiaro",
                  nome: "Sofia",
                  eta: eta ? String(eta) : "",
                  frase: "",
                  data: "",
                  ora: "",
                  luogo: "",
                  conferma: "",
                  firma: "",
                  conMizi: false,
                  carattere: "tondo",
                }}
                larghezza={620}
                altezza={874}
              />
              <span className="block bg-white p-2 text-center text-sm font-bold text-notte">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <TitoloSezione>Tre frasi pronte</TitoloSezione>
        <ul className="flex flex-col gap-3">
          {frasiPronte.map((f) => (
            <li key={f} className="rounded-morbido border-2 border-crema-scuro bg-white p-4 text-lg text-notte">
              {f}
            </li>
          ))}
        </ul>
      </section>

      {pagina.genere !== "colorare" && tipo !== "ringraziamento" && (
        <section className="mt-12">
          <TitoloSezione>Anche per le altre età</TitoloSezione>
          <div className="flex flex-wrap gap-2">
            {ETA_BIGLIETTI.filter((a) => a !== eta).map((a) => (
              <Link
                key={a}
                href={`/biglietti/${tipo === "invito" ? "inviti" : "auguri"}-compleanno-${a}-anni`}
                className="flex items-center justify-center rounded-bolla border-2 border-crema-scuro bg-white px-4 py-2 font-bold text-notte hover:border-viola"
                style={{ minHeight: "2.75rem" }}
              >
                {a} anni
              </Link>
            ))}
          </div>
        </section>
      )}

      <Faq voci={faq} />
    </Contenitore>
  );
}
