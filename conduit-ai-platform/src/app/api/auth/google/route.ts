import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildGoogleAuthUrl } from "@/lib/google";

/**
 * GET /api/auth/google — Starts the Google OAuth flow.
 * Redirects the user to Google's consent screen.
 * The `state` param carries the user ID so the callback knows who to save tokens for.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "https://conduit-ai-platform.vercel.app"));
  }

  const authUrl = buildGoogleAuthUrl(user.id);
  return NextResponse.redirect(authUrl);
}
