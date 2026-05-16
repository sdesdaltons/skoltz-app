-- Skoltz Phase 2F starter seed data.
-- Run after supabase_schema.sql.

insert into public.events (
  title,
  description,
  start_time,
  end_time,
  categories,
  location
)
select
  'Astros game night',
  'Featured Astros watch party with game-day specials.',
  '2026-05-15T19:10:00-05:00'::timestamptz,
  '2026-05-15T22:30:00-05:00'::timestamptz,
  array['astros']::text[],
  'Skoltz main bar'
where not exists (
  select 1 from public.events where title = 'Astros game night'
);

insert into public.events (
  title,
  description,
  start_time,
  end_time,
  categories,
  location
)
select
  'Karaoke night',
  'Weekly karaoke event for the Skoltz crowd.',
  '2026-05-07T20:00:00-05:00'::timestamptz,
  '2026-05-07T23:00:00-05:00'::timestamptz,
  array['karaoke']::text[],
  'Skoltz stage'
where not exists (
  select 1 from public.events where title = 'Karaoke night'
);

insert into public.events (
  title,
  description,
  start_time,
  end_time,
  categories,
  location
)
select
  'Pool tournament',
  'Simple pool event seed for protected app testing.',
  '2026-05-15T21:00:00-05:00'::timestamptz,
  '2026-05-15T23:30:00-05:00'::timestamptz,
  array['pool']::text[],
  'Pool room'
where not exists (
  select 1 from public.events where title = 'Pool tournament'
);

insert into public.sports_games (
  title,
  league,
  home_team,
  away_team,
  start_time,
  category
)
select
  'Astros vs Rangers',
  'MLB',
  'Astros',
  'Rangers',
  '2026-05-15T19:10:00-05:00'::timestamptz,
  'astros'
where not exists (
  select 1 from public.sports_games where title = 'Astros vs Rangers'
);

insert into public.rewards (
  title,
  description,
  points_required,
  is_active
)
select
  'Free appetizer',
  'Read-only starter reward for the protected catalogue.',
  100,
  true
where not exists (
  select 1 from public.rewards where title = 'Free appetizer'
);

insert into public.rewards (
  title,
  description,
  points_required,
  is_active
)
select
  'Pool table hour',
  'Starter reward for regular guests.',
  150,
  true
where not exists (
  select 1 from public.rewards where title = 'Pool table hour'
);

insert into public.rewards (
  title,
  description,
  points_required,
  is_active
)
select
  'Game day special',
  'Starter reward surfaced without redemption logic.',
  200,
  true
where not exists (
  select 1 from public.rewards where title = 'Game day special'
);
