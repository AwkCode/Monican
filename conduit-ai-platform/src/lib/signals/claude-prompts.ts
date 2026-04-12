import type { Signal } from "./types";
import { SIGNAL_TYPE_LABELS } from "./types";

/**
 * Build the Claude prompt for generating a personalized outreach letter
 * for a specific signal/opportunity.
 */
export function buildDraftLetterPrompt(
  signal: Signal,
  client: {
    full_name: string;
    business_name: string;
    phone: string;
    voice_sample: string | null;
    signature_block: string | null;
    towns_served: string[] | null;
  }
): string {
  const signalContext = getSignalContext(signal);

  return `You are a real estate outreach letter writer for ${client.full_name} at ${client.business_name}.

Your job is to write a personalized, tactful outreach letter to a property owner based on a specific signal/opportunity. The letter should feel warm, human, and helpful — NOT salesy or predatory.

## ABOUT THE AGENT
Name: ${client.full_name}
Brokerage: ${client.business_name}
Phone: ${client.phone}
Service area: ${(client.towns_served ?? []).join(", ") || "Greater Worcester County, MA"}

${client.voice_sample ? `## VOICE SAMPLE (match this tone):\n${client.voice_sample}\n` : ""}

## THE OPPORTUNITY
Signal type: ${SIGNAL_TYPE_LABELS[signal.signal_type]}
${signalContext}

Property: ${signal.address ?? "Unknown"}, ${signal.city ?? ""}, ${signal.state} ${signal.zip ?? ""}
${signal.owner_name ? `Owner: ${signal.owner_name}` : ""}
${signal.assessed_value ? `Assessed value: $${signal.assessed_value.toLocaleString()}` : ""}
${signal.last_sale_price ? `Last sale: $${signal.last_sale_price.toLocaleString()} on ${signal.last_sale_date}` : ""}
${signal.beds ? `Beds: ${signal.beds} | Baths: ${signal.baths} | Sqft: ${signal.sqft?.toLocaleString()}` : ""}

## RULES
1. Address the owner by name if available, otherwise use "Dear Homeowner"
2. Reference the specific reason you're reaching out (the signal) — but be TACTFUL
3. For ownership milestones: congratulate them on the anniversary, mention how the market has changed
4. For FSBO: acknowledge their effort to sell independently, offer to help if they'd like professional guidance
5. For expired listings: empathize that selling can be frustrating, offer a fresh perspective
6. For building permits: mention you noticed improvements and that upgraded homes often command premium prices
7. For pre-foreclosure/estate: be extremely sensitive and respectful
8. Keep it to 150-200 words max
9. End with a soft CTA — offer a free consultation, market analysis, or just to chat
10. Sign with the agent's name and brokerage
11. NO emojis, NO exclamation marks, NO "I'd be honored" or "I'd love the opportunity"
12. Write like a real person, not a template

${client.signature_block ? `## SIGNATURE BLOCK\n${client.signature_block}` : `Sign as:\n${client.full_name}\n${client.business_name}\n${client.phone}`}

Write ONLY the letter. No preamble, no explanation. Just the letter text ready to send.`;
}

function getSignalContext(signal: Signal): string {
  const detail = signal.signal_detail as Record<string, unknown>;

  switch (signal.signal_type) {
    case "fsbo":
      return `This property is listed For Sale By Owner.
${detail.price ? `Asking price: $${(detail.price as number).toLocaleString()}` : ""}
${detail.description ? `Listing description: ${detail.description}` : ""}`;

    case "ownership_milestone":
      return `The owner has owned this property for ${detail.years_owned} years (purchased ${detail.purchase_date}).
${detail.purchase_price ? `Original purchase price: $${(detail.purchase_price as number).toLocaleString()}` : ""}
This is a ${detail.years_owned}-year ownership milestone.`;

    case "expired_listing":
      return `This property was previously listed but the listing expired/was withdrawn.
${detail.original_price ? `Original asking price: $${(detail.original_price as number).toLocaleString()}` : ""}
${detail.days_on_market ? `Days on market: ${detail.days_on_market}` : ""}
${detail.withdrawn_date ? `Withdrawn: ${detail.withdrawn_date}` : ""}`;

    case "building_permit":
      return `A building permit was recently issued for this property.
${detail.permit_type ? `Permit type: ${detail.permit_type}` : ""}
${detail.description ? `Description: ${detail.description}` : ""}
${detail.issue_date ? `Issued: ${detail.issue_date}` : ""}`;

    case "pre_foreclosure":
      return `This property has a pre-foreclosure filing. Be EXTREMELY sensitive and respectful.`;

    case "estate":
      return `This property may be an estate/probate situation. Be EXTREMELY sensitive and respectful.`;

    default:
      return `Signal confidence: ${signal.confidence_score}/100`;
  }
}
