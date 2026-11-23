# Il negozio dei PDF da stampare

Scritto il 23/11/2026. Il negozio vende in PDF i libretti della collana di Mizi e i loro disegni da colorare, da
stampare a casa su fogli A4. I giochi del sito restano gratis: il negozio è una cosa a parte.

## In una riga

Il libro approvato (interno quadrato, 32 pagine) passa da `npm run negozio-pdf`, che fa i PDF in A4 e in A5 due per
foglio e li carica nell'archivio privato; il volume si accende nel catalogo; la famiglia paga su Stripe e scarica.

## Cosa si vende, per ogni volume

| Prodotto | Codice | File | Prezzo proposto |
|---|---|---|---|
| Il libretto completo (storia + disegni) | `v01-libretto` | `libretto-A4.pdf` (una pagina per foglio), `libretto-A5.pdf` (doppie pagine, due per foglio) | 1,50 € |
| I 12 disegni da colorare, senza storia | `v01-disegni` | `disegni-A4.pdf`, `disegni-A5.pdf` (due per foglio da tagliare) | 0,99 € |
| Un disegno da solo | `v01-disegno-01` … `-12` | `disegno-NN-A4.pdf` | 0,20 € |

Ordine minimo 0,99 €. I prezzi sono proposte da confermare con Giorgia: si cambiano in `content/negozio/catalogo.json`
(in centesimi, IVA inclusa). Su un ordine da 1 € la commissione di Stripe per le carte europee (1,5% + 0,25 €,
listino standard da ricontrollare sul pannello) si prende circa un quarto: per questo il disegno singolo si vende
solo dentro un ordine minimo, e conviene spingere libretto e pacchetto.

Il disegno quadrato non si deforma: sul foglio A4 resta quadrato, con sopra il titolo e sotto «Colorato da».
I prodotti non si scrivono a mano: nascono dal volume (`lib/negozio/catalogo.ts`). Se nel carrello c'è il pacchetto
o il libretto, i disegni singoli dello stesso volume non si pagano.

## Come funziona

1. **Catalogo** (`content/negozio/catalogo.json` + `lib/negozio/catalogo.ts`): volumi, prezzi, prodotti, regole
   del carrello. Un volume si vende solo con `"in_vendita": true`.
2. **Carrello**: solo nel browser (`localStorage` «giocamizi.carrello», solo codici). Il server ricontrolla tutto:
   codici, prezzi, ordine minimo (`app/api/negozio/checkout`).
3. **Pagamento**: la pagina di Stripe (Checkout). Prima di pagare la persona spunta la richiesta di consegna
   immediata con la presa d'atto della perdita del recesso (Codice del consumo, art. 59 lett. o); l'ora della spunta
   va nei metadati della sessione, la conferma nell'email.
4. **Ordini**: stanno in Stripe e basta, nessuna tabella nostra. I codici dei prodotti viaggiano nei metadati della
   sessione (`prodotti_1`, `prodotti_2`…), scritti dal server.
5. **Consegna**: Stripe rimanda a `/negozio/grazie?sessione=cs_…`, che rilegge la sessione e mostra i link. Ogni link
   (`/api/negozio/scarica`) ricontrolla il pagamento e rimanda a un link firmato dell'archivio privato che vale due
   minuti. I link funzionano per 365 giorni.
6. **Email** (`app/api/negozio/webhook`): quando Stripe conferma il pagamento, l'email con il link a chi ha comprato e
   un avviso «Nuova vendita» a Giorgia. Una volta sola: il segno «email_inviata» sta nei metadati del pagamento.
7. **File**: contenitore privato «negozio» di Supabase Storage; anteprime piccole nel contenitore pubblico
   «negozio-anteprime». PDF e immagini dei libri non entrano mai nel repo (è pubblico).

## L'interruttore

`NEGOZIO_APERTO` in `lib/negozio/catalogo.ts`. Finché è `false`:
- le pagine sono `noindex`, fuori dalla sitemap e nessuna pagina del sito le collega (lo controlla la batteria
  `scripts/verifica/negozio.mjs`);
- si paga solo con una chiave Stripe di prova (`sk_test_…`): in prova si vedono anche i volumi non ancora in vendita;
- le voci del carrello e di Stripe non compaiono nella privacy policy (si accendono da sole con il negozio).

## Preparare i PDF di un volume

Quando Giorgia ha approvato l'interno del libro (stato APPROVATO in `docs/libri-kdp.md`):

```
npm run negozio-pdf -- --interno /tmp/libri/v01/out/V01_interno_32p.pdf --codice v01 \
  --titolo "Mizi e la stella che non voleva accendersi"
```

Fa tutto in `/tmp/negozio/v01`: libretto A4 e A5, disegni A4 e A5, i dodici disegni singoli, le anteprime e
`report.txt`. Si ferma se l'interno non ha 32 pagine, se manca una tavola o se non è quadrata; segnala le tavole
sotto i 300 dpi in A4. Guardare a occhio almeno la prima pagina di ogni PDF, poi rilanciare con `--carica`
(serve `SUPABASE_SERVICE_ROLE_KEY` nell'ambiente) per mettere i file negli archivi. Infine `"in_vendita": true`
nel catalogo, con le verifiche di sempre.

Provato il 23/11/2026 sull'interno del Volume 1 (bozza REVIEW v05): 17 PDF tra 114 KB e 2,8 MB, tavole a 348 dpi
in A4 e 504 dpi in A5.

## Cosa serve per aprire (lato Giorgia)

1. **Stripe vero per Partidea SRL**: oggi c'è solo l'account di prova «Sandbox di lavoro». Attivare l'account con i
   dati della società e l'IBAN, poi su Vercel `STRIPE_SECRET_KEY` (chiave segreta live, o meglio una chiave con
   restrizioni: scrittura su Checkout Sessions e PaymentIntents).
2. **Webhook**: nel pannello Stripe → Sviluppatori → Webhook, endpoint `https://giocamizi.it/api/negozio/webhook`,
   eventi `checkout.session.completed` e `checkout.session.async_payment_succeeded`; il segreto su Vercel come
   `STRIPE_WEBHOOK_SECRET`.
3. **Supabase**: incollare `supabase/negozio.sql` nel SQL Editor; mettere su Vercel `SUPABASE_SERVICE_ROLE_KEY`
   (solo server, mai `NEXT_PUBLIC_`).
4. **Commercialista**: IVA dei PDF venduti a privati (aliquota, corrispettivi o fatture, eventuale OSS per chi
   compra da altri Paesi UE) e rilettura delle condizioni di vendita (`/negozio/condizioni`, oggi bozza).
5. **Prezzi**: confermare o cambiare quelli in `content/negozio/catalogo.json`.
6. **Libro approvato** e PDF caricati (sopra), `"in_vendita": true`.
7. **Accensione**: `NEGOZIO_APERTO = true`, data nuova in `AGGIORNATA` (lib/contenuti/legal.ts, perché la privacy
   policy cambia), le pagine del negozio in `app/sitemap.ts`, un collegamento dal sito dove lo vuole Giorgia.

## Provarlo in prova

Con una chiave `sk_test_` in `.env.local` (o sull'anteprima di Vercel) il negozio mostra il Volume 1 e fa pagare con
le carte finte di Stripe (4242 4242 4242 4242, data futura, CVC qualsiasi). Per le email in locale:
`stripe listen --forward-to localhost:3000/api/negozio/webhook` e il segreto che stampa in `STRIPE_WEBHOOK_SECRET`.
