import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

/**
 * POST /api/subscribe
 * Email capture for visitors who aren't ready to book a demo.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase().slice(0, 200);
  const roleSlug = String(body?.roleSlug || "").trim().slice(0, 100);
  const context = String(body?.context || "").trim().slice(0, 100);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = createAnonClient();
  const { error } = await supabase.from("email_signups").insert({
    email,
    role_slug: roleSlug || null,
    context: context || null,
  });

  // 23505 = unique violation — they're already subscribed, treat as success
  if (error && error.code !== "23505") {
    console.error("[subscribe] insert failed:", error.message);
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
