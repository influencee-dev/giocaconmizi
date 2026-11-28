/**
 * I contributi che si pagano su Giocamizi (docs/piano-ai-a-pagamento.md).
 * Decisioni di Giorgia del 27/11/2026. Prezzi IVA inclusa, in centesimi.
 * Mai «donazione»: è un servizio venduto da Partidea SRL, con ricevuta.
 */

export type TipoContributo = "mamma_anno" | "scheda";

export interface Contributo {
  tipo: TipoContributo;
  importoCent: number;
  /** Il nome che compare nel pagamento di Stripe e nella ricevuta. */
  nome: string;
  descrizione: string;
}

export const CONTRIBUTI: Record<TipoContributo, Contributo> = {
  mamma_anno: {
    tipo: "mamma_anno",
    importoCent: 1000,
    nome: "Ricerca con l'AI su Giocamizi · 12 mesi",
    descrizione: "Ricerche con l'AI senza limiti (fino a 50 al giorno) per 12 mesi. Nessun rinnovo automatico.",
  },
  scheda: {
    tipo: "scheda",
    importoCent: 200,
    nome: "Compilazione con l'AI della scheda su Giocamizi",
    descrizione: "L'AI legge i link della tua attività e compila la scheda: la controlli tu prima di inviarla.",
  },
};

/** Ricerche gratis per ogni mamma registrata, prima del contributo. */
export const RICERCHE_GRATIS = 3;
/** Tetto per persona, per evitare abusi (lo controlla anche il database). */
export const RICERCHE_AL_GIORNO = 50;

export const euro = (cent: number) => `${(cent / 100).toFixed(2).replace(".", ",").replace(",00", "")} €`;

export const eTipoContributo = (v: unknown): v is TipoContributo => v === "mamma_anno" || v === "scheda";
