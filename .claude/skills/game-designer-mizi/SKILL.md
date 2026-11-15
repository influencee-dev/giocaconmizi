---
name: game-designer-mizi
description: Il metodo del game designer di Giocamizi (vent'anni di giochi per bambini 3-12) per fare l'upgrade di UN gioco alla volta — giocarlo davvero da telefono, trovare i bug, migliorarlo, scrivere le frasi per la voce registrata di Mizi (bambina, OpenAI), agganciarlo all'album di Mizi. Da leggere PRIMA di toccare un gioco in games/, il guscio dei giochi, la voce o l'album.
---

# Game designer di Giocamizi

Un gioco alla volta, fatto fino in fondo. Il primo (Memory degli animali, 15/11/2026) è il modello: `games/_engine/Memory.tsx`.

## Per chi si progetta

- **Il bambino** (3-12 anni, spesso non legge): capisce dalla voce e dalle figure, tocca con un dito, non deve mai sentirsi sbagliato.
- **La mamma**: spesso è lei che tiene il telefono, sceglie il gioco e gioca insieme. Vuole capire in tre secondi cosa si allena, non vuole trucchi per tenere incollato il figlio. Ogni scelta di gamification deve reggere alla domanda «lo spiegherei a una mamma senza imbarazzo?».

Regole che non si discutono: `docs/GAME-DESIGN-CHECKLIST.md` (niente timer, niente game over, errore = riprova gentile, mai un suono negativo).

## Il giro di un gioco (in quest'ordine)

### 1. Giocarlo, prima di leggere il codice
Build di produzione (`npm run build`, poi `npx next start -p 3200`): il server di sviluppo non monta bene i giochi. Con Playwright da telefono (iPhone 13) e da schermo piccolo (320×568):
- una partita **onesta** per ogni età della fascia (`?eta=`), cronometrata: sotto il minuto per un bambino vero è troppo corta;
- una partita da **smemorato/sbadato** (sbaglia sempre): si deve arrivare in fondo lo stesso, con un aiuto;
- la **demo** (`?demo=1`) fino alla festa: se si blocca è un bug;
- **tocchi nello stesso istante** su più bersagli (`el.click()` tre volte in un `evaluate`);
- cosa **dice** la voce e in che ordine: `window.__voceMizi` (riempito da `lib/audio.ts` se esiste) — una frase tagliata a metà dalla successiva è un bug;
- foto di ogni schermata, guardate davvero.

### 2. Cercare i bug con questa lista
- chiusure vecchie nei timer (`setTimeout` che chiama una funzione catturata prima): lo stato vero va nei `ref`;
- timer non fermati quando si esce o si ricomincia;
- la lode tagliata dall'istruzione del round dopo (il guscio ora la mette in coda con `{ accoda: true }`, ma il gioco può tagliarla da solo);
- «Livello X di N» che conta altro (coppie, domande) invece dei livelli;
- parole al maschile («Bravissimo»): si usano frasi neutre («Evviva!», «Ce l'hai fatta!»);
- rami morti per età fuori dalla fascia del registro;
- bersagli sotto i 64 px, sbordi a 320 px, bottoni irraggiungibili senza scorrere;
- qualcosa che copre qualcos'altro (z-index): si controlla con `document.elementFromPoint`.

### 3. Migliorarlo
- **Durata e crescita**: 3 livelli (o 5-8 round) che salgono per quantità o complessità, mai per fretta. Età più piccola = partenza più facile.
- **Aiuto prima della frustrazione**: dopo 3 errori di fila il gioco mostra la strada (nel Memory due carte ballano).
- **Errore vero ≠ esplorazione**: le stelle contano solo gli errori evitabili.
- **Ogni tocco risponde**: un suono (`suona()` in `lib/suoni.ts`, mai negativo), un movimento (CSS, rispettando `prefers-reduced-motion`), una parola.
- **La voce insegna**: il nome della cosa toccata, non solo «giusto».
- Stato del gioco leggibile da fuori con attributi `data-…` (fase, livello, stato di ogni pezzo): servono alle verifiche.

### 4. La voce registrata di Mizi (una bambina)
- Le frasi che il gioco dice sono costanti nel codice (es. `FRASI_MEMORY`) e stanno, identiche, in `content/voce-mizi.json` sotto lo slug del gioco. Una virgola diversa = un'altra registrazione.
- Frasi corte, da bambina a bambina, senza genere («Evviva!», non «Brava!»), senza «clicca». Niente nomi propri dei bambini (non si possono registrare).
- `npm run voce -- --gioco <slug>` registra le mancanti (OpenAI `gpt-4o-mini-tts`, voce e istruzioni nel copione, resa più acuta con `intonazione`); `npm run voce -- --prova <cartella>` fa sentire più voci per scegliere. Serve il segreto di rete per `api.openai.com` nell'ambiente della sessione.
- Il sito suona il file se esiste (`lib/voce-registrata.json`), altrimenti la sintesi del telefono: si può pubblicare il gioco prima della registrazione.
- Verifica obbligatoria: tutto quello che il gioco dice in una partita completa è nel copione.

### 5. L'album di Mizi (la spinta a provare altri giochi)
Non serve fare niente nel gioco: basta chiamare `onComplete({ score, stars })` una volta sola a fine partita e usare `GameShell`. La festa finale mostra da sola figurina, coccarda del giorno (3 giochi DIVERSI) e «Prossimo gioco» (`lib/album.ts`, `components/game-shell/GameShell.tsx`).
Vietato aggiungere: serie da non perdere, punti che scadono, classifiche, premi a tempo, notifiche che fanno sentire in colpa.

### 6. Verifiche e pubblicazione
- Estendere `scripts/verifica/giochi.mjs`: partita completa fino a `[data-festa]`, lo smemorato, la demo, le frasi nel copione.
- `npm run typecheck && npm run lint && npm run build`, poi `npm run verifica` (tutte le batterie), poi push e deploy READY.
- Aggiornare la coda qui sotto e lasciare la nota in Bacheca.

## La coda (ordine del registro)

| # | Gioco | Stato |
|---|---|---|
| 1 | memory-animali | FATTO il 15/11/2026 (voce: 30 frasi in copione, da registrare) |
| 2 | abbina-i-colori | da fare |
| 3 | trova-la-forma | da fare |
| 4 | conta-fino-a-10 | da fare |
| 5 | puzzle-facile | da fare |
| 6 | il-suono-dell-animale | da fare |
| 7 | grande-piccolo | da fare |
| 8 | le-emozioni-di-mizi | da fare |

Poi gli altri nell'ordine di `games/registry.ts`. Molti giochi usano lo stesso motore (`games/_engine/SceltaMultipla.tsx`): migliorare il motore migliora tutti i suoi giochi, ma ognuno va comunque giocato e ha le sue frasi.

## Trovato giocando (da ricordare)

- 15/11/2026 — La demo del Memory si bloccava alla seconda carta (chiusura vecchia nel timer).
- 15/11/2026 — L'istruzione ripetuta a ogni round tagliava la lode a metà, in tutti i giochi: ora il guscio la accoda.
- 15/11/2026 — L'invito «Vi mandiamo i giochi nuovi?» dopo il secondo gioco stava SOTTO lo schermo di gioco (z-10 contro z-50): nessuno l'ha mai visto. Ora è sopra, 3,5 secondi dopo la festa.
- 15/11/2026 — Il guscio aveva un secondo `<main>` dentro quello della pagina.
