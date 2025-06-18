---
layout: post
tags: post
date: 2022-02-23
title: Quick Wins for .NET build pipelines
description: Small tips to optimize your .NET build pipelines with .NET CLI.
featured_image: /images/archive/dotnet/dotnet-cli-build-optimizations.png
---

Faster builds are equal to faster feedback cycles 🚀, happier developers 😁, and money saved 🤑.

So, even **if you shave just a few seconds, it's an investment that compounds.**

If you have a .NET Core or .NET 6 (or later) application being built as part of your CI/CD process, it will be using the [.NET CLI](https://docs.microsoft.com/en-us/dotnet/core/tools/) for sure. Even, if you point and click through [TeamCity](https://docs.microsoft.com/en-us/dotnet/core/tools/), [Jenkins](https://www.jenkins.io), etc. configuration, behind the scenes .NET CLI will be running. So, the following tips are likely for you.

You can create a .NET build script with just a few simple commands like the following ones:

- `dotnet build`
- `dotnet test`
- `dotnet publish`
- `dotnet pack`

But you can do better than that. Each CLI command has a bunch of options that can be provided and they assume default behaviours when you don't specify them.

## Options for optimization

There are 4 options that I want to pay close attention to and are the ones that will be responsible for our optimizations.

- `--configuration <CONFIGURATION>`
- `--no-restore`
- `--no-build`
- `--nologo`

### `--configuration <CONFIGURATION>`

It will define the build configuration. The problem with Configuration is that by default, it will use `Debug`.

Since you want to publish your software using `Release` mode, you may end up in a place where you use different Configurations on different steps. That means that the following build steps may need to rebuild.

### `--no-restore`

Particularly important for the build step.

The CLI uses implicit restore, so you don't need to run `dotnet restore`. But, if you want to have a step running `dotnet restore`, you can disable the implicit restore in the build step, so the CLI doesn't need to check if it's needed.

### `--no-build`

By default, steps like `"test"` or `"publish"` will try to build the software if needed.

If you set the `--no-build`, it will not build the project before running that step. By doing so, it implicitly uses the `--no-restore` flag.

One of the advantages of using the `--no-build` option, is that it helps you spot problems with previous step configuration. Example: if all the steps use `--configuration Release`, besides `dotnet pack`, the `dotnet pack` step will fail. Without the `--no-build` option, the problem would go unnoticed, and the project built again.

### `--nologo`

With `--nologo` Microsoft copyright banner will not be displayed. It is a minor detail, but it's a simple way to remove clutter from your build logs, and IO has a cost even if residual.

Those are details for sure, but they will help you prevent inefficiencies in the build process. Sometimes you may save 1 second, and other times 1 minute, but don't forget that build time savings compound fast.

```powershell
dotnet build --configuration Release --nologo
dotnet test --configuration Release --nologo --no-build
dotnet publish --configuration Release --nologo --no-build
dotnet pack --configuration Release --nologo --no-build
```

I hope that this was useful! If you managed to shave some seconds from your pipeline, please let me know. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
