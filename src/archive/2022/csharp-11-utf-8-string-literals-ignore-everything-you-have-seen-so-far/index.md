---
layout: post
tags: post
date: 2022-08-08
title: C# 11 UTF-8 String Literals - Ignore everything you have seen so far
description: C# 11 UTF-8 String Literals evolution - design changes, community feedback, and performance-readability balance in web scenarios.
featured_image: /images/archive/csharp/utf-8-string-literals-evolution.png
---

If you want to be sure that spaghetti is cooked 🍝, throw it against the wall and see if it sticks.

What does that have in common with C# 11 UTF-8 String Literals? Microsoft threw it against the wall, but it didn't stick.

Because of that, **anything you have seen about this feature until now is probably outdated**.

But, shall we start from the beginning? Let's do it.

## 1️⃣ First iteration

In April 2022, a [blog post with C# 11 Preview features](https://devblogs.microsoft.com/dotnet/csharp-11-preview-updates/#utf-8-string-literals) was published on the .NET Blog. One of the features is UTF-8 String Literals.

The goal of that feature is to **address particularly web scenarios where UTF-8 is king** 👑. It is common to have string constants that need to be converted into UTF-8. In those scenarios, **with previous versions, a developer would need to either pick performance or readability. Not anymore.**

The initial design proposed that strings could be converted into byte arrays at compile time in the following way ([snippet extracted from .NET Blog post](https://devblogs.microsoft.com/dotnet/csharp-11-preview-updates/#utf-8-string-literals)):

```csharp
byte[] array = "hello";             // new byte[] { 0x68, 0x65, 0x6c, 0x6c, 0x6f }
Span<byte> span = "dog";            // new byte[] { 0x64, 0x6f, 0x67 }
ReadOnlySpan<byte> span = "cat";    // new byte[] { 0x63, 0x61, 0x74 }
```

## 😰 The problem

This proposal led to some backlash from the community. As you may know, **.NET works with UTF-16 strings by default**. Many were concerned that this would cause confusion.

**Another concern was related to language evolution**. What if one day, [Mads Torgersen](https://devblogs.microsoft.com/dotnet/author/madst/) and his team need to get the representation of a UTF-16 into a byte array as well? You can see the problems that this uncovers.

Adding a new language feature is a balance of art, science and future prediction.

## 2️⃣ The fix with a suffix

Based on that concern, the [proposal](https://github.com/dotnet/csharplang/blob/main/proposals/utf8-string-literals.md) was reviewed. Now, it stands on a version where the **string must be suffixed with `u8`**, which stands for UTF-8.

That approach was approved at a [Language Design meeting](https://github.com/dotnet/csharplang/blob/main/meetings/2022/LDM-2022-04-18.md#issues-with-utf8-string-literals) on the premise that the .NET ecosystem is standardizing on `ReadOnlySpan<byte>` as the UTF-8 string type.
What's that mean?

That means that, while on the initial proposal, you would be able to simply assign a string to a byte array, now you need not only to suffix it with `u8` but also to assign it to a `ReadOnlySpan<byte>`.

Let's see it in action:

```csharp
// Instead of doing this
var u8Bytes = System.Text.Encoding.UTF8.GetBytes("ABC");
u8Bytes.Should().BeEquivalentTo(new[] { 65, 66, 67 });

// You can do this
ReadOnlySpan<byte> u8Span = "ABC"u8;
u8Span.ToArray().Should().BeEquivalentTo(new[] { 65, 66, 67 });
```

In simple terms, code like this:

```csharp
ReadOnlySpan<byte> u8Span = "ABC"u8;
```

Will be lowered to this:

```csharp
ReadOnlySpan<byte> u8Span = new byte[] { 65, 66, 67 };
```

You will not need to call that `GetBytes` anymore 🎉. You don't need to tradeoff maintainability and readability for performance. That makes me happy 😁.

## 👏 Takeaway

This is not only a story about a new feature.

I want to leave with not only an insight into what's coming.
I want you to appreciate that **the Language Team listens to the community and reacts to feedback**.

The journey of this feature demonstrates the importance of playing around with Preview versions and giving your feedback. Only that way, you are part of the evolution of our beloved language.

Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

🔗 You can find the source code used [here](https://github.com/gsferreira/dotnet-playground/tree/main/csharp/11/Utf8StringLiterals).
