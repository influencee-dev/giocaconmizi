# Foto preparate la sera prima

Le foto si preparano **il giorno prima**, così il contenuto del giorno dopo esce
già con la foto. Dal 12/11/2026 le genera l'attività programmata di ChatGPT
delle 9:30 (nel cloud, anche a computer spento) dal documento «Prompt del
giorno» che la routine delle 9:00 carica su Drive; la sera alle 21:00 Claude le
importa. L'API di OpenAI (`npm run foto:genera`) resta la riserva automatica.

## Il giro (dal 12/11/2026: con ChatGPT e la Bacheca, docs/bacheca.md)

| Quando | Chi | Cosa |
|---|---|---|
| durante il giorno | chiunque prepari contenuti (routine, chat) | prenota le foto che gli serviranno **domani o dopo**: `npm run foto:prenota` |
| 9:00, subito | routine Claude articoli | prenota la foto dell'articolo di DOMANI (`npm run articoli:piano -- domani`) e carica su Drive il «Prompt del giorno» di domani |
| 9:30 | attività programmata di ChatGPT | genera le foto del «Prompt del giorno» più recente e le salva in «99 Immagini pronte» (docs/chatgpt-attivita.md) |
| 21:00 | routine Claude «Foto della sera» | importa le foto di ChatGPT; le mancanti le genera con l'API (`npm run foto:genera`, solo con la chiave); verifica e pubblica: domani i contenuti escono con la foto |
| 7:00 e ogni altra sessione | chi lavora | importa le foto arrivate prima di iniziare (il comando salta quelle già sul sito) |

Ogni giro lascia una nota in Drive «Giocamizi / 0 Bacheca» e legge quelle
degli ultimi 2 giorni prima di iniziare.

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
