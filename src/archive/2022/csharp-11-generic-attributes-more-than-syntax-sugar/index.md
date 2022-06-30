---
layout: post
tags: post
date: 2022-06-30
title: C# 11 Generic Attributes More Than Syntax Sugar
description: Generic Attributes were missing for a long time in C#. Since they are arriving, let's see what that means.
featured_image: /images/archive/csharp/generic-attribute.png
---

Let me be honest. C# 11 is finally bringing [Generic Attributes](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-11#generic-attributes), but oh, boy! They are hard to sell.

Unless you are a library developer or into code generators, you may not see the benefit of this one. BUT (there's always a but), please bear with me! I believe that Generic Attributes is the stepping stone to many quality of life improvements across the framework.

## 1️⃣ First things first: Why should you care?

Do you know when you use a `ServiceFilterAttribute` and have to provide the type? Something like this:

```csharp
[ServiceFilter(typeof(ResponseLoggerFilter))]
```

That syntax isn't pretty. It's verbose.
That makes working with that type painful. The worst part is that **it doesn't seem natural in C#**.

In C#, we are used to Generics to this kind of thing, so you would probably expect something like this:

```csharp
[ServiceFilter<ResponseLoggerFilter>]
```

Isn't it? GOOD NEWS! Is exactly it that will be possible.

It's important to say that the title of this post is not a SCAM or clickbait. Generic Attributes are not only about this change.

## 🤔 What am I gaining with it?

Once C# support it, Attribute developers will gain more than a shorter syntax. You know I LOVE 🥰 simplicity. But we are not here only for that.

**The most important win is that now, you can apply constraints.**

Let me explain that in different terms: **You will detect issues in compile time, not runtime.**

If that is not a good selling point to you, I don't know what to do to amuse you. I'm sold on it!

## 🤓 Show me the code

Let me explain with code. As Abraham Lincoln used to say _"A code snippet is worth a thousand words."_ 🤪

**\*Important:** This is an academic example. The idea is to demonstrate the potential of Generic Attributes in simple terms. I will do it using MVC Filters for the sake of simplicity.\*

Imagine you have an MVC API. You want to support a set of filters to enrich your Response Headers.
The caveat is that you don't know which headers. You need to keep it extensible.

One option to do it with Generic Attributes is by defining an Attribute with a Generic type.

```csharp
public class ResponseHeadersEnrichFilterAttribute<T> : Attribute, IFilterFactory
    where T : BaseHeaderEnrichFilter
{
    public bool IsReusable { get; }

    public IFilterMetadata CreateInstance(IServiceProvider serviceProvider)
    {
        if (serviceProvider == null)
            throw new ArgumentNullException(nameof(serviceProvider));

        var filter = (IFilterMetadata)serviceProvider.GetRequiredService<T>();

        if (filter is IFilterFactory filterFactory)
            filter = filterFactory.CreateInstance(serviceProvider);

        return filter;
    }
}


public abstract class BaseHeaderEnrichFilter : IActionFilter
{
    private readonly string _name;
    private readonly string _value;

    protected BaseHeaderEnrichFilter(string name, string value)
    {
	    _name = name;
        _value = value;
    }

    public void OnActionExecuting(ActionExecutingContext context) =>
        context.HttpContext.Response.Headers.Add(
            _name, _value);

    public void OnActionExecuted(ActionExecutedContext context) { }
}

```

Notice that we are applying a constraint to the possible Type of `T`.
By doing it, if I provide a filter that doesn't inherit from _BaseHeaderEnrichFilter_, I will get a compilation error.

After doing that, defining the Filters is simple. As you can see, we are defining a simple _VersionHeaderEnrichFilter_ that inherits from our Base Header Filter. We are doing it for Version, but we can extend it to other headers.

```csharp
public class VersionHeaderEnrichFilter : BaseHeaderEnrichFilter
{
    public VersionHeaderEnrichFilter()
		: base("Version", "2.0")
    {
    }
}
```

And using it is even simpler. Register the filter in Dependency Injection, and add the Attribute to your controller.

```csharp
[ResponseHeadersEnrichFilter<VersionHeaderEnrichFilter>]

public class WeatherForecastController : ControllerBase
{

}
```

## 🧙‍♂️ Predicting the future

I'm not as good as a wizard. Never read Harry Potter 🪄.
But let me share with you where I see this going.

In the short term, developers building code generators will have much to gain from it. If you have some advanced use of MVC ServiceFilters, you may also want to take a deeper look into it.

For the rest of us, I can foresee existing attributes in the framework changing in a couple versions to adopt this more expressive, simple approach. As an example, we may get an improved ServiceFilterAttribute that supports generics.

Even then, I'm excited by seeing a long waited feature being released.

While we wait, if you have any use case for it, let me know. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

🔗 You can find the source code used [here](https://github.com/gsferreira/dotnet-playground/tree/main/csharp/11/GenericAttributes).
