---
layout: post
tags: post
date: 2023-05-26
title: Refactoring Csharp Code with the Chain of Responsibility Design Pattern
description: What is the Chain of Responsibility Design Pattern, and how can I apply it in C#.
featured_image: /images/archive/highlight/refactoring-csharp-code-with-the-chain-of-responsibility-design-pattern.png
---

https://www.youtube.com/watch?v=SF305UAQTXI

Imagine calling a support line and being transferred to multiple people until your problem is resolved. This everyday concept of "passing the responsibility" also exists in the world of programming as a [behavioral design pattern](https://refactoring.guru/design-patterns/behavioral-patterns) called the Chain of Responsibility. **This pattern is particularly useful when refactoring code, as it helps with decoupling and segregation of responsibilities.**

By the way, if you've worked with ASP.NET, you might already be familiar with the Chain of Responsibility pattern.

In this blog post, I will share with you how to apply the Chain of Responsibility design pattern to refactor C# code. Hopefully 🤞, we will end up with more maintainable code. We will focus on a specific scenario where we have a function responsible for determining if an order qualifies for a discount. This function is used by a sales team to apply discounts within a specific screen of an application.

```csharp
public bool Handle(Order order, double proposedDiscount)
{
    if (_vipClients.Contains(order.Client.Code))
        return true;

    if (_stockClearanceProducts.Contains(order.Product.Code) && proposedDiscount < 0.80)
        return true;

    if(proposedDiscount < 0.30)
        return true;

    return false;
}
```

## Understanding the Need for the Chain of Responsibility Design Pattern

**As the business grows and more discount rules are added, the code becomes harder to maintain**. The Class responsible for discount approval becomes overloaded with responsibilities, making it difficult for developers to modify it. This is where the Chain of Responsibility design pattern comes into play. It helps segregate responsibilities and decouples the discount approval engine from the consumers.

To illustrate the application of the pattern, let's consider a discount approval process involving multiple rules.

- First, we check if the customer is a VIP client.
- Then, we verify if the product is part of a stock clearance and if the discount is below a specified value.
- Finally, we evaluate an overall discount rule.

During this process, we can return and break the cycle at any point, avoiding the need to check subsequent rules. Each handler in the chain performs its task and delegates the request to the next handler.

## Refactoring with the Chain of Responsibility Pattern

To begin refactoring the code using the Chain of Responsibility pattern, we'll follow a structured approach.

First, we create a folder named `Approvals` to organize the source code related to the chain of responsibility. This organization helps developers locate and understand the code easily.

Next, we create a base class named `DiscountApproval`. In this example, we will do it in a different namespace to minimize changes in the existing code.

```csharp
public class DiscountApproval
{

}
```

This base class will manage the request and establish guidelines for the handlers implementing it. We add a `SetNext` method and a field to store the next element in the chain.

```csharp
public class DiscountApproval
{
    private DiscountApproval? _nextHandler;

    public DiscountApproval SetNext(DiscountApproval handler)
    {
        _nextHandler = handler;
        return handler;
    }
}
```

Additionally, we implement a method to handle the discount approval request based on the order information.

```csharp
public class DiscountApproval
{
    private DiscountApproval? _nextHandler;

    public DiscountApproval SetNext(DiscountApproval handler)
    {
        _nextHandler = handler;
        return handler;
    }

    public virtual bool Handle(Order order, double proposedDiscount)
    {
        // ...
    }
}
```

The key concept of the Chain of Responsibility pattern is that each handler performs its task and delegates the request to the next handler in the chain.

In the base class, we define the behavior for handling the next element. If there is a next element, it delegates the request to that element; otherwise, it returns false to indicate that the discount is not approved.

```csharp
public class DiscountApproval
{
    private DiscountApproval? _nextHandler;

    public DiscountApproval SetNext(DiscountApproval handler)
    {
        _nextHandler = handler;
        return handler;
    }

    public virtual bool Handle(Order order, double proposedDiscount)
    {
        return _nextHandler?.Handle(order, proposedDiscount) ?? false;
    }
}
```

Once the base class is established, we proceed to implement specific discount approval rules. For example, we create a new class for VIP client discount approval by inheriting from the base class and overriding the handle method. We copy the relevant code from the old source code into the new handler. The handler checks the rule and breaks the chain if the rule matches, approving the discount. If the rule doesn't match, it delegates the execution to the next handler.

```csharp
public class VipDiscountApproval : DiscountApproval
{
    private readonly HashSet<string> _vipClients = new()
    {
        //...
    };
    public override bool Handle(Order order, double proposedDiscount)
    {
        if (_vipClients.Contains(order.Client.Code))
            return true;

        return base.Handle(order, proposedDiscount);
    }
}
```

Similarly, we implement handlers for other discount approval rules, such as stock clearance discounts and global discounts. Each handler overrides the base class, copies the relevant source code, and follows the chain of responsibility pattern.

## Enhancing Code Efficiency and Flexibility

After refactoring the code, we remove the old approach by deleting the old file. This might cause the tests to fail, but since we used the same naming under a separate namespace, fixing the tests is straightforward.

However, you will notice that some tests related to the "reject" scenario pass while others fail. This is because, in the given chain, when there is no subsequent element, it returns `false`.

Next, we configure the responsibility chain to ensure that all discount approval rules are evaluated. In the chain, we set the next element to the VIP discount handler. After the execution of the VIP discount handler, if the approval hasn't been granted yet, the request is forwarded to the stock clearance handler. Finally, if none of the previous handlers approve the discount, the request is passed to the global discount handler.

```csharp
_handler = new DiscountApproval();
_handler
    .SetNext(new VipDiscountApproval())
    .SetNext(new StockClearanceDiscountApproval())
    .SetNext(new GlobalDiscountApproval());
```

**This approach provides flexibility to introduce new handlers in the evaluation chain, change their order, load them dynamically, and perform various tasks without constantly rewriting the source code.**

## Wrapping Up

The Chain of Responsibility design pattern is a powerful tool for improving code efficiency and managing complex scenarios like a rule engine.

By applying this pattern, we achieve better decoupling and segregation of responsibilities, resulting in a more maintainable and flexible code.

In our refactoring example, we demonstrated how to implement the Chain of Responsibility pattern to manage discount approval in a C# codebase. Each discount rule is encapsulated within a separate handler, and the responsibility is passed from one handler to another until the discount is approved or rejected.

If you have experience using the Chain of Responsibility pattern or other design patterns in your projects, I would love to hear your thoughts and insights.

Keep it Simple 🌱
