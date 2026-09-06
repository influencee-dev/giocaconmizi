"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GameProps } from "@/games/_engine/tipi";

/**
 * Registro dei componenti giocabili.
 *
 * Ogni gioco viene caricato solo quando si apre la sua pagina: aprire
 * /giochi/tabelline non deve scaricare il codice del labirinto.
 * La chiave è lo slug di games/registry.ts.
 *
 * `ssr: false` non è un dettaglio: i giochi costruiscono i round con numeri
 * casuali, quindi l'HTML generato sul server non coinciderebbe mai con quello
 * del browser e l'idratazione fallirebbe (React #418). Montandoli solo nel
 * browser il problema sparisce e non si perde nulla: la pagina indicizzata è
 * /giochi/[slug], questa è soltanto lo schermo di gioco.
 */
export const componenti: Record<string, ComponentType<GameProps>> = {
  "memory-animali": dynamic(() => import("@/games/memory-animali/Game"), { ssr: false }),
  "abbina-i-colori": dynamic(() => import("@/games/abbina-i-colori/Game"), { ssr: false }),
  "trova-la-forma": dynamic(() => import("@/games/trova-la-forma/Game"), { ssr: false }),
  "conta-fino-a-10": dynamic(() => import("@/games/conta-fino-a-10/Game"), { ssr: false }),
  "puzzle-facile": dynamic(() => import("@/games/puzzle-facile/Game"), { ssr: false }),
  "il-suono-dell-animale": dynamic(() => import("@/games/il-suono-dell-animale/Game"), { ssr: false }),
  "grande-piccolo": dynamic(() => import("@/games/grande-piccolo/Game"), { ssr: false }),
  "le-emozioni-di-mizi": dynamic(() => import("@/games/le-emozioni-di-mizi/Game"), { ssr: false }),
  "lettera-iniziale": dynamic(() => import("@/games/lettera-iniziale/Game"), { ssr: false }),
  "tocca-la-lettera": dynamic(() => import("@/games/tocca-la-lettera/Game"), { ssr: false }),
  "unisci-le-sillabe": dynamic(() => import("@/games/unisci-le-sillabe/Game"), { ssr: false }),
  "trova-le-differenze": dynamic(() => import("@/games/trova-le-differenze/Game"), { ssr: false }),
  "unisci-i-puntini": dynamic(() => import("@/games/unisci-i-puntini/Game"), { ssr: false }),
  "cosa-viene-dopo": dynamic(() => import("@/games/cosa-viene-dopo/Game"), { ssr: false }),
  "prime-parole-inglese": dynamic(() => import("@/games/prime-parole-inglese/Game"), { ssr: false }),
  "addizioni-entro-20": dynamic(() => import("@/games/addizioni-entro-20/Game"), { ssr: false }),
  "l-orologio": dynamic(() => import("@/games/l-orologio/Game"), { ssr: false }),
  "ortografia-c-ch-g-gh": dynamic(() => import("@/games/ortografia-c-ch-g-gh/Game"), { ssr: false }),
  tabelline: dynamic(() => import("@/games/tabelline/Game"), { ssr: false }),
  "leggi-e-rispondi": dynamic(() => import("@/games/leggi-e-rispondi/Game"), { ssr: false }),
  "guida-mizi": dynamic(() => import("@/games/guida-mizi/Game"), { ssr: false }),
  "pixel-art": dynamic(() => import("@/games/pixel-art/Game"), { ssr: false }),
  "robot-ballerino": dynamic(() => import("@/games/robot-ballerino/Game"), { ssr: false }),
  "labirinto-a-blocchi": dynamic(() => import("@/games/labirinto-a-blocchi/Game"), { ssr: false }),
  "trova-l-errore": dynamic(() => import("@/games/trova-l-errore/Game"), { ssr: false }),
  tartaruga: dynamic(() => import("@/games/tartaruga/Game"), { ssr: false }),
  "crea-il-tuo-gioco": dynamic(() => import("@/games/crea-il-tuo-gioco/Game"), { ssr: false }),
  "sequenze-logiche": dynamic(() => import("@/games/sequenze-logiche/Game"), { ssr: false }),
  "dove-arriva-mizi": dynamic(() => import("@/games/dove-arriva-mizi/Game"), { ssr: false }),
  "salto-di-mizi": dynamic(() => import("@/games/salto-di-mizi/Game"), { ssr: false }),
  "missione-ghiaccio": dynamic(() => import("@/games/missione-ghiaccio/Game"), { ssr: false }),
};

