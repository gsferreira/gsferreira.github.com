---
name: seo-review
description: Analyze a blog post for SEO best practices including title length, meta description, headings structure, and keywords. Use when reviewing content before publishing.
argument-hint: "[file path]"
---

# SEO Review

Analyze a blog post for SEO best practices and suggest improvements.

## Instructions

1. If no file path is provided via $ARGUMENTS, ask the user which post to review or list recent posts.

2. Read the specified post file and analyze:

### Title Analysis
- [ ] Length: Should be 50-60 characters (Google truncates at ~60)
- [ ] Contains primary keyword
- [ ] Is compelling and click-worthy
- [ ] Unique and descriptive

### Meta Description Analysis
- [ ] Length: Should be 150-160 characters
- [ ] Contains primary keyword naturally
- [ ] Includes a call-to-action or value proposition
- [ ] Accurately summarizes the content

### Content Structure
- [ ] Has a clear H1 (title) - only one
- [ ] Uses H2 headers for main sections
- [ ] Uses H3 headers for subsections (if needed)
- [ ] Headers contain relevant keywords naturally
- [ ] Logical hierarchy (no skipped heading levels)

### Content Quality
- [ ] First paragraph hooks the reader and mentions the topic
- [ ] Content length is appropriate (aim for 1000+ words for pillar content)
- [ ] Includes relevant internal links to other posts
- [ ] Code examples are properly formatted (if applicable)
- [ ] Has a clear conclusion or TL;DR

### Keyword Usage
- [ ] Primary keyword appears in title
- [ ] Primary keyword appears in first 100 words
- [ ] Keywords used naturally throughout (no stuffing)
- [ ] Related terms and synonyms are used

### Technical SEO
- [ ] URL slug is descriptive and contains keywords
- [ ] Images have descriptive filenames (if any)
- [ ] No broken internal links

3. Provide a summary report with:
   - **Score**: X/10 overall SEO health
   - **Strengths**: What's done well
   - **Improvements needed**: Specific actionable suggestions
   - **Quick wins**: Easy fixes that have high impact

4. Offer to help implement any suggested changes.
