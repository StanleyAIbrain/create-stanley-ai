---
name: competitor-intelligence
description: Research any competitor, market player, or industry leader using Claude's web search to extract their pricing, content strategy, sales funnel, positioning, and gaps. Use whenever the user asks about competitors, wants to research someone in their industry, asks "what are others doing", or needs market intelligence. Also triggers for business competitor research, framework comparisons, or trading strategy research.
---

# Competitor Intelligence Skill

Turn Claude's web search into a full competitive intelligence tool.

## What This Skill Does

Research any competitor or market player and return:
- Main offer and price points
- Content strategy and top-performing formats
- Sales funnel structure
- Positioning language and key messages
- Gaps and underserved angles you can own
- Tactical recommendations to compete or differentiate

## The Research Prompt Template

Use this structure for any competitor research:

```
Use web search to research [COMPETITOR/COMPANY]:
- Their main offer and price points
- Content strategy and what's working
- Sales funnel and lead capture approach
- Positioning language they use
- Identify 3 gaps or underserved angles

Context: I run [YOUR BUSINESS/CONTEXT].
Goal: [What you want to do with this intel]
Output: Structured report with actionable recommendations
```

## Example Research Domains

### Domain 1: Local Business Competitors
Research local competitors in your industry competing for customers in your area.

Target competitors to research:
- Local businesses in your city / your county
- National online competitors in your industry
- Other providers in your metro area

What to extract:
- Their rate marketing and lead gen approach
- Realtor referral partner strategies
- Review generation tactics
- Content topics driving organic traffic

### Domain 2: StanleyAI Framework Competitors
Research other Claude/AI agent frameworks targeting developers and non-technical builders.

Target projects to research:
- Other Claude automation frameworks on GitHub
- AI agent platforms (n8n AI, LangChain, CrewAI)
- No-code AI tools targeting non-developers

What to extract:
- GitHub star growth strategies
- Community building tactics
- Documentation quality and onboarding
- Unique positioning angles they own
- What's missing that StanleyAI could own

### Domain 3: Crypto Trading Research
Research trading strategies, on-chain analysts, and market frameworks.

What to extract:
- Entry/exit frameworks other traders use
- On-chain metrics they prioritize
- Risk management approaches
- Timeframes and asset focus

## Output Format

Every competitor research returns:

---
**COMPETITOR INTEL: [Name/Company]**
**Researched:** [Date]

**OFFER STRUCTURE**
- Main product/service: 
- Price points: 
- Upsell path: 

**CONTENT STRATEGY**
- Primary platforms: 
- Top-performing content types: 
- Posting frequency: 
- Key topics: 

**POSITIONING**
- How they describe themselves: 
- Target customer language: 
- Key differentiators they claim: 

**GAPS & OPPORTUNITIES**
1. [What they're missing]
2. [Underserved angle]
3. [Weakness you can exploit]

**RECOMMENDATIONS**
- How to differentiate: 
- Content to create: 
- Positioning to own: 
---

## Advanced Research Moves

**Multi-competitor comparison:** Research 3 competitors and produce a comparison matrix
**Trend analysis:** "Research what the top 5 [competitors] in [your state] are doing for lead gen in [year]"
**Strategy steal:** "Research how [Competitor] grew from 0 to [milestone] and extract the playbook"
**Gap finder:** "Research all Claude agent frameworks and tell me what none of them are doing"
