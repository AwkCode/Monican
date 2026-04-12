// n8n Code Node — Parse Claude's draft JSON
// Place this AFTER the Anthropic "Message a model" node.
// It parses Claude's JSON response and combines it with the original client data
// so downstream nodes (Gmail draft creation, Sheet logging) can use everything.

// Get Claude's raw text output (after the prefill "{" trick)
const claudeOutput = $input.first().json.content[0].text;

let jsonText = claudeOutput.trim();
if (!jsonText.startsWith('{')) {
  jsonText = '{' + jsonText;
}

let parsed;
try {
  parsed = JSON.parse(jsonText);
} catch (e) {
  // Try truncating at last closing brace in case Claude added anything after
  const lastBrace = jsonText.lastIndexOf('}');
  parsed = JSON.parse(jsonText.substring(0, lastBrace + 1));
}

// Get the original client data (from the Filter Candidates node earlier)
// The Anthropic node was called inside a Loop/SplitInBatches, so $('Filter Candidates')
// gives us the current iteration's input client.
const client = $('Filter Candidates').item.json;

// Build the full email body (greeting + body + signoff)
const fullBody = `${parsed.greeting}\n\n${parsed.body}\n\n${parsed.signoff}`;

return {
  // Client info
  first_name: client.first_name,
  last_name: client.last_name,
  email: client.email,
  phone: client.phone,
  property_address: client.property_address,
  reason: client.reason,
  years_since_closing: client.years_since_closing,

  // Drafted email
  subject: parsed.subject,
  greeting: parsed.greeting,
  body: parsed.body,
  signoff: parsed.signoff,
  full_email_body: fullBody,

  // Metadata
  tone_notes: parsed.tone_notes || '',
  drafted_at: new Date().toISOString(),
};
