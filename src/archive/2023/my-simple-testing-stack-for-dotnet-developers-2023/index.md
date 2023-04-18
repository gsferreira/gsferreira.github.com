---
layout: post
tags: post
date: 2023-04-18
title: My Simple Testing Stack (for .NET developers) [2023]
description: This is the list of tools that I used on my Test projects during 2022. But also the ones I'm planning to give a chance.
featured_image: /images/archive/highlight/my-simple-testing-stack-for-dotnet-developers-2023.png
---

https://www.youtube.com/watch?v=j7cBRtloLDE

Discover the tools I use for my .NET test projects!

Not only will you get an inside look at my current testing stack, but you'll also get a sneak peek at the tools I'm planning to try out. Stick around to the end to uncover these hidden gems!

## 🧰 What I Use

### [xUnit.net](https://xunit.net/)

xUnit is my go-to framework for unit testing in .NET applications. I love its clean and straightforward syntax. Besides that, it's the most used testing framework in the .NET space.

### [Fluent Assertions](https://fluentassertions.com/)

Fluent Assertions is a powerful library that elevates the expressiveness of my test assertions. Tests should reveal the intent as clearly as possible. Fluent Assertions are the perfect tool for that.

### [Moq](https://github.com/moq/moq4)

Moq is the most commonly used mocking library for .NET.
However, I confess that I have been looking into other options. Moq is a powerful tool but sacrifices simplicity, and I don't use advanced features.

### [FluentDocker](https://github.com/mariotoffia/FluentDocker)

FluentDocker is a fantastic library. With its fluent API, I can quickly spin up docker containers to create isolated testing environments that mimic real-world scenarios. I've started using it because Test-containers didn't support spinning up containers based on a docker-compose file, and FluentDocker does. That might change in the future.

### [K6](https://k6.io/)

If you don't have a go-to load-testing, soak-testing, or smoke-testing tool, you will want K6 as part of your testing toolkit.
You don't write tests using .NET. You do it with JavaScript. But trust me, it's simple and expressive.

### [Cypress](https://www.cypress.io/)

Cypress is my choice for end-to-end testing of web applications. If you have ever used Selenium, you will love this.

## 🔮 What I Plan to Use

### [NSubstitute](https://nsubstitute.github.io/)

I'm looking forward to trying NSubstitute as an alternative to Moq for creating mock objects. I have seen so many great things about it. The simplicity of NSubstitute is what seduces me.

### [Bogus](https://github.com/bchavez/Bogus)

I'm eager to explore Bogus for generating realistic test data in my .NET projects. I find it especially exciting for E2E tests. A side benefit would be using it to seed demo data.

### [Playwright](https://playwright.dev/dotnet/)

Playwright is another tool I'm excited to try out. With .NET support, it's difficult to find arguments to not try to replace Cypress.

## 👋 Wrap up

As a developer, having a reliable and efficient testing stack is crucial for ensuring the quality of your projects. If you are looking for a testing stack, copy this one and start with it. And before we go, I would love to know if you have any other tools to recommend.

Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Keep it Simple 🌱
