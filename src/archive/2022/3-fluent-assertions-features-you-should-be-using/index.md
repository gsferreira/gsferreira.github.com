---
layout: post
tags: post
date: 2022-12-07
title: 3 Fluent Assertions Features You Should be Using
description: Fluent Assertions is a must-have tool for .NET Testing. It's so rich and extensive that some features aren't used enough. In this post, I will show you 3 of them.
featured_image: /images/archive/
---

I love [Fluent Assertions](https://fluentassertions.com/) 💖. And you should too.

Even if you are using it, maybe you don't know some lesser-known features of it.

But don't worry. I'm here to change that 💪.

Here are 3 features you should know if you are using Fluent Assertions.

## 1️⃣ Assertion Scopes

Take a look into the following test:

```csharp
var request = new { Code = "GF" };

var result = Process(request);

result.Successful.Should().BeTrue();
result.ErrorCode.Should().BeNullOrEmpty();
```

To assert a given behavior this test executes two assertions through Fluent Assertions, as you can see.

```csharp
result.Successful.Should().BeTrue();
result.ErrorCode.Should().BeNullOrEmpty();
```

If you execute this test and the first assertion fail, you will not know if there's any problem with the following one.

```bash
Xunit.Sdk.XunitException
Expected result.Successful to be true, but found False.
```

Assertion Scopes solve that. When you use assertion scopes, all the assertions execute before returning the result.

```csharp
var request = new { Code = "GF" };

var result = Process(request);

using (new AssertionScope())
{
    result.Successful.Should().BeTrue();
    result.ErrorCode.Should().BeNullOrEmpty();
}
```

So, the result would be:

```bash
Xunit.Sdk.XunitException
Expected result.Successful to be true, but found False.
Expected result.ErrorCode to be <null> or empty, but found "invalid_code".
```

## 2️⃣ HttpResponseMessages

Do you write tests against APIs? So, this one is for you.

When we assert the result of a HTTP call, it's common to check the HTTP Status Code.
You may be doing it like this:

```csharp
var response = await HttpRequestAsync();

response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
```

With Fluent Assertions, you can simply convert it into this:

```csharp
var response = await HttpRequestAsync();

response.Should().HaveStatusCode(HttpStatusCode.BadRequest);
```

What if you want to test if it was a success request (Status Code in the 2xx range)?
With Fluent Assertions, you can do it in this elegant way:

```csharp
var response = await HttpRequestAsync();

//2xx
response.Should().BeSuccessful();
```

The same applies to Client Errors (4xx) or Server Errors (5xx).

```csharp
var response = await HttpRequestAsync();

//2xx
response.Should().BeSuccessful();
//4xx
response.Should().HaveClientError();
//5xx
response.Should().HaveServerError();
```

## 3️⃣ DateTime Features

Date and Time assertions is so elegant.

Take a look into this little details.

If you want to define an expected date, you can do it like this:

```csharp
// instead of: new DateTime(2022, 12, 25);
var expectedDate = 25.December(2022);
```

Do you want to define the time? No problem:

```csharp
// instead of: new DateTime(2022, 12, 25, 20, 00, 00);
var expectedDate = 25.December(2022).At(20, 00);
```

What about checking if the date is Greater or Equal to an expected date?

```csharp
date.Should().BeOnOrAfter(expectedDate);
```

Is the DateTime in Local Time or UTC?

```csharp
expectedDate.Should().BeIn(DateTimeKind.Utc);
```

This are just a few examples of what you can do with DateTimes in Fluent Assertions.

## ⭐️ Bonus Feature

There's a bonus feature that you should know.
Do you know you can implement architecture tests with Fluent Assertions?
Take a look at [this video](https://youtu.be/e4w2qePKcTE) to see how to apply it.

If you want to see them in action, take a look at this video 👇

<iframe width="560" height="315" src="https://www.youtube.com/embed/7ROVlJ1cQWs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Let me know what you think about it. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Just keep things Simple 🌱
