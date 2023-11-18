---
layout: post
tags: post
date: 2022-11-17
title: The Biggest Folder Structure Mistake on .NET
description: This is the most common mistake when organizing Projects and Solutions in .NET. It is a real onboarding nightmare for newcomers. In this post, I will show you how to use Feature Folders towards a Screaming Architecture (Clean Architecture).
featured_image: /images/archive/architecture/mvc-folder-structure.png
---

If you organize your project folder structure like this, you are making a huge mistake.

![Librarian folder structure approach](/images/archive/architecture/librarian-folder-structure.png)

```bash
/CommandHandlers/AddOrderCommandHandler.cs
/CommandHandlers/AddProductCommandHandler.cs
/CommandHandlers/CancelOrderCommandHandler.cs
/Repositories/ProductsRepository.cs
/Repositories/OrderRepository.cs
/Commands/AddProductCommand.cs
/Commands/AddOrderCommand.cs
/Commands/CancelOrderCommand.cs
/Validators/AddOrderCommandValidator.cs
/Validators/AddProductCommandValidator.cs
```

It's a simple mistake that can cause a lot of frustration, especially to the new joiners.
The good news is that you can go from this to this with a simple technique.

> **Don't organize like a Librarian.
> Organize by action/utility.**

Let's take a look.

##  📚 The Librarian Approach

It's common to see **projects organized around technical concerns**.

We build buckets like Repositories, Services, Validators, and Mappers and group everything according to that.

The problem is that it **becomes hard to find anything**. Until you are familiar with a code base, it's hard to know where a feature-related code lands. So, **the cognitive load required to perform increments, refactoring's, or navigate the code, is high**.

Grouping that way, **objects naturally will have a vast scope.** For example, a Repository or a Service may be the home of code related to multiple features.

**To this, I call a Librarian approach to structure code. When we organize it by category as if code is a book.**

### The MVC Problem

Some templates naturally lead to technological segregation, which reinforces this problem.
Yes, MVC, I'm talking about you.

When we create a new MVC API, we get a Controllers, Models, and Views folder. MVC invites us to organize by technology once again.

![MVC folder structure approach](/images/archive/architecture/mvc-folder-structure.png)

## 🎯 The Solution

It's easy to find a book in a Library using the category system. It's even better that we can easily find related books together.

But do we need the same approach in source code? No.

A single feature will have code across files with several responsibilities (categories). **When we access code for maintainability, we do it in the context of a Feature.** That's the most common access pattern. So, how should we organize it instead? The rule is simple.

> **Don't organize like a Librarian.
> Organize by action/utility.**

What does that mean?

- We should think about how the code will be used, accessed, and maintained.
- We should think about what code will evolve together.
- We should think about how to reduce the cognitive load of future actions.

This is the Feature Folders concept in a nutshell.
These will lead you to Screaming Architecture from Clean Architecture.

So, the structure that we have seen at the beginning of this post can be refactored into:

![Feature folder structure approach](/images/archive/architecture/feature-folder-structure.png)

```bash
/CancelOrder/ICancelOrderRepository.cs
/CancelOrder/CancelOrderCommand.cs
/CancelOrder/CancelOrderCommandHandler.cs
/AddOrder/AddOrderCommandHandler.cs
/AddOrder/IAddOrderRepository.cs
/AddOrder/AddOrderCommand.cs
/AddOrder/AddOrderCommandValidator.cs
/AddProduct/AddProductCommand.cs
/AddProduct/AddProductCommandHandler.cs
/AddProduct/AddProductCommandValidator.cs
```

### What about MVC?

If you want to organize your API differently, you have several options:

- You can adapt [Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-7.0) (my preferred way).
- You can use API Endpoints ([see here](https://github.com/ardalis/ApiEndpoints)).
- You can use Feature Folders ([see here](https://scottsauber.com/2016/04/25/feature-folder-structure-in-asp-net-core/)).

## 🏗 The Structure Besides the Project

It doesn't mean you should keep adapters to the outside world inside the same folder and project.

Adapters need to be swappable. You can find an in-depth explanation [here](https://guiferreira.me/archive/2022/how-to-apply-hexagonal-architecture-with-dotnet/).

If you want to see me performing the refactoring, take a look at this video 👇

<iframe width="560" height="315" src="https://www.youtube.com/embed/rYnbspEcKJw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Let me know what you think about it. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Just keep things Simple 🌱
