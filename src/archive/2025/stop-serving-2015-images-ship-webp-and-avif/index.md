---
layout: post
tags: post
date: 2025-10-29
title: Stop Serving 2015 Images - Ship WebP & AVIF
description: Learn how switching from JPEG and PNG to modern WebP and AVIF formats can reduce image sizes by 30-50%, improve Core Web Vitals, and deliver faster page loads without sacrificing visual quality.

---

https://youtu.be/Y3R_zU7KNoo?si=KfGcj_sqYo8q8xkn

Did you know images are usually the **biggest chunk of your page weight**? Yet loads of sites still serve plain old JPEGs and PNGs, maybe with some basic compression at best.

We obsess over **CDNs, caching layers, and server tweaks**, but sometimes the biggest wins are hiding in plain sight. In this case, inside your image formats.

I found this out the hard way when I rebuilt my personal site and ran it through Lighthouse. Core Web Vitals screamed at me. My gut reaction? "I need a CDN, better caching, smarter infrastructure…"

But no. The problem was embarrassingly simple: I was still serving JPEGs and PNGs like it was 2015. 🤦‍♂️

---

## Meet the Modern Formats: WebP & AVIF

There are **two formats every developer should know about in 2025**:

* **WebP** → often **~30% smaller than JPEG** at the same visual quality.
* **AVIF** → on smaller assets, reductions can hit **50%+** with no visible loss.

That's **less bandwidth, faster loads, and happier Core Web Vitals**. Users won't notice a visual difference. They'll just feel the speed.

So why isn't everyone doing this already?

---

## The Catch: Browser Support 🕵️

Ah, the old pain: browser compatibility.

* **WebP** is widely supported today.
* **AVIF** is newer; modern browsers handle it, but older clients may miss out.

Most devs stop here and say: "If not everyone supports it, I can't use it."

But here's the trick: **you don't have to choose**.

---

## The Magic of the `<picture>` Element ✨

HTML already solved this. The `<picture>` element lets you provide multiple formats and sizes; the browser simply picks the best one it supports.

**Production-ready example:**

```html
<picture>
  <source
    type="image/avif"
    srcset="/images/hero-640.avif 640w,
 /images/hero-1024.avif 1024w,
 /images/hero-1600.avif 1600w"
    sizes="(max-width: 768px) 90vw, 1200px" />
  <source
    type="image/webp"
    srcset="/images/hero-640.webp 640w,
 /images/hero-1024.webp 1024w,
 /images/hero-1600.webp 1600w"
    sizes="(max-width: 768px) 90vw, 1200px" />
  <img
    src="/images/hero-1600.jpg"
    width="1600" height="900"
    alt="Optimised image example"
    loading="lazy"
    decoding="async" />
</picture>
```

* A modern browser? → **AVIF**.
* Slightly older? → **WebP**.
* Living-in-the-past? → **JPEG**.
* `width`/`height` prevents CLS; `srcset`/`sizes` avoids over-downloading; `loading="lazy"` + `decoding="async"` reduce main-thread pain.

Everyone wins. 🎉

---

## Real Results

When I implemented this on my site:

* **Homepage hero:** 412 KB → **244 KB** (AVIF, 1600w).
* **Average payload down ~40%** across article images.
* **Lighthouse scores improved immediately**.

I didn't touch infrastructure, CDNs, or rendering logic. Just swapped formats and added a better `<picture>` block. Minimalism at its finest.

---

## Tooling & Workflow Support 🛠️

The good news: you don't need to manually convert every image.

* **Build tools** (Vite, Webpack, Rollup, etc.) can emit WebP/AVIF variants automatically.
* **CDNs** (e.g., Cloudflare) can convert on the fly based on `Accept` headers.
* **Image pipelines** can generate multiple widths and formats during your build.

This isn't extra complexity, it's a drop-in optimisation. Keep filenames predictable (e.g., `hero-640.webp`, `hero-1024.avif`) and wire them into `<picture>`.

---

## Gotchas (So You Don't Learn the Hard Way)

* **AVIF decode** can be slower on low-end devices for certain photos. Keep **WebP** as a first-class fallback.
* **Don't upscale.** Generate sensible widths (e.g., 640 / 1024 / 1600) and let `sizes` do the work.
* **Always set intrinsic dimensions** on `<img>` to kill CLS.
* **Don't convert SVGs.** They're already tiny and crisp.

---

## The Big Lesson

We tend to reach for **infrastructure-heavy solutions**: caching, CDNs, scaling, containers. Sometimes that's right. But sometimes the best fix is **simpler than you think**.

For me, the bottleneck wasn't infrastructure. It was outdated image formats. By stepping outside my backend tunnel vision, I cut load times dramatically in minutes.

---

## Action Time ⏱️

Here's your 5-minute checklist:

1. Open a heavy page from your project.
2. Inspect the images being served.
3. If you see **JPEG** or **PNG**, you've got an optimisation waiting.
4. Export **WebP + AVIF** in 2–3 widths each.
5. Swap to the `<picture>` pattern with `srcset`/`sizes`, add `width`/`height`, `loading="lazy"`, `decoding="async"`.

Your users will thank you, and your Core Web Vitals will smile. ✅
