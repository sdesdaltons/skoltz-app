-- Skoltz Phase 2F starter seed data.
-- Run after supabase_schema.sql.

delete from public.events
where title in (
  'Karaoke kickoff night',
  'Karaoke late night',
  'Karaoke Thursday',
  'Karaoke first Thursday',
  'Friday karaoke kickoff',
  'Astros Friday karaoke',
  'Friday karaoke night',
  'First Friday karaoke'
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
  seed.title,
  seed.description,
  seed.start_time,
  seed.end_time,
  seed.categories,
  seed.location
from (
  values
    ('Astros vs Rangers watch party', 'Astros game night with game-day specials.', '2026-05-02T18:10:00-05:00'::timestamptz, '2026-05-02T21:30:00-05:00'::timestamptz, array['astros']::text[], 'Skoltz main bar'),
    ('Friday karaoke kickoff', 'Friday karaoke with the Skoltz regulars.', '2026-05-08T21:30:00-05:00'::timestamptz, '2026-05-09T01:30:00-05:00'::timestamptz, array['karaoke']::text[], 'Skoltz stage'),
    ('Rockets watch party', 'Rockets game on the big screens.', '2026-05-10T18:30:00-05:00'::timestamptz, '2026-05-10T21:30:00-05:00'::timestamptz, array['rockets']::text[], 'Skoltz main bar'),
    ('Astros vs Mariners night', 'Astros watch party with featured bar specials.', '2026-05-12T19:10:00-05:00'::timestamptz, '2026-05-12T22:30:00-05:00'::timestamptz, array['astros']::text[], 'Skoltz main bar'),
    ('Friday pool tournament', 'Weekly bracket night in the pool room.', '2026-05-15T19:30:00-05:00'::timestamptz, '2026-05-15T23:30:00-05:00'::timestamptz, array['pool']::text[], 'Pool room'),
    ('Astros game night', 'Featured Astros watch party with game-day specials.', '2026-05-15T19:10:00-05:00'::timestamptz, '2026-05-15T22:30:00-05:00'::timestamptz, array['astros']::text[], 'Skoltz main bar'),
    ('Astros Friday karaoke', 'Sing late after the Astros game.', '2026-05-15T21:30:00-05:00'::timestamptz, '2026-05-16T01:30:00-05:00'::timestamptz, array['karaoke']::text[], 'Skoltz stage'),
    ('Texans fan meetup', 'Texans fans gather for offseason talk and specials.', '2026-05-21T19:00:00-05:00'::timestamptz, '2026-05-21T21:00:00-05:00'::timestamptz, array['texans']::text[], 'Back patio'),
    ('Astros vs Angels watch party', 'Astros on the big screens all night.', '2026-05-22T19:10:00-05:00'::timestamptz, '2026-05-22T22:30:00-05:00'::timestamptz, array['astros']::text[], 'Skoltz main bar'),
    ('Saturday pool challenge', 'Casual pool challenge with rotating tables.', '2026-05-23T18:00:00-05:00'::timestamptz, '2026-05-23T22:00:00-05:00'::timestamptz, array['pool']::text[], 'Pool room'),
    ('Friday karaoke night', 'Weekly Friday karaoke night on the Skoltz stage.', '2026-05-22T21:30:00-05:00'::timestamptz, '2026-05-23T01:30:00-05:00'::timestamptz, array['karaoke']::text[], 'Skoltz stage'),
    ('Astros away game watch', 'Catch the Astros away game with bar specials.', '2026-05-29T18:40:00-05:00'::timestamptz, '2026-05-29T22:00:00-05:00'::timestamptz, array['astros']::text[], 'Skoltz main bar'),
    ('Pool doubles night', 'Bring a partner for doubles pool night.', '2026-05-30T19:00:00-05:00'::timestamptz, '2026-05-30T23:00:00-05:00'::timestamptz, array['pool']::text[], 'Pool room'),
    ('Astros vs Athletics watch party', 'Astros weekend watch party with featured specials.', '2026-06-02T19:10:00-05:00'::timestamptz, '2026-06-02T22:30:00-05:00'::timestamptz, array['astros']::text[], 'Skoltz main bar'),
    ('Rockets draft night', 'Rockets fans meet for draft talk and highlights.', '2026-06-04T18:30:00-05:00'::timestamptz, '2026-06-04T21:30:00-05:00'::timestamptz, array['rockets']::text[], 'Skoltz main bar'),
    ('First Friday karaoke', 'Friday karaoke with drink specials.', '2026-06-05T21:30:00-05:00'::timestamptz, '2026-06-06T01:30:00-05:00'::timestamptz, array['karaoke']::text[], 'Skoltz stage'),
    ('Pool tournament finals', 'Monthly pool tournament finals night.', '2026-06-06T18:00:00-05:00'::timestamptz, '2026-06-06T23:30:00-05:00'::timestamptz, array['pool']::text[], 'Pool room'),
    ('Astros Sunday baseball', 'Sunday Astros watch party at Skoltz.', '2026-06-07T13:10:00-05:00'::timestamptz, '2026-06-07T16:30:00-05:00'::timestamptz, array['astros']::text[], 'Skoltz main bar'),
    ('Texans watch crew night', 'Texans fans meet for schedule talk and specials.', '2026-06-10T19:00:00-05:00'::timestamptz, '2026-06-10T21:30:00-05:00'::timestamptz, array['texans']::text[], 'Back patio')
) as seed(title, description, start_time, end_time, categories, location)
where not exists (
  select 1 from public.events where public.events.title = seed.title
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
  seed.title,
  seed.league,
  seed.home_team,
  seed.away_team,
  seed.start_time,
  seed.category
from (
  values
    ('Astros vs Rangers', 'MLB', 'Astros', 'Rangers', '2026-05-02T18:10:00-05:00'::timestamptz, 'astros'),
    ('Rockets vs Spurs', 'NBA', 'Rockets', 'Spurs', '2026-05-10T18:30:00-05:00'::timestamptz, 'rockets'),
    ('Astros vs Mariners', 'MLB', 'Astros', 'Mariners', '2026-05-12T19:10:00-05:00'::timestamptz, 'astros'),
    ('Astros vs Rangers rematch', 'MLB', 'Astros', 'Rangers', '2026-05-15T19:10:00-05:00'::timestamptz, 'astros'),
    ('Texans fan night', 'NFL', 'Texans', 'TBD', '2026-05-21T19:00:00-05:00'::timestamptz, 'texans'),
    ('Astros vs Angels', 'MLB', 'Astros', 'Angels', '2026-05-22T19:10:00-05:00'::timestamptz, 'astros'),
    ('Astros at Rays', 'MLB', 'Rays', 'Astros', '2026-05-29T18:40:00-05:00'::timestamptz, 'astros'),
    ('Astros vs Athletics', 'MLB', 'Astros', 'Athletics', '2026-06-02T19:10:00-05:00'::timestamptz, 'astros'),
    ('Rockets draft night', 'NBA', 'Rockets', 'TBD', '2026-06-04T18:30:00-05:00'::timestamptz, 'rockets'),
    ('Astros Sunday baseball', 'MLB', 'Astros', 'Tigers', '2026-06-07T13:10:00-05:00'::timestamptz, 'astros'),
    ('Texans watch crew night', 'NFL', 'Texans', 'TBD', '2026-06-10T19:00:00-05:00'::timestamptz, 'texans')
) as seed(title, league, home_team, away_team, start_time, category)
where not exists (
  select 1 from public.sports_games where public.sports_games.title = seed.title
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
