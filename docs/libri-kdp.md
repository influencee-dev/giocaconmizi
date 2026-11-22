# Libri Giocamizi per Amazon KDP: come si fa un volume

Scritto il 22/11/2026 dopo il Volume 1 («Mizi e la stella che non voleva accendersi»).
Vale per tutti i volumi. Copia su Drive: 1 Progetti → 02 Editoria Giocamizi → 00 STANDARD COMUNI,
«03 PROCEDURA LIBRO». Se le due copie divergono, vale la più recente (data nel titolo).

## Chi fa cosa

- **Giorgia** approva: storia, tavola dei personaggi, tavole, fronte della copertina, testi di quarta, PDF finali.
- **ChatGPT** fa: soggetto, storyboard, illustrazioni (line art in bianco e nero per l'interno, fronte a colori
  senza scritte per la copertina). Salva ogni file approvato su Drive, nella cartella del volume.
- **Claude** fa: ingrandimento del fronte, copertina completa, interno, controlli, pacchetto, note in Bacheca.

## Il libro tipo

Copertina morbida, 8,5 × 8,5 pollici, 32 pagine, interno in bianco e nero su carta bianca senza abbondanza,
copertina a colori lucida. Pagine: 1 frontespizio, 2 dedica e crediti, 3 «Questo libro è di»,
4–27 dodici coppie testo + tavola, 28–30 attività, 31 «Parliamone», 32 colophon.

## Stile fisso (decisioni di Giorgia del 22/11/2026)

- Titolo in copertina: maiuscolo, lettere piene come ritagliate a mano (Londrina Solid Black, licenza OFL).
  Prima riga gialla, le altre crema, senza bordo. Niente caratteri «da fumetto».
- Testi e firme in copertina: Roboto. Interno: Poppins.
- Firma sul fronte, sempre: «Un libro di Giorgia Palazzo e Domiziana Bonaccorso».
- Quarta: logo, testo di quarta, in basso a sinistra la foto vera di Giorgia e Domiziana
  (`public/immagini/giorgia-e-domiziana-giocamizi.webp`) in un tondo con «La nostra storia»
  (frasi di Giorgia dalla pagina Chi siamo, mai inventate), in basso a destra il riquadro del codice a barre.
- Logo: il PNG orizzontale originale ha già la trasparenza. Si usa com'è, non si scontorna e non si rigenera.
  Per l'interno si converte in scala di grigi.
- Pagina 2: dedica piccola in corsivo al centro, crediti in basso. I crediti sono quelli dello standard globale.
- Mizi: pinguina, caschetto marrone, niente fiocco. Tobia capibara, Lilla axolotl, Nocciola renna (naso marrone).

## Cosa deve esserci su Drive prima che Claude cominci

Nella cartella del volume, «01 INPUT_APPROVATI», come **file singoli** (mai solo dentro uno ZIP):

1. `Vnn_COVER_FRONT_ART_…png`: fronte a colori senza scritte, approvato.
2. Le 12 tavole line art approvate, 2550 px di lato.
3. Il testo delle 12 scene, approvato.
4. Una scheda con: titolo esatto, dedica, testo di quarta, anno, scelta ISBN, attività delle pagine 28–30.

Un file che esiste solo in una chat non esiste. Se manca qualcosa Claude si ferma e lo scrive in Bacheca.

## Passi di Claude

```
scripts/libri/prepara.sh <cartella di lavoro>      # caratteri, modello, strumenti (fuori dal repo)
cd <cartella di lavoro>                            # in/ fronte.png, logo.png, foto, interno di partenza
python3 ingrandisci.py in/fronte.png in/fronte_2625_esrgan.png 2625
python3 copertina.py                               # quarta + dorso + prima, PDF e anteprime in out/
python3 interno.py                                 # interno a 32 pagine in out/
```

- `ingrandisci.py`: Real-ESRGAN 4× in locale (modello per illustrazioni), poi riduzione a 2625 px = 300 dpi.
  Il risultato è un **derivato** del fronte approvato: si guarda da vicino (occhi, becco, stella) accanto
  all'originale prima di usarlo, e si salva in «02 SORGENTI_COPERTINA» con «DERIVATO» nel nome.
- `copertina.py`: titolo, firma, testo di quarta e storia stanno in cima al file. Il dorso si calcola da solo:
  pagine × 0,002252 pollici (carta bianca, bianco e nero). Abbondanza 0,125 pollici, testi ad almeno 0,25 dal rifilo.
- `interno.py`: oggi parte dall'interno v02 del Volume 1 e ne sostituisce le pagine 1, 2, 30 e 32.
  Per un volume nuovo va adattato (vedi «Cosa manca per automatizzare»).

## Controlli prima di consegnare

- Interno: 32 pagine, 612 × 612 punti, caratteri tutti incorporati (`pdffonts`), immagini ≥ 300 dpi
  (`pdfimages -list`), nessuna stringa `[`, `SEGNAPOSTO`, `DA CONFERMARE` (`pdftotext | grep`).
- Copertina: 17,322 × 8,75 pollici per 32 pagine, anteprima con le guide guardata a occhio
  (titolo che non copre il soggetto, niente testo sul dorso, riquadro del codice a barre libero).
- Su KDP si caricano **due PDF separati**. Lo ZIP è solo archivio.
- Stato: REVIEW finché Giorgia non ha visto anteprima KDP e copia di prova. Solo dopo, PRINT_READY.

## Limiti tecnici da ricordare

- Connettore Drive: si scarica fino a 10 MB per file, si carica fino a circa 3 MB per file.
  Quindi PDF sotto i 3 MB (JPEG a qualità 90, loghi ridotti) e niente ZIP come unico contenitore.
- I documenti Google non si modificano dal connettore: si crea la versione nuova con la data.
- La chiave OpenAI è solo nell'ambiente cloud «Giocamizi». Una sessione partita in un altro ambiente non
  può generare immagini: le sessioni dei libri si aprono in «Giocamizi».
- Il sito KDP non è raggiungibile dalle sessioni: le misure vengono dalla formula pubblica.
  Il template ufficiale lo scarica Giorgia dal calcolatore, una volta per formato.
- Niente servizi esterni di ingrandimento: le immagini non si mandano fuori.

## I disguidi del Volume 1 e la regola che ne esce

| Cosa è successo | Regola |
|---|---|
| Due impostazioni nate in due chat (libretti a colori per il sito, collana da colorare per Amazon) | I libri hanno una sola fonte: «02 Editoria Giocamizi». Chi apre una chat nuova legge prima lo standard globale e questa procedura. |
| Il fronte approvato stava solo in chat | Vale solo ciò che è su Drive in «01 INPUT_APPROVATI». |
| Il fronte era a 1254 px (143 dpi) | Si ingrandisce sempre con `ingrandisci.py` e lo si dichiara derivato. |
| L'interno aggiornato era chiuso in uno ZIP da 14 MB | File singoli, ognuno sotto i 3 MB. |
| Segnaposto «da confermare» rimasti nell'interno | Tutti i dati editoriali si chiedono una volta, all'inizio, in una scheda sola. |
| Personaggi cambiati tra le immagini (Mizi gatta, fiocco, capelli blu, Tobia ippopotamo) | Tavola dei personaggi approvata prima delle tavole; ogni immagine si confronta con quella. |
| Carattere del titolo rifiutato | Lo stile è fisso (sopra) e non si ridiscute a ogni volume. |
| Logo con riquadro scuro nella prima bozza | Il PNG originale ha la trasparenza: si usa quello. |
| Immagini non generabili dalla sessione | Sessioni dei libri nell'ambiente «Giocamizi». |

## Cosa manca per automatizzare davvero

Oggi i tre script producono il Volume 1 e hanno i testi dentro. Per fare un volume con un solo comando servono:

1. Una scheda per volume (`content/libri/<volume>.json`: titolo, righe del titolo, dedica, quarta, storia,
   pagine, attività, nomi dei file) letta dagli script al posto dei testi scritti dentro.
2. `interno.py` che costruisce le 32 pagine da zero (cornice, testi, tavole), invece di partire dal PDF del Volume 1.
3. Un comando unico (`npm run libro -- <volume>`) che fa ingrandimento, copertina, interno, controlli e
   scrive il report; si ferma con un elenco se manca un file.
4. Lo scarico degli input da Drive e il carico dei risultati, con la nota in Bacheca.

Con questi quattro pezzi a Giorgia restano tre approvazioni per volume: storia, tavole, PDF finale.
