// n8n Respond to Webhook — Response Body
// Paste this into the "Response Body" field of the Respond to Webhook node

{{ JSON.stringify({success: true, lead_type: $('Code in JavaScript').first().json.lead_type, quality: $('Code in JavaScript').first().json.quality, draft_response_subject: $('Code in JavaScript').first().json.draft_response_subject, draft_response_body: $('Code in JavaScript').first().json.draft_response_body, internal_notes: $('Code in JavaScript').first().json.internal_notes}) }}
