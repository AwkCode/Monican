# Monican Launch Checklist

Everything below requires accounts, payments, or secrets — code is already shipped and waiting.
Ordered by impact. Items marked 🔴 block revenue; 🟠 block growth; 🟡 polish.

---

## 🔴 1. Recreate the Supabase project (~20 min) — BLOCKS: auth, demo form, analytics events, cron agent

The old project (`ecbquabpmmhjycsymnhf.supabase.co`) no longer resolves — it was deleted or
removed after a long free-tier pause. **Login/signup on the live site are broken right now because of this.**

1. [supabase.com](https://supabase.com) → New project (free tier is fine to start)
2. SQL Editor → run each file in `conduit-ai-platform/supabase/migrations/` **in order**:
   `001_platform_schema.sql` → `004_signals.sql` → `20260420_workflow_marketplace.sql` → `20260611_funnel_events.sql`
3. Project Settings → API: copy the URL, `anon` key, and `service_role` key
4. Update **Vercel → conduit-ai-platform → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = new URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = new anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = new service_role key  ← new var, cron needs it
5. Update `conduit-ai-platform/.env.local` with the same URL + anon key (NOT service key)
6. Redeploy. Test: sign up with a throwaway email; submit the /book form; confirm rows appear
   in `demo_requests`.

## 🔴 2. Set the AI + cron env vars in Vercel (~5 min) — BLOCKS: wizard AI search, cron agent

- `ANTHROPIC_API_KEY` = fresh key from [console.anthropic.com](https://console.anthropic.com)
  (rotate any key previously pasted in chat). Cost guard: /api/search is rate-limited
  (15/min/IP) and cached 1h; expect pennies/day at current traffic.
- `CRON_SECRET` = any long random string (`openssl rand -hex 32`). Vercel automatically
  sends it to the cron route once set.

## 🔴 3. Demo-request notifications (~10 min) — BLOCKS: hearing about leads fast

Requests already land in the `demo_requests` table, but you want a ping:
- [resend.com](https://resend.com) free tier → API key
- Vercel env: `RESEND_API_KEY`, `NOTIFY_EMAIL` (your real inbox)
- Until a custom domain is verified in Resend, notifications send from
  `onboarding@resend.dev` and can only deliver to the email you signed up with — fine for now.

## 🟠 4. Affiliate enrollment (~45 min total) — BLOCKS: commission revenue ($0 until done)

Current links carry `?ref=monican`, which pays nothing without enrollment.
- **n8n** — apply at [n8n.io/affiliates](https://n8n.io/affiliates/) (30% of cloud referrals for 12 mo).
  On approval set Vercel env `NEXT_PUBLIC_AFFILIATE_N8N` to your issued code.
- **Make** — apply via [help.make.com/affiliate-program](https://help.make.com/affiliate-program)
  (35% for 12 mo). Set `NEXT_PUBLIC_AFFILIATE_MAKE`.
- **Zapier** — apply to the [Solution Partner Program](https://zapier.com/l/partners)
  (PartnerStack-based). Set `NEXT_PUBLIC_AFFILIATE_ZAPIER`.
- Note: if a program issues full replacement URLs (PartnerStack often does) instead of a
  ref param, say so in a session and we'll extend `src/lib/affiliate.ts` to support
  per-platform link templates.
- GPT Store / Claude Skills have no affiliate programs — those links are pure curation value.

## 🟠 5. Domain + email (~30 min + ~$70-90/yr) — BLOCKS: brand trust

- monican.ai has no DNS records (likely unregistered). Buy it — or pick a cheaper
  .com variant — then:
  - Vercel → Domains → add it to the project
  - Set Vercel env `NEXT_PUBLIC_SITE_URL=https://yourdomain` (sitemap/canonicals pick it up)
  - Email: simplest is [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/)
    (free) forwarding daniel@yourdomain → gmail; then set
    `NEXT_PUBLIC_CONTACT_EMAIL=daniel@yourdomain` and verify the domain in Resend
- Until then the site intentionally shows danielweadock@gmail.com (works, just less polished).

## 🟠 6. Turn on Vercel Web Analytics (~2 min)

Vercel dashboard → conduit-ai-platform → Analytics → Enable. The `<Analytics />`
component is already in the layout. First-party events (affiliate clicks, searches,
no-match queries) flow into the Supabase `events` table automatically once #1 is done.

## 🟠 7. Google Search Console (~15 min) — BLOCKS: SEO compounding

- [search.google.com/search-console](https://search.google.com/search-console) → add property
  → verify via Vercel DNS or HTML tag
- Submit `https://conduit-ai-platform.vercel.app/sitemap.xml` (or the new domain's)
- 463 static pages (92 roles + 371 workflows) are pre-rendered and waiting to be indexed.

## 🟡 8. Google OAuth verification (when first real client connects Gmail)

- Cloud Console → OAuth consent screen: add links to `/privacy` and `/terms` (both live now)
- Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` in Vercel
- Unverified apps cap at 100 test users — fine for the first clients.

## 🟡 9. Try the cron agent end-to-end (after #1 + #2)

1. Sign up, connect Gmail in /settings, activate Past Client Reactivator in /modules
2. Upload a past-client CSV with a birthday in the next 7 days
3. Trigger manually: `curl -H "Authorization: Bearer $CRON_SECRET" https://<site>/api/cron/past-client`
4. Check your Gmail drafts folder. Scheduled run is Mondays 13:00 UTC.

---

### Env var quick reference (Vercel)

| Var | Status | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🔴 stale — replace | everything DB |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 missing | cron agent |
| `ANTHROPIC_API_KEY` | 🔴 missing | wizard search, cron drafting |
| `CRON_SECRET` | 🔴 missing | cron auth |
| `RESEND_API_KEY` + `NOTIFY_EMAIL` | 🟠 missing | demo-request pings |
| `NEXT_PUBLIC_AFFILIATE_N8N` / `_MAKE` / `_ZAPIER` | 🟠 placeholder | commissions |
| `NEXT_PUBLIC_SITE_URL` | 🟡 defaults to vercel.app | sitemap/canonical |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 🟡 defaults to gmail | site contact |
| `GOOGLE_CLIENT_ID` / `_SECRET` / `_REDIRECT_URI` | 🟡 missing | Gmail OAuth |
