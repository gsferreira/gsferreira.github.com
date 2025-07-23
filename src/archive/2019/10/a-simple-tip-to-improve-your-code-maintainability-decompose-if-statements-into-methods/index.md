---
layout: post
tags: post
date: 2019-10-24
title: A simple tip to improve your code maintainability - Decompose IF statements into methods
description: Improve code maintainability by extracting complex IF statements into well-named methods - reduce cognitive load and enhance readability.
category: Refactoring, Improvement, C#, .net
featured_image: /images/a-simple-tip-to-improve-your-code-maintainability-decompose-if-statements-into-methods.png
---

![Extract method](/images/a-simple-tip-to-improve-your-code-maintainability-decompose-if-statements-into-methods.png)

How many times have you been in a situation where you can’t understand a small piece of code?

Readability has a huge impact on code maintenance because reading other’s people code (and sometimes even our code) can be challenging.

As developers, **we tend to ignore the UX (user experience) of our code**. Every single line of code that we do, will eventually be used by others. Is important to be sure that we do the best possible job for our teammates and to future self.

**The worst code blocks in terms of UX are the ones that require a huge cognitive load.** It’s our job to ask our selves what we can do to reduce it and improve readability.

Usually when I’m in a situation that requires high cognitive load to understand a piece of code, is because I face a huge and complex IF statement condition and I need to figure out what the hell it’s supposed to do. Do you know the feeling? Having to sketch a decision tree trying to figure out what is happening?

## How to avoid it?

This is one of the most simple tricks that I do every day and I tend to advise everyone to do.

My rule of thumb is simple: **In case of a multi-part condition, extract it to a method and name it accordingly.**

Let’s see it in practice.

Imagine that you have the following expression, that wants to validate if the customer can pay the Order with Credit Card. To do that, the customer should have an active Credit Card.

```csharp
if (order.PayWithCreditCard && (order.Customer.CreditCard == null || order.Customer.CreditCard.ExpirationDate < DateTime.Today))
    throw new CreditCardPaymentException("Customer doesn't have a valid Credit Card");
```

To improve it, you can extract the boolean logic related to the credit card validation to a static method, and name it with something easy to understand.

```csharp
public static void ProcessOrder(Order order)
{
    if (order.PayWithCreditCard && IsCustomerCreditCardInvalid(order.Customer))
        throw new CreditCardPaymentException("Customer doesn't have a valid Credit Card");

    (...)
}

private static bool IsCustomerCreditCardInvalid(Customer customer)
    => customer.CreditCard == null || customer.CreditCard.ExpirationDate < DateTime.Today;
```

By doing this you are abstracting the reader’s mind from details. In case the reader needs to know the details, he can drill down to the details.
