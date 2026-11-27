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
  type Tipo,
} from "@/lib/biglietti/biglietti";
import { url } from "@/lib/seo/seo";

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
        "Biglietti di compleanno da stampare e colorare, gratis: disegni a contorni neri, il nome a lettere vuote e il testo già scritto. Pronti in due minuti.",
      risposta:
        "Puoi creare gratis un biglietto di compleanno da colorare: scegli un tema, scrivi il nome e stampalo. I disegni della cornice, gli adesivi e il nome a lettere vuote escono a soli contorni neri, mentre data e luogo restano scritti pieni e leggibili.",
    };
  }

  const nomi = NOMI_TIPO[pagina.tipo];

  if (pagina.genere === "frasi") {
    // 27/11/2026 (piano SEO §7): «frasi inviti compleanno» e «cosa scrivere
    // biglietto auguri compleanno». Tutte le frasi nostre, non solo tre.
    const quante = frasiPerTema(pagina.tipo).reduce((n, g) => n + g.frasi.length, 0);
    if (pagina.tipo === "invito") {
      return {
        h1: "Frasi per inviti di compleanno per bambini",
        titolo: `Frasi per inviti di compleanno: ${quante} frasi pronte`,
        descrizione: `${quante} frasi pronte per l'invito di compleanno di tuo figlio, anche a tema, e cosa scrivere sull'invito. Copiale o aprile già scritte nel creatore gratuito.`,
        risposta: `Qui trovi ${quante} frasi per l'invito di compleanno, brevi e col nome del festeggiato, divise per tema. Sotto c'è cosa scrivere sull'invito oltre alla frase. Ogni gruppo apre il creatore con lo sfondo giusto: aggiungi il nome e mandalo su WhatsApp o stampalo.`,
      };
    }
    return {
      h1: "Cosa scrivere nel biglietto di auguri di compleanno di un bambino",
      titolo: "Frasi di auguri di compleanno per bambini, pronte",
      descrizione: `${quante} frasi di auguri di compleanno per bambini, brevi e col nome, e cosa scrivere nel biglietto. Copiale o aprile già scritte nel creatore gratuito.`,
      risposta: `Nel biglietto di auguri per un bambino basta poco: il suo nome, una frase breve e la firma. Qui trovi ${quante} frasi pronte da copiare, oppure da aprire già scritte nel creatore, dove scegli lo sfondo e lo scarichi.`,
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
    descrizione: `${maiuscola(nomi.plurale)} di compleanno per bambini da creare gratis online: 26 temi, personalizzabili con nome ed età. Senza registrazione.`,
    risposta: `Puoi creare gratis ${nomi.plurale} di compleanno per bambini scegliendo fra ventisette temi, scriverci nome ed età e scaricarli subito. Non serve registrarsi e non c'è nessuna filigrana.`,
  };
}

const maiuscola = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Le frasi di un tipo divise in gruppi: prima quelle comuni, poi una per tema.
 * Negli auguri di compleanno il Natale resta fuori (ha la sua pagina).
 */
function frasiPerTema(tipo: Tipo): { tema?: string; nome: string; frasi: string[] }[] {
  const comuni = frasi(tipo, "{nome}", "{eta}");
  const gruppi: { tema?: string; nome: string; frasi: string[] }[] = [];
  for (const t of temi) {
    if (tipo !== "invito" && t.theme === "natale") continue;
    const tutte = frasi(tipo, "{nome}", "{eta}", t.theme);
    const sue = tutte.slice(0, tutte.length - comuni.length);
    if (sue.length) gruppi.push({ tema: t.theme, nome: t.label, frasi: sue });
  }
  return [{ nome: "Frasi brevi, per ogni festa", frasi: comuni }, ...gruppi];
}

/** Il segnaposto diventa un nome d'esempio, così la frase si legge come sarà. */
const conEsempio = (f: string) => f.replace(/\{nome\}/g, "Sofia").replace(/\{eta\}/g, "6");

const COSA_SCRIVERE: Record<"invito" | "auguri", { titolo: string; voci: string[] }> = {
  invito: {
    titolo: "Cosa scrivere sull'invito, oltre alla frase",
    voci: [
      "Il nome del festeggiato e quanti anni compie.",
      "Il giorno, l'ora d'inizio e, se serve, l'ora in cui finisce.",
      "L'indirizzo preciso del posto, con il nome della sala o del locale.",
      "A chi confermare e entro quando: un numero per WhatsApp basta.",
      "Se serve qualcosa: calzini antiscivolo, costume, cambio di vestiti.",
    ],
  },
  auguri: {
    titolo: "Cosa scrivere nel biglietto di auguri",
    voci: [
      "Il nome del bambino, all'inizio: è la prima cosa che cerca.",
      "Una frase breve, che lui o lei possa leggere da solo se va già a scuola.",
      "Un augurio per l'anno che comincia: amici, giochi, cose nuove.",
      "La firma di chi lo manda: per i più piccoli anche un disegno va bene.",
    ],
  },
};

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
  const variante = pagina.genere === "colorare" ? "colorare" : "chiaro";

  // Le anteprime sono biglietti veri, fatti con lo stesso componente del tool.
  const anteprime = (temaFisso ? temi.filter((t) => t.theme === temaFisso) : temiPer(eta, genere))
    .slice(0, temaFisso ? 1 : 8);

  const frasiPronte = frasi(tipo, "Sofia", eta ?? 5, temaFisso).slice(0, 3);

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
  if (pagina.genere === "frasi" && pagina.tipo === "invito") {
    faq.unshift({
      domanda: "Cosa si scrive su un invito di compleanno per bambini?",
      risposta:
        "Il nome e gli anni del festeggiato, giorno e ora, l'indirizzo del posto e a chi confermare entro quando. La frase d'invito va in alto ed è meglio corta: una riga col nome del bambino.",
    });
  } else if (pagina.genere === "frasi") {
    faq.unshift({
      domanda: "Cosa scrivere nel biglietto di auguri di compleanno di un bambino?",
      risposta:
        "Il suo nome, una frase breve di auguri e la firma. Se va già a scuola, scegli parole semplici che possa leggere da solo.",
    });
  }
  const gruppiFrasi = pagina.genere === "frasi" ? frasiPerTema(pagina.tipo) : [];
  const cosaScrivere = pagina.genere === "frasi" && pagina.tipo !== "ringraziamento" ? COSA_SCRIVERE[pagina.tipo] : null;

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
        href={linkAlTool({ tipo, eta, genere, tema: temaFisso, variante: variante === "colorare" ? variante : undefined })}
        data-tap
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-viola px-8 py-5 text-xl font-extrabold text-white"
      >
        Crea il tuo, gratis
      </Link>

      <section className="mt-12">
        <TitoloSezione>Scegli uno sfondo e personalizzalo</TitoloSezione>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {anteprime.map((t) => (
            <Link
              key={t.theme}
              href={linkAlTool({ tipo, eta, genere, tema: t.theme, variante: variante === "colorare" ? variante : undefined })}
              className="overflow-hidden rounded-morbido border-4 border-transparent transition-colors hover:border-viola"
              style={{ minHeight: 0, minWidth: 0 }}
            >
              <Biglietto
                dati={{
                  tipo,
                  tema: t.theme,
                  variante,
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

      {cosaScrivere && (
        <section className="mt-12" data-cosa-scrivere>
          <TitoloSezione>{cosaScrivere.titolo}</TitoloSezione>
          <ul className="flex max-w-2xl list-disc flex-col gap-2 pl-6 text-lg text-notte">
            {cosaScrivere.voci.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </section>
      )}

      {gruppiFrasi.length > 0 ? (
        <section className="mt-12" data-frasi-tutte>
          <TitoloSezione>Le frasi, divise per tema</TitoloSezione>
          <p className="mb-6 max-w-2xl text-notte-tenue">
            Sofia e 6 anni sono un esempio: nel creatore metti il nome e l&apos;età di tuo figlio.
          </p>
          <div className="flex flex-col gap-8">
            {gruppiFrasi.map((g) => (
              <div key={g.nome} data-gruppo-frasi>
                <h3 className="mb-3 text-xl font-extrabold text-notte">{g.nome}</h3>
                <ul className="flex flex-col gap-2">
                  {g.frasi.map(conEsempio).map((f) => (
                    <li key={f} className="rounded-[1.4rem] border border-notte/10 bg-white p-4 text-lg text-notte">
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={linkAlTool({ tipo, tema: g.tema })}
                  className="mt-3 inline-block font-bold text-viola hover:text-notte"
                >
                  {g.tema ? `Crea ${tipo === "invito" ? "l'invito" : "il biglietto"} ${g.nome.toLowerCase()} con queste frasi →` : `Usale nel creatore →`}
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-12">
          <TitoloSezione>Tre frasi pronte</TitoloSezione>
          <ul className="flex flex-col gap-3">
            {frasiPronte.map((f) => (
              <li key={f} className="rounded-[1.4rem] border border-notte/10 bg-white p-4 text-lg text-notte">
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

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
