---
layout: post
tags: post
date: 2023-04-06
title: Why I Don't Use Loops on My Tests
description: Eliminate loops from test code - apply Zero, One, or Many testing principle for clearer, more maintainable unit test cases.
featured_image: /images/archive/highlight/dont-use-loops-on.png
---

https://www.youtube.com/watch?v=NJ07Ly0XfLA

Ditch the Fors, Foreachs, Whiles, and so on. Why? Because **I avoid iterating on tests**. The secret lies in the power of Zero, One, or Many. Intrigued? Let's dive in and explore this approach.

## 🔄 The Problem

In this scenario, we'll demonstrate the impact of writing loops in your tests and how you can achieve the same results without resorting to loops.

Let's start by examining the code under test.

We'll use a straightforward scenario to illustrate how people typically write tests with Fors, Whiles, and Foreachs, and then demonstrate how we can rewrite these tests to avoid such loops.

```csharp
public class Order
{
    public IList<OrderItem> Lines { get; set; } = new List<OrderItem>();

    public OrderItem? MostExpensive()
        => Lines.MaxBy(item => item.Amount);

    public OrderItem? Cheapest()
        => Lines.MinBy(item => item.Amount);
}

public class OrderItem
{
    public string Name { get; set; }
    public double Amount { get; set; }
}

```

Our example involves an object containing a list of lines.

The Order Lines possess certain functions (`MostExpensive` and `Cheapest`) that allow us to extract data from them, and it's these functions that we'll be testing.

In the example, we have a basic collection. A list of order lines. An order line is a simple object consisting of a name and an amount.

Our goal is to implement two functions: one to return the most expensive item in the order and another to return the least expensive item in the same order.

Now, let's take a look at the test cases.

```csharp
public class NoLoopTests
{
    [Fact]
    public void Given10Items_WhenGetMostExpensiveItem()
    {
        var order = new Order();
        for (var i = 1; i <= 10; i++)
            order.Lines.Add(new OrderItem() { Name = $"PRODUCT-{i}", Amount = i });

        Assert.Equal(10, order.MostExpensive()!.Amount);
    }

    [Fact]
    public void Given10Items_WhenGetCheapestItem()
    {
        var order = new Order();
        for (var i = 1; i <= 10; i++)
            order.Lines.Add(new OrderItem() { Name = $"PRODUCT-{i}", Amount = i });

        Assert.Equal(1, order.Cheapest()!.Amount);
    }
}
```

Often, when creating tests, it's necessary to set up a collection to perform the test. In the Arrange phase, you'll manipulate a list, populating it with data to test your methods. That's what's happening here.

I have two simple use cases here to demonstrate the approach most take when writing these tests. In this scenario, I create an order and iterate through a list of numbers from 1 to 10. I then populate the order lines with a new order, assigning a given name and an amount. Afterward, I assert that if I'm iterating from 1 to 10, the most expensive item should be 10.

Conversely, when seeking the cheapest one, I follow the same process. By the end, I call the function to find the cheapest item, which should have 1 as the amount, since I start with an index of 1.

Upon running these tests (`dotnet test`), we can see that they are successful. 🟢

Using [Striker.NET](https://stryker-mutator.io/docs/stryker-net/introduction/) to evaluate the tests, we observe that they are in good shape.

```bash
dotnet stryker
```

For those unfamiliar with [Striker.NET](https://stryker-mutator.io/docs/stryker-net/introduction/), it's an impressive [mutation testing](https://en.wikipedia.org/wiki/Mutation_testing) tool for .NET. You can find a [video here](https://www.youtube.com/watch?v=sGwfwtkaDfk) by [Nick Chapsas](https://dometrain.com/author/nick-chapsas/), which thoroughly explains its capabilities.

After running Striker, the results indicate a final mutation score of 100, which means the tests are performing exactly as intended, ensuring nothing has been overlooked in the testing process.

**Why would I avoid writing tests like these if they are effective?**

## ↗️ No Loops

To demonstrate the difference between using a loop and not using one, I will duplicate one of these tests and place them side by side.

Before rewriting the test, it's important to understand that when testing collections, we typically only need to test three scenarios:

- Zero
- One
- Two (which represents 'many' in the scenarios we're considering)

**Instead of iterating through 10 items, we can simply test with two.** While it may be tempting to refactor the existing test, it's more effective to simplify it. With only two items, we can easily rewrite the test to include the two lines of code corresponding to the desired values.

```csharp
public class NoLoopTests
{
    // [Fact]
    // public void Given10Items_WhenGetMostExpensiveItem()
    // {
    //     var order = new Order();
    //     for (var i = 1; i <= 10; i++)
    //         order.Lines.Add(new OrderItem() { Name = $"PRODUCT-{i}", Amount = i });

    //     Assert.Equal(10, order.MostExpensive()!.Amount);
    // }

    [Fact]
    public void Given2Items_WhenGetMostExpensiveItem()
    {
        var order = new Order();
        order.Lines.Add(new OrderItem() { Name = "PRODUCT-1", Amount = 1 });
        order.Lines.Add(new OrderItem() { Name = "PRODUCT-2", Amount = 10 });

        Assert.Equal(10, order.MostExpensive()!.Amount);
    }

    // ...
}
```

In this case, we expect an outcome of 10. To test this, we can simply input 10 and run the test.

The results show that both tests are successful, but the simplified version is more descriptive and easier to understand. **This reduced cognitive load is important, as it allows for a clearer view of the test's purpose**. When writing tests, **aim for a cyclomatic complexity of one, avoiding the use of loops and conditional statements** whenever possible.

You might wonder if the simplified test is truly equivalent to the original. To prove it, let's comment out the first test, duplicate the test for the cheapest item, and apply the same simplification strategy. We'll convert the loop into direct calls to add lines.

```csharp
public class NoLoopTests
{
    // ...

    // [Fact]
    // public void Given10Items_WhenGetCheapestItem()
    // {
    //     var order = new Order();
    //     for (var i = 1; i <= 10; i++)
    //         order.Lines.Add(new OrderItem() { Name = $"PRODUCT-{i}", Amount = i });

    //     Assert.Equal(1, order.Cheapest()!.Amount);
    // }

    [Fact]
    public void Given2Items_WhenGetCheapestItem()
    {
        var order = new Order();
        order.Lines.Add(new OrderItem() { Name = "PRODUCT-10", Amount = 1 });
        order.Lines.Add(new OrderItem() { Name = "PRODUCT-30", Amount = 30 });

        Assert.Equal(1, order.Cheapest()!.Amount);
    }
}
```

With these two tests in place and the original ones commented out, let's run Stryker.NET once again.

The results confirm that the mutation score remains at 100%. This indicates that the simpler code achieves the same outcomes as the more complex version.

**The streamlined test is cleaner and easier to understand, saving time and mental effort.** So, the next time you're about to use a loop or conditional statement in your test code, pause and consider this approach with just two entries. **You might find that it's equally effective while reducing cognitive load.**

Another technique to minimize test complexity is to avoid over-applying the DRY (Don't Repeat Yourself) principle. To learn more about striking the right balance, check out [this article](../../2022/how-dry-can-damage-your-tests/).

Until next time, remember to keep your test code simple and straightforward.

Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Keep it Simple 🌱
