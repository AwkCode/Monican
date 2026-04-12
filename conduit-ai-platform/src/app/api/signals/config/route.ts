import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/signals/config — Get signal preferences for the current user.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data } = await supabase
    .from("signal_configs")
    .select("*")
    .eq("client_id", user.id)
    .maybeSingle();

  // Return defaults if no config exists
  return NextResponse.json({
    config: data ?? {
      enabled_types: ["fsbo", "ownership_milestone", "expired_listing", "building_permit"],
      custom_towns: null,
      digest_enabled: true,
      digest_frequency: "daily",
      digest_time: "07:00",
      milestone_years: [5, 10, 15, 20, 25],
      digest_min_confidence: 40,
    },
  });
}

/**
 * PUT /api/signals/config — Update signal preferences.
 */
export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase.from("signal_configs").upsert(
    {
      client_id: user.id,
      enabled_types: body.enabled_types,
      custom_towns: body.custom_towns ?? null,
      digest_enabled: body.digest_enabled ?? true,
      digest_frequency: body.digest_frequency ?? "daily",
      digest_time: body.digest_time ?? "07:00",
      milestone_years: body.milestone_years ?? [5, 10, 15, 20, 25],
      digest_min_confidence: body.digest_min_confidence ?? 40,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "client_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "saved", config: data });
}
