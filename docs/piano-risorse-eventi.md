# Piano: risorse educative, foto delle categorie, tutorial video, feste ed eventi

Richiesta di Giorgia del 14/11/2026. Cinque fasi, una alla volta, ognuna con le
verifiche di CLAUDE.md. Questo file è il diario: chi riprende il lavoro parte da qui.

## Fase 1 · Directory delle risorse educative (FATTA il 14/11/2026)

Come la directory delle feste, ma sotto `/risorse-educative-bambini`:

| Indirizzo | Pagina |
|---|---|
| `/risorse-educative-bambini` | hub: categorie divise in «online» e «sul territorio», province, in evidenza |
| `/risorse-educative-bambini/<categoria>` | categoria: in breve, province, tutte le schede, come scegliere, FAQ |
| `/risorse-educative-bambini/<categoria>/<provincia>` | provincia: solo categorie sul territorio e solo con ≥ 2 schede |
| `/risorse-educative-bambini/<slug>` | la scheda di OGNI realtà: è il link da mettere nelle email |

- Registro in `lib/risorse-categorie.ts`: `CATEGORIE_RISORSE` (estendibile: una
  categoria vuota non si vede, appare da sola alla prima scheda), `ASSEGNAZIONI`
  (risorsa → categoria; senza riga decide la prima sezione), `PROVINCE` (sigla → nome).
- La scheda non ha la categoria nell'indirizzo apposta: se una realtà cambia
  categoria il link delle email resta valido. Categorie e schede stanno sullo
  stesso livello: la build si ferma se uno slug è usato da entrambe.
- Le schede contano visite e clic (sito, telefono, social) con `Contatore`, chiave
  `risorse/<slug>`, come le feste.
- Reclamo: bottone «Reclama la scheda» su ogni scheda non verificata →
  `/aggiungi-attivita?scheda=risorse/<slug>` → Candidature → link personale (già esistente).
- `/come-reclamare-la-scheda`: il tutorial scritto (HowTo + FAQ), linkato da
  «Come funziona, passo per passo» nei richiami di feste, directory e risorse.

Categorie al 14/11: 7 attive (blog per genitori, schede per insegnanti, coding e
STEM, fiabe e musica, scuole paritarie, cooperative educative, natura musei e uscite)
+ 2 pronte ma vuote (sostegno ai genitori, doposcuola e aiuto compiti).

## Fase 2 · Il pannello di chi reclama (da fare)

Oggi il link personale (`/la-tua-scheda/[codice]`) fa solo approva/modifica/togli.
Serve una vista «come va la tua scheda»:
- visite e clic sui contatti per giorno, ultimi 30 e 90 giorni (gli stessi numeri
  che Giorgia vede in Pannello → Schede);
- da quali ricerche Google arrivano le famiglie, quando c'è `GSC_SERVICE_ACCOUNT`;
- le richieste arrivate (oggi nessun modulo di contatto sulle schede: i contatti
  vanno diretti a WhatsApp/telefono e si contano come clic).
Serve una funzione SQL nuova `dir_statistiche_invito(p_codice)` che restituisce
solo i numeri della chiave legata a quel codice: Giorgia la incolla nel SQL Editor.
Poi: le email «la tua scheda è stata vista N volte questo mese» (Brevo, facoltative).

## Fase 3 · Una foto al giorno per le categorie, con Mizi dentro (da fare)

Ogni categoria (feste e risorse) ha una foto di testata. Una al giorno, nel giro
della Bacheca (prenotazione alle 9:00, ChatGPT alle 9:30, import alle 21:00).
Le stesse foto finiscono nel piano social.

Regole nuove per i prompt (da aggiungere a `scripts/blocchi-prompt.ts`), nate dai
difetti che Giorgia vede oggi:
- Mizi è SEMPRE il pupazzo fisico, piccolo (35 cm), in mezzo alla scena: tenuto in
  braccio da un bambino, seduto sul tavolo, sul bordo dell'arena… mai protagonista
  gigante, mai animato. Così è credibile in una foto vera e costruisce il giocattolo.
- La scena racconta la categoria: laser game = bambini con i giubbotti in un'arena
  buia con luci colorate; fattoria = bambini che danno il fieno alle capre; scuola = un'aula.
- Varietà obbligata: ogni foto cambia inquadratura (dall'alto, ad altezza bambino,
  campo largo, dettaglio di mani), luce (giorno, sera, interno, esterno) e numero di
  persone. Una tabella di 8 «tagli» in rotazione, scelto in base al giorno.
- Controlli anti-AI scritti nel prompt e poi verificati a occhio prima dell'import:
  schermi rivolti verso chi li guarda; mani con cinque dita; adulti e bambini in
  proporzione; niente oggetti fusi tra loro; niente scritte; volti normali, non
  «perfetti»; un po' di disordine vero (zainetti, giacche sulla sedia).
- Stile «foto di una mamma brava con il telefono», non da pubblicità: luce
  naturale, leggera grana, colori non saturi.
Una foto che non passa i controlli non si importa: si rifà il giorno dopo.

## Fase 4 · Il video tutorial «come reclamare la scheda» (da fare)

Pagina `/come-reclamare-la-scheda` con il video dentro (e una versione per gli
eventi). Il video lo monta Claude: registrazione dello schermo con Playwright sul
sito vero (modulo, link personale di prova), voce italiana generata con l'API
di OpenAI (text-to-speech), musichetta di sottofondo con licenza libera,
sottotitoli. Serve la chiave OpenAI nell'ambiente cloud «Giocamizi» (va salvata
come segreto dell'ambiente, MAI incollata in chat). Il video si pubblica sul sito
(file nostro, niente player di terzi che mettono cookie).

## Fase 5 · Feste ed eventi (da fare)

1. **Feste**: oggi `/feste` = feste di compleanno. Diventa la sezione «Feste ed
   eventi» con le feste di compleanno come primo tipo; dopo arrivano comunione,
   cresima, battesimo come pagine «specchio» (stessi locali, testi e FAQ diversi).
2. **Eventi**: una sezione nuova dove gli eventi li inseriscono
   - le attività che hanno già la scheda, dal loro link personale;
   - chi non ha una scheda, da un modulo pubblico (l'evento arriva in Candidature e
     Giorgia lo approva).
   Eventi singoli o ricorrenti («tutti i giovedì pizza gratis per i bambini a Milano»):
   data o regola di ripetizione, orario, città, prezzo se c'è, link ufficiale.
   Dati strutturati Event; un evento finito sparisce da solo.
   Pagina tutorial «come inserire un evento», come quella del reclamo.
3. Gli eventi di Natale per città (pezzo 3 del brief «Il Natale di Mizi» su Drive,
   entro il 29/11) sono il primo uso di questa struttura.
