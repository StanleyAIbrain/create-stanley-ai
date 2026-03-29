# 🧠 StanleyAI — Cognitive Framework for Claude

> **Not just memory. Cognition.**

StanleyAI gives Claude a persistent brain with learning loops, behavioral adaptation, and 28+ specialized skills. Built by a mortgage broker who automated his entire business with AI.

```bash
npx create-stanley-ai
```

Three steps. Twenty minutes. Claude never forgets again.

---

## What This Does

| Without StanleyAI | With StanleyAI |
|---|---|
| Every chat starts from zero | Every chat builds on the last |
| Claude forgets your preferences | Claude adapts to how you work |
| Generic assistant responses | Personalized co-founder energy |
| One skill at a time | 28+ skills that activate on context |
| No learning from mistakes | Prediction errors → lessons → growth |

## The 3-Step Install

### Step 1: Run the installer
```bash
npx create-stanley-ai
```
Answer 8 questions about who you are, how you work, and what you need. The CLI generates everything.

### Step 2: Paste & Connect
Copy your generated preferences into Claude.ai Settings → Profile. Connect the Brain MCP in Connected Apps.

### Step 3: Soul Interview
Open a new Claude chat and say: *"Let's do my soul interview."* Claude learns how you think, what you need, and how to serve you best. Everything is stored in your Brain.

**That's it. You're running.**

---

## Developer Mode

Want the full local stack? Zero cloud dependency, full control:

```bash
npx create-stanley-ai --dev
```

This installs:
- Local Brain server (Node.js, zero PyTorch)
- All 28+ skills to `~/.claude/skills/`
- Claude Code plugin with hooks
- Knowledge system with your custom domains
- Health check: `npx create-stanley-ai doctor`

### Prerequisites for --dev mode
| Software | Version | Install |
|---|---|---|
| Node.js | 20+ | `brew install node` or nodejs.org |
| Python | 3.11+ | `brew install python@3.13` |
| Claude Code | Latest | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Git | Any | `xcode-select --install` |

---

## What's Inside

### 🧠 The Brain
Persistent semantic memory that survives across every conversation. Stores episodes, predictions, lessons, goals, and dreams. Six-dimension self-assessment scores brain growth over time.

### ⚡ 28+ Skills

| Category | Skills | APIs Needed |
|---|---|---|
| 📊 Business & Strategy | Mega prompts, brainstorming, automation, invoices | None |
| 🔍 Research & Intel | Web scraping, competitor intel, SEO, TikTok analysis | Firecrawl, Tavily (free tiers) |
| 🎬 Content & Media | AI images, video, presentations, writing | Replicate (optional) |
| 🔒 Dev & Security | OWASP, debugging, context engineering | None |
| ⚡ Platform & Infra | Google Workspace, voice input, vision analysis | Google OAuth (free) |

### 📁 Knowledge System
Organized by your projects and domains. Each domain gets `rules.md` (apply always), `knowledge.md` (reference), and `hypotheses.md` (test and promote). Nothing is ever deleted — mistakes become lessons.

### 🎯 Personalized Preferences
The CLI generates a complete behavioral profile from your 8 answers. Communication style, execution rules, project context, and growth directives — all tuned to you.

---

## How It Compares

| Feature | claude-mem | Mem0 | StanleyAI |
|---|---|---|---|
| Session memory | ✅ | ✅ | ✅ |
| Cross-platform | Code only | API | Browser + Code + Cowork |
| Learning loops | ❌ | ❌ | ✅ Prediction errors |
| Brain scoring | ❌ | ❌ | ✅ 6-dimension |
| Dream cycles | ❌ | ❌ | ✅ Cross-domain synthesis |
| Skills included | ❌ | ❌ | ✅ 28+ |
| Onboarding wizard | ❌ | ❌ | ✅ 8-question soul interview |
| Price | Free | $24M raised, paid | Free + $9/mo hosted option |

---

## The Origin Story

I'm a mortgage broker with 28 years of experience. I've funded over $2 billion in loans. When AI hit, I didn't hire a dev team — I became the dev team.

I built an autonomous trading system. An AI mortgage assistant. A content pipeline. A persistent memory server. And a framework that ties it all together.

This repo is that framework, stripped of my personal data and packaged for you.

**Built by a mortgage broker. Used by builders everywhere.**

---

## Commands

```bash
npx create-stanley-ai           # Install (hosted mode)
npx create-stanley-ai --dev     # Install (full local stack)
npx create-stanley-ai doctor    # Health check
npx create-stanley-ai update    # Pull latest skills
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). We welcome skill submissions, bug fixes, and brain mechanism proposals.

## License

MIT — use it, modify it, build on it. Just don't claim you invented it.

---

<p align="center">
  <strong>What if your AI never forgot?</strong><br>
  <a href="https://stanleyai.org">stanleyai.org</a> · 
  <a href="https://twitter.com/hellostanleyai">@hellostanleyai</a>
</p>
