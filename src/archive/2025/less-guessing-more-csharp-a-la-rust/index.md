---
layout: post
tags: post
date: 2025-01-20
title: Less guessing, more C# à la Rust
description: C# Result pattern inspired by Rust - implement explicit error handling, reduce guesswork, and improve function clarity and safety.
featured_image: /images/archive/highlight/less-guessing-more-c-a-la-rust.png
---

Over time, I've learned to like functions that give clear answers instead of just saying "nothing" or throwing random errors.

In the .NET world (like in many other languages), knowing the outcome of a method/function is guesswork. So, why not clearly define success or failure outcomes explicitly in our code? This approach is often called the "Result Pattern".

## Result Pattern

The Result Pattern promotes clarity by letting a function say, **"This worked and here's the value", or "Something went wrong and here's the reason".** 

In C#, you might initially rely on exceptions or null checks, but that style often drifts toward ambiguity. While you can achieve the same results, the lack of clarity can lead to problems. Let's see.

An exception might bubble up from who-knows-where, or you might find yourself spreading `if (thing == null)` checks across your code. 

The Result Pattern makes things better. It lets your function clearly show success or errors, making it easy for your teammates (and future you) to understand. In [Rust](https://www.rust-lang.org), this isn't just a pattern, it's the normal way to write code.

## The Rust way

Rust's built-in `Result<T, E>` type integrates error handling into normal control flow. This reduces confusion and encourages a consistent coding mindset. Rust developers don't guess or rely on try-catch. They know every function that might fail will return a clear "Result". That clarity becomes contagious, making it feel strange to ever return to bare values without context again. 

In .NET, we don't get that out-of-the-box. Still, we can mimic it ourselves. Let's say we create a `Result<T>` type that holds either a value or an Error, another type we define. With C# 10 and above, a read-only record struct is perfect for this. It gives us immutable data structures that are easy to work with, pattern match against, and reason about. 

## The Result Pattern in C#

Here's an example:

```csharp
public readonly record struct Error(string Message);

public readonly record struct Result<T>
{
    public T? Value { get; }
    public Error? Error { get; }
    public bool IsSuccess => Error is null;

    private Result(T value)
    {
        Value = value;
        Error = null;
    }

    private Result(Error error)
    {
        Value = default;
        Error = error;
    }

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(Error error) => new(error);
}
```

Any function returning `Result<T>` instantly communicates that success or failure is part of the everyday code flow. You don't rely on exceptions to transport you from one line of code to another. Instead, you inspect the returned `Result<T>` and decide how to proceed. Don't forget that even though .NET improved the performance of exceptions, they are still not the best choice if performance is needed.

```csharp
public Result<string> GetUserDisplayName(int userId)
{
    if (userId == 42)
    {
        return Result<string>.Success("Gui");
    }

    return Result<string>.Failure(new Error("User not found"));
}

var displayNameResult = GetUserDisplayName(42);

var message = displayNameResult switch
{
    { IsSuccess: true, Value: var v } => $"Found user: {v}",
    { Error: var err } => $"Error: {err?.Message}"
};

Console.WriteLine(message);
```

## The benefits

Without leaning on exceptions or null checking, the code's intention is right there. By reading the signature and the handling code, you see that the function might fail, and it will tell you exactly how it failed. This style may feel foreign at first, but once you adopt it, there's a sense of calm that comes with writing code. Each branch is explicit, and each outcome feels deliberate.

The Result Pattern speaks strongly to developers who want a more intentional coding style. In C#, we might need to build the model ourselves, but the end result is just as compelling as using it in Rust. You don't need to search for documentation or comments. Just look at the function, and you'll know if you need to handle success or an error, simple and clear! It's a pattern that fosters clarity and helps ensure that code stays honest and predictable as projects grow.

If you want to go deeper into this, watch this video, where I talk about how to avoid throwing exceptions by applying this pattern. 👇

https://youtu.be/C_u1WottRA0?si=2-LhO5XF5m3qZxhM