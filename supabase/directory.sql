-- Area delle attività della directory (docs/piano-directory.md, §6-bis).
-- Da incollare UNA volta nel SQL Editor di Supabase e premere Run.
-- Si può rilanciare senza danni: crea solo ciò che manca.
--
-- Sicurezza: le tabelle sono chiuse (RLS senza policy). Il sito usa solo la
-- chiave pubblica e passa da funzioni che controllano il codice del link
-- personale. Nel database c'è soltanto l'impronta SHA-256 dei codici, mai i
-- codici veri: chi legge il database non può ricostruire i link.

create extension if not exists pgcrypto with schema extensions;

-- Un invito per locale: chiave stabile "città/slug" (es. milano/il-nano-gigante).
create table if not exists public.dir_inviti (
  chiave text primary key,
  token_hash bytea not null unique,
  creato_il timestamptz not null default now(),
  scade_il timestamptz not null default now() + interval '60 days',
  aperto_il timestamptz,
  stato text not null default 'inviato'
    check (stato in ('inviato', 'aperto', 'approvato', 'modifica', 'rimozione'))
);

-- Le richieste del locale: approvazione, modifiche, rimozione.
create table if not exists public.dir_richieste (
  id bigint generated always as identity primary key,
  chiave text not null references public.dir_inviti (chiave),
  tipo text not null check (tipo in ('approva', 'modifica', 'rimuovi')),
  dati jsonb not null default '{}'::jsonb,
  email text,
  referente text,
  termini_accettati boolean not null default false,
  creato_il timestamptz not null default now(),
  stato text not null default 'in_attesa'
    check (stato in ('in_attesa', 'accettata', 'rifiutata')),
  nota text,
  esito_il timestamptz
);
create index if not exists dir_richieste_stato on public.dir_richieste (stato, creato_il desc);

-- Il codice del pannello di Giorgia (solo l'impronta).
create table if not exists public.dir_admin (
  token_hash bytea primary key
);

alter table public.dir_inviti enable row level security;
alter table public.dir_richieste enable row level security;
alter table public.dir_admin enable row level security;
revoke all on public.dir_inviti, public.dir_richieste, public.dir_admin from anon, authenticated;

create or replace function public.dir_impronta(p_codice text)
returns bytea language sql immutable
set search_path = ''
as $$ select extensions.digest(p_codice, 'sha256') $$;

-- Il locale apre il suo link: restituisce la chiave della scheda e lo stato.
create or replace function public.dir_apri_invito(p_codice text)
returns table (chiave text, stato text, scade_il timestamptz)
language plpgsql security definer
set search_path = ''
as $$
begin
  return query
  update public.dir_inviti i
     set aperto_il = coalesce(i.aperto_il, now()),
         stato = case when i.stato = 'inviato' then 'aperto' else i.stato end
   where i.token_hash = public.dir_impronta(p_codice)
     and i.scade_il > now()
  returning i.chiave, i.stato, i.scade_il;
end $$;

-- Il locale invia la sua risposta. Si accetta solo con il codice valido.
create or replace function public.dir_invia_richiesta(
  p_codice text, p_tipo text, p_dati jsonb, p_email text, p_referente text, p_termini boolean
) returns bigint
language plpgsql security definer
set search_path = ''
as $$
declare
  v_chiave text;
  v_id bigint;
begin
  select i.chiave into v_chiave from public.dir_inviti i
   where i.token_hash = public.dir_impronta(p_codice) and i.scade_il > now();
  if v_chiave is null then
    raise exception 'link non valido o scaduto';
  end if;
  if p_tipo in ('approva', 'modifica') and not coalesce(p_termini, false) then
    raise exception 'servono i termini e condizioni';
  end if;
  if pg_column_size(p_dati) > 20000 then
    raise exception 'troppi dati';
  end if;
  insert into public.dir_richieste (chiave, tipo, dati, email, referente, termini_accettati)
  values (v_chiave, p_tipo, coalesce(p_dati, '{}'::jsonb), left(p_email, 200), left(p_referente, 200), coalesce(p_termini, false))
  returning id into v_id;
  update public.dir_inviti set stato = case p_tipo when 'approva' then 'approvato'
                                                  when 'modifica' then 'modifica'
                                                  else 'rimozione' end
   where chiave = v_chiave;
  return v_id;
end $$;

-- Pannello di Giorgia: l'elenco delle richieste (serve il codice admin).
create or replace function public.dir_admin_richieste(p_codice text)
returns setof public.dir_richieste
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  return query select * from public.dir_richieste order by (stato = 'in_attesa') desc, creato_il desc limit 500;
end $$;

-- Pannello di Giorgia: lo stato degli inviti (chi ha aperto il link).
create or replace function public.dir_admin_inviti(p_codice text)
returns table (chiave text, stato text, aperto_il timestamptz, scade_il timestamptz)
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  return query select i.chiave, i.stato, i.aperto_il, i.scade_il from public.dir_inviti i order by i.chiave;
end $$;

-- Pannello di Giorgia: accetta o rifiuta una richiesta.
create or replace function public.dir_admin_esito(p_codice text, p_id bigint, p_esito text, p_nota text)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  if p_esito not in ('accettata', 'rifiutata') then
    raise exception 'esito non valido';
  end if;
  update public.dir_richieste set stato = p_esito, nota = left(p_nota, 1000), esito_il = now() where id = p_id;
end $$;

-- Per il sito pubblico: le sole richieste ACCETTATE, l'ultima per scheda.
-- Escono solo i campi pubblici: niente email né nome del referente.
create or replace function public.dir_pubblicate()
returns table (chiave text, tipo text, dati jsonb)
language sql security definer stable
set search_path = ''
as $$
  select distinct on (r.chiave) r.chiave, r.tipo, r.dati
    from public.dir_richieste r
   where r.stato = 'accettata'
   order by r.chiave, r.esito_il desc
$$;

revoke all on function public.dir_impronta(text) from public;
grant execute on function public.dir_apri_invito(text) to anon, authenticated;
grant execute on function public.dir_invia_richiesta(text, text, jsonb, text, text, boolean) to anon, authenticated;
grant execute on function public.dir_admin_richieste(text) to anon, authenticated;
grant execute on function public.dir_admin_inviti(text) to anon, authenticated;
grant execute on function public.dir_admin_esito(text, bigint, text, text) to anon, authenticated;
grant execute on function public.dir_pubblicate() to anon, authenticated;
