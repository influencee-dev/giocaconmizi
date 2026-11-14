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
- Categorie della directory (08/11/2026): 13, in `CATEGORIE` di lib/directory.ts
  (fattorie didattiche, ristoranti, animatori, corsi, teatro, allestimenti
  oltre alle 7 storiche); una categoria diventa pagina solo con ≥1 scheda.
  Se una regola nuova sposta schede esistenti di categoria, gli indirizzi
  vecchi vanno aggiunti a `content/directory-spostamenti.json` (redirect
  permanenti in next.config.ts; la batteria SEO li controlla). Il modulo
  ha anche «Altro».
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
- `lib/risorse-educative.ts` + `lib/risorse-educative-dati.ts` +
  `lib/risorse-categorie.ts` — dal 14/11/2026 una directory come le feste
  (docs/piano-risorse-eventi.md): /risorse-educative-bambini → /<categoria>
  → /<categoria>/<provincia> (≥2 schede) e la scheda di OGNI realtà su
  /risorse-educative-bambini/<slug> (il link delle email: senza categoria
  nell'indirizzo apposta). Categoria nuova = una voce in CATEGORIE_RISORSE,
  appare da sola alla prima scheda. Anti-scraping solo sull'hub esatto.
  Anteprime dei siti (decisione di Giorgia del 14/11/2026, eccezione alla
  regola «mai foto dai siti»): screenshot ritagliati SOLO delle risorse
  online (blog, portali), mai di scuole/nidi/cooperative, guardati uno per
  uno (niente volti di bambini, personaggi protetti, banner cookie; mai
  cliccare «Accetta» a nome di nessuno): `lib/risorse-anteprime.ts`. Reclamo come le attività: «È la tua realtà?» → Candidature →
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
  Senza BREVO_API_KEY non parte niente (il link si copia a mano).
  Collegate e provate il 12/11/2026: account Brevo «Gioca Mizi» (NON quello
  Influencee del connettore MCP, che da qui non vede né log né liste del sito),
  mittente ciao@giocamizi.it, dominio autenticato. Blocco IP di Brevo spento
  (Vercel cambia IP). Pannello → Iscritti → «Email di servizio»: account,
  mittente, dominio e bottone di prova; un invio fallito lascia
  `[brevo] email «…» non partita` nei log di Vercel.
  Posta di Mizi (iscrizione con doppio opt-in → email di conferma → pagina
  /iscrizione-confermata → email di benvenuto con la foto di Giorgia e
  Domiziana, lib/brevo-benvenuto.ts) provata dal vivo fino in fondo il
  13/11/2026: arrivate tutte e due. Se si blocca, la risposta di /api/brevo
  riporta il messaggio esatto di Brevo (es. «Sender is invalid / inactive»
  = mittente da riverificare). Posta di giocamizi.it su
  Zoho Mail (MX zoho.eu, organizzazione di giorgia@influencee.it):
  ciao@giocamizi.it è una casella Zoho, non un alias Gmail. DNS su Netsons.
  Dati dal foglio «Listing GiocaMizi» di Giorgia: SOLO
  colonne pubbliche, mai le righe «Solo outreach — non pubblicare», mai email
  o note di outreach (il repo è pubblico). Difese anti-scraping in
  `lib/protezione/` (limiti, crawler verificati, trappola): docs/protezione-risorse.md.
- `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/robots.ts` — AEO/SEO:
  generati dai registri. JSON-LD in `components/seo/JsonLd.tsx`.
- SEO/AEO: ogni contenuto nuovo deve avere risposta citabile, FAQ con
  JSON-LD e link interni ai giochi pertinenti.
- Foto preparate LA SERA PRIMA (docs/foto-sera.md): chi prepara un contenuto
  prenota le foto che gli serviranno domani o dopo in `content/foto-in-arrivo.json`
  (`npm run foto:prenota`). Dal 12/11/2026 il giro è quello della Bacheca (sotto):
  il documento dei prompt (`npm run prompt-del-giorno -- --data <domani>`) va su
  Drive «02 Prompt del giorno» (id 1B5v_f7JpfXiZGnnXyEBBXxzy9ARYtYwe) alle 9:00,
  ChatGPT genera alle 9:30, Claude importa alle 21:00. Riserva: l'API di OpenAI
  (`npm run foto:genera`, chiave OPENAI_API_KEY solo nell'ambiente cloud
  «Giocamizi»). Le foto finiscono in «99 Immagini pronte» (id 1lUlL1Uj2AspXO2SgFeSU_itN0nu2RQbP)
  con nomi neutri (foto-xxxxxxxx) e chi lavora dopo le importa con
  `npm run foto-arrivate -- <cartella>`. Prompt e scelta delle foto: lib/foto-del-giorno.ts.
- Sitemap delle immagini (08/11/2026): le foto vere stanno in sitemap con
  la loro pagina (`fotoDellaPagina` in lib/foto.ts, guide ed esempi da soli).
  Un riquadro foto nuovo o spostato = aggiornare FOTO_PAGINE: la batteria
  SEO controlla che ogni foto in sitemap compaia nella sua pagina.

## Drive di Giocamizi: secondo cervello PARA (11/11/2026, rifatto il 13/11/2026)
- Cartella «Giocamizi» (id 1Qh2okN0Bj-GDvy4y9m9wGSk9KnBnpPfN) con 0 Bacheca,
  0 Richieste di Giorgia, 1 Progetti, 2 Aree, 3 Risorse, 4 Archivio. Indice:
  doc «00 LEGGIMI · Giocamizi (13-11-2026)» (id 1VgWbEO9HWppoMp2J5YurE1twkQvS5jDra91Iol-RcBQ;
  il vecchio dell'11/11 è «zz_SUPERATO»): leggerlo prima di cercare o salvare
  su Drive. «Prompt immagini» e «Social» stanno in 2 Aree con gli stessi id.
- I quattro documenti base in 3 Risorse, scritti per ChatGPT che il repo non
  lo legge: «01 Fatti di Giocamizi», «02 Mappa del sito · dove sta ogni testo»,
  «03 Come si cambiano i testi», «04 Patto di lavoro Claude e ChatGPT». Sono
  FOTOGRAFIE con la data nel titolo: il connettore Drive crea, rinomina e
  sposta ma non modifica, quindi quando cambiano i fatti si crea la versione
  nuova e la vecchia prende «zz_SUPERATO — » davanti al titolo.
- «La mappa di Giocamizi» (14/11/2026, regola di Giorgia): la pagina privata
  https://claude.ai/artifact/6QKg2emJDB3HrZsYY7F67K (cosa c'è, a chi serve,
  semaforo, modello di business, contenuti da usare settimana per settimana).
  Ogni volta che va online qualcosa di nuovo (pagina, strumento, sezione,
  prodotto) o cambia una decisione di business, si aggiorna: strumento Artifact
  azione «read» sull'URL, si modifica l'HTML, si ripubblica con lo stesso «url».
  Ogni lunedì revisione completa con i numeri veri del repo e copia su Drive in
  3 Risorse come «05 Mappa di Giocamizi (AAAA-MM-GG)» (la vecchia prende
  «zz_SUPERATO — »). La fa la routine locale «Mappa di Giocamizi · lunedì».
- «0 Richieste di Giorgia» (id 1UWRDMZzDF5Rpbh17amd_KrCjXwbNKr9v): una modifica
  al sito per documento («AAAA-MM-GG · pagina · cosa»). Le aperte sono quelle che
  non iniziano con «FATTO», «DA CHIARIRE» o «00». Fatta la modifica (con le
  verifiche di sempre), rinominare il documento «FATTO · <titolo>» (o «DA
  CHIARIRE · …» se manca qualcosa) e dirlo nella nota di Bacheca.
- «3 Risorse / Decisioni» (id 1LB1cGhrzRgfz3g_y4DAw-lzjg8J7A7mz): ogni decisione
  nuova di Giorgia = un documento «AAAA-MM-GG · Decisione · titolo» (cosa,
  perché, cosa cambia). Riepilogo fino al 13/11 già lì.
- Ogni file nuovo di Giocamizi va nel cassetto giusto, mai nella radice; una
  cartella nuova = una riga nel LEGGIMI successivo; progetto finito → 4 Archivio;
  mai cancellare. Il resto del Drive di Giorgia non si tocca.

- Bacheca (12/11/2026, docs/bacheca.md): Claude e ChatGPT lavorano in
  continuità su Drive. Ogni routine legge le note degli ultimi 2 giorni in
  «0 Bacheca» (id 1wY3hFuwkjp-BwlD8jEsDF-AllPG4XXtG) e ne lascia una nuova
  («AAAA-MM-GG HH:MM · Claude · cosa»: Fatto / Per chi viene dopo / Problemi).
  Giro: 9:00 Claude prenota la foto di DOMANI (`npm run articoli:piano -- domani`)
  e carica il «Prompt del giorno»; 9:30 ChatGPT (attività programmata, testo in
  docs/chatgpt-attivita.md) genera le foto in «99 Immagini pronte»; 21:00 Claude
  le importa (l'API OpenAI è solo la riserva). Questo sostituisce il vecchio
  giro «prompt alle 21:00, ChatGPT alle 6:00».

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
  (ribilanciato il 14/11/2026: meno schermi, più feste, territorio, stagione e
  famiglia; categorie nuove feste-compleanni, fuori-casa, stagionali)
  (`npm run articoli:piano -- prossimo | stato | segna`). Cancello prima di
  pubblicare: `npm run articoli:controlla -- <slug> --rete` (≥27.000 caratteri,
  fonti, prezzi datati, immagini autorizzate, autenticità): se fallisce, resta bozza.
- Procedura completa del job quotidiano (9:00): `docs/routine-articoli.md`.
- Registro del prodotto (14/11/2026, docs/registro-prodotto.md): tutto ciò che
  si produce va tracciato nel Foglio «Piano editoriale Giocamizi · <data>» su
  Drive (1 Progetti / 100 articoli approfonditi), scheda «Prodotto»; la prima
  scheda ha il prompt per fare il piano successivo. Si ricostruisce dal repo con
  `npm run registro -- <cartella>` (dai commit: messaggi chiari in italiano) e
  si ricarica ogni sera alle 21:00 e dopo ogni pubblicazione importante; il
  file vecchio prende «zz_SUPERATO — ».

## Co-work quotidiano (Routine delle 7:00 italiane)
Un miglioramento al giorno, piccolo e finito, a rotazione:
(a) biglietti · (b) guide: migliorare una guida breve esistente (le guide
NUOVE le scrive solo la routine articoli delle 9:00, mai questa) · (c) giochi ·
(d) SEO/AEO tecnico. Non toccare content/guide/ né content/piano-editoriale.json.
Prima di iniziare importa le foto arrivate in «99 Immagini pronte»; se il
contenuto di domani avrà bisogno di foto, prenotale oggi (`npm run foto:prenota`).
Prima leggi le note recenti in «0 Bacheca» e le richieste aperte in
«0 Richieste di Giorgia»: una richiesta aperta viene PRIMA della rotazione
(se è piccola si fa e basta; se è grande, se ne fa un pezzo e lo si dice).
Il lunedì controlla anche che i quattro documenti base di 3 Risorse siano
ancora veri: se no, versione nuova con la data. Alla fine lascia una nota
(«AAAA-MM-GG 07:00 · Claude · Miglioramento», docs/bacheca.md).
Report breve (≤5 righe) salvo novità da mostrare. Diario della rotazione:
guardare gli ultimi commit (`git log --oneline -10`) per non ripetersi.

## Canzoni di Mizi (14/11/2026)
- Su Drive: 2 Aree → Giocamizi · Social → «Canzoni di Mizi» (id
  1VnaChhQWdr6zhvQZom9cMat9jmIiRvDv): guida «00 Come funzionano le canzoni di
  Mizi», schede in «01 Schede canzoni», file finiti in «99 Canzoni pronte».
- Una canzone a settimana insieme al post della settimana, SOLO se c'è il file
  `canzone-NN-slug.mp4`; se manca, slitta. Testi e melodie originali (mai copiare
  canzoni esistenti, mai nomi di artisti nei prompt); niente Domiziana nei video.
  Musica con Suno (piano a pagamento), video con CapCut: li fa Giorgia o la sua
  automazione. Claude scrive le schede nuove quando le 10 finiscono.
  Elenco e stati in `content/canzoni-mizi.json` (scheda-pronta → pubblicata).

## Il Natale di Mizi (/natale, 14/11/2026)
- Lo porta avanti SOLO la chat del co-work quotidiano (Decisione su Drive del
  14/11): le altre chat non toccano /natale, components/natale, lib/natale.ts,
  lib/natale-esporta.ts, lib/eventi-natale.ts; scrivono in «0 Richieste».
- Letterina: /natale/letterina-babbo-natale (lib/natale.ts + components/natale/).
  Sette carte (motivi natale, natale-neve/regali/dolci/renne in motivi.tsx,
  più stelle-luna e animali-foresta), PDF A4 scritto a mano (lib/natale-esporta.ts),
  stampa, condivisione, busta da colorare (FoglioBusta), risposta di Babbo
  Natale dal 20/12. Gli esempi «come scrivere» stanno nella pagina stessa
  (#come-si-scrive): niente pagina doppia. Riquadro in home e voce «Natale»
  nel menu solo in stagione (inStagioneNatale, 1/11–15/1).
- I link a /natale hanno prefetch={false}: la pagina è ISR e sul server di
  prova il precaricamento resta appeso e blocca networkidle nelle batterie.

## Studio UX degli strumenti (14/11/2026, Drive 1 Progetti)
- Messaggio «Fatto!» comune: `annuncia(testo, festa)` + <MessaggioEsito />
  (components/ui/Esito.tsx), fisso in basso con i coriandoli.
- Bottoni d'azione con testo bianco: bg-rosa-forte / bg-viola-forte /
  bg-verde-forte (contrasto ≥ 4,5:1), non le tinte chiare del brand.
- Bersagli da toccare almeno 56 px (min-h-14) negli strumenti per bambini.
- Fatto tutto l'ordine dello studio: letterina a passi con Mizi e voce;
  desideri a figura (DESIDERI_FIGURA in lib/natale.ts); invito a passi
  (Editor `parte="biglietto"`, 7 passi, 8 sfondi in vista + «Vedi tutti»,
  «Vedi tutto in una pagina») e kit della festa su /biglietti/kit-festa
  (Editor `parte="kit"`, arriva col biglietto in ?b=, senza foto né nomi
  degli invitati). Le prove sull'invito toccano prima [data-vedi-tutto].

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
- `GSC_SERVICE_ACCOUNT` su Vercel per le ricerche Google nel pannello
  (supabase/backoffice.sql è stato incollato l'8/11/2026).
- Email «la tua scheda è online / tolta» non ancora provata dal vivo (parte
  quando Giorgia accetta una risposta): controllarla al primo reclamo vero.
  Brevo è collegato (vedi «Email di servizio» sopra); dominio giocamizi.it
  collegato (24/10/2026) (poi: next.config vecchiHost, redirect Supabase,
  etichetta stream GA).
