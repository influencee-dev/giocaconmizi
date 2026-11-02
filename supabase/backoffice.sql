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

-- ---------------------------------------------------------------------
-- Posizioni dei locali sulla mappa (2/11/2026). Le calcola il pannello
-- (/admin/[codice]/posizioni) con OpenStreetMap Nominatim, dal server di
-- Vercel, una alla volta. Sono indirizzi di attività, non dati personali.
-- precisione: 'indirizzo' | 'nome' (trovato il locale) | 'zona' (solo il
-- quartiere: segnaposto approssimativo) | 'manuale' (inserita da Giorgia).

create table if not exists public.dir_posizioni (
  chiave text primary key,
  lat double precision not null check (lat between 35 and 48),
  lng double precision not null check (lng between 6 and 19),
  precisione text not null check (precisione in ('indirizzo', 'nome', 'zona', 'manuale')),
  aggiornato timestamptz not null default now()
);
alter table public.dir_posizioni enable row level security;
revoke all on public.dir_posizioni from anon, authenticated;

create or replace function public.dir_posizioni()
returns table (chiave text, lat double precision, lng double precision, precisione text)
language sql security definer stable
set search_path = ''
as $$ select p.chiave, p.lat, p.lng, p.precisione from public.dir_posizioni p $$;

create or replace function public.dir_admin_posizione(p_codice text, p_chiave text, p_lat double precision, p_lng double precision, p_precisione text)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  if p_chiave !~ '^[a-z0-9-]{1,60}/[a-z0-9-]{1,80}$' then
    raise exception 'scheda non valida';
  end if;
  if p_lat is null then
    delete from public.dir_posizioni where chiave = p_chiave;
    return;
  end if;
  insert into public.dir_posizioni (chiave, lat, lng, precisione)
  values (p_chiave, p_lat, p_lng, p_precisione)
  on conflict (chiave) do update set lat = excluded.lat, lng = excluded.lng, precisione = excluded.precisione, aggiornato = now();
end $$;

grant execute on function public.dir_posizioni() to anon;
grant execute on function public.dir_admin_posizione(text, text, double precision, double precision, text) to anon;
