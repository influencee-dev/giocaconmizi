# Foto preparate la sera prima

Le foto si preparano **la sera prima**, così il contenuto del giorno dopo esce
già con la foto. Dall'11/11/2026 le genera la routine serale di Claude con
l'API immagini di OpenAI, nel cloud: funziona anche a computer spento (la
routine Codex/ChatGPT delle 6:00 non serve più). Il documento dei prompt su
Drive resta come riserva per rifare a mano una foto.

## Il giro

| Quando | Chi | Cosa |
|---|---|---|
| durante il giorno | chiunque prepari contenuti (routine, chat) | prenota le foto che gli serviranno **domani o dopo**: `npm run foto:prenota` |
| 21:00 | routine Claude «Giocamizi · Foto della sera» | sceglie l'articolo di domani e ne prenota la foto; `npm run foto:genera -- --data <domani>` genera le foto con l'API e le mette in public/immagini; carica su Drive il documento dei prompt (riserva); verifica e pubblica |
| 9:00 | routine Claude articoli | importa eventuali foto caricate a mano in «99 Immagini pronte», poi scrive e pubblica l'articolo, che trova già la sua foto |
| 7:00 e ogni altra sessione | chi lavora | importa le foto caricate a mano prima di iniziare (il comando salta quelle già sul sito) |

## Generazione con l'API (scripts/foto-genera.ts)
- Stesse foto e stessi prompt del documento su Drive (`lib/foto-del-giorno.ts`):
  tutte le prenotazioni del giorno, poi fino a 2 foto che mancano al sito.
- Riferimento di Mizi: `public/mizi/mizi-intera.webp`.
- Chiave `OPENAI_API_KEY` SOLO nelle variabili d'ambiente dell'ambiente cloud
  «Giocamizi» (claude.ai/code → ingranaggio dell'ambiente). Facoltative:
  `OPENAI_IMAGE_MODEL` (predefinito gpt-image-2), `OPENAI_IMAGE_QUALITY` (high).
- Senza chiave esce con codice 2 e non tocca niente: resta il documento su Drive.
- Una foto rifiutata o in errore viene saltata e segnalata nel report: si
  rifà a mano dal documento su Drive, oppure si cambia la scena e si riprova.
- `--prova` mostra cosa genererebbe, senza chiamare l'API.
- Le foto si guardano prima di pubblicarle: il report elenca i file, e la
  routine controlla che non ci siano scritte, loghi o persone reali.

Una foto in ritardo **non blocca** niente: il contenuto esce lo stesso e la
foto compare da sola quando arriva (le pagine la cercano in public/immagini).

## Cartelle Drive («Giocamizi · Prompt immagini»)
- «02 Prompt del giorno» — id `1B5v_f7JpfXiZGnnXyEBBXxzy9ARYtYwe`: un documento
  per giorno, titolo «Prompt del giorno · GG/MM/AAAA» (il giorno in cui servono le foto).
- «99 Immagini pronte» — id `1lUlL1Uj2AspXO2SgFeSU_itN0nu2RQbP`: i PNG di ChatGPT,
  col nome esatto del prompt: un nome NEUTRO tipo `foto-3fa91c2e.png` (niente marchi
  o nomi di giochi, che il generatore rifiuta: lib/foto-in-arrivo.ts → nomeConsegna).
  `foto-arrivate` lo riconduce da solo al nome vero (es. guida-minecraft-vs-roblox).
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
1. Elenca i file in «99 Immagini pronte» (connettore Google Drive) creati negli
   ultimi 2 giorni e scaricali in una cartella temporanea (i nomi neutri
   foto-xxxxxxxx non dicono se la foto è già sul sito: ci pensa il passo 2,
   che salta quelle già presenti).
2. `npm run foto-arrivate -- <cartella>`: le foto riconosciute (guide, riquadri
   del sito, prenotazioni) diventano WebP; le «SCONOSCIUTE» si guardano a mano.
3. Commit dei WebP insieme al contenuto del giorno.
