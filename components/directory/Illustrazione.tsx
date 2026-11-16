import { IconaLucide } from "./IconaLucide";

/**
 * La fascia illustrata al posto della foto: colore del locale, due bolle e
 * l'icona della categoria (a tratto, Lucide). Le foto vere le carica l'attività quando reclama
 * la scheda (con la licenza nei termini): mai foto prese dai loro siti.
 */
export function Illustrazione({
  colore,
  icona,
  alta = "h-40",
  grande = false,
}: {
  colore: string;
  icona: string;
  alta?: string;
  grande?: boolean;
}) {
  return (
    <div className={`relative flex ${alta} items-center justify-center overflow-hidden`} style={{ background: colore }} aria-hidden>
      <span className="absolute -left-6 -top-8 h-28 w-28 rounded-full bg-white/50" />
      <span className="absolute -bottom-10 right-6 h-24 w-24 rounded-full bg-white/40" />
      <span className="absolute right-1/4 top-4 h-6 w-6 rounded-full bg-white/60" />
      <span
        className={`relative flex items-center justify-center rounded-full bg-white/85 text-notte shadow-[0_8px_24px_rgba(31,36,48,0.12)] ${grande ? "h-28 w-28" : "h-16 w-16"}`}
      >
        <IconaLucide nome={icona} className={grande ? "h-14 w-14" : "h-8 w-8"} tratto={1.8} />
      </span>
    </div>
  );
}
