import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * La freccia dei bottoni del template (anche nei componenti client).
 * Icone dell'interfaccia: Lucide (licenza ISC), tratto 2.4 come il resto
 * del sito. Le icone «di contenuto» restano le Fluent 3D (components/icone).
 */
export function Freccia({ className = "h-5 w-5", indietro = false }: { className?: string; indietro?: boolean }) {
  const Componente = indietro ? ArrowLeft : ArrowRight;
  return <Componente className={className} strokeWidth={2.4} aria-hidden />;
}
