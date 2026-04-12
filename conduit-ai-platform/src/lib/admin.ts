// Hardcoded admin allowlist for the /internal pages (Daniel + Evan).
// Once the platform has a real role system, replace with a DB lookup.
export const ADMIN_EMAILS = new Set<string>([
  "daniel@conduit.ai",
  "evan@conduit.ai",
  "danielweadock@gmail.com",
]);

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}
