---
name: update-talks
description: Add a new speaking engagement or presentation to the talks data file.
argument-hint: "[talk title or --new]"
disable-model-invocation: true
---

# Update Talks

Add a new speaking engagement to the talks data file.

## Instructions

1. Read the current talks from `src/_data/talks.js` to understand existing entries.

2. Ask the user what they want to do:
   - **Add a new talk**: Create a completely new talk entry
   - **Add a presentation**: Add a new presentation to an existing talk

### Adding a New Talk

Ask for:
- **Title**: The talk title
- **Description**: Multi-paragraph description of the talk (can be multi-line)
- **First presentation details** (see below)

### Adding a Presentation to Existing Talk

1. List existing talks for the user to choose from
2. Ask for presentation details:
   - **Event name**: Conference/meetup name (e.g., "NDC Porto 2025")
   - **Event URL**: Link to the event website
   - **Date**: Presentation date (YYYY-MM-DD format)
   - **Recording URL** (optional): YouTube or other video link

3. Update `src/_data/talks.js` by adding the new entry.

### Talk Entry Format

```javascript
{
  title: "Talk Title",
  description: `Multi-line description here.

Second paragraph with more details.`,
  presentations: [
    {
      name: "Event Name 2025",
      url: "https://event-url.com/",
      date: new Date("2025-MM-DD"),
      recording: "https://youtu.be/VIDEO_ID",  // optional
    },
  ],
},
```

### Presentation Entry Format

```javascript
{
  name: "Event Name 2025",
  url: "https://event-url.com/",
  date: new Date("2025-MM-DD"),
  recording: "https://youtu.be/VIDEO_ID",  // optional
},
```

4. After updating, show the user the changes made.

## Existing Talks Reference

The current talks in the system are:
- "Imagine If We Made It Simple"
- "How to fall in love with TDD"
- "Apache Kafka in 1 hour for C# Developers"
- "The Grand Unified Theory of Clean Architecture and Test Pyramid"
- "Embracing Simplicity"

Run the skill to see the full up-to-date list.
