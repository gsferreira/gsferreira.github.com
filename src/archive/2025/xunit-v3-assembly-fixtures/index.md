---
layout: post
tags: post
date: 2025-12-17
title: Assembly Fixtures - The Best New Feature in xUnit v3
description: Learn how xUnit v3 Assembly Fixtures replace Collection Fixtures, enabling parallel test execution while sharing setup logic across your test assembly.
---

https://youtu.be/7YuIP8SAuw0

Your integration tests are probably slower than they need to be.

Not because of your code. Not because of your database. Because of how xUnit v2 forces you to structure shared setup logic.

Let me explain.

## The Problem With Collection Fixtures

Say you're building an API with Entity Framework and PostgreSQL. You want proper integration tests, so you spin up a real database using Testcontainers.

Smart move. Real databases catch real bugs.

Your test project has two sets of tests: one for `Projects`, one for `ToDos`. Both need the same infrastructure. A running API and database. So you create a Collection Fixture to share the setup and teardown logic.

```csharp
[CollectionDefinition("ApiTestCollection")]
public class ApiTestCollection : ICollectionFixture<ApiTestFixture> { }
```

Then you tag your test classes:

```csharp
[Collection("ApiTestCollection")]
public class ProjectControllerTests { /* ... */ }

[Collection("ApiTestCollection")]
public class ToDoControllerTests { /* ... */ }
```

This works. Your container starts once, your API spins up, everything tears down cleanly at the end.

But there's a hidden cost.

All tests in the same collection run sequentially. Even if your `ToDo` tests and `Project` tests touch completely different data, they queue up and wait for each other.

You've accidentally serialised your entire test suite.

On small projects, you won't notice. On larger ones, you're watching minutes tick by while tests that could run in parallel sit idle.

## Assembly Fixtures Fix This

xUnit v3 introduces Assembly Fixtures. They do exactly what the name suggests: run setup once per test assembly, without forcing tests into a shared collection.

Here's the migration:

First, delete your collection definitions. You don't need them anymore.

Then add a single line to your fixture class:

```csharp
[assembly: AssemblyFixture(typeof(ApiTestFixture))]
```

That's it.

The constructor (or `InitializeAsync`) runs once before any test. The `Dispose` (or `DisposeAsync`) runs once after all tests complete.

And because you're no longer grouping tests into a collection, parallel execution works again.

## Using the Fixture in Tests

You inject the fixture directly into your test classes:

```csharp
public class ProjectControllerTests
{
    private readonly HttpClient _client;

    public ProjectControllerTests(ApiTestFixture fixture)
    {
        _client = fixture.CreateClient();
    }

    // Your tests here...
}
```

Same convenience. Same shared setup. No more artificial bottleneck.

## Why This Matters

Most collection fixtures I've seen in the wild should have been assembly fixtures all along. Teams use collections because they need shared setup, not because they want sequential execution. The sequential part is just an unwanted side effect.

xUnit v3 finally separates these concerns. You get shared setup without sacrificing parallelism.

If you're sitting on a test suite that takes longer than it should, this is worth the upgrade. The migration is straightforward, and the performance gains are immediate.

Your tests will thank you. So will everyone waiting for CI to finish.

👉 [Grab the full source code for free](https://gui-ferreira.kit.com/5a7c59ed36).
