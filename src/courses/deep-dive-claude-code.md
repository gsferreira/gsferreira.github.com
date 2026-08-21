---
layout: course.njk
title: "Deep Dive: Claude Code"
description: "Configure, extend, and automate Claude Code until it works the way you already do."
duration: "6h 59m"
category: AI
rating: 
reviewCount: 
level: Advanced
featured: false
highlight: true
image: /assets/courses/deep-dive-claude-code.webp
courseUrl: https://dometrain.com/course/deep-dive-claude-code/?ref=gui-ferreira&affcode=1115529_k5a22dj8&&promo=website&promotion=website
callToActionTitle: "Ready to stop using Claude Code and start building on it?"
callToActionSubtitle: "Skills, hooks, subagents, MCP and CI/CD, packaged into one plugin you own."
date: 2026-08-21
relatedCourses:
  - getting-started-claude-code
---

## _"It worked brilliantly that one time. I just can't make it happen again."_

You've been using Claude Code for a while. You wrote a CLAUDE.md. You've read about skills and hooks and MCP servers, and you've probably installed one of each.

But you still watch every tool call go past. You still explain the same project conventions on Monday that you explained on Friday. And the workflow you keep meaning to automate is still living in your head.

That's the gap. Not the model. The setup around it.

## What you'll learn

- How Claude Code reasons, and what model and effort settings actually cost you
- How to configure at scale: the `.claude` directory, modular CLAUDE.md files, `.claude/rules/`, sessions and checkpoints
- How to build custom Agent Skills with arguments, bash, and file inclusion
- How to intercept the execution lifecycle with pre-tool, post-tool, and prompt hooks
- How to orchestrate the built-in subagents and write your own
- How to configure MCP servers, and where the sharp edges are
- How the permission model works, how to sandbox bash, and what prompt injection looks like in practice
- How to hand off work autonomously and verify what came back
- How to run Claude headless in CI/CD, including GitHub Actions
- How to package everything you build as a plugin your team can install

By the end you'll have your own plugin: a skill, a hook safety net, a review subagent and a wired MCP server, packaged into one unit, installed from a clean clone, and published.

81 lessons. Just under seven hours.

## Most people stop at CLAUDE.md

It's the obvious first move, so everyone makes it. Then the file grows to four hundred lines, half of it goes stale, and the agent still asks about things you documented in March.

Configuration isn't one file. It's memory, rules, settings scopes, and skills that load only when they're needed. Once you see how those pieces fit, the file gets shorter and the sessions get better.

## Autonomy is only useful if you can check it

Here's the trap. You give Claude a bigger task, it works for twenty minutes, it comes back with a diff, and you skim it. It looks fine. You merge.

Skimming isn't verification. It's the same instinct as chasing 100% coverage, arriving from the opposite direction. One measures everything and proves nothing. The other measures nothing and feels fine about it.

So we spend a full module on verification, dynamic workflows, and goal-driven autonomy. You'll learn how to set up work that reports back in a form you can actually trust, and how to drive Claude remotely once you do.

## This is not a list of features

The docs already list the features. They're free, and they're more current than any video will ever be.

This course is about the decisions the docs don't make for you. When a hook beats a skill. When a subagent is worth the context it costs. Which MCP servers earn their place, and which ones just add attack surface. Where to draw the permission line so you stop clicking Allow without reading.

By the end, those decisions collapse into one line you keep:

> Prompt it once. Skill when it repeats. Hook when it must always happen. Subagent when it needs its own context. MCP when the capability lives outside. Plugin when it should travel.

And a second one, for how you run it. Supervise by default. Automate what verifies itself. Hand off what has a measurable end state. Go remote or headless when you're not there.

You still do the engineering. This is about building the setup that stops you repeating yourself.

## Frequently Asked Questions

<div class="space-y-4">
<details class="bg-gray-50 dark:bg-gray-900 rounded-2xl px-8 transition-colors">
<summary class="flex flex-1 items-center justify-between py-6 text-left font-medium text-gray-900 dark:text-white hover:no-underline transition-colors">
What is the target audience for this course?
</summary>
<div class="pb-6 text-gray-600 dark:text-gray-300">
Developers who already use Claude Code and feel they've hit a ceiling. You know your way around a session, you've written a CLAUDE.md, and you suspect there's a lot more available than what you're using. There is.
</div>
</details>

<details class="bg-gray-50 dark:bg-gray-900 rounded-2xl px-8 transition-colors">
<summary class="flex flex-1 items-center justify-between py-6 text-left font-medium text-gray-900 dark:text-white hover:no-underline transition-colors">
Do I need to take "Getting Started: Claude Code" first?
</summary>
<div class="pb-6 text-gray-600 dark:text-gray-300">
Not if you've already been using the tool. The Getting Started course covers your first prompts and the basic development workflows. This one picks up where that ends, at configuration, extensibility, and automation. If you've never opened Claude Code, start there instead.
</div>
</details>

<details class="bg-gray-50 dark:bg-gray-900 rounded-2xl px-8 transition-colors">
<summary class="flex flex-1 items-center justify-between py-6 text-left font-medium text-gray-900 dark:text-white hover:no-underline transition-colors">
Do I need to know C# to take this course?
</summary>
<div class="pb-6 text-gray-600 dark:text-gray-300">
No. The examples are in C# and React, but nothing you learn here is tied to them. Claude Code doesn't care what you build with, and neither does this course. Skills, hooks, subagents, and MCP servers work the same whatever your stack. If you're comfortable in a terminal and a codebase, you're ready.
</div>
</details>

<details class="bg-gray-50 dark:bg-gray-900 rounded-2xl px-8 transition-colors">
<summary class="flex flex-1 items-center justify-between py-6 text-left font-medium text-gray-900 dark:text-white hover:no-underline transition-colors">
Will this still be relevant as Claude Code changes?
</summary>
<div class="pb-6 text-gray-600 dark:text-gray-300">
The tool moves fast, and some details will change. That's why the course teaches how the pieces relate to each other, and when to reach for each one, rather than memorising today's flags. Those decisions outlive the release notes. You also get lifetime access, so updates are included.
</div>
</details>

<details class="bg-gray-50 dark:bg-gray-900 rounded-2xl px-8 transition-colors">
<summary class="flex flex-1 items-center justify-between py-6 text-left font-medium text-gray-900 dark:text-white hover:no-underline transition-colors">
Is it safe to give an agent this much autonomy?
</summary>
<div class="pb-6 text-gray-600 dark:text-gray-300">
It's a fair question, and the course takes it seriously. A full module covers the permission model, sandboxing bash, and prompt injection. Autonomy without those is a bad trade. With them, it's a workflow you can hand real tasks to.
</div>
</details>

<details class="bg-gray-50 dark:bg-gray-900 rounded-2xl px-8 transition-colors">
<summary class="flex flex-1 items-center justify-between py-6 text-left font-medium text-gray-900 dark:text-white hover:no-underline transition-colors">
What do I need to follow along?
</summary>
<div class="pb-6 text-gray-600 dark:text-gray-300">
A terminal you're comfortable in, a code editor, git on your machine, and a Claude subscription with access to Claude Code. The course covers the models, the effort settings, and what they cost, so you can size a plan against the way you actually work.
</div>
</details>

<details class="bg-gray-50 dark:bg-gray-900 rounded-2xl px-8 transition-colors">
<summary class="flex flex-1 items-center justify-between py-6 text-left font-medium text-gray-900 dark:text-white hover:no-underline transition-colors">
What if I get stuck or have questions?
</summary>
<div class="pb-6 text-gray-600 dark:text-gray-300">
Almost every section ends with a quiz or a hands-on challenge you build yourself. I build one piece on screen, then you build a parallel one on your own project. Plus, you get access to our community, where you can ask questions and share experiences with other students. In any case, you can always reach out to me.
</div>
</details>
</div>
