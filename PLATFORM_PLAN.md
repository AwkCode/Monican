# Monican Platform — Master Plan

**Last updated:** 2026-04-09
**Status:** Planning → Phase 1 (Foundation) next session
**Owner:** Daniel Weadock

---

## 0. Vision

**Monican is an agency that builds AI agent suites for every industry.** Real estate is the first vertical. Legal, dental, insurance, and others follow.

**Tagline:** *"AI agent suites for any industry. Sign up, set your profile, your agents are running in 10 minutes."*

**The product:** A platform where a professional (real estate broker, lawyer, dentist, etc.) can:
1. Sign up with email and password
2. Fill out their profile (name, business, voice samples, signature block)
3. Toggle on the agents they want (Lead Responder, Past Client Reactivator, Signal Engine, etc.)
4. Connect their Gmail, Google Sheets, CRM via OAuth
5. See their agents running live within minutes — no n8n, no technical setup

**Why this beats consulting:**
- Consulting is linear: one client at a time, manual setup per client
- Platform is compounding: each new client is plug-and-play, same architecture serves all
- Demo moment: "Watch me onboard a new broker in 10 minutes, live" — that's the pitch
- Eventual goal: other industries get their own suite page (`/real-estate`, `/legal`, `/dental`, etc.)

---

## 1. Architecture

### 1.1 Tech Stack

| Layer | Tech | Responsibility |
|---|---|---|
| **Frontend + Auth** | Next.js 14 on Vercel + Supabase Auth | Signup, login, profile management, module toggles, dashboard |
| **Database** | Supabase Postgres | Single source of truth: clients, modules, credentials refs, activity logs |
| **Agent Runtime** | n8n Cloud | Visual workflows that execute agent logic (Claude calls, scheduled jobs, scrapers) |
| **Credential Proxy** | Vercel API routes | Handles Gmail/Sheets/CRM OAuth, holds tokens, proxies actions for n8n |
| **AI Brain** | Anthropic Claude API | All language work (classification, drafting, summarizing) |
| **File Storage** | Supabase Storage | Voice samples, logo uploads, uploaded CSVs |

### 1.2 The Credential Problem and the Solution

**The problem:** n8n Cloud stores credentials (Gmail OAuth, Google Sheets OAuth) at the workspace level. One Gmail connection per workspace. This does not scale to multi-client.

**The solution: Vercel owns credentials, n8n does the thinking.**

When a client signs up via Vercel:
1. They authorize Gmail access via Supabase Auth's Google provider
2. Vercel stores the OAuth refresh token in Supabase (row-level secured)
3. When n8n needs to create a Gmail draft for client X, n8n does NOT call Gmail directly
4. Instead, n8n fires an HTTP POST to `monican-dashboard.vercel.app/api/gmail/draft/{client_id}` with the draft content
5. Vercel's API route fetches the client's OAuth token from Supabase, refreshes if needed, calls the Gmail API, and creates the draft in the client's actual Gmail account
6. Returns success to n8n

**Result:**
- Every Gmail action for every client flows through Vercel
- n8n never holds credentials
- Adding a new client adds ZERO n8n configuration work
- Same pattern applies to Google Sheets, HubSpot, Follow Up Boss, any future integration

### 1.3 The n8n Duplication Strategy

**Each client gets their own cloned n8n workflow per module.** This is different from the "dynamic lookup" pattern and Daniel explicitly chose it.

**Why duplication instead of one workflow with dynamic client lookups:**
- Failure isolation: if one client's workflow breaks, others keep running
- Simpler mental model when debugging
- Each workflow can be independently customized if a client has unique needs
- Still automated — Vercel calls n8n's API to clone templates, so Daniel never manually touches n8n

**How it works on new client signup:**
1. Client signs up and enables the Lead Responder module in Vercel
2. Vercel API calls n8n's REST API: `POST /workflows` with the template workflow JSON
3. Vercel patches client-specific values: webhook path, system prompt (name, brokerage, phone), Google Sheet ID
4. Vercel activates the new workflow: `POST /workflows/{id}/activate`
5. Vercel stores the new workflow ID and webhook URL in Supabase under the client's row
6. Client can immediately start receiving leads at their unique webhook URL

**n8n template workflows (one per module):**
- `template_lead_responder` — cloned for every client who enables Lead Responder
- `template_past_client_reactivator` — cloned for every client who enables Past Client Reactivator
- `template_signal_engine` — cloned for every client who enables Signal Engine

Each template has placeholder variables (`{{CLIENT_NAME}}`, `{{CLIENT_BROKERAGE}}`, `{{CLIENT_PHONE}}`, `{{CLIENT_SHEET_ID}}`, `{{CLIENT_ID}}`) that Vercel replaces during the clone.

### 1.4 Data Flow Diagram

```
CLIENT SIGNS UP
    ↓
Vercel /signup page
    ↓
Supabase Auth creates user
    ↓
Vercel creates row in `clients` table with default profile
    ↓
Client fills out /profile page
    ↓
Client toggles on Lead Responder module
    ↓
Vercel calls n8n API → clones template_lead_responder
    ↓
Vercel patches client-specific values into cloned workflow
    ↓
Vercel activates workflow
    ↓
Vercel stores workflow_id + webhook_url in Supabase
    ↓
CLIENT IS LIVE
    ↓
Lead arrives → client's webhook URL → cloned workflow runs → Claude drafts reply →
n8n POSTs to Vercel /api/gmail/draft/{client_id} → Vercel creates draft in client's Gmail
```

---

## 2. Supabase Schema

### 2.1 Core tables

```sql
-- Users (managed by Supabase Auth, auto-created)
-- We reference auth.users(id) for foreign keys

-- Clients: one row per signed-up professional
CREATE TABLE clients (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  business_name TEXT,
  business_address TEXT,
  industry TEXT DEFAULT 'real_estate',
  role TEXT,                          -- e.g. "Broker", "Agent"
  towns_served TEXT[],                -- array of towns/cities
  school_district TEXT,
  years_in_business INTEGER,
  voice_sample TEXT,                  -- paste of their writing style
  signature_block TEXT,               -- how they sign emails
  timezone TEXT DEFAULT 'America/New_York',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules: which agents each client has enabled
CREATE TABLE client_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,           -- 'lead_responder' | 'past_client' | 'signal_engine'
  enabled BOOLEAN DEFAULT FALSE,
  n8n_workflow_id TEXT,               -- ID of the cloned workflow in n8n
  n8n_webhook_url TEXT,               -- full URL for webhook-triggered modules
  config JSONB,                       -- per-module settings (e.g., which signals to track)
  activated_at TIMESTAMPTZ,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, module_key)
);

-- OAuth credentials stored encrypted
CREATE TABLE client_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,             -- 'gmail' | 'google_sheets' | 'hubspot'
  access_token TEXT,                  -- encrypted
  refresh_token TEXT,                 -- encrypted
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, provider)
);

-- Activity log: every agent action, every event
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  module_key TEXT,
  event_type TEXT,                    -- 'lead_received' | 'draft_created' | 'error'
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads: every lead processed by Lead Responder (per client)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  source TEXT,                        -- 'zillow', 'website', etc.
  lead_name TEXT,
  lead_email TEXT,
  lead_phone TEXT,
  original_message TEXT,
  lead_type TEXT,                     -- 'showing_request' | 'buyer_inquiry' | etc.
  quality TEXT,                       -- 'hot' | 'warm' | 'cool'
  signals TEXT[],
  draft_subject TEXT,
  draft_body TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Past clients (for Past Client Reactivator module, per client)
CREATE TABLE past_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  property_address TEXT,
  transaction_type TEXT,
  closing_date DATE,
  birthday DATE,
  tags TEXT,
  last_contacted DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Row-Level Security

Every table enables RLS. Every policy ensures clients can only read/write their own rows:

```sql
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_own_row" ON clients
  FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Repeat similar policies for every table (match on client_id = auth.uid())
```

---

## 3. Phased Roadmap

### Phase 1: Foundation (Next 1-2 Sessions)

**Goal:** Replace the static HTML dashboard with a proper Next.js app that has real auth.

**Deliverables:**
1. New Next.js 14 project in a fresh GitHub repo: `monican-platform`
2. Supabase `clients`, `client_modules`, `client_credentials`, `activity_log`, `leads`, `past_clients` tables created with RLS
3. Supabase Auth enabled (email/password)
4. Pages built:
   - `/` — landing page (marketing intro)
   - `/signup` — create account
   - `/login` — sign in
   - `/dashboard` — authenticated home, shows active modules
   - `/profile` — edit personal + business info
   - `/modules` — toggle modules on/off (but actual activation doesn't work yet)
5. Port existing static pages into Next.js:
   - ROI Calculator → `/tools/roi-calculator`
   - Prospect Pipeline → `/internal/pipeline` (admin only, for Daniel and Evan)
6. Deploy to Vercel at `monican-platform.vercel.app` (new URL — the old static one stays up as a reference)
7. Landing page links to signup, dashboard shows profile completion status

**Out of scope for Phase 1:**
- Actual n8n workflow cloning (Phase 2)
- Gmail OAuth (Phase 3)
- Any module logic that touches real data (Phase 2+)

**Time estimate:** 3-5 hours of focused work

### Phase 2: Lead Responder Migration

**Goal:** Turn the existing Lead Responder n8n workflow into a template that Vercel can clone per client, and wire up the first end-to-end multi-tenant flow.

**Deliverables:**
1. Rename current `Lead Responder v1` workflow in n8n to `template_lead_responder`
2. Refactor the workflow's system prompt and Google Sheet ID to use placeholder variables (`{{CLIENT_NAME}}`, `{{CLIENT_BROKERAGE}}`, `{{CLIENT_SHEET_ID}}`, etc.)
3. Get an n8n API key and store it as a Vercel environment variable
4. Build Vercel API route `/api/modules/lead-responder/activate` that:
   - Reads the authenticated user's profile from Supabase
   - Calls n8n API to clone `template_lead_responder`
   - Patches client-specific values into the clone
   - Creates a per-client Google Sheet for leads (via Google Sheets API)
   - Activates the workflow
   - Writes the workflow_id + webhook_url back to `client_modules` table
5. Build `/modules/lead-responder` page in the Next.js app where a client clicks "Enable" and watches the activation happen live
6. Test end-to-end: Daniel creates a test account, enables Lead Responder, sees a new workflow appear in n8n, fires a test lead at the new webhook URL, sees the draft created and logged to Supabase

**Out of scope for Phase 2:**
- Gmail draft creation (still uses the shared n8n Gmail credential at this phase — can create drafts in one test inbox)
- Per-client Gmail integration (Phase 3)

**Time estimate:** 4-6 hours

### Phase 3: Gmail OAuth Proxy + Past Client Reactivator Migration

**Goal:** Make Gmail draft creation actually happen in each client's Gmail account, and migrate Past Client Reactivator to the new platform.

**Deliverables:**
1. Set up Google Cloud Console OAuth credentials for Monican Platform
2. Implement Supabase Auth Google provider (so clients can "Connect Gmail" with one click)
3. Build Vercel API route `/api/gmail/draft` that accepts `{client_id, subject, body, to}` and creates a draft in the named client's Gmail
4. Modify `template_lead_responder` workflow to replace the Gmail node with an HTTP Request node pointing to the new Vercel endpoint
5. Same refactor for `template_past_client_reactivator`
6. Build per-client Past Clients CSV upload flow in Next.js
7. Test end-to-end with two different test Gmail accounts — verify drafts land in the correct inbox
8. Migrate Eileen Fitzpatrick's data into the new platform as the first "real" client

**Out of scope for Phase 3:**
- Signal Engine (Phase 4)
- Other industries (Phase 5)

**Time estimate:** 5-7 hours

### Phase 4: Signal Engine (Real Estate)

**Goal:** Build the multi-source lead intelligence dashboard, multi-tenant from day 1.

**Sources we verified as scrapeable:**
- Bolton AxisGIS ArcGIS REST endpoint (ownership data, scale to all target towns)
- Legacy.com Worcester County obituaries (estate signal — internal use only, legal caveats apply)

**Sources to add later via paid APIs (bundled into retainer pricing):**
- PropertyRadar or BatchLeads ($79-99/month) for probate, pre-foreclosure, divorce

**Deliverables:**
1. Python scraper service on Vercel Functions that hits AxisGIS REST API for each client's towns_served
2. Ownership milestone detection (5-year, 10-year marks)
3. Supabase table `signals` stores all raw signal data
4. Daily digest cron: every morning at 6am, a scheduled Vercel function aggregates new signals for each client and sends them a digest email
5. Client-facing `/signals` page showing a ranked list of opportunities with confidence scores
6. "Draft Letter" button next to each opportunity — calls Claude to generate a tactful outreach letter

**Time estimate:** 8-12 hours

### Phase 5: Beyond Real Estate

**Goal:** Generalize the platform for other industries.

**Deliverables:**
1. `industry` field in `clients` table drives which modules appear
2. New industry pack: Legal (case intake responder, past client check-in, court calendar monitor)
3. New industry pack: Dental (appointment no-show recovery, review autopilot)
4. Landing page becomes a gallery: "Choose your industry → see your suite"
5. Pricing page with self-service signup

---

## 4. Business Model Update

### 4.1 Short-term (Phase 1-3, while building)

Still consulting pricing to generate cashflow:
- **$500 Quick Win** — single workflow built on the platform for a client
- **$1,500 Pilot Package** — 3 workflows + case study
- **$1,000/month retainer** — includes platform access, ongoing support

### 4.2 Medium-term (after Phase 3)

Migrate to SaaS pricing:
- **Starter — $99/month** — 1 active module, up to 100 leads/month
- **Pro — $299/month** — all real estate modules, unlimited leads, priority support
- **Agency — $999/month** — multi-user, white-label, custom integrations

### 4.3 Long-term (after Phase 5)

- Platform listed publicly at `conduit.ai` or similar domain
- Self-service signup
- Freemium tier to drive top-of-funnel
- Consulting becomes an upsell: "Want us to set it up for you? $500 one-time"

---

## 5. Decisions Locked In

| Decision | Choice | Rationale |
|---|---|---|
| Auth method | Email/password first, Google OAuth in Phase 3 | Simpler to start, Google OAuth comes naturally with Gmail integration |
| Dashboard rebuild | Full Next.js rebuild, not bolt-on | Current static HTML can't support real auth |
| Old dashboard fate | Stays up as reference, new one at new URL | Zero risk of breaking what exists |
| n8n multi-tenancy | Duplicate workflows per client via n8n API | Simpler than dynamic lookups, failure isolation |
| Credentials storage | Vercel/Supabase, never n8n | Multi-tenant Gmail only possible this way |
| First industry | Real estate (Eileen is the case study) | Already built, prospects already identified |
| Database | Supabase (already in use) | Zero new infra, team knows it |
| Frontend framework | Next.js 14 (App Router) | Vercel-native, React, huge ecosystem |
| Eileen priority | Not urgent — build platform first | Her consulting money is nice but secondary to the platform |

---

## 6. What Stays From the Consulting Era

Nothing gets thrown away. The existing artifacts still have value:

- **Discovery Call Framework** — becomes sales collateral for enterprise clients
- **Service Menu & Pricing** — informs the SaaS pricing tiers
- **Agentic AI Tool Stack** — becomes the "which tool for which job" internal doc
- **Prospect List (33 real estate agencies)** — becomes the first batch of users to invite to the platform beta
- **Outreach Drafter + templates** — becomes internal tools for onboarding outreach
- **Lead Responder n8n workflow** — becomes `template_lead_responder`
- **Past Client Reactivator n8n workflow** — becomes `template_past_client_reactivator`
- **ROI Calculator HTML** — ported to Next.js, becomes a public-facing tool on the platform
- **Training slideshow + knowledge test** — internal onboarding for new team members
- **Demo walkthrough deck** — becomes a video walkthrough on the landing page

---

## 7. Next Session Starting Point

**Read this first:** `PLATFORM_PLAN.md` (this file)

**First actions:**
1. Create new GitHub repo: `monican-platform`
2. Initialize a Next.js 14 project locally with TypeScript, Tailwind, App Router
3. Install Supabase client libraries: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`
4. Copy environment variables from current dashboard (Supabase URL + anon key)
5. Run the SQL in Section 2.1 against the existing Supabase project to create the platform tables
6. Enable Supabase Auth (email/password) in the Supabase dashboard
7. Build the Next.js pages listed in Phase 1
8. Deploy to Vercel as `monican-platform.vercel.app`

**End state of Phase 1:**
Daniel can sign up, log in, see his dashboard, fill out his profile, toggle modules on/off in the UI (even though toggling doesn't DO anything yet in Phase 1). The foundation is in place for Phase 2 to plug in the actual n8n cloning logic.

---

## 8. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| n8n API rate limits | Medium | Cache clones, only clone on module activation (rare event) |
| Supabase free tier limits | Low | Current usage well under limits; upgrade if needed |
| Gmail OAuth quota | Medium | Google Cloud Console gives generous quotas for Gmail API |
| Legacy.com ToS lawsuit | Low | Only use as internal signal, never rehost obit text |
| Scraper maintenance burden | High | Use REST endpoints (AxisGIS) over HTML scrapers wherever possible |
| Platform takes longer than expected | High | Ship Phase 1 minimum viable product, iterate |

---

## 9. Open Questions (answer before or during each phase)

**Phase 1:**
- What domain do we want? `monican-platform.vercel.app` is fine for now; later buy `monican.ai` or `monican.com`?
- Landing page copy: is "AI agent suites for any industry" the final tagline?

**Phase 2:**
- How do we get an n8n API key? (It's in n8n Cloud settings, needs to be generated)
- Do we charge for module activation, or is the first module free?

**Phase 3:**
- Should Gmail Send (real emails) be a Pro-tier feature or included in Starter?
- How many Gmail drafts per month before we hit Gmail API quotas? (Plenty for normal use)

**Phase 4:**
- Do we pay for PropertyRadar upfront ($79/mo) or wait until a client commits?
- Signal Engine daily digest email: send from `daniel@conduit.ai` or from the client's own Gmail via proxy?

---

*End of plan document.*
