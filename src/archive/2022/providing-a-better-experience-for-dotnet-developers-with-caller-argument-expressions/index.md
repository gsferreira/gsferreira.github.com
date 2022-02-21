---
layout: post
tags: post
date: 2022-02-21
title: Providing a better experience for .NET developers with Caller Argument Expressions
description: How to use .net 6 Caller Argument Expressions to improve the Developer Experience of your consumers.
featured_image: /images/archive/csharp/caller-argument-expression.png
---

I've always been a fan of usability. I love when I see libraries and APIs developed with developer experience in mind.

The [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) movement made a ton for us in that chapter. But sometimes the small details create all the difference.

Since my language of choice is C# .NET, I'm always delighted when the framework gives me new ways to simplify the life of those consuming my code.

So, it's no surprise that I loved .NET 6 [Caller Argument Expressions](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-10.0/caller-argument-expression).

## Why do we need it?

One common refactoring to improve code readability is implementing [Guard clauses](https://refactoring.com/catalog/replaceNestedConditionalWithGuardClauses.html). It's common to see the first line of a method asserting the provided arguments. And that's fine. If you provide a null value, and you receive an _ArgumentNullException_, you will be able to understand that something is wrong in the way that you are consuming the API.

What if you could go a step further?
What if instead of letting you know the What, you could tell you the Why?
What if instead of saying _"You are not providing a valid argument X"_, you could say _"You are sending me the variable or expression Y, and that is not valid because of X"_.

Do you see the difference?
The difference is that now, I can give you an exception that contains information about your code.
You may not know the names that I use for my arguments, but for sure you know your code. That is awesome! This reduces the cognitive load to diagnose an exception like that.

Maybe it will not be that important if it's a library built by yourself. But will feel awesome if you are using a library that you grab from a random [NuGet](https://www.nuget.org/) package.

## How to provide it?

Using it is simple. Whenever you want to throw an exception with the caller information, you use `CallerArgumentExpression` like in the example below.

```csharp
[Fact]
public void GivenAnOddNumber_WhenVerify_ThenNoExceptionIsThrown()
{
    var action = () => VerifyIsOddNumber(1);
    action.Should().NotThrow<Exception>();
}

[Fact]
public void GivenAVariableWithAnEvenNumber_WhenVerify_ThenArgumentExceptionIsThrownWithVariableName()
{
    const int myNumber = 2;
    var action = () => VerifyIsOddNumber(myNumber);
    action.Should().Throw<ArgumentException>()
        .WithMessage("myNumber");
}

[Fact]
public void GivenAnEvenNumber_WhenVerify_ThenArgumentExceptionIsThrownWithValue()
{
    var action = () => VerifyIsOddNumber(10);
    action.Should().Throw<ArgumentException>()
        .WithMessage("10");
}

[Fact]
public void GivenAnExpressionReturningEvenNumber_WhenVerify_ThenArgumentExceptionIsThrownWithValue()
{
    var action = () => VerifyIsOddNumber(4 * 2);
    action.Should().Throw<ArgumentException>()
        .WithMessage("4 * 2");
}

private void VerifyIsOddNumber(int value, [CallerArgumentExpression("value")] string? paramName = null)
{
    if (value % 2 is 0)
        throw new ArgumentException(paramName);
}
```

## How to consume it?

As you probably know, with .net 6 we have a [Guard clause for _ArgumentNullExceptions_](https://docs.microsoft.com/en-us/dotnet/api/system.argumentnullexception.throwifnull?view=net-6.0) directly in the exception itself.
You can use it with:

```csharp
ArgumentNullException.ThrowIfNull(myObject);
```

If you have used it, you were using `CallerArgumentExpression` in action.

So, if you drill down into the code, you will see how Microsft is doing it.
Basically, the `CallerArgumentExpression` attribute is being used to capture the argument.

```csharp
/// <summary>Throws an <see cref="ArgumentNullException"/> if <paramref name="argument"/> is null.</summary>
/// <param name="argument">The reference type argument to validate as non-null.</param>
/// <param name="paramName">The name of the parameter with which <paramref name="argument"/> corresponds.</param>
public static void ThrowIfNull([NotNull] object? argument, [CallerArgumentExpression("argument")] string? paramName = null)
{
    if (argument is null)
    {
        Throw(paramName);
    }
}
```

## Wrapping up

As you can see, it's a small detail, that can simplify your consumer's life.
If you are delivering libraries to other Teams or the Public, I suggest you give it a try. Inspire yourself in Microsoft work with `ArgumentNullException`, and amaze your consumers.

🔗 You can find the source code used [here](https://github.com/gsferreira/dotnet-playground/tree/main/csharp/10/CallerArgumentExpression).

I hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
