---
layout: post
tags: post
date: 2026-01-13
title: How to Use Cursor Rules to Plan and Execute Tasks
description: Learn how to create Cursor rules and workflows to plan, execute, and track tasks step by step for faster, predictable results.
---

https://youtu.be/U0QVBRBAfDE

Sometimes, interacting with an AI feels like a game of "yes, you're right... until you're not."

I love Cursor, but let's be honest, it can be frustrating when it starts rambling or giving answers that don't make sense. The solution? **Predefined workflows**.

Some Code Assistant don't have a built-in Plan mode. That means without a structured approach, the AI might jump straight into coding without thinking through the steps first.

By creating custom rules and workflows, you can bring that missing planning phase to Cursor.

Let me show you how.

---

## The Problem

You ask Cursor to build something. It starts coding immediately. No plan. No structure.

Then halfway through, it forgets what it was doing. Or worse, it implements something completely different from what you asked.

Sound familiar?

---

## The Solution: Cursor Rules

Cursor rules are files with the `.mdc` extension that define metadata Cursor uses for every interaction.

Inside these files, you can configure:

- `alwaysApply: true/false` – Should this rule run every time?
- `globs` – Apply this rule only to certain file types (C#, SQL, JS...)

This means every time you interact with Cursor, it follows these rules automatically. No more repeated back-and-forth.

---

## Building a Plan-Execute Workflow

I've set up **two workflows**:

1. **Plan** – Creates a task plan for what you want Cursor to do
2. **Execute** – Implements the plan step-by-step

The **Plan** workflow is a markdown file describing exactly what you want to generate. For example:

- Folder and file naming conventions
- Considerations for production (deployment, scaling, etc.)
- Tech stack (e.g., .NET 9, React)
- Testing and logging strategy

I also break the plan into **granular steps**, so each step is clear, traceable and possibly a commit.

---

## How It Works in Practice

Once your plan is ready, feed it to Cursor:

1. Describe the task (e.g., "Create a .NET 9 Web API that converts CSV to Markdown following the instructions at @plan.mdc")
2. Let Cursor output the **plan file**
3. Review the proposed steps and verify

Here's the beauty: Cursor respects the plan. It won't implement everything at once. It waits for your review. That means less chaos and more **predictable results**.

After reviewing, use the **Execute** rule:

```shell
@execute.mdc <plan-file-name>
```

This tells Cursor to follow the plan step by step: implement each step, run tests, check logs, and commit changes.

By the end, you have a clean, organised commit history, and each step can be rolled back if needed. No giant, messy pull requests.

---

## Why This Works

This approach makes interactions with Cursor:

- **More structured** – every step is planned upfront
- **More traceable** – commits match tasks
- **Less prone to AI mistakes** – you guide each action
- **More productive** – fewer iterations, more output

---

## Wrapping Up

Using Cursor this way feels like having a well-trained assistant. You define the rules, set the plan, review it, and execute with confidence.

Want to try it yourself? [Grab the starter files for free](https://gui-ferreira.kit.com/20f832817e).
