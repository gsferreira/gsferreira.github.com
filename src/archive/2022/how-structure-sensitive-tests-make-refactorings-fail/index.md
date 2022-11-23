---
layout: post
tags: post
date: 2022-11-23
title: How Structure Sensitive Tests Make Refactorings Fail
description: This is one of the most common mistakes, that cause breaking tests on refactoring. In this post, we will see how to build structure-insensitive tests, one of the key properties of a good test.
featured_image: /images/archive/testing/structure-sensitive-tests.png
---

**Why do most refactoring attempts fail?**

You refactor your code, and hundreds of tests go Red.

Even then, you know that the system is still working as expected. You didn't change its behavior.

This is when developers start mistrusting tests.

And **it all happens due to Structure Sensitive Tests**.

## Structure Sensitive Tests

Take a look at the following code.

```csharp
public interface IPremiumClientDiscountCalculator
{
    public decimal Calculate(decimal totalValue);
}

class PremiumClientDiscountCalculator : IPremiumClientDiscountCalculator
{
    public decimal Calculate(decimal totalValue)
    {
        return totalValue >= 1000 ? .12M : .10M;
    }
}

public class OrderDiscountCalculator
{
    private readonly IPremiumClientDiscountCalculator _premiumClientDiscount;

    public OrderDiscountCalculator(IPremiumClientDiscountCalculator premiumClientDiscount)
    {
        _premiumClientDiscount = premiumClientDiscount;
    }

    public decimal Calculate(Order order)
    {
        if (order.Client.Tier is Client.Tiers.Premium)
            return _premiumClientDiscount.Calculate(order.Total);
        return (decimal)0.12;
    }
}
```

Now consider the following test.

```csharp
[Fact]
public void GivenPremiumClientAndTotalAbove1000_ThenReturns12PercentDiscount()
{
    var premiumClientDiscountMock = new Mock<IPremiumClientDiscountCalculator>();
    premiumClientDiscountMock.Setup(m => m.Calculate(It.IsAny<decimal>()))
        .Returns(.12M)
        .Verifiable();
    var calculator = new OrderDiscountCalculator(premiumClientDiscountMock.Object);
    var order = new Order()
    {
        Client = new Client { Tier = Client.Tiers.Premium },
        Total = 1001
    };

    var discount = calculator.Calculate(order);

    discount.Should().Be(.12M);
    premiumClientDiscountMock.VerifyAll();
}
```

Did you notice the `Verify` on the test? That `Verify` ensures that the Mock is being used.

If you decide to refactor the implementation and copy the Premium Discount Logic into the Calculator, like this:

```csharp
public class OrderDiscountCalculator
{
    private readonly IPremiumClientDiscountCalculator _premiumClientDiscount;

    public OrderDiscountCalculator(IPremiumClientDiscountCalculator premiumClientDiscount)
    {
        _premiumClientDiscount = premiumClientDiscount;
    }

    public decimal Calculate(Order order)
    {
        if (order.Client.Tier is Client.Tiers.Premium)
            return order.Total >= 1000 ? .12M : .10M;
        return (decimal)0.12;
    }
}
```

Once we run the tests, what do you think will happen? This time they will fail.

The problem is not that they fail. The problem is that they fail but not because the system is wrong.

## Structure Insensitive Tests

As you know, **a refactor shouldn't break tests**.

Tests should be sensitive to behavior and not structure.

And how to do that? You avoid any checks related to the underlying implementation and you focus on the behaviour.
So, we can instead write a test focused only on the behaviour, as the following:

```csharp
[Fact]
public void GivenPremiumClientAndTotalAbove1000_ThenReturns12PercentDiscount()
{
    var calculator = new OrderDiscountCalculator();
    var order = new Order()
    {
        Client = new Client { Tier = Client.Tiers.Premium },
        Total = 1001
    };

    var discount = calculator.Calculate(order);

    discount.Should().Be(.12M);
}
```

And you can refactor your code like this:

```csharp
public class OrderDiscountCalculator
{
    private readonly PremiumClientDiscountCalculator _premiumClientDiscount
        = new ();
    public decimal Calculate(Order order)
    {
        if (order.Client.Tier is Client.Tiers.Premium)
            return _premiumClientDiscount.Calculate(order.Total);
        return .05M;
    }
}
```

As you can see, now the test succeed. We don't use mocks. The `PremiumClientDiscountCalculator` is an internal design decision, that has no impact on the behaviour. Now, we can refactor the Calculator as we wish.

**Structure Insensitive is one of the key properties of a good test.**

Readability is another, so you may want to take a look at [this post](../the-missing-project-that-fixes-everything-in-dotnet/).

And remember that when you test internal or private classes/methods, you are likely making your tests Structure Sensitive.

Let me know what you think about it. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Just keep things Simple 🌱
