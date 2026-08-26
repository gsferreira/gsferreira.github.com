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
   - **Black Lab Studios URL**: the matching page at blacklabstudios.com/workshops/, where private and team bookings go
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
   blsUrl: https://blacklabstudios.com/workshops/[bls-slug]/
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
     title: Microsoft MVP and Software Engineer Educator
     image: /assets/headshot.avif
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
   upcomingSessions: []
   ---
   ```

   `upcomingSessions` is the public calendar. Leave it empty until a date is
   booked, then add one entry per session. `date` must stay in the
   `"September 14-15, 2026"` shape, because the `sessionStart` and `sessionEnd`
   filters parse it into the Event markup:

   ```yaml
   upcomingSessions:
     - date: "September 14-15, 2026"
       location: "Oslo, Norway"
       venue: "NDC Oslo"
       spotsLeft: "Seats available"
       available: true
       registrationUrl: "https://ndcoslo.com/agenda/..."
   ```

   `registrationUrl` points at the conference, never at Black Lab Studios. The
   conference sells the public seat. Black Lab Studios sells the private booking,
   which is what `blsUrl` is for.

5. Before writing any copy, read
   `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/VOICE.md`.
   The "Sales and landing copy" section applies here. No em dashes, British-leaning
   spelling, contractions in prose, and no anonymous testimonials.

6. Create the workshop content body with:
   - An opening that drops the reader into the situation, not an abstraction
   - What gets built or covered, in concrete terms
   - A "what this isn't" section naming what the workshop does not do
   - "**Is this for you?**"
   - A close on something the reader can act on, not on pressure to book

7. Check the copy against the matching Black Lab Studios page before finishing.
   Both sites carry these workshops on purpose: this one sells a seat to a person,
   blacklabstudios.com sells an engagement to a company. Same facts are fine.
   Shared sentences are not, and will cost both pages in search.

8. After creating the file, remind the user to:
   - Add a custom workshop image if desired (or use the default)
   - Review and customize the FAQs
   - Add additional curriculum modules if needed
