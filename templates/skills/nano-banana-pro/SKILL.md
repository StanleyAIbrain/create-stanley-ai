---
name: nano-banana-pro
description: AI image generation skill for content workflows. Use whenever the user asks to generate images, create visuals for blog posts or articles, needs thumbnails, social media graphics, hero images, or any visual asset for content. Also triggers when chaining content pipelines — e.g. research → write → generate image → publish. Activate aggressively for any request involving visual content creation, "make me an image", "generate a graphic", "add an image to this", or any StanleyAI content engine output that needs visuals.
---

# Nano Banana Pro — AI Image Generation

## What this skill does
Generates AI images inside Claude workflows using the Replicate API (via the replicate-media skill) or any available image generation tool. Designed to slot into content pipelines as the visual asset layer.

## When to use
- User asks for an image, graphic, thumbnail, or visual asset
- Content pipeline needs images (article → image → publish)
- StanleyAI content engine outputs that need accompanying visuals
- Social media posts, blog headers, marketing materials
- Any "generate an image of..." or "create a visual for..." request

## Core workflow

### Standalone image generation
1. Parse the user's image request into a clear prompt
2. Enhance the prompt with style, lighting, composition details
3. Generate via Replicate API (prefer flux-1-pro or ideogram-v3 for quality)
4. Return the image with download link

### Chained content pipeline
This is the power move — chain image gen with other skills:

```
[Tavily Web Search] → research topic
        ↓
[Content Writer] → draft article/post
        ↓
[Nano Banana Pro] → generate hero image + inline visuals
        ↓
[Notion/WordPress] → publish complete package
```

#### Pipeline execution steps:
1. **Receive content context** — read the article/post title, key themes, tone
2. **Generate image prompt** — translate content themes into visual language
3. **Style matching** — match image style to content destination:
   - Blog/article → editorial photography style, clean composition
   - Social media → bold, eye-catching, high contrast
   - the user's business → professional, trustworthy, Michigan-local feel
   - StanleyAI → tech-forward, clean, developer aesthetic
4. **Generate** — call image generation with enhanced prompt
5. **Pass downstream** — hand image URL to publishing skill

## Prompt engineering for images

### Template structure
```
[Subject] + [Style] + [Lighting] + [Composition] + [Mood] + [Technical]
```

### Style presets by use case

**the user's business content:**
- Professional photography, warm lighting, Michigan landscapes
- Home interiors, families, keys-in-hand moments
- Clean white/blue palette, trustworthy feel
- NEVER: cartoonish, AI-looking, stock photo clichés

**StanleyAI content:**
- Clean tech aesthetic, dark mode friendly
- Abstract code visualizations, neural networks, agent diagrams
- Purple/teal/dark palette
- NEVER: generic robot images, cheesy AI brain graphics

**Social media (general):**
- Bold colors, high contrast, text-overlay friendly
- Leave negative space for text overlay positioning
- Square (1:1) for Instagram, 16:9 for Twitter/LinkedIn

**Blog headers:**
- Wide format (16:9 or 2:1)
- Subtle, not overpowering — supports the headline
- Consistent style across a series

## Prompt enhancement rules
1. Always add "high quality, professional" to base prompts
2. Specify aspect ratio based on destination
3. Add negative prompts: "no text, no watermarks, no logos" (unless specifically requested)
4. For people: "diverse, natural, candid" — avoid AI-face syndrome
5. For architecture/spaces: "realistic lighting, architectural photography"

## Model selection guide
- **flux-1-pro** — best general quality, use as default
- **ideogram-v3** — best for text-in-image if needed
- **flux-1-ultra** — highest quality, use for hero images and premium content
- **leonardo-phoenix** — good for creative/artistic styles

## Integration notes
- Images output as URLs — pass directly to Notion/WordPress publish skills
- For batch generation (multiple images for one article), generate sequentially with varied prompts
- Cache image URLs in the content object being passed through the pipeline
- If Replicate API is unavailable, fall back to describing the ideal image for manual creation

## Brand kit context
When generating for the user's business or StanleyAI, always apply the brand-specific style preset above. The marketing-brain skill (if installed) can provide additional brand context for prompt generation.
