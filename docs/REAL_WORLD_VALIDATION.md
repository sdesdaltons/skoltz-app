# Real-World Validation Findings

Date: 2026-05-15

## Deployment URL

Not available from this environment.

Vercel deployment was not executed because this shell does not have:

- Vercel CLI access
- `VERCEL_TOKEN`
- configured Vercel project context
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase SQL Execution

Not executed from this environment.

The Supabase SQL scripts require access to the target Supabase project:

- `supabase/supabase_schema.sql`
- `supabase/seed_data.sql`

The Supabase project URL and publishable key from `supabase/info.txt` were used for anon-client validation only. The secret-looking value in that file was not used and should not be committed.

Current public API result after re-check:

- `events` read failed: table not found in PostgREST schema cache.
- `rewards` read failed: table not found in PostgREST schema cache.
- `sports_games` read failed: table not found in PostgREST schema cache.
- unauthenticated `checkins` insert was blocked, but only because the table was not found.
- invalid `events` category insert was blocked, but only because the `events` table was not found.

Conclusion: the Supabase project is reachable, but `supabase/supabase_schema.sql` has not been applied successfully to this project yet, or PostgREST has not refreshed after schema creation.

Local SQL execution blocker:

- `psql` is not installed in this environment.
- No authenticated Supabase dashboard or management API access is available from this shell.

## Local Validation Completed

- `npm run lint` passed.
- `npm run build` passed.
- Production build includes:
  - `/`
  - `/login`
  - `/account`
  - `/rewards`

## Seeded Data Verification

Blocked pending Supabase SQL execution and Vercel preview deployment.

Items still requiring deployed-app verification:

- Astros event appears.
- Karaoke with Tha Best Sound In Town event appears.
- pool event appears.
- rewards list appears.

## Real Device Tests

Not executed from this environment.

Requires physical or remotely accessible devices:

- iPhone Safari
- Android Chrome

Pending checks:

- PWA install flow
- auth persistence after refresh
- login/logout flow
- protected route redirects
- bottom nav safe area
- offline banner
- geolocation permission flow
- duplicate check-in prevention
- offline check-in prevention

## Network Chaos Tests

Not executed from this environment.

Pending checks:

- Slow 3G
- offline
- reconnect
- hard refresh protected routes

## RLS Abuse Tests

Partially attempted through the public Supabase REST API.

Current result:

- unauthenticated check-in insert failed with `PGRST205`, because `public.checkins` does not exist in the schema cache.
- invalid category insert failed with `PGRST205`, because `public.events` does not exist in the schema cache.

Pending after schema initialization:

- unauthenticated check-in insert fails due to RLS, not missing table.
- wrong-user insert attempt fails.
- repeat check-in within 12 hours fails due to the `checkins_12_hour_cooldown` trigger.
- invalid category insert fails due to category check constraint.

## Blockers Found

Operational blockers only:

- No deployment credentials or Vercel project access available in this shell.
- Supabase public credentials were provided in `supabase/info.txt`, but the required public tables are not currently visible through the Supabase REST API.
- Supabase SQL execution still requires SQL Editor/database access.
- Local `psql` is unavailable, so the SQL scripts could not be applied from this machine.
- No real iPhone Safari or Android Chrome device access available in this shell.

## Fixes Applied

None. No code blockers were found during local validation.

## Remaining Operational Risks

- Supabase SQL may fail if the target project lacks required permissions or extensions.
- Seeded data cannot be verified until SQL is run against the real project and the tables appear through the REST API.
- RLS enforcement cannot be verified until the real Supabase project has the expected tables and policies.
- Auth persistence and geolocation behavior must be verified on real devices.
- Duplicate check-in prevention depends on the unique index being applied successfully.
