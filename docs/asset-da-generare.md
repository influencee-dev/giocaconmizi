# Asset da generare — lista operativa

La lista completa delle immagini che mancano al sito, con nomi file e prompt
pronti da incollare. Fonte: piano-progetto §12 (Mizi) e §14.4 (sfondi).

## Come farle arrivare nel repo

Il download diretto da Canva e Higgsfield è bloccato dalla rete delle sessioni
Claude Code (verificato: 403 sul CDN). Il canale che funziona è **Google Drive**:

1. Genera le immagini (dove, è scritto sotto per ogni gruppo).
2. Mettile in una cartella o uno zip su Drive — da Canva c'è "Condividi → Salva
   su Google Drive".
3. Scrivi in chat "gli asset sono su Drive": Claude li scarica, li mette nelle
   cartelle giuste di `public/`, sostituisce i segnaposto SVG e pusha.

Dove vanno a finire:
- pose di Mizi → `public/mascot/`
- sfondi biglietti e numeri → `public/cards/`
- esempi Canva per la galleria → `public/esempi/`

I segnaposto SVG attuali vivono in `games/_engine/arte.tsx` (Mizi nei giochi) e
`components/biglietti/motivi.tsx` (sfondi): si sostituiscono senza toccare il
resto del sito.

## Regola di licenza (importante)

Gli **elementi della libreria Canva non possono** finire negli sfondi del tool
biglietti: sono template che gli utenti personalizzano, ed è l'uso che la
Content License di Canva vieta (già recepito nel piano §14.5).

Si può usare invece, ovunque: materiale caricato da noi, e l'output di **Magic
Media** (l'AI di Canva), che è nostro.

---

## 1. Mizi — 24 pose (con ChatGPT, per la coerenza del personaggio)

Stessa chat, allegare sempre `mizi-ref.png`. PNG trasparente 2048×2048 salvo
dove indicato. Premessa fissa da incollare prima di ogni posa (§12.1):

> Stesso personaggio Mizi dell'immagine allegata: identici ciuffo castano,
> occhi, fazzoletto rosa a pois, cuore sulla pancia, zampe arancioni, stile 3D
> morbido. Sfondo trasparente (o crema uniforme #FFF3E6), corpo intero,
> 2048×2048, nessun testo. Posa:

| # | File | Posa da chiedere |
|---|---|---|
| 1 | `mizi-saluta.png` | saluta con la pinna |
| 2 | `mizi-festa.png` | salta di gioia con le pinne in alto e coriandoli |
| 3 | `mizi-pensa.png` | pensa con la pinna sul becco |
| 4 | `mizi-indica-destra.png` | indica a destra |
| 5 | `mizi-indica-sinistra.png` | indica a sinistra |
| 6 | `mizi-applaude.png` | applaude |
| 7 | `mizi-riprova.png` | occhi chiusi e sorriso sereno (mai triste) |
| 8 | `mizi-lettera-a.png` | tiene una lettera A gigante |
| 9 | `mizi-numero-10.png` | tiene il numero 10 |
| 10 | `mizi-legge.png` | seduto che legge un libro |
| 11 | `mizi-dorme.png` | dorme con berretto da notte |
| 12 | `mizi-coding.png` | con cuffie e laptop |
| 13 | `mizi-pennarello.png` | con pennarello gigante |
| 14 | `mizi-festa-palloncino.png` | con cappellino da festa e palloncino |
| 15 | `mizi-zainetto.png` | con zainetto e quaderno |
| 16 | `mizi-cuore.png` | abbraccia un cuore |
| 17 | `mizi-lente.png` | con lente d'ingrandimento |
| 18 | `mizi-calcio.png` | con pallone da calcio (o bandierina UK) |
| 19 | `mizi-testa.png` | solo testa frontale (avatar, favicon) |
| 20 | `mizi-occhiolino.png` | testa 3/4 che fa l'occhiolino |
| 21 | `mizi-lineart.png` | versione line-art bianco e nero, contorni puliti |
| 22 | `mizi-silhouette.png` | silhouette piena nera |
| 23 | `mizi-hero.png` | mini-Mizi su pattern ghiaccio/stelle — **1920×1080** |
| 24 | `mizi-reel.png` | guarda in alto verso spazio vuoto — **1080×1920** |

Regole §12.4: mai chiedere cambi di stile (niente flat o 2D), niente accessori
nuovi, niente sfondi pieni nelle pose UI.

## 2. Sfondi biglietti — 50 file (Canva Magic Media, oppure ChatGPT)

Formato verticale **1240×1748** (A6 a 300 dpi). Due varianti per tema:
`bg-{tema}-chiaro.png` e `bg-{tema}-colorato.png`. Prompt da adattare (§14.4):

> Sfondo per invito di compleanno per bambini, tema {TEMA}, formato verticale
> 1240×1748. Illustrazione morbida per bambini, 3D soft pastello, elementi
> decorativi solo sui bordi e negli angoli, **centro vuoto e chiaro per il
> testo**, nessun testo, nessun personaggio di marchi esistenti. Variante 1:
> sfondo chiaro crema. Variante 2: sfondo colorato.

La regola unica è il **centro libero**: senza, il biglietto non si legge.

| Tema (slug file) | Cosa chiedere nel prompt |
|---|---|
| `unicorno` | unicorni, arcobaleni, stelline — rosa e viola |
| `dinosauri` | dinosauri simpatici, felci — verde e arancione |
| `calcio` | palloni, coppe, erba — verde e bianco |
| `principessa` | corone, castelli — rosa e oro |
| `supereroe` | mantelli, scudi, fulmini generici (nessun eroe esistente) |
| `spazio` | razzi, pianeti, astronauti — blu e giallo |
| `animali-foresta` | volpi, orsetti, funghi — arancio e verde |
| `fattoria` | trattori, mucche, fienile — rosso e giallo |
| `sirena` | code di sirena, conchiglie, bolle — azzurro e rosa |
| `pirati` | navi, tesori, bandiere — blu notte e rosso |
| `mondo-a-cubetti` | blocchi squadrati stile videogioco (nessun brand) |
| `macchinine` | auto da corsa tonde — rosso e azzurro |
| `cuccioli` | cagnolini e gattini — marrone e rosa |
| `farfalle-fiori` | farfalle e fiori — rosa e viola |
| `arcobaleno` | arcobaleni e nuvolette — multicolore tenue |
| `circo` | tendoni, stelle filanti — rosso e giallo |
| `safari` | leoni, giraffe, foglie — giallo e verde |
| `mare-estate` | onde, sole, secchielli — azzurro e giallo |
| `dolci-torta` | torte, cupcake, caramelle — rosa e crema |
| `palloncini` | palloncini e coriandoli — multicolore |
| `robot` | robottini tondi, ingranaggi — azzurro e grigio |
| `fate` | fatine, bacchette, scintille — viola e rosa |
| `ballerina` | tutù, scarpette — rosa cipria |
| `mattoncini` | mattoncini da costruzione generici — primari |
| `stelle-luna` | luna e stelle (1° compleanno) — giallo e viola |

## 3. Numeri decorativi — 12 file (facoltativi ma utili)

PNG trasparenti, `num-{1..12}-festa.png`, stile coordinato ai biglietti
(numero grande decorato con palloncini/coriandoli). Il tool oggi disegna il
numero col font: questi lo renderebbero più ricco.

## 4. Line-art da colorare — 10 file (fase due)

`bg-colorare-{tema}.png`, bianco e nero a contorni puliti, per la pagina
"biglietti da colorare" e i futuri libri (§14.4).

## 5. Esempi Canva per la galleria `/biglietti/esempi`

Export PNG dei design veri fatti in Canva (qui la libreria Canva **si può**
usare: è ispirazione, non template scaricabile). Nome file = slug:
`{slug}.png` in `public/esempi/`, 1240×1748 o proporzione simile.
I primi due, già registrati nella galleria: `promo-di-compleanno.png`,
`un-anno-di.png`.

---

**Riepilogo: 24 + 50 + 12 + 10 + esempi ≈ 96 file.** Il minimo per accendere
il sito con le illustrazioni vere sono i gruppi 1 e 2 (74 file).
