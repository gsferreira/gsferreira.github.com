---
layout: post
tags: post
date: 2020-05-28
title: That flag argument is yelling at you
description: Flag arguments are a good indicator that something is wrong. Use them as Refactoring warning.
category: Refactoring, Improvement
---

Sometimes the code yells at you trying to warn you that something is wrong.

Flag arguments are one of those cases. Adding a Boolean argument to condition the execution is an easy fix, but we are doing the wrong thing.

By adding a flag argument to a function, it's clear that we are ignoring the Single Responsibility Principle. The code is yelling at us, trying to explain that. No doubt.

Let's take a look. When a function has a flag argument, we will find something like this (or even worse) in the implementation:

![Flag Argument](/images/that-flag-argument-is-yelling-at-you-flag-argument.png)

Wouldn't be better to have something like:

![Flag Argument Refactor](/images/that-flag-argument-is-yelling-at-you-refactor.png)

When writing code, remember that the goal is to simplify our client's life.
