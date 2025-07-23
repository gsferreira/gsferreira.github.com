---
layout: post
tags: post
date: 2022-08-22
title: C# 11 Auto Default Structs in depth
description: C# 11 Auto Default Structs eliminate field initialization requirements - improved maintainability and Class-Struct consistency.
featured_image: /images/archive/csharp/auto-default-structs.png
---

I always had the feeling that Structs were the ignored son of C#. I don't want to cause problems in the Family. But, hey, it was not me picking favourites. 🤪

Classes were always the first to evolve and improve. Don't get me wrong. It's completely understandable. It's the most used, so the investment is understandable and unquestionable.

Now, I can tell you that it's changing. **On the past few C# versions, we have seen Structs catching up.** Struct Records and Parameterless constructors are steps on that direction. **It's clear the effort to provide a similar experience between Classes and Structs.** And that is good for the language. It brings consistency.

The next on the list is Auto Default Structs.

## 🙋‍♂️ What are we trying to solve?

Before C# 11, if you declare a structure and you have a Constructor, **you would need to assign each field**.

```csharp
struct PlayerPosition
{
    public PlayerPosition(int x, int y)
    {
        X = x;
        Y = y;
    }

    public int X;
    public int Y;
}
```

If you don't initialize one of the fields, you will have the following compilation error.

```csharp
  [CS0171] Field 'PlayerPosition.Y' must be fully assigned before control is returned to the caller.
```

That causes **maintainability problems**. Imagine that you add an extra field to the Struct. Now you need to change all the places where the Constructor is invoked. Besides the fact that this is a behaviour that doesn't mimic what we are used to in Classes.

## 🤔 But, why do we need to do that?

In the way that Structs work, if do not set the value, you could get the following result:

```csharp
var player = new PlayerPosition();
player.X = 10;
player = new PlayerPosition();
player.X.Should().Be(0); // Assertion will fail. It will be 10 if X isn't initialized in constructor.

struct PlayerPosition
{
    public PlayerPosition(){}

    public int X;
    public int Y;
}
```

There's a brilliant thread about it [here](https://github.com/dotnet/csharplang/issues/5737#issuecomment-1097670457).

## 🌟 How Auto Default Structs can help?

Auto Default Structs are the way C# will fix that. Let's start by ignoring the feature name. Is super strange. 🙄

With C# 11, **the compiler will ensure that all fields are initialized to their default value**.

In other words, fields not explicitly initialized on the Constructor will be initialized with the default value. The [initialization is inserted at the beginning of the Constructor](https://github.com/dotnet/csharplang/issues/5737).

Imagine the following code.

```csharp
struct PlayerPosition
{
    public PlayerPosition(int x, int y)
    {
        X = x;
        Y = y;
    }

    public int X;
    public int Y;
    public int Z;
}
```

This code is now valid with C# 11. Why? Because the compiler will be doing something like:

```csharp
struct PlayerPosition
{
    public PlayerPosition(int x, int y)
    {
        Z = default; // 👈 Here is the magic

        X = x;
        Y = y;
    }

    public int X;
    public int Y;
    public int Z;
}
```

## 👏 Takeaway

I like the fact that this is a step on uniformization between Classes and Structs. Structs, will for sure become a bit easier to maintain.

Will I be heavily using this? No. But when I use Structs, this will be useful for sure.

I hope that you liked it. Let me know if you have to give it a try.

In the meanwhile, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch. 😉
