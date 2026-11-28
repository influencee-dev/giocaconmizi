-- 0003 · Indici e scadenza delle ricerche (lotto 1 del piano sull'architettura, 28/11/2026).
-- Si può rilanciare senza danni.

-- Le risposte accettate dei locali, l'ultima per scheda (dir_pubblicate, la chiamata più frequente).
create index if not exists dir_richieste_accettate on public.dir_richieste (chiave, esito_il desc) where stato = 'accettata';
-- Il freno alle candidature: quante ne ha mandate la stessa email oggi.
create index if not exists dir_candidature_email on public.dir_candidature (lower(email), creato_il desc);
-- Il grafico di una scheda nel pannello (la chiave primaria parte dal giorno).
create index if not exists dir_statistiche_chiave on public.dir_statistiche (chiave, giorno);
-- Chiavi esterne senza indice: la cancellazione di un account le scorre tutte.
create index if not exists children_profilo on public.children (profile_id);
create index if not exists events_profilo on public.events (profile_id, created_at desc);

-- Le domande fatte alla ricerca con l'AI sono testo libero e possono contenere
-- dati personali: si tengono 12 mesi, poi si cancellano da sole (lib/contenuti/legal.ts).
create or replace function public.ai_ricerche_scadenza()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  delete from public.ai_ricerche where quando < now() - interval '12 months';
  return null;
end $$;
revoke execute on function public.ai_ricerche_scadenza() from public, anon, authenticated;

drop trigger if exists ai_ricerche_scadenza on public.ai_ricerche;
create trigger ai_ricerche_scadenza
  after insert on public.ai_ricerche
  for each statement execute function public.ai_ricerche_scadenza();
