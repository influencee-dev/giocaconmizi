import {
  Baby,
  Blocks,
  Building2,
  Cake,
  Castle,
  Coffee,
  Dumbbell,
  FerrisWheel,
  Gamepad2,
  Gift,
  House,
  KeyRound,
  Lightbulb,
  type LucideIcon,
  Microscope,
  Package,
  Palette,
  PartyPopper,
  PawPrint,
  Puzzle,
  Rocket,
  Sparkles,
  Star,
  Target,
  Tractor,
  Trees,
  Waves,
  Wand,
  Zap,
} from "lucide-react";

/**
 * Le icone della directory (schede, card, etichette, segnaposto) in stile
 * Lucide, al posto delle emoji Fluent: Giorgia le vuole pulite, a tratto.
 * La chiave è il vecchio nome dell'icona (lib/esperienze.ts, lib/etichette.ts,
 * CATEGORIE in lib/directory.ts), così i dati non cambiano. Un nome nuovo = una riga qui.
 */
const MAPPA: Record<string, LucideIcon> = {
  albero: Trees,
  bebe: Baby,
  biberon: Baby,
  caffe: Coffee,
  capra: PawPrint,
  casa: House,
  castello: Castle,
  chiave: KeyRound,
  festa: PartyPopper,
  fulmine: Zap,
  gamepad: Gamepad2,
  lampadina: Lightbulb,
  mucca: Tractor,
  orsetto: Baby,
  pacco: Package,
  palloncino: PartyPopper,
  pesce: Waves,
  pallone: Dumbbell,
  puzzle: Puzzle,
  razzo: Rocket,
  "ruota-panoramica": FerrisWheel,
  stella: Star,
  tavolozza: Palette,
  telescopio: Microscope,
  torta: Gift,
  "torta-compleanno": Cake,
  unicorno: Wand,
  bersaglio: Target,
  blocchi: Blocks,
  edificio: Building2,
};

export const iconaLucide = (nome: string): LucideIcon => MAPPA[nome] ?? Sparkles;

/** L'icona a tratto, dello stesso colore del testo intorno. */
export function IconaLucide({ nome, className = "h-5 w-5", tratto = 2.2 }: { nome: string; className?: string; tratto?: number }) {
  const I = iconaLucide(nome);
  return <I className={className} strokeWidth={tratto} aria-hidden />;
}
