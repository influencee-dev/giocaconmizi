-- AI a pagamento (docs/piano-ai-a-pagamento.md, lotto 1).
-- Si può rilanciare senza danni: crea solo ciò che manca e riscrive le funzioni.
--
-- Mamme: 10 € per 12 mesi di ricerca con l'AI, senza rinnovo automatico;
-- 3 ricerche gratis per ogni mamma registrata; tetto di 50 ricerche al giorno.
-- Attività: 2 € per una compilazione con l'AI della propria scheda.
--
-- Sicurezza: tabelle chiuse (RLS senza policy). Le mamme leggono e consumano
-- solo il proprio accesso, con auth.uid(). I pagamenti li scrive SOLO il server,
-- dal webhook di Stripe con la firma controllata, usando la chiave di servizio:
-- la funzione che li registra non è eseguibile dalla chiave pubblica.
-- Nessun dato della carta passa di qui: solo l'id della sessione di Stripe.

create table if not exists public.ai_pagamenti (
  sessione text primary key,
  tipo text not null check (tipo in ('mamma_anno', 'scheda')),
  utente uuid references auth.users (id) on delete set null,
  chiave text,
  importo_cent integer not null,
  valuta text not null default 'eur',
  stato text not null default 'pagato' check (stato in ('pagato', 'rimborsato')),
  prova boolean not null default false,
  pagato_il timestamptz not null default now()
);

create table if not exists public.ai_accessi (
  utente uuid primary key references auth.users (id) on delete cascade,
  scade_il timestamptz,
  gratis_usate integer not null default 0,
  giorno date not null default current_date,
  ricerche_giorno integer not null default 0,
  promemoria_il timestamptz
);

create table if not exists public.ai_crediti_scheda (
  chiave text primary key,
  pagati integer not null default 0,
  usati integer not null default 0
);

alter table public.ai_pagamenti enable row level security;
alter table public.ai_accessi enable row level security;
alter table public.ai_crediti_scheda enable row level security;
revoke all on public.ai_pagamenti, public.ai_accessi, public.ai_crediti_scheda from anon, authenticated;

-- La mamma collegata: fino a quando vale il contributo e quante ricerche gratis le restano.
create or replace function public.ai_stato_mamma()
returns table (scade_il timestamptz, gratis_rimaste integer, ricerche_oggi integer)
language sql security definer stable
set search_path = ''
as $$
  select a.scade_il,
         greatest(0, 3 - coalesce(a.gratis_usate, 0)),
         case when a.giorno = current_date then a.ricerche_giorno else 0 end
    from (select auth.uid() as u) io
    left join public.ai_accessi a on a.utente = io.u
   where io.u is not null
$$;

-- Prima di ogni ricerca con l'AI: la conta e dice se si può fare.
-- Esiti: 'pagato', 'gratis', 'serve_contributo', 'troppe_oggi', 'non_collegata'.
create or replace function public.ai_consuma_ricerca()
returns text
language plpgsql security definer
set search_path = ''
as $$
declare
  v_utente uuid := auth.uid();
  a public.ai_accessi;
begin
  if v_utente is null then
    return 'non_collegata';
  end if;
  insert into public.ai_accessi (utente) values (v_utente) on conflict (utente) do nothing;
  select * into a from public.ai_accessi where utente = v_utente for update;
  if a.giorno <> current_date then
    update public.ai_accessi set giorno = current_date, ricerche_giorno = 0 where utente = v_utente;
    a.ricerche_giorno := 0;
  end if;
  if a.ricerche_giorno >= 50 then
    return 'troppe_oggi';
  end if;
  if a.scade_il is not null and a.scade_il > now() then
    update public.ai_accessi set ricerche_giorno = ricerche_giorno + 1 where utente = v_utente;
    return 'pagato';
  end if;
  if a.gratis_usate < 3 then
    update public.ai_accessi set gratis_usate = gratis_usate + 1, ricerche_giorno = ricerche_giorno + 1 where utente = v_utente;
    return 'gratis';
  end if;
  return 'serve_contributo';
end $$;

-- Solo il server (webhook di Stripe, chiave di servizio): registra un pagamento
-- e apre l'accesso. Idempotente: Stripe può mandare lo stesso evento più volte.
create or replace function public.ai_registra_pagamento(
  p_sessione text, p_tipo text, p_utente uuid, p_chiave text, p_importo_cent integer, p_prova boolean
) returns boolean
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.ai_pagamenti (sessione, tipo, utente, chiave, importo_cent, prova)
  values (p_sessione, p_tipo, p_utente, p_chiave, p_importo_cent, coalesce(p_prova, false))
  on conflict (sessione) do nothing;
  if not found then
    return false; -- già registrato
  end if;
  if p_tipo = 'mamma_anno' and p_utente is not null then
    insert into public.ai_accessi (utente, scade_il) values (p_utente, now() + interval '12 months')
    on conflict (utente) do update
      set scade_il = greatest(coalesce(public.ai_accessi.scade_il, now()), now()) + interval '12 months',
          promemoria_il = null;
  elsif p_tipo = 'scheda' and p_chiave is not null then
    insert into public.ai_crediti_scheda (chiave, pagati) values (p_chiave, 1)
    on conflict (chiave) do update set pagati = public.ai_crediti_scheda.pagati + 1;
  end if;
  return true;
end $$;

-- L'attività dal suo link personale: quante compilazioni pagate le restano.
create or replace function public.ai_crediti_attivita(p_codice text)
returns integer
language sql security definer stable
set search_path = ''
as $$
  select coalesce(c.pagati - c.usati, 0)
    from public.dir_inviti i
    left join public.ai_crediti_scheda c on c.chiave = i.chiave
   where i.token_hash = public.dir_impronta(p_codice) and i.scade_il > now()
$$;

-- L'attività usa una compilazione pagata. Vero se ce n'era una.
create or replace function public.ai_usa_credito_attivita(p_codice text)
returns boolean
language plpgsql security definer
set search_path = ''
as $$
declare
  v_chiave text;
begin
  select i.chiave into v_chiave from public.dir_inviti i
   where i.token_hash = public.dir_impronta(p_codice) and i.scade_il > now();
  if v_chiave is null then
    return false;
  end if;
  update public.ai_crediti_scheda set usati = usati + 1
   where chiave = v_chiave and pagati > usati;
  return found;
end $$;

revoke all on function public.ai_registra_pagamento(text, text, uuid, text, integer, boolean) from public, anon, authenticated;
grant execute on function public.ai_registra_pagamento(text, text, uuid, text, integer, boolean) to service_role;
grant execute on function public.ai_stato_mamma() to authenticated;
grant execute on function public.ai_consuma_ricerca() to authenticated;
grant execute on function public.ai_crediti_attivita(text) to anon, authenticated;
grant execute on function public.ai_usa_credito_attivita(text) to anon, authenticated;

-- Tracciamento (decisione di Giorgia del 27/11/2026: «per ora gratis per tutti, ma tracciamolo»).
-- Ogni uso dell'AI: cosa si è chiesto e com'è andata. Mai chi l'ha chiesto
-- (né id né email né IP): solo se era una mamma collegata. Lo scrive solo il server.
create table if not exists public.ai_ricerche (
  id bigint generated always as identity primary key,
  quando timestamptz not null default now(),
  tipo text not null default 'ricerca' check (tipo in ('ricerca', 'scheda')),
  domanda text not null,
  risultati integer not null default 0,
  collegata boolean not null default false,
  esito text not null default 'ok'
);
create index if not exists ai_ricerche_quando on public.ai_ricerche (quando desc);
alter table public.ai_ricerche enable row level security;
revoke all on public.ai_ricerche from anon, authenticated;

-- Pannello di Giorgia: i numeri e le ultime domande.
create or replace function public.ai_admin_ricerche(p_codice text)
returns table (quando timestamptz, tipo text, domanda text, risultati integer, collegata boolean, esito text)
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.dir_admin where token_hash = public.dir_impronta(p_codice)) then
    raise exception 'non autorizzato';
  end if;
  return query select r.quando, r.tipo, r.domanda, r.risultati, r.collegata, r.esito
    from public.ai_ricerche r order by r.quando desc limit 300;
end $$;
grant execute on function public.ai_admin_ricerche(text) to anon, authenticated;
