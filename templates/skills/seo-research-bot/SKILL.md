---
name: seo-research-bot
description: Build and run SEO research systems for the user's business and products. Analyzes keywords, competitor content, local search rankings, Google Business presence, and industry-specific search opportunities. Use whenever the user asks about SEO, search rankings, keywords, competitors, Google Business, local search, content strategy for search, or "what should I be writing about." Triggers on any local SEO or product discoverability question.
---

# SEO Research Bot Skill

Automated SEO intelligence for your business (local service provider) and your products (GitHub, SaaS, etc.).

## Two Separate SEO Worlds

### World 1: the user's business — Local SEO
Goal: Rank #1 in your city / your county / your metro area for your industry searches
Primary keywords: "[your industry] [your city]", "[your service] [your state]", "[your specialty] [your county]"

### World 2: StanleyAI — Developer SEO + GitHub
Goal: Drive GitHub stars via Google, dev blogs, Hacker News, Reddit
Primary keywords: "AI agent framework open source", "Claude automation framework", "multi-agent Claude system", "OpenClaw agent", "mortgage AI automation"

## Research Workflows

### Workflow 1: Competitor Analysis
When the user names a competitor or asks "who's ranking for X":

1. **Identify top 10 ranking pages** for target keyword
2. **Analyze each result**:
   - Domain authority signals (how established)
   - Content length and structure
   - Title tag and meta description patterns
   - Local signals (NAP, Google Business, reviews)
3. **Gap analysis**: What are they covering that the user isn't?
4. **Opportunity score**: How hard is it to beat them? (1-10)

### Workflow 2: Keyword Research
When the user asks "what should I rank for":

1. **Seed keywords** from his business context
2. **Expand** to related terms, questions, local modifiers
3. **Cluster** by intent:
   - Informational: "what is [your service]" (blog content)
   - Commercial: "best [your industry] [your state]" (landing page)
   - Transactional: "[action] [your service] [your city]" (conversion page)
   - Local: "[your industry] [your city]" (GBP + local page)
4. **Priority matrix**: Monthly search volume × competition difficulty × business relevance
5. **Content calendar**: Which keywords to target this month

### Workflow 3: Local SEO Audit
Your business specific:

Check:
- Google Business Profile completeness (hours, photos, posts, Q&A)
- Citation consistency (NAP across directories: Yelp, BBB, Zillow, LendingTree)
- Review velocity and response rate
- Local schema markup on website
- "Near me" keyword coverage
- Neighborhood pages (your city, your neighboring city, neighboring cities)

### Workflow 4: Content Gap Analysis
What content should your business have that it doesn't:

Common local service content that ranks:
- "How to [common question] in [your state] [year]"
- "[Service A] vs [Service B] [your state]"
- "[Your industry] programs [your state]"
- "[Your service] rates [your state] today"
- "[Specialty service] [your state] eligibility"
- "[Your industry] [your state] providers"
- "[Incentive/assistance programs] [your state]"

### Workflow 5: StanleyAI GitHub SEO
For the open-source product:

README optimization:
- H1 with primary keyword
- Clear one-line description (appears in Google snippet)
- Badges (stars, license, version) for trust signals
- Installation section (how-to content ranks)
- Use case section with specific keywords

External content:
- Dev.to article: "How I automated my business with Claude AI"
- Medium: "Building a multi-agent system without coding"
- Hashnode: "StanleyAI vs other Claude frameworks"
- Reddit r/selfhosted, r/MachineLearning posts

## Using Apify for SEO Research

Apify has actors that pull live search data:

```
Actor: apify/google-search-scraper
Input: {"queries": ["[your industry] [your city] [your state]"], "maxPagesPerQuery": 1}
Output: Top 10 results with titles, URLs, descriptions
```

```
Actor: apify/website-content-crawler
Input: {"startUrls": [{"url": "competitor-url.com"}], "maxCrawlPages": 20}
Output: All page content for gap analysis
```

## Output Format for Every SEO Request

**KEYWORD REPORT: [keyword]**
Monthly searches: ~X
Competition: Low/Medium/High
Current your business ranking: #X (or Not ranking)
Top competitor: [domain] — why they rank
Content needed: [blog/landing page/GBP post]
Priority: High/Medium/Low
Estimated time to rank: X months

**ACTION ITEMS** (always 3 specific next steps)
1. 
2. 
3.

## Quick Win Tactics for Your Business
1. **Google Business posts** — post every week (rates update, blog highlight, Q&A answer)
2. **Review requests** — text every closed client within 24 hours of completion
3. **Local pages** — one page per city served (your city, neighboring cities, etc.)
4. **Service pages** — "Current [your service] [city] [year]" updated monthly
5. **FAQ schema** — structured data on common industry questions

## Tracking
Set up monthly tracking spreadsheet:
- Target keyword rankings (Google Search Console + manual check)
- Google Business impressions and calls
- Website traffic from organic search
- Conversion rate from organic visitors

When the user asks for tracking, pull from Google Search Console via API if connected, or instruct manual check process.
