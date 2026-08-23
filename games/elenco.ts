/**
 * Slug dei giochi che hanno un componente giocabile.
 *
 * Sta separato da componenti.ts perché quello è client-only: i giochi vengono
 * montati solo nel browser (vedi la nota lì), mentre questo elenco serve al
 * server per generare le rotte.
 */
export const slugGiocabili = [
  "memory-animali",
  "abbina-i-colori",
  "trova-la-forma",
  "conta-fino-a-10",
  "puzzle-facile",
  "il-suono-dell-animale",
  "grande-piccolo",
  "le-emozioni-di-mizi",
  "lettera-iniziale",
  "tocca-la-lettera",
  "unisci-le-sillabe",
  "trova-le-differenze",
  "unisci-i-puntini",
  "cosa-viene-dopo",
  "prime-parole-inglese",
  "addizioni-entro-20",
  "l-orologio",
  "ortografia-c-ch-g-gh",
  "tabelline",
  "leggi-e-rispondi",
  "guida-mizi",
  "pixel-art",
  "robot-ballerino",
  "labirinto-a-blocchi",
  "trova-l-errore",
  "tartaruga",
  "crea-il-tuo-gioco",
  "sequenze-logiche",
] as const;

export const giocabile = (slug: string): boolean =>
  (slugGiocabili as readonly string[]).includes(slug);
