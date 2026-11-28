# Migrazioni del database

Dal 28/11/2026 ogni modifica al database è un file numerato qui, applicato una
volta sola e mai riscritto dopo. Prima si incollavano a mano i file per
argomento di `supabase/` nel SQL Editor; quei file restano dove sono, come
descrizione leggibile di ogni area.

## Rifare il database da zero (stesso stato della produzione)

1. `migrazioni/0001_schema_iniziale.sql` (account, bambini, progressi)
2. i file per argomento, in quest'ordine: `directory.sql`, `candidature.sql`,
   `backoffice.sql`, `risorse-reclamo.sql`, `scheda-dati.sql`, `ai-pagamenti.sql`
3. `migrazioni/0002_…`, `0003_…` e le successive, in ordine di numero

I file al punto 2 contengono anche dei `grant … to anon`: la 0002 li richiude,
quindi va sempre applicata dopo.

## Regole

- Un file = una modifica, con il numero dopo l'ultimo e cosa cambia in testa.
- Si può rilanciare senza danni: `create … if not exists`, `create or replace`.
- Mai `drop table` né cancellazione di dati senza il sì di Giorgia scritto nel file.
- Le funzioni nuove nascono chiuse (0002): chi le chiama dal server di Vercel
  usa `dbServizio()` di `lib/supabase/servizio.ts`; si aprono agli utenti
  collegati solo con un `grant … to authenticated` scritto nel file.
- Si applicano dal server con la chiave personale di Supabase (Management API)
  o incollandole nel SQL Editor. Applicata in produzione = la riga qui sotto.

## Applicate in produzione

| File | Quando | Note |
|---|---|---|
| 0001_schema_iniziale.sql | 23/08/2026 | ripreso dal registro di Supabase |
| 0002_permessi.sql | 28/11/2026 | dopo il deploy di `lib/supabase/servizio.ts` (commit 019554d); provata: la chiave pubblica riceve «permission denied» |
| 0003_indici_e_scadenze.sql | 28/11/2026 | 5 indici e la scadenza di 12 mesi delle ricerche AI |
