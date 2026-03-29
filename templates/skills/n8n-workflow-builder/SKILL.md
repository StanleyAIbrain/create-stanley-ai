---
name: n8n-workflow-builder
description: Build N8N automation workflows that connect Claude to Gmail, Google Calendar, Google Sheets, Twitter/X, LinkedIn, Slack, Telegram, and any other tool. Use whenever the user wants to automate a multi-step process, connect Claude to external apps, build content pipelines, create triggers and actions, or says anything about automating tasks across tools. Also triggers for "workflow", "automate", "connect", "pipeline", "trigger", or "when X happens do Y" requests.
---

# N8N Workflow Builder Skill

Design, document, and generate N8N automation workflows that connect Claude to the real world.

## What N8N is
N8N is an open-source workflow automation tool (like Zapier but self-hostable and free). It connects apps via "nodes" — each node is an app or action. You chain them together: Trigger → Action → Action → Action.

Free cloud version: n8n.io
Self-hosted: runs on your Mac mini or a VPS

## the user's Core Stack for Automation
- **Trigger sources**: Gmail, Google Calendar, Telegram, Webhook, Schedule (Cron)
- **AI brain**: Claude API (Anthropic node) or HTTP Request to Claude
- **Actions**: Gmail send, Google Sheets write, Telegram message, Twitter/X post, Slack, Google Calendar create event
- **Data**: Google Sheets (database), Airtable, JSON files via Cowork

## Workflow Design Protocol

When the user describes something to automate, produce:

### 1. Workflow Name
Short, descriptive: "Mortgage Lead → CRM + Follow-up Email"

### 2. Trigger
What starts the workflow:
- Schedule: every morning at 7am
- Webhook: when something hits a URL
- Gmail: new email matching a filter
- Telegram: message received
- Manual: button click

### 3. Node Chain (step by step)
```
[TRIGGER] → [Node 1] → [Node 2] → [Node 3] → [END]
```
For each node specify:
- App name
- Action (read/write/send/create)
- What data passes in
- What data comes out

### 4. N8N JSON Skeleton
Provide copy-pasteable workflow JSON that imports directly into N8N.

### 5. Setup Instructions
What credentials to configure (which OAuth connections, API keys needed).

## the user's Priority Workflows

### Workflow A: Daily Morning Brief
```
[Schedule 7am] 
→ [HTTP: Fetch mortgage rates from FRED API]
→ [HTTP: Fetch BTC/ETH prices from CoinGecko]
→ [Claude API: Generate daily brief]
→ [Telegram: Send to @Stanley3macmini_bot]
```

### Workflow B: Mortgage Lead Intake
```
[Webhook: Form submission]
→ [Claude API: Analyze borrower pre-qual]
→ [Google Sheets: Log lead]
→ [Gmail: Send pre-qual result email]
→ [Google Calendar: Create follow-up reminder]
```

### Workflow C: StanleyAI Content Pipeline
```
[Schedule: Mon/Wed/Fri 9am]
→ [Claude API: Generate LinkedIn post about AI/StanleyAI]
→ [Claude API: Generate Twitter thread version]
→ [Google Sheets: Log content for review]
→ [Telegram: Send preview for approval]
→ [Wait for approval signal]
→ [HTTP: Post to LinkedIn API]
→ [HTTP: Post to Twitter API]
```

### Workflow D: YouTube → Content Repurpose
```
[Webhook: YouTube URL received via Telegram]
→ [Apify: Fetch transcript]
→ [Claude API: Extract 10 key insights]
→ [Claude API: Write LinkedIn post from insights]
→ [Claude API: Write Twitter thread from insights]
→ [Google Sheets: Save all versions]
→ [Telegram: Send results back]
```

### Workflow E: Crypto Alert
```
[Schedule: Every 15 min]
→ [HTTP: Fetch BTC price]
→ [IF: Price > threshold OR < floor]
→ [Claude API: Analyze SATOSHI signal]
→ [Telegram: Send trade alert]
```

## N8N Credential Setup Required
- **Anthropic (Claude)**: API key from console.anthropic.com
- **Gmail**: OAuth2 (Google Cloud Console)
- **Google Sheets**: OAuth2 (same Google Cloud project)
- **Telegram**: Bot token from @BotFather
- **Twitter/X**: Developer API keys from developer.twitter.com
- **Apify**: API token from apify.com

## Output Format

For every workflow request, produce:
1. Plain English description of what it does
2. Node-by-node diagram (text format)
3. N8N JSON (importable)
4. Credentials needed
5. Test instructions

## N8N Hosting for the user
Recommended: Run on Mac mini alongside OpenClaw
```bash
# Install N8N globally
npm install -g n8n

# Run with persistent data
n8n start --data-folder ~/.n8n

# Or as a LaunchAgent (always on)
# Add to ~/Library/LaunchAgents/com.stanleyai.n8n.plist
```
Access at: http://localhost:5678

## Key N8N Concepts
- **Nodes**: Individual app connections or logic blocks
- **Connections**: Lines between nodes, passing data
- **Expressions**: `{{$json.fieldName}}` to reference previous node data
- **IF node**: Branching logic (if this, do that)
- **Set node**: Modify/clean data between steps
- **Wait node**: Pause for human approval
- **Webhook node**: Receive data from external sources
- **HTTP Request node**: Call any API that doesn't have a native node
