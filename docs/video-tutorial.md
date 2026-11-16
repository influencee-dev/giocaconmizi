# Video di Mizi (15-16/11/2026)

Tutti i video si fanno con UN comando, a partire da UNA scheda:

```
npm run build                       # build fresca: le schermate vengono dal sito di prova
npm run video -- <slug> [cartella]  # es. npm run video -- come-creare-l-invito
```

Il comando (scripts/video/fai.sh) fa da solo:
1. **schermate** (schermi.mjs): accende il server di prova con il codice del
   pannello di prova, apre ogni pagina della scheda dal telefono (390×844),
   fa le azioni (riempi / scegli / clicca / attendi, dati finti), torna in
   cima, nasconde le barre fisse in basso, fotografa la pagina intera e salva
   dove stanno gli elementi da cerchiare (box.json);
2. **voce di Mizi** (voce.py): TUTTO il testo in una sola registrazione OpenAI
   (voce «sage», pinguina-bambina, decisione di Giorgia del 15/11), poi
   whisper-1 dà i tempi delle parole e si taglia frase per frase. Se una frase
   dura meno di 1,5 secondi il taglio è sbagliato e si ferma;
3. **scene** (prepara.py + video.html): il motore delle animazioni legge la
   scheda; **fotogrammi** (rendi.mjs) 25 al secondo, 16:9 (1920×1080) e
   9:16 (1080×1920) insieme;
4. **musica** originale (musica.py) e **audio** (audio.py: voce al suo posto,
   musica che si abbassa quando parla Mizi, sottotitoli .vtt);
5. **montaggio** H.264 + AAC; copia in public/video/<slug>.mp4/.webp/.vtt;
6. **pagina del tutorial** (registra.py): salva content/video/<slug>.tempi.json
   e ricompila lib/tutorial-dati.json → /tutorial/<slug> nasce da sola.

Restano nella cartella di lavoro «<slug> · 16x9.mp4» e «<slug> · 9x16.mp4» da
caricare su Drive (2 Aree → Giocamizi · Video) e su YouTube.

## La scheda: content/video/<slug>.json

- `slug`, `titolo`, `gruppo` («partner» o «utenti»), `ordine` nell'hub;
- per la pagina: `descrizione`, `rispostaBreve` (citabile dalle AI),
  `pagina` {href, testo} (la pagina del sito di cui parla), `faq`;
- `schermate`: nome → { url, azioni, selettori } (selettori Playwright:
  meglio name, data-*, `button:has-text("…")` col testo esatto del codice);
- `scene`, in ordine, ognuna con la `voce` (cosa dice Mizi):
  - `intro` (etichetta, titolo, sottotitolo) — Mizi entra;
  - `telefono` (passo, titolo, testo, schermata, scorri, evidenzia[],
    nota/notaIcona, bollino, entraDaSinistra) — la pagina scorre e un cerchio
    rosa evidenzia gli elementi uno alla volta durante la frase;
  - `due` (schermate[2], scorri[2]) — due telefoni affiancati;
  - `carta` (carta: icona, titolo, sotto, testo, bottone, spunta) — per ciò
    che non si può fotografare (email, controlli, istruzioni del telefono);
  - `finale` (url, sotto, sopra) — SEMPRE l'ultima: schermata viola con Mizi
    e l'indirizzo del sito.
- Nella voce si scrive «giocamizi punto it» (si pronuncia bene); nei
  sottotitoli diventa giocamizi.it.

## Regole

- Parla sempre Mizi, in prima persona, frasi brevi e calde, mai da spot.
- SOLO cose che il sito fa davvero: niente funzioni inventate, niente tempi
  promessi, niente statistiche che i titolari non vedono ancora.
- Solo schermate del NOSTRO sito, dal server di prova, con dati finti.
  Niente siti di altri, volti veri, musica o voci prese dal web.
- Ogni video in 16:9 e 9:16, con il finale viola.
- Dopo il video: verifiche di sempre, pubblicazione, caricamento su Drive e
  YouTube, «01 Catalogo dei video» aggiornato su Drive.

## Trappole note

- Le barre fisse più in basso di 120 px (filtri dei giochi, barretta «Scarica»)
  nello scatto spariscono: raccontarle con una scena `carta`.
- Tutte le schermate di una scheda condividono il localStorage: l'ordine
  conta (es. il profilo salvato vale per le schermate dopo).
- Non compilare (`npm run build`) mentre gira un video: la build sovrascrive
  il sito di prova che si sta fotografando.
