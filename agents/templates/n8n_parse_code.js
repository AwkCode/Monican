// n8n Code Node — Parse Claude's JSON output
// Paste this into the Code in JavaScript node
// Place this node AFTER the Anthropic "Message a model" node

const claudeOutput = $input.first().json.content[0].text;

// Claude prefill trick: response starts with {, so ensure it's clean
let jsonText = claudeOutput.trim();
if (!jsonText.startsWith('{')) {
  jsonText = '{' + jsonText;
}

// Parse and return as structured data
const parsed = JSON.parse(jsonText);

// Also grab the original lead data for context
const lead = $('Webhook').first().json.body;

return {
  // Original lead info
  lead_name: lead.lead_name,
  lead_email: lead.lead_email,
  lead_phone: lead.lead_phone,
  source: lead.source,
  property_interest: lead.property_interest,
  original_message: lead.message,

  // Claude's classification
  lead_type: parsed.lead_type,
  quality: parsed.quality,
  signals: Array.isArray(parsed.signals) ? parsed.signals.join(', ') : parsed.signals,
  key_details: parsed.key_details,

  // Claude's drafted response
  draft_response_subject: parsed.draft_response_subject,
  draft_response_body: parsed.draft_response_body,

  // Internal tracking
  internal_notes: parsed.internal_notes,
  suggested_next_action: parsed.suggested_next_action,

  // Metadata
  processed_at: new Date().toISOString()
};
