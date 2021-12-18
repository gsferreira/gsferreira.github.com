---
layout: post
tags: post
date: 2021-12-11
title: Where to place C#10 Global Usings
description: Global Usings are a new possibility and there are no guidelines on where to declare them. This is my take on how I will be declaring them and how.
featured_image: /images/archive/highlight/where-to-place-c10-global-usings.png
---

The new C# 10 is packed with quality-of-life features. One that I'm definitively using is [Global Usings](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/using-directive#global-modifier).

In simple terms, Global Usings is a way to declare usings at the project level, so you don't need to declare them in every single file.

## Why should I care?

That's a fair question, especially in the days where IDE's do most of the work for us. 

Even then, declaring them at the project level will result in tidier source files. Let's be honest, how many times do you import `System.Linq` or your own Extensions namespace?


## How can I do it?

Global Usings are simple to use. Simply add the `global` modifier to the `using` you want.

Adding the `global` modifier is the same as adding the same `using` directive to every source file in your project. 

That leads to the question: *Where should I declare my global usings?* 

I was facing that same question. 🤔

One thing was obvious to me. I should have a central place for it. Even [Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/using-directive#global-modifier) say so:

> You may add global using directives to any source file. Typically, you'll want to keep them in a single location. The order of global using directives doesn't matter, either in a single file, or between files.


But, where? In a Web or Console project, you may use "Program.cs" for it, but rapidly it may become cluttered. And if it is a Class Library?! There are no "Program.cs".


### So, I asked my Twitter friends what would they do.

![Tweet / Where to add gloabal usings.](/images/archive/tweets/global-usings-where-to-place-question.png)

_[(here)](https://twitter.com/gsferreira/status/1464293275511177217)_


If you take a look at the comments, you will see many good suggestions around adding a file to the root of the project. Name suggestions vary as you can see:

 - Globals.cs
 - GlobalUsings.cs
 - Imports.cs

That seems a good approach, but there was a comment by [Martin Costello](https://twitter.com/martin_costello) that made my mind.

## My preferred way

Before going into Martin suggestion, it's important to say that you can not only declare `global usings` in a `.cs` file but also at the project file.

That can be done by adding a `<Using>` item to your project file.

```xml
<ItemGroup>
    <Using Include="MyAwesomeApp.Extensions" />
</ItemGroup>
```

In principle, I would prefer to declare my usings in C#. I don't love to edit my `csproj` files, but Martin remembered me that I can do it in a `Directory.Build.props` file (if you want to know more about this file, take a look at [this post](https://gsferreira.com/archive/2018/06/versioning-net-core-applications-using-cake/) that I've written to see the potential).

![Tweet / Global Usings - Directory Build Props](/images/archive/tweets/global-usings-where-to-place-question-directory-build-props.png)

_[(here)](https://twitter.com/martin_costello/status/1464498288061816838)_



### So, what's the beauty of it?

The beauty of it is that if you place `Directory.Build.props` in the root folder that contains your source code, when MSBuild runs will add to every project the properties defined in the `Directory.Build.props`. So, if you want to do it Solution wise or even only for your Test folder, you can do it.

## Wrapping up

I will be using `Directory.Build.props` for sure. At least until we see a new standard way to declare global usings emerging in the community.


I hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
