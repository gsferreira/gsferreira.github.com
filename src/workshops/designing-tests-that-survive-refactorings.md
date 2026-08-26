---
layout: workshop.njk
date: 2025-12-17
title: Designing Tests That Survive Refactorings
description: "Half a day, no laptop, working out why your tests go red every time you move code that still works, and how to design the ones that don't."
image: /assets/workshops/presenting-01.jpeg
category: Testing
format: Half-Day Workshop
duration: 4 hours
participants: 12-25 people
level: Intermediate
blsUrl: https://blacklabstudios.com/workshops/designing-tests-that-survive-refactorings/
achievements:
  - A definition of a unit test you can defend in a code review
  - Tests written against behaviour, so moving code stops breaking them
  - The link between the architecture you picked and the test pyramid you ended up with
  - A shortlist of tests you can delete tomorrow without losing any confidence
prerequisites:
  - You have written tests before, in any language
  - Your suite goes red when you refactor, and you want to know why
  - No laptop. Bring a pen.
instructor:
  name: Gui Ferreira
  title: Microsoft MVP and Software Engineer Educator
  image: /assets/headshot.avif
curriculum:
  description: "One session, four hours, run as a conversation. I bring the problems, you bring the codebase you actually work in, and we argue about it in the open."
  modules:
    - title: "Effective testing strategies"
      duration: 4 hours
      description: "We start by disagreeing about what a unit test is, because most teams have never written the definition down. Everything else follows from where that line lands."
      topics:
        - "Where the line sits between a unit test and everything else"
        - "Writing against behaviour when the behaviour is buried in implementation"
        - "Why your architecture decided your test pyramid before you wrote a test"
        - "Reading a suite for which tests carry weight and which carry cost"
        - "Deciding what confidence is worth, and what you will pay to keep it"
faqs:
  - question: Do I need to bring a laptop?
    answer: No. This one runs on discussion and paper. You will spend the four hours arguing about real code with other people in the room, which turns out to teach the point faster than typing does.
  - question: My tests break on every refactor. Is that what this covers?
    answer: That is the whole session. Tests break during a refactor when they are watching how the code is arranged rather than what it does. You will see why that happens, and how to write the other kind.
  - question: We have high coverage and still ship bugs. Does that get addressed?
    answer: Yes, and it is worth saying plainly that coverage was never a measure of confidence. It counts lines the tests walked past. You will leave with something better to steer by.
  - question: Is this only for C# developers?
    answer: No. The examples lean .NET because that is where I work, but nothing in the session depends on the language. Java, TypeScript and Go teams get the same value out of it.
---

You rename a class. Forty tests go red. Not one of them was testing the rename.

Nothing is broken. The behaviour is identical to what it was five minutes ago. But the suite doesn't know that, because it was never watching the behaviour. It was watching the shape of the code.

A suite like that is not a safety net. It's a second copy of your codebase, written in a more awkward language, that you now have to keep in sync by hand. Every refactor costs twice. So you stop refactoring, and the design quietly rots around the tests that were supposed to protect it.

The fix isn't more tests. It's a different kind of test, and an architecture that makes that kind of test possible in the first place. Those two things are the same problem, which is why most advice about testing doesn't land. You can't write a good unit test against a design that won't let you.

**What happens in the room**

Four hours, no computer, no slides to sit behind. I bring the problems and you bring the codebase you actually work in. We define what a unit test is, out loud, until the room agrees. Then we take that definition apart on real examples and see what it costs.

It's a conversation, not a lecture. You will be asked what you think and you will be disagreed with.

**Is this for you?**

If you've written tests before and you're tired of them breaking on work that changed nothing, yes. It helps if you've been through at least one refactor you abandoned because the suite made it too expensive.

If you're looking for framework tips or an introduction to xUnit, this isn't it. Nothing here is about tooling.

**Bring one thing**

Come with a test from your own suite that broke last week for no good reason. We'll work out together why it broke, and what it should have looked like instead.
