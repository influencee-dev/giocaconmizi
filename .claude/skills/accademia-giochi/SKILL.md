---
name: accademia-giochi
description: Le competenze di uno sviluppatore di videogiochi esperto (programmazione del ciclo di gioco, sensazione dei comandi, animazione, progettazione dei livelli, prestazioni su telefono, prove con i giocatori) adattate alle regole di Giocamizi. Da usare quando un gioco deve MUOVERSI — corsa, salto, scivolata, oggetti che arrivano, fisica, canvas — oppure quando «va a scatti», «non è fluido», «è rigido», «è ripetitivo», «è piatto», e ogni volta che si progetta un gioco d'azione nuovo. Per il giro completo di upgrade di un gioco resta valida game-designer-mizi: questa skill le sta accanto, non la sostituisce.
---

# Accademia dei giochi

Quello che insegnano le scuole di videogiochi più serie e i testi che tutti i professionisti citano, ridotto a ciò che serve qui: giochi nel browser, da telefono, per bambini di 3–12 anni.

## Prima regola: il canone del sito vince sempre

Tutto ciò che è scritto qui si applica **dentro** le regole di `CLAUDE.md`, `docs/GAME-DESIGN-CHECKLIST.md` e `.claude/skills/game-designer-mizi/SKILL.md`. Le tecniche dei giochi d'azione nascono in giochi con vite, tempo e sconfitta: qui si prendono le tecniche e si lasciano fuori quelle tre cose.

| Nei giochi d'azione classici | Qui si fa così |
|---|---|
| Vite e «game over» | Nessuna vita. Un urto rallenta Mizi e la fa ripartire: la partita arriva sempre al traguardo. |
| Suono di errore, schermo rosso | Mai un suono negativo. Un «ops» morbido, un rimbalzo, una parola gentile. |
| Velocità che cresce per mettere fretta | La difficoltà sale per quantità e combinazioni, mai per fretta. La velocità può variare per dare ritmo, non per far sbagliare. |
| Tempo che scade | Nessun timer, nessun conto alla rovescia. |
| Classifiche, record da battere, serie da non perdere | Solo le stelle del round e l'album di Mizi. |
| Nemici | Ostacoli fermi o prevedibili, mai qualcosa che insegue o spaventa. |
| Difficoltà fissa | Aiuto dopo 3 errori di fila: il gioco mostra la strada (corsia giusta che si illumina, scena che rallenta). |

Se una tecnica non si può adattare, non si usa.

## Le sei materie

Ogni materia ha un file in `riferimenti/`. Si legge quello che serve al problema, non tutti.

1. **Ciclo di gioco e codice** → `riferimenti/programmazione.md`. Tempo trascorso, passi fissi, stato nei `ref`, logica pura senza React, oggetti riusati, casualità con seme.
2. **Sensazione dei comandi** → `riferimenti/sensazione.md`. Risposta immediata, memoria del comando, tolleranze a favore del giocatore, gesti adatti ai bambini.
3. **Animazione e peso** → `riferimenti/sensazione.md` (seconda parte). Curve, schiaccia e allunga, anticipazione, telecamera, ombre e polvere.
4. **Progettazione** → `riferimenti/progettazione.md`. Un verbo, la curva in quattro tempi, alternanza di tensione e respiro, come si impara giocando.
5. **Prestazioni su telefono** → `riferimenti/programmazione.md` (seconda parte) e lo script `misura-fotogrammi.mjs`.
6. **Prove** → il giro di `game-designer-mizi` (partita onesta, sbadato, demo, tocchi nello stesso istante) più la misura dei fotogrammi.

Le fonti, e quanto sono state verificate, stanno in `riferimenti/fonti.md`.

## Il metodo, in ordine

1. **Dare un nome al problema.** «Non è fluido» può voler dire tre cose diverse, che si curano in modi diversi:
   - *prestazioni*: pochi fotogrammi al secondo → si misura;
   - *resa*: i fotogrammi ci sono ma le cose si muovono a scalini o sfarfallano;
   - *sensazione*: il comando arriva in ritardo o il personaggio si muove rigido.
2. **Misurare prima di toccare.**
   `node .claude/skills/accademia-giochi/misura-fotogrammi.mjs <indirizzo o file> "<selettore del pulsante di avvio>" 6`
   Media ≤ 17 ms e 95° percentile ≤ 20 ms: le prestazioni vanno bene, il problema è di resa o di sensazione.
3. **Cambiare una cosa alla volta** e rimisurare.
4. **Giocare davvero**, col giro di `game-designer-mizi`.
5. **Dire cosa è misurato e cosa no.** Il browser di prova disegna via software: i numeri servono a confrontare prima e dopo. Su un telefono vero prova una persona.

## Come entra un gioco d'azione nel sito

- Il gioco è `games/<slug>/Game.tsx`, registrato in `games/registry.ts`, dentro `GameShell`; chiama `onProgress` e `onComplete({ score, stars })` una volta sola.
- La parte che si muove è un `<canvas>` guidato da un solo `requestAnimationFrame`; **la logica sta in un file senza React** (`<nome>-logica.ts`), così la usano lo schermo, la demo e le prove.
- Lo stato vivo del ciclo sta nei `ref`, non nello stato di React. Verso fuori si espone con attributi `data-…` (fase, round, corsia, urti) per le verifiche.
- Un «round» è un tratto con un traguardo: 5–8 tratti, poi la festa. Le stelle contano solo gli urti evitabili.
- `?demo=1` deve arrivare alla festa da sola: serve un pilota automatico che legge lo stesso stato del gioco.
- Suoni con `suona()` di `lib/giochi/suoni.ts`; ogni frase detta sta in `content/voce-mizi.json`.
- Codice, nomi e commenti in italiano.

## Il primo gioco fatto così: «La corsa nella piramide» (20/11/2026)

`games/corsa-nella-piramide` (6–10 anni), motore `games/_engine/Corsa.tsx`, logica pura in `games/_engine/corsa-logica.ts`. È il modello per ogni gioco che si muove.

- Un gioco nuovo di questo tipo è un elenco di tratti (`SpecTratto`): la missione, la frase al portale, gli schemi di file (`gemme`, `casse`, `blocco`, `due-blocchi`, `fosso`). Il primo schema dell'elenco è la novità e compare da solo all'inizio; ogni terza fila è di respiro.
- Nessuna vita: un urto fa ripartire piano e conta come errore del round nel nucleo. Al terzo urto dello stesso tratto scatta l'aiuto: si va più calmi e la strada libera si illumina di viola (`prossimaMossa`, la stessa funzione che guida la demo).
- La velocità dipende solo dall'età (`velocitaPerEta`) e non cambia durante la partita.
- Simulazione a passi fissi di 1/120 s; lo stato vivo sta nei `ref`; verso fuori `data-strada`, `data-urti`, `data-gemme`, `data-in-aria` oltre agli attributi del nucleo.
- Lo stile (tavolozze dei piani, Mizi in pixel art vista di spalle) sta in fondo a `Corsa.tsx`.
- Provato prima di scrivere lo schermo: 900 tratti simulati col pilota a due passi di tempo diversi, zero urti e sempre arrivo al portale. Una prova così costa poco e va rifatta se si tocca la logica.
- Trovato simulando: il pilota smetteva di guardare un blocco quando gli era accanto e cambiava strada sbattendoci contro. Un ostacolo conta finché non è alle spalle.
