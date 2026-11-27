# AI a pagamento: ricerca per le mamme e compilazione per le attività

Piano del 27/11/2026. Le decisioni di Giorgia sono di oggi.

## Le decisioni

| | Mamme | Attività |
|---|---|---|
| Cosa fa l'AI | ricerca in linguaggio naturale su tutto il sito: schede, giochi, guide, storie («festa per 15 bambini a Milano con animatore, sabato») | compila la scheda dai link dell'attività (sito, post), come l'importazione del pannello |
| Contributo | **10 € all'anno**, IVA inclusa | **2 € una volta per scheda**, IVA inclusa |
| Rinnovo | **nessun rinnovo automatico**: vale 12 mesi e un mese prima della scadenza arriva un promemoria | — |
| Prova | **3 ricerche gratis** per ogni mamma registrata | — |
| Senza pagare | la ricerca normale del sito resta gratis | la compilazione a mano resta gratis |
| Pagamento | Stripe Checkout: carta, Apple Pay, Google Pay e **PayPal**, attivato dentro Stripe | uguale |

Si chiama «contributo», mai «donazione»: Partidea SRL vende un servizio, quindi
c'è l'IVA e Stripe manda la ricevuta. Sulla fatturazione elettronica e sui
corrispettivi decide la commercialista di Giorgia. Il codice parte in modalità
prova finché non c'è il suo ok.

## Come è fatto

1. **Database** (supabase/ai-pagamenti.sql, lo esegue Claude con il token):
   - `ai_accessi`: per ogni utente, la data di scadenza dei 12 mesi e le ricerche gratis usate;
   - `ai_pagamenti`: ogni pagamento Stripe (sessione, tipo, importo, stato), senza dati della carta;
   - `ai_crediti_scheda`: una compilazione pagata per la chiave della scheda.
   Si accede solo con funzioni RPC; il webhook scrive con la chiave di servizio, solo dal server.
2. **Stripe**: Checkout con prezzo fisso (10 € e 2 €). Il webhook `/api/stripe/webhook`
   controlla la firma e solo allora apre l'accesso. Niente dati di pagamento sul sito.
3. **Ricerca delle mamme** (`/cerca`): la mamma accede (l'area genitori esiste già),
   scrive la domanda e il server prende dal sito le schede e le pagine che c'entrano.
   Gemini risponde **solo** con quello che il sito contiene, con i link alle pagine,
   e dice «non lo so» quando il sito non lo dice. Tetto per evitare abusi: 50
   ricerche al giorno a persona (costo vero: circa 0,2 centesimi a ricerca).
4. **Compilazione delle attività**: in `/la-tua-scheda/<codice>` il bottone
   «Compila con l'AI (2 €)». Dopo il pagamento si incollano i link, si controlla
   la proposta campo per campo e si invia: decide Giorgia, come oggi.
5. **Testi legali**: pagina «Condizioni del contributo» (cosa si paga, durata,
   recesso per i contenuti digitali con il consenso esplicito), informativa
   privacy e cookie (Stripe tra i fornitori), registro in lib/contenuti/legal.ts.

## Cosa serve da Giorgia

1. La **chiave segreta di Stripe** di Partidea, in due posti: su Vercel come
   `STRIPE_SECRET_KEY` e nel modulo sicuro di Claude, che la usa per creare
   prodotti, prezzi e webhook.
2. In Stripe → Impostazioni → Metodi di pagamento: **PayPal attivato**.
3. L'ok della commercialista prima di passare dalla modalità prova a quella reale.

## Ordine dei lotti

1. Database, Stripe e webhook, con tutto il giro provato in modalità prova.
2. Ricerca AI per le mamme, con le 3 gratis, il contributo e il promemoria di scadenza.
3. Compilazione AI per le attività, a 2 €.
4. Testi legali, poi passaggio in modalità reale con l'ok di Giorgia.
