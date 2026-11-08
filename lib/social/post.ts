import { GUIDE, type Guida } from "@/lib/guide";
import { fotoGuida } from "@/lib/foto";
import { games, type GameMeta } from "@/games/registry";

/**
 * I post Instagram del giorno, costruiti dai contenuti del sito (niente testi
 * inventati: tutto viene dalle guide e dal registro dei giochi).
 *  - carosello: un articolo in 5–7 slide (domanda, risposta breve, punti, invito)
 *  - foto: la foto di testata di una guida con il titolo
 *  - gioco: un gioco gratuito del sito
 * Le slide le disegna app/social/[id]/[file]/route.tsx (JPEG 1080×1350,
 * il formato verticale di Instagram); la pagina /admin/[codice]/social le
 * mostra e Giorgia le pubblica con un tocco (lib/social/instagram.ts).
 */

export type TipoPost = "carosello" | "foto" | "gioco";

export type Slide =
  | { tipo: "copertina"; occhiello: string; titolo: string }
  | { tipo: "testo"; occhiello: string; titolo: string; testo: string; numero?: string }
  | { tipo: "finale"; titolo: string; link: string }
  | { tipo: "foto"; foto: string; occhiello: string; titolo: string; link: string }
  | { tipo: "gioco"; titolo: string; eta: string; allena: string; minuti: number; link: string };

export interface PostSocial {
  /** «carosello-<slug>», «foto-<slug>», «gioco-<slug>»: è anche l'indirizzo delle slide. */
  id: string;
  tipo: TipoPost;
  titolo: string;
  slides: Slide[];
  didascalia: string;
  /** Il link del contenuto sul sito: va nella didascalia e serve a non pubblicare due volte. */
  link: string;
}

const DOMINIO = "giocamizi.it";

/** Il giorno a Roma come numero progressivo: fa ruotare i contenuti senza ripetersi. */
export function giornoDiRoma(data?: string): { iso: string; n: number } {
  const iso = data ?? new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
  return { iso, n: Math.floor(Date.parse(`${iso}T12:00:00Z`) / 86_400_000) };
}

/** La prima frase (o le prime) fino a circa `max` caratteri, senza tagliare parole. */
export function frasiBrevi(testo: string, max = 230): string {
  const frasi = testo.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [testo];
  let fuori = "";
  for (const f of frasi) {
    if ((fuori + f).trim().length > max) break;
    fuori += f;
  }
  if (fuori.trim()) return fuori.trim();
  const tagliato = testo.slice(0, max);
  return `${tagliato.slice(0, tagliato.lastIndexOf(" "))}…`;
}

const HASHTAG_BASE = ["#giocamizi", "#genitori", "#bambini", "#mammeitaliane"];
const HASHTAG_CATEGORIA: Record<string, string[]> = {
  "sicurezza-digitale": ["#sicurezzaonline", "#parentalcontrol", "#educazionedigitale"],
  "guide-giochi": ["#videogiochi", "#educazionedigitale"],
  confronti: ["#videogiochi", "#educazionedigitale"],
  "tavolo-offline": ["#giochidatavolo", "#giochiinfamiglia"],
  "famiglia-abitudini": ["#giochiinfamiglia", "#genitorialita"],
  "mamme-imprenditrici": ["#mammeimprenditrici", "#lavoroefamiglia"],
};
const HASHTAG_SKILL: Partial<Record<string, string[]>> = {
  matematica: ["#matematica", "#tabelline"],
  numeri: ["#matematica"],
  lettura: ["#impararealeggere"],
  coding: ["#codingperbambini", "#coding"],
  inglese: ["#ingleseperbambini"],
  tempo: ["#orologio"],
  emozioni: ["#emozioni"],
};

function hashtag(g: { categoria?: string; skill?: string }) {
  const extra = [...(HASHTAG_CATEGORIA[g.categoria ?? ""] ?? []), ...(HASHTAG_SKILL[g.skill ?? ""] ?? [])];
  return [...new Set([...HASHTAG_BASE, ...extra, "#giochieducativi"])].join(" ");
}

/** I punti del carosello: titolo e prima frase delle sezioni vere della guida. */
function punti(g: Guida) {
  return g.sezioni
    .filter((s) => !/^(introduzione|in breve)/i.test(s.titolo) && s.paragrafi[0])
    .slice(0, 4)
    .map((s) => ({ titolo: s.titolo, testo: frasiBrevi(s.paragrafi[0]) }));
}

export function postCarosello(g: Guida): PostSocial {
  const link = `${DOMINIO}/guide/${g.slug}`;
  const p = punti(g);
  const slides: Slide[] = [
    { tipo: "copertina", occhiello: `Guida per i genitori · ${g.etaMin}–${g.etaMax} anni`, titolo: g.titolo },
    { tipo: "testo", occhiello: "In breve", titolo: g.titoloBreve, testo: frasiBrevi(g.rispostaBreve, 320) },
    ...p.map((x, i): Slide => ({ tipo: "testo", occhiello: "Da sapere", numero: `${i + 1}/${p.length}`, titolo: x.titolo, testo: x.testo })),
    { tipo: "finale", titolo: "La guida completa, gratis e senza pubblicità", link },
  ];
  const didascalia = [
    g.titolo,
    "",
    g.rispostaBreve,
    "",
    `Nelle slide i punti principali. La guida intera, con fonti e domande frequenti, è su ${link} (link in bio).`,
    "",
    hashtag({ categoria: g.approfondimento?.categoria, skill: g.skill }),
  ].join("\n");
  return { id: `carosello-${g.slug}`, tipo: "carosello", titolo: g.titolo, slides, didascalia, link };
}

export function postFoto(g: Guida): PostSocial | null {
  const foto = fotoGuida(g.slug, g.foto.alt);
  if (!foto) return null;
  const link = `${DOMINIO}/guide/${g.slug}`;
  const didascalia = [
    g.titolo,
    "",
    frasiBrevi(g.rispostaBreve, 400),
    "",
    `Tutto il resto, gratis: ${link} (link in bio).`,
    "",
    hashtag({ categoria: g.approfondimento?.categoria, skill: g.skill }),
  ].join("\n");
  return {
    id: `foto-${g.slug}`,
    tipo: "foto",
    titolo: g.titolo,
    slides: [{ tipo: "foto", foto: foto.src, occhiello: `Guida per i genitori · ${g.etaMin}–${g.etaMax} anni`, titolo: g.titolo, link }],
    didascalia,
    link,
  };
}

export function postGioco(gioco: GameMeta): PostSocial {
  const link = `${DOMINIO}/giochi/${gioco.slug}`;
  const eta = `${gioco.ageMin}–${gioco.ageMax} anni`;
  const didascalia = [
    `${gioco.title}: un gioco gratuito di Giocamizi per bambini di ${eta}.`,
    "",
    `Cosa allena: ${gioco.subskill}. Una partita dura circa ${gioco.minutes} minuti, si gioca dal browser del telefono o del tablet, senza pubblicità e senza registrarsi.`,
    "",
    `Si gioca qui: ${link} (link in bio).`,
    "",
    hashtag({ skill: gioco.skill }),
  ].join("\n");
  return {
    id: `gioco-${gioco.slug}`,
    tipo: "gioco",
    titolo: gioco.title,
    slides: [{ tipo: "gioco", titolo: gioco.title, eta, allena: gioco.subskill, minuti: gioco.minutes, link }],
    didascalia,
    link,
  };
}

/**
 * I tre post di un giorno. Il carosello è l'articolo uscito quel giorno, se
 * c'è; altrimenti le guide girano una al giorno (prima le più recenti).
 */
export function postDelGiorno(data?: string): PostSocial[] {
  const { iso, n } = giornoDiRoma(data);
  const recenti = [...GUIDE].sort((a, b) => b.aggiornata.localeCompare(a.aggiornata));
  const diOggi = recenti.find((g) => g.approfondimento?.pubblicata === iso);
  const carosello = diOggi ?? recenti[n % recenti.length];

  const conFoto = recenti.filter((g) => g.slug !== carosello.slug && fotoGuida(g.slug, g.foto.alt));
  const foto = conFoto.length ? postFoto(conFoto[n % conFoto.length]) : null;

  const vivi = games.filter((g) => g.status === "live");
  const gioco = vivi[(n * 7) % vivi.length];

  return [postCarosello(carosello), ...(foto ? [foto] : []), postGioco(gioco)];
}

/** Un post dal suo id (per le slide e per la pubblicazione). */
export function postDaId(id: string): PostSocial | null {
  const [tipo, ...resto] = id.split("-");
  const slug = resto.join("-");
  if (tipo === "carosello" || tipo === "foto") {
    const g = GUIDE.find((x) => x.slug === slug);
    if (!g) return null;
    return tipo === "carosello" ? postCarosello(g) : postFoto(g);
  }
  if (tipo === "gioco") {
    const gioco = games.find((x) => x.slug === slug && x.status === "live");
    return gioco ? postGioco(gioco) : null;
  }
  return null;
}
