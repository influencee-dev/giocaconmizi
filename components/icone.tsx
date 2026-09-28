import type { Skill } from "@/games/registry";

/**
 * La libreria di icone del sito: Fluent Emoji di Microsoft (licenza MIT),
 * lo stile lucido e tridimensionale scelto da Giorgia, copiate in
 * public/icone/ con nomi italiani (vedi public/icone/LICENZA.txt).
 * Solo la bandiera UK resta di Twemoji (Fluent non ha le bandiere).
 *
 * Un'icona nuova = un file copiato in public/icone/ + un nome qui sotto.
 * Le card dei giochi usano IconaGioco: prima cerca l'icona specifica del
 * gioco (la sveglia per "Che ore sono?"), altrimenti quella della competenza.
 */

export type NomeIcona =
  | "cervello" | "lampadina" | "tavolozza"
  | "tondo-rosso" | "tondo-blu" | "quadrato-blu" | "triangolo" | "stella"
  | "abaco" | "numeri" | "piu" | "per"
  | "orecchio" | "altoparlante" | "microfono"
  | "faccia-felice" | "faccia-triste"
  | "abc-min" | "abc-mai"
  | "libro" | "lente" | "matita" | "spunta" | "domanda"
  | "bandiera-uk"
  | "robot" | "alieno-pixel" | "gamepad" | "bussola"
  | "ghiaccio" | "bug" | "ingranaggio" | "link"
  | "pinguino" | "tartaruga" | "elefante" | "topo"
  | "scimmia" | "cane" | "gatto" | "pesce" | "mucca"
  | "orologio" | "note" | "puzzle" | "razzo" | "torta";

/** L'icona (o la coppia/terzina) che racconta ogni competenza. */
export const ICONE_SKILL: Record<Skill, NomeIcona[]> = {
  memoria: ["cervello"],
  colori: ["tavolozza"],
  forme: ["tondo-rosso", "triangolo", "quadrato-blu"],
  numeri: ["numeri"],
  spazio: ["puzzle"],
  ascolto: ["orecchio", "altoparlante"],
  logica: ["lampadina"],
  emozioni: ["faccia-felice", "faccia-triste"],
  fonetica: ["altoparlante", "abc-mai"],
  alfabeto: ["abc-mai"],
  lettura: ["libro"],
  attenzione: ["lente"],
  matematica: ["abaco"],
  ortografia: ["matita", "spunta"],
  inglese: ["bandiera-uk"],
  comprensione: ["libro", "domanda"],
  coding: ["robot"],
  tempo: ["orologio"],
};

/** Icone su misura per i giochi dove si può fare di meglio della competenza. */
export const ICONE_GIOCO: Record<string, NomeIcona[]> = {
  "memory-animali": ["scimmia", "cane", "gatto"],
  "conta-fino-a-10": ["pesce", "numeri"],
  "il-suono-dell-animale": ["altoparlante", "mucca"],
  "grande-piccolo": ["elefante", "topo"],
  "unisci-le-sillabe": ["link", "abc-mai"],
  "unisci-i-puntini": ["matita", "numeri"],
  "cosa-viene-dopo": ["tondo-rosso", "quadrato-blu", "domanda"],
  "addizioni-entro-20": ["piu", "pesce"],
  "l-orologio": ["orologio"],
  tabelline: ["per", "numeri"],
  "leggi-e-rispondi": ["libro", "domanda"],
  "guida-mizi": ["pinguino", "pesce"],
  "pixel-art": ["alieno-pixel", "tavolozza"],
  "robot-ballerino": ["robot", "note"],
  "labirinto-a-blocchi": ["bussola", "pinguino"],
  "trova-l-errore": ["bug", "lente"],
  "dove-arriva-mizi": ["pinguino", "domanda"],
  "salto-di-mizi": ["pinguino", "tondo-blu"],
  "missione-ghiaccio": ["pinguino", "ghiaccio"],
  tartaruga: ["tartaruga", "matita"],
  "crea-il-tuo-gioco": ["gamepad", "ingranaggio"],
};

/** Le poche icone rimaste in SVG Twemoji (Fluent non ha le bandiere). */
const ANCORA_TWEMOJI = new Set<NomeIcona>(["bandiera-uk"]);

/** Una fila di icone dentro il banner crema delle card. */
export function Icone({ nomi, lato = "h-12 w-12" }: { nomi: NomeIcona[]; lato?: string }) {
  return (
    <span aria-hidden className="flex items-center justify-center gap-2">
      {nomi.map((n) => (
        // eslint-disable-next-line @next/next/no-img-element -- file statici locali, niente da ottimizzare
        <img
          key={n}
          src={`/icone/${n}.${ANCORA_TWEMOJI.has(n) ? "svg" : "png"}`}
          alt=""
          className={lato}
          loading="lazy"
        />
      ))}
    </span>
  );
}

/** L'illustrazione di una card gioco: icona del gioco, o della competenza. */
export function IconaGioco({ slug, skill }: { slug?: string; skill: Skill }) {
  const nomi = (slug && ICONE_GIOCO[slug]) || ICONE_SKILL[skill] || ICONE_SKILL.forme;
  return <Icone nomi={nomi} />;
}
