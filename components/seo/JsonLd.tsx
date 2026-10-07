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

/**
 * Una singola pagina di gioco. Doppio tipo Game + LearningResource: per i
 * motori è un gioco, per le AI è una risorsa didattica con scritto cosa
 * insegna (teaches), a chi (audience) e quanto dura.
 */
export function jsonLdGioco(gioco: {
  slug: string;
  title: string;
  description: string;
  ageMin: number;
  ageMax: number;
  skill: string;
  subskill: string;
  minutes: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Game", "LearningResource"],
    name: gioco.title,
    description: gioco.description,
    url: url(`/giochi/${gioco.slug}`),
    inLanguage: site.lingua,
    isAccessibleForFree: true,
    typicalAgeRange: `${gioco.ageMin}-${gioco.ageMax}`,
    genre: "Gioco educativo",
    teaches: gioco.subskill,
    about: gioco.skill,
    learningResourceType: "gioco interattivo",
    educationalUse: "esercitazione",
    interactivityType: "active",
    timeRequired: `PT${gioco.minutes}M`,
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: gioco.ageMin,
      suggestedMaxAge: gioco.ageMax,
    },
    provider: {
      "@type": "Organization",
      name: site.nome,
      url: url("/"),
    },
  };
}

/** Indice di una sezione (hub età, competenza, guide): l'elenco dei contenuti. */
export function jsonLdElenco(nome: string, voci: { nome: string; percorso: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: nome,
    itemListElement: voci.map((voce, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: voce.nome,
      url: url(voce.percorso),
    })),
  };
}

/** Una guida per i genitori: Article con autrice reale (E-E-A-T per motori e AI). */
export function jsonLdArticolo(guida: {
  slug: string;
  titolo: string;
  descrizione: string;
  aggiornata: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guida.titolo,
    description: guida.descrizione,
    url: url(`/guide/${guida.slug}`),
    inLanguage: site.lingua,
    isAccessibleForFree: true,
    datePublished: guida.aggiornata,
    dateModified: guida.aggiornata,
    author: {
      "@type": "Person",
      name: "Giorgia Palazzo",
      description: "Mamma e creatrice di Gioca con Mizi",
      url: url("/chi-siamo"),
    },
    publisher: {
      "@type": "Organization",
      name: site.nome,
      url: url("/"),
    },
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
