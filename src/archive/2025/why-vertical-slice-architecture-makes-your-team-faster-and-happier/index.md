---
layout: post
tags: post
date: 2025-05-22
title: Why Vertical Slice Architecture Makes Your Team Faster (and Happier)
description: Vertical Slice Architecture benefits - faster teams, reduced coupling, feature-focused development over layered approaches.
featured_image: /images/archive/highlight/why-vertical-slice-architecture-makes-your-team-faster-and-happier.jpg
---

https://youtu.be/caxS7806es0?si=L2pher4NFEVgW38f

Let's talk about **Vertical Slice Architecture** – an increasingly loved way to structure your software so your dev team stops stepping on each other's toes.

This isn't just another architectural pattern to make things *look* cleaner. This is about solving real, everyday pain: merge conflicts, [high coupling](/archive/2025/coupling-and-cohesion-in-software-engineering/), and onboarding devs without triggering their existential crisis.

Sound familiar? Keep reading.

---

## The Problem with "Traditional" Layered Architectures

You know the drill. Your architecture looks like this neat diagram with layers:

* API
* Application / Use Cases
* Domain
* Infrastructure

![Clean Architecture Projects](/images/archive/architecture/diagrams/clean-architecture-projects.png)

It's elegant. It's "Clean Architecture." But here's the catch: elegant doesn't always mean practical.

The typical request flow in this kind of architecture goes something like this: API receives the request and then forwards it to application services/use cases, which may interact with the domain and infrastructure. You get a round trip back for the reply.

![Clean Architecture Request flow](/images/archive/architecture/diagrams/clean-architecture-request-flow.png)

### Real-world issue:

Let’s say you’re onboarding a new dev. They open your project, see the rigid layering and either:

* a) Ask you 42 questions
* b) Write a quick query that totally skips your "clean" structure
* c) Both

And honestly? If it’s a simple DB query… maybe that’s fine.

According to Clean Architecture, this might be “wrong” — but if it works, and it’s fast, devs will take the shortcut.

Now add in **CQRS** (Command Query Responsibility Segregation), where commands and queries are separated. Suddenly, layering feels less like organisation and more like friction.
After a while, as your app keeps growing with more features, you'll notice your team often works on the same files (grouped by repositories or services). This creates extra headaches when merging code, and since you're modifying existing files to add features, the risk of breaking things is high if you don't have proper testing.

---

## What Is Vertical Slice Architecture?

In short: Vertical Slice Architecture is **Organise your app by feature**, not by layer.  
Think "package-by-feature" on steroids.

As far as I know, this concept was first introduced by [Jimmy Bogard at an NDC Conference](https://youtu.be/SUiWfhAhgQw?si=luFEEiJgkKSVM5Op) (look it up, it's gold).

Vertical Slice Architecture applies to an application, not a system as a whole, and consists of two main components:
- An approach to organising your files
- An approach to handling your requests

📦 Each *slice* (feature) represents a vertical cut through your app: it contains everything needed for a specific feature — the endpoint, the handler, the model and maybe the infrastructure too.

No layering constraints. No jumping across folders. Just one place to look.

> 🧠 "every request is an input, a black box, and an output"
>   That black box can be anything – it can implement different patterns, follow DDD, clean architecture, or whatever works best for that specific feature.

---

## How it works (in practice)

Vertical Slice Architecture is an approach based on the request's needs. You organise around what changes together rather than around technical concerns or horizontal layers.
You model your system around axes of change – slicing through features, domain concepts, aggregation roots, or bounded contexts. 

The goal is that you rarely change existing code; instead, you add new features without touching code that fulfils different features.

Here's how it typically looks:


### 🔹 Organise By Feature

Each feature (e.g. `CreateProject`, `ArchiveProject`, `GetToDos`) (AKA slice) can be organised in different ways, like:

- **Feature-Folder Approach:** Each feature has its own folder containing endpoint, handler, request/query, and response files
- **Self-Contained File Approach:** The entire feature lives in a single file with nested classes

The reason? It's **self-contained**. Add a feature → add a new slice. No editing old files = fewer bugs.

### 🔹 Black Box Thinking

Each request is treated as a black box.  
You can handle it however you want: Mediator, raw controllers, or even direct DB calls.

Want DDD (Domain-Driven Design) in one feature and something simpler in another? Go for it.

Jimmy suggests starting with the "dirtiest" implementation possible, then refactoring to improve your design, potentially extracting domain or infrastructure components as needed.

---

## How it looks like (an example)

Let's say you're building a task manager. You might slice your app like this:


```md
/ToDos
  /Complete 
    /CompleteEndpoint.cs
    /CompleteToDoHandler.cs
    /CompleteToDoRequest.cs
  /Create
    /CreateEndpoint.cs
    /CreateToDoHandler.cs
    /CreateToDoRequest.cs
  /Get
    /GetEndpoint.cs
    /GetToDoQueryHandler.cs
    /GetToDoQuery.cs
    /GetToDoResponse.cs
  /Domain
  /Infrastructure
  
/Projects
  /CreateProject.cs (self-contained file with nested classes)
  /ArchiveProject.cs (self-contained file with nested classes)
  
```

Notice how the ToDos slice uses a folder approach with separate files, while Projects uses a self-contained file approach.
This mixed approach is perfectly valid – each slice can be organised differently based on what makes the most sense for that feature.

---

## Perfect match for CQRS and Mediator

Why do most examples of Vertical Slice Architecture use CQRS or Mediator? Because they marry perfectly. Let's see:

- Query features don't need to follow the same structure as command features
- Commands can go through a complex pipeline, while queries can take shortcuts
- Different queries can be implemented differently

All of this is possible because each request can be handled in completely different ways.

## Benefits That Hit Hard

💥 **Low Merge Conflict Risk**  
Everyone works on their own slice. Less stepping on toes.

💥 **Fast Onboarding**  
New dev? They don't need to understand the whole system architecture first.

💥 **Flexible Implementation**  
Use Mediator or not. Go full Clean Architecture in one slice and direct DB in another. You can mix and match different architectural approaches within the same system (However, I don't recommend it 😅).

💥 **CQRS BFF**  
Queries and Commands finally get the independence they deserve.

💥 **Configure your own Slice**
Each slice can configure itself (through setup methods called from Program.cs), keeping related code together.


---

## But It's not all rainbows 🌧️

😬 Things to watch out for:

- **Inconsistent code** across features (every slice might look different)  
- **Duplication** sneaking in  
- **Longer test cycles** (integration tests over fast unit tests)  

---

## So, Should *You* Use Vertical Slice Architecture?

It depends. Is it better? No, it's different.

Here's when vertical slices start looking *very* attractive:

- ✅ Your team keeps tripping over merge conflicts  
- ✅ Every new feature means editing the same files again  
- ✅ Junior devs are overwhelmed by the current architecture  
- ✅ You want to mix different patterns (Clean, Hexagonal, etc.)  
- ✅ You're building APIs with isolated endpoints

Oh, and are you trying to implement CQRS? This plays *beautifully* with it. Commands and queries can live and evolve separately — as they should.

---

## TL;DR

- Organise by **feature**, not layer  
- Favor **independence**, not a predefined structure  
- Reduce merge conflicts
- Perfect for small-to-medium teams that value speed and clarity
- Watch out for inconsistencies and testing challenges


---

### ➕ Want to Dive Deeper?

Check out [Jimmy Bogard's talk on Vertical Slice Architecture](https://youtu.be/SUiWfhAhgQw?si=luFEEiJgkKSVM5Op). He introduced it, and he nails the explanation.

Or better yet — try slicing your next feature and see how it feels.

Next time you're adding a feature, don't dive into Services, Repos, and Validators. Just create a slice. One folder. One feature. Done.
You might never go back.
