---
name: yt-context
description: Analyze YouTube videos by fetching transcripts and generating AI-powered structured summaries. Use whenever a YouTube URL is mentioned or when the user wants to understand, summarize, extract insights, get key points, or analyze any YouTube video content. Triggers on any youtube.com or youtu.be link.
---

# yt-context — YouTube Video Intelligence

Fetch, clean, and analyze YouTube video transcripts into structured intelligence reports.

## When to trigger
Any YouTube URL (youtube.com/watch?v= or youtu.be/) in the user's message.

## Step 1: Extract video ID
From URL patterns:
- youtube.com/watch?v=VIDEO_ID
- youtu.be/VIDEO_ID
- youtube.com/shorts/VIDEO_ID

## Step 2: Fetch transcript
Use the youtube-transcript-api or yt-dlp:

```bash
# Install if needed
pip install youtube-transcript-api --break-system-packages

# Fetch transcript
python3 -c "
from youtube_transcript_api import YouTubeTranscriptApi
transcript = YouTubeTranscriptApi.get_transcript('VIDEO_ID')
full_text = ' '.join([t['text'] for t in transcript])
print(full_text)
"
```

Fallback with yt-dlp:
```bash
yt-dlp --write-auto-sub --sub-lang en --skip-download -o /tmp/yt_transcript "VIDEO_URL"
```

## Step 3: Clean the transcript
- Remove [Music], [Applause], [Laughter] tags
- Fix broken sentences split across lines
- Reconstruct into readable paragraphs

## Step 4: Generate structured report

Always output in this exact format:

---
**VIDEO INTELLIGENCE REPORT**
**URL:** [url]
**Duration:** [if available]

**ONE-LINE SUMMARY**
[Single sentence capturing the entire video]

**KEY INSIGHTS** (5-7 bullets)
- 
- 

**HOOK ANALYSIS**
[What did the first 30 seconds do? How did they grab attention?]

**MAIN ARGUMENT / THESIS**
[The core point the video is making]

**QUOTABLE MOMENTS**
[2-3 direct quotes worth saving]

**ACTION ITEMS**
[What can someone DO with this information?]

**CONTENT GRADE**
Depth: ⭐⭐⭐⭐⭐ | Originality: ⭐⭐⭐⭐⭐ | Actionability: ⭐⭐⭐⭐⭐
---

## Multiple videos
If multiple URLs are provided, run analysis on each and then add:

**CROSS-VIDEO PATTERNS**
[What themes, arguments, or strategies appear across all videos?]

## Error handling
If transcript unavailable:
1. Try auto-generated captions
2. If still unavailable, fetch video page metadata and description
3. Report what IS available and analyze that

## Notes
- Transcripts from the claude.ai web app may require yt-dlp installed locally
- For Claude Code: youtube-transcript-api works directly
- Always clean timestamps and formatting artifacts before analysis
