/**
 * Site-wide constants. Both values are env-overridable so they can be
 * swapped when the monican domain + inbox are live (see LAUNCH_CHECKLIST.md).
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "danielweadock@gmail.com";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://conduit-ai-platform.vercel.app";

export const SITE_NAME = "Monican";
