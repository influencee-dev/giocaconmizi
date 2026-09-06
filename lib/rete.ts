/**
 * La rete delle mamme — il listing di /per-le-mamme.
 *
 * COME SI AGGIUNGE UNA REALTÀ: una voce in RETE qui sotto, con la categoria
 * giusta, e la pagina si aggiorna da sola (anche sitemap e llms.txt la
 * linkano già). Niente database: una segnalazione arriva via email, Giorgia
 * la verifica, e la voce entra con un commit.
 *
 * Criteri (dichiarati anche in pagina): realtà utili alle mamme, verificate
 * una per una; l'inserimento è gratuito e non è pubblicità a pagamento.
 */

export const CATEGORIE = {
  associazione: {
    nome: "Associazioni",
    descrizione:
      "Associazioni di categoria e realtà che aiutano famiglie e infanzia e vogliono farsi conoscere.",
  },
  community: {
    nome: "Community di mamme",
    descrizione:
      "Gruppi di mamme della tua zona: per conoscersi, scambiarsi consigli e darsi una mano.",
  },
  ascolto: {
    nome: "Gruppi d'ascolto",
    descrizione:
      "Spazi dove le mamme si ascoltano davvero: cerchi mamme, gruppi di sostegno, sportelli.",
  },
  locale: {
    nome: "Locali family-friendly",
    descrizione:
      "Bar, ristoranti e spazi con nursery, area giochi o attività per bambini: dove sei benvenuta col passeggino.",
  },
} as const;

export type Categoria = keyof typeof CATEGORIE;

export interface VoceRete {
  nome: string;
  categoria: Categoria;
  /** Città o zona; "Tutta Italia" per le realtà online/nazionali. */
  dove: string;
  descrizione: string;
  /** Sito, pagina social o link al gruppo. */
  link?: string;
  /** Contatto pubblico fornito dalla realtà stessa (mai dati privati). */
  contatto?: string;
}

/** Le realtà inserite finora. Le prime arriveranno dalle segnalazioni. */
export const RETE: VoceRete[] = [];

export function perCategoria(categoria: Categoria): VoceRete[] {
  return RETE.filter((v) => v.categoria === categoria);
}
