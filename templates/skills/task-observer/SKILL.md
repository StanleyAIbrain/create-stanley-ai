---
name: task-observer
description: A meta-skill that observes what Claude is doing and builds/improves specialized skills for recurring tasks. Activates when Claude notices it's doing the same type of task repeatedly. Also builds new skills on demand.
---

# Task Observer (Meta-Skill)

Watches Claude's task patterns and builds new skills for repeated workflows.

## What it does
1. Tracks recurring task patterns in conversations
2. Identifies when a skill would improve performance
3. Auto-proposes new skill creation for repeated tasks
4. Builds and refines skills iteratively

## Activation
Triggers automatically when:
- Same type of task appears 3+ times
- User explicitly asks to 'build a skill for this'
- A workflow is complex enough to benefit from a dedicated skill

## Skill building process
1. Observe the task pattern
2. Extract the key steps and requirements
3. Write a SKILL.md that encodes best practices
4. Test the skill on similar tasks
5. Refine based on results

## Meta-capability
This skill can improve itself — if the skill-building process itself could be better, it will propose improvements to this SKILL.md.
