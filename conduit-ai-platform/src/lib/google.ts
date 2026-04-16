/**
 * Google OAuth + Gmail helpers.
 *
 * Handles:
 * - OAuth token exchange (auth code → access + refresh tokens)
 * - Token refresh when expired
 * - Gmail draft creation via the Gmail API
 */

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1";

// Scopes we request — draft creation + modification only, never send.
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

function getClientId() {
  return (process.env.GOOGLE_CLIENT_ID ?? "").trim();
}

function getClientSecret() {
  return (process.env.GOOGLE_CLIENT_SECRET ?? "").trim();
}

function getRedirectUri() {
  return (
    process.env.GOOGLE_REDIRECT_URI ??
    "https://monican-platform.vercel.app/api/auth/google/callback"
  ).trim();
}

/**
 * Build the Google OAuth consent URL.
 */
export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline", // gets us a refresh token
    prompt: "consent", // always show consent to get refresh token
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

/**
 * Exchange an authorization code for access + refresh tokens.
 */
export async function exchangeCodeForTokens(code: string) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: getClientId(),
      client_secret: getClientSecret(),
      redirect_uri: getRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token as string,
    refresh_token: data.refresh_token as string | undefined,
    expires_in: data.expires_in as number, // seconds
    scope: data.scope as string,
  };
}

/**
 * Refresh an expired access token using the refresh token.
 */
export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: getClientId(),
      client_secret: getClientSecret(),
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token refresh failed: ${err}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token as string,
    expires_in: data.expires_in as number,
  };
}

/**
 * Get a valid access token for a client. Refreshes if expired.
 * Returns the (possibly new) access token and updated expiry.
 */
export async function getValidAccessToken(credential: {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}): Promise<{ access_token: string; expires_at: string; refreshed: boolean }> {
  const now = new Date();
  const expiresAt = new Date(credential.expires_at);

  // Refresh if token expires within 5 minutes
  if (expiresAt.getTime() - now.getTime() > 5 * 60 * 1000) {
    return {
      access_token: credential.access_token,
      expires_at: credential.expires_at,
      refreshed: false,
    };
  }

  const refreshed = await refreshAccessToken(credential.refresh_token);
  const newExpiresAt = new Date(
    Date.now() + refreshed.expires_in * 1000
  ).toISOString();

  return {
    access_token: refreshed.access_token,
    expires_at: newExpiresAt,
    refreshed: true,
  };
}

/**
 * Create a Gmail draft in the user's account.
 */
export async function createGmailDraft(
  accessToken: string,
  params: { to: string; subject: string; body: string; from?: string }
): Promise<{ draftId: string; messageId: string }> {
  // Build RFC 2822 email message
  const lines = [
    `To: ${params.to}`,
    ...(params.from ? [`From: ${params.from}`] : []),
    `Subject: ${params.subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    params.body,
  ];
  const rawMessage = lines.join("\r\n");

  // Base64url encode
  const encoded = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch(`${GMAIL_API_BASE}/users/me/drafts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: { raw: encoded },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gmail draft creation failed: ${err}`);
  }

  const data = await res.json();
  return {
    draftId: data.id,
    messageId: data.message.id,
  };
}
