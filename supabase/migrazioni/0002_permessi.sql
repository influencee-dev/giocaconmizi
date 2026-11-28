-- 0002 · Permessi (lotto 1 del piano sull'architettura, 28/11/2026).
-- Si può rilanciare senza danni. Non cancella né tabelle né dati.
--
-- Prima: la chiave pubblica (quella che sta nel JavaScript del sito, quindi di
-- chiunque) poteva eseguire 30 funzioni su 32, comprese le 13 del pannello di
-- Giorgia protette solo dal codice passato come parametro, e aveva TUTTI i
-- permessi sulle 6 tabelle dello schema iniziale (anche TRUNCATE, che la RLS
-- non ferma).
--
-- Dopo:
-- - le funzioni della directory, del pannello e dei pagamenti le esegue SOLO il
--   server di Vercel con la chiave di servizio (lib/supabase/servizio.ts);
-- - la chiave pubblica non ha più niente in public;
-- - le mamme collegate (authenticated) tengono solo ciò che usano: il proprio
--   profilo, i propri bambini e avanzamenti (con la RLS), e le due funzioni
--   della ricerca con l'AI;
-- - le tabelle e le funzioni create d'ora in poi nascono chiuse.
--
-- ORDINE: si applica DOPO che il codice con lib/supabase/servizio.ts è online,
-- altrimenti le pagine della directory leggono con la chiave pubblica e trovano
-- la porta chiusa (il sito regge lo stesso, ma senza le risposte dei locali).

-- 1. Tabelle dello schema iniziale: niente alla chiave pubblica.
revoke all on public.profiles, public.children, public.progress, public.events, public.games, public.stories from anon;
-- Agli utenti collegati restano lettura e scrittura, sotto la RLS; mai svuotare le tabelle.
revoke truncate, references, trigger on public.profiles, public.children, public.progress, public.events, public.games, public.stories from authenticated;
-- I cataloghi doppi (games, stories) non li legge nessuno: i contenuti stanno nel repo.
revoke all on public.games, public.stories from authenticated;

-- 2. Le regole RLS valgono per gli utenti collegati, non per «tutti».
alter policy "profilo proprio: lettura" on public.profiles to authenticated;
alter policy "profilo proprio: modifica" on public.profiles to authenticated;
alter policy "bambini propri: tutto" on public.children to authenticated;
alter policy "avanzamento proprio: lettura" on public.progress to authenticated;
alter policy "avanzamento proprio: scrittura" on public.progress to authenticated;
alter policy "eventi propri: lettura" on public.events to authenticated;
alter policy "eventi propri: scrittura" on public.events to authenticated;

-- 3. Funzioni: tutte chiuse, poi si riapre solo ciò che serve.
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on all functions in schema public to service_role;
-- La ricerca con l'AI della mamma collegata: le funzioni usano auth.uid().
grant execute on function public.ai_stato_mamma() to authenticated;
grant execute on function public.ai_consuma_ricerca() to authenticated;

-- 4. Quello che nasce d'ora in poi nasce chiuso (va aperto a mano, con un grant).
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from public, anon, authenticated;
