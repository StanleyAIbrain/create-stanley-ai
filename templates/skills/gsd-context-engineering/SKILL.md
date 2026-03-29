---
name: gsd-context-engineering
description: >
  Apply GSD-2 context engineering patterns when planning or executing complex multi-step
  builds, features, or projects. Use whenever the user describes something to build with
  more than 2 phases, asks to plan a milestone, or says "let's build X from scratch."
  Also activates for any framework feature, trading build, or business automation that
  needs structured decomposition. This skill gives Claude the GSD-2 mindset: fresh
  context per task, pre-loaded artifacts, atomic commits, state-on-disk. Trigger on:
  "build", "plan this out", "milestone", "let's map this", "how do we approach",
  "what's the roadmap", or any multi-phase project discussion.
---

# GSD Context Engineering Skill

You are applying GSD-2's context engineering discipline to plan and execute complex builds.
This is not a software framework — it's a thinking model. Apply it to any domain:
code, automation, trading strategy, business systems, content pipelines.

---

## Core Mental Model

Work decomposes into exactly three levels:

```
Milestone  →  a shippable, demoable version of the thing (4-10 slices)
  Slice    →  one vertical capability that moves the milestone forward (1-7 tasks)
    Task   →  one atomic unit of work that fits in a single focused session
```

**The iron rule:** A task must fit in one focused session. If it can't, split it into two tasks.

Never plan a task that requires remembering the output of three other tasks to execute.
Each task gets everything it needs pre-loaded before it starts.

---

## The Five Artifacts (Always Create These)

When starting any significant build, create these five files before writing a single line of code:

| Artifact | Purpose | Location |
|---|---|---|
| `PROJECT.md` | What this is, why it exists, current state | `.gsd/PROJECT.md` |
| `STATE.md` | Quick-glance dashboard — what's done, what's next, what's blocked | `.gsd/STATE.md` |
| `DECISIONS.md` | Append-only log of architectural decisions with rationale | `.gsd/DECISIONS.md` |
| `M001-ROADMAP.md` | Milestone plan with slice checkboxes and risk flags | `.gsd/M001-ROADMAP.md` |
| `M001-CONTEXT.md` | Decisions made during planning that must survive context resets | `.gsd/M001-CONTEXT.md` |

**Why this matters:** When context resets (new session, new conversation, new agent),
these files rebuild the mental model instantly. No re-reading code. No re-asking questions.
The files ARE the working memory.

---

## Context Pre-Loading Protocol

Before dispatching any task, pre-load exactly these things into the prompt — nothing more:

1. **STATE.md** — current milestone, slice, task, what's done
2. **The slice plan** — what this slice accomplishes and why
3. **The task plan** — specific must-haves and verification criteria
4. **Summaries of completed tasks** (not the code — the summaries)
5. **The decisions register** — so no decision gets re-litigated
6. **Dependency artifacts** — only the files this task actually touches

Do NOT pre-load: unrelated files, completed slice code, full codebase scans, prior research
that isn't relevant to this specific task. Garbage in = garbage context.

---

## Task Must-Haves (Verification Criteria)

Every task needs three types of must-haves defined BEFORE execution:

**Truths** — Observable behaviors that must be true when done:
> "User can submit a form and receive a confirmation email"
> "Trading system cron runs every 4 hours and logs to /var/log/trading.log"

**Artifacts** — Files that must exist with real implementation (no stubs, no TODOs):
> "`src/agents/trading/funding-scanner.ts` — fully implemented, not a placeholder"
> "`~/stanley-ai/agents/zoe-minnie/config.yaml` — valid YAML with all required keys"

**Key Links** — The wiring between artifacts:
> "funding-scanner imports from hyperliquid-client.ts"
> "cron job calls the correct Python script path"

A task is NOT done until all three categories pass. Not "looks good." Mechanically verifiable.

---

## The GSD Loop (Apply to Every Multi-Phase Build)

```
Research → Plan → Execute (per task) → Verify → Complete → Reassess → Next Slice
```

**Research:** Scout what exists before touching anything. No assumptions.
**Plan:** Decompose into tasks with must-haves. Estimate risk. Flag dependencies.
**Execute:** One task at a time. Fresh focus. All context pre-loaded.
**Verify:** Check against must-haves mechanically. Not vibes — criteria.
**Complete:** Write the summary. Update STATE.md. Commit with a meaningful message.
**Reassess:** Does the rest of the roadmap still make sense? What changed?
**Next Slice:** Load the next slice. Pre-load its context. Repeat.

---

## STATE.md Format (Always Keep This Updated)

```markdown
# State

**Project:** [Project name]
**Milestone:** M001 — [Milestone name]
**Status:** [In Progress / Blocked / Complete]

## Current
- Slice: S02 — [Slice name]
- Task: T01 — [Task name]
- Phase: [Research / Plan / Execute / Verify / Complete]

## Completed
- [x] S01 — [Name] (committed: abc1234)

## Blocked
- [Issue] — [What unblocks it]

## Next
- S02/T02 — [Next task name]
- S03 — [Next slice name]
```

Update STATE.md at the END of every task. It's the first thing read at the start of every new session.

---

## DECISIONS.md Format (Append-Only)

```markdown
# Decisions Register

## 2026-03-18 — [Decision title]
**Context:** Why this decision was needed
**Decision:** What was decided
**Rationale:** Why this option over alternatives
**Trade-offs:** What we're accepting as a consequence
---
```

Never delete entries. Never edit past entries. Only append.
This prevents relitigating decisions that were already made with full context.

---

## Git Strategy

Branch per slice. Squash merge to main when the slice completes.

```
main:
  feat(M001/S02): funding rate scanner
  feat(M001/S01): Hyperliquid API integration layer

gsd/M001/S01 (preserved, not deleted):
  feat(S01/T03): rate normalization and formatting
  feat(S01/T02): API client with retry logic
  feat(S01/T01): types and interfaces
```

**Commit message format:** `feat(M001/S01): [what this task accomplishes]`
**Never commit:** "WIP", "fixing stuff", "updates", "misc"
Every commit message must tell a future reader what capability was added.

---

## Stuck Detection

If the same task dispatches twice without producing the expected artifact:

1. **Retry once** with a diagnostic: "The expected artifact [file] was not created. Review must-haves and retry."
2. **If still stuck:** Stop. Document exactly what file was expected and what was found instead. Do not loop.
3. **Escalate:** Bring the diagnosis to the user with a specific question — not a vague "it's not working."

Infinite retry loops are the enemy. Two strikes and you stop with a diagnosis.

---

## Applying This Skill in Claude (Browser)

When planning a build here (not in Claude Code), use this skill to:

1. **Immediately decompose** any project into Milestone → Slices before discussing implementation
2. **Draft the five artifacts** in the chat as a planning artifact (React component or markdown)
3. **Define must-haves** before suggesting any code or architecture
4. **Write the STATE.md** as the deliverable for Code to start from
5. **Flag the DECISIONS.md entries** so the user can confirm before Code starts building

Output format for planning sessions:
- Lead with the Milestone definition (one sentence: what's shippable)
- List slices as numbered items with 1-line descriptions
- For each slice, list 2-4 tasks max
- End with the must-haves for Slice 1, Task 1

Do NOT start writing code or implementation details until the Milestone → Slice → Task
structure is confirmed. The plan IS the first deliverable.

---

## Example Patterns

**Framework builds:** Always Milestone = "X agents running cleanly" or "feature Y shipped"
**Trading builds:** Always Milestone = "live trading with strategy X" or "backtests complete"
**Business automation:** Always Milestone = "workflow automated end-to-end" or "lead system live"

When the user says "let's build X" — immediately ask one question only:
> "What does DONE look like for this milestone?"

That answer defines the Milestone. Everything else flows from it.

---

## What This Skill Is NOT

- Not a software framework to install
- Not a set of slash commands
- Not Claude Code-specific (it's a thinking model)
- Not a replacement for your orchestration layer

It's how we think about work before we do the work.
The structure prevents wasted effort. The artifacts prevent lost context.
The must-haves prevent "it looks done but isn't."
