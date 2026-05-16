# Skoltz

Skoltz is a Next.js PWA-first app for sports-bar events, rewards, auth, and check-ins. The app uses Tailwind CSS, shadcn/ui conventions, TanStack Query, and Supabase.

## Install

```bash
npm install
```

## Environment Variables

Create a local `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Only use the Supabase project URL and anon/public key in frontend or Vercel environments. Never use privileged server keys in this app.

## Local Development

```bash
npm run dev
```

Open the local Next.js URL printed by the dev server.

## Validation

```bash
npm run lint
npm run build
```

## Supabase SQL

Run these scripts in the Supabase SQL Editor before validating a preview deployment:

1. `supabase/supabase_schema.sql`
2. `supabase/seed_data.sql`

The schema script creates the required tables, constraints, indexes, and RLS policies. The seed script adds starter events, a sports game, and rewards.

## Vercel Deployment

1. Create or open the Vercel project.
2. Add these Preview environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy or redeploy the preview.
4. Run the checklist in `docs/DEPLOYMENT_VALIDATION.md`.

## Package Scripts

- `npm run dev` - start local development
- `npm run lint` - run ESLint
- `npm run build` - build for production
- `npm run start` - start the production server after building
