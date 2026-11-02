-- Giocamizi · back office (docs/piano-backoffice.md, fasi B e C).
-- Da incollare UNA volta nel SQL Editor di Supabase, dopo directory.sql.
-- Si può rieseguire: crea solo ciò che manca e riscrive le funzioni.
--
-- Contatori delle schede: SOLO numeri aggregati per giorno. Nessun IP,
-- nessun cookie, nessun identificativo: è un conteggio, non un tracciamento
-- delle persone (legittimo interesse, vedi informativa privacy).

create table if not exists public.dir_statistiche (
  giorno date not null default (now() at time zone 'Europe/Rome')::date,
  chiave text not null,            -- "città/slug" della scheda
  evento text not null check (evento in ('vista', 'whatsapp', 'telefono', 'sito', 'social', 'invito')),
  conteggio integer not null default 0,
  primary key (giorno, chiave, evento)
);

alter table public.dir_statistiche enable row level security;
revoke all on public.dir_statistiche from anon, authenticated;

-- +1 a un evento di una scheda, nel giorno di oggi (ora italiana).
-- La route /api/eventi controlla già che la scheda esista; qui si
-- ricontrolla la forma, così nessuno può riempire la tabella di spazzatura.
create or replace function public.dir_conta(p_chiave text, p_evento text)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if p_chiave !~ '^[a-z0-9-]{1,60}/[a-z0-9-]{1,80}$'
     or p_evento not in ('vista', 'whatsapp', 'telefono', 'sito', 'social', 'invito') then
    raise exception 'evento non valido';
  end if;
  insert into public.dir_statistiche as s (giorno, chiave, evento, conteggio)
  values ((now() at time zone 'Europe/Rome')::date, p_chiave, p_evento, 1)
  on conflict (giorno, chiave, evento) do update set conteggio = s.conteggio + 1;
end $$;

-- Pannello di Giorgia: i contatori dal giorno p_dal in poi (massimo 400 giorni).
create or replace function public.dir_admin_statistiche(p_codice text, p_dal date)
returns table (giorno date, chiave text, evento text, conteggio integer)
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  return query
    select s.giorno, s.chiave, s.evento, s.conteggio
    from public.dir_statistiche s
    where s.giorno >= greatest(p_dal, (now() at time zone 'Europe/Rome')::date - 400)
    order by s.giorno;
end $$;

grant execute on function public.dir_conta(text, text) to anon;
grant execute on function public.dir_admin_statistiche(text, date) to anon;
