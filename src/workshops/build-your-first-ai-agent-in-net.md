---
layout: workshop.njk
date: 2026-06-12
title: Build Your First AI Agent in .NET
description: "Companies are now deploying agents that book meetings, process invoices, answer support tickets, and make decisions. So it's time to learn how to build these systems."
image: /assets/workshops/presenting-02.jpg
category: AI & .NET
format: 2-Day Intensive
duration: 2 days
participants: 15-40 people
level: Intermediate
achievements:
  - A working AI agent integrated into a .NET backend
  - Practical experience with tool use, memory, and the agent loop
  - Hands-on experience hardening an agent for production and exposing it over MCP
  - A clear mental model for when agents add value versus simpler AI approaches
  - Confidence to apply these patterns in your own applications
prerequisites:
  - Your favourite IDE
  - .NET 10 SDK
  - Git and a GitHub account
  - An Azure account (expect around 5–10 € of usage)
instructor:
  name: Gui Ferreira
  title: Microsoft MVP & .NET Educator
  image: /assets/headshot.avif
keyTakeaways:
  - Working with Large Language Models, prompt engineering, and raw API calls
  - Calling AI services from C# through a clean abstraction
  - Tool calling so agents can take actions and retrieve external data
  - The agent loop, how agents reason, plan, and iterate
  - Memory and context management across conversations
  - Trust, safety, and production hardening
  - Shipping your agent as an MCP server
curriculum:
  description: "You'll create a personal finance assistant. An agent that understands natural language, retrieves transaction data, maintains memory across conversations, and helps users make better financial decisions. We'll use Azure AI services throughout, but the patterns and code apply to other providers like OpenAI, Anthropic, and Google."
  modules:
    - title: "Working with Large Language Models"
      duration: "Day 1"
      description: "Start at the metal. Talk to an LLM over raw HTTP, then refactor behind a clean abstraction you'll build on all workshop."
      topics:
        - "LLM fundamentals and how models actually respond"
        - "Prompt engineering basics"
        - "Raw API calls with no abstractions"
        - "Refactoring to IChatClient, and swapping providers with one line"
    - title: "Tool calling"
      duration: "Day 1"
      description: "Give the agent hands. Let it take actions and pull in external data, and learn what makes a tool the model can actually use."
      topics:
        - "Structured outputs"
        - "Defining tools the agent can call"
        - "Writing tool descriptions the model understands"
        - "Retrieving transaction data, and handling tool failures safely"
    - title: "The agent loop"
      duration: "Day 1"
      description: "Close the loop. Watch the agent reason, call tools, and iterate toward an answer, and keep it from running away."
      topics:
        - "How agents reason, plan, and iterate"
        - "Multi-step, multi-tool execution"
        - "Iteration caps and guarding against runaway loops"
    - title: "Memory and context management"
      duration: "Day 2"
      description: "Stop the agent forgetting. Carry context across turns, and keep it from blowing the context window."
      topics:
        - "Why agents forget between turns"
        - "Maintaining conversation history"
        - "Summarising history as it grows"
    - title: "Trust, safety, and production"
      duration: "Day 2"
      description: "Make it safe to ship. Confirm risky actions, defend against attacks, and see what your agent is doing."
      topics:
        - "Why agents fail, and how to spot it"
        - "Defending against prompt injection"
        - "Confirming destructive actions before they run"
        - "Retries, fallbacks, and observability"
    - title: "Shipping your agent"
      duration: "Day 2"
      description: "Get it out of the console. Expose the agent over MCP, then see where frameworks take it next."
      topics:
        - "MCP fundamentals"
        - "Exposing your agent as an MCP server"
        - "Graduating to the Microsoft Agent Framework"
        - "When to reach for multiple agents"
upcomingSessions:
  - date: "September 14-15, 2026"
    location: "Oslo, Norway"
    venue: "NDC Oslo"
    spotsLeft: "Available"
    available: true
    registrationUrl: "https://ndcoslo.com/agenda/build-your-first-ai-agent-in-net/3c1768c8344e"
  - date: "November 17-18, 2026"
    location: "Porto, Portugal"
    venue: "NDC Porto"
    spotsLeft: "Available"
    available: true
    registrationUrl: "https://ndcporto.com/agenda/build-your-first-ai-agent-in-net/81f59dbbf411"
---

Companies are now deploying agents that book meetings, process invoices, answer support tickets, and make decisions. So it's time to learn how to build these systems.

In this hands-on workshop, you'll build AI agents that can reason about data, use tools, and hold meaningful conversations.

You'll create a personal finance assistant. An agent that understands natural language, retrieves transaction data, maintains memory across conversations, and helps users make better financial decisions.

**Along the way, we'll cover:**

- **Working with Large Language Models:** LLM fundamentals, prompt engineering basics, and raw API calls before wrapping them in a clean abstraction.
- **Tool calling:** Giving agents the ability to take actions and retrieve external data.
- **The agent loop:** How agents reason, plan, and iterate over multiple steps.
- **Memory and context management:** Maintaining state across conversations, and summarising history as it grows.
- **Trust, safety, and production:** Confirming destructive actions, defending against prompt injection, and adding observability.
- **Shipping your agent:** Exposing it as an MCP server and graduating to the Microsoft Agent Framework.

We'll use Azure AI services throughout the workshop, but the patterns and code apply to other providers like OpenAI, Anthropic, and Google.

**By the end of this workshop, you'll have:**

- A working AI agent integrated into a .NET backend
- Practical experience with tool use, memory, and the agent loop
- Hands-on experience hardening an agent for production and exposing it over MCP
- A clear mental model for when agents add value versus simpler AI approaches
- Confidence to apply these patterns in your own applications

**Is this workshop for you?**

Yes, if you want to move beyond basic AI integration and build something that reasons.

This workshop is for developers who:

- Know how to build APIs with C#
- Have some exposure to AI concepts (prompts, completions, embeddings)
- Prefer learning by doing over slides and theory

**What you'll need**

- Your favourite IDE
- .NET 10 SDK
- Git and a GitHub account
- An Azure account (expect around 5–10 € of usage)

<div class="flex flex-row justify-center mt-10">
<a class="bg-primary hover:bg-secondary font-bold mx-4 py-2 px-4" href="mailto:gui@guiferreira.me">Book This Workshop →</a>
</div>

<div class="mt-5 text-center">
<p><strong>Custom programs available</strong> - Contact us to discuss your needs</p>
</div>