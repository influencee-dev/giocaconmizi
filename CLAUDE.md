# Gioca con Mizi — canone del progetto

Sito italiano di giochi educativi gratuiti per bambini 3–12 anni, live su
https://giocamizi.it (collegato su Vercel il 24/10/2026; giocaconmizi.vercel.app fa redirect).
Un'idea di Giorgia Palazzo (founder di Partidea e Influencee), nata per la
figlia Domiziana, da cui il nome di Mizi. Titolare e gestore del sito:
Partidea SRL (dati in lib/legal.ts → SOCIETA). Mascotte: Mizi, una pinguina.

## Regole assolute
- Tutto in italiano: codice (nomi, commenti), contenuti, commit.
- MAI personaggi protetti da copyright (Peppa Pig, Disney, Paw Patrol…),
  nemmeno "presi dal web": solo arte originale o librerie con licenza
  verificata (vedi public/icone/LICENZA.txt).
- Niente pubblicità, timer, dark pattern; dati dei bambini al minimo
  (vedi lib/legal.ts: un tracciamento nuovo = una voce nel registro).
- Prima di OGNI push, `npm run date-pagine` (date vere per i lastmod della
  sitemap, dalla storia git: serve il clone completo, quindi in un clone
  `--depth` prima `git fetch --unshallow origin main`). La batteria seo
  fallisce se lib/date-pagine.json non è allineato.
- Prima di OGNI push, verifica TRE volte (regola di Giorgia):
  1. `npm run typecheck && npm run lint && npm run build`
  2. `npm run verifica` (batterie Playwright da mobile, scripts/verifica/)
  3. gli sbordi sono inclusi nella batteria; se tocchi pagine nuove,
     aggiungile a scripts/verifica/sbordi.mjs PRIMA di verificare.
     La batteria seo.mjs controlla dominio unico (giocamizi.it) su robots,
     sitemap, canonical, og:url e JSON-LD, e che ogni URL della sitemap
     risponda 200 col canonical su sé stesso: se cambia il dominio,
     aggiornalo lì insieme a lib/seo.ts.
- Push su `main` → deploy automatico Vercel. Controlla che arrivi READY
  (progetto prj_O3AzIDL7AdXBzBW5Ui4fN4i44PJo, team team_rd3X8YlvlxgVMoQxo1AUXJB6).
  Se il deploy è READY sul commit appena pushato e le verifiche locali sono
  passate, non serve scaricare le pagine live.

## Architettura (tutto data-driven: un dato nuovo aggiorna sitemap e llms.txt da solo)
- `games/registry.ts` — i giochi; componenti in `games/<slug>/Game.tsx`,
  motore condiviso in `games/_engine/`, testi in `content/games/*.md`.
- `lib/guide.ts` — le guide per i genitori (/guide): risposta breve
  citabile dalle AI + sezioni + FAQ + giochi collegati.
  Ogni guida ha `foto: { scena, alt }`: è la scheda per la foto di testata.
  Dopo una guida nuova, `npm run prompt-guide` e aggiorna su Drive il
  documento «00 PROMPT GUIDE · Foto degli articoli Giocamizi» (cartella
  «Giocamizi · Prompt immagini», id 1tvRSJlXalCDtEsiDaGK3MBRAEM-3lEYhAU8EW9coRX8):
  Giorgia lo dà a ChatGPT. Le foto arrivano come
  public/immagini/guida-<slug>-<1440|960|640>.webp e compaiono da sole.
- `cards/registry.ts` + `components/biglietti/` — il creatore di biglietti:
  temi (motivi SVG in motivi.tsx), adesivi (stickers.tsx), QR RSVP,
  foto solo nel PNG mai nei link (lib/condivisione.ts).
- `components/icone.tsx` — libreria icone (Fluent Emoji MIT, public/icone/).
- `lib/feste.ts` — pagine locali /feste/[città] (SEO/GEO/AEO): 3 città nuove
  al giorno, SOLO locali reali trovati con la ricerca web, link nofollow ai
  siti ufficiali verificati, reel Instagram solo con URL vero (carica al
  tocco: niente cookie di terzi senza gesto). Ordine: città per popolazione.
- `lib/directory.ts` — la directory /[categoria]/[città]/[attività]
  (docs/piano-directory.md): le schede nascono dai locali di lib/feste.ts,
  smistati per `tipo` nelle categorie; listing città solo con ≥2 schede.
  MAI foto prese dai siti o dai social dei locali: solo illustrazioni
  nostre finché l'attività non carica le sue. Email e telefoni dei locali
  NON vanno nel repo (è pubblico): stanno nel foglio privato di Giorgia.
- Candidature: `/aggiungi-attivita` (pubblica) — un'attività nuova si propone
  (anche la categoria «Associazioni e laboratori», attiva solo quando c'è una
  scheda) o un titolare chiede l'accesso alla sua scheda. Finiscono in
  `dir_candidature` (`supabase/candidature.sql`) e in /admin/[codice]/candidature.
  Niente va online da solo: un'attività nuova si verifica sul sito ufficiale e
  si aggiunge a lib/feste.ts come le altre; un accesso si chiude mandando il
  link personale. Email e telefoni dei proponenti restano nel database, mai nel repo.
- Area attività (fase 1): `/la-tua-scheda/[codice]` (link personale: il
  locale approva, modifica o chiede di togliere la scheda) e
  `/admin/[codice]` (Giorgia decide). Database in `supabase/directory.sql`,
  incollato a mano da Giorgia nel SQL Editor: il sito usa solo la chiave
  pubblica e funzioni RPC; nel DB solo impronte SHA-256 dei codici. I
  codici veri non vanno MAI nel repo. Le pagine pubbliche leggono le
  risposte accettate con `pubblicate()` (lib/directory-db.ts) e si
  rigenerano ogni 10 minuti o subito dopo una decisione.
- `lib/risorse-educative.ts` + `lib/risorse-educative-dati.ts` — l'hub
  /risorse-educative-bambini (5 sezioni filtrabili; pagina propria
  /risorse-educative-bambini/<slug> SOLO per chi reclama la scheda e viene
  approvato). Reclamo come le attività: «È la tua realtà?» → Candidature →
  link personale da /admin/[codice]/risorse (chiave `risorse/<slug>` in
  dir_inviti/dir_richieste) → la realtà completa la scheda e carica il logo
  (ricodificato in WebP, approvato da Giorgia, servito da /loghi/risorse/).
  Mai loghi presi dai siti. SQL: `supabase/risorse-reclamo.sql`, logica in
  `lib/risorse-reclamo.ts`. Tutti e 4 i file SQL sono stati incollati l'8/11/2026.
- Email di servizio delle schede: `lib/email-servizio.ts` (via Brevo,
  `inviaEmailServizio`, sempre dentro `after()`: non bloccano mai l'azione).
  Avviso a Giorgia (AVVISI_EMAIL su Vercel, se no ciao@) a ogni candidatura,
  risposta o logo; conferma a chi scrive; «Manda il link personale» in
  Candidature; «la tua scheda è online / tolta» quando Giorgia decide.
  Senza BREVO_API_KEY non parte niente (il link si copia a mano). Dati dal foglio «Listing GiocaMizi» di Giorgia: SOLO
  colonne pubbliche, mai le righe «Solo outreach — non pubblicare», mai email
  o note di outreach (il repo è pubblico). Difese anti-scraping in
  `lib/protezione/` (limiti, crawler verificati, trappola): docs/protezione-risorse.md.
- `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/robots.ts` — AEO/SEO:
  generati dai registri. JSON-LD in `components/seo/JsonLd.tsx`.
- SEO/AEO: ogni contenuto nuovo deve avere risposta citabile, FAQ con
  JSON-LD e link interni ai giochi pertinenti.
- Foto da ChatGPT, preparate LA SERA PRIMA (08/11/2026, docs/foto-sera.md):
  chi prepara un contenuto prenota le foto che gli serviranno domani o dopo
  in `content/foto-in-arrivo.json` (`npm run foto:prenota`). Alle 21:00 la
  routine «Prompt della sera» prenota la foto dell'articolo di domani e
  carica `npm run prompt-del-giorno -- --data <domani>` come doc nuovo in Drive
  «Giocamizi · Prompt immagini / 02 Prompt del giorno» (id 1B5v_f7JpfXiZGnnXyEBBXxzy9ARYtYwe).
  Alle 6:00 la routine ChatGPT di Giorgia genera le foto in «99 Immagini pronte»
  (id 1lUlL1Uj2AspXO2SgFeSU_itN0nu2RQbP) col nome indicato. Chi lavora dopo
  (articoli 9:00, routine 7:00, chat) le scarica in una cartella dello
  scratchpad e `npm run foto-arrivate -- <cartella>` le trasforma in WebP
  (riconosce guida-<slug>, i file di FOTO, i codici e le prenotazioni, anche
  di pagine non ancora uscite). Un nome non riconosciuto si guarda a mano.
  La mattina NON si genera più il prompt del giorno: è già uscito la sera prima.
- Sitemap delle immagini (08/11/2026): le foto vere stanno in sitemap con
  la loro pagina (`fotoDellaPagina` in lib/foto.ts, guide ed esempi da soli).
  Un riquadro foto nuovo o spostato = aggiornare FOTO_PAGINE: la batteria
  SEO controlla che ogni foto in sitemap compaia nella sua pagina.

## Ambiente di lavoro (sessioni Claude)
- Playwright: Chromium in `/opt/pw-browsers/chromium` (collegamento alla
  versione installata; o env CHROMIUM); `playwright-core` è nelle devDependencies.
- `npm run verifica` avvia da solo `next start -p 3100` se serve
  (richiede una build fresca). Un `next-server` rimasto acceso da prima
  tiene la porta e fa testare la build VECCHIA: trovalo con
  `ps -eo pid,args | grep next-server` (lsof qui non lo vede) e uccidilo.
- Trappola nota: un `<svg>` annidato senza width/height vale "100%" del
  riquadro esterno e sfonda il layout — `Disegno` ha il prop `lato` apposta.
- Trappola nota: commenti JSX mai prima dell'elemento radice di un return.

## Articoli approfonditi e voce di Giorgia (7/11/2026)
- Voce: `.claude/skills/giorgia-authentic-voice/SKILL.md` (testo originale di
  Giorgia, non modificarlo). Va letta PRIMA di scrivere qualsiasi testo a suo
  nome. Domiziana = Domi o Dodò; **Mizi è solo la pinguina**. Mai esperienze,
  dialoghi o test inventati: senza materiale suo si scrive senza vissuto.
- Articoli lunghi: `content/guide/<slug>.md` → `npm run articoli:compila` →
  `lib/approfondimenti.json` (solo `stato: pubblicata`) → entrano in GUIDE di
  lib/guide.ts (stesso slug di una guida breve = la sostituisce). Pagina:
  `components/guide/Approfondimento.tsx`; stili `.articolo` in globals.css.
- Piano dei 100 articoli: `content/piano-editoriale.json`, uno al giorno
  (`npm run articoli:piano -- prossimo | stato | segna`). Cancello prima di
  pubblicare: `npm run articoli:controlla -- <slug> --rete` (≥27.000 caratteri,
  fonti, prezzi datati, immagini autorizzate, autenticità): se fallisce, resta bozza.
- Procedura completa del job quotidiano (9:00, dopo le foto di ChatGPT delle 6:00): `docs/routine-articoli.md`.

## Co-work quotidiano (Routine delle 7:00 italiane)
Un miglioramento al giorno, piccolo e finito, a rotazione:
(a) biglietti · (b) guide: migliorare una guida breve esistente (le guide
NUOVE le scrive solo la routine articoli delle 9:00, mai questa) · (c) giochi ·
(d) SEO/AEO tecnico. Non toccare content/guide/ né content/piano-editoriale.json.
Prima di iniziare importa le foto arrivate in «99 Immagini pronte»; se il
contenuto di domani avrà bisogno di foto, prenotale oggi (`npm run foto:prenota`).
Report breve (≤5 righe) salvo novità da mostrare. Diario della rotazione:
guardare gli ultimi commit (`git log --oneline -10`) per non ripetersi.

## Instagram (8/11/2026, docs/instagram.md)
- Post del giorno da `lib/social/post.ts` (carosello da articolo, foto di una
  guida, gioco): solo testi già sul sito. Slide disegnate da
  `lib/social/disegna.tsx` (JPEG 1080×1350, Nunito in lib/social/caratteri).
  La parte social è SOLO admin: anteprime dietro il codice
  (`/admin/[codice]/social/anteprima/...`), `/social/<id>/<n>.jpg` risponde solo
  con la firma HMAC del token Instagram (il prelievo di Meta), altrimenti 404.
- Pubblicazione SOLO dal tocco di Giorgia in `/admin/[codice]/social`
  (`lib/social/instagram.ts`, API Meta). Chiavi `INSTAGRAM_USER_ID` e
  `INSTAGRAM_ACCESS_TOKEN` solo su Vercel; il token scade ogni 60 giorni.

## Pannello e immagini (2/11/2026)
- Piano completo: `docs/piano-backoffice.md` (fasi A-D). Il pannello vive
  sotto `/admin/[codice]` (menu in `MenuAdmin.tsx`); il codice si controlla
  con `adminValido()` in lib/admin.ts. Nelle verifiche vale il codice di
  prova `CODICE_ADMIN_PROVA` (scripts/verifica/comune.mjs), mai su Vercel.
- Ottimizzatore immagini: `/admin/[codice]/immagini` (pannello) e
  `npm run immagini -- <file> --codice H-03` (riga di comando, scrive in
  public/immagini/). Stessa logica in lib/immagini/ottimizza.ts: WebP alla
  qualità più bassa con PSNR ≥ 38 dB, varianti 1440…480, niente metadati.
- Contatori delle schede (fase B): `Contatore.tsx` sulla scheda manda
  vista + clic sugli elementi `data-traccia` a `/api/eventi` → funzione SQL
  `dir_conta` (supabase/backoffice.sql). Solo conteggi per giorno, niente
  cookie né IP. Un contatto nuovo sulla scheda = un `data-traccia`.
- Pannello (fase C): Schede (filtro per categoria/città, dettaglio con
  grafico, ricerche Google da lib/gsc.ts), Iscritti (Brevo), Mappa
  (posizioni con OpenStreetMap Nominatim, dal server), Immagini.
- Directory stile Booking: `lib/esperienze.ts` (filtri: SOLO ciò che è
  scritto nella scheda, il resto va «da chiedere») e `lib/etichette.ts`
  (etichette colorate per tipo). Mappa: `components/mappa/MappaLocali.tsx`
  (Leaflet + tile OSM, caricata solo al tocco; CSP img-src
  tile.openstreetmap.org), centri città in `lib/coordinate-citta.ts`: una
  città nuova in lib/feste.ts = una riga lì (la batteria admin controlla).

## Template vetrina (31/10/2026)
- Stile dal riferimento di Giorgia: header bianco arrotondato che galleggia,
  hero a foto piena, card pastello con foto incassata, carte impilate,
  collage, fascia finale blu notte con cerchi. Mattoni in `components/vetrina/`
  (TestataPagina per le pagine interne, PaginaHub per i markdown di content/hubs).
- Foto: registro in `lib/foto.ts` (codici H/G/F/P/S/I, gli stessi del doc
  "00 PROMPT UNICO · Foto sito Giocamizi" su Drive). I WebP vanno in
  `public/immagini/<file>-<larghezza>.webp`; finché mancano si vede Mizi
  su fondo pastello. Brand: "Giocamizi" (tagline Gioca con Mizi).

## In attesa (cose ferme lato Giorgia)
- Immagini AI di Mizi per gli 11 slot in `public/mizi/` (lib/immagini.ts)
  (la foto vera di Giorgia e Domiziana è in public/immagini/, fatta il 2/11).
- Vercel Web Analytics da attivare nel pannello (il codice c'è già:
  conteggio visite senza cookie, sempre attivo; GA resta solo su consenso).
- `supabase/backoffice.sql` da incollare nel SQL Editor (contatori schede);
  `GSC_SERVICE_ACCOUNT` su Vercel per le ricerche Google nel pannello.
- Brevo: account dedicato di Giocamizi (non quello Influencee del
  connettore). Serve BREVO_API_KEY di quell'account su Vercel e il dominio
  giocamizi.it autenticato in Brevo (record DNS su Netsons). Liste, campi,
  mittente ciao@giocamizi.it e template di conferma li crea il sito alla
  prima iscrizione (lib/brevo.ts). Alias Netsons: ciao@ → casella Gmail di
  Giocamizi, giorgia@ → Gmail di Giorgia. Email ciao@giocamizi.it da attivare
  in lib/legal.ts; dominio giocamizi.it collegato (24/10/2026)
  (poi: next.config vecchiHost, redirect Supabase, etichetta stream GA).
