-- Scheda estesa delle attività (docs/listing-ricerca.md, lotto B).
-- Da incollare UNA volta nel SQL Editor di Supabase DOPO directory.sql, e premere Run.
-- Si può rilanciare senza danni: crea solo ciò che manca e riscrive due funzioni.
--
-- Cosa fa:
-- 1. aggiunge le BOZZE: l'attività compila la scheda a metà, salva e riprende
--    dal suo link personale. Una bozza per scheda, sovrascritta a ogni salvataggio;
-- 2. alza il limite dei dati di una risposta da 20 a 60 KB (pacchetti, orari,
--    extra e video della scheda estesa) e cancella la bozza quando l'attività invia.
--
-- La scheda estesa viaggia dentro dir_richieste.dati, alla chiave "estesa": nessuna
-- tabella nuova per i dati pubblici. Giorgia decide come oggi, e il sito pubblico
-- legge solo le risposte accettate con dir_pubblicate().
--
-- Sicurezza come directory.sql: tabella chiusa (RLS senza policy), si passa solo
-- dalle funzioni, che controllano il codice del link personale (solo l'impronta).

create table if not exists public.dir_bozze (
  chiave text primary key references public.dir_inviti (chiave),
  dati jsonb not null,
  aggiornato_il timestamptz not null default now()
);

alter table public.dir_bozze enable row level security;
revoke all on public.dir_bozze from anon, authenticated;

-- L'attività salva la bozza dal suo link personale.
create or replace function public.dir_salva_bozza(p_codice text, p_dati jsonb)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  v_chiave text;
begin
  select i.chiave into v_chiave from public.dir_inviti i
   where i.token_hash = public.dir_impronta(p_codice) and i.scade_il > now();
  if v_chiave is null then
    raise exception 'link non valido o scaduto';
  end if;
  if p_dati is null or jsonb_typeof(p_dati) <> 'object' then
    raise exception 'dati non validi';
  end if;
  if pg_column_size(p_dati) > 60000 then
    raise exception 'troppi dati';
  end if;
  insert into public.dir_bozze (chiave, dati, aggiornato_il)
  values (v_chiave, p_dati, now())
  on conflict (chiave) do update set dati = excluded.dati, aggiornato_il = now();
end $$;

-- L'attività riapre il link e ritrova la bozza.
create or replace function public.dir_leggi_bozza(p_codice text)
returns jsonb
language plpgsql security definer stable
set search_path = ''
as $$
declare
  v_dati jsonb;
begin
  select b.dati into v_dati
    from public.dir_bozze b
    join public.dir_inviti i on i.chiave = b.chiave
   where i.token_hash = public.dir_impronta(p_codice) and i.scade_il > now();
  return v_dati;
end $$;

-- Come in directory.sql, con due differenze: limite a 60 KB e bozza cancellata all'invio.
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
  if pg_column_size(p_dati) > 60000 then
    raise exception 'troppi dati';
  end if;
  insert into public.dir_richieste (chiave, tipo, dati, email, referente, termini_accettati)
  values (v_chiave, p_tipo, coalesce(p_dati, '{}'::jsonb), left(p_email, 200), left(p_referente, 200), coalesce(p_termini, false))
  returning id into v_id;
  update public.dir_inviti set stato = case p_tipo when 'approva' then 'approvato'
                                                  when 'modifica' then 'modifica'
                                                  else 'rimozione' end
   where chiave = v_chiave;
  delete from public.dir_bozze where chiave = v_chiave;
  return v_id;
end $$;

grant execute on function public.dir_salva_bozza(text, jsonb) to anon, authenticated;
grant execute on function public.dir_leggi_bozza(text) to anon, authenticated;
grant execute on function public.dir_invia_richiesta(text, text, jsonb, text, text, boolean) to anon, authenticated;
