import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Lettura dei contenuti in content/*.
 * I testi degli hub sono già scritti nello starter: qui li leggiamo e li
 * renderizziamo, non li riscriviamo (README dello starter, punto 4).
 */

const RADICE = path.join(process.cwd(), "content");

export interface Hub {
  slug: string;
  title: string;
  description: string;
  age?: number;
  grade?: string;
  games: string[];
  html: string;
}

export interface Storia {
  slug: string;
  title: string;
  age: number;
  theme: string;
  minutes: number;
  summary?: string;
  testo: string;
}

export interface TestoGioco {
  slug: string;
  title: string;
  description: string;
  ageMin: number;
  ageMax: number;
  skill: string;
  subskill?: string;
  html: string;
  /** Estratte dalla sezione "Domande frequenti", per il JSON-LD FAQPage. */
  faq: { domanda: string; risposta: string }[];
}

function leggiCartella(cartella: string): string[] {
  const dir = path.join(RADICE, cartella);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

function leggiFile(cartella: string, nomeFile: string) {
  const percorso = path.join(RADICE, cartella, nomeFile);
  if (!fs.existsSync(percorso)) return null;
  return matter(fs.readFileSync(percorso, "utf8"));
}

/** Markdown → HTML. Contenuto nostro, versionato nel repo: nessun input esterno. */
function html(markdown: string): string {
  return marked.parse(markdown, { async: false });
}

export function tuttiGliHub(): Hub[] {
  return leggiCartella("hubs")
    .map((f) => hub(f.replace(/\.md$/, "")))
    .filter((h): h is Hub => h !== null);
}

export function hub(slug: string): Hub | null {
  const file = leggiFile("hubs", `${slug}.md`);
  if (!file) return null;
  const dati = file.data as Partial<Hub>;
  return {
    slug,
    title: dati.title ?? slug,
    description: dati.description ?? "",
    age: dati.age,
    grade: dati.grade,
    games: dati.games ?? [],
    html: html(file.content),
  };
}

export function tutteLeStorie(): Storia[] {
  return leggiCartella("stories")
    .map((f) => storia(f.replace(/\.md$/, "")))
    .filter((s): s is Storia => s !== null);
}

export function storia(slug: string): Storia | null {
  const file = leggiFile("stories", `${slug}.md`);
  if (!file) return null;
  const dati = file.data as Partial<Storia>;
  return {
    slug,
    title: dati.title ?? slug,
    age: dati.age ?? 6,
    theme: dati.theme ?? "",
    minutes: dati.minutes ?? 3,
    summary: dati.summary,
    // Le storie restano testo grezzo: il lettore cambia carattere e dimensione,
    // quindi non le incapsuliamo in HTML strutturato.
    testo: file.content.trim(),
  };
}

/**
 * Le FAQ nei .md sono scritte come **domanda** su una riga e risposta sotto.
 * Le rileggiamo qui invece di duplicarle nel frontmatter: il testo visibile e
 * quello strutturato restano per forza la stessa cosa.
 */
function estraiFaq(markdown: string): { domanda: string; risposta: string }[] {
  const sezione = markdown.split(/^##\s+Domande frequenti\s*$/m)[1];
  if (!sezione) return [];

  const voci: { domanda: string; risposta: string }[] = [];
  const regex = /^\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n##|$)/gm;

  for (const trovata of sezione.matchAll(regex)) {
    const risposta = trovata[2].trim();
    if (risposta) voci.push({ domanda: trovata[1].trim(), risposta });
  }
  return voci;
}

export function testoGioco(slug: string): TestoGioco | null {
  const file = leggiFile("games", `${slug}.md`);
  if (!file) return null;
  const dati = file.data as Partial<TestoGioco>;
  return {
    slug,
    title: dati.title ?? slug,
    description: dati.description ?? "",
    ageMin: dati.ageMin ?? 3,
    ageMax: dati.ageMax ?? 12,
    skill: dati.skill ?? "",
    subskill: dati.subskill,
    html: html(file.content),
    faq: estraiFaq(file.content),
  };
}
