import { createHash } from "crypto";

/**
 * Normalize an address for deduplication / correlation.
 * Strips common variations so "47 Wattaquadock Hill Rd" matches
 * "47 Wattaquadock Hill Road" and "47 WATTAQUADOCK HILL RD".
 */
export function normalizeAddress(address: string): string {
  let normalized = address.toLowerCase().trim();

  // Common abbreviations
  const replacements: [RegExp, string][] = [
    [/\bstreet\b/g, "st"],
    [/\broad\b/g, "rd"],
    [/\bavenue\b/g, "ave"],
    [/\bdrive\b/g, "dr"],
    [/\blane\b/g, "ln"],
    [/\bcourt\b/g, "ct"],
    [/\bcircle\b/g, "cir"],
    [/\bboulevard\b/g, "blvd"],
    [/\bplace\b/g, "pl"],
    [/\bterrace\b/g, "ter"],
    [/\bnorth\b/g, "n"],
    [/\bsouth\b/g, "s"],
    [/\beast\b/g, "e"],
    [/\bwest\b/g, "w"],
    [/\bapartment\b/g, "apt"],
    [/\bunit\b/g, "apt"],
    [/\bsuite\b/g, "ste"],
    [/\b#\s*/g, "apt "],
  ];

  for (const [pattern, replacement] of replacements) {
    normalized = normalized.replace(pattern, replacement);
  }

  // Remove apt/unit/suite numbers for property-level matching
  normalized = normalized.replace(/\b(apt|ste)\s*\S+/g, "");

  // Remove punctuation and extra whitespace
  normalized = normalized.replace(/[.,]/g, "").replace(/\s+/g, " ").trim();

  return normalized;
}

/**
 * Create a hash of address + city for cross-signal correlation.
 */
export function propertyHash(address: string, city: string): string {
  const input = `${normalizeAddress(address)}|${city.toLowerCase().trim()}`;
  return createHash("md5").update(input).digest("hex");
}
