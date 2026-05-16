-- Skoltz starter seed data.
-- Run after supabase_schema.sql.
-- Event dates are generated relative to the execution date so the calendar
-- stays current without cron jobs, schedulers, or external sports feeds.

delete from public.events
where
  categories && array['pool']::text[]
  or categories && array['rockets']::text[]
  or categories && array['texans']::text[]
  or title in (
    'Karaoke kickoff night',
    'Karaoke late night',
    'Karaoke Thursday',
    'Karaoke first Thursday',
    'Friday karaoke kickoff',
    'Astros Friday karaoke',
    'Friday karaoke night',
    'First Friday karaoke',
    'Friday pool tournament',
    'Saturday pool challenge',
    'Pool doubles night',
    'Pool tournament finals',
    'Astros vs Rangers watch party',
    'Astros vs Mariners night',
    'Astros game night',
    'Texans fan meetup',
    'Astros vs Angels watch party',
    'Astros away game watch',
    'Astros vs Athletics watch party',
    'Rockets draft night',
    'Texans watch crew night',
    'Astros watch party opener',
    'Astros Friday watch party',
    'Astros weekend watch party',
    'Astros road game watch',
    'Astros homestand night',
    'Astros Sunday baseball',
    'Friday karaoke at Skoltz',
    'Next Friday karaoke',
    'Rockets watch party',
    'Texans fan night'
  );

delete from public.sports_games
where
  category in ('rockets', 'texans')
  or title in (
  'Astros watch party opener',
  'Astros vs Rangers',
  'Rockets vs Spurs',
  'Astros vs Mariners',
  'Astros vs Rangers rematch',
  'Astros vs Angels',
  'Astros at Rays',
  'Astros vs Athletics',
  'Rockets draft night',
  'Texans watch crew night',
  'Astros Friday watch party',
  'Astros weekend watch party',
  'Astros road game watch',
  'Astros homestand night',
  'Astros Sunday baseball',
  'Rockets watch party',
  'Texans fan night'
  );

delete from public.rewards
where title ilike '%pool%';

with schedule as (
  select
    current_date as today,
    current_date + 1 as tomorrow,
    current_date + (((5 - extract(dow from current_date)::int + 7) % 7))::int as next_friday,
    case
      when extract(dow from current_date)::int = 6 then current_date + 7
      else current_date + (((6 - extract(dow from current_date)::int + 7) % 7))::int
    end as upcoming_saturday,
    case
      when extract(dow from current_date)::int = 0 then current_date + 7
      else current_date + (((0 - extract(dow from current_date)::int + 7) % 7))::int
    end as upcoming_sunday
),
seed as (
  select
    v.title,
    v.description,
    ((v.start_date + v.start_time) at time zone 'America/Chicago') as start_time,
    ((v.end_date + v.end_time) at time zone 'America/Chicago') as end_time,
    v.categories,
    v.location
  from schedule
  cross join lateral (
    values
      (
        'Astros watch party opener',
        'Astros game night with game-day specials.',
        schedule.tomorrow,
        time '19:10',
        schedule.tomorrow,
        time '22:30',
        array['astros']::text[],
        'Skoltz main bar'
      ),
      (
        'Astros Friday watch party',
        'Astros watch party before Friday karaoke.',
        schedule.next_friday,
        time '19:10',
        schedule.next_friday,
        time '22:30',
        array['astros']::text[],
        'Skoltz main bar'
      ),
      (
        'Friday karaoke at Skoltz',
        'Friday karaoke on the Skoltz stage.',
        schedule.next_friday,
        time '21:30',
        schedule.next_friday + 1,
        time '01:30',
        array['karaoke']::text[],
        'Skoltz stage'
      ),
      (
        'Astros weekend watch party',
        'Weekend Astros watch party with bar specials.',
        schedule.upcoming_saturday,
        time '18:40',
        schedule.upcoming_saturday,
        time '22:00',
        array['astros']::text[],
        'Skoltz main bar'
      ),
      (
        'Astros Sunday baseball',
        'Sunday Astros watch party at Skoltz.',
        schedule.upcoming_sunday,
        time '13:10',
        schedule.upcoming_sunday,
        time '16:30',
        array['astros']::text[],
        'Skoltz main bar'
      ),
      (
        'Astros road game watch',
        'Catch the Astros road game with bar specials.',
        schedule.next_friday + 7,
        time '18:40',
        schedule.next_friday + 7,
        time '22:00',
        array['astros']::text[],
        'Skoltz main bar'
      ),
      (
        'Next Friday karaoke',
        'Friday karaoke with drink specials.',
        schedule.next_friday + 7,
        time '21:30',
        schedule.next_friday + 8,
        time '01:30',
        array['karaoke']::text[],
        'Skoltz stage'
      ),
      (
        'Astros homestand night',
        'Astros homestand watch party on the big screens.',
        schedule.next_friday + 11,
        time '19:10',
        schedule.next_friday + 11,
        time '22:30',
        array['astros']::text[],
        'Skoltz main bar'
      )
  ) as v(title, description, start_date, start_time, end_date, end_time, categories, location)
)
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
from seed
where not exists (
  select 1 from public.events where public.events.title = seed.title
);

with schedule as (
  select
    current_date + 1 as tomorrow,
    current_date + (((5 - extract(dow from current_date)::int + 7) % 7))::int as next_friday,
    case
      when extract(dow from current_date)::int = 6 then current_date + 7
      else current_date + (((6 - extract(dow from current_date)::int + 7) % 7))::int
    end as upcoming_saturday,
    case
      when extract(dow from current_date)::int = 0 then current_date + 7
      else current_date + (((0 - extract(dow from current_date)::int + 7) % 7))::int
    end as upcoming_sunday
),
seed as (
  select
    v.title,
    v.league,
    v.home_team,
    v.away_team,
    ((v.start_date + v.start_time) at time zone 'America/Chicago') as start_time,
    v.category
  from schedule
  cross join lateral (
    values
      ('Astros watch party opener', 'MLB', 'Astros', 'Rangers', schedule.tomorrow, time '19:10', 'astros'),
      ('Astros Friday watch party', 'MLB', 'Astros', 'Mariners', schedule.next_friday, time '19:10', 'astros'),
      ('Astros weekend watch party', 'MLB', 'Astros', 'Angels', schedule.upcoming_saturday, time '18:40', 'astros'),
      ('Astros Sunday baseball', 'MLB', 'Astros', 'Tigers', schedule.upcoming_sunday, time '13:10', 'astros'),
      ('Astros road game watch', 'MLB', 'Rays', 'Astros', schedule.next_friday + 7, time '18:40', 'astros'),
      ('Astros homestand night', 'MLB', 'Astros', 'Athletics', schedule.next_friday + 11, time '19:10', 'astros')
  ) as v(title, league, home_team, away_team, start_date, start_time, category)
)
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
from seed
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
  'Game day special',
  'Starter reward surfaced without redemption logic.',
  200,
  true
where not exists (
  select 1 from public.rewards where title = 'Game day special'
);
