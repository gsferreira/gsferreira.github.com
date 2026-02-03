---
name: optimize-images
description: Generate optimized WebP and AVIF versions of images with responsive sizes for the website.
argument-hint: "[image path]"
disable-model-invocation: true
allowed-tools: Bash(node *)
---

# Optimize Images

Generate WebP and AVIF versions of images with responsive sizes (480px, 768px, 1024px, 1440px) for optimal web performance.

## Usage

Run the optimization script on an image file:

```bash
node .claude/skills/optimize-images/scripts/optimize-images.js <image-path>
```

## What It Does

For each input image, generates:
- **WebP version** (original size) - Good browser support, great compression
- **AVIF version** (original size) - Best compression, modern browsers
- **Responsive sizes** in both formats:
  - 480w (mobile)
  - 768w (tablet)
  - 1024w (desktop)
  - 1440w (large screens)

## Output Location

Optimized images are saved to `src/assets/` alongside the original.

## Example

```bash
# Optimize headshot image
node .claude/skills/optimize-images/scripts/optimize-images.js src/assets/headshot.png

# Optimize a course thumbnail
node .claude/skills/optimize-images/scripts/optimize-images.js src/assets/courses/my-course.png
```

## Generated Files

For an input `headshot.png`:
```
headshot.webp          # Original size WebP
headshot.avif          # Original size AVIF
headshot-480w.webp     # Mobile WebP
headshot-480w.avif     # Mobile AVIF
headshot-768w.webp     # Tablet WebP
headshot-768w.avif     # Tablet AVIF
headshot-1024w.webp    # Desktop WebP
headshot-1024w.avif    # Desktop AVIF
headshot-1440w.webp    # Large WebP
headshot-1440w.avif    # Large AVIF
```

## Requirements

- Node.js
- Sharp (already installed as a dev dependency)

## Quality Settings

- **WebP**: 85 quality, effort 6
- **AVIF**: 75 quality, effort 9 (slower but better compression)
