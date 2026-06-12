# Deployment Validation

This checklist prepares Skoltz for Supabase enforcement validation and Vercel preview testing. Do not expand product scope during this pass.

## Supabase Setup

1. Open the target Supabase project.
2. Go to SQL Editor.
3. Open `supabase/supabase_schema.sql` from this repo.
4. Paste the full file into SQL Editor.
5. Run the script.
6. Confirm the following tables exist:
   - `public.events`
   - `public.rewards`
   - `public.checkins`
   - `public.sports_games`
7. Open `supabase/seed_data.sql` from this repo.
8. Paste the full file into SQL Editor.
9. Run the seed script.
10. Confirm starter rows exist for:
    - Astros event
    - Karaoke with Tha Best Sound In Town event
    - pool event
    - Astros sports game
    - 3 rewards

## Vercel Preview Setup

1. Open the Vercel project.
2. Go to Settings -> Environment Variables.
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Use the Supabase project URL and anon/public key only.
5. Do not add privileged server keys to Vercel.
6. Save the variables for Preview deployments.
7. Trigger a new preview deploy.
8. If a preview already exists, redeploy after adding env vars.

## Supabase Enforcement Checklist

Run these checks in Supabase SQL Editor or through controlled client requests.

### Public Reads

- `events` public `SELECT` works for unauthenticated users.
- `rewards` public `SELECT` works for unauthenticated users.
- `sports_games` public `SELECT` works for unauthenticated users.

### Check-In Writes

- `checkins` unauthenticated `INSERT` fails.
- `checkins` authenticated `INSERT` succeeds only when `user_id = auth.uid()`.
- `checkins` wrong-user `INSERT` fails.
- repeat check-in within 12 hours for the same user fails through `checkins_12_hour_cooldown`.
- duplicate failure maps to the frontend `DUPLICATE` message.

### Event Constraints

- inserting an event with an invalid category fails.
- inserting an event with an empty category array fails.
- inserting an event with `end_time <= start_time` fails.

## Device Testing Checklist

Test the Vercel preview on real devices.

### iPhone Safari

- Homepage loads.
- Calendar/event browsing works as guest.
- Login route loads.
- Auth session persists after refresh.
- Protected `/account` refresh does not flicker protected content.
- Protected `/rewards` refresh does not flicker protected content.
- Offline banner appears when offline.
- Check-in geolocation prompt appears.
- Bottom nav respects safe-area inset.
- PWA install/add-to-home-screen flow works.

### Android Chrome

- Homepage loads.
- Calendar/event browsing works as guest.
- Login route loads.
- Auth session persists after refresh.
- Protected `/account` refresh does not flicker protected content.
- Protected `/rewards` refresh does not flicker protected content.
- Offline banner appears when offline.
- Check-in geolocation prompt appears.
- Bottom nav is not covered by system navigation.
- PWA install flow works.

## Network Chaos Checklist

Use browser dev tools or real device network controls.

- Slow 3G: homepage remains readable while loading.
- Slow 3G: rewards loading state remains stable.
- Offline: offline banner appears.
- Offline: check-in button is disabled.
- Offline: protected route reload does not enter redirect loop.
- Reconnect: offline banner disappears.
- Reconnect: retry buttons work.
- Reload `/account` while authenticated.
- Reload `/rewards` while authenticated.
- Reload `/account` while unauthenticated.
- Reload `/rewards` while unauthenticated.

## Vercel Preview Acceptance

The preview is acceptable for the next validation stage when:

- `npm run lint` passes locally.
- `npm run build` passes locally.
- Vercel preview build passes.
- Guest browsing works without login.
- Protected routes redirect unauthenticated users.
- Authenticated users can reach `/account` and `/rewards`.
- Rewards catalogue reads from Supabase.
- Check-in writes only to `checkins`.
- Duplicate check-ins are rejected by the database.
- No privileged server keys are present in frontend or Vercel public env vars.

## Do Not Validate Yet

These are intentionally out of scope:

- reward redemption
- admin writes
- pool queue
- realtime subscriptions
- profiles table behavior
- points ledger behavior
- native app store flows
