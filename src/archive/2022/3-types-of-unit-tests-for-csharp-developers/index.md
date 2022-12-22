---
layout: post
tags: post
date: 2022-12-22
title: 3 Types of Unit Tests (for C# Developers)
description: Tests can be of one of these types. Knowing them shapes how to approach testing and how you decide on your assertions. In this video, we will use C# to find those 3 types of Unit Tests.
---

You can group your unit tests into 3 types. Knowing those 3 types will guide you to simple and maintainable tests.

Those types are based on the outcome the test wants to assert.

They are **Result**, **State**, and **Component Interaction**.

Let's see it in action.

## 1️⃣ Result

A Result Test is when a **test asserts a behavior based on the result value or exception**.

This is the most common type of test.

```csharp
[Fact]
public void Result()
{
    TextTools.CountWords("Hello World")
        .Should().Be(2);
}
```

## 2️⃣ State

A State Test is when **to assert a behavior after calling a method, needs to assert state changes on an object**.

It's usual to see this type of test when facing strong domain models.

```csharp
[Fact]
public void State()
{
    var order = new Order();

    order.AddProduct(new Product("Shoes", 50), 2);
    order.AddProduct(new Product("T-Shirt", 10), 1);

    order.TotalAmount.Should().Be(110);
}
```

## 3️⃣ Component interaction

A Component Interaction Test is **when the outcome of a behavior it's indirectly observed by observing the impact on external dependencies**.

This type of test is common when testing Services or Command Handlers that need to call underlying data stores.

```csharp
[Fact]
public async Task ComponentInteraction()
{
    var fakeOrderRepository = new FakeOrderRepository();
    var service = new OrderService(fakeOrderRepository);

    var order = new Order(2);
    await service.ProcessNewOrder(order, default);

    var result = await fakeOrderRepository.GetAsync(order.Number);
    result.Should().NotBeNull();
}
```

But Component Interaction Tests can be dangerous.
So, I highly recommend checking [this article](../how-structure-sensitive-tests-make-refactorings-fail/).

Let me know what you think about it. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Just keep things Simple 🌱
