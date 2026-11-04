// I dati strutturati (JSON-LD) di una pagina: si leggono, si controllano con
// le regole di Google per i risultati arricchiti e con le nostre per le AI.
// Ogni problema torna come testo corto: la batteria seo li raccoglie.

const DOMINIO = "https://giocamizi.it";
const TIPI_NOTI = new Set([
  "WebSite", "Organization", "Person", "FAQPage", "Question", "Answer", "BreadcrumbList", "ListItem", "ItemList",
  "Article", "BlogPosting", "VideoGame", "Game", "LearningResource", "CreativeWork", "Book", "ShortStory", "WebPage",
  "CollectionPage", "AboutPage", "ContactPage", "LocalBusiness", "ChildCare", "EventVenue", "AmusementPark", "Museum",
  "SportsActivityLocation", "NGO", "Place", "PostalAddress", "GeoCoordinates", "ImageObject", "SearchAction", "EntryPoint",
  "HowTo", "HowToStep", "Offer", "AggregateRating", "Thing", "Course", "DefinedTerm", "PropertyValue", "AudienceType",
  "Audience", "PeopleAudience", "EducationalAudience", "QuantitativeValue", "VirtualLocation", "MediaObject", "VideoObject",
  "SoftwareApplication", "WebApplication", "ImageGallery", "Event", "ContactPoint", "Country", "City", "AdministrativeArea", "Service",
]);

/** Testo leggibile della pagina, per controllare che le FAQ siano davvero visibili. */
function testoVisibile(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}
const normale = (t) => t.replace(/[«»"“”'’]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

function* nodi(x) {
  if (Array.isArray(x)) for (const v of x) yield* nodi(v);
  else if (x && typeof x === "object") {
    yield x;
    for (const v of Object.values(x)) yield* nodi(v);
  }
}
const tipi = (n) => (Array.isArray(n["@type"]) ? n["@type"] : n["@type"] ? [n["@type"]] : []);

export function validaJsonLd(html, percorso) {
  const problemi = [];
  const blocchi = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const dati = [];
  for (const b of blocchi) {
    try {
      dati.push(JSON.parse(b));
    } catch {
      problemi.push(`${percorso}: JSON-LD non leggibile`);
    }
  }
  const visibile = normale(testoVisibile(html));
  let faqPage = 0;

  for (const radice of dati) {
    for (const r of Array.isArray(radice) ? radice : [radice]) {
      if (!String(r["@context"] ?? "").includes("schema.org")) problemi.push(`${percorso}: JSON-LD senza @context schema.org`);
    }
    for (const n of nodi(radice)) {
      for (const t of tipi(n)) if (!TIPI_NOTI.has(t)) problemi.push(`${percorso}: tipo sconosciuto «${t}»`);
      const t = tipi(n);
      if (t.includes("FAQPage")) {
        faqPage++;
        const domande = Array.isArray(n.mainEntity) ? n.mainEntity : [];
        if (!domande.length) problemi.push(`${percorso}: FAQPage senza domande`);
        for (const q of domande) {
          const risposta = q?.acceptedAnswer?.text;
          if (!q?.name || !risposta) {
            problemi.push(`${percorso}: domanda FAQ incompleta`);
            continue;
          }
          // Google: le FAQ marcate devono essere visibili nella pagina.
          if (!visibile.includes(normale(q.name).slice(0, 60))) problemi.push(`${percorso}: FAQ non visibile «${String(q.name).slice(0, 50)}»`);
        }
      }
      if (t.includes("BreadcrumbList")) {
        const voci = Array.isArray(n.itemListElement) ? n.itemListElement : [];
        if (voci.length < 2) problemi.push(`${percorso}: briciole con meno di 2 voci`);
        voci.forEach((v, i) => {
          if (v.position !== i + 1) problemi.push(`${percorso}: briciola ${i + 1} con position ${v.position}`);
          const item = typeof v.item === "string" ? v.item : v.item?.["@id"];
          if (!v.name || !item) problemi.push(`${percorso}: briciola ${i + 1} senza nome o indirizzo`);
          else if (!item.startsWith(DOMINIO)) problemi.push(`${percorso}: briciola fuori dominio ${item}`);
        });
      }
      if (t.includes("Article") || t.includes("BlogPosting")) {
        if (!n.headline) problemi.push(`${percorso}: Article senza headline`);
        else if (String(n.headline).length > 110) problemi.push(`${percorso}: headline oltre 110 caratteri`);
        if (!n.datePublished || Number.isNaN(Date.parse(n.datePublished))) problemi.push(`${percorso}: Article senza datePublished valida`);
        if (!n.author) problemi.push(`${percorso}: Article senza author`);
        if (!n.image) problemi.push(`${percorso}: Article senza image`);
      }
      if (t.includes("ItemList")) {
        const voci = Array.isArray(n.itemListElement) ? n.itemListElement : [];
        if (!voci.length) problemi.push(`${percorso}: ItemList vuota`);
      }
    }
  }
  // Google mostra una sola FAQPage per pagina: due blocchi si fanno concorrenza.
  if (faqPage > 1) problemi.push(`${percorso}: ${faqPage} FAQPage nella stessa pagina`);
  return { problemi, blocchi: dati.length, tipi: dati.flatMap((d) => [...nodi(d)].flatMap(tipi)) };
}
