import { dataGioco } from "@/lib/seo/date-pagine";
import { games, type GameMeta } from "@/games/registry";

/**
 * Gli ultimi arrivati: i giochi vivi dal più recente al più vecchio.
 *
 * Conta l'ultima modifica vera di un gioco (la sua cartella o la sua scheda),
 * presa da lib/seo/date-pagine.json: un gioco nuovo o appena migliorato sale
 * in cima da solo, senza elenchi da tenere a mano. A parità di giorno viene
 * prima quello aggiunto dopo nel registro.
 */
export function giochiRecenti(quanti: number): GameMeta[] {
  return games
    .map((gioco, posto) => ({ gioco, posto, giorno: dataGioco(gioco.slug)?.getTime() ?? 0 }))
    .filter((v) => v.gioco.status === "live")
    .sort((a, b) => b.giorno - a.giorno || b.posto - a.posto)
    .slice(0, quanti)
    .map((v) => v.gioco);
}
