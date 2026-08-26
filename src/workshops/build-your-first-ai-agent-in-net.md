---
layout: workshop.njk
date: 2026-06-12
title: Build Your First AI Agent in .NET
description: "You write the agent yourself in C#, starting from a raw HTTP call and finishing with something other programs can call. Two days, and an honest answer about when an agent is the wrong tool."
image: /assets/workshops/presenting-02.jpg
category: AI & .NET
format: 2-Day Intensive
duration: 2 days
participants: 15-40 people
level: Intermediate
blsUrl: https://blacklabstudios.com/workshops/build-your-first-ai-agent-in-dotnet/
achievements:
  - An agent you built yourself, running against a .NET backend, on your machine
  - Tool calling, memory and the agent loop written by hand before any framework hides them
  - The hardening work most demos skip, plus your agent exposed over MCP
  - A straight answer to when an agent earns its cost and when a function call does the same job
prerequisites:
  - You build APIs in C# and are comfortable in the language
  - You have met prompts and completions before, at least in passing
  - Install the .NET 10 SDK and Git before you arrive
  - Create a GitHub account and an Azure account. Expect 5 to 10 euros of Azure usage.
instructor:
  name: Gui Ferreira
  title: Software Engineer Educator | Microsoft MVP
  image: /assets/headshot.avif
curriculum:
  description: "You build one thing across the two days: a personal finance assistant that reads natural language, pulls real transaction data, remembers what you told it earlier, and gives you an answer you can check. We use Azure AI services, and the code moves to OpenAI, Anthropic or Google by changing a line."
  modules:
    - title: "Talking to the model directly"
      duration: Day 1
      description: "We start at the metal, with a raw HTTP call and no library in the way. Then we refactor behind an abstraction you keep using for the rest of the two days."
      topics:
        - "What the model is actually doing when it answers you"
        - "Prompting, treated as an engineering problem rather than a folk art"
        - "One raw API call, no SDK, so you see the shape of the thing"
        - "Moving to IChatClient, and what that buys you the day the provider changes"
    - title: "Tool calling"
      duration: Day 1
      description: "Up to here it can only talk. Now it starts doing things, and you find out that a tool the model quietly ignores is worse than no tool at all."
      topics:
        - "Structured output, and getting a shape back you can deserialise"
        - "Declaring the tools it is allowed to reach for"
        - "Describing a tool well enough that the model picks the right one"
        - "Pulling real transaction data, and failing safely when the call does not work"
    - title: "The agent loop"
      duration: Day 1
      description: "Feed the tool result back in and let it decide what happens next. Then put a ceiling on it, before it decides to do that four hundred times."
      topics:
        - "What the model is actually deciding at each pass"
        - "Multi-step runs across several tools"
        - "Capping the loop, and what an uncapped one costs you by Friday"
    - title: "Memory and the context window"
      duration: Day 2
      description: "Every turn starts from nothing unless you carry the history yourself. Carrying it naively walks into the context window at full speed."
      topics:
        - "Why an agent forgets between turns"
        - "Keeping conversation history that stays useful"
        - "Summarising history once it outgrows the window"
    - title: "Making it safe to ship"
      duration: Day 2
      description: "The part the demos skip. Make it safe enough to put in front of someone who is not you."
      topics:
        - "How agents fail, and how you find out before your users do"
        - "What prompt injection looks like when it lands on your agent"
        - "Asking before it does something destructive"
        - "Retries, fallbacks, and enough logging to reconstruct a bad run"
    - title: "Putting it behind a protocol"
      duration: Day 2
      description: "Right now it only runs where you run it. Give it an interface another program can call, then see what a framework would have done for you."
      topics:
        - "What MCP is and what it solves"
        - "Putting an MCP server in front of what you built"
        - "Where the Microsoft Agent Framework picks up"
        - "When a second agent helps, and when it is one agent too many"
faqs:
  - question: Do I need to have built anything with AI before?
    answer: No. If you can write a C# API and you have seen a prompt and a completion, that is the bar. We start with a raw HTTP call and build up from there, so nothing is assumed.
  - question: Is this locked to Azure?
    answer: We use Azure AI services during the two days because something has to be running. The abstraction goes in on day one, and switching to OpenAI, Anthropic or Google is a one-line change. Nothing you learn is tied to a vendor.
  - question: Will you tell me agents are the answer to everything?
    answer: No, and a good chunk of day two is spent on the opposite. Plenty of problems people reach for an agent on are a function call with extra latency and a bill attached. You will leave able to tell those apart.
  - question: What does the Azure account cost me?
    answer: Budget 5 to 10 euros of usage across the two days. Set the account up before you arrive, because doing it in the room costs everyone the first hour.
  - question: Will frameworks make this obsolete in six months?
    answer: The frameworks will change, and the reason we build the loop by hand first is so that you can read one when it does. Once you have written tool calling and memory yourself, any framework is just someone else's version of code you already understand.
upcomingSessions:
  - date: "September 14-15, 2026"
    location: "Oslo, Norway"
    venue: "NDC Oslo"
    spotsLeft: "Seats available"
    available: true
    registrationUrl: "https://ndcoslo.com/agenda/build-your-first-ai-agent-in-net/3c1768c8344e"
  - date: "November 17-18, 2026"
    location: "Porto, Portugal"
    venue: "NDC Porto"
    spotsLeft: "Seats available"
    available: true
    registrationUrl: "https://ndcporto.com/agenda/build-your-first-ai-agent-in-net/81f59dbbf411"
  - date: "January 25-26, 2027"
    location: "London, United Kingdom"
    venue: "NDC London"
    spotsLeft: "Seats available"
    available: true
    registrationUrl: "https://ndclondon.com/workshops/build-your-first-ai-agent-in-net"
---

Somebody at your company has already shipped an agent. It books meetings, or it triages support tickets, or it reads invoices and decides something about them. You've seen the demo. What you haven't seen is the code, and you have a suspicion that the demo and the code are quite far apart.

They usually are. A chat box wired to an API is a weekend. An agent that reasons about real data, calls tools without going off the rails, remembers what you told it ten minutes ago and doesn't leak your database to a prompt injection is a different piece of engineering.

**What you build**

One thing, across two days: a personal finance assistant. It reads a question in plain language, pulls actual transaction data, holds the thread of a conversation, and tells you something useful about your money.

We start with a raw HTTP call to a model. No SDK, no framework, nothing hiding the mechanics. Then we refactor behind a clean abstraction and keep building on it, so that by the end you can look at any agent library and recognise what it's doing, because you already wrote it once by hand.

Day one is the machinery: the model, tool calling, the loop. Day two is everything that stands between a working prototype and something you'd let a colleague use. Memory that doesn't blow the context window. Prompt injection. Asking before it deletes anything. Knowing what it did after the fact.

**What this isn't**

Not a tour of frameworks. Not a slide deck about what agents might mean for your industry. And not a two-day argument that agents are the answer, because they often aren't. A decent slice of day two is about telling the difference between a problem that needs an agent and a problem that needs a function call, which is a cheaper and more reliable thing to own.

**Is this for you?**

If you build APIs in C# and you'd rather learn by writing code than by watching someone else's, yes. You don't need any AI background beyond having heard of prompts and completions.

**Before you come**

Set up the Azure account at home. Every workshop where people do it in the room loses the first hour, and the first hour is the one where we write the raw call that everything else is built on.
