# Instagram: creatore di post e pubblicazione

## Com'è fatto
- `lib/social/post.ts` — i post del giorno, fatti SOLO dai contenuti del sito:
  carosello da un articolo o una guida (copertina, in breve, 4 punti, invito),
  post con la foto di testata di una guida, post di un gioco gratuito.
  Il carosello è l'articolo uscito quel giorno; se non c'è, le guide girano.
- `lib/social/disegna.tsx` — le slide, JPEG 1080×1350 (colori e carattere Nunito del
  sito, Mizi, foto vere delle guide). NON sono pubbliche: nel pannello si vedono
  da `/admin/<codice>/social/anteprima/...` (codice admin); Meta le scarica da
  `/social/<id>/<n>.jpg?f=<firma>`, con una firma calcolata dal token Instagram
  (senza firma: 404).
- `/admin/[codice]/social` — solo nel pannello: Giorgia guarda le slide, ritocca la didascalia e
  preme «Pubblica su Instagram». Un post già pubblicato non parte due volte
  (si riconosce dal link del contenuto nella didascalia).
- `lib/social/instagram.ts` — le API ufficiali di Meta (Instagram API con login Instagram).

## Collegare @giocamizi (una volta sola, lo fa Giorgia)
Le chiavi non passano mai da Claude né dal repo: vanno solo su Vercel.
1. https://developers.facebook.com → «Le mie app» → **Crea app** → caso d'uso
   «Gestisci messaggi e contenuti su Instagram» (tipo Business).
2. Nell'app: **Instagram → Configurazione API con login di Instagram**.
3. «Genera token d'accesso» → **Aggiungi account** → accedi come @giocamizi
   (account professionale) e autorizza. Servono i permessi
   `instagram_business_basic` e `instagram_business_content_publish`.
4. Copia il **token** e l'**ID utente Instagram** (il numero mostrato accanto all'account).
5. Vercel → progetto giocaconmizi → Settings → Environment Variables, ambiente Production:
   - `INSTAGRAM_USER_ID` = l'ID numerico
   - `INSTAGRAM_ACCESS_TOKEN` = il token
6. Redeploy (o aspetta il prossimo push): nel pannello l'avviso giallo sparisce.

L'app può restare in modalità sviluppo: pubblica solo sull'account che l'ha
autorizzata, che è quello che ci serve. Niente revisione di Meta.

## Il token scade dopo 60 giorni
Prima della scadenza si rinnova aprendo, con il token attuale:
`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<TOKEN>`
e mettendo il token nuovo su Vercel al posto del vecchio. Se scade, il pannello
lo dice in chiaro («Il collegamento a Instagram è scaduto») e basta rifare il punto 3.

## Regole dei contenuti
- Testi presi dalle guide (voce di Giorgia già controllata); niente esperienze
  personali aggiunte nelle didascalie.
- Mai foto di bambini veri, mai personaggi protetti o schermate di giochi di terzi.
- Ogni didascalia contiene il link al contenuto (giocamizi.it/...) e «link in bio».
