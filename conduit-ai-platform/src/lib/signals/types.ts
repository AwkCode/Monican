export type SignalType =
  | "fsbo"
  | "ownership_milestone"
  | "expired_listing"
  | "building_permit"
  | "pre_foreclosure"
  | "estate"
  | "high_turnover";

export type SignalStatus =
  | "new"
  | "viewed"
  | "contacted"
  | "converted"
  | "dismissed";

export type ConfidenceLevel = "hot" | "warm" | "cool";

export type Signal = {
  id: string;
  client_id: string;
  signal_type: SignalType;
  source: string;
  source_url: string | null;
  external_id: string | null;
  address: string | null;
  city: string | null;
  state: string;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  owner_name: string | null;
  property_type: string | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lot_size: string | null;
  year_built: number | null;
  assessed_value: number | null;
  last_sale_price: number | null;
  last_sale_date: string | null;
  signal_detail: Record<string, unknown>;
  confidence_score: number;
  status: SignalStatus;
  letter_drafted: boolean;
  letter_draft_id: string | null;
  notes: string | null;
  property_hash: string | null;
  related_signal_ids: string[] | null;
  signal_date: string;
  created_at: string;
  updated_at: string;
};

export type SignalConfig = {
  id: string;
  client_id: string;
  enabled_types: SignalType[];
  custom_towns: string[] | null;
  digest_enabled: boolean;
  digest_frequency: string;
  digest_time: string;
  milestone_years: number[];
  digest_min_confidence: number;
};

export type SignalStats = {
  newToday: number;
  totalActive: number;
  hotLeads: number;
  lettersDrafted: number;
};

export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  fsbo: "FSBO",
  ownership_milestone: "Ownership Milestone",
  expired_listing: "Expired Listing",
  building_permit: "Building Permit",
  pre_foreclosure: "Pre-Foreclosure",
  estate: "Estate",
  high_turnover: "High Turnover",
};

export const SIGNAL_TYPE_ICONS: Record<SignalType, string> = {
  fsbo: "🏠",
  ownership_milestone: "📅",
  expired_listing: "📋",
  building_permit: "🔨",
  pre_foreclosure: "⚠️",
  estate: "🏛️",
  high_turnover: "📊",
};

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 80) return "hot";
  if (score >= 50) return "warm";
  return "cool";
}
