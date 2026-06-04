import { NextRequest, NextResponse } from "next/server";
import { ROLES, getIndustryBySlug } from "@/lib/marketplace/seed";

/**
 * POST /api/search
 * Body: { query: string }
 *
 * Claude-powered semantic role matching. Returns up to 8 role slugs ordered
 * by relevance to the user's query.
 *
 * Strategy:
 *   - Send Claude Haiku 4.5 the full role catalog
 *   - Ask it to return the most relevant slugs as JSON
 *   - Fall back to empty array on any error (wizard then shows "request a role")
 */

// Simple in-memory cache keyed on lowercased query
const cache = new Map<string, { matches: string[]; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached(query: string): string[] | null {
  const entry = cache.get(query.toLowerCase().trim());
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(query.toLowerCase().trim());
    return null;
  }
  return entry.matches;
}

function setCached(query: string, matches: string[]) {
  cache.set(query.toLowerCase().trim(), {
    matches,
    timestamp: Date.now(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const query: string = (body.query || "").trim();

  if (query.length < 2) {
    return NextResponse.json({ matches: [], source: "validation" });
  }

  // Cache check
  const cached = getCached(query);
  if (cached) {
    return NextResponse.json({ matches: cached, source: "cache" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ matches: [], source: "no-key" });
  }

  // Build the catalog string for Claude
  const catalog = ROLES.map((r) => {
    const industry = getIndustryBySlug(r.industrySlug);
    const terms = r.searchTerms?.length
      ? ` (also: ${r.searchTerms.join(", ")})`
      : "";
    return `- ${r.slug} | ${r.name} | ${industry?.name || "Other"} — ${r.description}${terms}`;
  }).join("\n");

  const prompt = `You are a semantic search assistant for Monican, an AI workflow marketplace organized by job/role.

A user is searching for their role to find relevant AI workflows. They typed: "${query}"

Below is the full catalog of roles we have in the library:

${catalog}

Return the up to 8 most relevant role slugs in order of relevance, as a JSON array of strings.

Rules:
- Return ONLY the JSON array, nothing else, no markdown fences.
- Consider synonyms, abbreviations, related fields, and adjacent jobs.
- If a query is broad (like "sales" or "marketing"), include ALL roles in that category from any industry.
- If a query refers to a tool (like "salesforce" or "shopify"), match to roles likely to use it.
- If absolutely no roles fit, return [].
- Example output: ["sales-rep", "account-executive", "bdr-sdr"]`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[search] Claude error:", err);
      return NextResponse.json({ matches: [], source: "claude-error" });
    }

    const data = await res.json();
    const text: string =
      data.content?.[0]?.type === "text" ? data.content[0].text : "";

    // Parse JSON array from response
    const match = text.match(/\[[\s\S]*?\]/);
    let slugs: string[] = [];
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) {
          slugs = parsed.filter((s) => typeof s === "string");
        }
      } catch {
        console.error("[search] Failed to parse Claude JSON:", text);
      }
    }

    // Validate slugs against real roles
    const validSlugs = slugs.filter((slug) => ROLES.some((r) => r.slug === slug));

    setCached(query, validSlugs);

    return NextResponse.json({ matches: validSlugs, source: "claude" });
  } catch (e) {
    console.error("[search] Exception:", e);
    return NextResponse.json({ matches: [], source: "exception" });
  }
}
