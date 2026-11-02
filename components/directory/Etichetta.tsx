import { Icona } from "@/components/icone";
import type { Etichetta as TipoEtichetta } from "@/lib/etichette";

/** L'etichetta colorata del tipo di attività (ludoteca, sala feste, bar…). */
export function Etichetta({ e, grande = false }: { e: TipoEtichetta; grande?: boolean }) {
  return (
    <span
      data-etichetta-tipo={e.id}
      className={`inline-flex items-center gap-1.5 rounded-full font-extrabold ${grande ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs"}`}
      style={{ background: e.fondo, color: e.testo }}
    >
      <Icona nome={e.icona} className={grande ? "h-5 w-5" : "h-4 w-4"} />
      {e.nome}
    </span>
  );
}
