-- Signal Engine — Phase 4 schema
-- Run after 001_platform_schema.sql

-- ============================================================
-- SIGNALS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

  -- Signal identification
  signal_type TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  external_id TEXT,

  -- Property data
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'MA',
  zip TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,

  -- Owner data
  owner_name TEXT,

  -- Property details
  property_type TEXT,
  beds INTEGER,
  baths NUMERIC(3,1),
  sqft INTEGER,
  lot_size TEXT,
  year_built INTEGER,
  assessed_value INTEGER,
  last_sale_price INTEGER,
  last_sale_date DATE,

  -- Signal-specific data
  signal_detail JSONB DEFAULT '{}',

  -- Scoring
  confidence_score INTEGER DEFAULT 50,

  -- Status tracking
  status TEXT DEFAULT 'new',
  letter_drafted BOOLEAN DEFAULT FALSE,
  letter_draft_id TEXT,
  notes TEXT,

  -- Multi-signal correlation
  property_hash TEXT,
  related_signal_ids UUID[],

  -- Timestamps
  signal_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(client_id, signal_type, external_id)
);

CREATE INDEX IF NOT EXISTS idx_signals_client_status ON signals(client_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_client_type ON signals(client_id, signal_type);
CREATE INDEX IF NOT EXISTS idx_signals_client_score ON signals(client_id, confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_signals_property_hash ON signals(client_id, property_hash);
CREATE INDEX IF NOT EXISTS idx_signals_city ON signals(client_id, city);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "signals_own_rows" ON signals;
CREATE POLICY "signals_own_rows" ON signals
  FOR ALL TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- ============================================================
-- SIGNAL CONFIGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS signal_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  enabled_types TEXT[] DEFAULT ARRAY['fsbo','ownership_milestone','expired_listing','building_permit'],
  custom_towns TEXT[],
  digest_enabled BOOLEAN DEFAULT TRUE,
  digest_frequency TEXT DEFAULT 'daily',
  digest_time TEXT DEFAULT '07:00',
  milestone_years INTEGER[] DEFAULT ARRAY[5,10,15,20,25],
  digest_min_confidence INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id)
);

ALTER TABLE signal_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "signal_configs_own_row" ON signal_configs;
CREATE POLICY "signal_configs_own_row" ON signal_configs
  FOR ALL TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());
