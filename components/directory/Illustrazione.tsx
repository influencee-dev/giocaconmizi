/**
 * La fascia illustrata al posto della foto: colore del locale, due bolle e
 * l'icona della categoria. Le foto vere le carica l'attività quando reclama
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
      {/* eslint-disable-next-line @next/next/no-img-element -- icone statiche locali */}
      <img src={`/icone/${icona}.png`} alt="" className={`relative ${grande ? "h-28 w-28" : "h-16 w-16"} drop-shadow-sm`} loading="lazy" />
    </div>
  );
}
