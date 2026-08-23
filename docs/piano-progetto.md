# Sito giochi educativi + letture — Piano di progetto (3 giorni)

Nome: **Gioca con Mizi** — dominio **giocaconmizi.com** (Vercel) + giocaconmizi.it (Register.it, redirect). Title: "Gioca con Mizi — giochi educativi per bambini dai 3 ai 12 anni". Target: genitori italiani di bambini e ragazzi **3–12 anni** (infanzia → quinta primaria → prima/seconda media), insegnanti. Quattro pilastri: **giochi educativi, letture, coding, compiti delle vacanze**.

---

## 1. Ricerca: cosa cercano davvero le persone

### 1.1 Pattern di ricerca (autocomplete Google Italia, agosto 2026)
La domanda si organizza su **tre assi**, che diventano la struttura del sito:

| Asse | Esempi reali | Cosa implica |
|---|---|---|
| **Età** (dominante) | giochi per bambini di 2/3/4/5/6/7/8 anni; giochi educativi 3 anni; giochi bambini 3 anni online gratis | Una pagina hub per ogni età, 2→8 anni |
| **Competenza/materia** | lettere, numeri, colori, forme, memory, puzzle, logica, matematica, inglese, emozioni, tabelline, "imparare a leggere" | Una pagina hub per ogni competenza |
| **Modalità** | online, gratis, senza pubblicità, da stampare, in casa, Montessori, wordwall, prima/seconda/terza elementare | Attributi e landing secondarie |

Modificatori che ricorrono ovunque: **gratis**, **online**, **senza pubblicità**, **da stampare**, **Montessori**, **scuola infanzia / prima elementare**.

Nicchie con poca concorrenza e molta intenzione: *giochi per bambini autistici / ADHD / mutismo selettivo / logopedia*, *giochi da fare in aereo/macchina*, *giochi per imparare a leggere*, *giochi in inglese per bambini*.

### 1.2 Letture
Le ricerche sulle storie sono molto specifiche: *storie per bambini da leggere in stampatello*, *storie da leggere per bambini di 6 anni in stampatello*, *leggere storie in corsivo per bambini da stampare*, *brevi storie da leggere per bambini di prima/seconda elementare*, *storie brevi con immagini*, *storie per dormire*, *storie sulle emozioni*, *storie da leggere in 5 minuti*. Anche qui: età + tipo di carattere + lunghezza + tema.

### 1.3 Compiti estivi
*compiti estate prima/seconda/terza elementare*, *compiti per le vacanze classe prima*, *estateimparo* (brand). Esiste uno spazio per "compiti delle vacanze online gratis per classe": pochi siti lo fanno bene in formato interattivo.

> Nota: Ubersuggest restituisce volume 0 per l'Italia su queste query (dato non affidabile). La dimensione la verifichiamo con Search Console dopo 2–3 settimane online; intanto la struttura segue l'autocomplete, che riflette ricerche reali.

### 1.4 Competitor italiani (cosa fanno e dove sono deboli)
- **giochibambini.it, flashgames.it, funnygames.it, Poki**: aggregatori di giochi HTML5 generici (Frozen, macchine, Baby Hazel). Pieni di pubblicità, poco educativi, nessun progresso, nessuna struttura per età. Vincono per volume, non per qualità.
- **giochionlineperbambini.com**: 1–6 anni, 8 categorie, positioning "per genitori e insegnanti" con testimonianze. Design datato, niente letture, niente account.
- **ilgufoboo.com**: neonati/piccoli, versione senza pubblicità, video + app. Buono ma fermo ai 2–4 anni.
- **Wordwall**: usato dalle maestre, ma è un tool generico, non un sito per famiglie.

**Spazio scoperto**: un sito italiano *curato*, senza pubblicità, organizzato per età e competenza, con progressi per il bambino, letture graduate (stampatello/corsivo) e un'area "compiti delle vacanze". Nessuno lo fa.

### 1.5 Riferimenti internazionali da copiare (bene)
- **Khan Academy Kids** (2–8 anni, gratuito, no ads, 5 stelle Common Sense Media): percorso adattivo, libri + giochi + disegno nello stesso posto, funziona offline. → Copiamo: un solo ambiente, mascotte, progressione invisibile al bambino.
- **Starfall** (pre-K–3): fonetica, attività *senza timer*, esplorazione senza fretta. → Copiamo: niente countdown, feedback gentile, ripetizione libera.
- **PBS Kids Games**: mini-giochi per competenza, 2–8 anni, nonprofit. → Copiamo: ogni gioco insegna UNA cosa.
- **ABCya**: organizzato per classe e materia, browser-based. → Copiamo: navigazione "per classe" oltre che per età.

### 1.6 Ricerca scientifica da cui partire (e da citare nelle pagine, ottimo per E-E-A-T)
- **LEGO Foundation – "Learning through play: a review of the evidence"** (Zosh, Hirsh-Pasek, Jensen et al., Temple/Cambridge/Harvard): 5 caratteristiche dell'apprendimento giocoso — **gioioso, significativo, attivo, iterativo, sociale**. Checklist di design per ogni gioco.
- **Active Playful Learning** (Temple University, grant LEGO 20M$, trial in 4 distretti USA): gioco guidato dall'adulto > gioco libero > istruzione diretta per molti obiettivi. → Ogni gioco ha un "suggerimento per il genitore" (guided play).
- **Montessori** (ricorre nelle ricerche italiane): materiali autocorrettivi, un'abilità alla volta, ordine visivo. → I giochi danno feedback immediato senza punizione.
- **Scienza della lettura / fonetica sintetica** (base di Starfall, Khan Kids, Reading Eggs): suono → lettera → sillaba → parola. → Percorso letture: stampatello maiuscolo → minuscolo → corsivo.
- **Common Sense Media**: criteri di valutazione (valore educativo, facilità di gioco, assenza di pubblicità). → Usali come claim in homepage.

---

## 2. Decisioni strategiche (dove migliorerei la tua richiesta)

1. **Nessun login. Giochi sempre liberi.** Un solo form leggero (nome genitore, email, città, facoltativi professione ed età del bambino) collegato a Brevo, proposto in modo gentile: dopo il 2° gioco completato, nel footer, nella pagina prodotti e prima di scaricare un PDF gratuito. Promessa chiara: "ti avvisiamo quando pubblichiamo nuovi giochi, storie e libri". Niente account, niente password: meno attrito, più iscritti.
2. **Dati del bambino: il minimo.** GDPR (art. 8) + Garante italiano: niente nome e cognome del bambino, niente data di nascita precisa. Raccogliamo: nome genitore, email, città, professione (select), **età del bambino (2–8)** e al massimo un **nome/soprannome del bambino facoltativo** per la mascotte. Consenso esplicito + privacy policy dedicata. Queste 5 cose sono anche ottimi attributi Brevo per segmentare (es. "insegnante, Puglia, 6 anni").
3. **Niente pubblicità, sì prodotti digitali nostri.** "Senza pubblicità" è il differenziale n. 1 (lo cercano letteralmente). Il sito si sostiene con **prodotti immateriali prodotti da noi** (libri da colorare PDF, quaderni di attività, storie illustrate, kit per insegnanti) e una **quota dei proventi destinata a un'associazione** per l'infanzia. Dettagli in §9.
4. **Un gioco = una competenza = una pagina indicizzata.** Ogni gioco nasce con metadati SEO, non li aggiungiamo dopo.
5. **Letture: un testo, tre font.** Stessa storia renderizzata in stampatello maiuscolo, minuscolo, corsivo (CSS). Una URL per età + tema, toggle del carattere, PDF scaricabile.
6. **Compiti delle vacanze come prodotto.** Percorsi per classe (infanzia, prima, seconda, terza) che mischiano giochi e letture con un calendario. È il motivo per cui lo fai per tua figlia e non esiste online in questa forma.

---

## 3. Architettura dell'informazione (SEO)

```
/                                  home: per età + per competenza + letture + compiti estivi
/giochi                            hub generale
/giochi/3-anni                     hub per età (3..12) — keyword primarie
/giochi/prima-elementare           hub per classe (infanzia, prima…quinta, prima media, seconda media)
/coding                            hub coding (vedi §13)
/coding/[slug]                     gioco/livello di coding (es. /coding/labirinto-blocchi)
/coding/5-anni … /coding/10-anni   hub coding per età
/coding/unplugged                  schede coding senza computer (stampabili)
/coding/scratch                    guide e progetti Scratch spiegati in italiano
/biglietti/...                     inviti e biglietti di compleanno + tool creatore (vedi §14)
/giochi/lettere                    hub per competenza (lettere, numeri, colori, forme,
                                   memoria, logica, matematica, lettura, inglese, emozioni)
/giochi/[slug]                     pagina gioco (es. /giochi/memory-animali)
/giochi/senza-pubblicita           landing attributo (gratis, senza pubblicità, montessori, da stampare)
/storie                            hub letture
/storie/6-anni                     hub per età
/storie/stampatello | /storie/corsivo   hub per carattere
/storie/[slug]                     pagina storia (toggle font, PDF)
/compiti-vacanze                   hub
/compiti-vacanze/prima-elementare  percorso per classe
/stampabili                        schede PDF (lead magnet)
/per-insegnanti                    landing B2B (scuole, nidi)
/blog/[slug]                       guide: "giochi per bambini di 3 anni da fare in casa", ecc.
/account                           area genitore (progressi, figli, download)
```

Regole:
- Ogni hub ha **testo introduttivo da 300–500 parole** (answer-first), griglia giochi, FAQ.
- Breadcrumb ovunque. Link interni: gioco → età → competenza → storie correlate.
- Sitemap generata automaticamente da DB. `robots` pulito. Canonical su ogni pagina.

### 3.1 Template pagina gioco (SEO + AEO)
1. H1: `{Nome gioco}: gioco di {competenza} per bambini di {età}`
2. Il gioco (sopra la piega, full-width su mobile, pulsante "schermo intero")
3. **Paragrafo risposta** (40–60 parole): cos'è, cosa insegna, età consigliata → è quello che AI e featured snippet citano.
4. "Cosa impara il bambino" (3 bullet: competenza, sotto-abilità, collegamento curricolo Indicazioni Nazionali)
5. "Come giocare insieme" (guided play, 3 suggerimenti per il genitore)
6. Giochi simili (stessa età / stessa competenza)
7. FAQ (3–4 domande nel linguaggio delle ricerche: "È adatto a 3 anni?", "Funziona sul telefono?", "È gratis?")
8. Schema: `VideoGame` + `LearningResource` + `FAQPage` + `BreadcrumbList`; `educationalLevel`, `typicalAgeRange`, `teaches`, `inLanguage: it`.

### 3.2 GEO / AEO (essere citati da ChatGPT, Perplexity, Google AI Overview)
- Pagina "Chi siamo" con **autore reale** (tu: docente universitaria, CEO, madre) + metodo dichiarato → E-E-A-T.
- Pagina **"Il nostro metodo"** che cita LEGO Foundation, Active Playful Learning, Montessori, scienza della lettura, con riferimenti. Le AI pescano da lì.
- Ogni hub risponde a una domanda esplicita in apertura ("Quali giochi sono adatti a un bambino di 3 anni?").
- Tabelle comparative (età → competenze attese → giochi) — le AI adorano le tabelle.
- `llms.txt` nella root con indice del sito e descrizione.
- Dati strutturati completi e coerenti, `dateModified` reale.
- Contenuto originale, non lista di giochi altrui: siamo *la fonte*, non l'aggregatore.

---

## 4. Architettura software

### 4.1 Stack
- **Next.js 15 (App Router, TypeScript)** su **Vercel** — SSG/ISR per tutte le pagine pubbliche (velocità = SEO + bambini impazienti).
- **Supabase**: Auth (magic link via email — niente password per i genitori), Postgres, Storage (PDF, audio).
- **Brevo**: sync contatti via API alla registrazione + evento "gioco completato" per automazioni.
- **Tailwind** + font **Nunito** (tondo, leggibile) + **Lexend / Andika** per le letture (font ad alta leggibilità), corsivo con font corsivo italiano scolastico (es. *Pacifico* no — serve un corsivo didattico: candidato *Nerko One* o font "corsivo scuola" con licenza; da verificare giorno 2).
- Giochi: **React + Canvas/SVG**, zero librerie pesanti. Ogni gioco è un modulo autocontenuto che espone `{ onComplete, onProgress, age, difficulty }`.
- Audio: Web Speech API (sintesi vocale italiana) per istruzioni ai bambini di 3 anni che non leggono; file mp3 registrati per le letture nel tempo.

### 4.2 Schema dati (Supabase)
```
profiles         id (auth.users), parent_name, email, city, profession, consent_at, brevo_contact_id
children         id, profile_id, nickname (nullable), age_band (2..8), grade (nullable)
games            id, slug, title, age_min, age_max, skill, subskill, difficulty, description,
                 answer_paragraph, learns[], parent_tips[], faq jsonb, status, created_at
stories          id, slug, title, age_band, theme, length_min, text, fonts_available[], pdf_url
progress         id, child_id, game_id, score, stars, completed_at
events           id, profile_id, type, payload, created_at   (→ Brevo)
```
Registry dei giochi **in codice** (`games/registry.ts`) + riga in DB per SEO/contenuti: il codice dice *come* si gioca, il DB dice *come si racconta*.

### 4.3 Struttura cartelle
```
giocaconmizi/
├─ app/
│  ├─ (public)/
│  │  ├─ page.tsx                       home
│  │  ├─ giochi/page.tsx
│  │  ├─ giochi/[slug]/page.tsx
│  │  ├─ giochi/eta/[eta]/page.tsx      3-anni, 4-anni…
│  │  ├─ giochi/competenza/[skill]/page.tsx
│  │  ├─ storie/[slug]/page.tsx
│  │  ├─ storie/eta/[eta]/page.tsx
│  │  ├─ compiti-vacanze/[classe]/page.tsx
│  │  ├─ metodo/page.tsx, chi-siamo/page.tsx, per-insegnanti/page.tsx
│  ├─ (auth)/accedi/page.tsx
│  ├─ (app)/account/page.tsx
│  ├─ api/brevo/route.ts               webhook/sync
│  ├─ sitemap.ts, robots.ts
├─ games/                              UN FOLDER PER GIOCO
│  ├─ registry.ts                      elenco + metadati tecnici
│  ├─ _template/                       scaffold per nuovi giochi
│  ├─ memory-animali/{Game.tsx, meta.ts, assets/}
│  ├─ conta-fino-a-10/
│  └─ ...
├─ content/
│  ├─ games/*.md                       testi SEO del gioco (frontmatter = meta)
│  ├─ stories/*.md                     storie (frontmatter: età, tema, font)
│  └─ hubs/*.md                        testi hub età/competenza
├─ components/ (ui, game-shell, font-switcher, progress, seo/JsonLd.tsx)
├─ lib/ (supabase, brevo, seo, audio)
├─ public/ (og images, llms.txt, favicon)
├─ scripts/ (generate-sitemap, sync-content-to-db, export-pdf)
└─ docs/ (questo file, CONTENT-GUIDE.md, GAME-DESIGN-CHECKLIST.md)
```

### 4.4 Logica automation
- **Registrazione** → `profiles` insert → trigger edge function → Brevo `createContact` con attributi `CITTA, PROFESSIONE, ETA_FIGLIO, CLASSE` + lista "Genitori" / "Insegnanti" in base alla professione.
- **Gioco completato** (loggato) → `progress` insert → evento Brevo `gioco_completato` → automazione Brevo (da configurare a mano in UI, come sempre): dopo 3 giochi invia "Scarica le schede stampabili", dopo 7 giorni di inattività "Nuova storia per bambini di {età}".
- **Nuovo contenuto**: commit di un `.md` in `content/` → build Vercel → script aggiorna DB e sitemap → ping IndexNow/Google.
- **Generazione contenuti**: skill Claude Code "nuovo-gioco" che, dato slug + competenza + età, crea cartella gioco dal template, file `.md` SEO, FAQ, schema, OG image.
- **Report settimanale** (dopo il lancio): Search Console → tabella query → idee nuovi giochi.

---

## 5. Catalogo iniziale (fase 1: 20 giochi, 12 storie)

Criteri: richiesto dalle ricerche + una competenza sola + fattibile in 1–2 ore con Claude Code + adatto a touch.

**3–4 anni (infanzia)**
1. Memory animali (memoria) 2. Abbina i colori (colori) 3. Trova la forma (forme) 4. Conta fino a 10 (numeri) 5. Puzzle a 4–6 pezzi (spazio) 6. Il suono dell'animale (ascolto) 7. Grande/piccolo (logica) 8. Le emozioni di Boo (emozioni)

**5–6 anni (prescolare / prima)**
9. Lettera iniziale (fonetica) 10. Tocca la lettera (alfabeto) 11. Sillabe: unisci (lettura) 12. Trova le differenze (attenzione) 13. Unisci i puntini 1–20 14. Sequenze logiche (cosa viene dopo) 15. Prime parole in inglese (colori/animali)

**6–8 anni (prima–terza)**
16. Addizioni entro 10/20 17. L'orologio 18. Ortografia: C/CH, G/GH 19. Tabelline (2, 3, 5, 10) 20. Leggi e rispondi (comprensione breve)

**Storie** (ogni una in stampatello maiuscolo, minuscolo, corsivo + PDF): 4 per 5 anni (brevi, animali, buonanotte), 4 per 6 anni (prima elementare, 5 minuti), 4 per 7 anni (seconda, emozioni/avventura). Tutte originali.

**Checklist design gioco (da LEGO Foundation + Starfall)**: niente timer; feedback positivo e immediato; errore = riprova senza penalità; istruzione vocale; una sola azione per schermo; tap target ≥ 64px; 5–8 round poi festa finale; bottone "ancora"; funziona offline dopo il primo caricamento (PWA).

---

## 6. Piano 3 giorni

### Giorno 1 — OGGI (mobile → desktop)
**Mattina, da mobile (studio)**
- [x] Ricerca keyword e competitor (fatto)
- [ ] Decidere nome + dominio (controlla disponibilità; lo facciamo con Vercel domain check)
- [ ] Confermare le 6 decisioni del §2
- [ ] Validare catalogo 20 giochi + 12 storie (togli/aggiungi)
- [ ] Definire palette: 4 colori primari allegri + 1 scuro per testi (es. giallo sole, azzurro cielo, verde prato, corallo + blu notte) — con Claude scrivo i token
- [ ] Scrivere da mobile i testi: "Il nostro metodo", "Chi siamo", i 7 hub età (300 parole l'uno, li genero io e tu correggi)

**→ Passa a desktop quando hai deciso nome e palette.** Da lì in poi è produzione.

**Pomeriggio, desktop con Claude Code**
- [ ] Repo + Next.js + Tailwind + Supabase + deploy Vercel vuoto (1 ora)
- [ ] Schema DB + Auth magic link + form registrazione + sync Brevo (1,5 ore)
- [ ] Game shell (componente che ospita ogni gioco: fullscreen, audio, progressi) + template gioco (1 ora)
- [ ] Primi 3 giochi per 3 anni (memory, colori, conta fino a 10) (2 ore)
- [ ] Sitemap, robots, JSON-LD, llms.txt (30 min)

### Giorno 2 — Contenuti e giochi
- [ ] 10 giochi (5–6 e 6–8 anni) con Claude Code in parallelo (dispatch da cell: "fai il gioco X dal template")
- [ ] Storie: 12 testi (li scrivo io, tu li leggi con tua figlia e correggi) + font switcher + PDF export
- [ ] Hub età/competenza/classe con testi e FAQ
- [ ] Area account: figli, progressi, stelline, stampabili
- [ ] Test su telefono reale con tua figlia (il test più importante)

### Giorno 3 — Rifinitura, SEO, lancio
- [ ] Restanti 7 giochi
- [ ] Compiti vacanze: 3 percorsi (infanzia, prima, seconda)
- [ ] Verifica Lighthouse mobile > 90, accessibilità, OG images
- [ ] Search Console + sitemap, IndexNow, Bing Webmaster
- [ ] Privacy policy / cookie (solo tecnici, niente banner invasivo) / consenso genitori
- [ ] Automazioni Brevo in UI (benvenuto, schede dopo 3 giochi, inattività)
- [ ] Post LinkedIn + Substack "Ho costruito un sito di giochi educativi per mia figlia in 3 giorni" (è contenuto La Dietrologa + lead Socialee)

---

## 7. Prompt pronti per Claude Code (da inviare anche via dispatch dal cellulare)

**Setup**
> Crea un progetto Next.js 15 App Router TypeScript chiamato giocaconmizi con Tailwind, Supabase (auth magic link, client/server helpers), struttura cartelle come in docs/giochi-educativi-piano-progetto.md §4.3. Configura deploy Vercel. Aggiungi sitemap.ts, robots.ts, llms.txt, componente JsonLd. Palette: rosa #F28AB2, giallo #F9C846, azzurro #3DB5E6, viola #9B6DD6, crema #FFF3E6 (sfondi), blu notte #1F2430 (testi), arancione #F59A23 (accento Mizi). Font Nunito. Mobile-first, tap target min 64px.

**Template gioco**
> Crea games/_template con Game.tsx che riceve {age, difficulty, onProgress, onComplete}, usa il GameShell (fullscreen, istruzione vocale con Web Speech it-IT, feedback positivo, festa finale con coriandoli CSS, bottone Ancora). Niente timer. Aggiungi meta.ts con slug, title, ageMin, ageMax, skill, subskill e un content/games/{slug}.md con frontmatter SEO e sezioni: answer paragraph, cosa impara, come giocare insieme, FAQ.

**Nuovo gioco (ripetibile)**
> Usando games/_template crea il gioco "{nome}" slug "{slug}": competenza {skill}, età {min}-{max}. Meccanica: {descrizione in 2 righe}. 6 round, difficoltà crescente. Asset in SVG inline, niente immagini esterne. Scrivi anche content/games/{slug}.md completo in italiano, con 4 FAQ nel linguaggio delle ricerche Google. Registralo in registry.ts.

**Storie**
> Crea il sistema letture: content/stories/*.md con frontmatter {age, theme, minutes, title}; pagina /storie/[slug] con toggle STAMPATELLO MAIUSCOLO / minuscolo / corsivo (font {X}), dimensione testo grande, interlinea 1.8, pulsante Ascolta (TTS it-IT), pulsante Scarica PDF (solo loggati). Hub /storie/eta/[eta] e /storie/{carattere}.

**Brevo**
> Alla conferma registrazione crea il contatto Brevo con attributi CITTA, PROFESSIONE, ETA_FIGLIO, CLASSE e aggiungilo alla lista {ID}. Alla prima completamento di un gioco invia evento track "gioco_completato". Usa sender ID 5.

---

## 8. Rischi e come li gestiamo
- **Dominio nuovo, zero autorità**: serve 2–3 mesi per posizionarsi sulle head keyword. Partiamo dalle long tail ("giochi per bambini 3 anni online gratis senza pubblicità", "storie in stampatello 6 anni") e spingiamo con il tuo LinkedIn/Substack + eCampus/Cattolica/IULM (link da domini .edu-like valgono oro).
- **Qualità dei giochi**: 20 giochi buoni > 100 mediocri. Il test con tua figlia decide cosa pubblichiamo.
- **Privacy**: minimizzazione dati bambino, consenso, privacy policy chiara. È anche un argomento di marketing.

---

## 9. Modello economico: prodotti digitali + causa benefica

### 9.1 Cosa vendiamo (tutto immateriale, producibile in casa)
| Prodotto | Prezzo indicativo | Produzione |
|---|---|---|
| Libri da colorare PDF (20 titoli a tema: animali, dinosauri, mare, lettere, numeri, emozioni, stagioni, mestieri, veicoli, spazio…) | 2,90–4,90 € | ChatGPT/immagini AI → impaginazione PDF A4 con script |
| Quaderni attività per età (3-4, 5-6, 6-7) — 30 pagine: labirinti, unisci i puntini, pregrafismo, prime lettere | 5,90–7,90 € | stesso flusso |
| Storie illustrate PDF (stampatello + corsivo) | 1,90 € o pacchetto 12 storie 9,90 € | già nel sito |
| Kit "Compiti delle vacanze" per classe | 9,90 € | giochi + letture + calendario stampabile |
| Kit insegnante (schede + licenza classe) | 19–29 € | bundle |
| Bundle "tutto" | 29,90 € | upsell |

Sempre **un prodotto gratuito** per categoria (1 libro da colorare gratis, 2 storie gratis): è il lead magnet che alimenta Brevo.

### 9.2 Come vendiamo
- **Lemon Squeezy** (o Gumroad): gestisce IVA UE, fatturazione, consegna PDF, checkout in pagina. Zero carrello da costruire. Webhook → Brevo (attributo `CLIENTE=1`, lista Clienti). Intestazione: Partidea SRL.
- Pagina `/libri` (hub prodotti, indicizzata per "libro da colorare pdf", "schede didattiche da stampare", "quaderno attività 4 anni pdf") + `/libri/[slug]` con anteprima 3 pagine, schema `Product`.
- Ogni gioco linka il prodotto coerente ("Ti piace contare? Scarica il quaderno dei numeri").

### 9.3 Causa benefica (da comunicare ovunque)
- Pagina `/perche-lo-facciamo`: nato per una bambina e i suoi compiti estivi; niente pubblicità; i ricavi coprono i costi e una **quota fissa (es. 20%) va a un'associazione per l'infanzia**.
- Scelta associazione: una in Puglia (visibilità locale, PR) o nazionale. Criteri: trasparente, con bilancio pubblico, disponibile a un logo reciproco. Da contattare giorno 3 con una mail (la preparo io).
- Contatore pubblico "donato finora" aggiornato a mano ogni mese: fiducia + contenuto social.
- È anche un ottimo motivo per i backlink (associazione, scuole, giornali locali).

### 9.4 Pipeline produzione libri (oggi, con ChatGPT)
1. Per ogni titolo: 24 tavole line-art, stesso stile, A4 verticale, sfondo bianco, linee nere spesse, nessun testo nell'immagine. Prompt base: *"Pagina da colorare per bambini di {età} anni, {soggetto}, line art, contorni neri spessi e puliti, nessuna ombreggiatura, nessun riempimento, sfondo bianco, composizione semplice e grande, stile libro da colorare"*. Nomina i file `{slug}-{01..24}.png`.
2. Me li passi (o cartella Drive) → script Python impagina copertina + 24 tavole + pagina "a chi va una parte del ricavato" + licenza d'uso famiglia → PDF.
3. Copertina a colori con mascotte (vedi §12) e titolo.
4. Mockup 3D per la pagina prodotto (script HTML → PNG).

---

## 10. Automazione reel quotidiani

Obiettivo: 1 reel/giorno su IG + TikTok (+ YouTube Shorts) con format fisso, prodotto in automatico dal sito stesso.

**Format "Gioco del giorno" (15–25 s, verticale 1080×1920)**
1. Hook testuale 2 s: "Giochi educativi per bambini di 5 anni: oggi…"  
2. Screen recording del gioco in azione (8–12 s) con mascotte in angolo  
3. Card "Cosa impara" (3 parole)  
4. CTA: "Gratis e senza pubblicità → link in bio"

**Come si produce senza toccare nulla**
- Ogni gioco ha una "modalità demo" (`?demo=1`) che gioca da sola per 12 s.
- Script `scripts/make-reel.ts`: Playwright registra la demo a 1080×1920 → ffmpeg monta hook + video + card + CTA + musica (libreria royalty-free) → salva `reels/{data}-{slug}.mp4` + caption.txt con hashtag e frase-keyword ("giochi educativi per bambini 5 anni").
- Pubblicazione: per i primi giorni manuale (o via Higgsfield/Descript già collegati); poi Meta Graph API + TikTok Content API, schedulata da Vercel Cron alle 17:30. Piano: lunedì età 3, martedì età 4, mercoledì storia, giovedì età 5-6, venerdì libro, sabato "gioco insieme", domenica causa benefica.
- Rotazione: la keyword del reel = la keyword della pagina → ogni reel spinge una pagina SEO.
- Variante "storia del giorno": testo che scorre in stampatello con voce TTS → stesso script.

**Risultato**: 30 reel/mese senza girare nulla, ogni reel è anche un asset per la pagina gioco (video sulla pagina = segnale di qualità).

---

## 11. Form e dati (versione finale)
- Campi: nome genitore*, email*, città*, professione (select: genitore, insegnante, educatore, imprenditore, altro), età bambino (select 2–8, facoltativo). Consenso privacy + flag "ricevo novità e offerte".
- Brevo: lista "Famiglie" / "Insegnanti" per professione; attributi `CITTA, PROFESSIONE, ETA_FIGLIO, ORIGINE (gioco/pdf/libro/footer)`.
- Nessun dato del bambino oltre l'età. Privacy policy chiara e corta.

---

## 12. Mascotte: Mizi il pinguino (DEFINITA)

Mizi esiste: pinguino tondo con ciuffo castano, occhi ambra grandi, guance rosa, fazzoletto rosa a pois bianchi, cuore rosa cucito sulla pancia, zampe arancioni. **Stile 3D morbido (render peloso, luci soffici), non flat.** Palette del brand derivata da lei: rosa #F28AB2, giallo #F9C846, azzurro #3DB5E6, viola #9B6DD6, crema #FFF3E6, blu notte #1F2430, arancione #F59A23. Logo: scritta "Mizi" a lettere cucite multicolore (già prodotta).

Regole per le immagini successive: stessa chat ChatGPT, allegare sempre l'immagine di riferimento, sfondo neutro chiaro o trasparente, niente scene complesse per le pose UI (le scene come la piscina vanno bene per reel, copertine e pagine tema).

### 12.1 Premessa fissa per ogni posa
> Stesso personaggio Mizi dell'immagine allegata: identici ciuffo castano, occhi, fazzoletto rosa a pois, cuore sulla pancia, zampe arancioni, stile 3D morbido. Sfondo trasparente (o crema uniforme #FFF3E6), corpo intero, 2048×2048, nessun testo. Posa:

### 12.2 Pose (una per volta)

**Sito e giochi (12)**
1. saluta con la pinna · 2. salta di gioia con le pinne in alto e coriandoli (fine gioco) · 3. pensa con la pinna sul becco · 4. indica a destra · 5. indica a sinistra · 6. applaude · 7. occhi chiusi e sorriso sereno ("riprova", mai triste) · 8. tiene una lettera A gigante · 9. tiene il numero 10 · 10. seduto che legge un libro · 11. dorme con berretto da notte (storie della buonanotte) · 12. con cuffie e laptop (coding)

**Sezioni (6)**
13. con pennarello gigante (libri da colorare) · 14. con cappellino da festa e palloncino (biglietti) · 15. con zainetto e quaderno (compiti delle vacanze) · 16. abbraccia un cuore (causa benefica) · 17. con lente d'ingrandimento (giochi di logica) · 18. con bandierina UK o pallone da calcio (inglese / 9–12 anni)

**Tecniche (6)**
19. solo testa frontale (avatar, favicon) · 20. testa 3/4 che fa l'occhiolino · 21. versione **line-art bianco e nero** senza colori (libri da colorare e biglietti da colorare) · 22. silhouette piena nera (loader, watermark) · 23. mini-Mizi su sfondo pattern ghiaccio/stelle 1920×1080 (hero) · 24. Mizi che guarda in alto verso uno spazio vuoto (per i reel: il testo va sopra)

**Extra reel (4, 1080×1920 verticali)**: Mizi in angolo in basso a sinistra che indica in alto; Mizi che tiene un telefono; Mizi con cappello da laureato; Mizi stagionale (Natale, Pasqua, estate) da fare più avanti.

### 12.3 Formati
- PNG trasparente 2048×2048 per le pose; nome `mizi-{posa}.png` (mizi-saluta, mizi-festa, mizi-pensa, mizi-legge…).
- Se ChatGPT non dà il trasparente pulito, scontorno io con `rembg`.
- Da questi ricavo io: favicon, OG image, sprite per i giochi, versione SVG della testa per il logo.

### 12.4 Cosa NON chiedere
Cambi di stile (flat, cartoon 2D), accessori nuovi, sfondi pieni nelle pose UI. Per i libri da colorare chiedere esplicitamente "versione line-art in bianco e nero di Mizi, contorni puliti".

---

## 13. Coding: analisi e cosa costruiamo

### 13.1 Cosa cercano (autocomplete Italia)
- **"coding per bambini"** si declina per età (3, 4, 5, 6, 7, 8, 9, 10 anni) e per scuola (**infanzia, prima elementare, scuola primaria, quinta elementare**).
- Fortissimo il bisogno **didattico/insegnanti**: *coding per bambini pdf, schede da stampare, coding unplugged, coding alla LIM, giochi di coding wordwall, coding con le fiabe, coding di Natale/Halloween, disegni con il coding (pixel art)*. Le maestre cercano materiale pronto per la classe.
- **"giochi di coding"**: online, gratis, scuola primaria, classe prima/seconda, infanzia, interattivi, da stampare.
- **"scratch"**: *scratch per bambini, spiegato ai bambini, tutorial, esempi, corso, scratch 5 anni* → ScratchJr. Nessun sito italiano spiega Scratch bene ai genitori.
- **"programmazione per bambini"** è inquinata da "programmazione cinema/tv": usiamo "coding" come parola principale e "programmazione a blocchi" come secondaria.
- Ricorre **"coding per bambini autistici"**: nicchia seria, zero concorrenza di qualità.
- 9–12 anni: *giochi per ragazzi 10 12 anni online gratis, giochi educativi per ragazzi di 10 anni, corso programmazione Roblox/videogiochi per bambini*. Qui il coding è l'aggancio naturale.

### 13.2 Riferimenti e competitor
- **Code.org / "Programma il Futuro"** (MIUR + CINI): è lo standard nelle scuole italiane, basato su Blockly; l'Ora del Codice (dicembre) genera picchi di ricerca ogni anno → contenuto stagionale da preparare a novembre.
- **Blockly** (Google): libreria open source, 100% client-side, motore di Scratch e Code.org. **È quello che usiamo noi**: ci permette di costruire i nostri giochi a blocchi, in italiano, senza dipendere da nessuno.
- **Scratch / ScratchJr** (MIT): creativo, ma non è "a livelli": i bambini non sanno da dove partire. Noi facciamo le **guide in italiano** + progetti passo passo, e linkiamo Scratch.
- **Blockly Games, Lightbot, CodeCombat, Tynker, Kodable**: giochi a livelli (labirinto, sequenze, cicli, condizioni). Nessuno è in italiano, per età, senza account, senza ads.
- Ricerca: **pensiero computazionale** (Wing, 2006) + Indicazioni Nazionali 2025 che inseriscono il coding nella primaria → argomento E-E-A-T per la pagina metodo.

### 13.3 Progressione per età (la nostra proposta)
| Età | Concetto | Giochi |
|---|---|---|
| 3–5 | sequenze, direzioni, pattern (unplugged + touch) | "Guida Mizi" (frecce → percorso), "Cosa viene dopo", pixel art con colori, "Il robot ballerino" (sequenza di mosse) |
| 6–7 | algoritmo, ripetizione (cicli), debug | Labirinto a blocchi liv. 1–10, "Trova l'errore", pixel art con coordinate, coding con le fiabe (ordina le scene) |
| 8–9 | cicli annidati, condizioni "se", variabili | Labirinto liv. 11–25, "Disegna con la tartaruga" (Logo a blocchi), "Il semaforo" (if), musica a blocchi |
| 10–12 | funzioni, eventi, primo testo | "Crea il tuo gioco" (Blockly → JavaScript visibile accanto), guide Scratch, mini-Python nel browser (Pyodide), sfide settimanali |

Ogni gioco mostra, a richiesta, il **codice vero** generato dai blocchi (Blockly lo fa in automatico): è il ponte verso la programmazione reale e una cosa che i competitor gratuiti non fanno.

### 13.4 Contenuti SEO coding (oltre ai giochi)
- **Schede unplugged PDF** per infanzia e primaria (reticoli, frecce, pixel art, Natale/Halloween/Pasqua): gratuite le prime, pacchetto a pagamento per insegnanti.
- Guide: *Cos'è il coding per bambini (spiegato ai genitori)*, *Scratch spiegato ai bambini: primo progetto in 10 minuti*, *Coding unplugged: 10 attività senza computer*, *Coding per bambini autistici*, *Ora del Codice: come partecipare con la classe*.
- Hub per classe (prima → quinta) con "cosa dicono le Indicazioni Nazionali" e i giochi corrispondenti.

### 13.5 Tecnica
- `npm i blockly` + locale `it`. Componente `BlocklyGame` con toolbox per livello (solo i blocchi necessari). Livelli definiti in JSON (`games/coding/levels/labirinto/01.json`: griglia, start, goal, blocchi ammessi, soluzione minima). Esecuzione: interprete JS-Interpreter passo-passo con evidenziazione del blocco.
- Pixel art e tartaruga: Canvas.
- 10–12 anni: pannello "Vedi il codice" (JS/Python generato), Pyodide caricato solo su richiesta.
- Salvataggio progressi in localStorage (niente account) + opzionale "salva con l'email" → Brevo.

### 13.6 Impatto sul piano
- Catalogo fase 1 sale a **28 giochi**: i 20 del §5 + 8 di coding (Guida Mizi, Cosa viene dopo, Pixel art, Robot ballerino, Labirinto a blocchi 1–10, Trova l'errore, Tartaruga, Crea il tuo gioco base).
- Aggiunta per 9–12 anni, non coding: tabelline complete, frazioni, regioni d'Italia, inglese vocabolario, quiz scienze, dattilografia (molto cercata per la scuola).
- Giorno 1 pomeriggio: setup Blockly incluso nello scaffold. Giorno 2: Labirinto a blocchi (il gioco pilastro, 10 livelli) + Guida Mizi. Giorno 3: pixel art + schede unplugged.
- Reel: un giorno a settimana dedicato al coding ("Coding per bambini di 6 anni: il labirinto").

---

## 14. Biglietti di compleanno: SEO map + tool creatore

### 14.1 Cosa cercano (autocomplete Italia) — due cluster distinti
**A. Inviti** ("inviti compleanno bambini") — il cluster più grande. Modificatori: *online gratis, digitali, whatsapp, pdf, da stampare, editabili, da compilare, personalizzati, con foto, app, canva, cosa scrivere/frasi/testo, originali, simpatici* + **età 1→11 anni** + **bimba/bimbo** + **tema** (unicorno, dinosauri, calcio, principesse, supereroi, animali, fattoria, lego, gaming; e tanti IP: Spiderman, Stitch, Frozen, Paw Patrol, Minecraft, Super Mario, Pokemon, Sonic, Huntrix, Bing).
**B. Auguri** ("biglietti di compleanno bambini") — *da stampare gratis, da colorare, fai da te, bambina/bambino, maschi, 1/3/5/8/9/10 anni, elementari, con foto, bianco e nero, pop up, ringraziamento*.
Cluster C, minore: **sfondi compleanno** bimba/bimbo/10 anni/11 anni.

Intento chiaro: "voglio farlo io, gratis, adesso, mandarlo su WhatsApp o stamparlo". Il tool è la risposta perfetta: meglio di Canva (troppo complesso per un genitore di corsa) e delle gallerie statiche.

**IP**: non usiamo personaggi protetti (Spiderman, Frozen, Stitch…). Li **intercettiamo** con temi generici equivalenti e lo diciamo: "supereroi" (non Spiderman), "principesse del ghiaccio" (non Frozen), "alieno blu" (non Stitch), "cuccioli soccorritori" (non Paw Patrol), "mondo a cubetti" (non Minecraft). Le pagine tema generiche si posizionano sulle long tail e non rischiano nulla.

### 14.2 Mappa SEO / GEO / AEO
```
/biglietti                                   hub: Inviti | Auguri | Ringraziamenti | Da colorare → CTA "Crea il tuo"
/biglietti/crea                              IL TOOL (indicizzato: "crea inviti compleanno bambini online gratis")
/biglietti/inviti-compleanno-bambini         hub inviti
/biglietti/inviti-compleanno-bambina-5-anni  età × genere (1..12 × bimba/bimbo = 24 pagine)
/biglietti/inviti-compleanno-5-anni          età neutra (12 pagine)
/biglietti/inviti-compleanno-unicorno        tema (≈25 pagine)
/biglietti/inviti-compleanno-whatsapp        formato/modalità (whatsapp, pdf, da stampare, con foto, digitali)
/biglietti/auguri-compleanno-bambini         hub auguri + stesse declinazioni età/genere/tema
/biglietti/auguri-compleanno-bambina-5-anni
/biglietti/biglietti-compleanno-da-colorare  line art (riusa lo stile dei libri)
/biglietti/ringraziamento-compleanno-bambini
/biglietti/frasi-inviti-compleanno-bambini   guida testi (AEO: "cosa scrivere")
/biglietti/esempi/[slug]                     galleria esempi (i tuoi da Canva) → ogni esempio ha "Personalizza questo"
```
Ogni pagina è **generata da template** (pSEO) con: H1 con la keyword esatta, 6–12 anteprime di biglietti *reali* del tool (non stock) già precompilati per quell'età/tema, paragrafo risposta, 3 frasi pronte, FAQ (gratis? come lo mando su WhatsApp? posso mettere la foto? che formato stampo?), schema `WebApplication` (tool) + `ImageGallery` + `FAQPage` + `HowTo` ("Come creare un invito in 2 minuti"). Link interno: pagina età → tool con **parametri precompilati** (`/biglietti/crea?tipo=invito&eta=5&genere=f&tema=unicorno`) così l'utente arriva e il biglietto è già quasi pronto.

GEO/AEO: ogni hub apre con la risposta secca ("Puoi creare gratis un invito di compleanno per una bambina di 5 anni, scaricarlo in PDF o inviarlo su WhatsApp, senza registrazione"), tabella "età → temi più amati → frase consigliata", `llms.txt` aggiornato con la sezione biglietti.

### 14.3 Il tool `/biglietti/crea`
**Stack**: React + Canvas (o SVG → PNG/PDF via `html-to-image` + `jsPDF`). Tutto client-side, niente backend, niente login. Funziona su telefono.

**Flusso (3 passi, tutto in una schermata su mobile)**
1. **Scegli**: tipo (invito / auguri / ringraziamento), formato (**A6 verticale** stampa, **A5**, **9:16 WhatsApp/story**, **1:1 IG**), sfondo (griglia filtrabile per tema / bimba-bimbo-neutro / età).
2. **Scrivi**: campi già compilati con testo d'esempio per il tipo scelto — nome, età (genera "5 anni" + numero grande decorativo), data, ora, luogo/indirizzo, "conferma a" (telefono), frase (selezionabile da una lista di 30 frasi per tipo/età), firma. Facoltativi: **foto** (upload, maschera tonda/cornice), mascotte Mizi sì/no.
3. **Scarica**: PDF (A6 con 4 su un A4 per stampare e tagliare; A5; A4), PNG (WhatsApp), "Condividi su WhatsApp" diretto (Web Share API). Per "da colorare": esporta in line art bianco e nero.

Dettagli che fanno la differenza: font a scelta (3: tondo, corsivo, stampatello bambino), colore testo automatico per contrasto, drag dei blocchi di testo, anteprima fronte/retro, "Salva il link" (stato nell'URL, niente DB), pulsante "Fai un altro con lo stesso sfondo" (gli inviti si fanno a 20 copie: unico nome → stampa multipla con spazio per il nome dell'invitato).

**Lead**: dopo il download, form gentile: "Vuoi il pacchetto di 10 sfondi extra + cartellini per i regali? Lascia la mail" → Brevo (ORIGINE=biglietti). È il punto del sito che porterà più email.

### 14.4 Sfondi (≥50)
Produrli **noi** è la scelta giusta: stile coerente, zero problemi di licenza, funzionano anche come reel e come pagine tema. Fonti a licenza libera (Unsplash, Pexels, Pixabay) solo per 5–10 sfondi fotografici (palloncini, coriandoli, torta) — non vanno bene per i temi "bambini" (illustrazioni).

**25 temi × 2 varianti (chiaro / colorato) = 50 sfondi**, più 10 line-art per "da colorare":
unicorno · dinosauri · calcio · principessa · supereroe · spazio/razzi · animali della foresta · fattoria · sirena · pirati · mondo a cubetti (gaming) · macchinine · cuccioli · farfalle e fiori · arcobaleno · circo · giungla/safari · mare/estate · dolci e torta · palloncini e coriandoli · robot · fate · ballerina · costruzioni/mattoncini · stelle e luna (1° compleanno). Numeri 1–12 decorativi come layer separato (PNG) in 3 stili.

**Prompt per ChatGPT (uno per tema)**
> Sfondo per invito di compleanno per bambini, tema {tema}, formato verticale 1240×1748 px (A6 a 300 dpi). Illustrazione morbida per bambini coerente con la mascotte Mizi (3D soft, pastello), colori {palette}, elementi decorativi solo sui bordi e negli angoli, **centro vuoto e chiaro per il testo**, nessun testo, nessun personaggio di marchi esistenti, stile coerente con un sito di giochi educativi. Variante 1: sfondo chiaro. Variante 2: sfondo colorato. Nome file `bg-{tema}-{chiaro|colorato}.png`.

Regola unica: **centro libero**. Senza questo i biglietti non sono leggibili.

### 14.5 Esempi da Canva
I biglietti che scarichi da Canva li usiamo come **galleria ispirazione** (`/biglietti/esempi/[slug]`, immagine + descrizione + tag età/tema) con CTA "Crealo tu con il nostro sfondo {tema}". Attenzione: sono ispirazione per l'utente, non li ridistribuiamo come template scaricabili (licenza Canva). I template scaricabili veri sono i nostri sfondi.

### 14.6 Dove sta nel piano
- Giorno 2 (desktop): tool base (scelta sfondo, testo, PDF/PNG) — 3 ore con Claude Code. Le 24 pagine età×genere + 25 tema sono generate dal template in 30 minuti.
- Giorno 3: foto, WhatsApp share, "da colorare", frasi, esempi Canva.
- Sfondi: li produci oggi con ChatGPT insieme ai libri (stessa sessione, stesso stile).
- Reel: un giorno a settimana "Crea l'invito di compleanno in 60 secondi" (screen recording del tool).
- Stagionalità: Natale (biglietti di Natale da stampare), Pasqua, festa della mamma/papà, fine anno scolastico per le maestre → stesso tool, nuovi sfondi.

**Prompt Claude Code**
> Crea /biglietti/crea: editor client-side React + Canvas. Stato in URL (tipo, formato, sfondo, campi testo, font, foto base64 solo in memoria). Sfondi da /public/cards/bg-*.png indicizzati in cards/registry.ts con tag tema/genere/età. Campi per tipo con testo d'esempio. Export PDF (A6 singolo, A6×4 su A4, A5, A4) con jsPDF e PNG 9:16/1:1 con html-to-image. Web Share API per WhatsApp. Pagine pSEO da content/cards-pages.ts (età×genere, età, tema, modalità) con anteprime precompilate generate a build time, FAQ, schema WebApplication+FAQPage+HowTo, link al tool con query string precompilata.
