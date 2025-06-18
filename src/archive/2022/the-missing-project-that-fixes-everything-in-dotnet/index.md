---
layout: post
tags: post
date: 2022-09-27
title: The missing Project that fixes everything in .NET
description: Most Clean Architecture implementations have this error. The error of missing the Main Component, or Composition Root. Here we will see how to implement it in a .NET Solution.
featured_image: /images/archive/hexagonal-architecture/after-startup-project.png
---

https://www.youtube.com/watch?v=jeUHyGjnTwo

It has many names. [Robert C. Martin (AKA Uncle Bob)](http://cleancoder.com/products) calls it the Main Component, and Mark Seemann calls it the [Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/). You may also know it as the Application Host or Startup. Not the same as _"Startup.cs"_. I'm still trying to find my preferred name, so you may see me using those terms interchangeably.

Robert C. Martin says **it is the Ultimate Detail**. Even then, most seem to not care about it.

Those brave souls who care about it will look into the face of .NET and say: _"Not Today!"_. [Arya Stark](https://gameofthrones.fandom.com/wiki/Arya_Stark) style. They will often do it by:

- Moving entry points to a Presentation Project. For example, extracting Controllers out of an MVC API.
- Load dependencies through dynamic assembly loading using something like [MEF](https://learn.microsoft.com/en-us/dotnet/framework/mef/).

I have a slightly different approach, and it's what I want to show you today.

But first, let's see what the Main Component/Composition Root/Application Host/Startup is.

## ❓ What is it

When you apply [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/), [Hexagonal Architecture](https://guiferreira.me/archive/2022/hexagonal-architecture-for-dotnet-developers-beginners/), or any other shape of device-independent architecture, keeping the dependencies independent and respecting the Dependency Rule may be challenging. .NET, you know I'm talking about you. **The Template for an API or Web application is already the host itself.**

You need to define the dependencies and configurations of the involved modules/components/projects, which can be challenging when the DI configuration happens inside the adapter. You may do it through a Dependency Injection Container or by Pure DI. But, **the DI responsible project will need to know all the other projects**. Unless you want to do it dynamically. What I don't recommend in most cases.

**The dependency management becomes a problem when that Project should be a simple adapter to the Core Application logic.** Once you introduce all the references there, it becomes hard to enforce the Dependency Rule and to spot shortcuts. Once you notice it, you may have an MVC directly inserted into your SQL DB even when it was not supposed to. That's why adapters should be independent of each other.

Robert C. Martin is absolutely right when he says it is the _"dirtiest of all the dirty components"_. The project is coupled to everyone. But he does it in good faith. Someone has to sacrifice to keep the rest of the family safe.

## 🏗 How it sits in the architecture

The application host/startup is **the initial entry point of the application**.

You can picture it as the outermost circle Onion Architecture or Clean Architecture diagram.

This component will be the one you will start when you run your application. It loads everything, configures it, and hands control to another component.

## 👍 The benefits

Besides the obvious benefit of removing unwanted dependencies from other projects, it will allow you to use multiple configurations, depending on the scenario. So, if you want to use the same application logic as a CLI or an API, you simply have a different host/startup where you do a different configuration. Just that. Do you need a sandbox version with another DB Adapter? You implement another host/startup. Those are just examples.

## 📝 How to do it

_Note: If you want to follow along, you can find the example [here](../how-to-apply-hexagonal-architecture-with-dotnet/). Then, just run the following script._

```bash
dotnet add src/Adapter.Api/Adapter.Api.csproj reference ./src/Adapter.Kafka/Adapter.Kafka.csproj
dotnet add src/Adapter.Api/Adapter.Api.csproj reference ./src/Adapter.PostgreSQL/Adapter.PostgreSQL.csproj
```

Before we start, your dependency diagram may look something like this.

![Before Startup project](/images/archive/hexagonal-architecture/before-startup-project.png)

#### 1. Create a new console project

```bash
dotnet new console -n Application.Api -o src/Application.Api
dotnet sln add src/Application.Api

```

#### 2. Change old startup project (_Adapter.Api_) to a library. Edit the _.csproj_ and add the Output Type as a library

```xml
  <PropertyGroup>
    <OutputType>Library</OutputType>
  </PropertyGroup>
```

#### 3. Remove references to other adapters from old startup project (_Adapter.Api_).

#### 4. Add references to the new project

```bash
dotnet add src/Application.Api/Application.Api.csproj reference ./src/Adapter.Kafka/Adapter.Kafka.csproj
dotnet add src/Application.Api/Application.Api.csproj reference ./src/Adapter.PostgreSQL/Adapter.PostgreSQL.csproj
dotnet add src/Application.Api/Application.Api.csproj reference ./src/Adapter.Api/Adapter.Api.csproj
```

#### 5. Convert the _Program.cs_ for the old startup project (_Adapter.Api_) into a class

I like to split the building from the running.

```csharp
public class AdapterApi
{
    private WebApplicationBuilder _builder;

    public AdapterApi(string[] args)
    {
        _builder = WebApplication.CreateBuilder(args);

        _builder.Services.AddControllers();
        _builder.Services.AddEndpointsApiExplorer();
        _builder.Services.AddSwaggerGen();
    }

    public Task RunAsync()
    {
        var app = _builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();
        return app.RunAsync();
    }
}

```

#### 6. Receive the Dependency Injection configuration

Add an argument to the constructor to receive an Action to configure DI.

Now the constructor will look like this:

```csharp
    public AdapterApi(string[] args, Action<IServiceCollection> options)
    {
        _builder = WebApplication.CreateBuilder(args);

        options.Invoke(_builder.Services);

        _builder.Services.AddControllers();
        _builder.Services.AddEndpointsApiExplorer();
        _builder.Services.AddSwaggerGen();
    }
```

#### 7. Setup the adapter and run the application

Now, in your new startup project (_Application.Api_) you simply setup your Adapters and run it.

```csharp
var api = new AdapterApi(args, options =>
    {
        options.AddScoped<IAddBookRead, AddBookRead>();
        options.AddScoped<IBookReadStore, PostgreBookReadStore>();
        options.AddScoped<IBookReadPublisher, KafkaBookReadPublisher>();
    }
);

await api.RunAsync();
```

Now, your diagram will look like this.

![After Startup project](/images/archive/hexagonal-architecture/after-startup-project.png)

Take a look at [this article](../how-to-apply-hexagonal-architecture-with-dotnet/) if you have any doubts about how to assemble a device-independent solution.

I hope you have found this useful.

Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.
