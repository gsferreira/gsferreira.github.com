---
layout: post
tags: post
date: 2022-09-19
title: How to apply Hexagonal Architecture with .NET
description: A guide on how to apply Hexagonal Architecture (also known as Ports & Adapters) as a .NET Developer. By the end, you should be able to follow the same ideas and build upon this opinionated project structure.
featured_image: /images/archive/hexagonal-architecture/project-structure-sample.png
---

Hexagons, Ports, Adapters, you know all of that. What you don't know is how to put it into practice. Don't worry.

That's normal. My hundreds of hours of watching MasterChef don't make me a Chef 🧑‍🍳. But they served me well to know what a Sous Vide is.

It's what we are going to cover here. Not Sous Vide. Hexagonal Architecture. Let's focus.

If you are not familiar with Hexagonal Architecture, don't worry. I got you covered.

Take a moment to check [this post](../hexagonal-architecture-for-dotnet-developers-beginners/) or [this video](https://youtu.be/5ioLmkgJ_28) where I explain the concepts. Go and make sure you get back here. This party can't continue without you. 🥳

In this blog post, we will look at the Project Structure for a .NET Solution following Hexagonal Architecture.

For the sake of the exercise, we will be imagining a Book Tracking API that needs to store data on [PostgreSQL](https://www.postgresql.org/) and publish events to [Apache Kafka](https://kafka.apache.org/) every time a book is read.

Let's start?

## ⚠️ Disclaimer

If you think about it, Hexagonal Architecture is mostly about the Dependency Rule. Dependencies should point inwards.

Knowing that I have an important disclaimer to make. Here it goes.

This post may be about how to structure your solution using Hexagonal Architecture, but **this is not the only way**.
You can achieve Hexagonal Architecture using Projects, Components, Folders, or only files. As far as you respect the dependency rule. Let me say again. **The Folder / Project structure doesn't matter. As far as you respect the dependency rule.**

What you find here is my recommended approach. Knowing that Hexagonal Architecture will be most useful on complex projects. But also knowing that mistakes happen. And not every team has a squad of experts or ninjas 🥷 (unless it's a Japanese company). This is a highly opinionated post based on my experience.

## 🏗️ Structuring your Project

### 🛣️ Approach

As I said, Project and Folder structure doesn't matter, but I prefer to use different projects for the Core Application (the Hexagon) and each Adapter technology.

Why? Not because I like to wait for my IDE to load the solution, but because **with different projects in .NET it becomes easier to enforce the dependency rule**.

How?

- You can easily spot new references on a ".csproj" file during code review;
- You can write some architecture/structure tests;
- Circular dependencies will be denied by default.

You may have noticed that I said: "**each** Adapter" above. Yes, I mean one project per technology Adapter.

In Hexagonal Architecture, **Adapters should not know each other.** Only then it's possible to swap Adapters with confidence. One at a time. So, you don't want your API Adapter calling on your PostgreSQL adapter once a call is received. Your Core Application should always mediate that.

### 📦 Application Core Project

In the center of your application, you will have your Core. The Core doesn't depend on anything. No Adapters or Technologies are known.
**The Application Core (aka Hexagon) will host all business logic and Ports.**

_Note: You may reference utility libraries for sure._

So, we create one project on the Core?!
Yes and No. **Hexagonal Architecture says nothing about how the Core should be structured**. We only know that the Core exposes Ports to the outside world. Beyond that is up to you.

Often, 1 is enough (Core). If you want to follow an approach more in line with DDD, you may want to have 2 ("_Core.Application_"" and "_Core.Domain_"). I prefer to start with Core and only split if I have a strong Domain or I need to share Domain concepts with other applications.

_Note: Make sure that you use the Public accessor modifier carefully. Everything you expose becomes a contract with your adapters._

### 🔌 Adapter Project

You need to identify the Primary/Driving Adapters and the Secondary/Driven Adapters.

Primary/Driving Adapters are all those Adaptors that enable an actor to communicate with the Core Application through a given port. Examples: REST API, Web Client, CLI, Message Handler, etc.

Secondary/Driven Adapters are all those Adapters that the Core Application calls to communicate with the outside world. Examples: Database, Message Bus, SMTP Server, etc.

**Identify those Technologies/Delivery Mechanisms and create a project per each.** To me, this is the right balance between too many projects and too few to implement Hexagonal Architecture.

Make sure you follow a convention when naming Adapters. It's important that when we see an Adapter, we understand his role in a fraction of a second. As explained in [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html).

If we think about our scenario, we know that we have an **API** that needs to store data on **PostgreSQL** and publish events to **Kafka**, so our adapters will be:

1. Driving Adapters
   - API
2. Driven Adapters
   - PostgreSQL
   - Kafka

Done ✅

### 🧪 The most important part: Tests

One of the Goals of Hexagonal Architecture is to facilitate tests. So, **It is not Hexagonal Architecture until you have a Test suite in place**.
There's even a rule I like by Alistair: _"1 Port. 2 Adapters."_. What does that mean? It means that each port should always have 1 Adapter for Testing.

Knowing that you should create one Testing Project for your Core and one per Adapter.

If you want to go deeper on a Testing Strategy, watch my talk at [NDC Porto 2022](https://youtu.be/gHSpj2zM9Nw).

### 👀 Show me the code! Or show me the Hexagon!

What would that solution look like?

Something along the following lines:

- src
  - src / Core
    - src / Adapters / API
    - src / Adapters / Kafka
    - src / Adapters / PostgreSQL
- test
  - test / Core Tests
    - test / Adapters / Kafka Tests
    - test / Adapters / PostgreSQL Tests
    - test / Adapters / API Tests

So, let's run the following script using [dotnet CLI](https://learn.microsoft.com/en-us/dotnet/core/tools/).

```bash
dotnet new sln

dotnet new classlib -n Core -o src/Core
dotnet new xunit -n Core.Tests -o test/Core.Tests
dotnet add test/Core.Tests/Core.Tests.csproj reference ./src/Core/Core.csproj
dotnet sln add src/Core
dotnet sln add test/Core.Tests

dotnet new webapi -n Adapter.Api -o src/Adapter.Api
dotnet new xunit -n Adapter.Api.Tests -o test/Adapter.Api.Tests
dotnet add test/Adapter.Api.Tests/Adapter.Api.Tests.csproj reference ./src/Adapter.Api/Adapter.Api.csproj
dotnet add src/Adapter.Api/Adapter.Api.csproj reference ./src/Core/Core.csproj
dotnet sln add src/Adapter.Api
dotnet sln add test/Adapter.Api.Tests


dotnet new classlib -n Adapter.Kafka -o src/Adapter.Kafka
dotnet new xunit -n Adapter.Kafka.Tests -o test/Adapter.Kafka.Tests
dotnet add test/Adapter.Kafka.Tests/Adapter.Kafka.Tests.csproj reference ./src/Adapter.Kafka/Adapter.Kafka.csproj
dotnet add src/Adapter.Kafka/Adapter.Kafka.csproj reference ./src/Core/Core.csproj
dotnet sln add src/Adapter.Kafka
dotnet sln add test/Adapter.Kafka.Tests

dotnet new classlib -n Adapter.PostgreSQL -o src/Adapter.PostgreSQL
dotnet new xunit -n Adapter.PostgreSQL.Tests -o test/Adapter.PostgreSQL.Tests
dotnet add test/Adapter.PostgreSQL.Tests/Adapter.PostgreSQL.Tests.csproj reference ./src/Adapter.PostgreSQL/Adapter.PostgreSQL.csproj
dotnet add src/Adapter.PostgreSQL/Adapter.PostgreSQL.csproj reference ./src/Core/Core.csproj
dotnet sln add src/Adapter.PostgreSQL
dotnet sln add test/Adapter.PostgreSQL.Tests

```

Now, our solution looks like this:

![Hexagonal Architecture - .NET Project Structure](/images/archive/hexagonal-architecture/project-structure-sample.png)

### ⚠️ The host problem

Once you start adding your ports and configuring the Dependencies, you will see that your startup project will depend on many projects.

As I explained, Adapters should not know each other. That can be hard for your application Host / [Main Component](https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/ch26.xhtml) / [Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/) / Startup. **That project needs to perform the Dependency Configuration, so it needs to know the other projects.** We know that when we create an MVC project, as an example, the startup code will be there. That can make our life harder.

There are a few options to accomplish that, but they bring an extra level of complexity to the solution. I will reserve that for another post. I promise, my friend. In the meanwhile, you can either:

- Extract the logical part of your host, like Controllers, to a different adapter;
- Load dependencies through dynamic assembly loading 🤢;
- or you simply be extra careful with dependencies on the Host project and treat it as an adapter.

### Wrap up

I hope you find this post useful and that it contributed to a clear vision of what Hexagonal Architecture is.

Before you go, I have to say this once again: It's not about the Projects. It's about the Dependency Rule.

Let me know if you want to see more about Hexagonal Architecture. You can find me on [Twitter (@gsferreira)](https://twitter.com/gsferreira).

I will see you soon. In the meanwhile, just keep things simple.
