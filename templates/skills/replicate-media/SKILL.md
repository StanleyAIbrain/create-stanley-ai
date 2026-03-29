---
name: replicate-media
description: Generate AI videos, images, audio, music, lipsync, upscaling, and more using the Replicate API with access to 200+ models. Use this skill whenever the user wants to create videos from text or images, generate images, create AI voice/audio, animate photos, upscale media, generate music, do lipsync, remove backgrounds, edit video, or mentions Replicate, Kling, Veo, Wan, Hailuo, Flux, Minimax, Seedream, Imagen, or any AI media generation model. Also triggers on "make me a video", "generate an image", "create a clip", "animate this", "text to video", "image to video", "voice clone", "text to speech", "generate music", "lipsync", "upscale", or any request to produce visual, video, or audio media with AI. This skill can dynamically discover and run ANY model on Replicate — not limited to a preset list. Use aggressively for any media generation request.
---

# Replicate Media Generation Skill

Full access to Replicate's entire model catalog — 200+ models across video, image, audio, music, lipsync, upscaling, editing, and more. The skill dynamically discovers models and reads their input schemas at runtime, so it's never limited to a hardcoded list.

## Prerequisites

- `REPLICATE_API_TOKEN` set as environment variable on Mac mini
- Python 3.9+ with `replicate` package installed

## First-Run Setup

```bash
pip install replicate --break-system-packages
```

---

## Core API Patterns

### 1. Run Any Model

```python
import replicate

# Official models — no version needed
output = replicate.run("owner/model-name", input={...})

# Community models — may need version hash
output = replicate.run("owner/model-name:version_hash", input={...})
```

The SDK reads `REPLICATE_API_TOKEN` from environment automatically.

### 2. Search for Models (Dynamic Discovery)

When you don't know the exact model name, **search first**:

```python
import requests, os

headers = {"Authorization": f"Bearer {os.environ['REPLICATE_API_TOKEN']}"}

# New search API (beta) — searches models, collections, and docs
response = requests.get(
    "https://api.replicate.com/v1/search",
    params={"query": "text to video cinematic"},
    headers=headers
)
results = response.json()

# Models are in results["models"], each has .model and .metadata
for item in results.get("models", []):
    m = item["model"]
    meta = item.get("metadata", {})
    print(f"{m['owner']}/{m['name']} — runs: {m.get('run_count', 'N/A')}")
    print(f"  Tags: {meta.get('tags', [])}")
    print(f"  Desc: {meta.get('generated_description', m.get('description', ''))[:200]}")
    print()
```

### 3. Get a Model's Input Schema (Before Running)

Always check what inputs a model accepts when using an unfamiliar model:

```python
import requests, os

headers = {"Authorization": f"Bearer {os.environ['REPLICATE_API_TOKEN']}"}

response = requests.get(
    "https://api.replicate.com/v1/models/wan-video/wan-2.5-t2v-fast",
    headers=headers
)
model_data = response.json()

schema = model_data["latest_version"]["openapi_schema"]["components"]["schemas"]["Input"]["properties"]
for param, details in schema.items():
    print(f"  {param}: {details.get('type', 'N/A')} — {details.get('description', '')[:100]}")
```

### 4. List All Collections

```python
response = requests.get("https://api.replicate.com/v1/collections", headers=headers)
for col in response.json()["results"]:
    print(f"{col['slug']}: {col['description']}")
```

### 5. Get Models in a Collection

```python
response = requests.get("https://api.replicate.com/v1/collections/text-to-video", headers=headers)
collection = response.json()
for model in collection["models"]:
    print(f"{model['owner']}/{model['name']} — {model.get('description', '')[:100]}")
```

---

## Known Collections (as of March 2026)

| Collection Slug | What It Contains | Model Count |
|----------------|------------------|-------------|
| `text-to-video` | Text prompt → video clip | 73+ |
| `image-to-video` | Animate still images | 30+ |
| `video-editing` | Trim, reframe, stylize, merge | 15+ |
| `text-to-image` | Text prompt → image | 66+ |
| `image-editing` | Edit images with prompts | 20+ |
| `super-resolution` | Upscale images and video | 14+ |
| `text-to-speech` | TTS, voice cloning, emotion | 25+ |
| `lipsync` | Sync lips to audio/text | 13+ |
| `speech-to-text` | Transcription (Whisper etc.) | 13+ |
| `video-to-text` | Caption/describe videos | 12+ |
| `music-generation` | Text → music/songs | 16+ |
| `background-removal` | Remove image backgrounds | 14+ |
| `utilities` | Audio extract, frame extract, merge | 10+ |
| `official` | Replicate's maintained models | 100+ |
| `try-for-free` | No credit card needed | 20+ |
| `wan-video` | All Wan model variants | 10+ |

**To discover NEW collections:** Use the list collections API. New ones are added regularly.

---

## Recommended Defaults by Task

These are starting points. Always search for the latest if the user wants something specific or you're unsure a model still exists.

### Video Generation (Text-to-Video)
- `wan-video/wan-2.5-t2v-fast` — Fast, cheap, great quality
- `wan-video/wan-2.2-t2v-fast` — Fastest option
- `google/veo-3-fast` — High quality + native audio
- `google/veo-3.1` — Best quality + audio
- `kling-video/kling-video-3.0` — Cinematic, lip-sync, multi-shot (up to 6 scenes)
- `minimax/video-01` — Character consistency, reference images
- `pixverse-ai/pixverse-v5.6` — Cost-effective
- `seedance/seedance-1-lite` — Fast with draft mode

### Video Generation (Image-to-Video)
- `wan-video/wan-2.5-i2v-fast` — Fast animation from any image
- `wan-video/wan-2.2-i2v-fast` — Fastest I2V
- `kling-video/kling-video-3.0-omni` — Reference-based, style transfer

### Image Generation
- `black-forest-labs/flux-schnell` — Fast drafts (~$0.003/image)
- `black-forest-labs/flux-1.1-pro` — Production quality
- `black-forest-labs/flux-kontext-pro` — Style control + prompt following
- `google/imagen-4` — Google's best
- `google/nano-banana` — Editing, multi-image fusion
- `ideogram-ai/ideogram-v3` — Text rendering in images
- `ideogram-ai/ideogram-v3-turbo` — Fast creative generation
- `bytedance/seedream-4` — Photorealistic
- `bytedance/seedream-5-lite` — Reasoning + editing
- `recraft-ai/recraft-v3` — Design-focused, art direction

### Text-to-Speech & Voice
- `minimax/speech-02-hd` — High fidelity, emotion, multilingual
- `minimax/speech-02-turbo` — Low latency, real-time
- `minimax/speech-2.8-hd` — Studio-grade, voice cloning
- `nari-labs/dia-1.6b` — Dialogue with non-verbal cues
- `resemble-ai/chatterbox` — Expressive speech
- `playht/text-to-speech` — Production TTS

### Lipsync
- `sync/lipsync-2-pro` — Top-tier audio-driven lipsync
- `bytedance/omni-human` — Full digital human + motion + sync
- `kwaivgi/kling-lip-sync` — Audio or text input
- `pixverse-ai/lipsync` — Quick lipsync

### Music Generation
- Search `music-generation` collection for latest models

### Upscaling & Restoration
- `topazlabs/image-upscale` — Professional image upscaling
- `topazlabs/video-upscale` — Video upscaling
- `szcho/codeformer` — Face restoration
- `tencentarc/gfpgan` — Fast face restoration

### Background Removal
- Search `background-removal` collection

### Video Utilities
- `lucataco/extract-audio` — Pull audio from video
- `lucataco/video-audio-merge` — Merge audio + video
- `lucataco/frame-extractor` — Extract still frames
- `luma/reframe-video` — Reframe/resize for social

### Speech-to-Text
- Whisper models — search `speech-to-text` collection

---

## Workflow Patterns

### Full Talking Head Video
```
Script → TTS (speech-02-hd) → Lipsync (lipsync-2-pro) → Video Upscale (topazlabs)
```

### Social Media Content
```
Text → Image (flux-schnell) → Animate (wan-2.5-i2v-fast) → Reframe (luma/reframe-video)
```

### Podcast/Voiceover
```
Script → TTS (speech-02-hd) → Audio merge with video
```

### Product Demo
```
Product photo → I2V (kling-3.0-omni) → Add narration (speech-02-hd) → Merge
```

### Multi-Scene Ad
```
Kling 3.0 multi-shot mode → 6 connected scenes from single prompt → Add music
```

---

## Output Handling

```python
import shutil

output = replicate.run("model/name", input={...})

# Handle both single FileOutput and list of FileOutputs
if isinstance(output, list):
    data = output[0].read()
    ext = ".png"  # Usually images return lists
else:
    data = output.read()
    ext = ".mp4"  # Usually videos return single

with open(f"/home/claude/output{ext}", "wb") as f:
    f.write(data)

shutil.copy(f"/home/claude/output{ext}", f"/mnt/user-data/outputs/output{ext}")
```

---

## Error Handling

```python
try:
    output = replicate.run(model, input=params)
except replicate.exceptions.ModelError as e:
    print(f"Model failed: {e}")
except replicate.exceptions.ReplicateError as e:
    print(f"API error: {e}")
except Exception as e:
    print(f"Unexpected: {e}")
```

Common issues:
- **401** — Token not set or expired → `echo $REPLICATE_API_TOKEN`
- **Model not found** — Check spelling, use `owner/model` format
- **Timeout** — Video models can take 1-5 min; `replicate.run()` waits automatically
- **Input validation** — Fetch model schema first if unsure of params
- **Rate limits** — Back off and retry

---

## Prompt Tips

### Video
- Camera movements: "slow dolly zoom", "overhead crane shot", "tracking shot"
- Lighting: "cinematic lighting", "golden hour", "studio lighting"
- Motion: "walking slowly", "particles floating", "camera pans left"
- 1-3 sentences, descriptive but focused

### Images
- Style specifics: "photorealistic", "cel-shaded anime", "oil painting"
- Composition: "centered subject", "rule of thirds", "wide angle"
- For text in images → use Ideogram models

### Audio/Speech
- Emotion: "cheerful", "serious", "whispered"
- Pacing: "slow and deliberate", "fast-paced newscast"
- Voice cloning needs clean audio sample

---

## OpenClaw Agent Wrapper

```python
import replicate
import requests
import os

def search_models(query, limit=5):
    """Search Replicate for models matching a query."""
    headers = {"Authorization": f"Bearer {os.environ['REPLICATE_API_TOKEN']}"}
    r = requests.get("https://api.replicate.com/v1/search", params={"query": query}, headers=headers)
    models = r.json().get("models", [])[:limit]
    return [{"name": f"{m['model']['owner']}/{m['model']['name']}", 
             "runs": m['model'].get('run_count', 0),
             "desc": m['model'].get('description', '')[:150]} for m in models]

def get_model_inputs(model_name):
    """Get the input schema for any model."""
    headers = {"Authorization": f"Bearer {os.environ['REPLICATE_API_TOKEN']}"}
    r = requests.get(f"https://api.replicate.com/v1/models/{model_name}", headers=headers)
    schema = r.json().get("latest_version", {}).get("openapi_schema", {})
    return schema.get("components", {}).get("schemas", {}).get("Input", {}).get("properties", {})

def get_collection_models(slug):
    """List all models in a collection."""
    headers = {"Authorization": f"Bearer {os.environ['REPLICATE_API_TOKEN']}"}
    r = requests.get(f"https://api.replicate.com/v1/collections/{slug}", headers=headers)
    return [{"name": f"{m['owner']}/{m['name']}", "desc": m.get('description', '')[:150]} 
            for m in r.json().get("models", [])]

def run_model(model_name, inputs, output_path="./output"):
    """Run any Replicate model. Returns file path or raw output."""
    output = replicate.run(model_name, input=inputs)
    if isinstance(output, list):
        data = output[0].read()
    elif hasattr(output, 'read'):
        data = output.read()
    else:
        return output  # Text/JSON/iterator output
    with open(output_path, "wb") as f:
        f.write(data)
    return output_path

def generate_video(prompt, model="wan-video/wan-2.5-t2v-fast", output_path="./video.mp4"):
    return run_model(model, {"prompt": prompt}, output_path)

def generate_image(prompt, model="black-forest-labs/flux-schnell", output_path="./image.png"):
    return run_model(model, {"prompt": prompt}, output_path)

def animate_image(image_path, prompt="", model="wan-video/wan-2.5-i2v-fast", output_path="./animated.mp4"):
    inputs = {"image": open(image_path, "rb")}
    if prompt:
        inputs["prompt"] = prompt
    return run_model(model, inputs, output_path)

def text_to_speech(text, model="minimax/speech-02-hd", output_path="./speech.mp3"):
    return run_model(model, {"text": text}, output_path)

def lipsync(video_path, audio_path, model="sync/lipsync-2-pro", output_path="./lipsync.mp4"):
    return run_model(model, {"video": open(video_path, "rb"), "audio": open(audio_path, "rb")}, output_path)
```

---

## Decision Flow

When the user asks to generate something:

1. **Identify the task type** (video, image, audio, lipsync, upscale, etc.)
2. **Check if they specified a model** — if yes, use it
3. **If no model specified** — use the recommended default from this skill
4. **If the task is unusual or you're unsure** — search the API: `GET /v1/search?query=...`
5. **If unsure of inputs** — fetch the model schema: `GET /v1/models/{owner}/{name}`
6. **Run the model** — save output → copy to `/mnt/user-data/outputs/` → present to user
7. **If model fails** — check error, try alternative model from same category
