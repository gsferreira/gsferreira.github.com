---
layout: post
tags: post
date: 2022-08-28
title: C# 11 Required Members, the imperfectly awesome feature
description: Finally, Required Members are landing on C#. It's a highly expected feature, but not everything is perfect. In this post we will see why.
featured_image: /images/archive/csharp/required-members.png
---

If you skim the [C# 11 feature list](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-11), there's one that grabs the attention as a yellow Lamborghini in a parking lot (except [Monaco](https://en.wikipedia.org/wiki/Monaco) parking lots 💰). It's [Required Members](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-11#required-members). The most wanted from the list.

**Is it exciting? Yes! Is it perfect? Not sure.** Stay till the end to see why.

## 🤨 What are we trying to solve here?

**Constructors are super handy but can be painful. They are positional, so brittle to changes.** Adding a new optional member requires not only a new overload but also making sure that members are added at the end of the list. No one wants to break all consumers. Am I right?

You may say: _"let's avoid constructors and take advantage of object Initializers and Nullable Reference Types."_

And I quickly answer: _"Calm down, my friend!"_

Constructors are still important, and [nullable reference types](https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references) have a weak spot at Initialization. Even with the investment to make object Initializers better through the _"init"_ keyword.

What's the weak spot?

- Have you used `= null!`? It feels like a hack, right?!
- There's no check in place to ensure that the code instantiating the class initializes the member.

## 👋 Say Hi to Required Members

Required Members come to solve that. Since C# 1.0 there's no expressive way to declare a member as Required. We are now getting it.

```csharp
public class User
{
	public required string Email { get; init; }
}

var user = new User()
{
	Email = "me@gsferreira.com"
};
```

**Not only do you get an expressive way to annotate your models, but non-nullable warnings go away.**

The goal is to annotate fields as well, not just properties. That's why it's named Required Members instead of Required Properties. In case you asked it.

With Required Members, **the compiler will enforce that you initialize that member**. You can use it on Classes, Records or Structs.

```csharp
error CS9035: Required member 'User.Email' must be set in the object initializer or attribute constructor.
```

Please keep in mind that Required will not enforce an explicit initialization to a non-null value. Nullable and required are independent concerns. It's up to you as a developer to enforce it.

## ❓ So, what's the problem with it?

If you remember, I started this article by saying that Required Members isn't perfect.
**The success of a feature is highly related to its adoption.** And here, you can find some things that may impact it.

- **Constructors:** When a Required Member is set on a constructor, you will need to add an attribute _"SetsRequiredMembers"_ to that constructor. This attribute will signal the compiler that the constructor already initializes the required member. This looks sub-optimal. It's this kind of detail that makes features hard to adopt.

```csharp
using System.Diagnostics.CodeAnalysis;

public class User
{
	[SetsRequiredMembers]
	public User(string email)
	{
		Email = email;
	}

	public required string Email { get; init; }
	public string? Name { get; init; }
}

var user = new User("me@gsferreira.com");
```

- **Records:** One of the benefits of records in C# is not having to write a bunch of boilerplate code. That is particularly true when you use positional parameters. So, I've been heavily using it on my [anemic](https://martinfowler.com/bliki/AnemicDomainModel.html) data structures like [Data Transfer Objects (DTOs)](<https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ff649585(v=pandp.10)?redirectedfrom=MSDN>). In those cases, this feature is kind of useless since positional record properties are inherently required. To use it, you need to ignore positional parameters. That's not my standard way of using Records.
  _Now that I think about it, it's interesting that Required Members wants to address the problem of constructors and positional records properties that may suffer from the same issue._
- **Guard Clauses:** One of the Required Members' goals is to avoid, in many cases, using Constructors in favour of property initialization. In many cases, migrating will be hard. Because it's common to see constructors applying Guard clauses. That means applying a Guard clause in a setter. So you will need a backing field (at least while we don't have [Semi-Auto-Properties field keyword](https://github.com/dotnet/csharplang/issues/140)). That's an extra burden that will create resistance to the adoption.

Evolving a language with more than 20 years isn't easy. Each step should be pondered and carefully evaluated. We have seen that in Nullable Reference Types. I believe that it also influenced the design of Required Members.

## ⏩ What's now?

Am I excited about this feature? Yes, I am. 🤩 I will be using it for sure.

Unfortunately, not as much as I first suspected. Nowadays, most of my Data Transfer Objects (DTOs) are records, and in my Domain, you will find more than variables being assigned in the constructor.

I'm curious to see if this is a stepping stone in the language and see what the community will be developing on top of it.

Let me know what you think about it, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.
