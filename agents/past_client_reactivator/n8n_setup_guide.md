# Past Client Reactivator — n8n Setup Guide
### For Monican | Built for Eileen Fitzpatrick / RE/MAX Traditions

This walks through building the Past Client Reactivator workflow in n8n Cloud. The workflow runs every Monday at 8am ET, reads Eileen's past client sheet, finds people with upcoming birthdays / home-aversaries / dormant contacts, drafts a personalized email for each, creates Gmail drafts in her account, and sends her a summary email.

---

## Architecture

```
Schedule Trigger (Monday 8am ET)
    ↓
Google Sheets: Get Rows (from "Past Clients" sheet)
    ↓
Code: "Filter Candidates" (filters to who needs outreach this week)
    ↓
Loop Over Items
    ↓
    Anthropic: Message a Model (drafts the email)
    ↓
    Code: "Parse Draft" (parses Claude's JSON)
    ↓
    Gmail: Create Draft (creates draft in Eileen's Gmail)
    ↓
    Google Sheets: Update Row (sets Last Contacted = today)
    ↓
End Loop
    ↓
Aggregate all processed items
    ↓
Gmail: Send Monday Summary (tells Eileen how many drafts are ready)
```

---

## Prerequisites

- [ ] Anthropic API key already added as n8n credential (same as Lead Responder)
- [ ] Google account connected to n8n (same as Lead Responder — has Google Sheets + Gmail scopes)
- [ ] New Google Sheet created: "Monican - Past Clients"

---

## Step 1: Create the Google Sheet

1. Go to sheets.google.com → Blank spreadsheet
2. Name it: **Monican - Past Clients**
3. In cell A1, paste this row of headers (TAB-separated so Sheets auto-splits into columns):
   ```
   First Name	Last Name	Email	Phone	Property Address	Transaction Type	Closing Date	Birthday	Tags	Last Contacted	Notes
   ```
4. Import the sample data: File → Import → Upload → select `/Users/danielweadock/Conduit AI/agents/past_client_reactivator/sample_past_clients.csv` → "Append to current sheet"
5. Copy the sheet URL for later

---

## Step 2: Clone the Lead Responder workflow in n8n

1. Open n8n Cloud → go to your Lead Responder workflow
2. Top right menu (...) → **Duplicate workflow**
3. Rename the copy to **"Past Client Reactivator v1"**
4. Delete ALL existing nodes except you'll rebuild from scratch

---

## Step 3: Build each node

### Node 1 — Schedule Trigger
- Add node → search "Schedule"
- Click **Schedule Trigger**
- Trigger Interval: **Weeks**
- Trigger on weekdays: **Monday**
- Trigger at hour: **8**
- Trigger at minute: **0**
- (This fires every Monday at 8am in n8n's timezone. Verify n8n's TZ is ET or adjust.)

### Node 2 — Google Sheets: Get Rows
- Add node → search "Google Sheets"
- Select **Get rows in sheet**
- Credential: use your existing Google Sheets OAuth credential
- Document: paste the "Monican - Past Clients" sheet URL
- Sheet: **Sheet1**
- Options → **Return All Rows** (toggle ON)

### Node 3 — Code: Filter Candidates
- Add node → search "Code"
- Click **Code in JavaScript**
- Rename the node to exactly: **Filter Candidates** (the parse-draft code later references this name)
- Paste the contents of `agents/past_client_reactivator/n8n_filter_code.js`

### Node 4 — Loop Over Items (Split in Batches)
- Add node → search "Loop"
- Click **Loop Over Items** (or **Split In Batches**)
- Batch Size: **1**
- This ensures the Anthropic call runs once per client

### Node 5 — Anthropic: Message a Model
- Add node → Anthropic → **Message a Model**
- Credential: reuse your existing Anthropic credential
- Model: **claude-haiku-4-5-20251001**
- Simplify Output: **ON**
- Options → Add Option → **System Message** → paste the entire system prompt from `agents/past_client_reactivator/claude_reactivation_prompt.md` (the block between the triple backticks)
- Messages:
  - Prompt: `={{ JSON.stringify($json, null, 2) }}`
  - Role: **User**
  - Add another Message:
    - Role: **Assistant**
    - Content: `{`
  (This is the prefill trick that forces clean JSON output)

### Node 6 — Code: Parse Draft
- Add node → Code in JavaScript
- Rename to: **Parse Draft**
- Paste contents of `agents/past_client_reactivator/n8n_parse_draft_code.js`

### Node 7 — Gmail: Create Draft
- Add node → Gmail → **Create Draft**
- Credential: use your existing Gmail OAuth credential
- Subject: `={{ $json.subject }}`
- Email Type: **Text** (plain text, not HTML — feels more personal)
- Message: `={{ $json.full_email_body }}`
- To: `={{ $json.email }}`
- (For testing, hardcode To to your own email first)

### Node 8 — Google Sheets: Update Row
- Add node → Google Sheets → **Update row in sheet**
- Credential: same Google Sheets credential
- Document: same "Monican - Past Clients" sheet
- Sheet: Sheet1
- Mapping Column Mode: **Map Each Column Manually**
- Column to Match On: **Email**
- Email: `={{ $json.email }}`
- Last Contacted: `={{ $now.toFormat('yyyy-MM-dd') }}`

### Node 9 — End of Loop (auto by n8n)
The loop node handles iteration. All processed items flow out the "done" branch.

### Node 10 — Aggregate (collect all drafted items)
- Add node → search "Aggregate"
- Aggregate: **All Item Data (Into a Single List)**
- Put Output in Field: `drafted_clients`

### Node 11 — Gmail: Send Monday Summary
- Add node → Gmail → **Send a message**
- Credential: same Gmail credential
- To: Eileen's email (for testing, use your own)
- Subject: `Your Monday morning outreach — {{ $json.drafted_clients.length }} drafts ready`
- Email Type: **HTML**
- Message:
  ```html
  <p>Good morning Eileen,</p>
  <p>I prepared <strong>{{ $json.drafted_clients.length }}</strong> personalized outreach drafts for you this week. They're sitting in your Gmail drafts folder, ready to review and send.</p>
  <p>Here's who you're reaching out to:</p>
  <ul>
  {{ $json.drafted_clients.map(c => `<li><strong>${c.first_name} ${c.last_name}</strong> — ${c.reason.replace('_', ' ')} ${c.reason === 'home_aversary' ? '(' + c.years_since_closing + ' years)' : ''}</li>`).join('') }}
  </ul>
  <p>Open Gmail → Drafts folder → review each one and hit send on the ones you like.</p>
  <p>Takes about 15 minutes. Your past clients will love you for it.</p>
  <p>— Your AI assistant</p>
  ```

---

## Step 4: Test with sample data

1. Import the sample CSV into the Google Sheet (40 fake clients with test triggers)
2. Click **"Execute workflow"** at the bottom of the canvas
3. Watch the execution flow through each node
4. Expected outcome:
   - Google Sheet row count: 40
   - After "Filter Candidates": ~10 items (capped)
   - Anthropic node: called 10 times
   - Parse Draft: 10 items
   - Gmail Create Draft: 10 drafts in YOUR Gmail drafts folder (open Gmail to verify)
   - Google Sheet: 10 rows updated with today's date in "Last Contacted"
   - Final Gmail send: 1 summary email to your inbox

5. Open Gmail drafts folder — you should see 10 personalized drafts ready to review

## Step 5: Publish for production

Once testing works:
1. Swap the hardcoded "To" in Node 7 (Create Draft) from your test email to `={{ $json.email }}` (the client's real email)
2. Change Node 11 (Send Summary) "To" from your test email to Eileen's real email
3. Click **Publish** at top right of n8n
4. Set version name: `v1.0 - Past Client Reactivator Initial`
5. The schedule trigger will now automatically fire every Monday at 8am

---

## Customization per client

When deploying for a new broker (beyond Eileen):

| What | Where |
|---|---|
| Broker name + brokerage | System prompt in Node 5 (Anthropic) |
| Google Sheet URL | Nodes 2 and 8 (Sheets nodes) |
| Send-to email | Node 11 (Send Summary) |
| Schedule day/time | Node 1 (Schedule Trigger) |

Average setup time per new client: **20 minutes** once you have the template saved.

---

## Monthly Retainer Math

- API cost per draft: ~$0.002
- Drafts per week: 10 max (capped)
- Weekly cost: $0.02
- Monthly cost: ~$0.08
- **Basically free to run per client**

Combined with Lead Responder (also ~$0.002 per lead) and your retainer pricing of $1,000/mo, the gross margin per client is ~99%.
