-- Reclamo delle schede «Risorse educative» e loghi caricati dalle realtà.
-- Da incollare UNA volta nel SQL Editor di Supabase DOPO directory.sql e premere Run.
-- Si può rilanciare senza danni: crea solo ciò che manca.
--
-- Le risorse usano le stesse tabelle delle attività (dir_inviti, dir_richieste)
-- con la chiave "risorse/<slug>": stesso link personale, stessa approvazione.
-- Qui si aggiungono solo:
--   1. dir_admin_crea_invito: Giorgia crea (o rinnova) il link personale dal pannello.
--      Nel database va solo l'impronta SHA-256 del codice, mai il codice.
--   2. dir_loghi: il logo che la realtà carica dal suo link. Lo carica lei, lo
--      approva Giorgia: mai loghi presi dai siti. Il server lo ricodifica in
--      WebP prima di salvarlo (niente SVG, niente metadati).

create table if not exists public.dir_loghi (
  id bigint generated always as identity primary key,
  chiave text not null references public.dir_inviti (chiave),
  immagine bytea not null,
  creato_il timestamptz not null default now(),
  stato text not null default 'in_attesa'
    check (stato in ('in_attesa', 'accettato', 'rifiutato')),
  esito_il timestamptz
);
create index if not exists dir_loghi_chiave on public.dir_loghi (chiave, stato, esito_il desc);

alter table public.dir_loghi enable row level security;
revoke all on public.dir_loghi from anon, authenticated;

-- Il pannello crea o rinnova il link personale di una scheda (attività o risorsa).
-- Il codice lo genera il server del sito; qui arriva solo per calcolarne l'impronta.
create or replace function public.dir_admin_crea_invito(p_codice text, p_chiave text, p_token text)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  if p_chiave !~ '^[a-z0-9-]+/[a-z0-9-]+$' or length(p_token) < 20 then
    raise exception 'dati non validi';
  end if;
  insert into public.dir_inviti (chiave, token_hash)
  values (p_chiave, public.dir_impronta(p_token))
  on conflict (chiave) do update
    set token_hash = excluded.token_hash,
        creato_il = now(),
        scade_il = now() + interval '60 days',
        aperto_il = null,
        stato = case when public.dir_inviti.stato in ('approvato', 'modifica', 'rimozione')
                     then public.dir_inviti.stato else 'inviato' end;
end $$;

-- La realtà carica il logo dal suo link (già ricodificato in WebP dal server).
create or replace function public.dir_invia_logo(p_codice text, p_immagine text)
returns bigint
language plpgsql security definer
set search_path = ''
as $$
declare
  v_chiave text;
  v_dati bytea;
  v_id bigint;
begin
  select i.chiave into v_chiave from public.dir_inviti i
   where i.token_hash = public.dir_impronta(p_codice) and i.scade_il > now();
  if v_chiave is null then
    raise exception 'link non valido o scaduto';
  end if;
  v_dati := decode(p_immagine, 'base64');
  -- WebP: "RIFF....WEBP", al massimo 200 KB.
  if length(v_dati) > 200000 or substring(v_dati from 1 for 4) <> '\x52494646'::bytea
     or substring(v_dati from 9 for 4) <> '\x57454250'::bytea then
    raise exception 'immagine non valida';
  end if;
  -- Un solo logo in attesa per scheda: il nuovo sostituisce il precedente.
  delete from public.dir_loghi where chiave = v_chiave and stato = 'in_attesa';
  insert into public.dir_loghi (chiave, immagine) values (v_chiave, v_dati) returning id into v_id;
  return v_id;
end $$;

-- Pannello: i loghi da decidere e gli ultimi decisi (con l'immagine in base64).
create or replace function public.dir_admin_loghi(p_codice text)
returns table (id bigint, chiave text, immagine text, creato_il timestamptz, stato text)
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  return query
    select l.id, l.chiave, encode(l.immagine, 'base64'), l.creato_il, l.stato
      from public.dir_loghi l
     order by (l.stato = 'in_attesa') desc, l.creato_il desc
     limit 100;
end $$;

create or replace function public.dir_admin_esito_logo(p_codice text, p_id bigint, p_esito text)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  if p_esito not in ('accettato', 'rifiutato') then
    raise exception 'esito non valido';
  end if;
  update public.dir_loghi set stato = p_esito, esito_il = now() where id = p_id;
end $$;

-- Per il sito pubblico: l'ultimo logo ACCETTATO di una scheda.
create or replace function public.dir_logo(p_chiave text)
returns text
language sql security definer stable
set search_path = ''
as $$
  select encode(l.immagine, 'base64')
    from public.dir_loghi l
   where l.chiave = p_chiave and l.stato = 'accettato'
   order by l.esito_il desc
   limit 1
$$;

-- Per il sito pubblico: quali schede hanno un logo accettato (solo le chiavi).
create or replace function public.dir_chiavi_con_logo()
returns setof text
language sql security definer stable
set search_path = ''
as $$
  select distinct l.chiave from public.dir_loghi l where l.stato = 'accettato'
$$;

grant execute on function public.dir_admin_crea_invito(text, text, text) to anon, authenticated;
grant execute on function public.dir_invia_logo(text, text) to anon, authenticated;
grant execute on function public.dir_admin_loghi(text) to anon, authenticated;
grant execute on function public.dir_admin_esito_logo(text, bigint, text) to anon, authenticated;
grant execute on function public.dir_logo(text) to anon, authenticated;
grant execute on function public.dir_chiavi_con_logo() to anon, authenticated;
