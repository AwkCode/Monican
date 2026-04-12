# Lead Responder — n8n Deployment Guide
### Version 1.0 | Last updated: 2026-04-08

This is the playbook for deploying the Lead Responder agent for a new client. Follow these steps every time.

---

## Architecture

```
Webhook (receives lead) → Claude (classifies + drafts) → Code (parses JSON) → Google Sheet (logs) → Respond to Webhook
```

5 nodes. Runs in ~3 seconds per lead. Cost: ~$0.0023 per lead using claude-haiku-4-5.

---

## Prerequisites

Before starting deployment for a new client:

- [ ] Anthropic API key (console.anthropic.com → $5 credit loaded)
- [ ] n8n Cloud account (n8n.io → free Starter plan works for first client)
- [ ] Google account (for Sheets logging)
- [ ] Client's agent name and brokerage name
- [ ] Client's phone number and email signature
- [ ] Client's school district (if applicable) and area knowledge

---

## Step-by-Step Deployment

### 1. Create the Google Sheet (2 min)
1. Go to sheets.google.com → Blank spreadsheet
2. Name it: `[Client Name] - Leads Log`
3. Paste this header row (tabs separated):
   ```
   Date	Lead Name	Email	Phone	Source	Property	Original Message	Lead Type	Quality	Signals	Key Details	Subject	Draft Response	Internal Notes	Next Action
   ```
4. Save the URL

### 2. Create the n8n workflow (10 min)

**Node 1: Webhook Trigger**
- Add "Webhook" node
- HTTP Method: `POST`
- Path: `lead-responder` (or `[client-slug]-lead-responder`)
- Authentication: `None` (add later for production)
- Respond: `Using 'Respond to Webhook' Node`

**Node 2: Anthropic (Message a model)**
- Add "Anthropic" → "Message a Model"
- Credential: Create new → paste Anthropic API key
- Model: `claude-haiku-4-5-20251001`
- Simplify Output: ON
- Options → Add Option → System Message: paste entire system prompt from `claude_classification_prompt.md` (update {{AGENT_NAME}} and {{BROKERAGE_NAME}})
- Messages → Prompt: `=Lead data:\n{{ JSON.stringify($json.body, null, 2) }}`
- Messages → Add Message → Role: `Assistant`, Prompt: `{`

**Node 3: Code (parse JSON)**
- Add "Code" → "Code in JavaScript"
- Paste the JavaScript from `n8n_parse_code.js` (see below)

**Node 4: Google Sheets (Append row)**
- Add "Google Sheets" → "Append row in sheet"
- Credential: Sign in with Google
- Document: Paste the client's sheet URL
- Sheet: Sheet1
- Mapping Column Mode: Map Each Column Manually
- Fill each field with the expressions in `n8n_sheet_mappings.md`

**Node 5: Respond to Webhook**
- Add "Respond to Webhook"
- Respond With: `JSON`
- Response Body: use expression from `n8n_respond_body.js`

### 3. Test before publishing (5 min)
- Click "Execute workflow" to arm test mode
- Send a test curl:
  ```bash
  curl -X POST "[test webhook URL]" -H "Content-Type: application/json" -d '{
    "lead_name": "Test Lead",
    "lead_email": "test@example.com",
    "source": "Zillow",
    "property_interest": "[client sample property]",
    "message": "I would like to schedule a showing."
  }'
  ```
- Verify Google Sheet has new row
- Verify response JSON is returned

### 4. Publish to production (1 click)
- Click "Publish" in top right
- Version name: `v1.0 - Initial Deployment`
- Production URL becomes: `[n8n workspace]/webhook/lead-responder`

### 5. Connect to client's lead sources (varies)
Pick one or more:
- **Zillow / Realtor.com**: Set up email forwarding rule in their email → n8n webhook via Zapier Email Parser (free) or Mailgun
- **Website contact form**: Point form submission to the production webhook URL
- **Direct API**: Give URL to developer/Zapier for custom integration
- **Gmail filter**: Use Gmail → Zapier/Make → n8n webhook

---

## Files Referenced

- `claude_classification_prompt.md` — System prompt (update {{AGENT_NAME}} per client)
- `test_cases.json` — 50 test leads for QA
- `test_results_v1.md` — Expected quality benchmarks
- `n8n_parse_code.js` — Code node JavaScript (see below)
- `n8n_sheet_mappings.md` — Sheet field expressions (see below)
- `n8n_respond_body.js` — Respond body expression (see below)

---

## Per-Client Customization

Things to change for each new client:

| What | Where | Example |
|------|-------|---------|
| Agent name | System prompt + sheet name | "Eileen Fitzpatrick" → "Nancy Hazel" |
| Brokerage | System prompt | "RE/MAX Traditions" → "Hazel & Company" |
| Phone number | System prompt signature | "(978) 779-5234" → "(978) 456-3307" |
| Area / schools | System prompt | "Nashoba Regional District" → local district |
| Google Sheet URL | Sheets node | New sheet per client |
| Webhook path | Webhook node | `lead-responder` → `hazel-lead-responder` |

---

## Pricing This for Clients

**Cost to you per client:**
- Anthropic API: ~$2-5/month (depends on volume)
- n8n Cloud Starter: $0 (free tier covers 1-2 clients)
- Google Sheets: $0

**Price to client:**
- Phase 1 Pilot: $500 Quick Win OR $1,500 Pilot Package
- Phase 2 Retainer: $750-2,000/month
- Tool pass-through: Client pays for their own Google Workspace + any Zapier if needed

**Margin per client:**
- Year 1: ~$10,000+ per client (pilot + retainer + affiliate kickbacks from tools recommended)

---

## What Can Break

Known failure modes and fixes:

1. **Claude returns markdown-wrapped JSON** → Ensure prefill assistant message `{` is in place
2. **Google Sheets shows #ERROR!** → Field has leading `=`, remove it
3. **Webhook 404** → Test URL expired (single-use), click "Execute workflow" to re-arm OR use production URL
4. **"Undefined" in sheet** → Expression field not in expression mode; drag field from input panel
5. **Spanish detection missing** → Verify system prompt explicitly mentions "respond in same language"
6. **Hostile leads getting sales pitch** → Verify system prompt has edge case instructions for angry leads

---

## Upgrade Path

After 1st client is successful:
1. Add **Gmail node** after Code — actually SEND the drafted email (not just log it)
2. Add **SMS notification** via Twilio when a HOT lead comes in
3. Add **Error notification workflow** so failed runs alert you
4. Migrate from n8n Cloud Starter to self-hosted on a $5/mo VPS when client count > 3

---

## The System Prompt (for reference)

See `claude_classification_prompt.md` for the full version. Key things to customize per client:
- `{{AGENT_NAME}}`
- `{{BROKERAGE_NAME}}`
- Phone number in signature
- Local school district references
- Time slot offerings (adjust to client's actual availability)

---

## Never Forget

**You're not selling software. You're selling the expertise to pick the right tool, set it up, and wire it into their business.**

The tool is cheap. Your value is knowing which one to use and making it actually work.
