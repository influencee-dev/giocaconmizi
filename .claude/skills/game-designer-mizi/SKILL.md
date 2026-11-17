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

### 3-bis. Il nucleo comune (dal 16/11/2026): prima di scrivere logica nuova
`games/_engine/nucleo.ts` fa una volta per tutti quello che ogni motore rifaceva a modo suo: `useRound()` conta i round, chiude il round al primo tocco giusto (due tocchi nello stesso istante non lo fanno avanzare due volte), dà il punto solo ai round senza errori, fa scattare l'aiuto dopo N errori, suona, dice lodi e incoraggiamenti senza genere, espone lo stato con `data-partita`, `data-round`, `data-errori-round`, `data-aiuto-attivo` e a fine partita passa anche errori, aiuti e secondi.
- Lo usa già `SceltaMultipla.tsx` (20 giochi): dopo due errori la risposta giusta dondola.
- Un motore che si migliora va portato sul nucleo, non riscritto accanto. I giochi fatti a mano (colora, cosa manca, pizza, salvadanaio, vesti Mizi) lo adottano quando tocca a loro.
- Le frasi del nucleo stanno identiche in `content/voce-mizi.json` sotto «nucleo»: la batteria lo controlla.
- La logica pura di un motore sta in un file senza React (`griglia-logica.ts` per il coding su griglia): la usano lo schermo, la demo e le prove, così non possono andare in disaccordo.
- La demo (`?demo=1`) deve arrivare alla festa in OGNI gioco: la batteria gioca da sola tutto il registro. Una demo che legge lo stato dentro un timer vecchio si blocca: ogni passo deve ripartire dallo stato vero (un effetto per passo, con lo stato tra le dipendenze).

### 4. La voce registrata di Mizi (una bambina)
- Le frasi che il gioco dice sono costanti nel codice (es. `FRASI_MEMORY`) e stanno, identiche, in `content/voce-mizi.json` sotto lo slug del gioco. Una virgola diversa = un'altra registrazione.
- Frasi corte, da bambina a bambina, senza genere («Evviva!», non «Brava!»), senza «clicca». Niente nomi propri dei bambini (non si possono registrare).
- La voce è «sage» (decisione di Giorgia del 15/11/2026, la stessa dei video: scripts/video/voce.py), con le istruzioni scritte nel copione e `intonazione` 0. Non si cambia senza una sua richiesta.
- `npm run voce -- --gioco <slug>` registra le mancanti (OpenAI `gpt-4o-mini-tts`). Serve il segreto di rete per `api.openai.com` nell'ambiente della sessione (c'è nell'ambiente «Giocamizi», non in «Default»).
- Nessuno può ascoltare le registrazioni: ogni frase registrata va riascoltata dalla macchina (trascrizione `whisper-1`) e confrontata col testo. Una frase che non torna si rifà; alla terza volta resta alla sintesi del telefono e lo si scrive nella nota.
- Il sito suona il file se esiste (`lib/voce-registrata.json`), altrimenti la sintesi del telefono: si può pubblicare il gioco prima della registrazione.
- Verifica obbligatoria: tutto quello che il gioco dice in una partita completa è nel copione.

### 5. L'album di Mizi (la spinta a provare altri giochi)
Non serve fare niente nel gioco: basta chiamare `onComplete({ score, stars })` una volta sola a fine partita e usare `GameShell`. La festa finale mostra da sola figurina, coccarda del giorno (3 giochi DIVERSI) e «Prossimo gioco» (`lib/album.ts`, `components/game-shell/GameShell.tsx`).
Vietato aggiungere: serie da non perdere, punti che scadono, classifiche, premi a tempo, notifiche che fanno sentire in colpa.

### 6. Verifiche e pubblicazione
- Estendere `scripts/verifica/giochi.mjs`: partita completa fino a `[data-festa]`, lo smemorato, la demo, le frasi nel copione.
- `npm run typecheck && npm run lint && npm run build`, poi `npm run verifica` (tutte le batterie), poi push e deploy READY.
- Aggiornare la coda qui sotto e lasciare la nota in Bacheca.

## La coda (i più cercati per primi)

Due giochi al giorno, li fa la routine «Giocamizi · Due giochi al giorno». L'ordine segue le ricerche in Italia (Ubersuggest, novembre 2026, ricerche al mese sulla parola più vicina al gioco): prima i giochi che la gente cerca di più. Chi finisce un gioco aggiorna questa tabella nello stesso commit.

| # | Gioco | Parola e ricerche al mese | Stato |
|---|---|---|---|
| 1 | memory-animali | memory online · 1.600 | FATTO il 15/11/2026 (voce: 30 frasi in copione, da registrare) |
| 2 | pixel-art | pixel art · 49.500 | da fare |
| 3 | puzzle-facile | puzzle online · 27.100 | da fare |
| 4 | tabelline | giochi tabelline · 8.100 (giochi matematica · 18.100) | da fare |
| 5 | pizza-delle-frazioni | frazioni · 9.900 | da fare |
| 6 | addizioni-entro-20 | giochi matematica · 18.100 | da fare |
| 7 | trova-le-differenze | trova le differenze · 2.900 | da fare |
| 8 | colora-con-mizi | giochi da colorare · 1.900 | da fare |
| 9 | unisci-i-puntini | unisci i puntini · 1.600 | da fare |
| 10 | salvadanaio | giochi matematica · 18.100 | da fare |
| 11 | vesti-mizi | giochi di vestire · 720 | da fare |

Finiti questi undici, gli altri nell'ordine di `games/registry.ts`, rimisurando prima le ricerche (connettore Ubersuggest, lingua «it», locId 2380) e aggiungendo le righe qui. Se un dato manca si scrive «non misurato», non si inventa.

Molti giochi usano lo stesso motore (`games/_engine/SceltaMultipla.tsx`, `PixelArt.tsx`…): migliorare il motore migliora tutti i suoi giochi, ma ognuno va comunque giocato e ha le sue frasi. Un cambio al motore si verifica giocando ALMENO un altro gioco che lo usa.

## Trovato giocando (da ricordare)

- 15/11/2026 — La demo del Memory si bloccava alla seconda carta (chiusura vecchia nel timer).
- 15/11/2026 — L'istruzione ripetuta a ogni round tagliava la lode a metà, in tutti i giochi: ora il guscio la accoda.
- 15/11/2026 — L'invito «Vi mandiamo i giochi nuovi?» dopo il secondo gioco stava SOTTO lo schermo di gioco (z-10 contro z-50): nessuno l'ha mai visto. Ora è sopra, 3,5 secondi dopo la festa.
- 15/11/2026 — Il guscio aveva un secondo `<main>` dentro quello della pagina.
- 16/11/2026 — «La tartaruga» non si poteva finire: risolta la prima sfida, la pulizia dell'effetto cancellava il timer che portava alla seconda. Nessuna prova se ne accorgeva, perché si controllava solo che la pagina si aprisse. Ora la batteria porta ogni gioco alla festa.
- 16/11/2026 — «Crea il tuo gioco»: «Ho finito» avvisava il sito ma la festa non compariva mai (`finito={false}` fisso): niente figurina a vista.
- 16/11/2026 — Demo ferme in 6 giochi: nei tre di coding la demo tirava una riga dritta e sbatteva nei muri (ora c'è un risolutore vero); in «Vesti Mizi» premeva «Fatto» con i vestiti vecchi; «Tabelline» restava sulla schermata di scelta.
- 16/11/2026 — Lodi al maschile («Bravo!», «Bravissimo!») in 7 file: tutte diventate «Evviva!».
