---
layout: post
tags: post
date: 2022-08-16
title: Finding .NET Transitive Dependencies and Tidying Up Your Project
description: Clean up .NET transitive dependencies with Snitch tool - identify unnecessary references, reduce package conflicts, and optimize projects.
featured_image: /images/archive/csharp/snitch/snitch-result.png
---

Do you remember DLL Hell? 😈 Yes, me too.

If you don't remember, I'm happy for you. No Developer should suffer like that.

Unfortunately, NuGet Packages and References can be (rarely) a new form of Hell. A soft version of Hell, let's be honest. Not the same type of Hell from `node_modules`. 🤪

**When solutions grow in size, it's common to see projects referencing multiple versions of the same package or duplicated references.**

Today, I want to tell you about [**Snitch**](https://github.com/spectresystems/snitch). Snitch is a simple [.NET tool](https://docs.microsoft.com/en-us/dotnet/core/tools/global-tools) that:

> _"help you find transitive package references that can be removed."_

That sounds cool. 👍

## 🖇️ Transitive Dependencies

Let's start by defining what a Transitive Package Reference (or Transitive Dependency) is.

**A Transitive Dependency is a dependency induced by the dependencies of the direct references of that project.**

Let me give you an example.

Imagine that you have projects A, B and C. The dependency flow is `A -> B -> C`. So, Project A references Project B, which references Project C. In this case, A is transitively dependent on C. Why? Because it was induced by the dependencies of the direct reference Project B.

![Transitive Dependency](/images/archive/dotnet/transitive-dependency.png)

Now we know what Transitive Dependencies are.

## 🤔 Transitive Dependencies eventual problems

A question still remains: How does that contribute to Dependency Hell?

Ok. Let's get back to our Projects A, B and C.

This time, Project A will depend on both Project B, and C. Project B and C don't know each other.

Now imagine you have `Newtonsoft.Json` version `12.0.2` installed in A, B and C. Next time you need to update it, you update on A and B. You completely forgot C. That can lead to a mess.

You probably noticed in the example above that we not only have a problem with having multiple versions of the same package, but we also have a dependency that can be removed since it's already a transitive dependency.

We are talking about Project A referencing `Newtonsoft.Json` as well, where its dependencies already reference it.

**If you like to keep things clean 🧼 and tidy 🧹, I bet that now you can see the value of it.**

## 🧹 Using Snitch

The best part is that **Snitch is simple and frictionless**.

You just install the tool and run it.

Let's see how.

To install, it's a simple dotnet tool. Once you have .NET CLI installed, just run:

```
dotnet tool install -g snitch
```

Then, using the terminal, navigate to the folder of a .NET solution and run:

```
snitch
```

You will likely see a beautiful result like this:

![Transitive Dependency](/images/archive/snitch/snitch-result.png)

Out of curiosity, Snitch has this elegant user experience since it's based on [Spectre.Console](https://github.com/spectreconsole). Go check it out (after you finish reading) and give it a start on GitHub. [Patrik Svensson](https://github.com/patriksvensson) has a track record of awesomeness ⭐.

Now that you have executed it, you can clean your solution. I bet you have found some things that you were not aware of.

## 🤞 Hope and Wrap Up

Like anything that Patrik Svensson does, this project looks amazing.

There's only one thing that I would love to have here. I would love that Snitch could consider the dependency tree of installed NuGet packages. So, when you install `"Newtonsoft.Json"` (as an example), Snitch would be able to know that you are depending on version "1.x" of `"System.Runtime.Serialization.Primitives"` and use that information to help you out.

Even without that, it's a super helpful tool.

Give it a try. **I bet it will be part of your toolbox.**

Let me know if you have found it useful, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.
