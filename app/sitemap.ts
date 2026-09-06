import type { MetadataRoute } from "next";
import { games } from "@/games/registry";
import { tutteLeStorie } from "@/lib/content";
import { tutteLePagine } from "@/lib/biglietti";
import { esempiPubblicati } from "@/lib/esempi";
import { classi, eta, url } from "@/lib/seo";

/**
 * Sitemap generata dal registry e dai contenuti: un nuovo gioco o una nuova
 * storia entrano in sitemap con il commit, senza passaggi manuali (§4.4).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const aggiornato = new Date();

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
    "/metodo",
    "/privacy",
    "/cookie",
    "/perche-lo-facciamo",
    "/chi-siamo",
    "/per-insegnanti",
  ];

  const competenze = [
    "lettere", "numeri", "colori", "forme", "memoria", "logica",
    "matematica", "lettura", "inglese", "emozioni", "coding",
    "attenzione", "spazio", "ascolto",
  ];

  const voci: MetadataRoute.Sitemap = [
    ...statiche.map((percorso) => ({
      url: url(percorso),
      lastModified: aggiornato,
      changeFrequency: "weekly" as const,
      priority: percorso === "/" ? 1 : 0.8,
    })),

    // Hub per età: sono le pagine che intercettano la domanda principale (§1.1)
    ...eta.map((anni) => ({
      url: url(`/giochi/eta/${anni}-anni`),
      lastModified: aggiornato,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),

    ...competenze.map((skill) => ({
      url: url(`/giochi/competenza/${skill}`),
      lastModified: aggiornato,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...classi.map((classe) => ({
      url: url(`/compiti-vacanze/${classe}`),
      lastModified: aggiornato,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...[5, 6, 7].map((anni) => ({
      url: url(`/storie/eta/${anni}-anni`),
      lastModified: aggiornato,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...games.map((g) => ({
      url: url(`/giochi/${g.slug}`),
      lastModified: aggiornato,
      changeFrequency: "monthly" as const,
      priority: g.status === "live" ? 0.8 : 0.5,
    })),

    ...tutteLeStorie().map((s) => ({
      url: url(`/storie/${s.slug}`),
      lastModified: aggiornato,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Le pagine dei biglietti sono generate da template (piano §14.2)
    ...tutteLePagine().map(({ slug }) => ({
      url: url(`/biglietti/${slug}`),
      lastModified: aggiornato,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Gli esempi entrano in sitemap solo quando la loro immagine esiste
    ...esempiPubblicati().map((e) => ({
      url: url(`/biglietti/esempi/${e.slug}`),
      lastModified: aggiornato,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return voci;
}
