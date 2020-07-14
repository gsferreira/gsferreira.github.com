---
layout: post
tags: post
date: 2017-11-15

title: Implementing the HTTP Prefer Header with an ASP.NET Core Filter
category: ASP.NET Core
---

Have you heard about **Prefer Header for HTTP**? The [RFC-7240](https://tools.ietf.org/html/rfc7240) defines how this header can be used by a client, in order to request that certain behaviors be employed by a server while processing a request.

Why does it matter? You probably have consumed API's where you use the HTTP POST or PUT method to modify a resource and the server returns a complete representation of the resource. In other cases the API only returns the Identifier of the resource created, for example.

**What if you want to defer to the client to specify which optional behavior is preferred?**
That's why you need to know about the HTTP Prefer Header.

The RFC specifies a group of Preference Definitions like a preference to indicate that the client prefers the server to respond asynchronously to a response for example, but this post will be focused on the "return=representation" and "return=minimal" preferences.

## "return=representation"

> The "return=representation" preference indicates that the client
> prefers that the server include an entity representing the current
> state of the resource in the response to a successful request.

## "return=minimal"

> The "return=minimal" preference, on the other hand, indicates that
> the client wishes the server to return only a minimal response to a
> successful request.

This preference is really useful when dealing with replies to a POST, PUT or PATCH request.

**The selection of which type of response to return to client have impact on what a client must do after receiving the response.** Example: by returning a representation of the resource in the response the client won't need to do an additional GET request.

# How to implement in ASP.NET Core?

One of the first questions that I faced when trying to implement the prefer header was _"how to implement it in ASP.NET Core?"_.

The easy answer would be:

- Do it in your Controller Action. Easy peasy, right?

Not so sure my friend!

Following that approach will be difficult to manage when you face yourself with dozens of Controllers each one with a POST and a PUT. Now you see it... the beauty of the duplicated code :)

So, what if we write an ASP.NET Core filter?

> If you don't know what is a Filter I recommend you to go read [here](https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/controllers-and-routing/understanding-action-filters-cs).
>
> If you find yourself wondering why don't create a Middleware, please see this [awesome video](https://channel9.msdn.com/Series/aspnetmonsters/ASPNET-Monsters-91-Middleware-vs-Filters).

## Setup

In my implementation, I defined that DTOs that can be controlled by the "return=minimal" preference should implement an interface _"IIdentifiable"_. That interface specifies the properties that I need to return in the "minimal" version (an Id for instance).

So, go ahead and create an _IIdentifiable_ interface and add it to your DTO.

## The filter

I implemented an Action Filter that will only return the full object when the client sends the _"return=representation"_ preference.

So the flow is something like:

1. POST a new Resource
2. Handle the request
3. Return an Action Result with a DTO in it
4. Catch the response in a filter
   - The Request doesn't have the Prefer header?
   - The Request has the Prefer header without the value "return=representation"?
   - If the answer to any of the previous questions is "Yes", I update the result to a new object with the minimal information.

The filter:

<script src="https://gist.github.com/gsferreira/80aa93d12633c0df271a08f6dc2e52ca.js?file=HttpPreferReturnHeaderFilterAttribute.cs"></script>

_As you can see I am creating a new IdentifiableDto. That class is just a simple implementation of the IIdentifiable interface. If you prefer, you can just return a dynamic object._

Now you can use it in your Controllers like this:

<script src="https://gist.github.com/gsferreira/80aa93d12633c0df271a08f6dc2e52ca.js?file=Controller.cs"></script>

**\*Note:** If you need to do an extra effort to load the resource from the database, probably the Filter approach isn't the best fit for you.\*
