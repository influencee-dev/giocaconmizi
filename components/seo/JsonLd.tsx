import { site, url } from "@/lib/seo";

/**
 * Inietta un blocco JSON-LD. Il contenuto è generato da noi, mai da input utente,
 * quindi dangerouslySetInnerHTML è sicuro qui; le `<` vengono comunque neutralizzate.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Organizzazione + sito: va nel layout pubblico, una volta sola. */
export function jsonLdSito() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.nome,
    url: url("/"),
    inLanguage: site.lingua,
    publisher: {
      "@type": "Organization",
      name: site.nome,
      url: url("/"),
    },
  };
}

/** Una singola pagina di gioco. */
export function jsonLdGioco(gioco: {
  slug: string;
  title: string;
  description: string;
  ageMin: number;
  ageMax: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Game",
    name: gioco.title,
    description: gioco.description,
    url: url(`/giochi/${gioco.slug}`),
    inLanguage: site.lingua,
    isAccessibleForFree: true,
    typicalAgeRange: `${gioco.ageMin}-${gioco.ageMax}`,
    genre: "Gioco educativo",
  };
}

/** Le FAQ in fondo agli hub e alle pagine gioco. */
export function jsonLdFaq(faq: { domanda: string; risposta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.domanda,
      acceptedAnswer: { "@type": "Answer", text: f.risposta },
    })),
  };
}

/** Breadcrumb: gioco → età → competenza, come da piano §3. */
export function jsonLdBreadcrumb(voci: { nome: string; percorso: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: voci.map((voce, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: voce.nome,
      item: url(voce.percorso),
    })),
  };
}

/** Una storia da leggere. */
export function jsonLdStoria(storia: {
  slug: string;
  title: string;
  summary?: string;
  age: number;
  minutes: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ShortStory",
    name: storia.title,
    abstract: storia.summary,
    url: url(`/storie/${storia.slug}`),
    inLanguage: site.lingua,
    isAccessibleForFree: true,
    typicalAgeRange: `${storia.age}-${storia.age + 1}`,
    timeRequired: `PT${storia.minutes}M`,
  };
}
