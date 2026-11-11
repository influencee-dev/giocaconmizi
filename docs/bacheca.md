# La Bacheca: Claude e ChatGPT lavorano in continuità (12/11/2026)

Le routine di Claude e l'attività programmata di ChatGPT non si parlano: si
passano il lavoro su Drive, nel secondo cervello di Giocamizi (cartella
«Giocamizi», id `1Qh2okN0Bj-GDvy4y9m9wGSk9KnBnpPfN`, indice nel doc
«00 LEGGIMI · Giocamizi»).

- **«0 Bacheca»** — id `1wY3hFuwkjp-BwlD8jEsDF-AllPG4XXtG`: un **documento nuovo
  per ogni giro** (i documenti esistenti non si riscrivono: il connettore Drive
  di Claude sa creare, non modificare). Titolo:
  `AAAA-MM-GG HH:MM · <Claude|ChatGPT> · <cosa>` (es. `2026-11-12 09:00 · Claude · Articolo`).
  Testo in tre parti, brevi:
  - **Fatto**: cosa è stato fatto (con link o nomi dei file).
  - **Per chi viene dopo**: cosa resta da fare e a chi tocca.
  - **Problemi**: cosa non ha funzionato (vuoto se niente).
- **«02 Prompt del giorno»** (id `1B5v_f7JpfXiZGnnXyEBBXxzy9ARYtYwe`): i compiti
  di ChatGPT, un documento per giorno.
- **«99 Immagini pronte»** (id `1lUlL1Uj2AspXO2SgFeSU_itN0nu2RQbP`): dove ChatGPT
  consegna le foto, col nome esatto indicato nel prompt.

Ogni giro, **prima di iniziare**, legge le note della Bacheca degli ultimi 2
giorni (le più recenti per prime) e riparte da «Per chi viene dopo».
Mai dati personali nelle note (iscritti, email, contatti): restano fuori da Drive condiviso e dal repo.

## Il giro del giorno (fuso Europe/Rome)

| Ora | Chi | Cosa | Nota in Bacheca |
|---|---|---|---|
| 7:00 | Claude, miglioramento del giorno | importa le foto arrivate, un miglioramento piccolo e finito | `… 07:00 · Claude · Miglioramento` |
| 9:00 | Claude, routine articoli | **per prima cosa** prenota la foto dell'articolo di DOMANI (`npm run articoli:piano -- domani`) e carica il «Prompt del giorno» di domani; poi scrive e pubblica l'articolo di oggi | `… 09:00 · Claude · Articolo` |
| 9:30 | ChatGPT, attività programmata | apre il «Prompt del giorno» più recente, genera le foto, le salva in «99 Immagini pronte» | `… 09:30 · ChatGPT · Foto` |
| 21:00 | Claude, routine della sera | importa le foto di ChatGPT (domani escono già con la foto), rifà con l'API OpenAI quelle mancanti se c'è la chiave, verifica e pubblica | `… 21:00 · Claude · Foto importate` |

Una foto in ritardo non blocca niente: il contenuto esce con Mizi su fondo
pastello e la foto compare quando arriva. Le prenotazioni non arrivate restano
nei prompt dei giorni dopo (lib/foto-del-giorno.ts prende `perIl <= data`).

## Se ChatGPT non riesce a salvare su Drive
L'attività di ChatGPT scrive nella sua nota (o nella chat) quali foto non ha
salvato. Si rimedia in due modi: Giorgia carica a mano i PNG in «99 Immagini
pronte», oppure, con `OPENAI_API_KEY` nell'ambiente cloud «Giocamizi», la
routine delle 21:00 le genera con l'API (`npm run foto:genera`).

## Il testo dell'attività di ChatGPT
È in docs/chatgpt-attivita.md: si incolla in ChatGPT → Attività programmate,
ogni giorno alle 9:30, con il connettore Google Drive collegato e la scrittura consentita.
