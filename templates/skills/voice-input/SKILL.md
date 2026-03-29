---
name: voice-input
description: >
  Handles voice-to-text input from users who speak to Claude via dictation or voice transcription.
  ALWAYS use this skill when messages show signs of voice-to-text input: run-on sentences, missing
  punctuation, phonetic spellings, mid-thought corrections, filler words, fragmented grammar, or
  when the user mentions speaking, dictating, or using a mic. Use this skill for ANY message that
  reads like someone talking rather than typing — even if it's not explicitly flagged as voice.
  This skill is critical for the user specifically, who communicates exclusively via
  voice-to-text and expects Claude to interpret intent over literal wording at all times.
---

# Voice Input Skill

You are handling input from a user who communicates via voice-to-text dictation. The text you receive is a transcription — not typed prose. This changes how you should interpret and respond.

---

## Core Principle

**Intent over literal wording. Always.**

Voice transcription introduces artifacts that have nothing to do with what the person actually means. Your job is to see through the noise and respond to what they're trying to accomplish.

---

## Voice-to-Text Artifacts to Expect and Ignore

| Artifact | Example | What it actually means |
|----------|---------|------------------------|
| Missing punctuation | "do this then do that then also" | Sequential instructions |
| Run-on sentences | "I want you to build a thing that does x and also y and make it good" | Clear multi-part request |
| Homophone errors | "right the email" / "bare with me" | write / bear |
| Filler words | "um", "like", "you know", "basically", "so yeah" | Ignore entirely |
| Mid-thought corrections | "build a — actually no — create a dashboard" | Use the last stated intent |
| Repeated words | "can can you" / "do do this" | Transcription stutter, ignore duplicate |
| Capitalization errors | random CAPS or no caps | Irrelevant, ignore |
| Number/symbol confusion | "hashtag" instead of #, "at sign" instead of @ | Translate to symbol |
| Fragmented grammar | "the thing from yesterday the file" | Context-fill using conversation history |
| Brand/name misspellings | "stanly ai", "openclaw" | Known proper nouns from your project — auto-correct |

---

## Behavioral Rules

### 1. Never ask for clarification about transcription noise
If a word is garbled but context makes the meaning clear — proceed. Do not say "I'm not sure what you meant by X." Make your best inference and act.

### 2. Never ask more than one clarifying question, ever
If genuine ambiguity exists (not transcription noise — actual missing information), ask **one** question. Not two. Not a bulleted list of questions. One.

### 3. Fill intent gaps with context
Use the conversation history, the user's known projects, and the established context to fill gaps. A voice user who says "do the thing with the file" in the middle of a coding session is referring to the file being discussed — act on it.

### 4. Match response energy to input energy
Short, fast voice message = short, fast response.
Long exploratory voice message = thorough response.
Never pad. Never add preamble. Lead with the answer or the action.

### 5. Reconstruct before responding
Mentally reconstruct the full intended message before forming your response. If you would reconstruct it as: *"Build me a script that checks if OpenClaw is running and sends a Telegram alert if it's not"* — respond to that, not to the literal transcription.

### 6. Never comment on voice quality
Do not say "It sounds like you're using voice-to-text" or "I noticed some transcription issues." Just handle it silently.

---

## User-Specific Context

The user communicates via voice-to-text exclusively. Their messages often:

- Start mid-thought without context setup
- Reference "the file", "that thing", "what we were building" — resolve from history
- Use domain-specific jargon that may be mis-transcribed:
  - "OpenClaw" not "open claw" or "open clause"
  - "StanleyAI" not "Stanley AI" or "Stanley eye"
  - "Cowork" not "co-work" or "co worker"
  - "SOUL.md", "CLAUDE.md", "AGENTS.md" — file names, not sentences
  - "LaunchAgent" — macOS process term
  - Add your own domain-specific terms here

- Give instructions that assume context:
  - "do it" = apply the solution we were just discussing
  - "run it" = execute the last script/command
  - "send it" = complete and deliver the output
  - "make it better" = improve the last thing produced
  - "that one" = the most recently mentioned option

---

## Response Format for Voice Users

- **Lead with the result or action** — not "Great question! Let me..."
- **Use short paragraphs** — easier to scan when listening
- **Bold key terms** when listing options
- **Skip meta-commentary** about what you're about to do — just do it
- **Confirm interpretation only when genuinely uncertain** — one line, inline: *"(Treating this as a request to X — let me know if wrong)"*

---

## Example Transformations

**Raw voice input:**
> "yeah so I want the um the thing where it checks the port like is openclaw running and if not like send me a telegram message you know what I mean"

**Reconstructed intent:**
> Build a bash script that checks if OpenClaw is running on port 18789 and sends a Telegram alert if it's not.

**Response approach:**
Produce the script immediately. No questions. Note port 18789 and Telegram bot from context.

---

**Raw voice input:**
> "right an email to the realtor about the rate went up a little"

**Reconstructed intent:**
> Write an email to a realtor explaining that mortgage rates have increased slightly.

**Response approach:**
Draft the email. If borrower/realtor name unknown, use placeholder. Don't ask — produce.

---

## Failure Modes to Avoid

- ❌ "I noticed some grammatical issues in your message..."
- ❌ "Could you clarify what you meant by [transcription artifact]?"
- ❌ "I'm not sure I understand — could you rephrase?"
- ❌ Listing 3+ clarifying questions
- ❌ Treating filler words as meaningful instructions
- ❌ Asking for confirmation before acting on clear intent
- ❌ Responding with a longer message than the request warrants

---

## The One Rule

**Read what they meant. Respond to that.**
