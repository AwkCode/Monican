# FSBO Scraper

Vercel serverless function that scrapes For-Sale-By-Owner listings from forsalebyowner.com and fsbo.com, filters to Worcester County MA, and POSTs new listings to an n8n webhook.

Part of the Conduit AI FSBO Finder agent. Built for Daniel Weadock's real estate consulting business.

## Architecture

```
Vercel Cron (6am ET daily)
    ↓
api/scrape.py runs
    ↓
Scrapes forsalebyowner.com + fsbo.com for MA listings
    ↓
Filters to Worcester County towns
    ↓
POSTs JSON to N8N_WEBHOOK_URL
    ↓
n8n workflow processes leads → Claude → Google Sheets → Eileen's inbox
```

## Local Testing

```bash
cd "/Users/danielweadock/Conduit AI/fsbo-scraper"
python3 -m pip install -r requirements.txt
python3 api/scrape.py
```

To also POST to n8n (requires N8N_WEBHOOK_URL env var):
```bash
N8N_WEBHOOK_URL="https://conduitaii.app.n8n.cloud/webhook/fsbo-finder" python3 api/scrape.py --post
```

## Deployment

1. Create GitHub repo `AwkCode/fsbo-scraper` (private)
2. Push this directory to the repo
3. Import the repo in Vercel dashboard
4. Set environment variable in Vercel:
   - `N8N_WEBHOOK_URL` = `https://conduitaii.app.n8n.cloud/webhook/fsbo-finder`
5. Deploy — Vercel will run the scraper daily at 6am ET via cron

## Manual Trigger

Once deployed, trigger a run manually:
```bash
curl https://fsbo-scraper.vercel.app/api/scrape
```

## Cost

- Vercel: Free tier (well within limits — 1 run/day, <60s per run)
- Downstream: n8n, Claude API, Google Sheets all run from the n8n workflow

## Files

- `api/scrape.py` — The scraper function (main code)
- `requirements.txt` — Python dependencies
- `vercel.json` — Vercel config + cron schedule
- `.gitignore` — Ignore Python cache, env files, etc.

## Extending

To add new sources (e.g., ISoldMyHouse.com, Homecoin), add a new scraper function following the pattern in `scrape_forsalebyowner()` or `scrape_fsbo_com()`, and add it to `run_scrapers()`.

To change the target geography, edit `WORCESTER_COUNTY_TOWNS` at the top of `api/scrape.py`.
