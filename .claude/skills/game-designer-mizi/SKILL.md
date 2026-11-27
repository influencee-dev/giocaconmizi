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
- cosa **dice** la voce e in che ordine: `window.__voceMizi` (riempito da `lib/giochi/audio.ts` se esiste) — una frase tagliata a metà dalla successiva è un bug;
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
- **Ogni tocco risponde**: un suono (`suona()` in `lib/giochi/suoni.ts`, mai negativo), un movimento (CSS, rispettando `prefers-reduced-motion`), una parola.
- **La voce insegna**: il nome della cosa toccata, non solo «giusto».
- Stato del gioco leggibile da fuori con attributi `data-…` (fase, livello, stato di ogni pezzo): servono alle verifiche.

### 3-bis. Il nucleo comune (dal 16/11/2026): prima di scrivere logica nuova
`games/_engine/nucleo.ts` fa una volta per tutti quello che ogni motore rifaceva a modo suo: `useRound()` conta i round, chiude il round al primo tocco giusto (due tocchi nello stesso istante non lo fanno avanzare due volte), dà il punto solo ai round senza errori, fa scattare l'aiuto dopo N errori, suona, dice lodi e incoraggiamenti senza genere, espone lo stato con `data-partita`, `data-round`, `data-errori-round`, `data-aiuto-attivo` e a fine partita passa anche errori, aiuti e secondi.
- Lo usa già `SceltaMultipla.tsx` (20 giochi): dopo due errori la risposta giusta dondola.
- Un motore che si migliora va portato sul nucleo, non riscritto accanto. I giochi fatti a mano (colora, cosa manca, pizza, salvadanaio, vesti Mizi) lo adottano quando tocca a loro.
- Le frasi del nucleo stanno identiche in `content/voce-mizi.json` sotto «nucleo»: la batteria lo controlla.
- La logica pura di un motore sta in un file senza React (`griglia-logica.ts` per il coding su griglia): la usano lo schermo, la demo e le prove, così non possono andare in disaccordo.
- La demo (`?demo=1`) deve arrivare alla festa in OGNI gioco: la batteria gioca da sola tutto il registro. Una demo che legge lo stato dentro un timer vecchio si blocca: ogni passo deve ripartire dallo stato vero (un effetto per passo, con lo stato tra le dipendenze).

### 3-ter. I giochi di esplorazione (dal 17/11/2026)
`games/_engine/Esplora.tsx` + `games/_engine/esplora-logica.ts`: una mappa vista dall'alto con muretti e nuvole, si tocca una casella e Mizi ci va per la strada più corta; ogni sala ha UNA missione che apre la porta. Primo gioco: `games/labirinto-dei-tesori` («giochi labirinto», 590 ricerche al mese).
- Un gioco nuovo di questo tipo è solo un elenco di sale (`SpecSala`): cosa prendere, cosa lasciare, se in ordine, le frasi. Il labirinto e i posti delle cose cambiano a ogni partita, le missioni no: così ogni frase sta nel copione.
- Regole di casa: nessun nemico, nessun tempo, nessuna vita. Una cosa si prende solo toccandola apposta; nelle nuvole il primo tocco la scopre soltanto. La porta chiusa non è un errore: fa vedere cosa cercare. Dopo una cosa sbagliata Mizi torna un passo indietro e la cosa resta.
- Lo stile dei disegni della mappa sta in fondo a `Esplora.tsx` (`STILE`, `Pavimento`, `Porta`, `Figura`): si cambia lì, non nella logica.
- Per le prove: `data-prossimo` sulla casella della prossima cosa giusta, `data-porta`, `data-mizi`, `data-nebbia`, `data-borsa`.

### 4. La voce registrata di Mizi (una bambina)
- Le frasi che il gioco dice sono costanti nel codice (es. `FRASI_MEMORY`) e stanno, identiche, in `content/voce-mizi.json` sotto lo slug del gioco. Una virgola diversa = un'altra registrazione.
- Frasi corte, da bambina a bambina, senza genere («Evviva!», non «Brava!»), senza «clicca». Niente nomi propri dei bambini (non si possono registrare).
- La voce è «sage» (decisione di Giorgia del 15/11/2026, la stessa dei video: scripts/video/voce.py), con le istruzioni scritte nel copione e `intonazione` 0. Non si cambia senza una sua richiesta.
- `npm run voce -- --gioco <slug>` registra le mancanti (OpenAI `gpt-4o-mini-tts`). Serve il segreto di rete per `api.openai.com` nell'ambiente della sessione (c'è nell'ambiente «Giocamizi», non in «Default»).
- Nessuno può ascoltare le registrazioni: ogni frase registrata va riascoltata dalla macchina (trascrizione `whisper-1`) e confrontata col testo. Una frase che non torna si rifà; alla terza volta resta alla sintesi del telefono e lo si scrive nella nota.
- Il sito suona il file se esiste (`lib/giochi/voce-registrata.json`), altrimenti la sintesi del telefono: si può pubblicare il gioco prima della registrazione.
- Verifica obbligatoria: tutto quello che il gioco dice in una partita completa è nel copione.

### 5. L'album di Mizi (la spinta a provare altri giochi)
Non serve fare niente nel gioco: basta chiamare `onComplete({ score, stars })` una volta sola a fine partita e usare `GameShell`. La festa finale mostra da sola figurina, coccarda del giorno (3 giochi DIVERSI) e «Prossimo gioco» (`lib/giochi/album.ts`, `components/game-shell/GameShell.tsx`).
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
| 4 | tabelline | giochi tabelline · 8.100 (giochi matematica · 18.100) | FATTO il 21/11/2026: dieci domande tutte diverse dalle facili alle difficili, quattro risposte, trucco dopo l'errore, «Ancora» torna alla scelta, 11 prove. Voce: le domande e i trucchi non sono nel copione (sono 90 + 90 frasi: restano alla sintesi del telefono finché Giorgia non decide di registrarle) |
| 5 | pizza-delle-frazioni | frazioni · 9.900 | da fare |
| 6 | addizioni-entro-20 | giochi matematica · 18.100 | da fare |
| 7 | trova-le-differenze | trova le differenze · 2.900 | PRIMO PASSO il 17/11/2026: sul nucleo, aiuto dopo tre tocchi a vuoto, doppio tocco sistemato, 7 prove. Restano: scene nuove (sono 4, sempre le stesse) e differenze «sostituzione» |
| 8 | colora-con-mizi | giochi da colorare · 1.900 | da fare (25/11/2026: il gioco ora riceve disegni e titolo come proprietà, `Colora`; lo usa anche il gioco nuovo «Colora il Natale», quattro disegni di Natale, per «disegni da colorare di Natale» · 27.100. Il miglioramento di Colora con Mizi in sé resta da fare) |
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
- **Trova le differenze (17/11/2026).** Due tocchi nello stesso istante sull'ultima differenza saltavano la scena dopo: lo stato non era ancora aggiornato. Serve un ref, come nel nucleo. Qui un tocco a vuoto è esplorazione: le stelle contano i tocchi a vuoto di tutta la partita (`stelleDi` del nucleo), non il round. Il cerchio dell'aiuto giallo, intorno al sole giallo, sembrava i raggi del sole: un aiuto deve avere un colore che non c'è nella scena (viola tratteggiato con bordo bianco).
- 21/11/2026 — «Tabelline»: le otto domande uscivano a caso con ripetizioni (sulla tabellina del 7: «7 × 10» tre volte, quattro domande diverse in tutto), «per 1» aveva solo tre risposte e «Ancora» ripeteva le stesse domande nello stesso ordine. Un gioco che genera i round a caso va controllato contando i round DIVERSI di una partita vera.
- **Voce registrata (21/11/2026).** Le prime frasi registrate del sito sono le 13 di «La corsa nella piramide». Alla seconda frase `npm run voce` restava fermo per sempre: su alcuni file ffmpeg 6.1 si blocca se il taglio del silenzio e il volume stanno nella stessa catena di filtri. Ora lo script fa due passaggi, ognuno con un minuto di limite: un blocco diventa un errore che si legge. Riascolto con `whisper-1`: tutte e 13 uguali al testo. Finché gli altri giochi non sono registrati, alla festa di questo gioco parla ancora la sintesi del telefono (le tre frasi «comuni» non sono registrate: toccano tutti i giochi, va deciso insieme).
- **Il motore «tocca la risposta giusta», rivisto per il movimento (22/11/2026).** Venti giochi, tutti del 23 agosto. Il giro di fluidità diceva fotogrammi regolari ovunque: quello che mancava era il movimento. Le opzioni di un round nuovo comparivano di colpo, la giusta e la sbagliata cambiavano senza muoversi, la spunta allungava il bottone. Ora entrano una dopo l'altra, la giusta fa un saltello, la sbagliata un dondolio morbido prima di spegnersi, la spunta sta in un angolo. Solo `transform` e `opacity`; con «meno movimento» tutto fermo. Stili in app/globals.css (`opzione-entra`, `opzione-giusta`, `opzione-riprova`).
- **Voce: tutto il copione è registrato (22/11/2026).** 113 frasi su 113: comuni, nucleo, memory, differenze, labirinto, corsa. Il riascolto con `whisper-1` ne ha date 86 su 100 uguali al primo colpo; 5 erano solo scritte in un altro modo («Dodici» → «12», «Emme» → «M», «Ti» → «T»): numeri e nomi delle lettere vanno confrontati a orecchio di regola, non a lettere. Le altre 9 (parole cortissime: «L'ape», «E!», «Che occhio!») rifatte, tutte a posto al secondo tentativo. Le frasi di una o due sillabe sono quelle che vengono peggio: conviene rifarle subito se la trascrizione non torna. Gli altri giochi dicono ancora le loro istruzioni con la sintesi del telefono: per registrarle vanno prima scritte nel copione, gioco per gioco.
- **Abbina i colori (22/11/2026), il primo dei giochi a risposta con tutta la voce.** Le sette istruzioni («Tocca il secchiello rosso, come questo.») e i sette nomi dei colori sono nel copione e registrati. Alla risposta giusta Mizi non dice più una lode qualunque: dice il colore («Rosso!»). Per farlo i round di SceltaMultipla hanno un campo `lode`: vale per ogni gioco a risposta che vuole insegnare il nome della cosa toccata. Le parole di una sola battuta sono le più fragili al riascolto: «Giallo!», «Verde!» e «Viola!» rifatte una volta. Per gli altri giochi a risposta il lavoro è lo stesso: elencare tutte le frasi possibili (le istruzioni nascono da un modello con una parola che cambia), scriverle nel copione, registrare, riascoltare, e aggiungere alla batteria la prova «tutto quello che dice è nel copione».
- **Trova la forma (22/11/2026).** Stesso lavoro di «Abbina i colori»: sette istruzioni e sette nomi delle forme nel copione, registrati; alla risposta giusta Mizi dice la forma («Il cerchio!»). Al riascolto una registrazione aveva letto anche il punto («Tocca il cerchio, punto»): senza trascrizione non se ne sarebbe accorto nessuno. «L'ovale!» ha voluto tre tentativi.
- **La grafica del guscio e dei giochi a risposta, primo ritocco (22/11/2026).** Era spoglia: fondo vuoto, figure piatte, e a parlare era una faccina stilizzata invece di Mizi. Ora nel fumetto e alla festa c'è il viso vero di Mizi (`public/mizi/mizi-faccia.webp`), dietro al gioco quattro macchie pastello (`.campo-gioco`), i bottoni delle risposte hanno uno spessore e si schiacciano (`.tasto`), le figure poggiano su un'ombra (`.figura-ombra`) e la cosa da guardare sta su un disco chiaro (`.palco`). Il guscio vale per tutti i 40 giochi. Restano da fare, gioco per gioco: le figure stesse (sono ancora forme piatte a tinta unita) e i giochi con altri motori.
- **Una prova che contava le card.** Con «Gli ultimi arrivati» un gioco finito può comparire due volte nel catalogo: la prova delle stelle contava le card e non i giochi, ed è fallita quando «Abbina i colori» è salito in cima. Ora conta i giochi.
- **Le figure ridisegnate col volume, primo gruppo (22/11/2026, decisione di Giorgia: si ridisegnano in codice).** In `games/_engine/arte.tsx` ogni figura rifatta ha tre strati: il colore, un'ombra (nero trasparente) e un riflesso (bianco trasparente), con la luce dall'alto a sinistra. Trasparenti apposta: valgono per qualunque tinta. Fatte: le sette forme (la sagoma resta esatta), il secchiello, pesce, palla, mela, fiore, macchina. Le altre figure (animali, casa, albero, sole, razzo, barca, libro, torta, nuvola) sono ancora piatte: si rifanno quando tocca al gioco che le usa.
- **Abbina i colori aveva un bug che nessuna prova vedeva.** L'oggetto al centro riceveva il colore del round ma palla, mela, fiore e macchina lo ignoravano: «Tocca il secchiello giallo, come questo» mostrava una palla rosa. Si vedeva solo guardando lo schermo. Ora `Disegno` ha il parametro `tinta`, che cambia il colore principale delle figure che lo permettono; senza, restano del loro colore.
- **Conta fino a 10 (22/11/2026).** La scheda diceva «tocca ogni pesce per contarli con la voce», ma i pesci erano un disegno fermo. Ora ogni pesce toccato prende il suo numero e Mizi lo dice; un secondo tocco non lo conta due volte; contare è facoltativo e non è mai un errore. Alla risposta giusta: «Cinque pesci!». 17 frasi nel copione. «Tre!» è la parola più difficile da registrare: tre tentativi, e la trascrizione una volta ha sentito «2».


- **Sette giochi dai compiti di scuola (22/11/2026).** Giorgia manda gli argomenti (registro e pagine del libro) e si fanno giochi nuovi: stesso argomento, esercizi e disegni nostri. Una parola da comporre ascoltandola non va scritta nel fumetto (il fumetto è sempre visibile: si copierebbe): la dice un bottone «Ascolta ancora» al centro. Le parole singole sono le più difficili da registrare: 12 su 91 da rifare («Fragola» era diventata «Slabona»). `idFrase` non guarda la punteggiatura: «Trampolino.» e «Trampolino!» sono lo stesso file. La misura di un bottone nelle prove si prende con `offsetWidth`: `getBoundingClientRect` mentre il centro entra in scena dà un numero più piccolo (53 invece di 56) e fa fallire una prova giusta.
\n
- **Giochi senza connessione (22/11/2026).** Tutto quello che il gioco legge dall'indirizzo (`?eta=`, `?demo=1`) va riletto anche nel browser (Giocatore.tsx): senza rete la pagina arriva dalla memoria del telefono, salvata una volta sola senza domanda. La prima prova dava «0 giochi finiti su 8» solo perché la partita dimostrativa non si accendeva. Un gioco nuovo non richiede niente: l'elenco dei file lo riscrive la build. Un file nuovo fuori da `voce/`, `figure/`, `mizi/` e `app/` va aggiunto a scripts/offline-elenco.mjs, altrimenti senza rete manca.

- **Giro di tutti i giochi (27/11/2026), richiesto da Giorgia.** Strumento: un giocatore automatico che, su ognuno dei 53 giochi, tocca a caso tutto quello che si può toccare, sia su un telefono 390×664 (iPhone con le barre del browser aperte, la misura vera di chi gioca da Safari) sia su uno schermo 320×568. Annota cosa resta sotto il bordo, cosa è coperto (`elementFromPoint`), i bersagli sotto i 48 px, gli errori della pagina, le frasi vietate e i tocchi tripli nello stesso istante. Poi le foto, guardate una per una. Cosa ha trovato:
  - **Il motore «metti in ordine» si poteva bloccare** (puzzle, sillabe, numeri in ordine, robot, sequenze, suoni difficili): due dita nello stesso istante su due pezzi partivano dalla stessa fotografia vecchia dello stato e un pezzo spariva. Mancava anche l'aiuto: chi sbagliava sempre non ne usciva. Ora `Ordina.tsx` sta sul nucleo, lo stato vero è in un ref, e dopo due ordini sbagliati il pezzo che viene adesso dondola (gli altri, finché dondola, non si prendono).
  - **Il puzzle facile mostrava pezzi vuoti**: il disegno dentro la striscia era un SVG annidato senza `lato` (vedi `Disegno`). E le strisce scelte stavano in fila come francobolli: ora si impilano dentro il riquadro, sopra il modello in trasparenza, e il disegno si ricompone davvero.
  - **Su un iPhone vero le ultime risposte finivano sotto il bordo** in quasi tutti i giochi a risposta: le misure si facevano a 390×844, che è lo schermo intero senza le barre di Safari. Ora c'è la variante `basso:` (app/globals.css, altezza fino a 700 px): barra, fumetto, margini e figure si stringono e lo spazio va al gioco. Con un telefono vero si misura a 390×664.
  - Falso allarme: nelle Tabelline, alla prima visita, l'avviso delle statistiche copre le ultime tabelline, ma la pagina scorre e l'avviso sparisce al primo tocco. Non serve margine.
  - **Vesti Mizi**: le zone «Piedi» e «Trucchi» stavano fuori dallo schermo a destra, in una riga da scorrere di lato che nessuno scopre. Ora vanno a capo.
  - Il tasto «Via» rosa chiaro con la scritta bianca non si leggeva bene: ora è `bg-rosa-forte`, come gli altri tasti d'azione.
  - Falso allarme da ricordare: in «Missione ghiaccio» dopo un programma lungo i tasti restano spenti 8 secondi, il tempo che Mizi finisca di camminare. Non è un blocco: un giocatore automatico deve aspettare la fine dell'esecuzione prima di dire «bloccato».
  - Un giocatore che tocca a caso non è un bambino sbadato: tocca anche «Togli l'ultimo» e «Cancella» e disfa il lavoro. Per i giochi a costruzione lo sbadato sbaglia, poi segue l'aiuto quando arriva (`data-aiuto-pezzo`).
