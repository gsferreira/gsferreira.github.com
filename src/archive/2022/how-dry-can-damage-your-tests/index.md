---
layout: post
tags: post
date: 2022-10-18
title: How the DRY Principle can damage your tests (C# Developers)
description: How the DRY principle can damage the readability of your C# tests, and what you can do instead.
featured_image: /images/archive/testing/dry-tests-bad-result.png
---

Don't Repeat Yourself (DRY) is likely the most famous principle in software development. The first thing you learn to optimize your code is to avoid duplication. As the saying goes, duplication is the root of all evil 😈. **To many this is DRY in a nutshell. Exterminate anything that looks like a clone. And that is how you destroy your test readability.** And I will show you how so you can keep an eye on it.

The DRY principle is more nuanced than it looks. It's like wine 🍷. Many drink wine, but only a few can spot Wood flavors there.

![Wine Connoisseur - Michael Scott - The Office](/images/archive/fun/wine-connoisseur.png)

In [_The Pragmatic Programmer_](https://en.wikipedia.org/wiki/The_Pragmatic_Programmer) book, [Andy Hunt](<https://en.wikipedia.org/wiki/Andy_Hunt_(author)>) and [Dave Thomas](<https://en.wikipedia.org/wiki/Dave_Thomas_(author)>) stated DRY as _"Every piece of knowledge must have a single, unambiguous, authoritative representation within a system"_.

What does that mean? That means that **changing a system element should not require a change in unrelated elements.** Let me try to state that differently. If two identical elements can change for different reasons, that means they are not the same element, even if they are identical. Having a doppelganger or even a twin doesn't make you the same person.

So, as you can see, it's easy to go wrong with it. And one of the cases where I have seen it go wrong more often is on Tests. **Tests, by their nature, evolve independently. So, when you read a test, it should be clear what that Test asserts without implying a huge cognitive load. And it's here where DRY can get you in a bad place.** Even though DRY is a good principle to keep in mind, you should always keep an eye on Readability, one of the most important properties of a good Test.

Let's see an example. Hopefully, it will make it clear.

## 🎢 Putting it into practice

Take a look at the following code.

```csharp
[Fact]
public void GivenUserWithoutDefinedLanguage_WhenGenerateWelcomeMessage_ReturnsHello()
{
    var user = new User { Name = "Gui" };

    var message = WelcomeMessage(user);

    message.Language.Should().Be("EN");
    message.Text.Should().Be("Hello Gui!");
}

[Fact]
public void GivenUserWithEnglishLanguage_WhenGenerateWelcomeMessage_ReturnsHello()
{
    var user = new User { Name = "Gui", Language = "EN" };

    var message = WelcomeMessage(user);

    message.Language.Should().Be("EN");
    message.Text.Should().Be("Hello Gui!");
}

[Fact]
public void GivenUserWithPortugueseLanguage_WhenGenerateWelcomeMessage_ReturnsOla()
{
    var user = new User { Name = "Gui", Language = "PT" };

    var message = WelcomeMessage(user);

    message.Language.Should().Be("PT");
    message.Text.Should().Be("Olá Gui!");
}
```

What would you refactor here? Can we start by extracting those Language Code magic strings? Ok, let's try it.

```csharp
private const string PortugueseLanguage = "PT";
private const string DefaultLanguage = "EN";

[Fact]
public void GivenUserWithoutDefinedLanguage_WhenGenerateWelcomeMessage_ReturnsHello()
{
    var user = new User { Name = "Gui" };

    var message = WelcomeMessage(user);

    message.Language.Should().Be(DefaultLanguage);
    message.Text.Should().Be("Hello Gui!");
}

[Fact]
public void GivenUserWithEnglishLanguage_WhenGenerateWelcomeMessage_ReturnsHello()
{
    var user = new User { Name = "Gui", Language = DefaultLanguage };

    var message = WelcomeMessage(user);

    message.Language.Should().Be(DefaultLanguage);
    message.Text.Should().Be("Hello Gui!");
}

[Fact]
public void GivenUserWithPortugueseLanguage_WhenGenerateWelcomeMessage_ReturnsOla()
{
    var user = new User { Name = "Gui", Language = PortugueseLanguage };

    var message = WelcomeMessage(user);

    message.Language.Should().Be(PortugueseLanguage);
    message.Text.Should().Be("Olá Gui!");
}
```

Did we de-duplicate? Yes. Did we make it more readable? I don't think so. Can I safely change it? No. A change to the value to satisfy one test may affect the other.

Let's try another one. Let's extract the user creation to a different method.

```csharp
private const string PortugueseLanguage = "PT";
private const string DefaultLanguage = "EN";

[Fact]
public void GivenUserWithoutDefinedLanguage_WhenGenerateWelcomeMessage_ReturnsHello()
{
    var user = CreateUser();

    var message = WelcomeMessage(user);

    message.Language.Should().Be(DefaultLanguage);
    message.Text.Should().Be("Hello Gui!");
}

[Fact]
public void GivenUserWithEnglishLanguage_WhenGenerateWelcomeMessage_ReturnsHello()
{
    var user = CreateUser();

    var message = WelcomeMessage(user);

    message.Language.Should().Be(DefaultLanguage);
    message.Text.Should().Be("Hello Gui!");
}

[Fact]
public void GivenUserWithPortugueseLanguage_WhenGenerateWelcomeMessage_ReturnsOla()
{
    var user = CreateUser();
    user.Language = PortugueseLanguage;

    var message = WelcomeMessage(user);

    message.Language.Should().Be(PortugueseLanguage);
    message.Text.Should().Be("Olá Gui!");
}

private static User CreateUser()
    => new() { Name = "Gui", Language = DefaultLanguage };
```

Did we de-duplicate? Yes. Did we make it more readable? I don't think so.

If you look into the following code, you may ask yourself: _"Where does that value come from? Why 'Hello Gui?'"_. Why? We _DRYed_ too much.

As you can see, deduplication may impact your code readability, and when we are talking about tests, we are talking about an important property.

So, what can you do instead?

## ⭐️ A better solution

Always ask yourself: _"Is it clear what is under test here?"_ and _"Is it really a duplicate? There's any reason to change them independently?"_.

Based on that, you could have done something along those lines.

```csharp
private const string EnglishLanguage = "EN";
private const string PortugueseLanguage = "PT";
private const string DefaultLanguage = EnglishLanguage;

[Fact]
public void GivenUserWithoutDefinedLanguage_WhenGenerateWelcomeMessage_ReturnsHello()
{
    var user = new UserBuilder()
        .WithName("Gui")
        .Build();

    var message = WelcomeMessage(user);

    message.Language.Should().Be(DefaultLanguage);
    message.Text.Should().Be("Hello Gui!");
}

[Fact]
public void GivenUserWithEnglishLanguage_WhenGenerateWelcomeMessage_ReturnsHello()
{
    var user = new UserBuilder()
        .WithName("Gui")
        .WithLanguage(EnglishLanguage)
        .Build();

    var message = WelcomeMessage(user);

    message.Language.Should().Be(EnglishLanguage);
    message.Text.Should().Be("Hello Gui!");
}

[Fact]
public void GivenUserWithPortugueseLanguage_WhenGenerateWelcomeMessage_ReturnsOla()
{
    var user = new UserBuilder()
        .WithName("Gui")
        .WithLanguage(PortugueseLanguage)
        .Build();

    var message = WelcomeMessage(user);

    message.Language.Should().Be(PortugueseLanguage);
    message.Text.Should().Be("Olá Gui!");
}
```

As you can see, now the magic string has a name that puts me in the right direction. Besides that, I use the Builder pattern and specify the properties that will impact the assertion result in the Arrange step. Now is clear where the Gui in _"Hello Gui!"_ comes from.

Let me know what you think about it.

I have an in-depth video here 👇

https://www.youtube.com/watch?v=QUj2dRDEWWs

If you want more, be sure to follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Just keep things Simple 🌱
