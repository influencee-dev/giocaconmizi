import { tutorialDaSlug } from "./tutorial";

/** La pagina che spiega come si reclama una scheda (attività delle feste e risorse educative). */
export const PERCORSO_COME_RECLAMARE = "/come-reclamare-la-scheda";

/**
 * Il video tutorial del reclamo: vive nel registro dei tutorial (lib/tutorial.ts),
 * che ha la sua pagina in /tutorial/come-reclamare-la-scheda. Qui si riusa.
 */
export const TUTORIAL_RECLAMO = tutorialDaSlug("come-reclamare-la-scheda")!;
export const VIDEO_RECLAMO = TUTORIAL_RECLAMO.video;
