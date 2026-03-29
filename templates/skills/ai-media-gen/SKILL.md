---
name: ai-media-gen
description: "Universal AI media generation skill — images, videos, audio, and more. Automatically routes to the best available backend: Cloudflare Workers AI (free, no API key — uses connected MCP), Replicate (200+ models when token available), or Apify actors. Use this skill whenever the user wants to generate images, videos, audio, animations, upscale media, do lipsync, create thumbnails, social graphics, or any AI media. Triggers on: 'make me an image', 'generate a video', 'create a graphic', 'text to image', 'text to video', 'animate this', 'image to video', 'generate music', 'voice clone', 'lipsync', 'upscale', or mentions FLUX, Wan, Kling, Veo, Minimax, Seedream, Imagen, Ideogram. Also triggers during content pipelines — e.g. research → write → generate image → publish. Activate AGGRESSIVELY for any request involving visual or audio content creation. This skill replaces replicate-media and nano-banana-pro as the single entry point for all AI media generation."
---

# AI Media Generation — Universal Skill

Generate images, videos, audio, and more using the best available backend automatically. No manual API key management required in most cases.

## Provider Priority (Auto-Routing)

When a media generation request comes in, use this decision tree:

### 1. CLOUDFLARE WORKERS AI (Primary — No API Key Needed)
- **Auth**: Handled automatically via the Cloudflare MCP connector
- **Capabilities**: Text-to-image (FLUX models), text generation, embeddings
- **Best for**: Image generation (fast, free tier generous, no key to manage)
- **Limitations**: No video generation, no audio/TTS, no lipsync
- **Use when**: User wants images AND is in Claude.ai chat (not Mac mini)

### 2. REPLICATE (Secondary — Full Power, Needs Token)
- **Auth**: `REPLICATE_API_TOKEN` environment variable
- **Capabilities**: EVERYTHING — 200+ models for video, image, audio, lipsync, upscale
- **Best for**: Video generation, audio, lipsync, anything Cloudflare can't do
- **Use when**: Token is available (Mac mini always has it; Claude.ai needs user to paste it)

### 3. APIFY ACTORS (Tertiary — Specialized Tasks)
- **Auth**: Handled via Apify MCP connector
- **Capabilities**: Content pack generation, social media assets, video analysis
- **Best for**: Batch content creation pipelines, social media asset packs
- **Use when**: The task is a content pipeline (research → generate → publish)

---

## Decision Flow

```
User requests media generation
         │
         ▼
  Is it an IMAGE request?
    YES ──► Use Cloudflare Workers AI (no key needed)
    │        └─ If Cloudflare fails/unavailable → fall to Replicate
    │
    NO (video/audio/lipsync/upscale)
         │
         ▼
  Is REPLICATE_API_TOKEN available?
    YES ──► Use Replicate (full model catalog)
    │
    NO ──► Ask user to paste token ONCE for this session:
           "I need your Replicate token to generate [video/audio].
            Paste it and I'll set it for this entire session.
            (It's already on your Mac mini if you want to run via Claude Code instead.)"
           └─ Then: export REPLICATE_API_TOKEN=<pasted_value>
              └─ Then: proceed with Replicate
```

---

## PROVIDER 1: Cloudflare Workers AI

### Setup (Already Done)
Your Cloudflare account is connected via MCP:
- Account: `your-email@example.com`
- Account ID: `your-cloudflare-account-id`

The MCP connector handles all authentication. No API key needed.

### Before First Use Each Session
Set the active Cloudflare account:
```
Call: Cloudflare Developer Platform:set_active_account
Param: activeAccountIdParam = "your-cloudflare-account-id"
```

### Available Image Models

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| `@cf/black-forest-labs/flux-2-klein-4b` | Fastest | Good | Quick drafts, thumbnails |
| `@cf/black-forest-labs/flux-2-klein-9b` | Fast | Great | Social media, blog images |
| `@cf/black-forest-labs/flux-2-dev` | Slower | Best | Hero images, marketing materials |

### How to Generate Images via Cloudflare

**Method A: Deploy a Worker (best for repeated use)**

Deploy this Worker to your Cloudflare account once. Then call it via HTTP from anywhere — Claude.ai, Mac mini, n8n, or any agent.

```javascript
// Worker: ai-image-gen
export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const { prompt, width, height, model, steps } = await request.json();

      const selectedModel = model || "@cf/black-forest-labs/flux-2-klein-9b";
      const form = new FormData();
      form.append("prompt", prompt);
      form.append("width", String(width || 1024));
      form.append("height", String(height || 1024));
      if (steps) form.append("steps", String(steps));

      const formResponse = new Response(form);
      const resp = await env.AI.run(selectedModel, {
        multipart: {
          body: formResponse.body,
          contentType: formResponse.headers.get("content-type"),
        },
      });

      return new Response(resp, {
        headers: { "Content-Type": "image/png" },
      });
    }

    return new Response("POST { prompt, width?, height?, model? }", { status: 200 });
  },
};
```

**Wrangler config (wrangler.toml):**
```toml
name = "ai-image-gen"
main = "src/index.js"
compatibility_date = "2024-09-25"

[ai]
binding = "AI"
```

**Method B: Direct REST API call (from Mac mini or scripts)**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/your-cloudflare-account-id/ai/run/@cf/black-forest-labs/flux-2-klein-9b" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  --form "prompt=a photorealistic sunset over a lake" \
  --form "width=1024" \
  --form "height=1024" \
  --output image.png
```

**Method C: From Claude.ai sandbox (Python, uses MCP auth indirectly)**
If the Worker is deployed, Claude can call it via HTTP:
```python
import requests
resp = requests.post("https://ai-image-gen.<your-subdomain>.workers.dev", json={
    "prompt": "a photorealistic sunset over a lake",
    "width": 1024,
    "height": 1024
})
with open("/mnt/user-data/outputs/image.png", "wb") as f:
    f.write(resp.content)
```

---

## PROVIDER 2: Replicate

### Token Location
- **Mac mini**: Already set as `$REPLICATE_API_TOKEN` in shell environment
- **Claude.ai sandbox**: Must be pasted by user at session start (does not persist between chats)
- **Claude Code**: Reads from Mac mini environment automatically

### Quick Token Check
```python
import os
token = os.environ.get("REPLICATE_API_TOKEN")
if not token:
    # IN CLAUDE.AI: Ask user to paste token
    # ON MAC MINI: Token should already be there — check ~/.zshrc
    pass
```

### Setting Token in Claude.ai Session
When user provides their token:
```bash
export REPLICATE_API_TOKEN="r8_xxxxxxxxxxxxx"
pip install replicate --break-system-packages 2>/dev/null
```
This persists for the entire conversation session.

### Core Replicate Patterns

```python
import replicate

# Run any model
output = replicate.run("owner/model-name", input={...})

# Search for models
import requests, os
headers = {"Authorization": f"Bearer {os.environ['REPLICATE_API_TOKEN']}"}
response = requests.get("https://api.replicate.com/v1/search",
    params={"query": "text to video cinematic"}, headers=headers)

# Get model input schema
response = requests.get(f"https://api.replicate.com/v1/models/{model_name}",
    headers=headers)
schema = response.json()["latest_version"]["openapi_schema"]["components"]["schemas"]["Input"]["properties"]
```

### Recommended Models by Task

**Text-to-Video:**
- `wan-video/wan-2.5-t2v-fast` — Best balance of speed/quality
- `google/veo-3-fast` — High quality + native audio
- `kling-video/kling-video-3.0` — Cinematic, multi-shot

**Text-to-Image (when Cloudflare unavailable):**
- `black-forest-labs/flux-schnell` — Fast drafts
- `black-forest-labs/flux-1.1-pro` — Production quality
- `ideogram-ai/ideogram-v3` — Best text rendering in images

**Image-to-Video:**
- `wan-video/wan-2.5-i2v-fast` — Animate any still image

**Text-to-Speech:**
- `minimax/speech-02-hd` — High fidelity, multilingual
- `nari-labs/dia-1.6b` — Dialogue with emotion

**Lipsync:**
- `sync/lipsync-2-pro` — Top tier
- `bytedance/omni-human` — Full digital human

**Upscaling:**
- `topazlabs/image-upscale` — Professional
- `topazlabs/video-upscale` — Video enhancement

### Output Handling
```python
import shutil

output = replicate.run(model, input=params)
if isinstance(output, list):
    data = output[0].read()
    ext = ".png"
else:
    data = output.read()
    ext = ".mp4"

with open(f"/home/claude/output{ext}", "wb") as f:
    f.write(data)
shutil.copy(f"/home/claude/output{ext}", f"/mnt/user-data/outputs/output{ext}")
```

---

## PROVIDER 3: Apify Actors

### When to Use
- Batch social media content packs (images + captions + hashtags)
- Content pipelines that need research + generation in one flow
- When the task is "create a full social post" not just "generate an image"

### Available Actors
Search via MCP: `apify:search-actors` with relevant keywords.
Example: `solutionssmart/telegram-content-pack-factory` generates AI images + captions for TikTok, Instagram, YouTube Shorts.

---

## Content Pipeline Integration

This skill chains with other skills:

```
[tavily-web-search] → research topic / trending data
         ↓
[content-research-writer] → draft article/post/script
         ↓
[ai-media-gen] → generate hero image (Cloudflare) + video (Replicate)
         ↓
[google-workspace / notion / wordpress] → publish
```

### Style Presets

**Your Business:**
- Professional photography, warm lighting, local landscapes
- Clean, trustworthy palette matching your brand
- NEVER: cartoonish, AI-looking, stock photo clichés

**StanleyAI:**
- Clean tech aesthetic, dark mode friendly
- Abstract code visualizations, neural networks
- Purple/teal/dark palette
- NEVER: generic robot images, cheesy AI brain graphics

**Social Media (general):**
- Bold colors, high contrast, text-overlay friendly
- Leave negative space for text overlays
- Match platform aspect ratios: 1:1 Instagram, 16:9 Twitter, 9:16 TikTok/Reels

---

## Prompt Engineering

### Image Prompts
```
[Subject] + [Style] + [Lighting] + [Composition] + [Mood] + [Technical]
```
Example: "A lakehouse at golden hour, warm editorial photography, shallow depth of field, centered composition, peaceful mood, 4K, photorealistic"

### Video Prompts
- Camera movements: "slow dolly zoom", "overhead crane shot", "tracking shot"
- Lighting: "cinematic lighting", "golden hour", "studio lighting"
- Motion: "walking slowly", "particles floating", "camera pans left"
- Keep to 1-3 sentences, descriptive but focused

### For Text in Images
Always use Ideogram models (`ideogram-ai/ideogram-v3`) — they handle text rendering far better than FLUX or other diffusion models.

---

## Error Handling

```python
# Replicate errors
try:
    output = replicate.run(model, input=params)
except Exception as e:
    if "401" in str(e):
        print("Token missing or expired — ask user to paste token")
    elif "not found" in str(e).lower():
        print("Model not found — search for alternatives")
    else:
        print(f"Error: {e} — try backup model")
```

Common issues:
- **401**: Token not set → ask user to paste it
- **Model not found**: Check spelling, use search API
- **Timeout**: Video models take 1-5 min; `replicate.run()` waits automatically
- **Cloudflare 403**: Account not set → call `set_active_account` first

---

## Mac Mini Execution (via Claude Code)

For heavy media generation, prefer Mac mini execution:
```bash
# All tokens already in environment
# Just run the script
cd ~/stanley-ai
python3 scripts/generate_media.py --prompt "..." --model "wan-video/wan-2.5-t2v-fast"
```

The Mac mini has: REPLICATE_API_TOKEN, CLOUDFLARE_API_TOKEN, ffmpeg, Python, and all dependencies permanently installed.
