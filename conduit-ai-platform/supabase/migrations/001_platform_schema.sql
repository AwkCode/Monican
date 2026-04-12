-- Conduit AI Platform — Phase 1 schema
-- Run this against the existing Supabase project (ecbquabpmmhjycsymnhf).
-- Safe to re-run: everything is IF NOT EXISTS.

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  business_name TEXT,
  business_address TEXT,
  industry TEXT DEFAULT 'real_estate',
  role TEXT,
  towns_served TEXT[],
  school_district TEXT,
  years_in_business INTEGER,
  voice_sample TEXT,
  signature_block TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  n8n_workflow_id TEXT,
  n8n_webhook_url TEXT,
  config JSONB,
  activated_at TIMESTAMPTZ,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, module_key)
);

CREATE TABLE IF NOT EXISTS client_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, provider)
);

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  module_key TEXT,
  event_type TEXT,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  source TEXT,
  lead_name TEXT,
  lead_email TEXT,
  lead_phone TEXT,
  original_message TEXT,
  lead_type TEXT,
  quality TEXT,
  signals TEXT[],
  draft_subject TEXT,
  draft_body TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS past_clients (
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

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients_own_row" ON clients;
CREATE POLICY "clients_own_row" ON clients
  FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

ALTER TABLE client_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "client_modules_own" ON client_modules;
CREATE POLICY "client_modules_own" ON client_modules
  FOR ALL TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

ALTER TABLE client_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "client_credentials_own" ON client_credentials;
CREATE POLICY "client_credentials_own" ON client_credentials
  FOR ALL TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activity_log_own" ON activity_log;
CREATE POLICY "activity_log_own" ON activity_log
  FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leads_own" ON leads;
CREATE POLICY "leads_own" ON leads
  FOR ALL TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

ALTER TABLE past_clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "past_clients_own" ON past_clients;
CREATE POLICY "past_clients_own" ON past_clients
  FOR ALL TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- ============================================================
-- AUTO-PROVISION: create a clients row whenever a new auth.user signs up
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.clients (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
