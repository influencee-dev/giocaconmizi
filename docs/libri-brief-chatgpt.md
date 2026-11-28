# Brief per ChatGPT: come preparare un volume della collana Giocamizi

Versione del 22/11/2026. Leggi prima «01 STANDARD GLOBALE» e «03 PROCEDURA LIBRO» in
1 Progetti → 02 Editoria Giocamizi → 00 STANDARD COMUNI.

## Il tuo lavoro finisce con 14 file e una nota

Nella cartella del volume, in «04 Produzione Claude e prestampa / 01 INPUT_APPROVATI», come **file singoli**:

1. `Vnn_COVER_FRONT_ART_APPROVED.png`: il fronte della copertina, a colori.
2. `Vnn_S01_lineart_APPROVED.png` … `Vnn_S12_lineart_APPROVED.png`: le 12 tavole.
3. `Vnn · SCHEDA DATI`: un documento con i campi qui sotto, tutti compilati.

Poi una nota in «0 Bacheca» con questo titolo esatto:
`AAAA-MM-GG HH:MM · ChatGPT · Vnn INPUT COMPLETI`

Da quel momento Claude fa da solo interno, copertina, controlli e consegna. Se manca un file o un campo,
Claude si ferma e risponde in Bacheca con «Vnn FERMO» e l'elenco di quello che manca.

## Regole delle immagini

Tutte: quadrate, senza scritte, lettere, numeri, loghi o firme. Personaggi identici alla tavola dei
personaggi approvata (Mizi pinguina con caschetto marrone, senza fiocco; Tobia capibara; Lilla axolotl;
Nocciola renna col naso marrone). Prima di consegnare, confronta ogni immagine con la tavola dei personaggi.

Fronte della copertina:
- A colori, lato di almeno 1254 px (meglio 2048). Lo porta Claude a 300 dpi.
- **In alto a sinistra** (il terzo alto, per due terzi della larghezza) solo sfondo scuro e calmo:
  lì va il titolo. **In alto a destra** un angolo libero per il logo.
- I personaggi stanno nella metà bassa. Un elemento importante vicino al titolo (una stella, una luna)
  va a destra, sotto il logo, mai in alto a sinistra.
- **In basso al centro-destra** una fascia di terreno chiaro e libero, alta un ottavo dell'immagine: lì va la firma.
- Niente di importante a meno di un ventesimo dal bordo: viene rifilato.

Tavole interne:
- Line art nera su bianco, tratto netto, senza grigi e senza testo. Lato di almeno 2213 px, ideale 2550.
- Dodici scene, una per file, numerate come nella scheda.
- Scene vicine con inquadrature diverse (regola della varietà nello standard globale).

## La scheda dati (copiala e compilala, senza parentesi e senza «da confermare»)

```
CODICE: V02
VOLUME: 2
ANNO: 2027
TITOLO: il titolo esatto
TITOLO IN COPERTINA, RIGA 1: prime parole (massimo 16 lettere)
TITOLO IN COPERTINA, RIGA 2: parole seguenti (massimo 15 lettere)
TITOLO IN COPERTINA, RIGA 3: ultime parole (massimo 15 lettere)
DEDICA, RIGA 1:
DEDICA, RIGA 2:
DEDICA, RIGA 3:
QUARTA, PARAGRAFO 1: (massimo 90 caratteri)
QUARTA, PARAGRAFO 2: (massimo 190 caratteri)
QUARTA, PARAGRAFO 3: Una storia da leggere insieme e da colorare.
SCENA 01: testo approvato, parola per parola (massimo 190 caratteri)
…
SCENA 12:
ATTIVITÀ, DISEGNA: titolo della pagina in cui si disegna (massimo 45 caratteri)
ATTIVITÀ, RACCONTA: una domanda a cui rispondere con tre disegni (massimo 40 caratteri)
ATTIVITÀ, LABIRINTO: titolo del labirinto (massimo 35 caratteri)
PARLIAMONE 1: prima domanda per i grandi
PARLIAMONE 2:
PARLIAMONE 3:
APPROVATO DA GIORGIA IL: data
```

Le tre righe del titolo, lette di seguito, devono dare il titolo esatto. La dedica e la quarta le scrive
o le approva Giorgia: non inventarle.

## Cosa NON devi fare

- PDF, impaginazione, copertina con titolo o logo: li fa Claude.
- ZIP: Claude non riesce ad aprirli. Solo file singoli.
- Lasciare un file approvato solo in chat: se non è su Drive, non esiste.
- Cambiare un testo approvato, o la firma, i crediti, lo stile: sono fissi per tutta la collana.

## Messaggio che Giorgia incolla per far partire un volume

```
Apri su Drive «Giocamizi / 1 Progetti / 02 Editoria Giocamizi · Amazon e Libretti / 00 STANDARD COMUNI»
e leggi «01 STANDARD GLOBALE», «03 PROCEDURA LIBRO» e «04 BRIEF CHATGPT». Lavoriamo al volume V0n.
Segui il brief: soggetto, storyboard, tavola dei personaggi, 12 tavole, fronte della copertina, scheda dati.
Fammi approvare ogni passo. Alla fine salva i 13 file e la scheda in «01 INPUT_APPROVATI» del volume
e lascia in Bacheca la nota «V0n INPUT COMPLETI».
```
