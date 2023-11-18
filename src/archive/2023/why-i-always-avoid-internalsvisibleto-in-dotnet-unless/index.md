---
layout: post
tags: post
date: 2023-03-21
title: Why I Always Avoid InternalsVisibleTo in .NET, Unless...
description: I don't fall in love with InternalsVisibleTo, especially in the context of facilitating Testing. But I admit that there's at least one extremely useful use case.
featured_image:
---

https://www.youtube.com/watch?v=O9GiOIw5XYc

Please don't hate me, but I have to confess that **I don't like to use [`InternalsVisibleTo`](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.compilerservices.internalsvisibletoattribute?view=net-8.0) in my .NET applications just for the sake of testing**. Unless I'm in a specific scenario (don't worry, I will let you know later in this article).

## 🤔 Why?

Let me show you.

What do I have here? I have two projects; one with the source code that will be under test and the other with the test code.

```bash
dotnet new sln -n InternalsVisibleToDemo
dotnet new classlib -n InternalsVisibleToDemo
dotnet new xunit -n InternalsVisibleToDemo.Tests
dotnet add InternalsVisibleToDemo.Tests reference InternalsVisibleToDemo
```

In the code under test, I have a simple class that does nothing special. It's a simple method call.

```csharp
public class AddCustomerService
{
	public void Add(Customer customer)
	{
		if (!IsValid(customer))
			throw new InvalidDataException("Invalid Customer data");

		// ...
	}

	internal bool IsValid(Customer customer)
	{
		if (customer.Name is { Length: < 1 })
			return false;

		if (!customer.Email.IsValidEmail())
			return false;

		//...
		return true;
	}
}
```

The goal of the public method is to add a customer, and the only thing that I'm doing here right now is calling `IsValid`.

Obviously, in a real-world scenario, we will do extra stuff here. I want to make a point, just that.

`IsValid` is simply performing two checks on top of this customer object. But, usually, this will be almost as complex as the Game of Thrones story plot. So since this is a different method, what I see a lot of people doing is that they use this as an 'internal' for the sake of testing.

Since usually, this type of validator tends to have a bit of logic, some **people prefer to expose them and test this validation in specific**.

So what do you do in those cases? You can go to your `csproj` or have an attribute tag to your project. Nick Chapsas has [this cool video](https://www.youtube.com/watch?v=6WeT-JQBI98) that explains all the options that you can do.

```xml
<ItemGroup>
	<InternalsVisibleTo Include="InternalsVisibleToDemo.Tests" />
</ItemGroup>
```

**On the `csproj`, we add the `InternalsVisibleTo` to enable my test project to access anything internal on this project.**

What does this mean? It means that anything internal, from methods to classes, can be accessed by that specific project.

Now, you can write tests like this:

```csharp
[Fact]
public void GivenValidCustomer_WhenCheckIfIsValid_ReturnTrue()
{
	var service = new AddCustomerService();

	var isValid = service.IsValid(new Customer("Guilherme", "gui@guiferreira.me", null));

	isValid.Should().BeTrue();
}

[Fact]
public void GivenInvalidCustomer_WhenCheckIfIsValid_ReturnFalse()
{
	var service = new AddCustomerService();

	var isValid = service.IsValid(new Customer("", "gui@guiferreira.me", null));

	isValid.Should().BeFalse();
}
```

As you can see, I am invoking `IsValid`, an internal method. I'm asserting that if I provide a valid customer, it should return "True". So, if I provide an invalid customer, for example, sending an empty name, it should be "False".

If we run the tests, they will succeed.

But now, let's go back and refactor some code.

Let's imagine I want **to perform a refactoring on the `IsValid` because the method has been growing and becoming too hard to maintain**.

Now you feel that this **method should go to a different Class**. Maybe this Class will be used in another place of your application, for example. So, what will you be doing in that case?

Let's move this into a different Class. I will create a new Class with the name `CustomerValidator`. This Class will be Internal as well, and I will copy the method into that. Cut and paste.

```csharp
class CustomerValidator
{
	internal bool IsValid(Customer customer)
	{
		if (customer.Name is { Length: < 1 })
			return false;

		if (!customer.Email.IsValidEmail())
			return false;

		//...

		return true;
	}
}
```

Now we can update the `AddCustomerService` to:

```csharp
public class AddCustomerService
{
	private readonly CustomerValidator _customerValidator = new();

	public void Add(Customer customer)
	{
		if (!_customerValidator.IsValid(customer))
			throw new InvalidDataException("Invalid Customer data");
		// ...
	}
}
```

**We have to agree that this refactoring has not changed any application behavior. So, in theory, my test should still be Green, am I right? But in fact, they are not.** They will not even compile **because I changed the structure of my application**.

## 🔀 What's the alternative?

What if the tests were like this?

```csharp
[Fact]
public void Alternative_GivenValidCustomer_WhenCheckIfIsValid_ReturnTrue()
{
	var service = new AddCustomerService();

	var action =
		() => service.Add(new Customer("Guilherme", "gui@guiferreira.me", null));

	action.Should().NotThrow<InvalidDataException>();
}

[Fact]
public void Alternative_GivenInvalidCustomer_WhenCheckIfIsValid_ReturnFalse()
{
	var service = new AddCustomerService();

	var action =
		() => service.Add(new Customer("", "gui@guiferreira.me", null));

	action.Should().Throw<InvalidDataException>();
}
```

They are performing the same assertion. Better than that, our refactoring didn't break them.
**These tests, instead of depending on internal methods, are going through the public interface.**

And why do I do this? Because **any change to internal things should have no reflection on the outside behavior through the public contracts**. And while **changing the public Contract may be a tremendous problem** for you, **changes to Internal and Private things should be frictionless**.

My point is that when you use the `InternalsVisibleTo` for the sake of testing, more often than not, you will be structure dependent. You are testing the code structure instead of the behavior of your application.

## 📦 The exception to the rule

**There's one scenario that I believe `InternalsVisibleTo` may be useful**, and let me explain why.

Let's look into this open-source project, [octokit.net](https://github.com/octokit/octokit.net). It's a GitHub API client.
Let's take a look at this example.

```csharp
var github = new GitHubClient(new ProductHeaderValue("MyAmazingApp"));
var user = await github.User.Get("half-ogre");
Console.WriteLine(user.Followers + " folks love the half ogre!");
```

Here you can see how you can use it. If you look into this snippet, you can see that what we'll be doing if we want to use this code is that we simply instantiate the GitHub client.

So what does this mean? It means that when you call the `User.Get`, there's an HTTP request to the GitHub API.

So what's the relationship between this I'm showing you and the `InternalsVisibleTo`?

In a scenario like this, **I might want to define a clear and strict contract with the outside world to publish a library. So, I don't want to expose extra things. I want to provide a lean public contract to optimize the consumer developer experience.**

So, to test my library, the GitHub Client, I may struggle to avoid invoking the real API or run a fake/mock server to test it. So, in some cases like this, **when exposing a library, it may be super useful to have the `InternalsVisibleTo` to do a kind of subcutaneous test where you don't use the real API.**

For most of the tests, you want to be sure they run fast. So, you can go through this approach.

It's common to see people advocating for the `InternalsVisibleTo`, saying that even Microsoft on the .NET repos uses this a lot (which is true). However, it's true because Microsoft is building libraries and frameworks like this GitHub Client API. So, they need to do that, so we don't suffer as consumers. **In public libraries, the friction of adoption is an important concern**. We need to think about developer experience.

And now, do you agree with me? Will you keep using `InternalsVisibleTo`?

Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.
