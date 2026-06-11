-- Funnel + analytics tables
-- Created 2026-06-11
--
-- demo_requests : real backend capture for the /book form (replaces mailto)
-- email_signups : visitors not ready to book leave an email on role pages
-- events        : first-party event log (affiliate clicks, searches, missing roles)
--
-- All three are write-only for the public (anon inserts allowed, no reads).
-- Read them via the Supabase dashboard or service-role tooling.

create table if not exists demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  industry text,
  role_slug text,          -- ?role= param (came from a role page)
  workflow_slug text,      -- ?workflow= param (came from a workflow page)
  missing_role text,       -- ?missing-role= param (wizard had no match — demand signal)
  notes text,
  status text default 'new', -- new | contacted | scheduled | closed
  created_at timestamptz default now()
);

create table if not exists email_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role_slug text,
  context text,            -- where on the site they signed up
  created_at timestamptz default now(),
  unique (email, role_slug)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null, -- affiliate_click | search | missing_role | ...
  payload jsonb,
  path text,
  referer text,
  created_at timestamptz default now()
);

create index if not exists demo_requests_created_idx on demo_requests (created_at desc);
create index if not exists events_type_created_idx on events (event_type, created_at desc);

alter table demo_requests enable row level security;
alter table email_signups enable row level security;
alter table events enable row level security;

drop policy if exists "demo_requests_public_insert" on demo_requests;
create policy "demo_requests_public_insert" on demo_requests
  for insert to anon, authenticated with check (true);

drop policy if exists "email_signups_public_insert" on email_signups;
create policy "email_signups_public_insert" on email_signups
  for insert to anon, authenticated with check (true);

drop policy if exists "events_public_insert" on events;
create policy "events_public_insert" on events
  for insert to anon, authenticated with check (true);
