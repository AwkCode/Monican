-- Monican workflow marketplace schema
-- Created 2026-04-20

-- INDUSTRIES (top-level categorization)
create table if not exists industries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  display_order int default 100,
  created_at timestamptz default now()
);

-- ROLES (specific job titles within an industry)
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  industry_id uuid references industries(id) on delete set null,
  description text,
  search_terms text[], -- alternate names / synonyms for fuzzy matching
  query_count int default 0,
  workflows_generated boolean default false, -- has Claude already generated for this role
  ai_generated boolean default false, -- was this role itself auto-discovered
  created_at timestamptz default now()
);

-- WORKFLOWS (the dispensary menu items)
create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  role_id uuid references roles(id) on delete cascade,
  name text not null,
  tagline text, -- one-line punchy
  description text, -- 2-3 sentence pitch
  long_description text, -- full marketing copy for detail page
  category text, -- "Lead gen" | "Past clients" | "Admin" | "Marketing" | "Sales" | "Operations"
  hours_saved_weekly numeric(5,1) default 0,
  dollars_saved_monthly int default 0,
  rating numeric(2,1) default 4.5, -- out of 5
  rating_count int default 0,
  setup_minutes int default 10,
  requirements text[], -- ["Gmail", "Google Sheets", "CRM"]
  steps text[], -- ordered list of what the workflow does
  ai_generated boolean default false,
  featured boolean default false,
  view_count int default 0,
  created_at timestamptz default now(),
  unique(role_id, slug)
);

-- WORKFLOW REQUESTS (queue when users want something we don't have)
create table if not exists workflow_requests (
  id uuid primary key default gen_random_uuid(),
  role_slug text,
  pain_point text,
  user_email text,
  status text default 'pending', -- pending | building | live
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists roles_industry_id_idx on roles(industry_id);
create index if not exists roles_query_count_idx on roles(query_count desc);
create index if not exists workflows_role_id_idx on workflows(role_id);
create index if not exists workflows_category_idx on workflows(category);
create index if not exists workflows_rating_idx on workflows(rating desc);

-- RLS — public read, no public write
alter table industries enable row level security;
alter table roles enable row level security;
alter table workflows enable row level security;
alter table workflow_requests enable row level security;

create policy "Public read industries" on industries for select using (true);
create policy "Public read roles" on roles for select using (true);
create policy "Public read workflows" on workflows for select using (true);
create policy "Anyone can request" on workflow_requests for insert with check (true);

-- SEED INDUSTRIES
insert into industries (slug, name, description, display_order) values
  ('real-estate', 'Real Estate', 'Brokers, agents, and property managers', 1),
  ('insurance', 'Insurance', 'Independent agents and brokerages', 2),
  ('mortgage', 'Mortgage', 'Loan officers and brokers', 3),
  ('legal', 'Legal', 'Solo and small law firms', 4),
  ('dental', 'Dental', 'Dental practices and office managers', 5),
  ('medical', 'Medical', 'Private practice and clinics', 6),
  ('home-services', 'Home Services', 'HVAC, plumbing, electrical, roofing, solar', 7),
  ('aesthetics', 'Med Spa & Aesthetics', 'Owners, injectors, and providers', 8),
  ('financial-advisors', 'Financial Advisors', 'Wealth managers and RIAs', 9),
  ('marketing-agencies', 'Marketing Agencies', 'Small to mid-size agencies', 10),
  ('coaches-consultants', 'Coaches & Consultants', 'Solo experts and small firms', 11),
  ('saas-startups', 'SaaS & Startups', 'Founders, ops, and CS teams', 12),
  ('ecommerce', 'Ecommerce', 'DTC brands and Shopify operators', 13),
  ('education', 'Education', 'Tutors, course creators, and schools', 14),
  ('nonprofits', 'Nonprofits', 'Small to mid-size nonprofits', 15),
  ('other', 'Other', 'Tell us your industry', 999)
on conflict (slug) do nothing;

-- SEED ROLES (just a few high-value ones; rest get added dynamically)
insert into roles (slug, name, industry_id, description, search_terms) values
  ('real-estate-agent', 'Real Estate Agent',
    (select id from industries where slug='real-estate'),
    'Residential or commercial agent working leads and closing deals',
    array['realtor','re agent','agent','broker associate']),
  ('real-estate-broker', 'Real Estate Broker / Owner',
    (select id from industries where slug='real-estate'),
    'Brokerage owner managing a team of agents',
    array['broker','brokerage owner','principal broker']),
  ('property-manager', 'Property Manager',
    (select id from industries where slug='real-estate'),
    'Manages residential or commercial rentals',
    array['property mgr','rental manager','landlord']),
  ('insurance-agent', 'Insurance Agent',
    (select id from industries where slug='insurance'),
    'Independent or captive agent selling personal/commercial lines',
    array['p&c agent','life agent','insurance broker','independent agent']),
  ('mortgage-loan-officer', 'Mortgage Loan Officer',
    (select id from industries where slug='mortgage'),
    'Originates residential mortgages',
    array['lo','loan officer','mortgage broker','mlo']),
  ('dental-office-manager', 'Dental Office Manager',
    (select id from industries where slug='dental'),
    'Runs day-to-day operations of a dental practice',
    array['office manager','practice manager','dental admin']),
  ('solo-attorney', 'Solo Attorney',
    (select id from industries where slug='legal'),
    'Single-shingle lawyer running a small practice',
    array['solo lawyer','attorney','small law firm','solo practitioner'])
on conflict (slug) do nothing;
