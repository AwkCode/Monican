# Monican — Project Context

## CURRENT DIRECTION (read this first — updated June 2026)

**Monican is an AI workflow marketplace/aggregator + done-for-you setup service.**

The product: a curated library of ~371 AI workflows across ~92 roles and 41 industries, organized by JOB (not by app). Workflows are sourced from n8n, Zapier, Make, GPT Store, and Claude Skills (affiliate links) plus Monican's own designs (funnel to done-for-you setup). Revenue = setup services ($500 Quick Win / $1,500 Pilot / $750-mo Retainer) + affiliate commissions once enrolled.

**The old multi-tenant n8n platform plan (PLATFORM_PLAN.md) is superseded.** Keep the file for history, but don't execute from it.

**The app lives in `conduit-ai-platform/`** (Next.js 14 App Router + Supabase). Live at https://conduit-ai-platform.vercel.app (Vercel project name predates the Monican rebrand).

**⚠️ Read `LAUNCH_CHECKLIST.md` before any session** — it lists the manual steps (Supabase project recreation, env vars, domain, affiliate enrollment) that code alone can't do, and what's blocked on them.

### Known state (June 11, 2026)
- The original Supabase project (`ecbquabpmmhjycsymnhf`) **no longer resolves** — auth/login/modules on the live site fail until a new project is created and migrations are re-run (checklist item #1).
- The marketplace itself (landing, wizard local-match, /roles, role + workflow pages, affiliate redirects) is static and works without Supabase.
- `ANTHROPIC_API_KEY` is not set in Vercel → wizard AI search falls back to local fuzzy matching; cron agent won't run.
- Demo form posts to `/api/demo-requests` (Supabase `demo_requests` table); fails gracefully to a mailto fallback until the DB exists.
- Affiliate links carry `?ref=monican` but **no affiliate program enrollment exists yet** → $0 until checklist items are done.

## What This Is (Business Model)

1. **Now:** Consulting engagements — $500 Quick Wins, $1,500 Pilots, $750/mo retainers — sold through the marketplace funnel (see /pricing)
2. **Compounding:** Affiliate commissions on sourced workflows (n8n 30%/12mo, Make 35%/12mo, Zapier partner program)
3. **Later:** Productize the Monican-built agents that sell repeatedly (Past Client Reactivator cron agent is the first — already coded)

## Strategy guardrails (agreed June 2026)

- **Depth over breadth.** Do NOT add more roles/workflows to seed.ts until analytics show demand. Demand signals: `events` table (`search_no_match`), `demo_requests.missing_role`.
- **No fabricated social proof.** Ratings were removed June 2026 — never re-add fake ratings, review counts, or invented user metrics. Savings figures are estimates and must stay labeled "est."
- **Sell first, build on demand.** A "Monican" workflow gets built for real when someone pays for setup. Don't pre-build speculatively.
- **Own what's differentiated** (Signal Engine-style agents). Curate what isn't (Zapier/n8n territory).

## Daniel's Background

- Recent Merrimack College grad (BS Business Admin, Corporate Finance)
- CFO at Kings Court LLC — built a full-stack Next.js + Supabase app with Claude Code
- Former Northwestern Mutual financial rep (insurance sales, cold calling)
- Built SolEdge autonomous crypto trading system
- Based in Boston, MA. Partner: Evan (shared dashboard access)

## Tech Stack

| Layer | Tech |
|---|---|
| App | Next.js 14 (App Router) on Vercel — `conduit-ai-platform/` |
| Auth + DB | Supabase (Postgres + RLS) — needs new project, see checklist |
| Catalog | Static seed data: `src/lib/marketplace/seed.ts` (the single source of truth) |
| AI | Claude Haiku 4.5 (`claude-haiku-4-5`) — wizard search + email drafting |
| Agent runtime | Vercel cron (`vercel.json`) → `/api/cron/past-client`. n8n only for legacy manual client setups |
| Analytics | Vercel Analytics + first-party `events` table |
| Email notify | Resend (env-gated, optional) |

## Key Files

### Platform (`conduit-ai-platform/`)
- `src/lib/marketplace/seed.ts` — the catalog (industries, roles, workflows). Edit here to change the library.
- `src/lib/affiliate.ts` — affiliate URL building; codes come from `NEXT_PUBLIC_AFFILIATE_*` env vars
- `src/lib/site.ts` — contact email + site URL constants (env-overridable)
- `src/app/api/cron/past-client/route.ts` — the Past Client Reactivator agent (Mondays 13:00 UTC)
- `supabase/migrations/` — run ALL of these on the new Supabase project, in order
- `LAUNCH_CHECKLIST.md` (repo root) — manual steps + env var reference

### Consulting collateral (still used for sales)
- `01_Discovery_Call_Framework.md`, `02_Service_Menu_and_Pricing.md` (pricing page mirrors this)
- `prospects.xlsx`, `outreach_drafts/`, `call_prep/`, `proposals/`

## Agent Commands

### "Where are we / what should we work on"
- Read `LAUNCH_CHECKLIST.md` — anything unchecked and unblocked is the priority
- Check Supabase `events` + `demo_requests` tables for demand signals (once DB exists)

### "Add a new role/industry" (only when demand shows)
- Add to `INDUSTRIES` / `ROLES` / `WORKFLOWS` in `src/lib/marketplace/seed.ts`
- Role pages, workflow pages, sitemap, and stats all derive from seed — no other edits needed
- Keep workflows role-specific (named tools, domain language), savings honest, no ratings

### "Make a Monican workflow real" (after a sale)
- Pattern: follow `/api/cron/past-client` — Vercel cron + Supabase + Claude + Gmail-draft proxy
- Never auto-send email; drafts only

### Consulting-era commands (still work)
- "Find prospects" → web search, add to `prospects.xlsx` (independents HIGH priority)
- "Prep me for a call with [agency]" → `call_prep/[name]_prep.md`
- "Write a proposal for [agency]" → `proposals/[name]_proposal.md`

## Tone

Daniel is early-career, hungry, and scrappy. Be direct, practical, and action-oriented. No fluff. Every suggestion ends with a specific next step.

Daniel gets frustrated when sessions go in circles or when Claude introduces unnecessary steps. If something works, don't touch it. If a plan is decided, execute — don't re-litigate.

Daniel prefers honest reality checks over optimistic hand-waving. When a plan hits a wall, flag it immediately and propose alternatives.

## Security Notes

- Remind Daniel to rotate any API key that gets pasted into chat.
- Supabase `anon` key ships in client code (RLS protects data). `service_role` key: Vercel env vars ONLY (used by `src/lib/supabase/service.ts` for cron).
- `/api/search` is public and calls Claude — it has per-IP rate limiting; keep it.
- Funnel tables (`demo_requests`, `email_signups`, `events`) are anon-INSERT-only by design; read them via the Supabase dashboard.
- Gmail OAuth: draft/modify scopes only, never send. Tokens server-side only.
- `CRON_SECRET` required for the cron route; Vercel sends it automatically once set.
