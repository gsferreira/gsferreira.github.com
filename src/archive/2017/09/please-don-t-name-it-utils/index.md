---
layout: post
tags: post
date: 2017-09-12

title: Please don't name it "Utils"!
description: Stop naming classes 'Utils' - improve code readability, discoverability, and maintainability with meaningful class names like Logger.
---

Imagine that you are working on a code base that you are really proud of. Everything is building up together with great quality and you reach the moment where you need to send a mail. Simple task to you for sure.

You know that eventually you will need to send emails in other points of your application and because you master the DRY principle you decide to write an _"Utils"_ class.

Good idea, isn't it? **NO!!!! Absolutely no!**

Why not? What's wrong with an _"Utils"_ folder or an Utility class?

Segregate responsibilities is an important thing, but naming is also important. Readability and discoverability are often underrated.

![Utils code sample](/images/please-don-t-name-it-utils-code-sample.png)

When you create an _"Utils"_ class you are creating a collection of random stuff. A place where anything can fit and that someone who doesn't know your project won't know what can be found inside the _"Utils"_. For them, your _"Utils"_ it's a kind of magical place where treasures and dragons can be hidden.

Please don't feel ashamed by doing that, I have done it in the past.
Phil Karlton once said:

> There are only two hard things in Computer Science: cache invalidation and **naming things**.

I prefer a name that doesn't sounds catchy than a name that doesn't make sense.

So if you are typing _"Utils"_, please stop and think what the hell will this code do? Then, name it according to that.

- Write to a Log file? Name it _"Logger"_.
- Send a mail? Name it _"MailSender"_.
- Generate a random message? Name it _"MessageGenerator"_.
- Provide string extensions? Name it _"StringExtensions"_.

You get it.
