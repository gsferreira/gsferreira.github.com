---
layout: post
tags: post
date: 2020-05-07
title: A simple way to build your JavaScript tests data
description: Build JavaScript test data simply with spread operator - elegant alternative to complex builder pattern for object creation.
featured_image: /images/a-simple-way-to-build-your-javascript-tests-data-spread.png
---

When writing Unit Tests, you will need to create test data objects for sure. Usually, those objects have tiny differences between different test cases.

There's a pattern that I especially like when I'm doing this is C#. [The Builder Pattern](https://ardalis.com/improve-tests-with-the-builder-pattern-for-test-data).

The builder pattern is an elegant solution to the problem and I really like it. But, is it a simple solution for JavaScript?

Let's see how it would look like using the builder pattern in JS:

![Builder pattern](/images/a-simple-way-to-build-your-javascript-tests-data-builder.png)

As you can see, there's a lot of code needed to implement it.

**How can we do it more simply?**

The basic idea is to **use the [Spread Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to customize a default object**.

Let's see how:

![Spread Operator](/images/a-simple-way-to-build-your-javascript-tests-data-spread.png)
