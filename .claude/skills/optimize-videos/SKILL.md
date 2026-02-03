---
name: optimize-videos
description: Optimize videos for web playback, generating MP4 and WebM versions with poster images for course hero videos.
argument-hint: "[video path]"
disable-model-invocation: true
allowed-tools: Bash(node *), Bash(ffmpeg *), Bash(ffprobe *)
---

# Optimize Videos

Optimize videos for web playback by generating MP4 and WebM versions with poster images in multiple formats.

## Usage

```bash
node .claude/skills/optimize-videos/scripts/optimize-videos.js <video-path>
```

## What It Does

For each input video:
1. **MP4 version** - H.264 codec, broad browser compatibility
2. **WebM version** - VP9 codec, better compression for modern browsers
3. **Poster images** in three formats:
   - AVIF (best compression)
   - WebP (good compression, wide support)
   - PNG (fallback)

## Output Location

- Videos: `src/assets/courses/videos/`
- Posters: `src/assets/courses/videos/`

## Example

```bash
# Optimize a course preview video
node .claude/skills/optimize-videos/scripts/optimize-videos.js src/assets/raw-videos/my-course-preview.mov
```

## Generated Files

For an input `my-course.mov`:
```
src/assets/courses/videos/my-course.mp4           # Optimized MP4
src/assets/courses/videos/my-course.webm          # Optimized WebM
src/assets/courses/videos/my-course-poster.avif   # Poster AVIF
src/assets/courses/videos/my-course-poster.webp   # Poster WebP
src/assets/courses/videos/my-course-poster.png    # Poster PNG
```

## Frontmatter Output

The script outputs YAML frontmatter ready to paste into your course file:

```yaml
heroVideo:
  mp4: "/assets/courses/videos/my-course.mp4"
  webm: "/assets/courses/videos/my-course.webm"
  poster:
    avif: "/assets/courses/videos/my-course-poster.avif"
    webp: "/assets/courses/videos/my-course-poster.webp"
    png: "/assets/courses/videos/my-course-poster.png"
  duration: "PT0M36S"
  title: "Course Preview"
  description: "See what you'll learn"
  autoplay: false
```

## Requirements

- **FFmpeg** - Install from https://ffmpeg.org/download.html
  - macOS: `brew install ffmpeg`
  - Ubuntu: `apt install ffmpeg`
- **Node.js**
- **Sharp** (already installed)

## Video Settings

| Format | Codec | Quality (CRF) | Max Resolution |
|--------|-------|---------------|----------------|
| MP4    | H.264 | 23            | 1920x1080      |
| WebM   | VP9   | 30            | 1920x1080      |

## Poster Settings

- Extracted at 3 seconds into the video
- Quality: 85 (WebP), 75 (AVIF)
- Max resolution: 1920x1080
