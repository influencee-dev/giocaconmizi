-- 0001 · Lo schema iniziale (agosto 2026), ripreso il 28/11/2026 dal registro delle migrazioni di Supabase
-- (supabase_migrations.schema_migrations): fino a oggi non era nel repo. Già applicato in produzione.

-- 20260823125812 · schema_iniziale_giocaconmizi
-- Schema iniziale Gioca con Mizi (piano §4.2, adattato a ciò che il codice usa)

-- Profilo del genitore: una riga per utente auth, creata automaticamente al signup
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  parent_name text,
  email text,
  city text,
  profession text,
  consent_at timestamptz,
  brevo_contact_id text,
  created_at timestamptz not null default now()
);

-- Bambini: solo fascia d'età e soprannome facoltativo, mai il nome (§2 dec. 2)
create table public.children (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  nickname text,
  age_band smallint check (age_band between 3 and 12),
  grade text,
  created_at timestamptz not null default now()
);

-- Catalogo giochi: il codice dice come si gioca, il DB come si racconta (§4.2)
create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  age_min smallint not null,
  age_max smallint not null,
  skill text not null,
  subskill text,
  difficulty smallint,
  description text,
  status text not null default 'live',
  created_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  age_band smallint,
  theme text,
  length_min smallint,
  text text,
  pdf_url text,
  created_at timestamptz not null default now()
);

-- Avanzamento: scritto da /api/progresso solo per gli utenti loggati
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  game_slug text not null,
  score smallint not null default 0,
  stars smallint not null default 0,
  completed_at timestamptz not null default now()
);
create index progress_profile_idx on public.progress (profile_id, completed_at desc);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- Il profilo nasce insieme all'utente: niente passaggio di onboarding separato
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: ognuno vede solo il suo; cataloghi leggibili da tutti, scrivibili solo dal service role
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.games enable row level security;
alter table public.stories enable row level security;
alter table public.progress enable row level security;
alter table public.events enable row level security;

create policy "profilo proprio: lettura" on public.profiles
  for select using ((select auth.uid()) = id);
create policy "profilo proprio: modifica" on public.profiles
  for update using ((select auth.uid()) = id);

create policy "bambini propri: tutto" on public.children
  for all using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "catalogo giochi pubblico" on public.games
  for select using (true);
create policy "catalogo storie pubblico" on public.stories
  for select using (true);

create policy "avanzamento proprio: lettura" on public.progress
  for select using ((select auth.uid()) = profile_id);
create policy "avanzamento proprio: scrittura" on public.progress
  for insert with check ((select auth.uid()) = profile_id);

create policy "eventi propri: scrittura" on public.events
  for insert with check ((select auth.uid()) = profile_id);
create policy "eventi propri: lettura" on public.events
  for select using ((select auth.uid()) = profile_id);

-- 20260823130115 · blocca_esecuzione_handle_new_user
-- La funzione serve solo al trigger su auth.users: nessuno deve poterla
-- chiamare via /rest/v1/rpc (segnalazione del security advisor).
revoke execute on function public.handle_new_user() from anon, authenticated, public;
