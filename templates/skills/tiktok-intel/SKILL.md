---
name: tiktok-intel
description: Extract and analyze TikTok video data, engagement metrics, trending hashtags, competitor accounts, and viral content patterns using Apify's TikTok scraper API. Use whenever the user mentions TikTok, wants to analyze TikTok content, track trends, scrape a TikTok profile or hashtag, or research viral videos. Also triggers for social media competitive intelligence and short-form content strategy.
---

# TikTok Intel Skill

Extract real-time TikTok data and turn it into actionable intelligence.

## Data you can pull
- Video metadata: views, likes, shares, comments, captions
- Profile data: follower count, total likes, video count
- Hashtag performance: top videos, engagement rates
- Trending content by keyword or niche
- Comment threads and sentiment
- Audio/music metadata

## Method 1: Apify TikTok Scraper API (recommended)

Sign up free at apify.com — 5,000 requests/month free tier.

```python
import requests, json

APIFY_TOKEN = "YOUR_APIFY_TOKEN"  # Set in environment

def scrape_tiktok_profile(username):
    url = f"https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs"
    payload = {
        "profiles": [username],
        "resultsPerPage": 20,
        "scrapeType": "user"
    }
    headers = {"Authorization": f"Bearer {APIFY_TOKEN}"}
    r = requests.post(url, json=payload, headers=headers)
    return r.json()

def scrape_tiktok_hashtag(hashtag):
    url = f"https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs"
    payload = {
        "hashtags": [hashtag],
        "resultsPerPage": 30,
        "scrapeType": "hashtag"
    }
    headers = {"Authorization": f"Bearer {APIFY_TOKEN}"}
    r = requests.post(url, json=payload, headers=headers)
    return r.json()
```

## Method 2: Bright Data TikTok MCP (zero-code)

Connect via MCP server in Claude settings:
- Server: TikTok MCP by Bright Data
- URL: Available via brightdata.com/ai/mcp-server/tiktok
- Free tier: 5,000 requests/month
- No API key setup needed — just connect the MCP

Once connected, Claude can directly query:
- tiktok_profile("@username")
- tiktok_hashtag("#trend")
- tiktok_search("keyword")

## Method 3: Trends-MCP (YouTube + TikTok + Instagram)

GitHub: github.com/rugvedp/Trends-MCP

Fetches trending data from all three platforms simultaneously.
Requires RapidAPI key for TikTok endpoint.

```bash
# Install
git clone https://github.com/rugvedp/Trends-MCP
cd Trends-MCP
pip install -r requirements.txt
```

## Analysis output format

After data is fetched, always generate:

---
**TIKTOK INTELLIGENCE REPORT**
**Query:** [profile/hashtag/keyword]
**Scraped:** [timestamp]

**TOP PERFORMING CONTENT**
| Video | Views | Likes | Engagement Rate | Hook |
|-------|-------|-------|----------------|------|

**TREND PATTERNS**
- Most common video length: 
- Top performing hooks:
- Dominant hashtags:
- Best posting times:

**VIRAL FORMULA**
[What are the top videos doing in the first 3 seconds?]

**CONTENT GAPS**
[What is NOT being covered that the audience wants?]

**RECOMMENDED ACTIONS**
1. 
2. 
3. 
---

## Engagement rate formula
Engagement Rate = (Likes + Comments + Shares) / Views × 100
Good TikTok ER: 3-6% | Excellent: 6%+

## Legal notes
- Only scrapes publicly available data
- Complies with GDPR/CCPA for public content
- Never scrapes private accounts or bypasses login
- TikTok ToS prohibits automated access — use Apify's compliant infrastructure

## Setup for the user
1. Go to apify.com → sign up free
2. Get API token from Settings → Integrations
3. Set APIFY_TOKEN in your environment
4. Or connect Bright Data TikTok MCP directly in claude.ai connectors
