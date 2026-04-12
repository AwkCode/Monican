import { NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "@/lib/google";

/**
 * GET /api/auth/google/debug — Shows the OAuth URL without redirecting.
 * Temporary debug endpoint. Delete after fixing.
 */
export async function GET() {
  const url = buildGoogleAuthUrl("test-user-id");
  return NextResponse.json({
    auth_url: url,
    client_id: process.env.GOOGLE_CLIENT_ID ?? "MISSING",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI ?? "MISSING",
    client_id_length: (process.env.GOOGLE_CLIENT_ID ?? "").length,
  });
}
