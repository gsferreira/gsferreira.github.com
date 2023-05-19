---
layout: post
tags: post
date: 2023-05-19
title: Discover an Easy Trick to Simplify Your C# Test Assertions!
description: Crafting Elegant Test Assertions with Domain-Specific Concepts and Fluent Assertions
featured_image: /images/archive/highlight/discover-an-easy-trick-to-simplify-your-csharp-test-assertions.png
---

https://www.youtube.com/watch?v=vERw8hyTiQk

Can we all agree that this test assertion is beautiful and easy to read?

```csharp
var order = new Order(1);

order.AddProduct(new Product("Shoes", 50), 2);
order.AddProduct(new Product("T-Shirt", 10), 1);

order
    .Should().NotBeNull();

order
    .Should()
    .ContainProduct("Shoes", 2)
    .And
    .ContainProduct("T-Shirt", 1);
```

But how can we reach this level of clarity when starting from something like this?

```csharp
var order = new Order(1);

order.AddProduct(new Product("Shoes", 50), 2);
order.AddProduct(new Product("T-Shirt", 10), 1);

order.Lines.Should().NotBeEmpty();
order.Lines.Should()
    .Contain(line=> line.Product.Name == "Shoes")
    .Which
    .Quantity.Should().Be(2);
order.Lines.Should()
    .Contain(line=> line.Product.Name == "T-Shirt")
    .Which
    .Quantity.Should().Be(1);
```

The key to achieving this lies in **expressing the assertion using domain-specific concepts**. Once you have figured out the domain-specific expression, it's just a matter of implementing it using your assertion library.

As a huge fan of [Fluent Assertions](https://fluentassertions.com/), I can vouch for its high accessibility, making it the perfect choice for crafting elegant and easy-to-read test assertions.

In this example, we will refactor a test assertion to simplify its various components. The test uses [xUnit.net](https://xunit.net/) and has a model containing an Order, Order Line, and Product. The test ensures that when the `AddProduct` method is called within the Order, each product is correctly added as an order line with the appropriate quantity. The complex assertion shown checks the lines for a specific product name and verifies the corresponding quantity is accurate.

```csharp
public class Order
{
    public Order(int number)
    {
        Number = number;
    }
    private readonly List<OrderLine> _lines = new();
    public int Number { get; }

    public IReadOnlyCollection<OrderLine> Lines => _lines.AsReadOnly();

    public decimal TotalAmount => _lines.Sum(line => line.Amount * line.Quantity);

    public void AddProduct(Product product, int quantity)
    {
        _lines.Add(new OrderLine()
        {
            Product = product,
            Amount = product.Amount,
            Quantity = quantity
        });
    }
}

public class OrderLine
{
    public Product Product { get; set; }
    public int Quantity { get; set; }
    public decimal Amount { get; set; }
}

public class Product
{
    public Product(string name, decimal amount)
    {
        Name = name;
        Amount = amount;
    }

    public string Name { get; set; }
    public decimal Amount { get; set; }
}

```

## Fluent Custom Assertions

In this example, we'll create a new test to refactor the test assertion, keeping both the original and refactored versions for comparison. The refactored test uses the same setup as the original.

**While Fluent Assertions already offers great readability, we can further enhance it by creating custom methods tailored to our domain-specific needs.**

When utilizing Fluent Assertions, the first step is to call the `Should` method, which grants us access to various assertions. The question is: _How can we extend that list further?_

Fortunately, Fluent Assertions offers a [Custom Extensions](https://fluentassertions.com/extensibility/#building-your-own-extensions) feature that we can leverage.

Let's create an extension for the Order class.

```csharp
public static class OrderExtensions
{
    public static OrderAssertions Should(this Order instance)
    {
        return new OrderAssertions(instance);
    }
}
```

You might have noticed that we are returning an `OrderAssertions` type. Now, let's define that type.

```csharp
public class OrderAssertions
{
    private readonly Order _instance;
    public OrderAssertions(Order instance)
    {
        _instance = instance;
    }

}
```

This class should have a constructor that receives the order object as a parameter and a field to store it.

Within this type, we can finally implement our custom method, which will express the assertion using domain concepts.

```csharp
public class OrderAssertions
{
    private readonly Order _instance;
    public OrderAssertions(Order instance)
    {
        _instance = instance;
    }

    public AndConstraint<OrderAssertions> ContainProduct(
        string productName, int quantity, string because = "", params object[] becauseArgs)
    {

        return new AndConstraint<OrderAssertions>(this);
    }

}
```

By creating this custom method, we have further enhanced the readability and expressiveness of our test assertions, making it easier for developers to understand and maintain the code.
By using the `AndConstraint` in the return type, we can chain multiple assertions together.

Now, let's write our assertion.

```csharp
var order = new Order(1);

order.AddProduct(new Product("Shoes", 50), 2);
order.AddProduct(new Product("T-Shirt", 10), 1);

order
    .Should().NotBeNull();

order
    .Should()
    .ContainProduct("Shoes", 2)
    .And
    .ContainProduct("T-Shirt", 1);
```

However, if we attempt to use one of the out-of-the-box assertions like `ShouldNotBeNull`, we encounter a compilation error. Let's bring those back into play.

To achieve this, we need to go back to the `OrderAssertions` class and make it inherit from `ReferenceTypeAssertions`.

To implement this change, simply inherit from `ReferenceTypeAssertions`, remove the private read-only field, and update the constructor accordingly.

```csharp
public class OrderAssertions : ReferenceTypeAssertions<Order, OrderAssertions>
{
    public OrderAssertions(Order instance)
        : base(instance)
    {
    }

    public AndConstraint<OrderAssertions> ContainProduct(
        string productName, int quantity, string because = "", params object[] becauseArgs)
    {

        return new AndConstraint<OrderAssertions>(this);
    }

    protected override string Identifier => "order";
}
```

Now, it compiles successfully. We can not only use our custom assertions but also the default ones.

Now, let's make our assertion do something meaningful. Here, we can define conditions and a failure message.
To utilize Fluent Assertions' engine for our custom `ContainProduct` method, we can access the `Execute.Assertion` property. This will allow us to inject our desired constraints or conditions.

```csharp
public class OrderAssertions : ReferenceTypeAssertions<Order, OrderAssertions>
{
    public OrderAssertions(Order instance)
        : base(instance)
    {
    }

    public AndConstraint<OrderAssertions> ContainProduct(
        string productName, int quantity, string because = "", params object[] becauseArgs)
    {

        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(!string.IsNullOrEmpty(productName))
            .FailWith("You can't assert a product exist if you don't pass a proper name");

        return new AndConstraint<OrderAssertions>(this);
    }

    protected override string Identifier => "order";
}
```

The exciting part is that we can chain multiple conditions here.

```csharp
public class OrderAssertions : ReferenceTypeAssertions<Order, OrderAssertions>
{
    public OrderAssertions(Order instance)
        : base(instance)
    {
    }

    public AndConstraint<OrderAssertions> ContainProduct(
        string productName, int quantity, string because = "", params object[] becauseArgs)
    {

        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(!string.IsNullOrEmpty(productName))
            .FailWith("You can't assert a product exist if you don't pass a proper name")
            .Then
            .ForCondition(Subject.Lines.Any())
            .FailWith("Expecting Products added to the Order")
            .Then
            .Given(() => Subject.Lines)
            .ForCondition(lines => lines.Any(line => line.Product.Name.Equals(productName)))
            .FailWith("Expected {context:order} to contain {0}{reason}, but found {1}.",
                _ => productName, lines => lines.Select(line => line.Product.Name))
            .Then
            .Given(_ => Subject.Lines.First(line => line.Product.Name == productName))
            .ForCondition(line => line.Quantity == quantity)
            .FailWith("Expected {context:order} to contain {0}{reason}, but found {1}.",
                _ => quantity, line => line.Quantity);

        return new AndConstraint<OrderAssertions>(this);
    }

    protected override string Identifier => "order";
}
```

And we're done!

But before we conclude, let's take another look at the before and after versions.

Before:

```csharp
order.Lines.Should().NotBeEmpty();
order.Lines.Should()
    .Contain(line=> line.Product.Name == "Shoes")
    .Which
    .Quantity.Should().Be(2);
order.Lines.Should()
    .Contain(line=> line.Product.Name == "T-Shirt")
    .Which
    .Quantity.Should().Be(1);
```

After:

```csharp
order
    .Should().NotBeNull();

order
    .Should()
    .ContainProduct("Shoes", 2)
    .And
    .ContainProduct("T-Shirt", 1);
```

Don't you think it's much better now?

Keep it Simple 🌱
