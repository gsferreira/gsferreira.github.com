---
layout: post
tags: post
date: 2021-12-20
title: Expressive C# code with Property Patterns
description: Property Patterns are a different way to write c#, but that can lead to expressive and clear code. See how.
featured_image: /images/archive/csharp/property-pattern.png
---


C# has been growing with F# inspired features. 

One that is most exciting is [Pattern Matching](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/patterns#property-pattern). 

The introduction of Pattern matching led to Property Patterns. 

Property patterns deserve close attention. Since they were included on C# 8, they have been evolving, with improvements either on C# 9 but also in C# 10.

**Property Patterns are interesting ways to make the code more expressive, and in this post, we will see how.**

## What is a Property Pattern

You use a property pattern to match expression properties to nested patterns. 

```csharp
static bool IsFirstOfTheMonth(DateTime date) => date is { Day: 1 };
```


So, with Property Patterns, you can go from this:

```csharp
private static (bool isValid, string reason) Validate(Note note)
{
    if (note == null)
        throw new ArgumentNullException(nameof(note));
    
    if (note.Title.Length < 5 || note.Title.Length > 50)
        return (false, "Title should be 5 to 50 char long");
    
    if (note.Content == null) 
        return (false, "Content is required");

    return (true, "");
}
```


To this:

```csharp
private static (bool isValid, string reason) Validate(Note note)
    => note switch
    {
        { Title.Length: < 5 or > 50 } => (false, "Title should be 5 to 50 char long"),
        { Content: null } => (false, "Content is required"),
        null => throw new ArgumentNullException(nameof(note)),
        _ => (true, "")
    };
```



## Where can you use them

It's common to see the Property Pattern being used with switch expressions, but don't limit it to there.

Property Patterns can be used in the context of switch case guards, if's, boolean assignments, catch a condition, etc.

```csharp
try
{
    //...
}
catch (NpgsqlException ex) when (ex is {Code: "42P01"})
{
    //...
}
```


## Nested patterns

Property Patterns can be used to not only test properties but also nested ones.
With [C# 10 Extended property patterns](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-10.0/extended-property-patterns), that becomes even simpler.

```csharp
if (person is Student { Address.CountryCode: "PT" })
```

## Precedence

With Property Patterns you will not be using "&&", "||" or "!", instead, you can use "and", "or", "not".

You can also use parentheses to specify the precedence.

```csharp
person is Student ({ Address.CountryCode: "PT" } or { Address.CountryCode: "ES" }) and { Age: < 20}
```


## Wrapping up

Next time you need to write a boolean expression, give what you have learned here a try.
I know that at the moment, this is not that common in C# code bases, which increases the required cognitive load. 
It's a different way to write code if you are a long time C# Developer, but in the end, the code becomes more expressive in my opinion.
What do you think?

I hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
