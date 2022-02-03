---
layout: post
tags: post
date: 2022-02-03
title: Looking into C# Property Patterns Performance
description: How performant are C# Property Patterns?
featured_image: /images/archive/csharp/property-patterns-guard-benchmark.png
---

Property Patterns is one of those things that rapidly changed how I write code. I love how the code looks clear and expressive (see what I've written about it [here](https://gsferreira.com/archive/2021/expressive-c-code-with-property-patterns/)).

In that spirit, I recently tweeted and posted to LinkedIn how I loved simple things like implementing a Guard Clause on collections. See the tweet below.

![Tweet / Property Patterns](/images/archive/tweets/property-patterns.png)

_[(here)](https://twitter.com/gsferreira/status/1486625607895109635)_

I was aware that this is not for the taste of everyone, and obviously, most comments were from people that prefer other conventional ways of expressing it.

One of the comments was the usual when you post .NET related content: _"What about performance?"_

## Performance 🚀

So, I decided to go on a journey to understand how performant Guard clauses with Property Patterns can be.

To do that, I decided to compare the multiple suggestions received with my loved Property Patterns.

So, the candidates were:

### Option A

```csharp
if (list is null || !list.Any())
    return false;
return true;
```

### Option B

```csharp
if (list?.Any() == false)
    return false;
return true;
```

### Option C

```csharp
if (list == null || list.Length == 0)
    return false;
return true;
```

### Option D

```csharp
if (list is not { Length: > 0 })
    return false;
return true;
```

### Option E

```csharp
if (list is null or { Length: 0 })
    return false;
return true;
```

After running a benchmark, I got the following results.

![Property Patterns Benchmark Results](/images/archive/csharp/property-patterns-guard-benchmark-results.png)

That was an excellent result.

## How can they do that? 🤔

As you can see, Property Patterns aren't the most performant, but they are close enough. How?

If you pick option D or E and lower it using [SharpLab](https://sharplab.io/), you will see that the Property Patterns lowered version is quite close to Option C, the most performant option.

![SharpLab / Lowered Property Patterns](/images/archive/csharp/lowered-property-patterns.png)

## So what? 🙄

Now what? Why should I use Property Patterns when there's a most efficient option?

That is true. On the other hand, Property Patterns are expressive (my opinion), but also **they guide you to better decisions**.

As an example, you can't use LINQ with Property Patterns. You can see from benchmark results that it is a good constraint to have. Anything that can set you on the path of success is a good thing to do.

After this journey, this is just one more reason to keep using it. I know it may feel strange for an experienced .NET developer, but give it a try.

🔗 You can find the source code used [here](https://github.com/gsferreira/dotnet-playground/tree/main/Optimizations/PropertyPatternsBenchmark).

I hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
