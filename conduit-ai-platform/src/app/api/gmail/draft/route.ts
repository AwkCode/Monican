import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getValidAccessToken, createGmailDraft } from "@/lib/google";

/**
 * POST /api/gmail/draft — Creates a draft in a client's Gmail.
 *
 * This is the proxy endpoint that n8n (or any other caller) uses
 * instead of calling Gmail directly. Vercel holds the client's OAuth
 * tokens; n8n never touches credentials.
 *
 * Body: { client_id, to, subject, body }
 *
 * Authentication: either the logged-in user (for testing from the UI)
 * or a server API key (for n8n calls). For now we support both:
 * - If the request has a valid Supabase session, client_id must match the user
 * - If the request has an `x-api-key` header matching INTERNAL_API_KEY, any client_id works
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();
  const { client_id, to, subject, body: emailBody } = body as {
    client_id: string;
    to: string;
    subject: string;
    body: string;
  };

  if (!client_id || !to || !subject || !emailBody) {
    return NextResponse.json(
      { error: "client_id, to, subject, and body are required" },
      { status: 400 }
    );
  }

  // Auth check: logged-in user or internal API key
  const internalKey = request.headers.get("x-api-key");
  const isInternalCall =
    internalKey && internalKey === process.env.INTERNAL_API_KEY;

  if (!isInternalCall) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== client_id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
  }

  // Fetch the client's Google credentials
  const { data: cred, error: credError } = await supabase
    .from("client_credentials")
    .select("access_token, refresh_token, expires_at")
    .eq("client_id", client_id)
    .eq("provider", "google")
    .single();

  if (credError || !cred) {
    return NextResponse.json(
      { error: "Gmail not connected. Ask the client to connect Gmail in Settings." },
      { status: 400 }
    );
  }

  if (!cred.refresh_token) {
    return NextResponse.json(
      { error: "No refresh token. Client needs to reconnect Gmail." },
      { status: 400 }
    );
  }

  try {
    // Get valid (possibly refreshed) access token
    const tokenResult = await getValidAccessToken({
      access_token: cred.access_token,
      refresh_token: cred.refresh_token,
      expires_at: cred.expires_at,
    });

    // If token was refreshed, update the database
    if (tokenResult.refreshed) {
      await supabase
        .from("client_credentials")
        .update({
          access_token: tokenResult.access_token,
          expires_at: tokenResult.expires_at,
          updated_at: new Date().toISOString(),
        })
        .eq("client_id", client_id)
        .eq("provider", "google");
    }

    // Create the Gmail draft
    const draft = await createGmailDraft(tokenResult.access_token, {
      to,
      subject,
      body: emailBody,
    });

    // Log the draft creation
    await supabase.from("activity_log").insert({
      client_id,
      module_key: null,
      event_type: "draft_created",
      event_data: {
        draft_id: draft.draftId,
        to,
        subject,
      },
    });

    return NextResponse.json({
      status: "created",
      draft_id: draft.draftId,
      message_id: draft.messageId,
    });
  } catch (err) {
    console.error("Gmail draft error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Draft creation failed" },
      { status: 500 }
    );
  }
}
