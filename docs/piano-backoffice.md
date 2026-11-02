# Giocamizi — ottimizzatore immagini e back office

Richiesta di Giorgia del 2/11/2026, riscritta mettendo insieme le figure che
servono per portarla a termine. È il prompt di lavoro: ogni fase si chiude
con le verifiche del CLAUDE.md (typecheck, lint, build, `npm run verifica`)
e con un deploy READY.

> «Crea un tool che riduce le immagini e le trasforma in WebP con la massima
> risoluzione e la minima grandezza, come un plugin dentro Giocamizi. Poi un
> pannello di back office per gestire gli iscritti, le schede di ogni
> listing, e per ogni scheda il traffico, le ricerche e i moduli compilati
> per contattare le singole attività.»

---

## Le figure e cosa porta ognuna

| Figura | Domanda a cui risponde |
|---|---|
| **Product owner** | Cosa serve a Giorgia ogni settimana per decidere, e in che ordine costruirlo |
| **UX/UI designer** | Come si usa da telefono in 30 secondi, con lo stile vetrina del sito |
| **Sviluppatore full-stack (Next.js + Supabase)** | Dove gira ogni pezzo: browser, server Vercel, database |
| **Ingegnere delle immagini / performance** | Come si ottiene il file più leggero che a occhio è identico all'originale |
| **Data / analytics engineer** | Quali numeri contare, come, e da dove prenderli (sito, Search Console, Brevo) |
| **DPO / privacy (GDPR, Garante)** | Cosa si può contare senza consenso, cosa si mostra e a chi, quanto si conserva |
| **Security engineer** | Come si protegge un pannello con dati personali su un repo pubblico |
| **SEO specialist** | Quali dati di ricerca servono per scheda e come non sporcare l'indicizzazione |
| **QA** | Quali prove automatiche fanno fallire il push se qualcosa si rompe |

---

## Vincoli che valgono per tutto

- **Un solo ingresso protetto**: il pannello vive sotto `/admin/[codice]`,
  il link segreto che Giorgia ha già (nel DB solo l'impronta SHA-256).
  Tutte le pagine admin: `noindex`, fuori dalla sitemap, `force-dynamic`,
  nessuna cache. Le azioni server ricontrollano il codice ogni volta.
- **Repo pubblico**: niente chiavi, email o telefoni nel codice. Le chiavi
  stanno nelle variabili di Vercel; i dati personali solo nel database o in
  Brevo, mai in file statici.
- **Database**: stesso modello di `supabase/directory.sql`: chiave
  pubblica + funzioni SQL `security definer` che controllano il codice
  admin. Le modifiche al DB sono un file SQL che Giorgia incolla nel SQL
  Editor (`supabase/backoffice.sql`).
- **Privacy**: i numeri di traffico sono **aggregati per giorno**, senza
  cookie, senza IP, senza identificativi: legittimo interesse, nessun
  consenso. Le persone compaiono per nome solo quando scrivono loro (modulo
  di contatto) o si iscrivono (Brevo). Ogni trattamento nuovo = una voce in
  `lib/legal.ts` + `docs/privacy/registro-trattamenti.md` + informativa.
- **Stile**: mattoni di `components/vetrina/`, mobile prima di tutto, tap
  target da 44 px, testi in italiano semplice.

---

## Fase A — Ottimizzatore immagini («plugin» del pannello)

**Dove**: `/admin/[codice]/immagini`. Gira **tutto nel browser**: le foto
non passano dal server (più veloce, nessun costo Vercel, nessun dato in
giro).

**Cosa fa**
1. Si trascinano o scelgono una o più immagini (JPG, PNG, WebP, HEIC dove
   il browser lo legge).
2. Per ognuna: lato lungo massimo scelto (2560 / 1920 / 1440 px, di
   default 1920), mai ingrandita; metadati EXIF e GPS eliminati (privacy:
   le foto dal telefono contengono la posizione).
3. **Qualità automatica**: ricerca binaria della qualità WebP più bassa
   che resta visivamente identica all'originale, misurata con il PSNR fra
   originale e WebP decodificato (soglia 40 dB, regolabile «più leggera /
   più fedele»). È il modo per avere la massima risoluzione con il minimo
   peso, invece di una qualità fissa uguale per tutte.
4. Varianti responsive opzionali (1440, 960, 800, 640, 480 px) con i nomi
   che vuole il sito: `<nome>-<larghezza>.webp`.
5. Assegnazione facoltativa a un codice foto del sito (H-01…I-05, registro
   `lib/foto.ts`): il nome file e il ritaglio al rapporto giusto vengono da
   lì.
6. Risultato: anteprima prima/dopo, peso prima/dopo e risparmio in %, e
   download dei file uno per uno o in un unico ZIP (generato nel browser,
   senza librerie esterne).

**Anche da riga di comando** (per le sessioni Claude): `npm run immagini --
<cartella>` con sharp, stessa logica, scrive direttamente in
`public/immagini/`.

**Accettazione**: un PNG da 2,4 MB diventa un WebP sotto i 250 KB a 1920 px
senza differenze visibili; la batteria Playwright carica un'immagine di
prova e controlla formato, dimensioni e risparmio.

---

## Fase B — Contatori del traffico (base di tutto il resto)

**Cosa si conta, per scheda e per giorno**: visualizzazioni della scheda;
clic su WhatsApp, telefono, sito, Instagram/social; aperture del modulo di
contatto e invii.

**Come**: un piccolo script sulla scheda manda un evento a
`/api/eventi` (POST con `navigator.sendBeacon`): `{ scheda, evento }`. La
route valida scheda ed evento contro il registro (niente valori liberi),
scarta i bot dichiarati, e chiama la funzione SQL `dir_conta(chiave,
evento)` che fa `+1` sulla riga del giorno in `dir_statistiche(giorno,
chiave, evento, conteggio)`. Nessun IP salvato, nessun cookie.

**Accettazione**: aprire una scheda e toccare WhatsApp produce +1 vista e
+1 clic nel giorno giusto; un evento inventato viene rifiutato (400).

---

## Fase C — Il pannello

Menu: **Panoramica · Schede · Iscritti · Contatti · Immagini**.

1. **Panoramica**: numeri della settimana e del mese (viste schede, clic
   contatto, richieste inviate, nuovi iscritti), con il confronto sul
   periodo prima; le 10 schede più viste; cosa c'è da decidere (le risposte
   dei locali di oggi).
2. **Schede**: filtro per categoria e città (cioè per listing); per ogni
   scheda: stato (bozza da redazione, link inviato/aperto, approvata,
   modificata, rimossa), completezza del profilo, viste e clic degli ultimi
   30 giorni. Si apre la **scheda di dettaglio**: grafico giornaliero viste
   e clic per tipo, richieste di contatto ricevute, e le **ricerche Google**
   che la portano (query, impressioni, clic, posizione media da Search
   Console).
3. **Iscritti**: dalle liste Brevo «Giocamizi · Genitori» e «Insegnanti»:
   totale, nuovi per settimana, in attesa di conferma (doppio opt-in),
   disiscritti; elenco cercabile con data e fonte del consenso; esporta CSV.
   Letto dal server con `BREVO_API_KEY`, mai messo in cache.
4. **Contatti**: le richieste «Chiedi informazioni» arrivate dalle schede,
   per attività, con stato (inoltrata, letta); conservazione 12 mesi poi
   cancellazione automatica.

**Ricerche (Search Console)**: API Search Analytics con un service account
in sola lettura aggiunto come utente della proprietà `giocamizi.it`;
credenziali in `GSC_SERVICE_ACCOUNT` su Vercel. Dati per pagina, cache 6
ore. Finché manca la credenziale il riquadro spiega come attivarla.

---

## Fase D — Modulo «Chiedi informazioni» sulla scheda

Nome, email, data della festa, numero di bambini, messaggio; casella di
consenso («i miei dati vanno a [attività] per rispondermi»); trappola
antispam e limite di invii. La richiesta finisce in `dir_contatti` e parte
un'email all'attività (Brevo transazionale) **solo se** l'attività ha
approvato la scheda e ha dato l'email nel suo link personale; altrimenti
resta in coda nel pannello. Informativa aggiornata (Giocamizi titolare,
l'attività riceve i dati per rispondere).

---

## Cosa serve da Giorgia (prerequisiti)

1. Incollare `supabase/backoffice.sql` nel SQL Editor di Supabase (fasi B-D).
2. `BREVO_API_KEY` nelle variabili di Vercel (iscritti, email alle attività).
3. Search Console: creare il service account e aggiungerlo come utente
   (istruzioni passo passo nel riquadro del pannello), poi
   `GSC_SERVICE_ACCOUNT` su Vercel.

## Ordine di costruzione

A (subito, non dipende da nulla) → B + Schede/Panoramica del pannello →
Iscritti → Search Console → D. Ogni passo è online da solo.
