-- Skoltz Phase 2F schema, constraints, and RLS policies.
-- Run in the Supabase SQL editor for the target project.

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  points_required integer not null check (points_required >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  start_time timestamptz not null,
  end_time timestamptz not null,
  categories text[] not null,
  location text not null default 'Skoltz',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_time_order_check check (end_time > start_time),
  constraint events_categories_not_empty_check check (array_length(categories, 1) > 0),
  constraint events_categories_allowed_check check (
    categories <@ array['astros', 'rockets', 'texans', 'karaoke', 'pool']::text[]
  )
);

create table if not exists public.sports_games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  league text not null,
  home_team text not null,
  away_team text not null,
  start_time timestamptz not null,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sports_games_category_allowed_check check (
    category in ('astros', 'rockets', 'texans')
  )
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  timestamp timestamptz not null default now(),
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

create index if not exists events_start_time_idx on public.events (start_time);
create index if not exists sports_games_start_time_idx on public.sports_games (start_time);
create index if not exists checkins_user_id_idx on public.checkins (user_id);
CREATE UNIQUE INDEX checkins_user_date_unique
  ON public.checkins (user_id, ((timestamp AT TIME ZONE 'UTC')::date));

alter table public.rewards enable row level security;
alter table public.events enable row level security;
alter table public.sports_games enable row level security;
alter table public.checkins enable row level security;

drop policy if exists rewards_select_public on public.rewards;
drop policy if exists rewards_insert_no_client_writes on public.rewards;
drop policy if exists rewards_update_no_client_writes on public.rewards;
drop policy if exists rewards_insert_service_only on public.rewards;
drop policy if exists rewards_update_service_only on public.rewards;
drop policy if exists events_select_public on public.events;
drop policy if exists events_insert_no_client_writes on public.events;
drop policy if exists events_update_no_client_writes on public.events;
drop policy if exists events_insert_service_only on public.events;
drop policy if exists events_update_service_only on public.events;
drop policy if exists sports_games_select_public on public.sports_games;
drop policy if exists sports_games_insert_no_client_writes on public.sports_games;
drop policy if exists sports_games_update_no_client_writes on public.sports_games;
drop policy if exists sports_games_insert_service_only on public.sports_games;
drop policy if exists sports_games_update_service_only on public.sports_games;
drop policy if exists checkins_select_own on public.checkins;
drop policy if exists checkins_insert_own on public.checkins;
drop policy if exists checkins_update_own on public.checkins;

create policy rewards_select_public
  on public.rewards for select
  using (true);

create policy rewards_insert_no_client_writes
  on public.rewards for insert
  with check (false);

create policy rewards_update_no_client_writes
  on public.rewards for update
  using (false)
  with check (false);

create policy events_select_public
  on public.events for select
  using (true);

create policy events_insert_no_client_writes
  on public.events for insert
  with check (false);

create policy events_update_no_client_writes
  on public.events for update
  using (false)
  with check (false);

create policy sports_games_select_public
  on public.sports_games for select
  using (true);

create policy sports_games_insert_no_client_writes
  on public.sports_games for insert
  with check (false);

create policy sports_games_update_no_client_writes
  on public.sports_games for update
  using (false)
  with check (false);

create policy checkins_select_own
  on public.checkins for select
  using (user_id = auth.uid());

create policy checkins_insert_own
  on public.checkins for insert
  with check (user_id = auth.uid());

create policy checkins_update_own
  on public.checkins for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
