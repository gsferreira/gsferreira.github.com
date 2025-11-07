---
layout: post
tags: post
date: 2025-11-07
title: xUnit v3's CaptureConsole Will Save You Hours of Debugging Hell
description: Stop guessing why your integration tests fail. xUnit v3's CaptureConsole shows you console output in test results - but you'll need extra setup for logging frameworks.
---

https://www.youtube.com/watch?v=LC1nukDZNN8&t=1s

Your integration test fails at 3am in CI.

The error? `Assert.Equal() Failure`
No logs. No context. Just pain.

So you add `Console.WriteLine` everywhere like a caveman. You re-run it locally. Can't reproduce it. You stare at the screen. Nothing.

Sound familiar?

Here's the thing: xUnit v3 has a feature that helps. One line of code captures **all your console output** right in your test results.

But there's a catch. And it's important.

*Note: CaptureConsole is an xUnit v3 feature. If you're on v2, you'll need to migrate first - it's a different package (`xunit.v3`). See the [official migration guide](https://xunit.net/docs/getting-started/v3/migration).*

---

## How It Works (And What It Actually Captures)

Add this to your test project:

```csharp
[assembly: CaptureConsole]
````

Now xUnit intercepts everything written to `Console.WriteLine`, `Console.Error.WriteLine`, and similar console methods.

When your test fails, you see all that output. No extra setup.

You can also control what gets captured:

```csharp
// Both standard output and standard error (default)
[assembly: CaptureConsole]

// Only standard output
[assembly: CaptureConsole(CaptureError = false)]

// Only standard error
[assembly: CaptureConsole(CaptureOutput = false)]
```

**But here's the critical bit:** CaptureConsole only captures direct console writes. 

---

## Why You're Still Not Seeing Logs

Let's say your API controller logs an error:

```csharp
_logger.LogError("Order validation failed");
```

CaptureConsole won't capture that. To see those logs, you need to explicitly configure console logging:

```csharp
builder.Logging.AddConsole(); // Now CaptureConsole can intercept it
```

Or use `ITestOutputHelper` to capture logs directly:

```csharp
// Requires: dotnet add package MartinCostello.Logging.XUnit.v3
builder.Logging.AddXUnit(testOutputHelper);
```

The second approach is more reliable because it sidesteps threading issues (more on that in a sec).

---

## What You'll Actually See

With CaptureConsole enabled **and** logging configured properly, a failed test shows:

```
Expected: Created
Actual: OK

--- Console Output ---
Starting API request
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (5ms)
fail: MyApp.Services.OrderService[0]
      External API returned 500
```

Without the logging configuration? You just get the assert failure. Nothing else.

---

## The Threading Gotcha

CaptureConsole only captures output from the test's thread.

Background threads? Ignored.
ASP.NET Core TestServer threads? Ignored.
Worker threads? Ignored.

For integration tests where your API runs on separate threads, you might miss critical logs.

---

## When CaptureConsole Actually Helps

It's brilliant for:

* Legacy code that writes to console
* Third-party libraries you can't modify
* Quick debugging when you add `Console.WriteLine` calls

---

## Pro Tips

**Turn it on when debugging:**

```csharp
[assembly: CaptureConsole]
```

**Configure logging to write to console:**

```csharp
builder.Logging.AddConsole(); // Makes logs visible to CaptureConsole
```

**Or route logs directly to test output:**

```csharp
// Requires: dotnet add package MartinCostello.Logging.XUnit.v3
builder.Logging.AddXUnit(testOutputHelper); 
```

**Remove CaptureConsole when you're done.** Otherwise your test output becomes a novel.

---

## The Bottom Line

CaptureConsole is useful, but it's not magic.

It captures console writes. That's it.

For simple debugging? It's great.