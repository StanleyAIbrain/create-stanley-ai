---
name: youtube-transcript
description: Fetch transcripts from YouTube videos and prepare summaries. Use whenever a YouTube URL is mentioned or when the user wants to understand, summarize, or extract content from any video.
---

# YouTube Transcript Skill

Fetch the transcript of any YouTube video and turn it into useful content.

## How to use
When the user provides a YouTube URL or video ID, fetch the transcript using the video ID.

## YouTube transcript URL format
https://www.youtube.com/api/timedtext?lang=en&v={VIDEO_ID}

Or via yt-dlp if available:
```bash
yt-dlp --write-auto-sub --sub-lang en --skip-download -o transcript '{URL}'
```

## Steps
1. Extract the video ID from the URL
2. Fetch the transcript (auto-generated captions)
3. Clean up timestamps and formatting
4. Summarize or process as requested

## Output formats
- Full transcript (clean text)
- Summary (key points)
- Timestamped outline
- Action items extracted
