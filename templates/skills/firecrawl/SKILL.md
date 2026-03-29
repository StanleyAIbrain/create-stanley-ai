---
name: firecrawl
description: "Web scraping, search, crawling, and content extraction via Firecrawl API. Use whenever the user wants to scrape a webpage, fetch clean content from a URL, search the web with full page scraping, crawl an entire site, extract structured data, get screenshots, or research topics online. Triggers on: 'scrape this', 'fetch that page', 'crawl the docs', 'search the web for', 'get the content from', 'pull this URL', 'extract data from', any URL the user wants content from, 'firecrawl', or when Claude's built-in web_fetch returns blocked/incomplete content. Firecrawl handles JavaScript rendering, anti-bot bypasses, and returns clean LLM-ready markdown. Use this INSTEAD of web_fetch when content is blocked, incomplete, or needs JS rendering. Also use for TikTok pages, SPAs, gated content, and any site that blocks standard fetchers."
---

# Firecrawl — Web Data Extraction for Claude

## When to Use
- User provides a URL and wants clean content (not raw HTML)
- web_fetch returns blocked, incomplete, or garbage content
- JavaScript-heavy sites (SPAs, React apps, TikTok, etc.)
- Scraping entire documentation sites
- Web search with full page content extraction
- Screenshots of web pages
- Structured data extraction (prices, contacts, products)
- Site mapping (discover all URLs on a domain)

## API Configuration

**API Key Location:** Stored in your .env file or secrets manager.

For Claude.ai browser environment, use the REST API directly:

```python
import requests, os, json

FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY", "")
BASE_URL = "https://api.firecrawl.dev/v2"
HEADERS = {
    "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
    "Content-Type": "application/json"
}
```

If the API key is not in environment, check D1 or ask user to provide it.

## Core Operations

### 1. Scrape a Single Page
Convert any URL to clean markdown, HTML, screenshots, or structured JSON.

```python
def firecrawl_scrape(url, formats=["markdown"], only_main_content=True):
    payload = {
        "url": url,
        "formats": formats,
        "onlyMainContent": only_main_content
    }
    r = requests.post(f"{BASE_URL}/scrape", headers=HEADERS, json=payload)
    return r.json()

# Usage
result = firecrawl_scrape("https://example.com")
print(result["data"]["markdown"])

# With screenshot
result = firecrawl_scrape("https://example.com", formats=["markdown", "screenshot"])

# Extract links too
result = firecrawl_scrape("https://example.com", formats=["markdown", "links"])
```

**Available formats:** markdown, html, rawHtml, screenshot, links, json, images, summary, changeTracking, attributes, branding

### 2. Search the Web
Search and optionally scrape full content from results.

```python
def firecrawl_search(query, limit=5, scrape=False):
    payload = {
        "query": query,
        "limit": limit
    }
    if scrape:
        payload["scrapeOptions"] = {"formats": ["markdown"]}
    r = requests.post(f"{BASE_URL}/search", headers=HEADERS, json=payload)
    return r.json()

# Basic search
results = firecrawl_search("AI agent benchmarks 2026")

# Search AND get full page content
results = firecrawl_search("Claude Code skills tutorial", limit=5, scrape=True)
```

### 3. Crawl an Entire Site
Recursively crawl and extract content from all pages.

```python
def firecrawl_crawl(url, limit=50, max_depth=3):
    payload = {
        "url": url,
        "limit": limit,
        "maxDepth": max_depth,
        "scrapeOptions": {"formats": ["markdown"]}
    }
    r = requests.post(f"{BASE_URL}/crawl", headers=HEADERS, json=payload)
    job = r.json()
    # Returns job ID — poll for completion
    return job

def check_crawl_status(job_id):
    r = requests.get(f"{BASE_URL}/crawl/{job_id}", headers=HEADERS)
    return r.json()
```

### 4. Map a Domain
Discover all URLs on a website instantly.

```python
def firecrawl_map(url, search=None):
    payload = {"url": url}
    if search:
        payload["search"] = search
    r = requests.post(f"{BASE_URL}/map", headers=HEADERS, json=payload)
    return r.json()

# Find all URLs
urls = firecrawl_map("https://docs.firecrawl.dev")

# Find specific pages
urls = firecrawl_map("https://example.com", search="pricing")
```

### 5. Extract Structured Data
Pull specific fields using a JSON schema.

```python
def firecrawl_extract(url, schema):
    payload = {
        "url": url,
        "formats": ["extract"],
        "extract": {"schema": schema}
    }
    r = requests.post(f"{BASE_URL}/scrape", headers=HEADERS, json=payload)
    return r.json()

# Example: extract product info
schema = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "price": {"type": "string"},
        "description": {"type": "string"},
        "features": {"type": "array", "items": {"type": "string"}}
    }
}
result = firecrawl_extract("https://example.com/product", schema)
```

## Decision Tree

```
Need web content?
├── Have a specific URL? → SCRAPE
├── No URL, need to find info? → SEARCH
├── Need all pages from a site? → CRAWL
├── Need to find a specific page on a site? → MAP + SCRAPE
├── Need structured data (prices, contacts)? → EXTRACT
└── Content behind login/clicks? → Use Claude Code with Firecrawl Browser
```

## Output Handling
- Save large outputs to files, don't dump into context
- Use `only_main_content=True` to strip nav/footer/ads
- For multiple formats, response is JSON with all requested data
- Single format returns raw content

## Rate Limits & Credits
- Free tier: 500 credits
- 1 credit per scrape/search query
- 1 credit per page crawled
- Check credits: GET /v2/credits

## For Claude Code (Mac mini)
The CLI is already installed. Use directly:
```bash
firecrawl scrape https://example.com -o .firecrawl/page.md
firecrawl search "query" --scrape -o .firecrawl/results.json --json
firecrawl crawl https://docs.example.com --limit 50 --wait --progress
firecrawl map https://example.com -o .firecrawl/sitemap.json
firecrawl browser "open https://example.com"
```

## Integration Notes
- Replaces web_fetch for blocked/JS-heavy sites
- Works on TikTok, SPAs, gated content
- Handles anti-bot, proxies, JS rendering automatically
- Cloud browser available for interactive pages (Code only)
- API key stored in D1 research_intel — NEVER expose in chat
