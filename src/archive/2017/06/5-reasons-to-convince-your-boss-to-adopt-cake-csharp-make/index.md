---
layout: post
tags: post
date: 2017-06-26

title: 5 reasons to convince your boss to adopt Cake (C# Make)
category: Cake
---

Have you taken a look into [Cake Build](http://cakebuild.net/)?! It's awesome, isn't it?

Probably you are already convinced, but you are having trouble convincing your boss that it's worth to give him a chance.

To help you I give you here five compelling reasons they can't argue with.

![Cake Build](/images/cake-build-logo.png)

## 1. It's C# &#10084;

If you are working in a .NET shop where C# is the common language, you already have the tools to do the Job and probably isn't a good idea to adopt a new language.

The **[BUS Factor](https://en.wikipedia.org/wiki/Bus_factor)** is a good metric to illustrate the risk of adopting a new language for a build system.

Cake scripts are written in C# and you can use all the knowledge that you already have.

## 2. Living form of documentation

What is the best way to describe your system? With coded tests. So **what is the best way to describe your build? With code** for sure!

As we all know, keeping a word document up-to-date is a painful task that one day someone will forget to update it. So, if you know how to read C#, you can read a script that documents it.

You also have the bonus of having a **versioned build script** if you add it to your source control.

Isn't powerful to know that in the future you can go back and see how your software was built in the past week?

Nevertheless, doing this kind of tasks manually shouldn't be a manual process. **“For loops” are for computers** and as programmers we know how to teach them to do it.

## 3. Cross platform

With Cake, you can start **building** your software **in multiple platforms**.

If in your team, there are elements working with different operating systems, with Cake **everyone can be working in the same build script**.

## 4. Agnostic from Build Server

With Cake you can easily **move your scripts from one Build system to another**, without need to completely reconfigure the complete Build.

The best proof of this: Cake is building Cake with Cake in multiple build servers ([see it in the Continuous integration section](https://github.com/cake-build/cake)).

## 5. Healthy community

The Cake community is really active.

Cake has a huge list of Addins delivered and maintained by the community.

Also, since 2016 Cake is part of the .NET Foundation.

---

_I hope that this helps you (and convinced your boss)._
