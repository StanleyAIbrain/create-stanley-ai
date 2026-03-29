# Contributing to StanleyAI

We welcome contributions! Here's how to help.

## Adding a Skill

1. Create a folder: `templates/skills/your-skill-name/`
2. Write a `SKILL.md` with YAML frontmatter (name, description) and markdown instructions
3. Keep it under 500 lines — use `references/` for overflow
4. Test it by copying to `~/.claude/skills/` and running Claude
5. Submit a PR with a clear description of what the skill does and when it triggers

### Skill Format

```
your-skill-name/
├── SKILL.md          # Required — YAML frontmatter + instructions
├── scripts/          # Optional — executable code
├── references/       # Optional — docs loaded on demand
└── assets/           # Optional — templates, icons, fonts
```

### YAML Frontmatter

```yaml
---
name: your-skill-name
description: >
  When to use this skill and what it does. Be specific about trigger
  phrases and contexts. Make it slightly "pushy" — Claude tends to
  under-trigger skills, so include many relevant contexts.
---
```

## Reporting Issues

Open a GitHub issue with:
- What you expected
- What happened
- Your OS and Node.js version
- Output of `npx create-stanley-ai doctor`

## Brain Mechanism Proposals

Want to propose a new brain mechanism? Open an issue with:
- The mechanism name and category (Core or Consciousness layer)
- What problem it solves
- How it works (inputs, processing, outputs)
- How it interacts with existing mechanisms

## Code Style

- Zero dependencies in the CLI (pure Node.js)
- ES modules (`import`, not `require`)
- No TypeScript (keep the barrier low)
- Comment the "why", not the "what"
