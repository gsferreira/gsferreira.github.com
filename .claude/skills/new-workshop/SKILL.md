---
name: new-workshop
description: Create a new workshop page with curriculum, FAQs, and instructor information.
argument-hint: "[workshop title]"
disable-model-invocation: true
---

# New Workshop

Create a new workshop page for guiferreira.me.

## Instructions

1. Ask the user for the following information (if not provided via $ARGUMENTS):
   - **Title**: The workshop title
   - **Description**: Brief workshop description
   - **Category**: Workshop category (e.g., Testing, Architecture)
   - **Format**: Workshop format (e.g., "Half-Day Workshop", "Full-Day Workshop")
   - **Duration**: Length (e.g., "4 hours", "8 hours")
   - **Participants**: Recommended group size (e.g., "12-25 people")
   - **Level**: Beginner, Intermediate, or Advanced
   - **Key achievements**: What participants will gain (3-5 items)
   - **Prerequisites**: Who should attend (3-5 items)
   - **Key takeaways**: Main learning outcomes (4-6 items)

2. Generate a URL-friendly slug from the title.

3. Create the workshop file at:
   ```
   src/workshops/[slug].md
   ```

4. Use this front matter template:
   ```markdown
   ---
   layout: workshop.njk
   title: [Title]
   description: "[Description]"
   image: /assets/workshops/presenting-01.jpeg
   category: [Category]
   format: [Format]
   duration: [Duration]
   participants: [Participants]
   level: [Level]
   achievements:
     - [Achievement 1]
     - [Achievement 2]
     - [Achievement 3]
   prerequisites:
     - [Prerequisite 1]
     - [Prerequisite 2]
     - [Prerequisite 3]
   instructor:
     name: Gui Ferreira
     title: Software Developer Educator
     image: /assets/headshot.avif
   keyTakeaways:
     - [Takeaway 1]
     - [Takeaway 2]
     - [Takeaway 3]
     - [Takeaway 4]

   curriculum:
     description: [Curriculum description]
     modules:
       - title: "[Module Title]"
         duration: [Duration]
         description: [Module description]
         topics:
           - [Topic 1]
           - [Topic 2]
           - [Topic 3]

   faqs:
     - question: [Question 1]
       answer: [Answer 1]
     - question: [Question 2]
       answer: [Answer 2]
   ---
   ```

5. Create the workshop content body with:
   - Opening hook (italicized pain point quote)
   - Problem description (2-3 paragraphs)
   - "**This workshop will change that.**" transition
   - "**By the end of this Workshop you will have:**" bullet list
   - "**Is this Workshop for you?**" section
   - "**What will you need?**" section

6. After creating the file, remind the user to:
   - Add a custom workshop image if desired (or use the default)
   - Review and customize the FAQs
   - Add additional curriculum modules if needed
