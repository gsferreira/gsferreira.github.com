---
layout: post
tags: post
date: 2022-06-20
title: A Gentle Introduction to C# 11 List Patterns
description: What are List Patterns, and how can you use them.
featured_image: /images/archive/csharp/list-patterns.png
---

Have you heard about the recent love story in the .NET space?

C# is in love with pattern matching 💘.

And let's face it, they make a cute couple. Definitely better than Anna & Kristoff. Take that, Disney! If you don't get this reference, you can keep reading. I promise you it's not about Olaf or any other Frozen character. It's all about the new [**List Patterns in C# 11**](https://devblogs.microsoft.com/dotnet/early-peek-at-csharp-11-features/#c-11-preview-list-patterns).

We all know that F# has been an inspiration for C# lately. We know that Pattern Matching capabilities have been evolving version upon version. Property patterns deserve attention since they came to life on C# 8. [We have seen improvements on C# 9 and C# 10.](https://gsferreira.com/archive/2021/expressive-c-code-with-property-patterns/) And now is the time for Lists.

## 🤔 What are List Patterns?

Long story short, **List Patterns let you look into the shape of a list or an array**. If you want to check if the collection starts, ends or contains a given value, List Patterns will be the way to go.

I know, I know. That is strange. And I have to confess that it's even harder to explain it. Perhaps, it's better to do it with a few examples.

## 1️⃣ The List Pattern

List Patterns surround values with square brackets. You will define _1_ to _N_ values that you want to match in the collection.

You can check if a collection has a specific set of values.

```csharp
int[] collection = { 2, 5 };

return collection switch
{
    [1, 2] => "A",
    [2, 5] => "B",
    [1, _] => "C",
    [..] => "D"
};

```

You can check the shape of the collection by capturing the values.

```csharp
[Theory]
[InlineData(new string[] { }, "Empty")]
[InlineData(new string[] { "e1", "e2" }, "Found e1 and e2")]
[InlineData(new string[] { "e1", "e2", "e3", "e4", "e5" }, "Many found: from e1 to e5")]
public async void GivenStringCollection_ThenReturnCollectionDescription(string[] input, string output)
{
    var result = input switch
    {
        [] => "Empty",
        [var a, var b] => $"Found {a} and {b}",
        [var a, .. _, var z] => $"Many found: from {a} to {z}"
    };

    result.Should().Be(output);
}
```

## 2️⃣ The Slice Pattern

You have noticed that in the example above when the collection has more than 2 elements, we use a _".."_ and _"\_"_.

```csharp
[var a, .. _, var z] => $"Many found: from {a} to {z}"
```

_".."_ is the slice pattern. It means we match every collection entry from the previous Pattern until the next one.

Slice pattern let you discard those values, as seen above using underscore. Or, we can capture the value into a variable, as you can see below.

```csharp
var uri = new Uri("http://www.mysite.com/categories/category-a/sub-categories/sub-category-a.html");

var result = uri.Segments switch
{
    ["/"] => "Root",
    [_, var single] => single,
    [_, .. string[] entries, _] => string.Join(" > ", entries)
};
```

## 💪 Is it powerful?

I have a challenge for you if you are not seeing the potential.

Can you imagine writing a method to calculate Factorial using List Patterns?

You can, and it's neat.

```csharp
[Theory]
[InlineData(3, 6)]
[InlineData(10, 3628800)]
public void GivenNumber_ThenCalculateFactorialUsingListPatterns(int input, int output)
{

    var values = Enumerable.Range(1, input).ToArray();

    var factorial = Factorial(values);

    factorial.Should().Be(output);


    int Factorial(int[] values)
    {

        return values switch
        {
            [] => 1,
            [.. int[] numbers, int number] => number * Factorial(numbers)
        };
    }
}
```

STOP 🛑! You don't need to grab your pitchfork. I'm not saying that Factorial should be implemented like this. I want to show you what this feature can potentially do.

C# 11 is in Preview, and we still need to wait for it, so we need to wait.

While we wait, if you have any use case for it, let me know. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

🔗 You can find the source code used [here](https://github.com/gsferreira/dotnet-playground/tree/main/csharp/11/ListPatterns).
