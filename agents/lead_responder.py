#!/usr/bin/env python3
"""
Conduit AI — Lead Response Auto-Drafter
Takes an incoming lead inquiry and generates a personalized response.

This is the SECOND demo agent — same pattern as the listing generator:
  Input → Processing → Structured Output

But different domain knowledge: sales psychology, urgency, personalization.

Usage:
    python3 agents/lead_responder.py          # Interactive mode
    python3 agents/lead_responder.py --demo   # Run with sample data
"""

import os
import sys
from datetime import datetime

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "demo_output")

# ============================================================
# SAMPLE DATA — For demos
# ============================================================
SAMPLE_LEADS = [
    {
        "lead_name": "Sarah Chen",
        "lead_email": "sarah.chen@gmail.com",
        "lead_phone": "(508) 555-0147",
        "source": "Zillow",
        "property_interest": "47 Wattaquadock Hill Rd, Bolton, MA",
        "message": "Hi, I saw this listing online and I'm interested in scheduling a showing. My husband and I are relocating from Worcester for the school district. Is this still available?",
        "agent_name": "Eileen Fitzpatrick",
        "agent_phone": "(978) 779-5234",
        "brokerage": "RE/MAX Traditions"
    },
    {
        "lead_name": "Mike Rodriguez",
        "lead_email": "mrodriguez87@yahoo.com",
        "lead_phone": "",
        "source": "Website Contact Form",
        "property_interest": "General — looking in Bolton/Stow area",
        "message": "We're first-time buyers looking for a 3BR under $500K in the Bolton or Stow area. What do you have available?",
        "agent_name": "Eileen Fitzpatrick",
        "agent_phone": "(978) 779-5234",
        "brokerage": "RE/MAX Traditions"
    },
    {
        "lead_name": "Jennifer Walsh",
        "lead_email": "jwalsh@comcast.net",
        "lead_phone": "(978) 555-0293",
        "source": "Realtor.com",
        "property_interest": "12 Main St, Bolton, MA",
        "message": "What's the tax situation on this property? Also curious about the basement — is it finished?",
        "agent_name": "Eileen Fitzpatrick",
        "agent_phone": "(978) 779-5234",
        "brokerage": "RE/MAX Traditions"
    }
]


# ============================================================
# RESPONSE GENERATORS
# ============================================================

def detect_lead_type(lead):
    """
    AGENTIC PATTERN: Classification step.
    Analyze the lead's message to determine what kind of response they need.

    In production, an LLM would do this classification.
    Here we use keyword matching to show the concept.
    """
    message = lead.get("message", "").lower()

    # Check buyer_inquiry FIRST since it's more specific
    if any(phrase in message for phrase in ["first-time", "looking for", "what do you have", "searching", "under $", "budget"]):
        return "buyer_inquiry"
    elif any(word in message for word in ["showing", "see it", "visit", "tour", "schedule", "still available"]):
        return "showing_request"
    elif any(word in message for word in ["tax", "hoa", "basement", "roof", "inspection", "question"]):
        return "property_question"
    elif any(word in message for word in ["sell", "selling", "list my", "what's my home worth"]):
        return "seller_inquiry"
    else:
        return "general"


def generate_response(lead):
    """
    THE CORE AGENT: Takes a lead and generates a personalized response.

    This demonstrates the full agentic pattern:
    1. CLASSIFY the input (what type of lead is this?)
    2. PERSONALIZE (use their name, reference their specific message)
    3. APPLY DOMAIN KNOWLEDGE (real estate sales best practices)
    4. GENERATE STRUCTURED OUTPUT (email response + internal notes)
    """
    lead_type = detect_lead_type(lead)
    first_name = lead["lead_name"].split()[0]
    agent = lead.get("agent_name", "Agent")
    agent_first = agent.split()[0]

    # Response speed note
    speed_note = "⚡ SPEED MATTERS: Studies show leads contacted within 5 minutes are 21x more likely to convert than those contacted after 30 minutes."

    output = f"""## Lead Response — {lead['lead_name']}
**Source:** {lead.get('source', 'Unknown')} | **Type:** {lead_type.replace('_', ' ').title()}
**Property:** {lead.get('property_interest', 'General inquiry')}
**Their message:** "{lead.get('message', 'No message')}"

{speed_note}

---

### EMAIL RESPONSE (Send within 5 minutes)

**Subject:** Re: {lead.get('property_interest', 'Your Real Estate Inquiry')}

Hi {first_name},

"""

    if lead_type == "showing_request":
        output += f"""Thank you for reaching out about {lead.get('property_interest', 'this property')}! Great news — it's still available and generating a lot of interest.

I'd love to set up a private showing for you and your husband. I have availability this week:

  • **Tomorrow** at 10:00 AM or 4:00 PM
  • **Thursday** at 11:00 AM or 5:30 PM
  • **Saturday** at 12:00 PM or 2:00 PM

Which works best for you? If none of those times work, just let me know your schedule and I'll make it happen.

"""
        if "school" in lead.get("message", "").lower() or "relocat" in lead.get("message", "").lower():
            output += f"""By the way — you mentioned relocating for the schools. The Nashoba Regional School District is excellent and was recently ranked in the top 15% statewide. I can share more details about the schools when we meet, and I know the area really well if you have questions about the community.

"""

    elif lead_type == "buyer_inquiry":
        output += f"""Thanks for reaching out! I'd love to help you find the right home in the Bolton/Stow area.

Based on what you're looking for — 3 bedrooms under $500K — I actually have a few properties in mind that could be a great fit. The market is moving quickly right now, so the best next step would be a quick 15-minute call where I can learn a bit more about what you're looking for and then send you a curated list.

Do you have time for a quick call this week? Here are a few slots:

  • **Tomorrow** at 10:00 AM or 2:00 PM
  • **Thursday** at 11:00 AM or 4:00 PM

In the meantime, I'll pull together some listings that match your criteria so we can hit the ground running.

"""

    elif lead_type == "property_question":
        output += f"""Great questions about {lead.get('property_interest', 'the property')}! Let me get you those answers.

I'm pulling the detailed property information right now and will have specifics for you within the hour. In the meantime, would you like to schedule a showing? Seeing the property in person is the best way to get a feel for the space and the neighborhood.

I have availability this week — just let me know what works for your schedule and I'll set it up.

"""

    elif lead_type == "seller_inquiry":
        output += f"""Thanks for reaching out about selling your home! You picked a great time to be thinking about this — the Bolton area market has been very strong.

I'd love to set up a free, no-obligation consultation where I can:
  • Walk through your home and discuss its best features
  • Share recent comparable sales in your neighborhood
  • Give you a realistic price range based on current market data

This usually takes about 30 minutes and there's absolutely no pressure. Would later this week work for you?

"""

    else:
        output += f"""Thank you for reaching out! I'd love to help.

Could you tell me a bit more about what you're looking for? Whether you're buying, selling, or just exploring your options, I'm happy to chat and point you in the right direction.

The easiest next step would be a quick 10-minute call — I can learn more about your situation and see how I can help. Do you have any availability this week?

"""

    # Close
    output += f"""Best,
{agent}
{lead.get('brokerage', '')}
{lead.get('agent_phone', '')}

---

### INTERNAL NOTES (For CRM)

**Lead quality:** {'🔥 Hot' if lead_type == 'showing_request' else '🟡 Warm' if lead_type in ['buyer_inquiry', 'seller_inquiry'] else '🔵 Cool'}
**Lead type:** {lead_type.replace('_', ' ').title()}
**Source:** {lead.get('source', 'Unknown')}
**Key details from message:**
"""

    # Extract key details
    message = lead.get("message", "")
    if "relocat" in message.lower():
        output += "  - Relocating (motivated buyer)\n"
    if "school" in message.lower():
        output += "  - Schools are a priority\n"
    if "first-time" in message.lower():
        output += "  - First-time buyer (may need more hand-holding, possible FHA)\n"
    if "invest" in message.lower():
        output += "  - Investment-minded\n"
    if lead.get("lead_phone"):
        output += f"  - Provided phone: {lead['lead_phone']} (call them!)\n"
    else:
        output += "  - No phone provided (email only — ask for phone in response)\n"

    output += f"""
**Suggested follow-up cadence:**
  - Day 0: Send this email response (ASAP)
  - Day 1: Call if phone provided, text if mobile
  - Day 3: Follow up email if no response
  - Day 7: Final follow-up with new listings or market update
  - Day 14: Add to monthly newsletter list
"""

    return output


# ============================================================
# MAIN
# ============================================================

def interactive_mode():
    print("\n" + "="*60)
    print("  CONDUIT AI — Lead Response Auto-Drafter")
    print("="*60 + "\n")

    lead = {}
    lead["lead_name"] = input("Lead name: ")
    lead["lead_email"] = input("Lead email: ")
    lead["lead_phone"] = input("Lead phone (or press Enter): ")
    lead["source"] = input("Source (Zillow, Website, Realtor.com, Referral, etc.): ")
    lead["property_interest"] = input("Property they're interested in (or 'General'): ")
    print("Their message (paste it, then press Enter):")
    lead["message"] = input("  > ")
    lead["agent_name"] = input("Your name: ") or "Agent"
    lead["agent_phone"] = input("Your phone: ") or ""
    lead["brokerage"] = input("Your brokerage: ") or ""

    return [lead]


def main():
    args = sys.argv[1:]

    if "--demo" in args:
        print("\n📨 Running with sample lead data...\n")
        leads = SAMPLE_LEADS
    else:
        leads = interactive_mode()

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    all_output = f"# Lead Responses — {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n"

    for i, lead in enumerate(leads, 1):
        print(f"\n{'='*60}")
        print(f"  LEAD {i}: {lead['lead_name']}")
        print(f"{'='*60}")

        response = generate_response(lead)
        print(response)
        all_output += response + "\n\n---\n\n"

    # Save
    date_str = datetime.now().strftime("%Y-%m-%d")
    filepath = os.path.join(OUTPUT_DIR, f"lead_responses_{date_str}.md")
    with open(filepath, "w") as f:
        f.write(all_output)

    print(f"\n✅ All responses saved to: {filepath}")
    print(f"\n💡 KEY INSIGHT: This agent does 3 things a human would do:")
    print(f"   1. CLASSIFIES the lead type (showing request vs buyer vs question)")
    print(f"   2. PERSONALIZES the response (references their specific message)")
    print(f"   3. GENERATES structured output (email + CRM notes + follow-up plan)")
    print(f"   That's the agentic pattern: Classify → Personalize → Generate.\n")


if __name__ == "__main__":
    main()
