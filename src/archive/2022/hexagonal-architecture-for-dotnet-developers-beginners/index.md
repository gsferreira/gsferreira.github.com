---
layout: post
tags: post
date: 2022-09-12
title: Hexagonal Architecture for .NET Developers (Beginners)
description: A beginner's introduction to Hexagonal Architecture (AKA Ports & Adapters), where it explained the .NET concepts that you can use to bring Hexagonal Architecture to life.
featured_image: /images/archive/hexagonal-architecture/hexagonal-architecture-title.png
---

91.23% of .NET Developers think about Clean Architecture when creating a new Solution.
Less than 20% know Hexagonal Architecture.
Let me tell you that we are failing as a community. Hexagonal Architecture deserves more respect from us.

_Note: those percentages are based on a study where I was inquired about my own random opinion 😄_

## ⬡ What is Hexagonal Architecture?

Hexagonal Architecture, also known as Ports & Adapters, has been presented to us by [Alistair Cockburn](https://www.linkedin.com/in/alistaircockburn) in 2005.

But why? Why did Alistair share this idea?
Have you ever been in a situation **where it was hard to test your most important code?** Have you ever realized that it was **hard to Test because it was extremely hard to swap a data storage or a client protocol in your software?** All those classical problems of [Layered Architecture](https://en.wikipedia.org/wiki/Multitier_architecture).

The goal of Hexagonal Architecture is to fix that. **With Hexagonal Architecture, you gain the capability of Testing in isolation. And the best is that your software becomes independent of Tools and Delivery Mechanisms.** It is an awesome Architecture to evolve your software. Go ask Netflix ([see here](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)).

So, how does it work? It starts with a simple premise. **Every software has an internal and an external side.** Isn't it? There's no point in having code when there's no impact on the outside world.

## 📜 Ports

Knowing that we need to have a way to communicate with the outside world. Since we know that the world out there is messy, we use Ports.

**Ports are contracts between the Internal and External world.**

In .NET terms, Ports will be a set of Interfaces and Classes or Records for DTOs ([Data Transfer Objects](https://en.wikipedia.org/wiki/Data_transfer_object)). You will place them together with your Core Application.

## 🔌 Adapters

Ports alone don't do much. We need to plug Adapters there. **Adapters act like Delivery Mechanism translators. They know a Tool or Device and mediate the relationship while fulfilling the contract defined by a Port.** In the real world, you can see a parallel on phone charging adapters that will let you travel through the world and plug your phone even when the power supply is different.

In .NET, Adapters will be a Class implementing a Port interface.

Ports and Adapters define not only how software can reach data storage or send a message (known as Driven/Secondary Adapters), but also how a user will interact (MVC Rest API, Blazor, WPF, Console, etc.) with the Core Application (known as Driving/Primary Adapters).

So, this Port/Adapter concept enables different adapters depending on a Port. Now, you have swappable technologies. That is a powerful idea.

![Hexagonal Architecture Sample](/images/archive/hexagonal-architecture/hexagonal-architecture-sample.png)

## ⤵️ Dependency Rule

If you think about it, **Hexagonal Architecture is mostly about the Dependency Rule**. Dependencies should point inwards.
Are you familiar with that? If you know Onion or Clean Architecture you are.

Your Core Application will have Ports and not know about the existence of Adapters. So, Adapters will depend on the Core Application.

You can configure that using Dependency Injection.

It's important to say that you can achieve Hexagonal Architecture using Projects, Components, Folders, or only files. **If you respect the Dependency Rule, Folder / Project structure doesn't matter.**

## 🌟 Wrap up

I love Hexagonal Architecture because **it is a simple concept** that can be extended as you wish. **It's more a principle than a prescriptive recipe.** The proof of the value is that **many came after and built on top of it.** Yes, I'm talking about Onion Architecture and Clean Architecture.

In short, Hexagonal Architecture leads you to software like Raviolis 🥟 instead of Lasagna. You can dress them with a different sauce, and the filling will always be protected. I have to confess that I only prefer Raviolis over Lasagna in software. What about you?

https://www.youtube.com/watch?v=5ioLmkgJ_28

Stay tuned. In this post, we talked about the concepts. Soon I will be posting a new post with a Project Structure recommendation for .NET.

Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.
