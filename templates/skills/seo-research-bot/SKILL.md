---
name: seo-research-bot
description: Build and run SEO research systems for the user's business and StanleyAI. Analyzes keywords, competitor content, local search rankings, Google Business presence, and mortgage-specific search opportunities. Use whenever the user asks about SEO, search rankings, keywords, competitors, Google Business, local search, content strategy for search, or "what should I be writing about." Triggers on any mortgage marketing, local Michigan SEO, or StanleyAI GitHub discoverability question.
---

# SEO Research Bot Skill

Automated SEO intelligence for the user's business (local Michigan mortgage broker) and StanleyAI (GitHub open-source product).

## Two Separate SEO Worlds

### World 1: the user's business — Local SEO
Goal: Rank #1 in Farmington Hills / Oakland County / Metro Detroit for mortgage searches
Primary keywords: "mortgage broker Farmington Hills", "mortgage broker Michigan", "home loan Farmington Hills", "refinance Michigan", "FHA loan Oakland County"

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
   - Informational: "what is FHA loan" (blog content)
   - Commercial: "best mortgage broker Michigan" (landing page)
   - Transactional: "apply for mortgage Farmington Hills" (conversion page)
   - Local: "mortgage broker near me Farmington Hills" (GBP + local page)
4. **Priority matrix**: Monthly search volume × competition difficulty × business relevance
5. **Content calendar**: Which keywords to target this month

### Workflow 3: Local SEO Audit
the user's business specific:

Check:
- Google Business Profile completeness (hours, photos, posts, Q&A)
- Citation consistency (NAP across directories: Yelp, BBB, Zillow, LendingTree)
- Review velocity and response rate
- Local schema markup on website
- "Near me" keyword coverage
- Neighborhood pages (Farmington Hills, West Bloomfield, Novi, Troy, Birmingham)

### Workflow 4: Content Gap Analysis
What content should the user's business have that it doesn't:

Common mortgage content that ranks:
- "How much house can I afford in Michigan [year]"
- "FHA vs conventional loan Michigan"
- "First-time homebuyer programs Michigan"
- "Refinance rates Michigan today"
- "USDA loan Michigan eligibility"
- "VA loan Michigan lenders"
- "Down payment assistance Michigan"

### Workflow 5: StanleyAI GitHub SEO
For the open-source product:

README optimization:
- H1 with primary keyword
- Clear one-line description (appears in Google snippet)
- Badges (stars, license, version) for trust signals
- Installation section (how-to content ranks)
- Use case section with specific keywords

External content:
- Dev.to article: "How I automated my mortgage business with Claude AI"
- Medium: "Building a multi-agent system without coding"
- Hashnode: "StanleyAI vs other Claude frameworks"
- Reddit r/selfhosted, r/MachineLearning posts

## Using Apify for SEO Research

Apify has actors that pull live search data:

```
Actor: apify/google-search-scraper
Input: {"queries": ["mortgage broker Farmington Hills Michigan"], "maxPagesPerQuery": 1}
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
Current Atlantis ranking: #X (or Not ranking)
Top competitor: [domain] — why they rank
Content needed: [blog/landing page/GBP post]
Priority: High/Medium/Low
Estimated time to rank: X months

**ACTION ITEMS** (always 3 specific next steps)
1. 
2. 
3.

## Quick Win Tactics for the user's business
1. **Google Business posts** — post every week (rates update, blog highlight, Q&A answer)
2. **Review requests** — text every closed borrower within 24 hours of closing
3. **Local pages** — one page per city served (Farmington Hills, Novi, West Bloomfield, etc.)
4. **Rate pages** — "Current mortgage rates [city] [year]" updated monthly
5. **FAQ schema** — structured data on common mortgage questions

## Tracking
Set up monthly tracking spreadsheet:
- Target keyword rankings (Google Search Console + manual check)
- Google Business impressions and calls
- Website traffic from organic search
- Conversion rate from organic visitors

When the user asks for tracking, pull from Google Search Console via API if connected, or instruct manual check process.
