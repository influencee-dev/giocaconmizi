# Schede attività · Lotto A: cosa serve davvero a una mamma

Ricerca del 15/11/2026, prima di scrivere codice. È il lotto A del documento
«PROMPT · Evoluzione schede attività» su Drive (1 Progetti). Giorgia deve dare
l'ok prima del lotto B, cioè prima di toccare il modello dati e l'SQL.

## 1. Da dove partiamo oggi

**La scheda pubblica** nasce da `LocaleFesta` (`lib/feste.ts`) e ha questi campi:
- nome;
- zona;
- tipo;
- descrizione;
- sito;
- instagram;
- reel.

I filtri (`lib/esperienze.ts`) si accendono solo se la parola compare nel tipo o
nella descrizione. Sono 13 esperienze: animazione, buffet, tema, esclusiva,
pacchetti, gonfiabili, laboratori, sport, animali, piccoli, genitori, aperto,
coperto. Quello che la scheda non dice va fra le cose «da chiedere».

**Il modulo «Voglio modificarla»** (`/la-tua-scheda`) raccoglie solo testo libero:
- descrizione;
- indirizzo;
- WhatsApp e telefono;
- sito, Instagram, Facebook e TikTok;
- video;
- orari;
- «pacchetti festa e prezzi».

Il problema sta qui: il prezzo, l'età e la capienza arrivano in una frase libera.
Non si possono filtrare, confrontare né mostrare come chip.

## 2. Cosa fanno i portali di eventi (struttura, non contenuti)

Fonti: le ricerche del 15/11. Da questa sessione matrimonio.com non si apre perché
la rete è limitata, quindi divido quello che è confermato da quello che va
ricontrollato a mano.

**Confermato dalle fonti:**
- **«Informazioni importanti»:** in testa alla scheda delle location ci sono chip
  rapidi (tipo di ambiente, orario limite, parcheggio, pernottamento) e un elenco
  «Di quali ambienti disponi?».
- **«Altre informazioni»:** domande già pronte per categoria, a cui il fornitore
  risponde. Per esempio «Esiste un ordine minimo?» e «Quali servizi offri?».
- **Fasce invece di numeri liberi:** la dimensione dell'evento si sceglie fra fasce
  come «meno di 100 invitati» o «tra 100 e 300».
- **Capienza da/a:** si indica un intervallo, per esempio «40-70 invitati».
- **Prezzo «da»:** si mostra il prezzo di partenza (per esempio il menu da X € a
  persona). Su molti portali compare «prezzo su richiesta».
- **Fiducia:** la scheda dice da quando il fornitore è sul portale e quando è
  stata aggiornata l'ultima volta.
- **Contatto:** c'è un bottone per scrivere al fornitore.

**Da ricontrollare a mano** (struttura nota di questi portali, ma non verificata
oggi):
- il modulo «Richiedi preventivo», con data dell'evento, numero di invitati e
  messaggio;
- le promozioni con una data di scadenza;
- la galleria di foto e video;
- la mappa;
- il tempo medio di risposta del fornitore.

**Cosa non prendiamo:** le recensioni, perché Giocamizi non ha commenti né
community, e i badge a pagamento.

## 3. Cosa deve sapere una mamma prima di prenotare

Ho preso le domande che ricorrono nei moduli di preventivo e nelle FAQ delle
ludoteche e dei centri sportivi trovati in rete (caparra, numero di bambini,
orario di chiusura, cibo e allergie, programma, inviti inclusi, foto). Le ho unite
alle 13 esperienze di oggi.

### 3a. Campi comuni a tutte le categorie

Legenda:
- **Ob/Co/Fa:** obbligatorio, consigliato, facoltativo.
- **Filtro:** il campo diventa un filtro della directory.
- **AEO:** il campo entra nella risposta breve o nelle FAQ con JSON-LD.
- Se il campo manca, la scheda mostra sempre «da chiedere».

| Gruppo | Campo | Tipo | Ob/Co/Fa | Filtro | AEO |
|---|---|---|---|---|---|
| Base | Nome, categoria, città, zona | testo / scelta | Ob | sì (città) | sì |
| Base | Indirizzo | testo | Co | — | sì |
| Base | Descrizione in 2-3 frasi | testo breve | Ob | — | sì |
| Per chi | Età consigliata, da / a | intervallo di anni | Ob | sì | sì |
| Per chi | Adatto anche sotto i 3 anni | sì/no | Co | sì | sì |
| Festa | Fanno feste di compleanno | sì/no | Ob | sì | sì |
| Festa | Bambini: minimo e massimo | intervallo | Co | sì (fasce: fino a 15, 15-30, oltre 30) | sì |
| Festa | Adulti ammessi / quanti | numero | Fa | — | — |
| Festa | Durata della festa | scelta: 1,5 / 2 / 3 ore / altro | Co | — | sì |
| Festa | Sala in esclusiva o condivisa | scelta | Co | sì | sì |
| Festa | Cosa è incluso | spunte: sala, animazione, merenda/buffet, torta, bevande, gadget, inviti, allestimento, pulizia | Co | sì (animazione, buffet) | sì |
| Festa | Torta o cibo da casa | scelta: sì / sì con supplemento / no | Co | — | sì |
| Festa | Allergie e menu speciali | scelta + nota | Co | — | sì |
| Festa | Tema personalizzato | sì/no + elenco temi | Fa | sì (tema) | — |
| Prezzi | Prezzo «da» | numero + unità (a bambino / a festa) | Fa (se manca: «Richiedi») | sì (fasce) | sì |
| Prezzi | Data del prezzo | data (obbligatoria se c'è un prezzo) | Ob* | — | sì |
| Prezzi | Pacchetti | lista: nome, prezzo, cosa comprende, bambini min/max, durata | Fa | — | sì (Offer) |
| Prenotare | Caparra | testo breve (es. «50% alla prenotazione») | Co | — | sì |
| Prenotare | Cancellazione e cambi del numero | testo breve | Co | — | sì |
| Prenotare | Con quanto anticipo prenotare | scelta: 1 / 2 / 4 settimane / altro | Fa | — | sì |
| Quando | Giorni e orari | orari per giorno | Co | sì (weekend) | sì |
| Dove | Coperto / all'aperto / entrambi | scelta | Ob | sì | sì |
| Comodità | Parcheggio | scelta: proprio / in strada / no | Co | sì | — |
| Comodità | Accesso con passeggino, senza barriere | sì/no | Co | sì | sì |
| Comodità | Fasciatoio, bagni per bambini | sì/no | Fa | — | — |
| Comodità | Spazio per i genitori (zona caffè, wifi) | sì/no | Co | sì (genitori) | — |
| Sicurezza | Educatori: uno ogni quanti bambini | numero | Co | — | sì |
| Sicurezza | Regole (calze antiscivolo, i genitori restano o no) | testo breve | Co | — | sì |
| Sicurezza | Assicurazione | sì/no | Fa | — | — |
| Foto | Fanno foto e video ai bambini, e come le usano | scelta | Fa | — | — |
| Contatti | WhatsApp, telefono, email, sito, social | link (solo nel database, mai nel repository) | Co | — | — |
| Media | Foto caricate dall'attività | file (ricodificati in WebP) | Fa | — | — |
| Media | Reel e video: Instagram, YouTube, TikTok | link (vedi § 5) | Fa | — | — |
| Fiducia | «Verificata dall'attività» e «Aggiornata il …» | automatici | — | sì (verificate) | sì |

\* **Decisione di Giorgia (16/11/2026):** il prezzo non è obbligatorio.
- **Se l'attività inserisce il prezzo**, si mostra sempre con la data in cui l'ha
  comunicato, per esempio «da 15 € a bambino · prezzo comunicato a novembre
  2026». Per questo la data diventa obbligatoria.
- **Se il prezzo non c'è**, la scheda mostra «Prezzo su richiesta» con il bottone
  «Richiedi». Nel filtro per fascia di prezzo compaiono solo le schede che hanno
  un prezzo.

### 3b. Campi in più per categoria

| Categoria | Campi in più |
|---|---|
| Ludoteche | età per area, area per i più piccoli, gioco libero senza festa (sì/no, prezzo d'ingresso) |
| Parchi giochi al coperto | metri quadri, gonfiabili e piscina di palline, altezza minima per le attrazioni, calze antiscivolo |
| Sale feste | metri quadri, cucina utilizzabile, si può portare un animatore esterno, orario limite |
| Laser game, bowling e sport | età e altezza minime, numero di partite o turni, scarpe o abbigliamento |
| Musei e scienza | laboratori per le feste, visita guidata, durata, prenotazione per gruppi |
| Fattorie didattiche | animali presenti, attività per stagione, cosa indossare, area al coperto se piove |
| Parchi e spazi all'aperto | area pic-nic, servizi igienici, ombra, regole per i gonfiabili esterni |
| Associazioni e laboratori | tessera associativa (prezzo), tipo di laboratorio, corsi durante l'anno, centri estivi |
| Animatori e feste a domicilio | zona servita, costo di trasferta, temi, cosa portano (impianto audio, giochi), durata, quanti animatori |
| Ristoranti e pizzerie | menu bambini (prezzo), seggioloni, area giochi, sala riservata, torta da fuori |
| Corsi e sport | frequenza, lezione di prova, livello, iscrizione e certificato medico |
| Teatro e cinema | spettacoli per età, feste in sala, durata dello spettacolo, prenotazione per gruppi |
| Torte, palloncini e allestimenti | consegna (zona e costo), preavviso, opzioni senza glutine o lattosio, temi |

**Nidi e scuole dell'infanzia** (il caso della Casa Volante) non sono una categoria
della directory: oggi stanno nell'hub delle risorse educative. Per loro servono
fascia d'età, orari, servizi extra (doposcuola, laboratori) e se fanno feste o
laboratori aperti anche a chi non è iscritto.

## 4. Le domande frequenti da generare dai campi

Ogni categoria ha 5-8 domande. La risposta si compone dai campi; se il campo è
vuoto, la scheda scrive «Da chiedere all'attività» e il JSON-LD non riporta la
domanda. Esempi:
- Fino a quanti bambini si può invitare? ← campo «Bambini massimo».
- Si può portare la torta da casa? ← campo «Torta o cibo da casa».
- Quanto costa una festa? ← «Prezzo da» e la sua data, oppure i pacchetti.
- I genitori possono restare? Dove aspettano? ← «Spazio genitori» e «Regole».
- Bisogna lasciare una caparra? ← campo «Caparra».

## 5. Reel e video: si guardano incorporati, come fanno Google e le AI

Giorgia ha chiesto di usare lo stesso sistema con cui le pagine dei risultati e
le app di AI mostrano reel e video dentro la pagina. Quel sistema è
**l'incorporamento ufficiale (embed / oEmbed)**: il video non si scarica e non si
copia, si mostra il player del social dentro la scheda. È quello che il sito fa
già per i reel Instagram (`components/feste/ReelInstagram.tsx`).

**Per mostrarli alle famiglie** (lotto C):

| Piattaforma | Come si incorpora | Privacy |
|---|---|---|
| Instagram (reel e post) | player ufficiale `…/embed`, già in uso | caricato solo al tocco: fino a quel momento niente cookie di Meta |
| YouTube (video e Shorts) | player `youtube-nocookie.com/embed/<id>` | caricato al tocco, versione «senza cookie» di YouTube |
| TikTok | player ufficiale `tiktok.com/embed/v2/<id>` | caricato al tocco |
| Facebook | plugin video ufficiale | caricato al tocco |

L'anteprima prima del tocco resta quella di oggi (un riquadro di Giocamizi con
«▶ Guarda il reel»), oppure la copertina che restituisce oEmbed. La copertina va
mostrata solo dal suo indirizzo originale, mai salvata da noi, nel rispetto della
regola «niente foto prese dai social».

**Per leggerli con l'AI** (lotto E):
- **Instagram:** da giugno 2026 Meta permette di chiamare oEmbed senza token e
  senza App Review (fonte: blog sviluppatori di Meta). Restituisce il codice del
  player e alcuni dati del post. Quali campi arrivano davvero (didascalia,
  autore, copertina) va provato sul primo reel vero, prima di promettere
  qualcosa.
- **YouTube:** oEmbed è pubblico e dà titolo, canale e copertina. La descrizione
  arriva con la YouTube Data API, che chiede una chiave. I sottotitoli si leggono
  solo se il proprietario del canale dà il permesso.
- **La strada più ricca e pulita:** l'attività collega il suo account Instagram
  professionale (login di Meta, autorizzato da lei). In questo modo leggiamo le
  didascalie dei suoi post, con il suo permesso.
- **Il parlato di un video:** solo se l'attività carica il file lei. Nessun video
  viene scaricato dai social.

Così il «guardare i reel» che vede la mamma e il «leggere i reel» che fa l'AI usano
solo strade ufficiali, senza scaricare né copiare niente.

## 5b. Booking e gli altri siti più indicizzati: cosa prendiamo

Ricerca del 16/11/2026 sulle guide ufficiali per chi pubblica e sulle pagine
pubbliche di Booking, Peerspace (affitto di spazi per eventi), Airbnb Esperienze,
GetYourGuide, GigSalad (animatori per feste), Google Business Profile e di qualche
regolamento italiano di feste. Da qui le pagine non si aprono, quindi ho preso la
struttura dalle guide dei siti e dai risultati di ricerca, non dall'HTML.

| Sito | Cosa fa bene | Cosa prendiamo per Giocamizi |
|---|---|---|
| **Booking** | Servizi scelti da un elenco fisso, che diventano filtri. Le regole della struttura (orari, bambini, animali) stanno in una sezione a parte. Il «punteggio della pagina» spinge il gestore a completarla. La descrizione è lunga e parte dai punti di forza. | servizi da elenco fisso, non da testo libero; una sezione **«Regole»** separata; la **barra di completezza** nel backend; i punti di forza in alto |
| **Peerspace** | La capienza dichiarata deve corrispondere alle foto. Tra i servizi va solo ciò che è compreso nel prezzo; gli extra a pagamento stanno a parte, ognuno con il suo prezzo. Ci sono le ore minime. Il principio guida: «il cliente deve poter calcolare il costo totale senza sorprese». Ha FAQ dell'evento su cibo e bevande e una guida per gli eventi all'aperto. | **«Incluso nel prezzo» e «Extra a pagamento»** separati; **durata o ore minime**; un **costo stimato** quando i dati ci sono; il campo **«se piove»** per gli spazi all'aperto |
| **Airbnb Esperienze / GetYourGuide** | I dati chiave stanno in alto: durata, dimensione del gruppo, cibo incluso. Poi «cosa è incluso / non incluso» e una sezione «cosa sapere» con cancellazione, età minima, cosa portare, accessibilità, punto d'incontro e meteo. | una riga di **dati chiave** in testa; **«Cosa è incluso / non incluso»**; un blocco **«Prima di andare»** con cosa portare, cosa indossare, età e altezza minime, accessibilità, come arrivare e cancellazione |
| **GigSalad** (animatori) | Raggio di trasferta e costo dello spostamento. Prezzo «a partire da» oppure «contattaci». Pacchetti adattati all'età. Durata tipica dello spettacolo. Video e foto del lavoro. | per gli animatori: **zona servita in km e costo di trasferta**; **pacchetti per fascia d'età**; durata; portfolio con video incorporati |
| **Google Business Profile** | Attributi da un elenco fisso per categoria. Quelli «oggettivi» li sceglie l'attività; quelli «soggettivi», come «adatto ai bambini», nascono dalle opinioni dei clienti. Ci sono attributi per famiglie (attività per bambini, seggioloni, fasciatoio o nursery, bambini ammessi). Un attributo falso fa sospendere il profilo. | solo attributi **oggettivi**, mai giudizi; **nomi dei campi allineati a quelli di Google**, così l'attività li copia nei due sensi; il link alla sua scheda Google fra i contatti |
| **Regolamenti italiani** (piscina comunale di Milano, ludoteche) | Prezzi del tipo «quota fissa fino a 15 bambini, poi 12 € per ogni bambino in più». Feste solo sabato e domenica pomeriggio. Caparra del 50%. Orario di chiusura. Responsabilità per i danni. | un **modello di prezzo** con tre forme: a bambino, a festa fino a N bambini più un supplemento per ogni bambino in più, oppure a ora con un minimo di ore; i giorni in cui si fanno le feste; caparra; orario limite |

### Campi in più che entrano nel § 3a

- **Modello di prezzo:** a bambino / a festa fino a N bambini + supplemento per
  ogni bambino in più / a ora con minimo di ore. Vale la decisione del 16/11: il
  prezzo c'è solo con la sua data, altrimenti «Richiedi».
- **Extra a pagamento:** una lista di voci, ognuna con il suo prezzo (truccabimbi,
  torta, gadget…), separata da «Incluso nel prezzo».
- **Giorni in cui si fanno le feste** e **orario limite**.
- **Prima di andare:** cosa portare, cosa indossare, età o altezza minime.
- **Come arrivare:** mezzi pubblici, parcheggio, punto d'incontro per gli spazi grandi.
- **Se piove:** solo per gli spazi all'aperto.
- **Animatori:** zona servita in km e costo di trasferta.
- **Collegamenti:** link alla scheda Google dell'attività.
- **Foto:** almeno 3 foto caricate dall'attività per il badge «Foto dell'attività».
  La capienza dichiarata deve essere credibile rispetto alle foto, e lo controlla
  Giorgia quando accetta.

### Come vanno in testa alla scheda (ordine finale per il lotto C)

1. **Dati chiave in una riga:** età · bambini min-max · durata · coperto/aperto ·
   prezzo da (con data) oppure «Prezzo su richiesta».
2. Punti di forza: 3 voci, scelte dall'attività fra i suoi servizi.
3. Il bottone «Richiedi» / WhatsApp.
4. Il resto, come nel lotto C del prompt: pacchetti, incluso ed extra, spazi e
   servizi, regole, prima di andare, reel, domande frequenti, mappa.

### Cosa rende questi siti così indicizzati (e cosa ci serve)

- **Una pagina per ogni scheda**, più pagine per città e categoria. Da noi c'è già.
- **Dati strutturati completi:** `LocalBusiness` nel sottotipo giusto (ChildCare,
  AmusementPark, EntertainmentBusiness, Restaurant…), `amenityFeature` per i
  servizi, `openingHoursSpecification` per gli orari, `Offer` con
  `priceSpecification` e la data del prezzo, `VideoObject` per i video incorporati,
  `sameAs` per i social, `geo`.
- **Freschezza visibile:** «Aggiornata il …» in pagina e `dateModified` nel JSON-LD.
- **Testo unico per ogni scheda**, non lo stesso modello ripetuto: per questo la
  descrizione la scrive l'attività (o l'AI con la sua revisione) e i campi
  arricchiscono la pagina invece di sostituirla.
- **FAQ:** dal 2023 Google mostra le FAQ come risultato arricchito quasi solo per
  i siti istituzionali e sanitari. Le teniamo comunque, perché le AI le citano
  (AEO), ma non contiamo su un effetto in Google.
- Booking e gli altri si reggono molto sulle **recensioni**. Noi non le facciamo:
  il nostro segnale di fiducia è «verificata dall'attività» più la data.

## 6. Domande per Giorgia (servono prima del lotto B)

1. **Campi obbligatori:** bastano età, coperto/aperto, «fanno feste» e descrizione,
   o vuoi rendere obbligatorio anche il prezzo «da»?
2. ~~**Prezzi**~~ **Decisa il 16/11:** il prezzo si mostra con la data se
   l'attività lo inserisce, altrimenti compare «Prezzo su richiesta» con il
   bottone «Richiedi» (vedi § 3a).
3. **Richiesta di preventivo:** la vuoi già adesso (la mamma scrive data, numero di
   bambini e messaggio, l'attività riceve un'email) o la lasciamo all'area attività
   con le richieste, che è un progetto a parte?
4. **Fasce di bambini per il filtro:** vanno bene «fino a 15 / 15-30 / oltre 30»?
5. **Nidi e scuole dell'infanzia:** apriamo una categoria nuova nella directory
   («Nidi e centri per l'infanzia») o restano nelle risorse educative?
6. **Foto dei bambini:** chiediamo all'attività come usa le foto fatte alle feste?
   Per una mamma conta, ma è una domanda delicata.
7. **Copertina dei reel prima del tocco:** riquadro di Giocamizi (come oggi) o
   copertina ufficiale del social? La copertina carica un'immagine da Meta o da
   YouTube già all'apertura della pagina, senza il gesto.
8. **Collegare Instagram:** per l'AI preferisci che l'attività colleghi il suo
   account (più dati, un passaggio in più) o che incolli solo i link?
9. **matrimonio.com:** puoi aprirmi l'accesso al sito nelle impostazioni di rete
   della sessione, o mandarmi 3-4 schermate di una scheda? Così ricontrollo la
   parte «da ricontrollare» del § 2.
10. **Costo stimato:** quando l'attività ha dato prezzo e modello, mostriamo
    «per 20 bambini circa X € (prezzi comunicati a …)»? Alla mamma serve, ma è una
    stima e va scritto chiaramente.
11. **Ordine dei lotti:** dopo il B, vuoi prima la pagina pubblica (C) o il modulo
    dell'attività (D)?

## 7. Lotto B (16/11/2026): cosa è stato fatto

Giorgia ha detto «fai il resto» senza rispondere alle altre domande. Sono partito
con queste scelte, che si possono cambiare in un punto solo (`lib/scheda-campi.ts`):

| Domanda del § 6 | Scelta per partire |
|---|---|
| 1. Obbligatori | descrizione, età, «fate feste», coperto/aperto (più nome, categoria e città, che ci sono già) |
| 2. Prezzi | decisa da Giorgia: con il mese se l'attività lo inserisce, altrimenti «Prezzo su richiesta» |
| 3. Preventivo | per ora «Richiedi» porta a WhatsApp o al telefono. Il modulo vero arriva con l'area attività delle richieste |
| 4. Fasce di bambini | fino a 15 / 15-30 / oltre 30 |
| 5. Nidi | restano nelle risorse educative, nessuna categoria nuova |
| 6. Foto dei bambini | campo facoltativo, a scelta tra tre risposte |
| 7. Copertina dei reel | il riquadro di Giocamizi, come oggi: niente immagini dai social prima del tocco |
| 8. Instagram | per ora si incollano i link; il collegamento dell'account arriva con il lotto E |
| 9. matrimonio.com | ancora da ricontrollare |
| 10. Stima della spesa | rimandata (Giorgia: «non so, per ora no») |
| 11. Ordine | C (pagina pubblica), poi D (modulo dell'attività) |

**File nuovi o toccati:**
- **`lib/scheda-campi.ts`:**
  - 57 campi: comuni, della festa, per categoria;
  - per ognuno tipo, livello, gruppo, filtro, AEO, la domanda «da chiedere» e l'aiuto per l'attività;
  - le funzioni `validaScheda` (pulisce quello che arriva dal modulo o dall'AI), `completezza` (barra con le percentuali), `daChiedere`, `testoPrezzo` (prezzo con mese oppure «Prezzo su richiesta»), `videoRiconosciuto` (reel Instagram, YouTube in modalità senza cookie, TikTok) e `riepilogoScheda`.
- **`supabase/scheda-dati.sql`:** le bozze (`dir_bozze`, `dir_salva_bozza`, `dir_leggi_bozza`). Alza anche il limite di una risposta a 60 KB e cancella la bozza quando l'attività invia. **Va incollato da Giorgia**, dopo `directory.sql`.
- **`lib/directory-db.ts`:**
  - la scheda estesa viaggia in `dati.estesa` delle risposte che ci sono già, quindi non serve una tabella nuova per i dati pubblici;
  - ci sono `salvaBozza` e `leggiBozza`, che nel server delle verifiche tengono la bozza in memoria.
- **Pannello `/admin/[codice]`:** se una risposta contiene la scheda estesa, Giorgia la vede in parole, campo per campo, con l'indicazione «proposto dall'AI» dove serve.

Ancora nessuna pagina pubblica cambiata: lo fa il lotto C.
