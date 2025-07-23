---
layout: post
tags: post
date: 2022-06-03
title: The Complete Guide to C# 11 Raw String Literals
description: Complete C# 11 Raw String Literals guide - escape-free JSON, SQL, XML strings with triple quotes and indentation handling.
featured_image: /images/archive/csharp/raw-string-literals-json.png
---

First things, first.

**Why should you care?** Because strings with escaping are hard to read and maintain.

**Is it just for JSON objects?** No!

**Is it for you?** Hell, yes! 😎

Wanna see it? 👇

Do you know what is unmanageable and ugly C# code? Any kind of text that to be a C# string needs to be heavily escaped. Yap... JSON objects are one of those.

Even if you are a lucky [JetBrains Rider](https://www.jetbrains.com/rider/) user, like me 🤘, and your object is magically escaped ([see here](https://twitter.com/gsferreira/status/1532643248409350145)), you know how painful it is to read or maintain that string.

Can you imagine how awesome it would be if we could grab a JSON, a SQL, XML, YAML, or a WhateverL (don't bother about googling it, I just made it up), paste it into a string, and it just works? It just works, no magic tricks. No automation.

How awesome would it be if you don't need to escape quotes?

What about pathing? Oh, all that leading white space that we love. 😒

It's hard to imagine that world. For C# developers, this has been this way for a long time. It's one of the things that I couldn't imagine changing in C#. I was sure that this would always be this way. As sure as I was that Game of Thrones would have a great final season.

🛎️ Ding! 🛎️ Ding!

I was wrong. Twice!

## 👑 Hail to the new Raw Strings Literals

_I’m writing this when C# 11 and [Raw String Literals are in Preview](https://devblogs.microsoft.com/dotnet/csharp-11-preview-updates/)._

C# will solve this mess for once with [Raw String Literals](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-11#raw-string-literals).

![Raw String Literals / JSON Object](/images/archive/csharp/raw-string-literals-json.png)

**So, what are Raw String Literals?**

Raw String Literals is a simple way to define a text block and avoid escape nightmares, fighting with pathing or guessing how many double quotes you need. It will make you more productive and improve maintainablity.

You can simply do it by using a set of **at least 3 double quotes** (`"""`) for opening and closing the Raw String Litteral.

```csharp
var text = """Hello World!""";

text.Should().Be("Hello World!");

// Equal to:
// Hello World!
```

I know that you are already thinking about how to break the system 😤.

You are probably asking: _What if I want 3 double quotes in my text?_

I’m glad that you asked. It's here that the thing becomes clever, my friend.

Not sure if you noticed, but a few paragraphs above, I've written: _"at least 3 double quotes"_. That "at least", is important.

A Raw String Literal will be anything between a pair of 3 or more double quotes.

The rule is simple.

- If your string needs to have a **sequence of 3 double quotes**, you will need to open and close the Raw String Litteral with **at least 4 double-quotes**.
- If your string needs to have a **sequence of 4 double quotes**, you will **need at least 5**.
- If your string needs to have a **sequence of 5 double quotes**, you will **need at least 6**.
- If your string needs to have a **sequence of 6 double quotes**... you get it.

It may look strange, but it's pretty effective since you are not constrained. And it’s future proof.

## 😒 Pathing madness

Do you put a lot of effort into formatting your [verbatim strings](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/verbatim)? I do.

But, often you can't keep it perfect in source code and runtime. You need to pick one and assume that the other will not be perfect. As [Kent Beck](https://www.kentbeck.com/) says, "it's all about trade-offs".

SQL queries are one of those cases. I always craft them carefully until the moment I see them in runtime. 🤢

```csharp
var text =
        """
        SELECT Name
        FROM Customers
        WHERE id = @id
        """;

// Equal to:
// SELECT Name
// FROM Customers
// WHERE id = @id

var text =
        @"
        SELECT Name
        FROM Customers
        WHERE id = @id
        ";

// Equal to:
//                SELECT Name
//                FROM Customers
//                WHERE id = @id


```

With Raw String Literals, we can finally solve that. How? Let's take a look.

The end sequence of double-quotes is the commander in chief of pathing. If you want to remove the left path, you simply align it with the opening sequence of double quotes. Boom! 💥 Just that and leading white space was through away! Whitespace to the left of the closing quotes will be removed.

```csharp
var text =
        """
        SELECT Name
        FROM Customers
        WHERE id = @id
        """;

text.Should().Be($"SELECT Name{System.Environment.NewLine}FROM Customers{System.Environment.NewLine}WHERE id = @id");

// Equal to:
// SELECT Name
// FROM Customers
// WHERE id = @id

text =
        """
        SELECT Name
        FROM Customers
        WHERE id = @id
    """;

text.Should().Be($"    SELECT Name{System.Environment.NewLine}    FROM Customers{System.Environment.NewLine}    WHERE id = @id");

// Equal to:
//     SELECT Name
//     FROM Customers
//     WHERE id = @id

```

## 💲 Interpolation in Raw String Literals

More often than not, your long strings are not constants or static. You may be interpolating it with a name, age, amount, or another variable.

You can do it as well in a Raw String Literal.

There's just one thing you need to think about: What if you need to interpolate inside curly braces? In other words, what if the result should be visible inside curly braces?

WAIT! It's not another escaping madness. I promise you.

Raw String Literals have a simple way to solve that as well. And it's future proof! Once again. 😅

So, if you need to accept curly braces, you open the Interpolated Raw String Literal with an extra dollar sign.

```csharp
{% raw %}
var name = "Guilherme";
var text =
        $$"""
        Hello {{{ name }}}!

        Welcome to the Team!
        """;

text.Should().Be($"Hello {{Guilherme}}!{System.Environment.NewLine}{System.Environment.NewLine}Welcome to the Team!");

// Equal to:
// Hello {Guilherme}!
//
// Welcome to the Team!
{% endraw %}
```

You define the same number of dollar signs needed to interpolate.

So, if you need to have a sequence of 3 curly braces, you just need to use 4 dollar signs and 4 curly braces to interpolate.

```csharp
{% raw %}
var name = "Guilherme";
var text =
        $$$$"""
        Hello {{{{{{{ name }}}}}}}!

        Welcome to the Team!
        """;

text.Should().Be($"Hello {{{{{{Guilherme}}}}}}!{System.Environment.NewLine}{System.Environment.NewLine}Welcome to the Team!");

// Equal to:
// Hello {{{Guilherme}}}!
//
// Welcome to the Team!
{% endraw %}
```

### ⏭️ What's next

**My take on it:** I will use it! I want it!

I will be converting many SQL statements, JSON objects or Test expectations.

I believe you should too! While I'm writing, C# 11 is in Preview, and we still need to wait for it. But, once you start using C# 11, think about it before going wild with double quotes or backslashing.

🔗 You can find the source code used [here](https://github.com/gsferreira/dotnet-playground/tree/main/csharp/11/RawStringLiterals).

See ya! In the meanwhile, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch. 😉
