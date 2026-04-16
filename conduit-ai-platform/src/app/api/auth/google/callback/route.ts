import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens } from "@/lib/google";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://monican-platform.vercel.app";

/**
 * GET /api/auth/google/callback — Google redirects here after user consents.
 * Exchanges the auth code for tokens and stores them in client_credentials.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // user ID
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${SITE_URL}/settings?gmail=error&reason=${error}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(`${SITE_URL}/settings?gmail=error&reason=missing_params`);
  }

  // Verify the user is authenticated and matches the state
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== state) {
    return NextResponse.redirect(`${SITE_URL}/settings?gmail=error&reason=auth_mismatch`);
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    const expiresAt = new Date(
      Date.now() + tokens.expires_in * 1000
    ).toISOString();

    // Store in client_credentials
    const { error: dbError } = await supabase
      .from("client_credentials")
      .upsert(
        {
          client_id: user.id,
          provider: "google",
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token ?? null,
          expires_at: expiresAt,
          scopes: tokens.scope.split(" "),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "client_id,provider" }
      );

    if (dbError) {
      console.error("Failed to store Google credentials:", dbError);
      return NextResponse.redirect(`${SITE_URL}/settings?gmail=error&reason=db_error`);
    }

    // Log the connection event
    await supabase.from("activity_log").insert({
      client_id: user.id,
      module_key: null,
      event_type: "gmail_connected",
      event_data: { scopes: tokens.scope },
    });

    return NextResponse.redirect(`${SITE_URL}/settings?gmail=connected`);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${SITE_URL}/settings?gmail=error&reason=token_exchange`);
  }
}
