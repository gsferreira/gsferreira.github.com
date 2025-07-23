---
layout: post
tags: post
date: 2023-03-31
title: 3 TDD Techniques Most People Don’t Know
description: Master 3 TDD techniques most developers ignore - Fake It, Obvious Implementation, and Triangulation for effective test-driven development.
featured_image: /images/archive/highlight/3-tdd-techniques.png
---

https://www.youtube.com/watch?v=ga6i2i_ynYE

There are **3 techniques to help you move from Red 🔴 to Green 🟢**. Even if you already know about [Test Driven Development (TDD)](https://wikipedia.org/wiki/Test-driven_development), you may only be familiar with one of these techniques. However, this may lead you to believe that the [Red-Green-Refactor process](https://www.codecademy.com/article/tdd-red-green-refactor) is useless.

To explain the differences between these techniques, let's use a straightforward example like multiplication. I believe it will demonstrate the three techniques clearly. _If you want to see these techniques applied in a more complicated example, please reach out._

_Important: I will be using [xUnit.net](https://xunit.net/) and [Fluent Assertions](https://fluentassertions.com/)._

## Fake It

The first technique is the "Fake It" technique. Also known as _"Fake it until you make it"_. And how do you do it?
So, let's start creating our code.

```csharp
[Fact]
public void ShouldMultiplyTwoNumbers()
{

}
```

We are writing our tests, and now we start that process of daydreaming about what the solution will be.

We can imagine something like this, a static Class _Calculator_ with a static method _Multiply_ that will receive two integers as arguments.

```csharp
[Fact]
public void ShouldMultiplyTwoNumbers()
{
	Calculator.Multiply();
}
```

We can provide `2` and `3` and expect an int as a Result.

```csharp
[Fact]
public void ShouldMultiplyTwoNumbers()
{
	int result = Calculator.Multiply(2, 3);
}
```

The first step is to make this code compile. So, let's generate this code, create a static Class `Calculator`, and create the `Multiply` method.

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		throw new NotImplementedException();
	}
}
```

What we want to do now is our assertion.

```csharp
[Fact]
public void ShouldMultiplyTwoNumbers()
{
	int result = Calculator.Multiply(2, 3);

	result.Should().Be(6);
}
```

So, `results` (in case you are asking, I'm using [Fluent Assertions](https://fluentassertions.com/)) should be `2` times `3`. It means `6` is what we want.

Let's run the test to see what happens.

The test is failing due to the exception that I'm throwing.

So, now let's start the process of _Faking Until We Make It_.

If we know that `6` will fix it, let's return the `6`, and when we run it, we have a green test.

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		return 6;
	}
}
```

We are now in a green state, and we start refactoring this code to find the final solution.

In this scenario, we have a `6` on the test and a `6` on the code under the test. We want to avoid this duplication, am I right? So what can we do next? Don't worry, we're dealing with multiplication, so it might sound silly, but bear with me and trust the process.

**Since we want to avoid that duplication, what we can do is that we know that `2` times `3` will return `6`, right? So, that is the next obvious step. Just replace this with two times three.**

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		return 2 * 3;
	}
}
```

We execute the test again. The tests are green once again. Perfect! So, we can keep iterating on this.

The duplication has been moved from the return `6` to the two parameters.

So, what we do now is we will keep faking one of them, but we swap the other one with the correct implementation.

Let's change the `3` by the `b`.

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		return 2 * b;
	}
}
```

Run the tests, and see the green state.

Now we swap the `2` by the `a`.

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		return a * b;
	}
}
```

We run the tests, and it's green once again.

So, the _"faking until we make it"_ process is simple as this.

**We start with the dumbest thing we can do to fulfil that assertion and then start swapping things slowly. One at a time until we find the solution.**

If you feel that this one seems stupid, you will like the next one because it's the one that usually no one tells you can do on TDD.

## Obvious implementation

This technique is what I consider a practical approach. It's the one I use frequently, and I've noticed many others adopting it as well. Some may view it as not truly TDD, but it is. Even [Kent Beck's](https://www.kentbeck.com/) [TDD by Example book](https://www.goodreads.com/en/book/show/387190) includes this approach.

Let's look once again at the same case. We have `2` times `3` equals `6`.

```csharp
[Fact]
public void ShouldMultiplyTwoNumbers()
{
	int result = Calculator.Multiply(2, 3);

	result.Should().Be(6);
}
```

What can we do now? We know that it is `2` times `3`. We know it's multiplication. So if it's easy, **why don't we do this right away and run the tests?**

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		return a * b;
	}
}
```

They should be green. Voila!

**TDD doesn't mean that you need to do always the _stupid_ thing.**

Just go to techniques like the _"fake it until you make it"_ when you are not confident about the approach or when it's not obvious what you should do. You need to mix and match these techniques that I'm showing you.

## Triangulate

This one comes from the radar triangulation concept, where you can use two radars to find the position of a third device. We can apply the same principle to tests.

```csharp
    [Theory]
    [InlineData(2, 3, 6)]
    public void ShouldMultiplyTwoNumbers(int a,
        int b,
        int expectedResult)
    {
        var result = Calculator.Multiply(a, b);

        result.Should().Be(expectedResult);
    }
```

We changed the code to instead of being a Fact to be a Theory and used InlineData to provide these values as arguments.

Next, we implemented the simplest solution by returning `6` since we know that providing `6` as input results in success.

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		return 6;
	}
}
```

We run the tests, and they succeeded, so everything worked perfectly.

What we can do now is provide a new set of values. We need to find a position using a data set, so let's change the first parameter to `1`.

```csharp
[Theory]
[InlineData(2, 3, 6)]
[InlineData(1, 3, 3)]
public void ShouldMultiplyTwoNumbers(int a,
	int b,
	int expectedResult)
{
	var result = Calculator.Multiply(a, b);

	result.Should().Be(expectedResult);
}
```

Now we expect the result to be `3`. When we execute tests again, one test succeeds, and the other fails.

We can start thinking of ways to achieve the desired result with just two test cases. For example, we can return a different number if a given number is received or multiply a by three (for now). After making these changes, we run the tests, and they succeed.

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		return a * 3;
	}
}
```

We can now bring in another option and change the second argument.

```csharp
[Theory]
[InlineData(2, 3, 6)]
[InlineData(1, 3, 3)]
[InlineData(1, 4, 4)]
public void ShouldMultiplyTwoNumbers(int a,
	int b,
	int expectedResult)
{
	var result = Calculator.Multiply(a, b);

	result.Should().Be(expectedResult);
}
```

After running the tests, one of them fails. However, **by triangulating the three test scenarios, we can deduce that the solution must meet all three conditions, allowing us to identify a pattern**. It's crystal clear the solution is `a` times `b`.

```csharp
public static class Calculator
{
	public static int Multiply(int a, int b)
	{
		return a * b;
	}
}
```

We run all the tests, and they succeed.

If you are familiar with these three techniques, let me know which one you use.

Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Keep it Simple 🌱
