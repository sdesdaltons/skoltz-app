-- Skoltz starter seed data.
-- Run after supabase_schema.sql.
-- Event dates are generated relative to the execution date so the calendar
-- stays current without cron jobs, schedulers, or external sports feeds.

delete from public.events
where
  categories && array['pool']::text[]
  or categories && array['rockets']::text[]
  or categories && array['texans']::text[]
  or categories && array['astros']::text[]
  or categories && array['mlb']::text[]
  or categories && array['nba']::text[]
  or categories && array['nfl']::text[]
  or (
    categories && array['karaoke']::text[]
    and extract(isodow from start_time at time zone 'America/Chicago') <> 5
  )
  or title in (
    'Karaoke with Tha Best Sound In Town kickoff night',
    'Karaoke with Tha Best Sound In Town late night',
    'Karaoke with Tha Best Sound In Town night',
    'Karaoke with Tha Best Sound In Town Thursday',
    'Karaoke with Tha Best Sound In Town first Thursday',
    'Friday Karaoke with Tha Best Sound In Town kickoff',
    'Astros Friday Karaoke with Tha Best Sound In Town',
    'Friday Karaoke with Tha Best Sound In Town night',
    'First Friday Karaoke with Tha Best Sound In Town',
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
    'Friday Karaoke with Tha Best Sound In Town at Skoltz',
    'Next Friday Karaoke with Tha Best Sound In Town',
    'Rockets watch party',
    'Texans fan night'
  );

delete from public.sports_games
where
  category in ('astros', 'rockets', 'texans', 'mlb', 'nba', 'nfl')
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
where
  title ilike '%pool%'
  or lower(title) in ('game day special', 'gameday special');

with schedule as (
  select
    current_date + (((5 - extract(dow from current_date)::int + 7) % 7))::int as next_friday
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
        'Friday Karaoke with Tha Best Sound In Town at Skoltz',
        'Friday drink specials are on during karaoke at Skoltz.',
        schedule.next_friday,
        time '21:30',
        schedule.next_friday + 1,
        time '01:30',
        array['karaoke']::text[],
        'Skoltz'
      ),
      (
        'Friday Karaoke with Tha Best Sound In Town at Skoltz',
        'Friday drink specials are on during karaoke at Skoltz.',
        schedule.next_friday + 7,
        time '21:30',
        schedule.next_friday + 8,
        time '01:30',
        array['karaoke']::text[],
        'Skoltz'
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
  select 1
  from public.events
  where
    public.events.start_time = seed.start_time
    and public.events.end_time = seed.end_time
    and public.events.categories = seed.categories
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
