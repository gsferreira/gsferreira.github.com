---
layout: post
tags: post
date: 2020-05-05
title: Don't declare your Variables at the top
description: We are writing code for others to read. So, we shouldn't present our characters too early in the story.
category: Refactoring, Improvement, C#, .net
featured_image: /images/dont-declare-your-variables-at-the-top-memory-overflow.png
---

When I start learning to code, I was taught to declare variables at the top of the code. I followed it for a long time before start questioning that absolute truth.

We are writing code for others to read. So, we shouldn't present our characters too early in the story. [Our working memory handle a strict number of things at a given time](https://www.livescience.com/2493-mind-limit-4.html).

![Working memory overflow](/images/dont-declare-your-variables-at-the-top-memory-overflow.png)

Keeping related concepts closer, we are reducing the cognitive load. This will lead us to clean and simple code.

You can find evidence of that, in Design Principles. By using the [Proximity principle](https://www.interaction-design.org/literature/article/laws-of-proximity-uniform-connectedness-and-continuation-gestalt-principles-2), we form groups by keeping things closer.

This is one of the reasons why **I run away from global variables.**

Besides the cognitive load reduction, there's a positive side effect from following this. **I use this as a warning sign to extract a function. Whenever you can't keep the variables close to where they are used and to the top, extract it.**

So, instead of doing this:

![Example 1](/images/dont-declare-your-variables-at-the-top-example1.png)

You can do this:

![Example 2](/images/dont-declare-your-variables-at-the-top-example2.png)

And then refactor to this:

![Example 3](/images/dont-declare-your-variables-at-the-top-example3.png)
