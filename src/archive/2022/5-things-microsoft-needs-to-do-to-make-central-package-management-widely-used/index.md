---
layout: post
tags: post
date: 2022-09-05
title: 5 things Microsoft needs to do to make Central Package Management widely used
description: 5 improvements needed for .NET Central Package Management adoption - tooling enhancements, IDE support, and developer experience.
featured_image: /images/archive/dotnet/directory-packages-props-file.png
---

There's no perfect governance model. But there's no doubt that a centralized authority model eliminates ambiguity and improves speed.

That's why Central Package Management has so many adopters across the language spectrum.

If you have ever used [Paket](https://fsprojects.github.io/Paket/), nothing here is new to you. What is new is that .NET now has an official [Central Package Management](https://devblogs.microsoft.com/nuget/introducing-central-package-management/). Why is that good? **Because being a Microsoft solution, the chances of having proper tooling around it is enormous.** And we know how the community tends to prefer tools coming from Microsoft. But **this is not a game changer yet.** The experience is not what we got used to in the .NET ecosystem. At least for now.

If Microsoft invests energy in that, this can be a game changer. The way that we manage dependencies may change forever.

Here we will see 5 things that need to happen to make this a success.

## What is Central Package Management

Before we start, let's see what Central Package Management is.

With Central Package Management, you start defining your packages and their versions in a single centralized place (`Directory.Packages.props`). By doing that, you can **control package versions used in a single place**.

![Directory.Packages.props](/images/archive/dotnet/directory-packages-props-file.png)

Then, **each project will need to opt-in to the packages they need**. They don't need to specify the version. That is already defined in the centralized definition.

If you want to see more about how it works, you can read the announcement [here](https://devblogs.microsoft.com/nuget/introducing-central-package-management/) or take a look at [Claire Novotny talk at NDC London](https://youtu.be/C_2BStepVKw?t=3102).

Now that we know what is Central Package Management, let's take a look at why the existing solution, announced in April 2022, will not fulfill its prophecy. At least while some things aren't addressed. Let's take a look at 5 things that need to change so that can happen.

## ✅ The 5 things to do

### 1. Tooling

We know the importance of tooling in the .NET space.
Currently, the experience isn't good when using Visual Studio or the CLI.

Microsoft needs to **provide a delightful experience for Visual Studio and CLI**.
**That will not only increase the adoption but also force other tools like Rider to adopt it as well.**

### 2. CLI Experience

We got used to having CLI in our lives since .NET Core, and some of us can't live without it anymore. That means that **Central Package Management can't be only a question of Visual Studio tooling but also part of the default CLI experience**.

I expect that running a command inside a project with Central Package Management, and managing references act accordingly.

I get that it can be hard since the "`Directory.Packages.props`" file can live anywhere in the folder structure, but at least we should be able to achieve that through arguments or flags.

### 3. Migrations

The biggest benefit of centralized package management will be for the complex solutions. But, **the cost of moving is high if we expect people to do it manually**.

There are already some Open-Source tools like [CentralisedPackageConverter](https://github.com/Webreaper/CentralisedPackageConverter), but **having the migration as part of the CLI is one small step to removing friction**.

### 4. Templates

**We know the power of defaults**. Microsoft is slowly convincing most of us that we don't need all that clutter in our "`Program.cs`" by changing the default templates.

If the same thing happens to package management, we will see adoption ramping up. Once again, it may be through the use of flags and arguments.

### 5. Samples

In the .NET world, it is easy to find good samples built by Microsoft that quickly become a how-to-do things reference.

Once we have proper tooling in place, this would be the next step.

Adopting Central Package Management in projects like [eShopOnWeb](https://github.com/dotnet-architecture/eShopOnWeb). **Seeing it in place will signal to the community that you can confidently adopt it**.

## ⏭️ Wrapping up

If you are excited about managing dependencies centrally, I invite you to play around with [Paket](https://fsprojects.github.io/Paket/). An Open-Source tool in the space for a long time.

**Central Package Management can be a game changer, but only if we see a perfect alignment between Tools and Default practices.**

If that happens Package Management in .NET will be profoundly changed.
It's up to Microsoft.

Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.
