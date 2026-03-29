---
name: gcao-prompt-framework
description: Automatically improve any vague or weak prompt using the GCAO framework (Goal, Context, Action, Output). Use whenever the user writes a simple or underdeveloped prompt, asks "how do I prompt better", or gets generic results from Claude. Also triggers when building prompts for templates, projects, or any system instruction. Transforms weak prompts into precise, high-quality requests that produce dramatically better results.
---

# GCAO Prompt Framework Skill

Transform weak, vague prompts into precise, high-quality requests that get dramatically better results.

## The GCAO Framework

Every great Claude prompt has 4 components:

**G — Goal**
What is the actual outcome you want? Not "write an email" but "write an email that gets a response from a realtor who hasn't replied in 2 weeks."

**C — Context**
What does Claude need to know? Your situation, what you've tried, relevant background, constraints, who this is for.

**A — Action**
The specific thing Claude should do. Be precise: "identify", "write", "analyze", "compare", "rewrite", "build".

**O — Output**
Exact format you want back. "Give me 3 options in bullet points", "Write this as a 3-paragraph email", "Return a numbered list with one sentence each."

## Before / After Examples

**WEAK:** "Write me a bio"
**GCAO:** "Goal: A professional bio that positions me as a mortgage expert for my website. Context: I'm the user, owner of the user's business in Farmington Hills MI, NMLS #129429, 15+ years experience, specialize in wholesale brokerage. Clients are first-time buyers and refinancers in Oakland County. Action: Write a compelling third-person bio that builds trust. Output: 150 words, ends with a call to contact me."

**WEAK:** "Help me with marketing"
**GCAO:** "Goal: Generate content ideas that attract real estate agents to refer mortgage business to the user's business. Context: Based in Farmington Hills MI, wholesale broker, work with Fannie/Freddie/FHA/VA. Agents want fast closings and responsive communication. Action: Create 10 specific LinkedIn post ideas that demonstrate mortgage expertise. Output: Title + 2-sentence description for each, ranked by estimated engagement potential."

## When This Skill Activates

Auto-applies when:
- User writes a prompt shorter than 20 words for a complex task
- Output comes back generic ("this seems like a weak prompt — want me to GCAO it?")
- User asks "can you make this better" on a prompt they share
- Building project instructions or system prompts
- Creating templates for recurring tasks

## The Iteration Principle

Don't stop at one response. After getting output:
- "Give me 6 more variations of option 2"
- "Make this more specific to [niche]"
- "Shorter, more direct"
- "Add a section on [topic]"

Keep refining until the output is exactly what you need.

## the user-Specific GCAO Templates

### Mortgage Lead Follow-Up
Goal: Re-engage a lead who hasn't responded in [X] days
Context: Lead is a [first-time buyer / refinancer], pre-qual'd for $[amount], last spoke on [date] about [topic], the user's business Farmington Hills
Action: Write a follow-up [text / email / voicemail script]
Output: [2 sentences / 3 paragraphs / 30-second script], casual but professional tone

### StanleyAI Launch Content
Goal: Generate [Twitter thread / LinkedIn post / Reddit post] that drives GitHub stars
Context: StanleyAI is an open-source Claude automation framework built by a mortgage broker. Target: developers, indie hackers, non-coders who want AI automation.
Action: Write content that tells the origin story and demonstrates the unique angle
Output: [Thread with 8 tweets / 250-word LinkedIn post], ends with GitHub link CTA

### SATOSHI Trade Analysis
Goal: Analyze this trade setup and give a go/no-go recommendation
Context: [Asset], [timeframe], [current price], [key levels], SATOSHI framework (risk-first, paper trading phase)
Action: Grade the setup A/B/C, identify invalidation, calculate R:R
Output: 3-section response: Setup Grade, Risk Analysis, Recommendation
