---
name: systematic-debugging
description: Structured debugging protocol — always activates before proposing any fix to a bug, test failure, or unexpected behavior. Forces diagnosis before solution. Use whenever encountering any error, bug, or unexpected output.
---

# Systematic Debugging Skill

Never guess at fixes. Always diagnose first.

## 5-step protocol

### 1. Reproduce
- Confirm exact error message
- Find minimal reproduction case
- Consistent or intermittent?

### 2. Isolate
- Which component owns this?
- What changed recently?
- Binary search to the exact line

### 3. Understand
- WHY is this happening?
- Is this a symptom of deeper issue?
- What assumption was violated?

### 4. Fix
- Minimal correct fix
- Why this fix is correct
- Other instances of same bug?

### 5. Prevent
- What test catches this next time?
- Broader pattern to fix?
