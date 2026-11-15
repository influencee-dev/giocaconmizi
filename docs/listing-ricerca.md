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
| Prezzi | Prezzo «da» | numero + unità (a bambino / a festa) | Co | sì (fasce) | sì |
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

\* La data del prezzo è obbligatoria solo se c'è un prezzo: senza data, il prezzo
non si mostra.

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

## 6. Domande per Giorgia (servono prima del lotto B)

1. **Campi obbligatori:** bastano età, coperto/aperto, «fanno feste» e descrizione,
   o vuoi rendere obbligatorio anche il prezzo «da»?
2. **Prezzi:** li mostriamo sempre con la data («prezzo da 15 € a bambino,
   comunicato a novembre 2026»)? Senza data non li mostrerei.
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
10. **Ordine dei lotti:** dopo il B, vuoi prima la pagina pubblica (C) o il modulo
    dell'attività (D)?
