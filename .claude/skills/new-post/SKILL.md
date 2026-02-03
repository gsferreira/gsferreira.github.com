---
name: new-post
description: Create a new blog post with correct front matter and folder structure. Use when adding a new article to the blog.
argument-hint: "[title]"
disable-model-invocation: true
---

# New Blog Post

Create a new blog post for guiferreira.me.

## Instructions

1. Ask the user for the following information (if not provided via $ARGUMENTS):
   - **Title**: The post title
   - **Description**: A brief description (for SEO, keep under 160 characters)
   - **Topic/Content**: What the post should be about

2. Generate a URL-friendly slug from the title:
   - Lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Keep it concise but descriptive

3. Create the post file at:
   ```
   src/archive/YYYY/MM/[slug]/index.md
   ```
   Where YYYY is the current year and MM is the current month (zero-padded).

4. Use this front matter template:
   ```markdown
   ---
   layout: post
   tags: post
   date: YYYY-MM-DD
   title: [Title]
   description: [Description]
   ---
   ```

5. If the user provides content or a topic, help draft the post body. Follow the writing style from existing posts:
   - Conversational and direct tone
   - Use section headers with emoji sparingly (like "## Section Title")
   - Include code examples when relevant (C#/.NET focus)
   - End with a TL;DR section for longer posts
   - Use horizontal rules (`---`) to separate major sections

6. After creating the file, inform the user of the file path and suggest next steps:
   - Add a featured image (optional): `featured_image: /images/archive/[slug]/cover.png`
   - Preview with `npm run serve`
