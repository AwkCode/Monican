import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getValidAccessToken, createGmailDraft } from "@/lib/google";

/**
 * GET /api/cron/past-client — the Past Client Reactivator agent.
 *
 * Runs Mondays 13:00 UTC (~8am ET) via Vercel cron (vercel.json). For every
 * client with the module enabled AND Gmail connected, it:
 *   1. Finds past clients due for a touch — birthday or closing anniversary
 *      in the next 7 days, or no contact in 90+ days
 *   2. Drafts a personalized check-in with Claude, in the client's voice
 *   3. Drops the draft in the client's Gmail — NEVER sends
 *   4. Stamps last_contacted and logs to activity_log
 *
 * Auth: Vercel cron sends `Authorization: Bearer ${CRON_SECRET}` when the
 * CRON_SECRET env var is set. Without the secret configured the route
 * refuses to run.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_DRAFTS_PER_CLIENT = 5;
const UPCOMING_WINDOW_DAYS = 7;
const STALE_CONTACT_DAYS = 90;
const RECENT_TOUCH_GUARD_DAYS = 14; // never re-touch within 2 weeks

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 }
    );
  }
  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    );
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
      { status: 503 }
    );
  }

  const { data: activations, error: modErr } = await supabase
    .from("client_modules")
    .select("client_id")
    .eq("module_key", "past_client_reactivator")
    .eq("enabled", true);

  if (modErr) {
    return NextResponse.json({ error: modErr.message }, { status: 500 });
  }

  const summary: Array<Record<string, unknown>> = [];

  for (const activation of activations || []) {
    const clientId = activation.client_id as string;
    try {
      const result = await runForClient(supabase, anthropicKey, clientId);
      summary.push({ clientId, ...result });
    } catch (e) {
      summary.push({
        clientId,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json({
    ok: true,
    clientsProcessed: summary.length,
    summary,
  });
}

async function runForClient(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  anthropicKey: string,
  clientId: string
) {
  // Profile (voice + signature) and Gmail credential
  const { data: profile } = await supabase
    .from("clients")
    .select(
      "full_name, business_name, role, towns_served, voice_sample, signature_block"
    )
    .eq("id", clientId)
    .single();

  const { data: credential } = await supabase
    .from("client_credentials")
    .select("access_token, refresh_token, expires_at")
    .eq("client_id", clientId)
    .eq("provider", "google")
    .single();

  if (!credential?.refresh_token) {
    return { skipped: "no Gmail connection" };
  }

  const { data: pastClients } = await supabase
    .from("past_clients")
    .select("*")
    .eq("client_id", clientId);

  if (!pastClients?.length) {
    return { skipped: "no past clients" };
  }

  const today = new Date();
  const due = pastClients
    .map((pc) => ({ pc, occasion: occasionFor(pc, today) }))
    .filter(
      (d): d is { pc: (typeof pastClients)[number]; occasion: string } =>
        d.occasion !== null
    )
    .slice(0, MAX_DRAFTS_PER_CLIENT);

  if (due.length === 0) {
    await touchLastRun(supabase, clientId);
    return { drafts: 0, note: "nobody due this week" };
  }

  // Refresh the Gmail token once for the batch, persist if it changed
  const token = await getValidAccessToken({
    access_token: credential.access_token,
    refresh_token: credential.refresh_token,
    expires_at: credential.expires_at,
  });
  if (token.refreshed) {
    await supabase
      .from("client_credentials")
      .update({
        access_token: token.access_token,
        expires_at: token.expires_at,
        updated_at: new Date().toISOString(),
      })
      .eq("client_id", clientId)
      .eq("provider", "google");
  }

  let drafted = 0;
  for (const { pc, occasion } of due) {
    if (!pc.email) continue;
    try {
      const draft = await draftWithClaude(anthropicKey, profile, pc, occasion);
      const gmail = await createGmailDraft(token.access_token, {
        to: pc.email,
        subject: draft.subject,
        body: draft.body,
      });

      await supabase
        .from("past_clients")
        .update({ last_contacted: today.toISOString().slice(0, 10) })
        .eq("id", pc.id);

      await supabase.from("activity_log").insert({
        client_id: clientId,
        module_key: "past_client_reactivator",
        event_type: "draft_created",
        event_data: {
          past_client_id: pc.id,
          past_client_name: `${pc.first_name} ${pc.last_name || ""}`.trim(),
          occasion,
          gmail_draft_id: gmail.draftId,
        },
      });

      drafted += 1;
    } catch (e) {
      console.error(
        `[cron/past-client] draft failed for ${pc.id}:`,
        e instanceof Error ? e.message : e
      );
    }
  }

  await touchLastRun(supabase, clientId);
  return { drafts: drafted, due: due.length };
}

async function touchLastRun(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  clientId: string
) {
  await supabase
    .from("client_modules")
    .update({ last_run_at: new Date().toISOString() })
    .eq("client_id", clientId)
    .eq("module_key", "past_client_reactivator");
}

/** Days until the next annual occurrence of a date's month/day. */
function daysUntilAnnual(dateStr: string, today: Date): number {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return Infinity;
  const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next.setFullYear(next.getFullYear() + 1);
  }
  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}

function daysSince(dateStr: string, today: Date): number {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return Infinity;
  return Math.round((today.getTime() - d.getTime()) / 86_400_000);
}

/** Why this past client is due for a touch this week — or null. */
function occasionFor(
  pc: {
    birthday?: string | null;
    closing_date?: string | null;
    last_contacted?: string | null;
  },
  today: Date
): string | null {
  // Guard: touched recently → leave them alone regardless of occasion
  if (
    pc.last_contacted &&
    daysSince(pc.last_contacted, today) < RECENT_TOUCH_GUARD_DAYS
  ) {
    return null;
  }
  if (pc.birthday && daysUntilAnnual(pc.birthday, today) <= UPCOMING_WINDOW_DAYS) {
    return "birthday";
  }
  if (
    pc.closing_date &&
    daysUntilAnnual(pc.closing_date, today) <= UPCOMING_WINDOW_DAYS &&
    daysSince(pc.closing_date, today) > 300 // not a brand-new closing
  ) {
    return "home anniversary";
  }
  if (!pc.last_contacted || daysSince(pc.last_contacted, today) >= STALE_CONTACT_DAYS) {
    return "long-overdue check-in";
  }
  return null;
}

async function draftWithClaude(
  apiKey: string,
  profile: {
    full_name?: string | null;
    business_name?: string | null;
    role?: string | null;
    towns_served?: string[] | null;
    voice_sample?: string | null;
    signature_block?: string | null;
  } | null,
  pc: {
    first_name: string;
    last_name?: string | null;
    property_address?: string | null;
    transaction_type?: string | null;
    closing_date?: string | null;
    tags?: string | null;
    notes?: string | null;
  },
  occasion: string
): Promise<{ subject: string; body: string }> {
  const sender = profile?.full_name || "the agent";
  const prompt = `You are drafting a short, warm check-in email for ${sender}${
    profile?.business_name ? ` of ${profile.business_name}` : ""
  }, a ${profile?.role || "real estate professional"}, to a past client.

OCCASION: ${occasion}

PAST CLIENT:
- Name: ${pc.first_name} ${pc.last_name || ""}
- Property: ${pc.property_address || "n/a"}
- Transaction: ${pc.transaction_type || "n/a"}, closed ${pc.closing_date || "n/a"}
- Tags/notes: ${[pc.tags, pc.notes].filter(Boolean).join("; ") || "none"}

${profile?.voice_sample ? `WRITE IN THIS VOICE (sample from the sender):\n${profile.voice_sample}\n` : ""}
RULES:
- 60-120 words. Personal, specific, zero salesiness. One light question to invite a reply.
- Mention the occasion naturally. Never mention AI or that this is automated.
- No placeholders or brackets — every word ready to send.
${profile?.signature_block ? `- End with this signature:\n${profile.signature_block}` : `- Sign off as ${sender}.`}

Return ONLY JSON, no markdown fences: {"subject": "...", "body": "..."}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Claude error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const text: string =
    data.content?.[0]?.type === "text" ? data.content[0].text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Claude returned no JSON");

  const parsed = JSON.parse(match[0]);
  if (!parsed.subject || !parsed.body) {
    throw new Error("Claude JSON missing subject/body");
  }
  return { subject: String(parsed.subject), body: String(parsed.body) };
}
