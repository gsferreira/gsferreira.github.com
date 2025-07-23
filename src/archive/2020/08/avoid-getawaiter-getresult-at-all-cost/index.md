---
layout: post
tags: post
date: 2020-08-26
title: Avoid GetAwaiter().GetResult() at all cost
description: Avoid GetAwaiter().GetResult() in C# at all costs - prevents deadlocks, thread pool starvation, and ensures proper async/await usage.
featured_image: /images/archive/dotnet/getawaiter-getresult.png
---

When you need to wait for a Task, are you using _".GetAwaiter().GetResult()"_ instead of _".Result"_ and _".Wait()"_ when you are in a synchronous method? You are doing the correct thing! But only if you can't change that method!

![.GetAwaiter().GetResult()](/images/archive/dotnet/getawaiter-getresult.png)

In case you don't know, in C#, you should always aim to work with async/await when you have Tasks. You should go all way down with async/await.

If you are using _".GetAwaiter().GetResult()"_, _".Result"_ or _".Wait()"_ to get the result of a task or to wait for the task completion you may experience deadlocks or [thread pool starvation](https://docs.microsoft.com/en-gb/archive/blogs/vancem/diagnosing-net-core-threadpool-starvation-with-perfview-why-my-service-is-not-saturating-all-cores-or-seems-to-stall?s=09).

But, sometimes _".GetAwaiter().GetResult()"_ is presented as a good way to replace _".Result"_ and _".Wait()"_ when we can't use async/await. That idea can be dangerous. I agree that this is a far better solution then _".Result"_ and _".Wait()"_ because the error handling will be much better. The stack trace of a given expression will be much cleaner. But, under the wood, [_".GetAwaiter()"_ is relying on _".Wait()"_](https://stackoverflow.com/questions/17284517/is-task-result-the-same-as-getawaiter-getresult/38530225#38530225), so you may experience the deadlocks or thread pool starvation.

So, what I have to recommend you is to avoid at all cost using _".GetAwaiter().GetResult()"_, _".Result"_ or _".Wait()"_. Refactor your code from top to bottom to use async/await. Use it as a code smell that something can go wrong under stress. You will see that under stress, the system will behave so much better.

## What can I do if I can't use Async/Await?

That's a fair question. Sometimes we need to go with ["Sync over async"](https://odetocode.com/blogs/scott/archive/2019/03/04/await-the-async-letdown.aspx).

Two simple scenarios are when:

    - You have a Task in a constructor;
    - Need to respect an interface that you don't control;

In this situation, I recommend you to use _".GetAwaiter().GetResult()"_ only once. Extract a private async method that your public method can relly on.

## What's next?

Now, It's time to review your codebase and to spread the word!

Also, I recommend you to install the Threading Analyzer ([_Microsoft.VisualStudio.Threading.Analyzers_](https://github.com/microsoft/vs-threading)). It will help you to spot potential problems.


---

If this was useful, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!