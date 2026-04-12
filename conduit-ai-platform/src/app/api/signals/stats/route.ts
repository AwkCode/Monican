import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/signals/stats — Aggregated counts for dashboard cards.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [newTodayRes, totalActiveRes, hotRes, draftedRes] = await Promise.all([
    supabase
      .from("signals")
      .select("id", { count: "exact", head: true })
      .eq("client_id", user.id)
      .gte("created_at", today.toISOString()),
    supabase
      .from("signals")
      .select("id", { count: "exact", head: true })
      .eq("client_id", user.id)
      .in("status", ["new", "viewed"]),
    supabase
      .from("signals")
      .select("id", { count: "exact", head: true })
      .eq("client_id", user.id)
      .gte("confidence_score", 80)
      .in("status", ["new", "viewed"]),
    supabase
      .from("signals")
      .select("id", { count: "exact", head: true })
      .eq("client_id", user.id)
      .eq("letter_drafted", true),
  ]);

  return NextResponse.json({
    newToday: newTodayRes.count ?? 0,
    totalActive: totalActiveRes.count ?? 0,
    hotLeads: hotRes.count ?? 0,
    lettersDrafted: draftedRes.count ?? 0,
  });
}
