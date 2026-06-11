import { WorkflowSource } from "./marketplace/types";

/**
 * Affiliate / referral codes per source platform.
 *
 * These are read from env vars at build time so codes can be rotated
 * without redeploying. Fallbacks let us ship sensible defaults today
 * and swap in real codes when partnerships are live.
 *
 * Configure in Vercel:
 *   NEXT_PUBLIC_AFFILIATE_ZAPIER=monican
 *   NEXT_PUBLIC_AFFILIATE_MAKE=monican
 *   NEXT_PUBLIC_AFFILIATE_PIPEDREAM=monican
 *   NEXT_PUBLIC_AFFILIATE_N8N=monican
 */
export const AFFILIATE_CODES: Partial<Record<WorkflowSource, string>> = {
  Zapier: process.env.NEXT_PUBLIC_AFFILIATE_ZAPIER || "monican",
  Make: process.env.NEXT_PUBLIC_AFFILIATE_MAKE || "monican",
  Pipedream: process.env.NEXT_PUBLIC_AFFILIATE_PIPEDREAM || "monican",
  n8n: process.env.NEXT_PUBLIC_AFFILIATE_N8N || "monican",
};

/**
 * Per-platform URL parameter conventions for tracking attribution.
 */
const REF_PARAM: Record<string, string> = {
  Zapier: "utm_source", // Zapier partner program uses utm
  Make: "ref",
  Pipedream: "ref",
  n8n: "ref",
  "GPT Store": "utm_source",
  "Claude Skills": "utm_source",
  Anthropic: "utm_source",
  OpenAI: "utm_source",
};

/**
 * Build the activation URL for a workflow's source platform.
 * Appends affiliate tracking params if configured.
 */
export function buildAffiliateUrl(
  source: WorkflowSource,
  sourceUrl: string | undefined,
  fallbackHomepage: string
): string {
  const base = sourceUrl || fallbackHomepage;
  const code = AFFILIATE_CODES[source];
  if (!code) return base;

  const param = REF_PARAM[source] || "ref";
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${param}=${encodeURIComponent(code)}`;
}

/**
 * Fallback homepages for each source platform if a workflow doesn't
 * have a specific deep link.
 */
export const SOURCE_HOMEPAGES: Record<WorkflowSource, string> = {
  Monican: "/book",
  Zapier: "https://zapier.com/apps",
  n8n: "https://n8n.io/workflows",
  Make: "https://www.make.com/en/templates",
  "GPT Store": "https://chatgpt.com/gpts",
  "Claude Skills": "https://claude.com/skills",
  Pipedream: "https://pipedream.com/workflows",
  Anthropic: "https://claude.com",
  OpenAI: "https://platform.openai.com",
};

/**
 * Does this source support affiliate / referral tracking?
 */
export function hasAffiliateProgram(source: WorkflowSource): boolean {
  return !!AFFILIATE_CODES[source];
}
