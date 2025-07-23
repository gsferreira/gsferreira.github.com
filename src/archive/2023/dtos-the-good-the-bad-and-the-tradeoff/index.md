---
layout: post
tags: post
date: 2023-05-05
title: DTOs - The Good, The Bad, and The Tradeoff
description: DTOs analysis - when to use Data Transfer Objects, benefits vs drawbacks, and the tradeoffs between boundaries and complexity.
featured_image: /images/archive/highlight/dtos-the-good-the-bad-and-the-tradeoff.png
---

https://www.youtube.com/watch?v=aCMJWOXwT0k

Data Transfer Objects, also known as DTOs.

- Show we use them?
- Should we avoid them?
- When should we use them?

All of those are valid questions.

This article will explore the good, the bad, and the tradeoff of using DTOs.

## What is a DTO

**A DTO is a pure representation of data.**

One definition I like is [_"An object that carries data between processes to reduce the number of methods calls"_ by Martin Fowler](https://martinfowler.com/eaaCatalog/dataTransferObject.html). From this explanation, we see that a DTO lives on the boundaries of our systems.

It's important to note that DTOs are not only objects with a DTO suffix. They can also be view models, message contracts, commands, or events.

Not everybody falls in love with DTOs. Some will love them and overuse them sometimes. Others hate them and try to avoid them at all costs. The decision is a tradeoff, as are many other decisions in our field.

## The Good Parts

Let's look into the following snippet.

```csharp
namespace DTOsTradeoffs.Controllers;

[ApiController]
[Route("[controller]")]
public class TaskController : ControllerBase
{
    private readonly ILogger<TaskController> _logger;
    private readonly TasksDbContext _dbContext;


    public TaskController(ILogger<TaskController> logger, TasksDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet(Name = "GetTasks")]
    public async Task<IEnumerable<Model.Task>> Get()
    {
        return await _dbContext.Tasks.AsNoTracking().ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Post(Model.Task request)
    {
        _dbContext.Tasks.Add(request);
        await _dbContext.SaveChangesAsync();

        return Created("/", request);
    }
}
```

```csharp

namespace DTOsTradeoffs.Infrastructure;

public class TasksDbContext : DbContext
{
    public TasksDbContext(DbContextOptions<TasksDbContext> options) : base(options)
    {
    }

    public DbSet<Task> Tasks => Set<Task>();
}
```

```csharp
namespace DTOsTradeoffs.Model;

public class Task
{
    public Task()
    {
        Id = Guid.NewGuid();
    }
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
}
```

This example uses a shared representation of what a Task is. Both the Controller and Entity Framework depend on it.

One problem with using a shared representation in this example is that the API GET contract is the same as the POST contract. This means that the client can send an ID. What if the ID is system generated? That will confuse our consumers.

**That's one of the advantages of using DTOs. We can craft specific contracts per endpoint.**

The other benefit is that once I have the DTO in place, **I can change my Model without impacting my consumers**. The goal is to avoid internal implementations being a contract with the outside, so we can safely evolve and maintain them. Not only that, but DTOs avoid overexposure. And we know that **once something becomes public, it is a contract**.

Can you imagine all the pain involved in changing the name of the `Title` property in the example above?

In case you start thinking as if DTOs are just about our APIs, sorry for the misunderstanding. DTOs are also useful for our system dependencies.

Take a look at the following interface:

```csharp
namespace DTOsTradeoffs.Infrastructure;

public interface ITaskEventPublisher
{
    public Task PublishAsync(Model.Task task);
}
```

The interface implementation publishes the task as an event somewhere (Kafka, Rabbit, you name it.).

Now, imagine that once again I change the name of a property on my model. What happens to anyone consuming those events?

In a nutshell, **a DTO is extremely useful on the inbound and outbound system boundaries**.

## The Bad Parts

DTOs are extremely useful, but... there are no free lunches.

**Once I bring my DTOs into the inbound and outbound, I will have a ton of duplication.**

If I'm building a new feature that adds a new property to Tasks, now I need to go to several classes to apply this change. In the example that I have a GET Endpoint DTO, a POST Endpoint DTO, and an Event DTO, it means that I need to keep 4 classes in sync. **If I introduce duplication, I reduce maintainability.**

**The other problem with DTOs is overuse**. Have you never seen multi-layer architectures where each layer has its DTOs? I do. And let me tell you: it's no fun.

## The Tradeoff

We have concluded that using **a DTO is a tradeoff**.

On one hand, **by introducing a DTO we decrease the coupling, so we increase the maintainability**. On the other hand, **introducing a DTO, increase the duplication, so we decrease the maintainability**.

## What to do?

Don't trust anyone who says _"Always use DTOs!"_ or _"Don't use DTOs!"_. That's the biggest lesson.

So, next time, take a look into the tradeoff and evaluate complexity, third-party dependencies, risk of change, etc.

As an expensive consultant would tell you: It depends!

Keep it Simple 🌱
