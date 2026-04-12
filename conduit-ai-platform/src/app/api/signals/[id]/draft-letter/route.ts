import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildDraftLetterPrompt } from "@/lib/signals/claude-prompts";

/**
 * POST /api/signals/[id]/draft-letter — Generate a personalized outreach letter
 * using Claude, optionally save as Gmail draft.
 *
 * Body: { save_as_draft?: boolean }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const saveToDraft = body.save_as_draft ?? false;

  // Fetch the signal
  const { data: signal, error: sigError } = await supabase
    .from("signals")
    .select("*")
    .eq("id", params.id)
    .eq("client_id", user.id)
    .single();

  if (sigError || !signal) {
    return NextResponse.json({ error: "Signal not found" }, { status: 404 });
  }

  // Fetch the client profile
  const { data: client } = await supabase
    .from("clients")
    .select("full_name, business_name, phone, voice_sample, signature_block, towns_served")
    .eq("id", user.id)
    .single();

  if (!client) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  // Build the prompt
  const prompt = buildDraftLetterPrompt(signal, client);

  // Call Claude API
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json(
      { error: "Anthropic API key not configured" },
      { status: 500 }
    );
  }

  const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!claudeRes.ok) {
    const err = await claudeRes.text();
    console.error("Claude API error:", err);
    return NextResponse.json(
      { error: "Failed to generate letter" },
      { status: 500 }
    );
  }

  const claudeData = await claudeRes.json();
  const letterText =
    claudeData.content?.[0]?.text ?? "Failed to generate letter.";

  // Build subject line
  const subject = signal.owner_name
    ? `${signal.address ?? "Your property"} — ${client.full_name}, ${client.business_name}`
    : `Your property at ${signal.address ?? signal.city} — ${client.full_name}`;

  let draftId: string | null = null;

  // Optionally save as Gmail draft
  if (saveToDraft && signal.owner_name) {
    try {
      const draftRes = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://conduit-ai-platform.vercel.app"}/api/gmail/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.INTERNAL_API_KEY ?? "",
          },
          body: JSON.stringify({
            client_id: user.id,
            to: "", // Owner email often not available from public records
            subject,
            body: letterText,
          }),
        }
      );

      if (draftRes.ok) {
        const draftData = await draftRes.json();
        draftId = draftData.draft_id;
      }
    } catch (err) {
      console.error("Gmail draft error:", err);
      // Non-fatal — letter is still generated
    }
  }

  // Update the signal
  await supabase
    .from("signals")
    .update({
      letter_drafted: true,
      letter_draft_id: draftId,
      status: signal.status === "new" ? "viewed" : signal.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  // Log the event
  await supabase.from("activity_log").insert({
    client_id: user.id,
    module_key: "signal_engine",
    event_type: "letter_drafted",
    event_data: {
      signal_id: params.id,
      signal_type: signal.signal_type,
      address: signal.address,
      saved_to_gmail: !!draftId,
    },
  });

  return NextResponse.json({
    letter: letterText,
    subject,
    draft_id: draftId,
    signal_id: params.id,
  });
}
