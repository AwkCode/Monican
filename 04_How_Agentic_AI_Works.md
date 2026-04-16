# How Agentic AI Works — A Plain-English Guide
### For Daniel to reference before calls, demos, and conversations
### Monican | April 2026

---

## What Is an "Agent"?

An AI agent is software that takes an input, makes decisions about it, and produces useful output — without a human directing every step.

**A chatbot** waits for you to ask it something, gives one answer, and stops.
**An agent** takes a trigger (new email, new lead, new listing), figures out what kind of input it is, decides what to do, and produces multiple outputs automatically.

The difference is **autonomy**. A chatbot is a Q&A machine. An agent is a worker.

---

## The 3-Step Pattern (Every Agent Works This Way)

```
INPUT → PROCESSING → OUTPUT
```

That's it. Every AI agent in the world follows this pattern. The complexity comes from what happens in each step.

### Step 1: INPUT (The Trigger)
Something happens that starts the agent:
- A new lead fills out a form on your website
- A new listing gets entered into MLS
- An email arrives in the inbox
- A deadline is approaching on a transaction
- A client asks a question on the website chat

### Step 2: PROCESSING (The Brain)
The agent analyzes the input and makes decisions:
- **Classify:** What type of input is this? (hot lead vs cold, showing request vs question)
- **Enrich:** Pull in additional data (look up the property, check the CRM, find comparable sales)
- **Decide:** Based on the classification and data, what should happen next?

### Step 3: OUTPUT (The Action)
The agent produces results — often multiple outputs from one input:
- Draft a personalized email response
- Update the CRM record
- Send a text notification to the agent
- Schedule a follow-up task
- Generate a document

---

## Real Example: The Lead Responder Agent

Here's how the Lead Responder agent we built works:

```
INPUT:  New lead from Zillow
        "Hi, I'm interested in 47 Wattaquadock Hill Rd. Can I schedule a showing?"

PROCESSING:
        1. CLASSIFY → This is a "showing request" (not a general question)
        2. PERSONALIZE → Use their name, reference the specific property
        3. DETECT SIGNALS → They mentioned "relocating" and "schools"
           → Add school district info to the response

OUTPUT:
        1. Email response → Personalized, with showing time options
        2. CRM notes → Lead quality: Hot, Source: Zillow, Key signals
        3. Follow-up plan → Day 0: email, Day 1: call, Day 3: follow up
```

A human doing this manually takes 10-15 minutes per lead. The agent does it in seconds. At 20 leads/week, that's 3-5 hours saved.

---

## What Makes It "Agentic" (Not Just a Template)

Templates fill in blanks. Agents make decisions.

| Feature | Template/Automation | Agentic AI |
|---------|-------------------|------------|
| Same output every time | ✅ | ❌ (adapts to input) |
| Classifies input type | ❌ | ✅ |
| Changes behavior based on context | ❌ | ✅ |
| Produces multiple outputs | Sometimes | ✅ (email + CRM + tasks) |
| Handles edge cases | ❌ (breaks) | ✅ (degrades gracefully) |
| Improves over time | ❌ | ✅ (with feedback) |

The listing generator we built is a good example: it doesn't just fill in a template. It adjusts tone for luxury vs starter homes, picks the most compelling features to highlight, generates different copy for different platforms (MLS vs Instagram vs email), and includes platform-specific formatting and hashtags.

---

## The Tool Stack (How Agents Run in Production)

When you build an agent for a client, it lives somewhere and runs on something. Here's the stack:

### The Trigger Layer (What starts the agent)
- **Zapier / Make.com / n8n** — "When [event] happens in [tool], trigger the agent"
- Example: "When a new lead appears in our CRM, run the Lead Responder"

### The Brain Layer (Where the AI thinking happens)
- **Claude API / GPT-4 / Gemini** — The LLM that does the actual reasoning
- **Custom prompts** — You write specialized instructions for each agent task
- Example: "You are a real estate assistant. Classify this lead and draft a response."

### The Action Layer (What the agent does with its output)
- **Email (SendGrid/Gmail)** — Send the drafted response
- **CRM (HubSpot/Follow Up Boss)** — Update the lead record
- **SMS (Twilio)** — Text the agent about a hot lead
- **Google Sheets/Docs** — Log the interaction

### The Interface Layer (How humans interact with it)
- **Website chatbot** (CustomGPT, Tidio) — Customer-facing
- **Web form** — Internal tool for the team
- **Slack/Teams bot** — Team notifications
- **Email** — Trigger by forwarding an email

---

## How to Explain This to a Client (Your Pitch)

When a prospect asks "what do you actually build?", here's your answer:

> "You know how your team spends hours every week on [specific task they mentioned]? I build AI systems that handle that automatically.
>
> For example, when a new lead comes in from Zillow, right now someone on your team has to read the message, figure out what they want, draft a personalized response, update your CRM, and set a follow-up reminder. That takes 10-15 minutes per lead, and if they're busy showing homes, it might not happen for hours.
>
> I build an agent that does all of that in 10 seconds. It reads the lead, figures out if they want a showing or have a question or are looking to sell, drafts a personalized response, updates your CRM, and texts you if it's a hot lead. Your response time goes from hours to seconds, and your team gets that time back.
>
> The same pattern works for listing descriptions, transaction tracking, email management — any workflow where your team is doing the same steps over and over."

---

## How to Price This for a Client

Use this mental model:

**Time saved × Hourly cost = Value created**
**Your price = 20-30% of annual value created**

Example:
- Lead response takes 15 min per lead × 20 leads/week = 5 hours/week
- Admin assistant costs $25/hour = $125/week = $6,500/year
- Your agent saves 80% of that = $5,200/year in value
- Your price: $1,500 one-time build + $750/month retainer = fair trade

The client spends $1,500 upfront and $750/month. They save $5,200/year in labor. That's a 2-3 month payback period. Easy sell.

---

## What You DON'T Need to Know (Yet)

- You don't need to know how neural networks work
- You don't need to fine-tune models
- You don't need to write complex code (Claude Code does that)
- You don't need to understand transformer architecture
- You don't need to train custom models

You need to understand **workflows** (what steps humans take), **tools** (what software connects to what), and **value** (how much time/money this saves). That's it. The AI part is the easy part — the business understanding is the hard part, and that's where you add value.
