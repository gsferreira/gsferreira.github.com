---
layout: workshop.njk
date: 2024-03-25
title: Mastering Test-Driven Development in C#
description: "Two days of writing C# test-first, on code that talks to databases and queues, until the cycle stops feeling like ceremony and starts making design decisions for you."
image: /assets/workshops/presenting-01.jpeg
category: Testing
format: 2-Day Intensive
duration: 2 days
participants: 12-25 people
level: All levels
blsUrl: https://blacklabstudios.com/workshops/mastering-tdd-in-csharp/
achievements:
  - Red, green, refactor run often enough over two days that it stops feeling like ceremony
  - Tests that make design decisions with you, instead of confirming them afterwards
  - A way to test-drive the code that talks to a database, a queue or somebody else's API
  - An approach to the legacy project that does not begin with asking for a rewrite
  - A clear read on where an AI assistant helps the cycle and where it quietly skips it
prerequisites:
  - You build C# .NET applications day to day
  - You have written unit tests before, even reluctantly
  - Install the .NET 10 SDK, Docker, Git and your usual IDE before you arrive
  - Bring a GitHub account and whichever AI assistant you already use
instructor:
  name: Gui Ferreira
  title: Microsoft MVP and Software Engineer Educator
  image: /assets/headshot.avif
curriculum:
  description: "Two days at the keyboard, most of it pairing and mobbing. Day one is the cycle itself, practised until your hands know it. Day two is everything the katas leave out."
  modules:
    - title: "Day 1: the cycle, until it sticks"
      duration: 8 hours
      description: "Nobody learns this from a diagram. We run the loop over and over on small problems, so that by the afternoon you are reaching for a test without deciding to."
      topics:
        - "Red, green, refactor, run enough times to stop counting"
        - "The 3 rules of TDD, and the 4 rules of simple design underneath them"
        - "Fake it and triangulate, practised in a mob so you can watch other people think"
        - "Refactoring in small safe moves, with the suite green the whole way"
        - "Solitary and sociable tests, and picking the right one on purpose"
        - "Mutation testing, to find out whether your tests would notice a bug"
        - "Breaking a problem into a test list before you write any code"
    - title: "Day 2: the parts katas skip"
      duration: 8 hours
      description: "Real code has a database behind it, a queue next to it and ten years of history under it. This is the day we stop pretending otherwise."
      topics:
        - "Test doubles for external dependencies, and knowing when to stop mocking"
        - "Outside-in TDD and the London school, and what each one costs you"
        - "Getting a legacy class under test with approval testing, no rewrite required"
        - "Where the test pyramid comes from, and why architecture decides its shape"
        - "Taking this back to a team that did not attend, without starting a holy war"
        - "AI assistants in the loop: where they speed the cycle up and where they skip the red"
testimonials:
  - quote: "This workshop completely changed how I write code. The TDD approach has eliminated most bugs from my development process and made refactoring a joy instead of a nightmare."
    author:
    title: Senior Software Engineer
    company:
    image:
  - quote: "Gui's hands-on approach made TDD click for me. Two months later, our team's code quality has improved dramatically and we're shipping features faster than ever."
    author:
    title: Lead Developer
    company:
    image:
  - quote: "I was skeptical about TDD slowing down development, but this workshop proved the opposite. We're now more productive and confident in our releases."
    author:
    title: Engineering Manager
    company:
    image:
faqs:
  - question: I gave TDD a go and it made me slower. Why is this any different?
    answer: Because most teams try it on the hardest thing they own, alone, under a deadline. Two days of deliberate practice with someone correcting your grip is a different experience. You will still be slower for a few weeks afterwards, and it is more honest to say so than to promise otherwise.
  - question: Our codebase has no tests at all. Is that a problem?
    answer: It is the normal case, and day two is built for it. You will practise getting a class under test without permission to rewrite it, which is the situation almost everyone is actually in.
  - question: Do I need to know a particular testing framework already?
    answer: No. Basic familiarity with unit testing is enough. The two days are about the practice, not about xUnit's API, and whatever you already use will be fine.
  - question: Will AI coding assistants make this pointless?
    answer: The opposite, and it is worth being specific about why. An assistant will happily generate a test that passes against code it just wrote, which is the one thing TDD exists to prevent. Knowing the cycle is how you catch it doing that.
  - question: Can this run in one day instead of two?
    answer: It can be cut down, but day two is where the practice meets real dependencies and legacy code, so a one-day version is mostly the katas. Black Lab Studios can scope a shorter format if that is what fits.
---

You've read the book. You've watched the talk. Maybe you tried it for a sprint, and then a release date arrived and you quietly went back to writing the test afterwards.

That isn't a discipline problem, and it isn't a sign you didn't get it. TDD is simple to describe and genuinely hard to do, and almost nobody is ever taught the doing part. You get the three rules on a slide and then you're sent back to a codebase with a repository, a message bus and eleven years of history in it.

Here's the reframe that makes the rest of it work. TDD is not a testing practice. It's a design practice that happens to leave tests behind. Once you see it that way, the arguments about coverage and speed stop being interesting, because that was never what you were buying.

**Two days, mostly at the keyboard**

Day one is the cycle. We run it on small problems, in pairs and mobs, often enough that it stops being a checklist you consult and becomes something your hands do. Watching other people think through a test is most of the value here, and it's the part you can't get from a book.

Day two is everything the katas leave out. Databases. Queues. Somebody else's flaky API. A class written in 2015 by someone who has since left. This is the day where TDD either survives contact with your job or it doesn't, so we spend it there.

**What this isn't**

Not slides you could have read on the train. Not a toy kata that falls apart the moment there's I/O. Not a promise that you'll be shipping faster by Monday, because you won't be, and anyone telling you otherwise is selling something.

**Is this for you?**

If you write C# for a living and you've written some tests before, you have everything you need. Come ready to work with other people. This is two days of pairing and mobbing, so if you were hoping to sit quietly at the back, it will be an uncomfortable couple of days.

**Try this first**

Before you sign up, open the last pull request you wrote and look at when the tests were written relative to the code. If the honest answer is "afterwards, to get the build green", you already know why you're considering this.
