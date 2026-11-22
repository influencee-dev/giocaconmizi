# Libri Giocamizi per Amazon KDP: come si fa un volume

Versione 2 del 22/11/2026, dopo il Volume 1 («Mizi e la stella che non voleva accendersi»).
Copia su Drive: 1 Progetti → 02 Editoria Giocamizi → 00 STANDARD COMUNI, «03 PROCEDURA LIBRO».
Il master delle storie è in `docs/libri-master-storia.md` (su Drive «05 MASTER STORIA»): è il primo passo di ogni volume.
Il brief per ChatGPT è in `docs/libri-brief-chatgpt.md` (su Drive «04 BRIEF CHATGPT»).

## In una riga

ChatGPT mette su Drive 13 immagini e una scheda, lascia in Bacheca la nota «Vnn INPUT COMPLETI»;
Claude lancia `npm run libro -- vnn` e consegna interno, copertina e report; Giorgia approva e carica su Amazon.

## Gli stati di un volume

| Stato | Chi lo scrive | Vuol dire |
|---|---|---|
| BOZZA | ChatGPT | storia, tavole o fronte ancora in lavorazione |
| INPUT COMPLETI | ChatGPT, con una nota in Bacheca | i 13 file e la scheda sono in «01 INPUT_APPROVATI», approvati da Giorgia |
| REVIEW | Claude, dopo `npm run libro` senza problemi | i due PDF sono in «03 BOZZE_REVIEW» con il report |
| APPROVATO | Giorgia | ha guardato i due PDF e ha detto sì |
| PRINT_READY | Giorgia | ha visto l'anteprima KDP e la copia di prova |

Uno stato non si deduce: sta scritto nel titolo dell'ultima nota di Bacheca su quel volume.

## Cosa resta a Giorgia (e non si può automatizzare)

1. Approvare con ChatGPT: storia, tavola dei personaggi, 12 tavole, fronte della copertina, scheda dati.
2. Guardare i due PDF che Claude consegna.
3. Caricare i due PDF su KDP, scegliere l'ISBN, guardare l'anteprima, ordinare la copia di prova.

## Cosa fa ChatGPT

Vedi `docs/libri-brief-chatgpt.md`. In breve: 13 immagini quadrate come file singoli, una scheda dati
compilata, una nota in Bacheca. Niente PDF, niente scritte nelle immagini, niente ZIP.

## Cosa fa Claude, passo per passo

Parte quando in «0 Bacheca» c'è una nota «… · ChatGPT · Vnn INPUT COMPLETI» senza una nota successiva
di Claude su quel volume. La routine delle 7:00 la legge ogni giorno: nessuno deve chiamare Claude.

1. Legge lo standard globale e la cartella del volume su Drive.
2. Scarica in `/tmp/libri/vnn/in/` il fronte e le 12 tavole da «01 INPUT_APPROVATI» (file singoli, sotto i 10 MB).
3. Copia `content/libri/_modello.json` in `content/libri/vnn.json` e lo riempie con la «Vnn · SCHEDA DATI»
   di Drive, parola per parola. Non corregge e non completa: se un campo manca o è dubbio, si ferma.
4. `npm run libro -- vnn`. Il comando prepara da solo caratteri e strumenti, ingrandisce quello che è
   troppo piccolo, costruisce interno e copertina, fa i controlli e scrive il report.
5. Se il comando si ferma o il report ha «PROBLEMI»: nota in Bacheca «… · Claude · Vnn FERMO» con
   l'elenco esatto, e basta. Non si aggira un controllo.
6. Se passa: guarda `Vnn_interno_provino.png` e `Vnn_copertina_anteprima_guide.jpg`. Controlli a occhio:
   il titolo non copre il soggetto, la firma si legge, i testi non escono dalla cornice, le tavole sono
   nell'ordine giusto, il fronte ingrandito è uguale all'originale (occhi, becco, mani).
7. Carica in «03 BOZZE_REVIEW» i due PDF e l'anteprima, in «05 PREFLIGHT_E_PROVE» il report e l'anteprima
   con le guide, in «02 SORGENTI_COPERTINA» il fronte derivato (se sta sotto i 3 MB in JPEG).
8. Commit della scheda sul ramo di lavoro (con le verifiche di sempre), nota in Bacheca
   «… · Claude · Vnn REVIEW» con i link, e i due PDF a Giorgia.

## Il comando

```
npm run libro -- v02                      # cartella di lavoro predefinita /tmp/libri/v02
npm run libro -- v02 --lavoro <cartella>
```

- Ingresso: `content/libri/v02.json` (la scheda), `content/libri/_collana.json` (firma, crediti, storia,
  formato: uguali per tutti i volumi), e in `<lavoro>/in/` un'immagine col nome che contiene `COVER` o
  `fronte` e dodici immagini coi nomi che contengono `S01` … `S12`.
- Uscita in `<lavoro>/out/`: `Vnn_interno_32p.pdf`, `Vnn_copertina_wrap.pdf`, due anteprime della
  copertina, il provino delle 32 pagine, il fronte derivato se è stato ingrandito, `Vnn_report.txt`.
- Si ferma da solo, dicendo perché, se: manca la scheda o un suo campo; le scene non sono 12; il titolo a
  righe non ricompone il titolo; c'è un dato non definitivo (`[`, `SEGNAPOSTO`, `DA CONFERMARE`, `...`);
  manca un'immagine; un'immagine non è quadrata.
- Controlli nel report: 32 pagine, formato, caratteri incorporati, nessun segnaposto, testi identici alla
  scheda, tavole ≥ 300 dpi, misure della copertina e del dorso, fronte ≥ 300 dpi, peso dei file,
  testo di quarta che non arriva sulla foto.
- PDF e immagini dei libri non entrano nel repo (è pubblico): restano nella cartella di lavoro e su Drive.

## Il libro tipo

Copertina morbida, 8,5 × 8,5 pollici, 32 pagine, interno in bianco e nero su carta bianca senza abbondanza,
copertina a colori lucida. Pagine: 1 frontespizio, 2 dedica e crediti, 3 «Questo libro è di»,
4–27 dodici coppie testo + tavola, 28 disegna, 29 racconta, 30 labirinto (diverso per ogni volume),
31 «Parliamone», 32 colophon. Dorso: pagine × 0,002252 pollici, senza testo.

## Stile fisso (decisioni di Giorgia del 22/11/2026)

- Titolo in copertina: maiuscolo, lettere piene come ritagliate a mano (Londrina Solid Black, licenza OFL).
  Prima riga gialla, le altre crema. Niente caratteri «da fumetto».
- Testi e firme in copertina: Roboto. Interno: Poppins.
- Firma sul fronte, sempre: «Un libro di Giorgia Palazzo e Domiziana Bonaccorso».
- Quarta: logo, testo di quarta, in basso a sinistra la foto vera di Giorgia e Domiziana in un tondo con
  «La nostra storia» (frasi di Giorgia dalla pagina Chi siamo, mai inventate), a destra il codice a barre.
- Logo: l'originale orizzontale con la trasparenza (`scripts/libri/risorse/`). Non si scontorna e non si
  rigenera. Per l'interno si converte in scala di grigi.
- Pagina 2: dedica piccola in corsivo al centro, crediti in basso.
- Mizi: pinguina, caschetto marrone, niente fiocco. Tobia capibara, Lilla axolotl, Nocciola renna (naso marrone).

Cambiare lo stile = cambiare `content/libri/_collana.json` o `scripts/libri/libro.py`, e scriverlo qui.

## Limiti tecnici

- Connettore Drive: si scarica fino a 10 MB per file, si carica fino a circa 3 MB per file. Il comando
  tiene i PDF sotto i 3 MB e lo scrive nel report. Mai uno ZIP come unico contenitore.
- I documenti Google non si modificano dal connettore: versione nuova con la data, la vecchia «zz_SUPERATO — ».
- Il sito KDP non è raggiungibile dalle sessioni: le misure vengono dalla formula pubblica. L'anteprima KDP
  e la copia di prova sono il controllo vero, e le fa Giorgia.
- Niente servizi esterni per le immagini: l'ingrandimento è locale (Real-ESRGAN, modello per illustrazioni).
- Generare immagini con l'API OpenAI si può solo dall'ambiente cloud «Giocamizi». Il comando del libro non
  ne ha bisogno e gira in qualsiasi ambiente.

## I disguidi del Volume 1 e come sono chiusi

| Cosa è successo | Come è chiuso |
|---|---|
| Due impostazioni nate in due chat | Una sola fonte («02 Editoria Giocamizi») e questa procedura in CLAUDE.md |
| Il fronte approvato stava solo in chat | Il comando legge solo dalla cartella di lavoro, riempita da Drive |
| Fronte a 1254 px | Il comando ingrandisce da solo e lo segnala come derivato |
| Interno chiuso in uno ZIP da 14 MB | File singoli; il comando controlla il peso |
| Segnaposto rimasti nell'interno | La scheda con un dato non definitivo ferma il comando; il PDF viene ricontrollato |
| Dati editoriali chiesti uno alla volta | Una scheda sola, compilata prima di cominciare |
| Personaggi cambiati tra le immagini | Brief per ChatGPT: tavola dei personaggi prima, confronto a ogni tavola. Claude guarda il provino |
| Carattere del titolo rifiutato | Stile fisso nel codice |
| Logo con riquadro scuro | Logo originale con trasparenza nel repo |
| Titolo sopra il soggetto | Brief: zona alta libera. Il titolo si adatta allo spazio; controllo a occhio sull'anteprima |
| Nessuno sapeva a che punto fosse il volume | Stati scritti nei titoli delle note di Bacheca |

## Provato

Il 22/11/2026 il comando ha rifatto il Volume 1 da zero (scheda `content/libri/v01.json`, 12 tavole e
fronte originali) in circa 3 minuti, con tutti i controlli passati. Provati anche i tre arresti: scheda
mancante, immagini mancanti, dato non definitivo. Il PDF del Volume 1 già consegnato a Giorgia (v05) resta
quello valido finché lei non sceglie il rifatto.
