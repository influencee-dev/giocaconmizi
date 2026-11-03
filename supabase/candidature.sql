-- Le attività che si propongono da sole (pagina /aggiungi-attivita):
-- «aggiungete la mia attività» oppure «sono il titolare di una scheda che c'è già».
-- Da incollare nel SQL Editor di Supabase DOPO directory.sql, e premere Run.
-- Si può rilanciare senza danni.
--
-- Sicurezza come il resto della directory: tabella chiusa (RLS senza policy),
-- si scrive solo dalla funzione dir_candidatura e si legge solo col codice del
-- pannello. Niente viene pubblicato da solo: Giorgia controlla ogni proposta.

create table if not exists public.dir_candidature (
  id bigint generated always as identity primary key,
  tipo text not null check (tipo in ('nuova', 'accesso')),
  -- per «accesso»: la scheda che c'è già ("città/slug")
  chiave text,
  dati jsonb not null default '{}'::jsonb,
  email text not null,
  referente text not null,
  termini_accettati boolean not null default false,
  creato_il timestamptz not null default now(),
  stato text not null default 'in_attesa'
    check (stato in ('in_attesa', 'accettata', 'rifiutata')),
  nota text,
  esito_il timestamptz
);
create index if not exists dir_candidature_stato on public.dir_candidature (stato, creato_il desc);
alter table public.dir_candidature enable row level security;
revoke all on public.dir_candidature from anon, authenticated;

create or replace function public.dir_candidatura(
  p_tipo text, p_chiave text, p_dati jsonb, p_email text, p_referente text, p_termini boolean
) returns bigint
language plpgsql security definer
set search_path = ''
as $$
declare
  v_id bigint;
begin
  if p_tipo not in ('nuova', 'accesso') then raise exception 'tipo non valido'; end if;
  if not coalesce(p_termini, false) then raise exception 'servono i termini e condizioni'; end if;
  if p_email !~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' then raise exception 'email non valida'; end if;
  if pg_column_size(p_dati) > 12000 then raise exception 'troppi dati'; end if;
  -- Freno agli abusi: al massimo 5 proposte al giorno dalla stessa email.
  if (select count(*) from public.dir_candidature
       where lower(email) = lower(p_email) and creato_il > now() - interval '1 day') >= 5 then
    raise exception 'troppe richieste';
  end if;
  insert into public.dir_candidature (tipo, chiave, dati, email, referente, termini_accettati)
  values (p_tipo, left(p_chiave, 200), coalesce(p_dati, '{}'::jsonb), left(lower(p_email), 200), left(p_referente, 200), true)
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.dir_admin_candidature(p_codice text)
returns setof public.dir_candidature
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  return query select * from public.dir_candidature order by (stato = 'in_attesa') desc, creato_il desc limit 500;
end $$;

create or replace function public.dir_admin_esito_candidatura(p_codice text, p_id bigint, p_esito text, p_nota text)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  if p_esito not in ('accettata', 'rifiutata') then raise exception 'esito non valido'; end if;
  update public.dir_candidature set stato = p_esito, nota = left(p_nota, 1000), esito_il = now() where id = p_id;
end $$;

grant execute on function public.dir_candidatura(text, text, jsonb, text, text, boolean) to anon, authenticated;
grant execute on function public.dir_admin_candidature(text) to anon, authenticated;
grant execute on function public.dir_admin_esito_candidatura(text, bigint, text, text) to anon, authenticated;
