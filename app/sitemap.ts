import type { MetadataRoute } from "next";
import { games } from "@/games/registry";
import { tutteLeStorie } from "@/lib/content";
import { tutteLePagine } from "@/lib/biglietti";
import { esempiPubblicati } from "@/lib/esempi";
import { GUIDE } from "@/lib/guide";
import { CITTA_FESTE } from "@/lib/feste";
import { CATEGORIE_ATTIVE, LISTING, SCHEDE, percorsoScheda } from "@/lib/directory";
import { classi, eta, url } from "@/lib/seo";
import { chiaveScheda, pubblicate } from "@/lib/directory-db";
import { dataDi, dataGioco } from "@/lib/date-pagine";
import { fotoDellaPagina, fotoGuida } from "@/lib/foto";
import { percorsoRisorsa } from "@/lib/risorse-educative";
import { risorseVisibili } from "@/lib/risorse-reclamo";

/**
 * Sitemap generata dal registry e dai contenuti: un nuovo gioco o una nuova
 * storia entrano in sitemap con il commit, senza passaggi manuali (§4.4).
 */
// Si rigenera ogni 10 minuti: una scheda tolta dal titolare esce anche da qui.
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const risposte = await pubblicate();
  const tolta = (s: (typeof SCHEDE)[number]) => risposte.get(chiaveScheda(s))?.tipo === "rimuovi";
  const reclamate = (await risorseVisibili()).filter((r) => r.reclamata);
  // Date vere (lib/date-pagine.json, dalla storia git): Google ignora i
  // lastmod di una sitemap che dice "modificato adesso" su ogni pagina.
  // Dove una data non c'è, niente lastmod: meglio di uno falso.
  const pagina = (percorso: string) =>
    percorso === "/" ? "app/(public)/page.tsx" : `app/(public)${percorso}/page.tsx`;
  const giochiLive = games.filter((g) => g.status === "live");
  const ultimoGioco = dataDi(...giochiLive.map((g) => dataGioco(g.slug)?.toISOString().slice(0, 10)));
  const giorno = (d: Date | undefined) => d?.toISOString().slice(0, 10);
  const ultimaCitta = CITTA_FESTE.map((c) => c.aggiornata).sort().at(-1);
  const ultimaGuida = GUIDE.map((g) => g.aggiornata).sort().at(-1);
  const storie = tutteLeStorie();
  const ultimaStoria = dataDi(...storie.map((s) => `content/stories/${s.slug}.md`));
  /** Le pagine indice cambiano quando cambia ciò che elencano. */
  const DATI_INDICE: Record<string, (string | undefined)[]> = {
    "/": [giorno(ultimoGioco), ultimaGuida, ultimaCitta],
    "/giochi": [giorno(ultimoGioco)],
    "/storie": [giorno(ultimaStoria)],
    "/storie/stampatello": [giorno(ultimaStoria)],
    "/storie/minuscolo": [giorno(ultimaStoria)],
    "/storie/corsivo": [giorno(ultimaStoria)],
    "/coding": [giorno(dataDi(...giochiLive.filter((g) => g.skill === "coding").map((g) => giorno(dataGioco(g.slug)))))],
    "/biglietti": ["lib/biglietti.ts", "cards/registry.ts"],
    "/biglietti/crea": ["cards/registry.ts"],
    "/biglietti/esempi": ["lib/esempi.ts"],
    "/guide": [ultimaGuida],
    "/feste": [ultimaCitta],
    "/metodo": ["content/hubs/metodo.md"],
    "/perche-lo-facciamo": ["content/hubs/perche-lo-facciamo.md"],
    "/risorse-educative-bambini": ["lib/risorse-educative-dati.ts", "lib/risorse-educative.ts"],
  };
  const ALIAS_COMPETENZA: Record<string, string[]> = {
    lettere: ["alfabeto", "fonetica", "lettura"],
    lettura: ["lettura", "comprensione"],
  };

  const statiche = [
    "/",
    "/giochi",
    "/storie",
    "/storie/stampatello",
    "/storie/minuscolo",
    "/storie/corsivo",
    "/coding",
    "/biglietti",
    "/biglietti/crea",
    "/biglietti/esempi",
    "/guide",
    "/feste",
    "/metodo",
    "/privacy",
    "/cookie",
    "/note-legali",
    "/perche-lo-facciamo",
    "/chi-siamo",
    "/aggiungi-attivita",
    "/per-insegnanti",
    "/per-le-mamme",
    "/risorse-educative-bambini",
  ];

  const competenze = [
    "lettere", "numeri", "colori", "forme", "memoria", "logica",
    "matematica", "lettura", "inglese", "emozioni", "coding",
    "attenzione", "spazio", "ascolto",
  ];

  // Sitemap delle immagini: le foto vere di ogni pagina, così Google
  // Immagini le trova legate alla pagina giusta. Solo foto già consegnate.
  const immagini = (percorsi: string[]) => (percorsi.length ? { images: percorsi.map((p) => url(p)) } : {});

  const voci: MetadataRoute.Sitemap = [
    ...statiche.map((percorso) => ({
      url: url(percorso),
      lastModified: dataDi(pagina(percorso), ...(DATI_INDICE[percorso] ?? [])),
      changeFrequency: "weekly" as const,
      priority: percorso === "/" ? 1 : 0.8,
      ...immagini(fotoDellaPagina(percorso)),
    })),

    // Hub per età: sono le pagine che intercettano la domanda principale (§1.1)
    ...eta.map((anni) => ({
      url: url(`/giochi/eta/${anni}-anni`),
      lastModified: dataDi(
        `content/hubs/${anni}-anni.md`,
        ...giochiLive.filter((g) => anni >= g.ageMin && anni <= g.ageMax).map((g) => giorno(dataGioco(g.slug))),
      ),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),

    ...competenze.map((skill) => ({
      url: url(`/giochi/competenza/${skill}`),
      lastModified: dataDi(
        ...giochiLive
          .filter((g) => (ALIAS_COMPETENZA[skill] ?? [skill]).includes(g.skill))
          .map((g) => giorno(dataGioco(g.slug))),
      ),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...classi.map((classe) => ({
      url: url(`/compiti-vacanze/${classe}`),
      lastModified: dataDi("app/(public)/compiti-vacanze/[classe]/page.tsx"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Le pagine locali delle feste: una per città, keyword locale (GEO)
    ...CITTA_FESTE.map((c) => ({
      url: url(`/feste/${c.slug}`),
      lastModified: dataDi(c.aggiornata),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),

    // La directory: categoria → città → scheda (docs/piano-directory.md)
    ...CATEGORIE_ATTIVE.map((c) => ({
      url: url(`/${c.slug}`),
      lastModified: dataDi(ultimaCitta),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...LISTING.map((l) => ({
      url: url(`/${l.categoria.slug}/${l.cittaSlug}`),
      lastModified: dataDi(CITTA_FESTE.find((c) => c.slug === l.cittaSlug)?.aggiornata),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...SCHEDE.filter((s) => !tolta(s)).map((s) => ({
      url: url(percorsoScheda(s)),
      lastModified: dataDi(CITTA_FESTE.find((c) => c.slug === s.cittaSlug)?.aggiornata),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Le risorse educative che hanno reclamato la scheda hanno la pagina propria.
    // Niente lastmod: la data vera è quella della decisione nel database.
    ...reclamate.map((r) => ({
      url: url(percorsoRisorsa(r)),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),

    // Le guide per i genitori: contenuto evergreen, priorità alta (AEO)
    ...GUIDE.map((g) => ({
      url: url(`/guide/${g.slug}`),
      lastModified: dataDi(g.aggiornata),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      ...immagini([fotoGuida(g.slug, g.foto.alt)?.src].filter((s): s is string => !!s)),
    })),

    ...[5, 6, 7].map((anni) => ({
      url: url(`/storie/eta/${anni}-anni`),
      lastModified: ultimaStoria,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...games.map((g) => ({
      url: url(`/giochi/${g.slug}`),
      lastModified: dataGioco(g.slug),
      changeFrequency: "monthly" as const,
      priority: g.status === "live" ? 0.8 : 0.5,
    })),

    ...storie.map((s) => ({
      url: url(`/storie/${s.slug}`),
      lastModified: dataDi(`content/stories/${s.slug}.md`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Le pagine dei biglietti sono generate da template (piano §14.2)
    ...tutteLePagine().map(({ slug }) => ({
      url: url(`/biglietti/${slug}`),
      lastModified: dataDi("lib/biglietti.ts", "cards/registry.ts"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Gli esempi entrano in sitemap solo quando la loro immagine esiste
    ...esempiPubblicati().map((e) => ({
      url: url(`/biglietti/esempi/${e.slug}`),
      lastModified: dataDi("lib/esempi.ts"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...immagini([`/esempi/${e.slug}.png`]),
    })),
  ];

  return voci;
}
