---
name: seo-geo-aeo-manager
description: Il metodo del SEO, GEO e AEO manager di Giocamizi (giochi educativi, directory di locali per bambini, guide per genitori) per far trovare la piattaforma su Google, Google Maps e nelle risposte delle AI (AI Overviews, ChatGPT, Perplexity, Gemini). Da leggere PRIMA di cambiare titoli, descrizioni, dati strutturati, sitemap, llms.txt, pagine hub o link interni, e ogni volta che il co-work fa il turno (d) «SEO/AEO tecnico». Lavora su una coda di cantieri (docs/piano-seo.md) e su un elenco di ricerche vere (content/seo/parole-chiave.json), misurate con npm run seo:copertura.
---

# SEO, GEO e AEO manager di Giocamizi

Un cantiere alla volta, chiuso fino in fondo e misurato. Il primo (23/11/2026, titoli
di 14 giochi) è il modello: ricerca vera → pagina che risponde → titolo con le parole
cercate → `npm run seo:copertura` → riga segnata «fatto» → la batteria SEO la protegge.

## Da dove si parte (23/11/2026)

- Autorità di giocamizi.it per Ubersuggest: **1 su 100**. Siti che linkano: **0**. Ricerche in
  cui il sito compare: **2**. I siti in cima alle ricerche di scuola hanno autorità 14–42:
  sono alla portata, ma solo con link (cantiere 10) e pagine che nominano quello che si cerca.
- 81 ricerche scelte su 700, 900.000 al mese in tutto: `content/seo/parole-chiave.json`.
  La pagina con le tabelle è «Ricerca SEO Giocamizi» (https://claude.ai/artifact/3byFR8V6bXhNFxo3aiiAy6),
  la copia su Drive sta in 2 Aree → Sito e SEO.
- Copertura misurata il 23/11 sul server locale: ricerca nel titolo **34 su 81** (46% del
  volume; erano 21, il 29%, prima dei titoli nuovi); da qualche parte nella pagina 45 su 81;
  24 ricerche senza una pagina che risponda.

## Regole che non si discutono

1. **Un solo dominio**: https://giocamizi.it in robots, sitemap, canonical, og:url, JSON-LD
   (`lib/seo/seo.ts`, controllato da `scripts/verifica/seo.mjs`). Mai pagine doppie per la
   stessa ricerca: si rafforza quella che c'è (titolo, testo, link), non se ne fa una gemella.
2. **Le parole vere, scritte per una mamma**: il titolo nomina quello che si cerca
   («Tabelline dal 1 al 10») e resta una frase umana. Niente elenchi di parole chiave, niente
   testo nascosto, niente pagine-porta con una città cambiata e il resto uguale.
3. **Titolo massimo 65 caratteri** compreso « — Giocamizi» (`titoloPagina`, `titoloCheSta`
   in `lib/seo/seo.ts`); descrizione ≤155 (`riassunto`). Un H1 per pagina.
4. **Mai inventare**: locali, prezzi, orari, recensioni, numeri e fonti solo se verificati
   (stesse regole di `lib/directory/feste.ts`). Niente recensioni o valutazioni finte nel
   JSON-LD: Google le punisce e sarebbe falso.
5. **Bambini e privacy prima del traffico**: niente tracciamenti nuovi senza una voce in
   `lib/contenuti/legal.ts`, niente pop-up o dark pattern per trattenere, niente pubblicità.
6. **Chi possiede cosa**: `/natale` e `lib/natale/` li tocca solo la chat del co-work (le altre
   scrivono in «0 Richieste di Giorgia»); le guide NUOVE le scrive solo la routine articoli
   delle 9:00 (le idee si propongono, `content/piano-editoriale.json` non si tocca da qui); la
   home e la barra dell'app non si cambiano senza Giorgia. Testi a nome di Giorgia: prima la
   skill `giorgia-authentic-voice`.
7. **Le verifiche di sempre** prima di ogni push (CLAUDE.md): typecheck, lint, build,
   `npm run verifica`, `npm run date-pagine`.

## Le leve, e dove stanno nel repo

### 1. Tecnico: farsi leggere e capire
- Sitemap da `app/sitemap.ts` (pagine, foto con `fotoDellaPagina`, video), lastmod veri da
  `lib/seo/date-pagine.json`. Una pagina nuova entra da sola se nasce dai registri.
- `app/robots.ts`; bozze e pagine private con `robots: { index: false }` e fuori sitemap.
- Redirect permanenti per ogni indirizzo che cambia (`content/directory-spostamenti.json`,
  `next.config.ts`): un URL che sparisce butta via i link che aveva.
- Velocità da telefono: LCP sotto 2,5 s su 4G (foto dai nostri file, `lib/foto/caricatore-immagini.ts`;
  niente script di terzi all'avvio). Si misura con Playwright e `PerformanceObserver`.
- Da fare (cantiere 11): Search Console col service account (`GSC_SERVICE_ACCOUNT`, `lib/seo/gsc.ts`),
  Bing Webmaster Tools, IndexNow per avvisare Bing e gli altri a ogni pubblicazione.

### 2. Sulla pagina: dire subito cosa c'è
- **Giochi**: `titoloSeo` nel frontmatter di `content/games/<slug>.md` = titolo per Google; il
  nome del gioco (`title` nel registro) resta nell'H1, nel catalogo, nell'album.
  `description` = la prima frase sotto l'H1 e la descrizione per Google.
- **Guide**: `lib/contenuti/guide.ts` (risposta breve citabile in apertura, sezioni, FAQ).
- **Directory**: `titoloScheda` per le schede; i listing in `app/(public)/[categoria]/…`.
- La prima frase risponde alla domanda (chi, cosa, per che età, gratis o no). Link interni
  con testo che descrive la pagina d'arrivo («gioco delle tabelline»), mai «clicca qui».

### 3. Contenuti: una ricerca, una pagina che le risponde davvero
- Se la gente cerca un **elenco** («parole con le doppie», «tabella delle tabelline») la
  pagina lo contiene in testo, non solo dentro il gioco: è quello che Google e le AI citano.
- Se cerca **una variante** («tabellina del 7», «seconda elementare») serve una pagina sua
  con un motivo vero d'esistere (il gioco già filtrato, la tabella, i trucchi), non una copia.
- Se cerca **da stampare**, serve un PDF vero o la stampa curata della pagina.
- **Stagione**: le pagine stagionali si preparano 6-8 settimane prima del picco (Natale da
  ottobre, compleanni e feste sempre, estate e compiti delle vacanze da aprile).

### 4. Dati strutturati (JSON-LD): far capire che cos'è
- Tutti in `components/seo/JsonLd.tsx`, validati da `scripts/verifica/jsonld.mjs`.
- In uso: WebSite+Organization, Game+LearningResource (giochi), FAQPage, BreadcrumbList,
  ItemList (elenchi), Article (guide), VideoObject con i Clip (tutorial), LocalBusiness
  (schede), Event (eventi di Natale).
- Da rafforzare (cantiere 12): Organization con `founder` (Giorgia Palazzo), `parentOrganization`
  (Partidea SRL, dati in `lib/contenuti/legal.ts`), `logo` e `sameAs` coi profili social veri;
  `Person` per l'autrice delle guide. Sono i segnali di **entità** che le AI usano per fidarsi.
- Le FAQ del JSON-LD sono le stesse che si leggono in pagina, parola per parola.

### 5. GEO e AEO: farsi citare dalle risposte AI
- **Risposta in apertura**: 40-60 parole che rispondono da sole alla domanda, poi i dettagli.
  Le AI prendono quel paragrafo; Google lo usa per gli snippet e le AI Overviews.
- **Fatti con data e fonte** («nel 2026 dal… al…», «Indicazioni Nazionali, nucleo Numeri»):
  le AI preferiscono un fatto datato e verificabile a un aggettivo.
- **Domande nella forma in cui si fanno** («A che età si impara la tabellina del 7?») come
  titoli di sezione o FAQ; tabelle ed elenchi puntati dove il contenuto è un elenco.
- `app/llms.txt/route.ts` e `app/llms-full.txt`: generati dai registri. Un contenuto nuovo
  ci entra da solo; se no, è un difetto da correggere lì.
- **Nome coerente**: «Giocamizi» ovunque (tagline «Gioca con Mizi»), stessa descrizione in
  sito, social e schede esterne: un'entità con nomi diversi non la riconosce nessuno.
- **Misura**: una volta al mese le stesse domande (le 81 ricerche in forma di domanda) a
  ChatGPT, Perplexity, Gemini e Google; si annota chi citano. Con Ubersuggest:
  `brand_visibility_overview`, `brand_prompts`, `brand_citation_gaps` (progetto giocamizi.it).

### 6. Locale: farsi trovare «vicino a me»
- Le pagine città e categoria della directory sono le nostre pagine locali. Testo che dice
  «vicino a te: scegli la città» sugli hub, nome della città nel titolo dei listing, mappa,
  LocalBusiness con indirizzo uguale al sito ufficiale del locale.
- Le città si aprono per popolazione (regola di `lib/directory/feste.ts`): ogni città nuova
  è una pagina locale nuova, se ha almeno due schede solide.

### 7. Autorità: farsi linkare (oggi la leva più grande)
- Con autorità 1 nessuna pagina sale da sola. Ogni sito che linka una scheda, un gioco o
  una guida alza tutto il dominio.
- **Locali e realtà della directory**: la mail del «Registro contatti» porta già il link
  della scheda; si aggiunge l'invito a mettere sul loro sito il bollino «Ci trovi su
  Giocamizi» con il link (cantiere 10). Mai link comprati, mai scambi di massa.
- **Scuole, maestre, blog di didattica**: i giochi gratuiti senza pubblicità sono una
  risorsa che si linka volentieri; la pagina `/per-insegnanti` è quella da proporre.
- **Dati originali**: uno studio con numeri nostri (es. quanto costa una festa di
  compleanno per bambini, città per città, dai prezzi verificati delle schede) viene
  citato da giornali e blog. Prezzi solo con data e fonte.

### 8. Misura: sapere se ha funzionato
- `npm run seo:copertura` (server locale dopo la build, o `-- --sito https://giocamizi.it`
  da un ambiente che raggiunge il sito; `-- --md file.md` per il rapporto). Dice per ogni
  ricerca se compare nel titolo, nella descrizione, nell'H1, nel testo.
- `scripts/verifica/seo.mjs` chiama `seo-copertura --controlla`: una ricerca segnata «fatto»
  che perde le sue parole dal titolo o dall'H1 ferma la pubblicazione.
- Una volta al mese, con Ubersuggest (MCP in sessione): `domain_overview`,
  `domain_keywords`, `backlinks_overview` su giocamizi.it, e `keyword_overview` delle
  ricerche nuove. I numeri nuovi aggiornano `content/seo/parole-chiave.json` (volumi e
  data in `fonte`) e la sezione «Da dove si parte» qui sopra.
- Search Console (quando c'è la chiave): impressioni e posizione per pagina nel pannello.

## Il giro di un cantiere (in quest'ordine)

1. **Leggi** `docs/piano-seo.md` (la coda) e le righe di `content/seo/parole-chiave.json`
   del cantiere. Controlla in Bacheca che un'altra chat non lo stia già facendo.
2. **Misura prima**: `npm run build`, poi `npm run seo:copertura -- --md prima.md`.
3. **Fai il cantiere**, uno solo, rispettando chi possiede cosa (regola 6).
4. **Misura dopo**: stessa misura; le righe chiuse prendono `"stato": "fatto"` e
   `"fatto": { "data", "come" }`. Un lavoro a metà prende una `nota` e resta aperto.
5. **Verifiche** di CLAUDE.md, commit in italiano che dice cosa e quanto («Titoli per Google
   di 14 giochi: ricerche nel titolo da 21 a 34»).
6. **Aggiorna** la riga del cantiere in `docs/piano-seo.md` e lascia la nota in «0 Bacheca».
   Se cambia qualcosa che si vede (pagina nuova, sezione), aggiorna «La mappa di Giocamizi».

## Strumenti a disposizione in sessione

- **Ubersuggest** (MCP): volumi, difficoltà, chi c'è in cima, backlink, visibilità AI del brand.
- **Semrush** (MCP): ricerca per parole e concorrenti quando serve un secondo parere.
- **WebSearch**: per vedere le SERP e i siti in cima a una ricerca.
- Il sito dall'ambiente cloud: `giocamizi.it` può non essere raggiungibile dalla rete della
  sessione; allora si misura sul server locale, che serve la stessa build.
