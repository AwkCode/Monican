"""
FSBO Scraper — Vercel Serverless Function
Scrapes For-Sale-By-Owner listings from forsalebyowner.com and fsbo.com,
filters to Worcester County MA towns, and POSTs new listings to an n8n webhook.

Runs via Vercel Cron (see vercel.json) every morning at 6am ET.
Can also be triggered manually via GET request for testing.
"""

import json
import os
import time
import random
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, urljoin

import requests
from bs4 import BeautifulSoup


# ============================================================
# CONFIGURATION
# ============================================================

# All Worcester County, MA towns (60 total)
WORCESTER_COUNTY_TOWNS = {
    "ashburnham", "athol", "auburn", "barre", "berlin", "blackstone",
    "bolton", "boylston", "brookfield", "charlton", "clinton", "douglas",
    "dudley", "east brookfield", "fitchburg", "gardner", "grafton", "hardwick",
    "harvard", "holden", "hopedale", "hubbardston", "lancaster", "leicester",
    "leominster", "lunenburg", "mendon", "milford", "millbury", "millville",
    "new braintree", "north brookfield", "northborough", "northbridge",
    "oakham", "oxford", "paxton", "petersham", "phillipston", "princeton",
    "royalston", "rutland", "shrewsbury", "southborough", "southbridge",
    "spencer", "sterling", "sturbridge", "sutton", "templeton", "upton",
    "uxbridge", "warren", "webster", "west boylston", "west brookfield",
    "westborough", "westminster", "winchendon", "worcester",
}

# User agents to rotate through (avoid being flagged as a bot)
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
    "(KHTML, like Gecko) Version/17.0 Safari/605.1.15",
]

REQUEST_TIMEOUT = 15  # seconds
RATE_LIMIT_DELAY = 1.0  # seconds between requests

N8N_WEBHOOK_URL = os.environ.get("N8N_WEBHOOK_URL", "")


# ============================================================
# HTTP HELPERS
# ============================================================

def get_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }


def fetch(url, session=None):
    """Fetch a URL with rate limiting, user-agent rotation, and error handling."""
    if session is None:
        session = requests.Session()
    try:
        time.sleep(RATE_LIMIT_DELAY + random.uniform(0, 0.5))
        resp = session.get(url, headers=get_headers(), timeout=REQUEST_TIMEOUT)
        if resp.status_code == 200:
            return resp.text
        print(f"  [HTTP {resp.status_code}] {url}")
        return None
    except Exception as e:
        print(f"  [ERROR] {url}: {e}")
        return None


# ============================================================
# SCRAPERS
# ============================================================

def scrape_forsalebyowner():
    """
    Scrape forsalebyowner.com for MA listings.
    Target URL: https://www.forsalebyowner.com/homes-for-sale/ma
    """
    print("\n[forsalebyowner.com] Starting scrape...")
    listings = []
    session = requests.Session()

    # The state listing page
    state_url = "https://www.forsalebyowner.com/homes-for-sale/ma"
    html = fetch(state_url, session)
    if not html:
        print("  Failed to fetch state page")
        return listings

    soup = BeautifulSoup(html, "html.parser")

    # Find listing cards — FSBO sites typically use specific selectors
    # We try multiple patterns since the exact structure may vary
    cards = (
        soup.select("a[href*='/listing/']")
        or soup.select("div[class*='listing']")
        or soup.select("article")
    )

    print(f"  Found {len(cards)} potential listing elements")

    seen_urls = set()
    for card in cards:
        try:
            # Extract URL
            if card.name == "a":
                href = card.get("href", "")
            else:
                link = card.find("a", href=True)
                href = link.get("href", "") if link else ""

            if not href or "/listing/" not in href:
                continue

            full_url = urljoin(state_url, href)
            if full_url in seen_urls:
                continue
            seen_urls.add(full_url)

            # Extract preview text from the card
            text = card.get_text(" ", strip=True).lower()

            # Quick filter: is this likely in Worcester County?
            if not any(town in text for town in WORCESTER_COUNTY_TOWNS):
                continue

            # Fetch full listing detail
            detail_html = fetch(full_url, session)
            if not detail_html:
                continue

            listing = parse_fsbo_detail(detail_html, full_url, "forsalebyowner.com")
            if listing:
                listings.append(listing)
                print(f"  ✓ {listing.get('address', 'Unknown address')}")

        except Exception as e:
            print(f"  [ERROR parsing card] {e}")
            continue

    print(f"[forsalebyowner.com] Done. {len(listings)} Worcester County listings.")
    return listings


def parse_fsbo_detail(html, url, source):
    """Parse a single listing detail page. Works for forsalebyowner.com."""
    soup = BeautifulSoup(html, "html.parser")

    listing = {
        "url": url,
        "source": source,
        "address": None,
        "city": None,
        "state": "MA",
        "zip": None,
        "price": None,
        "beds": None,
        "baths": None,
        "sqft": None,
        "owner_name": None,
        "phone": None,
        "description": None,
    }

    # Try multiple extraction patterns — sites change layouts

    # Address: look for h1 or address tags
    h1 = soup.find("h1")
    if h1:
        listing["address"] = h1.get_text(strip=True)

    # Check for structured data (JSON-LD)
    for script in soup.find_all("script", {"type": "application/ld+json"}):
        try:
            data = json.loads(script.string or "{}")
            if isinstance(data, list):
                data = data[0] if data else {}
            if data.get("@type") in ("Product", "Residence", "SingleFamilyResidence", "House"):
                if "name" in data and not listing["address"]:
                    listing["address"] = data["name"]
                if "address" in data:
                    addr = data["address"]
                    if isinstance(addr, dict):
                        listing["address"] = addr.get("streetAddress") or listing["address"]
                        listing["city"] = addr.get("addressLocality")
                        listing["zip"] = addr.get("postalCode")
                if "offers" in data:
                    offers = data["offers"]
                    if isinstance(offers, dict):
                        listing["price"] = offers.get("price")
                if "numberOfRooms" in data:
                    listing["beds"] = data.get("numberOfRooms")
                if "floorSize" in data:
                    fs = data.get("floorSize", {})
                    if isinstance(fs, dict):
                        listing["sqft"] = fs.get("value")
        except (json.JSONDecodeError, KeyError, TypeError):
            continue

    # Fallback: regex-based extraction from body text
    body_text = soup.get_text(" ", strip=True)

    # Price — look for $XXX,XXX patterns
    if not listing["price"]:
        import re
        price_match = re.search(r"\$(\d{1,3}(?:,\d{3})+)", body_text)
        if price_match:
            listing["price"] = price_match.group(1).replace(",", "")

    # Beds/baths — look for common patterns
    import re
    if not listing["beds"]:
        beds_match = re.search(r"(\d+)\s*(?:BD|bed|bedroom)", body_text, re.I)
        if beds_match:
            listing["beds"] = beds_match.group(1)
    if not listing["baths"]:
        baths_match = re.search(r"(\d+(?:\.\d)?)\s*(?:BA|bath)", body_text, re.I)
        if baths_match:
            listing["baths"] = baths_match.group(1)
    if not listing["sqft"]:
        sqft_match = re.search(r"(\d{1,3}(?:,\d{3})?)\s*(?:SF|sqft|sq\.?\s*ft)", body_text, re.I)
        if sqft_match:
            listing["sqft"] = sqft_match.group(1).replace(",", "")

    # City — try to extract from address if present
    if listing["address"] and not listing["city"]:
        for town in WORCESTER_COUNTY_TOWNS:
            if town in listing["address"].lower():
                listing["city"] = town.title()
                break

    # Final filter: must be in Worcester County
    if listing["city"] and listing["city"].lower() not in WORCESTER_COUNTY_TOWNS:
        return None
    if not listing["city"]:
        # If we still don't have city, check the whole page text for a town name
        text_lower = body_text.lower()
        for town in WORCESTER_COUNTY_TOWNS:
            if town in text_lower:
                listing["city"] = town.title()
                break
        else:
            return None  # Can't determine city, skip

    # Description snippet
    desc_tag = (
        soup.find("meta", {"name": "description"})
        or soup.find("meta", {"property": "og:description"})
    )
    if desc_tag:
        listing["description"] = desc_tag.get("content", "")[:500]

    return listing


def scrape_fsbo_com():
    """
    Scrape fsbo.com for MA listings.
    Target URL: https://fsbo.com/mls/state/show/name/MA/
    """
    print("\n[fsbo.com] Starting scrape...")
    listings = []
    session = requests.Session()

    state_url = "https://fsbo.com/mls/state/show/name/MA/"
    html = fetch(state_url, session)
    if not html:
        print("  Failed to fetch state page")
        return listings

    soup = BeautifulSoup(html, "html.parser")

    # Find listing links
    cards = soup.select("a[href*='/listing/']") or soup.select("a[href*='/mls/show/']")
    print(f"  Found {len(cards)} potential listing elements")

    seen_urls = set()
    for card in cards:
        try:
            href = card.get("href", "")
            if not href:
                continue

            full_url = urljoin(state_url, href)
            if full_url in seen_urls:
                continue
            seen_urls.add(full_url)

            # Preview text filter
            text = card.get_text(" ", strip=True).lower()
            if not any(town in text for town in WORCESTER_COUNTY_TOWNS):
                continue

            detail_html = fetch(full_url, session)
            if not detail_html:
                continue

            listing = parse_fsbo_detail(detail_html, full_url, "fsbo.com")
            if listing:
                listings.append(listing)
                print(f"  ✓ {listing.get('address', 'Unknown address')}")

        except Exception as e:
            print(f"  [ERROR] {e}")
            continue

    print(f"[fsbo.com] Done. {len(listings)} Worcester County listings.")
    return listings


# ============================================================
# MAIN
# ============================================================

def run_scrapers():
    """Run all scrapers and return combined results."""
    all_listings = []
    all_listings.extend(scrape_forsalebyowner())
    all_listings.extend(scrape_fsbo_com())

    # Deduplicate by URL
    seen_urls = set()
    unique = []
    for listing in all_listings:
        if listing["url"] not in seen_urls:
            seen_urls.add(listing["url"])
            unique.append(listing)

    print(f"\n[TOTAL] {len(unique)} unique listings across all sources")
    return unique


def post_to_n8n(listings):
    """POST the listings to the n8n webhook."""
    if not N8N_WEBHOOK_URL:
        print("[n8n] No webhook URL configured, skipping POST")
        return False
    if not listings:
        print("[n8n] No listings to POST")
        return True

    try:
        resp = requests.post(
            N8N_WEBHOOK_URL,
            json={"listings": listings, "count": len(listings)},
            timeout=30,
        )
        print(f"[n8n] POSTed {len(listings)} listings — status {resp.status_code}")
        return resp.status_code < 400
    except Exception as e:
        print(f"[n8n] POST failed: {e}")
        return False


# ============================================================
# VERCEL HANDLER
# ============================================================

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Called by Vercel Cron or manual trigger."""
        try:
            listings = run_scrapers()
            posted = post_to_n8n(listings)

            response = {
                "success": True,
                "count": len(listings),
                "posted_to_n8n": posted,
                "listings": listings,
            }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response, indent=2).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())


# Allow running locally for testing
if __name__ == "__main__":
    import sys
    listings = run_scrapers()
    print(f"\n{'='*60}")
    print(f"RESULTS: {len(listings)} listings")
    print(f"{'='*60}")
    print(json.dumps(listings, indent=2))
    if "--post" in sys.argv:
        post_to_n8n(listings)
