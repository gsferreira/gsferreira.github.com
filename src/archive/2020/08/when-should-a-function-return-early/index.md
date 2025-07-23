---
layout: post
tags: post
date: 2020-08-03
title: When should a function return? Return Early
description: Embrace early return pattern - reduce cyclomatic complexity, improve readability, and eliminate nested conditions in functions.
---

*"A method should return once at the end of the method".*
No, I don't think so.

I remember to listen to that sentence when I was learning to program. It was a universal truth to me at the time. I brought this idea to the different languages that I've worked afterwords. 
Being honest, I always felt something strange about that. **Keeping the code readable with a single return was a hard task.** I needed to nest conditions, keeping "dummy" variables, having state control variables... **It was a mess.**

![Function without early return. Condition nesting.](/images/archive/clean-code/without-early-return.png)

So I changed. I learn to return early and to return often. I prefer to have multiple returns instead of nesting, for example.

A common and useful scenario is when we need to apply preconditions. If we have conditions to execute a given function, makes no sense to delay the verification. **If you are cooking a recipe, it wouldn't be fun if you didn't have the ingredients list and you only knew what you need while following the instructions.** In code, you can apply the same logic.

![Function early return applying pre-conditions.](/images/archive/clean-code/early-return.png)

If you apply this principle, you will **reduce the cyclomatic complexity and the cognitive load to understand the code.** In the end, the source **code will be simpler**.

I recommend you to apply this principle together with the [idea of extracting methods](/archive/2019/10/a-simple-tip-to-improve-your-code-maintainability-decompose-if-statements-into-methods/).


Code is like a tree. We need to prune and shape the tree.
Don't let it grow wild.
