#!/usr/bin/env python3
"""
Conduit AI — Listing Description Generator
Takes property details and generates 4 output formats:
1. MLS listing description
2. Social media post
3. Email marketing blast
4. Open house announcement

Usage:
    python3 agents/listing_generator.py                    # Interactive mode
    python3 agents/listing_generator.py --demo             # Run with sample data
    python3 agents/listing_generator.py --file input.json  # From JSON file

This is a TEMPLATE-BASED version that works without an API key.
For AI-powered generation, use this in Claude Code:
    "Generate a listing for 123 Main St, 3bd/2ba, 1800sqft, $425K"
"""

import json
import os
import sys
from datetime import datetime, timedelta

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "demo_output")

# ============================================================
# SAMPLE DATA — Used for demos and testing
# ============================================================
SAMPLE_PROPERTY = {
    "address": "47 Wattaquadock Hill Rd, Bolton, MA 01740",
    "price": 625000,
    "bedrooms": 4,
    "bathrooms": 2.5,
    "sqft": 2400,
    "lot_acres": 1.8,
    "year_built": 1992,
    "property_type": "Single Family",
    "style": "Colonial",
    "features": [
        "Updated kitchen with granite counters and stainless appliances",
        "Hardwood floors throughout main level",
        "Primary suite with walk-in closet and ensuite bath",
        "Finished basement with home office",
        "Screened-in porch overlooking wooded backyard",
        "2-car attached garage",
        "New roof (2024)",
        "Central AC",
        "Town water and sewer"
    ],
    "neighborhood": "Quiet cul-de-sac in Bolton's sought-after Wattaquadock Hill neighborhood",
    "school_district": "Nashoba Regional School District",
    "agent_name": "Eileen Fitzpatrick",
    "agent_phone": "(978) 779-5234",
    "agent_email": "eileen@remaxbolton.com",
    "brokerage": "RE/MAX Traditions"
}


# ============================================================
# GENERATOR FUNCTIONS
# ============================================================

def format_price(price):
    """Format price as $XXX,XXX"""
    return f"${price:,.0f}"


def generate_mls_description(prop):
    """
    Generate a formal MLS listing description.

    THIS IS THE CORE PATTERN OF AN AGENTIC WORKFLOW:
    1. PARSE the input (property data)
    2. APPLY domain knowledge (MLS conventions, real estate language)
    3. PRODUCE structured output (formatted description)

    In a production system, this function would call an LLM API.
    This template version shows the STRUCTURE of what the LLM produces.
    """
    features_text = ". ".join(prop.get("features", []))

    lot_text = f"a {prop['lot_acres']}-acre" if isinstance(prop.get('lot_acres'), (int, float)) else "a generous"

    description = f"""**MLS LISTING DESCRIPTION**
---

**{prop['address']}** | {format_price(prop['price'])} | {prop['bedrooms']} BD / {prop['bathrooms']} BA | {prop['sqft']:,} SF

Welcome to this stunning {prop.get('style', 'home')} nestled in {prop.get('neighborhood', 'a desirable neighborhood')}. This {prop['bedrooms']}-bedroom, {prop['bathrooms']}-bath {prop.get('property_type', 'home')} offers {prop['sqft']:,} square feet of beautifully maintained living space on {lot_text} lot.

{features_text}

{f'Built in {prop["year_built"]}, this' if prop.get('year_built') else 'This'} home has been thoughtfully updated while maintaining its classic charm. {f'Located in the highly-rated {prop["school_district"]}.' if prop.get('school_district') else ''} Easy access to Route 495, I-190, and commuter routes to Boston.

Don't miss this exceptional opportunity in one of Central Massachusetts' most desirable communities. Schedule your private showing today!

**Listed by {prop.get('agent_name', 'Agent')}** | {prop.get('brokerage', '')}
{prop.get('agent_phone', '')} | {prop.get('agent_email', '')}

---
*{prop['sqft']:,} SF | {prop.get('lot_acres', 'N/A')} acres | Built {prop.get('year_built', 'N/A')} | {prop.get('property_type', 'Residential')}*
"""
    return description


def generate_social_media(prop):
    """
    Generate a casual social media post.

    AGENTIC PATTERN: Same input, DIFFERENT output format.
    The "agent" knows the conventions of social media vs MLS.
    """
    price = format_price(prop['price'])
    town = prop['address'].split(',')[1].strip() if ',' in prop['address'] else 'town'

    # Pick top 3 most interesting features
    features = prop.get('features', [])[:3]
    feature_bullets = "\n".join([f"✨ {f}" for f in features])
    lot_social = f"{prop['lot_acres']} acres" if isinstance(prop.get('lot_acres'), (int, float)) else "a gorgeous lot"

    post = f"""**SOCIAL MEDIA POST**
---

🏠 Just Listed in {town}! 🏠

{prop['bedrooms']} BD | {prop['bathrooms']} BA | {prop['sqft']:,} SF
💰 {price}

{feature_bullets}

This {prop.get('style', 'beautiful home')} on {lot_social} won't last long! {f'{prop.get("school_district")} schools.' if prop.get('school_district') else ''}

📞 DM me or call {prop.get('agent_phone', 'for details')} for a private showing!

#{town.replace(' ', '')}RealEstate #{town.replace(' ', '')}Homes #JustListed #NewListing #HomeForSale #RealEstate #DreamHome #{prop.get('style', 'Home').replace(' ', '')} #Massachusetts #OpenHouse

---
*Optimized for Instagram/Facebook. Pair with 5-8 property photos.*
"""
    return post


def generate_email_blast(prop):
    """
    Generate an email marketing blast for the agent's buyer list.

    AGENTIC PATTERN: This format requires DIFFERENT knowledge —
    email marketing best practices, subject lines, CTAs.
    """
    price = format_price(prop['price'])
    town = prop['address'].split(',')[1].strip() if ',' in prop['address'] else 'town'
    features = prop.get('features', [])[:5]
    feature_list = "\n".join([f"  • {f}" for f in features])

    email = f"""**EMAIL MARKETING BLAST**
---

**Subject Line Options (A/B test these):**
A: New Listing Alert: {prop['bedrooms']}BD {prop.get('style', 'Home')} in {town} — {price}
B: Just Listed: Your Dream Home in {town} Won't Last Long
C: {prop['sqft']:,} SF of Pure {town} Charm — See It Before It's Gone

---

Hi [First Name],

I wanted you to be among the first to know about this incredible new listing:

**{prop['address']}**
{prop['bedrooms']} Bedrooms | {prop['bathrooms']} Bathrooms | {prop['sqft']:,} Sq Ft | {price}

Here's what makes this one special:

{feature_list}

{f'Situated on {prop["lot_acres"]} acres in {prop.get("neighborhood", town)}' if isinstance(prop.get('lot_acres'), (int, float)) else f'Located in {prop.get("neighborhood", town)}'}, this property checks all the boxes.

**Want to see it in person?** Reply to this email or call me at {prop.get('agent_phone', '[phone]')} to schedule a private showing. In this market, great homes move fast — don't wait!

Best,
{prop.get('agent_name', '[Agent Name]')}
{prop.get('brokerage', '[Brokerage]')}
{prop.get('agent_phone', '')}

---
*Send to your buyer list within 24 hours of listing going live for maximum impact.*
"""
    return email


def generate_open_house(prop):
    """
    Generate an open house announcement.

    AGENTIC PATTERN: This format requires SCHEDULING knowledge
    and event-specific language. Different domain, same input.
    """
    price = format_price(prop['price'])
    town = prop['address'].split(',')[1].strip() if ',' in prop['address'] else 'town'

    # Suggest next weekend dates
    today = datetime.now()
    days_until_saturday = (5 - today.weekday()) % 7
    if days_until_saturday == 0:
        days_until_saturday = 7
    next_saturday = today + timedelta(days=days_until_saturday)
    next_sunday = next_saturday + timedelta(days=1)

    announcement = f"""**OPEN HOUSE ANNOUNCEMENT**
---

🏡 **OPEN HOUSE** 🏡

**{prop['address']}**
{format_price(prop['price'])} | {prop['bedrooms']} BD / {prop['bathrooms']} BA | {prop['sqft']:,} SF

📅 **Saturday, {next_saturday.strftime('%B %d')}** | 12:00 PM – 2:00 PM
📅 **Sunday, {next_sunday.strftime('%B %d')}** | 1:00 PM – 3:00 PM

Come see this beautiful {prop.get('style', 'home')} in {prop.get('neighborhood', town)}! Highlights include:

• {prop['sqft']:,} square feet of living space{f' on {prop["lot_acres"]} acres' if isinstance(prop.get('lot_acres'), (int, float)) else ''}
• {prop.get('features', ['Beautifully maintained'])[0]}
• {prop.get('features', ['', 'Move-in ready'])[1] if len(prop.get('features', [])) > 1 else 'Move-in ready'}
• {f'{prop["school_district"]} schools' if prop.get('school_district') else 'Great local schools'}

**Directions:** [Add driving directions or "GPS to {prop['address']}"]

No appointment necessary — just stop by! Questions? Call {prop.get('agent_name', 'me')} at {prop.get('agent_phone', '[phone]')}.

{prop.get('agent_name', '[Agent]')} | {prop.get('brokerage', '[Brokerage]')} | {prop.get('agent_phone', '')}

---
*Post to Zillow, Realtor.com, Facebook local groups, and agency website 5-7 days before the open house.*
"""
    return announcement


# ============================================================
# MAIN — Orchestration Layer
# ============================================================

def generate_all(prop):
    """
    THE ORCHESTRATOR — This is what makes it an "agent" not just a script.

    It takes ONE input and produces MULTIPLE outputs, each requiring
    different domain knowledge and format conventions.

    In a production agentic system:
    - This function would call an LLM 4 times with different prompts
    - Each call would have a specialized system prompt
    - The outputs would be validated and formatted
    - Results could be automatically posted to MLS, social media, email
    """
    outputs = {
        "mls": generate_mls_description(prop),
        "social": generate_social_media(prop),
        "email": generate_email_blast(prop),
        "open_house": generate_open_house(prop)
    }
    return outputs


def interactive_mode():
    """Collect property details from user input."""
    print("\n" + "="*60)
    print("  CONDUIT AI — Listing Description Generator")
    print("="*60 + "\n")

    prop = {}
    prop["address"] = input("Property address: ")
    prop["price"] = float(input("Listing price (numbers only): ").replace(",", "").replace("$", ""))
    prop["bedrooms"] = int(input("Bedrooms: "))
    prop["bathrooms"] = float(input("Bathrooms: "))
    prop["sqft"] = int(input("Square footage: ").replace(",", ""))
    prop["lot_acres"] = input("Lot size in acres (or press Enter to skip): ")
    if prop["lot_acres"]:
        prop["lot_acres"] = float(prop["lot_acres"])
    else:
        del prop["lot_acres"]
    prop["year_built"] = input("Year built (or press Enter to skip): ")
    if prop["year_built"]:
        prop["year_built"] = int(prop["year_built"])
    else:
        del prop["year_built"]
    prop["style"] = input("Style (Colonial, Cape, Ranch, etc.): ") or "Home"
    prop["property_type"] = "Single Family"

    print("\nKey features (one per line, empty line to finish):")
    features = []
    while True:
        f = input("  Feature: ")
        if not f:
            break
        features.append(f)
    prop["features"] = features

    prop["neighborhood"] = input("Neighborhood description (or press Enter to skip): ") or ""
    prop["school_district"] = input("School district (or press Enter to skip): ") or ""
    prop["agent_name"] = input("Agent name: ") or "Agent"
    prop["agent_phone"] = input("Agent phone: ") or ""
    prop["brokerage"] = input("Brokerage: ") or ""

    return prop


def main():
    args = sys.argv[1:]

    if "--demo" in args:
        print("\n🏠 Running with sample property data...\n")
        prop = SAMPLE_PROPERTY
    elif "--file" in args:
        idx = args.index("--file")
        if idx + 1 < len(args):
            with open(args[idx + 1]) as f:
                prop = json.load(f)
        else:
            print("Error: --file requires a filename")
            sys.exit(1)
    else:
        prop = interactive_mode()

    # Generate all outputs
    outputs = generate_all(prop)

    # Display
    print("\n" + "="*60)
    print("  GENERATED LISTING CONTENT")
    print("="*60)

    for key, content in outputs.items():
        print(f"\n{content}")

    # Save to file
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    address_slug = prop["address"].split(",")[0].replace(" ", "_").lower()
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"listing_{address_slug}_{date_str}.md"
    filepath = os.path.join(OUTPUT_DIR, filename)

    full_output = f"# Listing Content — {prop['address']}\n"
    full_output += f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    full_output += f"**Price:** {format_price(prop['price'])}\n\n"
    for key, content in outputs.items():
        full_output += content + "\n\n"

    with open(filepath, "w") as f:
        f.write(full_output)

    print(f"\n✅ All content saved to: {filepath}")
    print(f"\n💡 TIP: In Claude Code, you can also just say:")
    print(f'   "Generate a listing for {prop["address"]}"')
    print(f"   and get AI-powered, fully customized output.\n")


if __name__ == "__main__":
    main()
