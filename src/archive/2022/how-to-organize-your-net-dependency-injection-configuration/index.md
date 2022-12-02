---
layout: post
tags: post
date: 2022-12-02
title: How to Organize your .NET Dependency Injection Configuration
description: How many times you need to scroll to go through your Dependency Injection configuration? Too many? Do you configure your Dependency Injection on the Startup.cs? Or in the Program.cs? In this post we will see a proven organization method for maintainable Dependency Injection configuration.
featured_image: /images/archive/architecture/dependency-configuration-by-feature.png
---

How big is your dependency injection configuration file?

Too big? Is your `Program.cs` or `Startup.cs` so huge that you can't find anything without using Search 🔎?

Don't worry. We have all been there.

The good news is that we can fix that quickly with a simple technique.

Here is a way to break it down.

## 📜 The Existing Convention

Have you noticed that ASP.NET uses a convention to register components on Dependency Injection? If not, I bet you have been using them for sure.

**Methods like `AddControllers` or `AddEndpoints` follow a convention.**
According to the convention, similar things are added to Dependency Configuration using an "Add Something" extension method.

```csharp
public static IMvcBuilder AddControllers(this IServiceCollection services)
{
    //...
}
```

This idea is the root of my preferred approach. But I don't take it to the letter.

## 📦 Solution

My approach goes in a different direction, because **I don't group by similarity. I prefer to group by Feature.**

What does that mean? It means that instead of having an `AddServices`, `AddRepositories`, or `AddCommandHandlers`, I prefer to have an `AddCancelOrderFeature` that contains Services, Repositories, Commands, Command Handlers, etc.

```csharp
public static class DependencyInjectionExtensions
{
    public static IServiceCollection AddFeatureAddBookRead(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IAddBookRead, AddBookRead.AddBookRead>();
        return serviceCollection;
    }
}
```

```csharp
public static class DependencyInjectionExtensions
{
    public static IServiceCollection AddPostgreBookReadStore(this IServiceCollection serviceCollection)
    {
        serviceCollection.TryAddTransient<IDbConnection>(sp
            => new NpgsqlConnection("connectionString"));
        serviceCollection.AddScoped<IBookReadStore, PostgreBookReadStore>();
        return serviceCollection;
    }
}
```

I added this code as an extension method to the Project/Adapter they are part of.

Now, you can replace many lines of your `Program.cs` or `Startup.cs` with something as simple as this:

```csharp
builder.Services
    .AddFeatureAddBookRead()
    .AddPostgreBookReadStore();
```

**The configuration becomes extremely clear and maintainable.**

Another benefit of this approach is that swapping adapters becomes really simple.
As an example, on the example above, changing the existing store from PostgreSQL to DynamoDB would mean invoking a different method on the configuration. That can even be behind a feature flag.

## 🔀 Other Ways

There are two other common ways that people use to break it down.

One is extracting methods inside the `Program.cs` or `Startup.cs`. Why don't I do it? Because even being a better way than having everything on the `ConfigureServices`, we still have a massive unmanageable class. Besides that, I believe each adapter is responsible for providing easy and simple configuration methods that the Dependency Configuration can use.

The other common approach is relying on dependency auto-discovery. In this approach, you will dynamically find dependencies on your assemblies to configure. You can use a library like [Scrutor](https://github.com/khellang/Scrutor) to achieve that.
Even knowing that this approach throws away much of the code needed to configure dependencies, **I prefer to avoid "magic".** I like when something as dependency becomes explicit because I've seen systems not behaving as expected because the incorrect dependency was injected on runtime. And magic, my friends, it's hard to review on a Pull Request.

## 👋 Wrapping up

There's only one open question. What should we call these extension methods? You can find the answer in [this blog post](../the-missing-project-that-fixes-everything-in-dotnet/).

If you want to see me refactoring towards this solution, take a look at this video 👇

<iframe width="560" height="315" src="https://www.youtube.com/embed/huFpOOtBdvU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Let me know what you think about it. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Just keep things Simple 🌱
