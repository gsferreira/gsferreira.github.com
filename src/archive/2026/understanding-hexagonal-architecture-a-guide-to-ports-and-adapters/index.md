---
layout: post
tags: post
date: 2026-02-03
title: Understanding Hexagonal Architecture - A Guide to Ports and Adapters
description: Learn what Hexagonal Architecture is, why it's called Ports and Adapters, and how it protects your core logic from external chaos.
---

Ever had an external dependency change and suddenly half your codebase breaks? Or spent days waiting for another team to finish their piece before you could even test yours?

Been there. Done that. Got the merge conflicts.

That's exactly why Hexagonal Architecture became my go-to approach. Let me tell you how it came to be and why you should give it a chance.

https://www.youtube.com/watch?v=k_GkYMd8Ouc

---

## 📖 The origin story

Long ago, Alistair Cockburn was working on a project. The team responsible for building an object-relational mapper told him they would need to do a major refactor. Yes, we had to build those things in the past. They would basically need to rebuild everything from scratch. So it would be better for his team to take a few weeks off and get back once they had that ready.

Sounds ridiculous, right? But that moment sparked what we now call **Hexagonal Architecture** (aka Ports and Adapters).

---

## 🍝 The old way: three-layered architecture

Before Hexagonal Architecture, the **three-layered architecture** was the thing. Even nowadays, here in 2026, it's still quite popular.

The concept is simple. Three main layers:

- 🖥️ **Presentation Layer**: Everything your user interacts with. UI, APIs, whatever faces the outside world.
- 🧠 **Business Logic Layer**: The important stuff. Your business rules live here.
- 💾 **Data Infrastructure Layer**: Anything regarding data storage and retrieval.

This is the famous "lasagna" in software development. And let me tell you. It brings problems. Big ones.

Since dependencies flow from top to bottom, you create **[tight coupling](/archive/2025/coupling-and-cohesion-in-software-engineering/)** that's hard to manage. Testing in isolation? Good luck with that. Any change at the bottom sends ripple effects all the way up.

That's exactly what happened to Alistair. When upper layers depend on the layers below, you can't keep working without a stable foundation. Your team becomes hostage to someone else's timeline.

---

## 💡 A new perspective: inside vs. outside

With this incident, Alistair realised something important. Every system has two parts: the **inside** and the **outside**.

The inside is your **special sauce**. All the logic. Everything that makes your application unique. This is what you're actually building.

The outside? An unpredictable world. Dependencies changing versions you don't control. Services that might be up or down. Third-party APIs with breaking changes. Chaos.

So how do we protect our internal world from the chaos outside?

---

## 🔌 The core concept: Ports and Adapters

Here's the thing. When your code talks to a database, it follows the same pattern as talking to an API. Or a message queue. Or a file system.

This means you can create a **contract**. An abstraction for the technology on the other side. The utilisation patterns are basically the same.

We call these contracts **Ports**. A Port is an interface that lives inside your application's core. It defines *what* the application needs to do, but not *how*.

```csharp
// The Port (lives inside your hexagon)
public interface IUserRepository
{
    void Save(User user);
    User GetById(string id);
}
```

This code has no dependencies on SQL, MongoDB, or files. It's pure logic.

Once you have that port, you can connect to any technology you want. You just need an **Adapter** that translates the contract into the desired technology. Like a translation layer.

Multiple adapters can fulfil the same port, independently of how they work internally. And that's why Hexagonal Architecture is also known as **Ports and Adapters**.

Put these ports on the edges of your core application, and you protect it from the outside world.

Need to write data to MySQL? Plug in an adapter that knows the contract and converts it to SQL statements.

Want to store files on S3? Azure Blob Storage? FTP? As long as you implement an adapter that translates the contract, you're good.

```
                    ┌─────────────────────────────┐
                    │                             │
   ┌────────────┐   │   ┌───────────────────┐     │   ┌────────────┐
   │  REST API  │◄──┼──►│                   │◄────┼──►│   MySQL    │
   └────────────┘   │   │                   │     │   └────────────┘
                    │   │    Application    │     │
   ┌────────────┐   │   │      Core         │     │   ┌────────────┐
   │    CLI     │◄──┼──►│                   │◄────┼──►│    S3      │
   └────────────┘   │   │  (Special Sauce)  │     │   └────────────┘
                    │   │                   │     │
   ┌────────────┐   │   └───────────────────┘     │   ┌────────────┐
   │   Kafka    │◄──┼──►        ▲                 ├──►│   Redis    │
   └────────────┘   │           │                 │   └────────────┘
                    │         Ports               │
     Driving        │     (Contracts)             │      Driven
     Adapters       └─────────────────────────────┘      Adapters
```

### 🚗 Driving vs. driven adapters

We split adapters into two groups:

- **Driven Adapters (Secondary)**: Adapters your application uses to *produce* something. Writing to a database, sending a message, storing a file. Your application *drives* them.
- **Driving Adapters (Primary)**: Anything that interacts *with* your application. An API request, a UI, a message handler reacting to Kafka. They *drive* your application.

---

## ⬅️ The golden rule: dependencies point inwards

This is the game-changer compared to three-layered architecture.

The flow of control stays the same. Request comes in, goes through logic, hits infrastructure, replies back. But the **dependency rule is different**.

> In Hexagonal Architecture, all dependencies must point inwards, towards the core application logic.

The outside knows about the inside, but the inside knows *nothing* about the outside.

Your hexagon is unaware of the external world. It only knows it has contracts that need to be satisfied. You can plug anything into those contracts.

All your logic stays completely isolated from external chaos.

### 🔷 So, why a hexagon?

Alistair was looking for a shape that wasn't commonly used. Boxes were everywhere in system diagrams, so he landed on a hexagon.

The funny part? Nowadays hexagons are everywhere! We represent microservices with hexagons. We find inspiration in honeycombs to describe how we build software.

---

## ❤️ Why Hexagonal Architecture is my favourite

Here's why I keep coming back to it.

### 🎯 It focuses on what matters

It naturally invites you to start with what matters. Your logic, your hexagon. By doing so, you're **delaying important decisions** until you have more information.

Picking the right data store? Decide later, once you fully understand the domain. That clarity becomes contagious across your entire design process.

### 🔓 It doesn't impose rigid rules

It doesn't force a lot of rules on you. And that's a good thing.

Want to go with Domain-Driven Design? Do it. Want to [slice your application into features](/archive/2025/why-vertical-slice-architecture-makes-your-team-faster-and-happier/)? Do it. As long as you respect the basic rules, you're free.

No struggling to follow conventions that don't fit. No forcing every request through layers that don't make sense. With Hexagonal, you don't have that.

### 🧪 Superior testability

Hexagonal is designed with testing in mind. Why? Because you can test in isolation. Your hexagon can be tested without external dependencies.

This makes tests:

- 💥 **Easy to maintain**
- 💥 **Not flaky**
- 💥 **Fast to run**

All thanks to the abstraction-by-design that Hexagonal applies. Test through the ports, and you're testing through stable contracts. Everything inside the hexagon? [Implementation details that can change freely](/archive/2022/how-structure-sensitive-tests-make-refactorings-fail/).

There's a rule I like to follow: **one port, two adapters**. For each port, have at least two adapters. One real implementation, one for testing.

Why does this matter? If you can swap your database for a fake object during tests, you have proven that your logic is independent of your infrastructure.

```csharp
// The Port (Contract)
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id);
    Task SaveAsync(Order order);
}

// Driven Adapter: Real Implementation
public class SqlOrderRepository : IOrderRepository
{
    private readonly DbContext _context;

    public async Task<Order?> GetByIdAsync(Guid id)
        => await _context.Orders.FindAsync(id);

    public async Task SaveAsync(Order order)
        => await _context.Orders.AddAsync(order);
}

// Driven Adapter: Test Implementation
public class InMemoryOrderRepository : IOrderRepository
{
    private readonly Dictionary<Guid, Order> _orders = new();

    public Task<Order?> GetByIdAsync(Guid id)
        => Task.FromResult(_orders.GetValueOrDefault(id));

    public Task SaveAsync(Order order)
    {
        _orders[order.Id] = order;
        return Task.CompletedTask;
    }
}
```

### 🛡️ Tool independence

Every technology you depend on becomes easy to swap.

I know. Changing databases is rare. But let me share a real-world story.

I used to work at a company where we started a service with the data technology we knew. But as scale grew and data volume exploded, things took too long. We had to pick a different technology.

The fact that all database code lived in an adapter made the process simple. Some contract changes, sure, but they were small.

The way I see it: it might not be common, but it's like **insurance**. And this insurance pays off every single time you test. Because when you test, you're already swapping the production technology with a test double. A fake, a mock, whatever.

You're *already* swapping technologies for the sake of testing.

---

## 🔷 Hexagonal vs. Clean Architecture

One more thing. Nowadays it's common to reach for Clean Architecture for everything. But it's not always the best option.

Here's the thing. Hexagonal Architecture is in the roots of Clean Architecture. If you look at Robert C. Martin's Clean Architecture circles, it's essentially the same concept. Dependencies pointing inwards, protecting the entities and use cases from the frameworks and drivers.

If you want to dive deeper into that relationship, check out [my video on the real essence of Clean Architecture](https://www.youtube.com/watch?v=IV858u28JX0).

---

## 📚 Want to go deeper?

If you're a .NET developer and want to see this in practice, I've written a few posts that might help:

- [Hexagonal Architecture for .NET Developers (Beginners)](/archive/2022/hexagonal-architecture-for-dotnet-developers-beginners/)
- [How to apply Hexagonal Architecture with .NET](/archive/2022/how-to-apply-hexagonal-architecture-with-dotnet/)

---

## TL;DR

- 💡 Hexagonal Architecture separates your core logic from external chaos
- 🔌 **Ports** are contracts. **Adapters** translate those contracts to real tech
- ⬅️ Dependencies always point inwards towards the core
- 🧪 Testing becomes trivial. Swap real adapters for test doubles
- 🛡️ It's insurance that pays off every time you test
- 🎯 Start with your logic, delay technology decisions

Next time you're designing a system, don't let external dependencies dictate your architecture. Build your hexagon first. Protect your special sauce.

You might never go back.
