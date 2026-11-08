# Foto preparate la sera prima

ChatGPT ci mette ore a produrre le immagini: se il prompt nasce la mattina,
le foto arrivano quando il contenuto è già uscito. Quindi i prompt si
scrivono **la sera prima**, per tutto Giocamizi, in un solo documento.

## Il giro

| Quando | Chi | Cosa |
|---|---|---|
| durante il giorno | chiunque prepari contenuti (routine, chat) | prenota le foto che gli serviranno **domani o dopo**: `npm run foto:prenota` |
| 21:00 | routine Claude «Giocamizi · Prompt della sera» | sceglie l'articolo di domani e ne prenota la foto, genera `npm run prompt-del-giorno -- --data <domani>`, lo carica su Drive |
| 6:00 | routine ChatGPT di Giorgia | legge l'ultimo documento in «02 Prompt del giorno», genera le foto, le salva in «99 Immagini pronte» con il nome indicato |
| 9:00 | routine Claude articoli | scarica le foto arrivate, `npm run foto-arrivate`, poi scrive e pubblica l'articolo già con la foto |
| 7:00 e ogni altra sessione | chi lavora | anche lui importa le foto arrivate prima di iniziare (il comando salta quelle già sul sito) |

Una foto in ritardo **non blocca** niente: il contenuto esce lo stesso e la
foto compare da sola quando arriva (le pagine la cercano in public/immagini).

## Cartelle Drive («Giocamizi · Prompt immagini»)
- «02 Prompt del giorno» — id `1B5v_f7JpfXiZGnnXyEBBXxzy9ARYtYwe`: un documento
  per giorno, titolo «Prompt del giorno · GG/MM/AAAA» (il giorno in cui servono le foto).
- «99 Immagini pronte» — id `1lUlL1Uj2AspXO2SgFeSU_itN0nu2RQbP`: i PNG di ChatGPT,
  col nome esatto del prompt (es. `guida-minecraft-vs-roblox.png`).
- «01 Mizi pupazzo (riferimento)»: la foto di riferimento di Mizi da allegare.

## Prenotare una foto
```
npm run foto:prenota -- --file guida-<slug> --per 2026-11-09 \
  --titolo "Foto dell'articolo «…»" --scena "…" --alt "…" --rapporto 16:9 --chi "routine articoli"
```
- Le guide e gli articoli usano sempre `guida-<slug>` e 16:9.
- Altri contenuti: un nome libero (minuscole e trattini) e il rapporto del riquadro.
- La scena: persone generate (mai Giorgia, Domiziana o persone reali), Mizi
  come pupazzo, niente loghi, schermate di videogiochi, personaggi protetti,
  scritte leggibili. Regole complete in scripts/blocchi-prompt.ts.
- Senza argomenti, `npm run foto:prenota` elenca le foto prenotate non ancora arrivate.

## Gli articoli
La sera la routine fissa l'articolo di domani: `npm run articoli:piano -- prossimo`,
sceglie lo slug definitivo (`npm run articoli:piano -- segna <id> da-fare --slug <slug>`)
e prenota `guida-<slug>` per domani. La mattina la routine articoli usa **quello
slug** e **quella scena** (stessi `foto.scena` e `foto.alt` nel frontmatter):
il file arrivato si aggancia da solo alla pagina.

## Importare le foto arrivate
1. Elenca i file in «99 Immagini pronte» (connettore Google Drive) e scarica
   quelli che non sono ancora in public/immagini in una cartella temporanea.
2. `npm run foto-arrivate -- <cartella>`: le foto riconosciute (guide, riquadri
   del sito, prenotazioni) diventano WebP; le «SCONOSCIUTE» si guardano a mano.
3. Commit dei WebP insieme al contenuto del giorno.
