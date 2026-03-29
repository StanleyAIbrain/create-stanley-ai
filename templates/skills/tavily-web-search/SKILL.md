---
name: tavily-web-search
description: Real-time web search via Tavily API for research, news, content pipelines, fact-checking, and competitor intelligence. Use whenever Claude needs current information from the web, the user asks to research a topic, needs up-to-date data, wants to fact-check a claim, or any content pipeline step requires live web data. Triggers on "search for", "look up", "what's the latest on", "research this", "find current info", "fact check", "is this true", or any request where Claude's training data may be outdated. Also triggers when chaining into content pipelines — e.g. research → write → generate image → publish. Activate aggressively for any request that benefits from real-time web data, including StanleyAI content engine research, the user's business market intel, and SATOSHI crypto market analysis.
---

# Tavily Web Search

## What this skill does
Gives Claude real-time web search capabilities via the Tavily Search API. Returns clean, parsed, LLM-optimized results — not raw HTML. Designed to plug into agent workflows and content pipelines as the research layer.

## Setup (one-time)

### 1. Get API key
- Go to https://tavily.com
- Sign up for free tier (1,000 searches/month free)
- Copy your API key from the dashboard

### 2. Add to environment
```bash
export TAVILY_API_KEY="tvly-your-key-here"
```
Add to your shell profile (`~/.zshrc` or `~/.bashrc`) for persistence.

### 3. Verify
```bash
curl -s "https://api.tavily.com/search" \
  -H "Content-Type: application/json" \
  -d '{"api_key":"'"$TAVILY_API_KEY"'","query":"test","max_results":1}' | head -c 200
```
If you get JSON back with results, you're live.

## API reference

### Search endpoint
```
POST https://api.tavily.com/search
```

### Request body
```json
{
  "api_key": "$TAVILY_API_KEY",
  "query": "your search query",
  "search_depth": "basic",
  "include_answer": true,
  "include_raw_content": false,
  "max_results": 5,
  "include_domains": [],
  "exclude_domains": []
}
```

### Key parameters
| Parameter | Values | Use when |
|-----------|--------|----------|
| `search_depth` | `basic` (default), `advanced` | Use `advanced` for complex research, costs 2 credits |
| `include_answer` | `true`/`false` | `true` gives a direct AI-generated answer from results |
| `max_results` | 1-10 | 3-5 for quick lookups, 8-10 for deep research |
| `include_domains` | `["domain.com"]` | Lock to specific sources (e.g. mortgage news sites) |
| `exclude_domains` | `["domain.com"]` | Block low-quality or irrelevant sources |
| `topic` | `general`, `news`, `finance` | Use `news` for current events, `finance` for market data |

### Response structure
```json
{
  "answer": "Direct answer synthesized from results",
  "results": [
    {
      "title": "Page title",
      "url": "https://...",
      "content": "Relevant extracted text",
      "score": 0.95
    }
  ]
}
```

## Usage patterns

### Quick fact lookup
```python
import requests, os

def tavily_search(query, max_results=3, depth="basic", topic="general"):
    resp = requests.post("https://api.tavily.com/search", json={
        "api_key": os.environ["TAVILY_API_KEY"],
        "query": query,
        "search_depth": depth,
        "include_answer": True,
        "max_results": max_results,
        "topic": topic
    })
    return resp.json()
```

### Content pipeline research
When used as the first step in a content pipeline:
1. **Receive topic** from user or upstream skill
2. **Run 2-3 targeted searches** — don't rely on one broad query
3. **Extract key facts, stats, quotes** from results
4. **Pass structured research object downstream** to content writer

Example pipeline query strategy:
```
Topic: "Michigan mortgage rates March 2026"

Search 1: "Michigan mortgage rates March 2026" (topic: finance)
Search 2: "Michigan housing market trends 2026" (topic: news)  
Search 3: "first time homebuyer programs Michigan 2026" (depth: advanced)
```

### Competitor intelligence
```
Search 1: "[competitor name] mortgage rates"
Search 2: "[competitor name] reviews 2026"
Search 3: "[competitor name] services offerings"
```
Use `include_domains` to lock to review sites, or `exclude_domains` to skip competitor's own site.

### Crypto/SATOSHI market research
```
Search 1: "bitcoin price analysis today" (topic: finance)
Search 2: "crypto market sentiment March 2026" (topic: news)
Search 3: "[specific altcoin] technical analysis" (topic: finance)
```

## Best practices

### Query optimization
- Be specific — "Michigan FHA loan limits 2026" beats "loan limits"
- Use `topic: news` for anything time-sensitive
- Use `topic: finance` for market data, rates, prices
- Run multiple targeted queries instead of one vague one
- Include year/date in queries for freshness

### Rate limiting
- Free tier: 1,000 searches/month
- Basic search: 1 credit
- Advanced search: 2 credits
- Budget ~30 searches/day on free tier
- Upgrade to paid if running heavy content pipelines

### Source quality
- Use `include_domains` to lock to authoritative sources for sensitive topics
- For mortgage content: `["freddiemac.com", "fanniemae.com", "consumerfinance.gov", "nar.realtor"]`
- For crypto: `["coindesk.com", "theblock.co", "coingecko.com"]`
- For tech/AI: `["arxiv.org", "techcrunch.com", "theverge.com"]`

### Error handling
- If `TAVILY_API_KEY` is missing, tell user to run setup
- If rate limited (429), wait or suggest upgrading
- If no results, broaden the query and retry
- Always have a fallback: use Claude's training knowledge + note it may be outdated

## Integration with other skills
- **Content Research Writer** → Tavily provides the research, writer produces the article
- **Nano Banana Pro** → research visual trends before generating images
- **Twitter Thread Writer** → research viral examples and current data for threads
- **SEO Research Bot** → Tavily powers real-time SERP analysis
- **SATOSHI** → live market data and sentiment for trading decisions
