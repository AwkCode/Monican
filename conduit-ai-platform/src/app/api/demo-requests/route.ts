import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

/**
 * POST /api/demo-requests
 *
 * Real backend capture for the /book form. Writes to the demo_requests
 * table; if RESEND_API_KEY + NOTIFY_EMAIL are configured, also fires an
 * email notification so requests don't sit unseen in the database.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 200);
  const email = String(body.email || "").trim().slice(0, 200);
  const company = String(body.company || "").trim().slice(0, 200);
  const industry = String(body.industry || "").trim().slice(0, 100);
  const notes = String(body.notes || "").trim().slice(0, 2000);
  const roleSlug = String(body.roleSlug || "").trim().slice(0, 100);
  const workflowSlug = String(body.workflowSlug || "").trim().slice(0, 100);
  const missingRole = String(body.missingRole || "").trim().slice(0, 200);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Name and a valid email are required" },
      { status: 400 }
    );
  }

  const supabase = createAnonClient();
  const { error } = await supabase.from("demo_requests").insert({
    name,
    email,
    company: company || null,
    industry: industry || null,
    role_slug: roleSlug || null,
    workflow_slug: workflowSlug || null,
    missing_role: missingRole || null,
    notes: notes || null,
  });

  if (error) {
    console.error("[demo-requests] insert failed:", error.message);
    return NextResponse.json(
      { error: "Could not save your request" },
      { status: 500 }
    );
  }

  // Best-effort email notification — never blocks the success response.
  await sendNotification({
    name,
    email,
    company,
    industry,
    notes,
    roleSlug,
    workflowSlug,
    missingRole,
  }).catch((e) => console.error("[demo-requests] notify failed:", e));

  return NextResponse.json({ ok: true });
}

async function sendNotification(fields: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const lines = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || "Monican <onboarding@resend.dev>",
      to: [to],
      subject: `Demo request: ${fields.company || fields.name}`,
      text: `New demo request from the site:\n\n${lines}`,
    }),
  });
}
