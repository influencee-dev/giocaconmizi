/**
 * Le pagine ISR che i menu non precaricano: nel server delle verifiche il
 * precarico resta appeso mentre la pagina di partenza lavora (es. il creatore
 * di biglietti) e la prova «rete ferma» scade. Per chi naviga non cambia
 * niente: la pagina si carica al tocco, già pronta in cache.
 */
export const SENZA_PRECARICO = new Set(["/natale", "/risorse-educative-bambini"]);
