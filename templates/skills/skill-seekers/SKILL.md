---
name: skill-seekers
description: Convert ANY documentation website, GitHub repo, or PDF into a Claude skill automatically using the Skill Seekers CLI tool. Use this skill whenever the user wants to turn docs into a skill, scrape documentation for Claude, create a skill from a framework's docs, package a knowledge base as a skill, or asks "can you make a skill for [framework/tool/library]". Also triggers when user mentions skill-seekers, doc-to-skill conversion, or wants to import external documentation into Claude. This is the universal skill factory — activate aggressively whenever building new skills from external sources.
---

# Skill Seekers — Doc-to-Skill Converter

Source: https://github.com/yusufkaraaslan/Skill_Seekers
Stars: 1.5k+ | Python CLI + MCP server

## What It Does
Scrapes documentation websites, GitHub repos, and PDFs → packages them into uploadable Claude `.zip` skills with organized `SKILL.md` + `references/` structure.

## Install (Mac Mini — one time)
```bash
cd ~/Projects
git clone https://github.com/yusufkaraaslan/Skill_Seekers.git
cd Skill_Seekers
pip install -e . --break-system-packages
# Or via pip:
pip install skill-seekers --break-system-packages
```

## Core Workflow
```bash
# 1. Scrape docs using a config
skill-seekers scrape --config configs/react.json

# 2. (Optional) AI-enhance the SKILL.md — uses Claude Code Max, no API key
skill-seekers enhance output/react/

# 3. Package into uploadable .zip
skill-seekers package output/react/

# 4. Upload output/react.zip to Claude.ai → Settings → Skills
```

## Sources Supported
- **Docs website**: `skill-seekers scrape --config configs/mysite.json`
- **GitHub repo**: `skill-seekers github --repo facebook/react`
- **PDF**: `skill-seekers pdf --file mybook.pdf`
- **Codebase**: `skill-seekers codebase --path ./my-project`

## Built-in Config Presets (178 available)
React, Vue, Django, FastAPI, Godot, Tailwind, Kubernetes, Astro, and 170+ more in `configs/`

## Custom Config Format
```json
{
  "name": "myframework",
  "description": "When to use this skill",
  "base_url": "https://docs.myframework.com/",
  "selectors": {
    "main_content": "article",
    "title": "h1",
    "code_blocks": "pre code"
  },
  "url_patterns": {
    "include": ["/docs", "/guide"],
    "exclude": ["/blog", "/about"]
  },
  "categories": {
    "getting_started": ["intro", "quickstart"],
    "api": ["api", "reference"]
  },
  "rate_limit": 0.5
}
```

## Enhancement Modes
```bash
# Local — uses Claude Code Max, free
skill-seekers enhance output/react/ 

# API — uses Anthropic API (~$0.15-0.30/skill)
skill-seekers enhance output/react/ --target claude --mode api

# Gemini
skill-seekers enhance output/react/ --target gemini

# GPT-4o  
skill-seekers enhance output/react/ --target openai
```

## Enhancement Workflows (65 presets)
```bash
skill-seekers create ./my-project --enhance-workflow security-focus
skill-seekers create ./my-project --enhance-workflow api-documentation
skill-seekers create ./my-project --enhance-workflow architecture-comprehensive
```

## Output Structure
```
output/
├── react_data/          # Raw scraped data (reusable)
│   ├── pages/           # JSON per page
│   └── summary.json
└── react/               # The skill
    ├── SKILL.md         # AI-enhanced with real examples
    └── references/      # Organized docs by category
        ├── index.md
        ├── getting_started.md
        ├── api.md
        └── ...
```

## MCP Server (for Claude Code integration)
```bash
./setup_mcp.sh   # Auto-configures all 5 agents
# Then in Claude Code just say:
# "Generate config for Tailwind at https://tailwindcss.com/docs"
# "Scrape docs using configs/react.json"
# "Package skill at output/react/"
```

## Export Targets Beyond Claude
```bash
skill-seekers package output/django --target langchain    # LangChain Documents JSON
skill-seekers package output/django --target llama-index  # LlamaIndex TextNodes
skill-seekers package output/django --target markdown     # Universal markdown
# Also: .cursorrules for Cursor IDE
```

## Quick Test (5 pages)
```bash
skill-seekers scrape --config configs/react.json --max-pages 10
skill-seekers package output/react/
# → output/react.zip ready to upload
```

## Docker
```bash
docker pull yusufk/skill-seekers:latest
docker run yusufk/skill-seekers skill-seekers scrape --config configs/react.json
```

## Path on Mac Mini
Clone to: `~/Projects/Skill_Seekers/`
Configs: `~/Projects/Skill_Seekers/configs/`
Output: `~/Projects/Skill_Seekers/output/`
