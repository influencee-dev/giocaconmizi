import { IconaLucide } from "./IconaLucide";
import type { Etichetta as TipoEtichetta } from "@/lib/etichette";

/** L'etichetta colorata del tipo di attività (ludoteca, sala feste, bar…). */
export function Etichetta({ e, grande = false }: { e: TipoEtichetta; grande?: boolean }) {
  return (
    <span
      data-etichetta-tipo={e.id}
      className={`inline-flex items-center gap-1.5 rounded-full font-extrabold ${grande ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs"}`}
      style={{ background: e.fondo, color: e.testo }}
    >
      <IconaLucide nome={e.icona} className={grande ? "h-4 w-4" : "h-3.5 w-3.5"} tratto={2.5} />
      {e.nome}
    </span>
  );
}
