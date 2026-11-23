-- Negozio dei PDF da stampare (23/11/2026, docs/negozio.md).
-- Da incollare UNA volta nel SQL Editor di Supabase e premere Run.
-- Si può rilanciare senza danni: crea solo ciò che manca.
--
-- Nessuna tabella: gli ordini stanno in Stripe. Qui solo due contenitori di Storage:
--   1. «negozio», PRIVATO: i PDF venduti. Nessuna regola di lettura per anon e
--      authenticated: li legge solo il server del sito con la chiave di servizio,
--      dopo aver controllato il pagamento su Stripe, e dà alla famiglia un link
--      firmato che vale due minuti.
--   2. «negozio-anteprime», PUBBLICO: le anteprime piccole dei disegni (480 px, con
--      il segno del sito), che non stanno nel repo perché è pubblico.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('negozio', 'negozio', false, 20971520, array['application/pdf'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('negozio-anteprime', 'negozio-anteprime', true, 1048576, array['image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
