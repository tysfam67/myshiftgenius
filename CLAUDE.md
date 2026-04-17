# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MyShiftGenius** is an AI-powered employee scheduling SaaS for franchise operators. It manages multi-location scheduling, labor compliance, employee availability, and billing — currently an early MVP with core UI and auth infrastructure in place.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

No test framework is configured yet.

## Architecture

### Tech Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** for styling
- **Supabase** (PostgreSQL + Auth via `@supabase/ssr`) for data and authentication
- **Stripe** for subscription billing (founders + standard plans)
- Deployed on **Vercel**

### Route Layout

| Route Pattern | Purpose |
|---|---|
| `/` | Public landing page |
| `/pricing` | Pricing page |
| `/auth/*` | Signup / login |
| `/(app)/*` | Authenticated operator dashboard (sidebar layout) |
| `/portal/*` | Employee self-service portal (shared-link access) |
| `/api/*` | API routes (auth signout, Stripe checkout/webhooks) |

The `(app)` route group uses a sidebar layout (`src/app/(app)/layout.tsx`). The `portal` route group has its own tab-based header layout. These are entirely separate UX surfaces.

### Multi-Tenancy

All data is scoped by `client_id` (a text slug, e.g. `'jersey_mikes'`). Every database table joins on `client_id`. The `mss_users` table maps Supabase `auth.users` → `client_id` with RLS so users only see their own tenant row.

Currently `client_id` is hardcoded to `'jersey_mikes'` in the signup flow — dynamic multi-tenant provisioning is not yet implemented.

### Supabase Client Pattern

Use the correct client depending on context:
- `src/lib/supabase.ts` — `createClient()` for **browser/client components**
- `src/lib/supabase-server.ts` — `createServerClient()` for **server components and API routes**

### Key Types (`src/types/index.ts`)

Core domain models: `Client`, `Location`, `Employee`, `Schedule`, `ScheduleShift`, `SchedulingRules`, `TimeOffRequest`, `RecurringUnavailability`, `PortalSession`.

Key enumerations:
- `management_tier`: `'GM' | 'AM' | 'SL' | 'TM'`
- Schedule status: `'pending' | 'generated' | 'published'`
- Time-off status: `'pending' | 'approved' | 'denied'`
- Billing tier: `'trial' | 'active' | 'cancelled'`
- Dates as `YYYY-MM-DD`, times as `HH:MM` (24-hour)

### Billing Model

- **Trial:** 30-day free period on signup
- **Founders Plan:** $39/location/month for first 12 months (Stripe subscription schedule)
- **Standard Plan:** $49/location/month after founders period
- Stripe webhook (`/api/stripe/webhook`) handles `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted` to sync `billing_tier` in `gb_clients`

## Implementation Status

**Working:** Auth (Supabase email/password), multi-tenant routing, sidebar/portal layouts, Stripe checkout and webhook handling, billing tier sync, all UI pages (read-only display).

**UI only, no backend yet:** Location/employee CRUD, schedule generation, scheduling rules save, employee availability and time-off submission, portal session authentication.

**Not started:** Schedule generation algorithm, email notifications, analytics.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_FOUNDERS=
STRIPE_PRICE_ID_STANDARD=
NEXT_PUBLIC_APP_URL=
```

The `mss_users` table SQL (with RLS policy) is in `supabase_mss_users.sql`. Other tables (`gb_clients`, `gb_locations`, `gb_employees`, `gb_scheduling_rules`, `gb_schedules`, `gb_schedule_shifts`, `time_off_requests`, `recurring_unavailability`) are not in SQL migration files — their schemas are inferred from TypeScript types.

## Conventions

- **Server Components** by default; add `'use client'` only when needed (event handlers, hooks, browser APIs)
- **Forms:** HTML `<form action="/api/...">` for server mutations; `useState` for client-side UI state — no form library
- **Styling:** Indigo primary (`indigo-600`), slate grays for backgrounds; no CSS modules
- **Path alias:** `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- `src/lib/constants.ts` holds app-wide constants (pricing amounts, nav items, role labels)
