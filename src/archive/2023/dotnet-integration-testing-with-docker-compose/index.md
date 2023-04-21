---
layout: post
tags: post
date: 2023-04-21
title: .NET Integration Testing with Docker Compose
description: Testcontainers is an awesome technology, but often docker-compose is just better.
featured_image: /images/archive/highlight/dotnet-integration-testing-with-docker-compose.png
---

https://www.youtube.com/watch?v=zhPFMyMMw4A

Test Containers are fantastic, but **I often find myself updating my container definition twice**: once in the `docker-compose` file and then again in the C# tests. It's like dressing twins to look identical.

So, I wondered: **Is it possible to use docker-compose for Integration Testing?**

## The Problem

In numerous projects, it's common to have a set of resources required to boot your application. Nowadays, we manage these resources using a `docker-compose` file. This file is utilized for various purposes, such as manual testing in a developer's environment, where the developer runs the docker-compose before starting the application.

The same resources are needed to run Integration Tests. Thankfully, we now have [Test-containers](https://dotnet.testcontainers.org/), which allow us to do precisely that. **Test-containers enable us to use a Fluent API to define the necessary docker infrastructure**. However, **this leads to two separate infrastructure definitions**: one in the Integration Tests and another in the `docker-compose`. **Duplicated configurations can result in not only extra work when changes are needed but also inconsistencies**.

So, why not use the same `docker-compose` file for Integration Testing?
Regrettably, **this is currently not possible with Test-containers for .NET**. Although it might become feasible to use Test-containers with docker-compose in the future, similar to [Java](https://www.testcontainers.org/modules/docker_compose/).

## Fluently Running docker-compose

The good news is that there's already a solution for .NET: [FluentDocker](https://github.com/mariotoffia/FluentDocker). FluentDocker is an open-source library that enables interactions with Docker and docker-compose using a Fluent API. It even has some testing features. However, those features don't support Docker Compose Fixtures. But don't worry, we can easily address that. Let's see how.

You can install FluentDocker using NuGet.

```bash
dotnet add package Ductus.FluentDocker
```

### Test Base

The first thing we need to do is create an abstract Test Base. This class will be responsible for finding a host, building the composite service, and disposing of it. It will serve as the foundation for our Test Fixture.

```csharp
using Ductus.FluentDocker.Services;

public abstract class DockerComposeTestBase : IDisposable
{
    protected ICompositeService CompositeService;
    protected IHostService? DockerHost;

    public DockerComposeTestBase()
    {
        EnsureDockerHost();

        CompositeService = Build();
        try
        {
            CompositeService.Start();
        }
        catch
        {
            CompositeService.Dispose();
            throw;
        }

        OnContainerInitialized();
    }

    public void Dispose()
    {
        OnContainerTearDown();
        var compositeService = CompositeService;
        CompositeService = null!;
        try
        {
            compositeService?.Dispose();
        }
        catch
        {
            // ignored
        }
    }

    protected abstract ICompositeService Build();

    protected virtual void OnContainerTearDown()
    {
    }

    protected virtual void OnContainerInitialized()
    {
    }

    private void EnsureDockerHost()
    {
        if (DockerHost?.State == ServiceRunningState.Running) return;

        var hosts = new Hosts().Discover();
        DockerHost = hosts.FirstOrDefault(x => x.IsNative) ?? hosts.FirstOrDefault(x => x.Name == "default");

        if (null != DockerHost)
        {
            if (DockerHost.State != ServiceRunningState.Running) DockerHost.Start();

            return;
        }

        if (hosts.Count > 0) DockerHost = hosts.First();

        if (null != DockerHost) return;

        EnsureDockerHost();
    }
}
```

### Fixture

Since you don't want to start the infrastructure for every single test, you'll need to create a Test Fixture. In this example, we'll use [xUnit.net](https://xunit.net/).

The Fixture will inherit from the Test Base class mentioned earlier.

In the Fixture, we can override the Build method, where we'll define the path to the `docker-compose` file.

```csharp
using Ductus.FluentDocker.Model.Common;
using Ductus.FluentDocker.Model.Compose;
using Ductus.FluentDocker.Services;
using Ductus.FluentDocker.Services.Impl;
using Microsoft.Extensions.DependencyInjection;

public class MyTestFixture : DockerComposeTestBase
{
    public MyTestFixture()
    {

    }

    protected override ICompositeService Build()
    {
        var file = Path.Combine(Directory.GetCurrentDirectory(),
            (TemplateString)"Fixture/docker-compose.yml");

        return new DockerComposeCompositeService(
            DockerHost,
            new DockerComposeConfig
            {
                ComposeFilePath = new List<string> { file },
                ForceRecreate = true,
                RemoveOrphans = true,
                StopOnDispose = true
            });
    }
}
```

Now, you can use the Fixture in your tests as you normally would, and when the tests run, the `docker-compose` will start the necessary infrastructure.

## Summary

Although FluentDocker lacks built-in Test Fixtures for docker-compose, it still provides a more unified approach for defining and managing container configurations. Give this method a try, and let us know what you think in the comments! If you have any doubts about how to do this, be sure to watch the linked video.

Keep it Simple 🌱
