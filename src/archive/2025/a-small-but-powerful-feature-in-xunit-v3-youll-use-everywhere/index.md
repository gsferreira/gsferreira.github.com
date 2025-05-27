---
layout: post
tags: post
date: 2025-05-27
title: A Small but Powerful Feature in xUnit v3 You’ll Use Everywhere
description: Discover what's new in xUnit v3 for .NET testing, including powerful test-aware cancellation tokens. Learn how this simple yet impactful feature boosts test reliability, resource management, and async integration testing.
---

https://youtu.be/XwW0SbNU-2o?si=MdXJN08cG55suPHI

Have you heard about xUnit v3? If not, now’s the time to get familiar with it, especially if you're writing tests in .NET regularly. The latest version introduces several exciting features, and one, in particular, stands out for how simple yet impactful it is: test-aware cancellation tokens.

It’s the kind of feature you’ll quickly start using in every async test.

## The Problem: Default Cancellation Tokens

Let’s look at a common testing scenario. You’re testing an asynchronous method, such as a POST call to an API:

```csharp
// xUnit v2
[Fact]
public async Task Should_create_project()
{
    // Arrange
    var project = new Project {};

    // Act
    var response = await client.PostAsJsonAsync("/api/projects", project, default);

    // Assert
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
}
```

See that last parameter, `default`? It’s the `CancellationToken`.  We often pass `default` or omit it entirely when it’s optional. Why? Because in most tests, we’re not interested in simulating cancellation.

But here’s the thing: using default gives us no real value. It doesn’t help us simulate what happens if a test is cancelled mid-execution or if resources need to be cleaned up properly when aborted.

## The New Approach in xUnit v3

xUnit v3 changes that.

With v3, you can now access the CancellationToken directly from the test context:

```csharp
// xUnit v3
[Fact]
public async Task Should_create_project()
{
    // Arrange
    var project = new Project {};

    // Act
    var response = await client.PostAsJsonAsync(
        "/api/projects", 
        project, 
        TestContext.Current.CancellationToken
    );

    // Assert
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
}
```

That’s it. Swap `default` with `TestContext.Current.CancellationToken`.

## Why It Matters

Imagine a long-running integration or end-to-end test. It’s writing to a test database, calling APIs, and maybe even spinning up containers. Now imagine something goes wrong, the test runner is stopped or crashes. That test may still be holding onto resources unnecessarily.

With the new CancellationToken, stopping the test triggers cancellation through the entire async chain. Your code can then react appropriately, e.g., cleaning up connections, aborting external calls, or releasing database locks.

This is test resilience done right.

> ✅ You start treating your test infrastructure with the same respect you treat your production infrastructure.

## When Should You Use It?
- Always, when passing a CancellationToken in tests
- When writing async integration or end-to-end tests
- When dealing with external dependencies (e.g. APIs, queues, databases)

In fact, once you start using it, you’ll wonder why this wasn’t the standard all along.

## One More Thing…

I recently did a [video with Nick Chapsas](https://youtu.be/qIMRFKHldvQ?si=Mk0CAVVvlJSxQ9GA) covering all the features in xUnit v3, if you want a high-level overview, check it out.

But if you’re after practical examples like this one, stay tuned. More v3 deep dives are coming soon.