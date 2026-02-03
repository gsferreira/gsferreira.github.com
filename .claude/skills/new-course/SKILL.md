---
name: new-course
description: Scaffold a new Dometrain course page with full front matter, FAQ template, and proper structure.
argument-hint: "[course title]"
disable-model-invocation: true
---

# New Course

Create a new course page for guiferreira.me.

## Instructions

1. Ask the user for the following information (if not provided via $ARGUMENTS):
   - **Title**: The course title (e.g., "From Zero to Hero: Testing in C#")
   - **Description**: Brief course description
   - **Duration**: Course length (e.g., "4h 30m")
   - **Category**: Course category (e.g., Testing, Architecture, .NET)
   - **Level**: Beginner, Intermediate, or Advanced
   - **Dometrain URL**: The course URL on Dometrain (for affiliate link)
   - **Course image path**: Path to the course image

2. Generate a URL-friendly slug from the title (e.g., `testable-code-csharp`).

3. Create the course file at:
   ```
   src/courses/[slug].md
   ```

4. Use this front matter template:
   ```markdown
   ---
   layout: course.njk
   title: "[Title]"
   description: "[Description]"
   duration: "[Duration]"
   category: [Category]
   rating:
   reviewCount:
   level: [Level]
   featured: false
   highlight: false
   image: /assets/courses/[slug].png
   courseUrl: [Dometrain URL]?ref=gui-ferreira&affcode=1115529_k5a22dj8&&promo=website&promotion=website
   callToActionTitle: "[Call to action question]"
   callToActionSubtitle: "[Supporting subtitle]"
   date: YYYY-MM-DD
   relatedCourses:
     - [related-course-slug]
   ---
   ```

5. Create the course content body with these sections:
   - Main value proposition (2-3 paragraphs)
   - "## What you'll learn" - Bullet list of key learnings
   - "## [Problem section]" - Describe the pain point this solves
   - "## This Course is your escape plan" - How the course helps
   - "## What makes this different" - Unique selling points
   - "## Frequently Asked Questions" - Use the `<details>` accordion pattern

6. After creating the file, remind the user to:
   - Add the course image to `/assets/courses/`
   - Optionally add a hero video
   - Update `relatedCourses` with relevant course slugs
   - Set `featured: true` or `highlight: true` if needed

## Existing Courses (for relatedCourses reference)

- testable-code-csharp
- xunit-csharp
- test-driven-development-csharp
- clean-code-csharp
- url-shortener-in-dotnet
- opentelemetry-dotnet
