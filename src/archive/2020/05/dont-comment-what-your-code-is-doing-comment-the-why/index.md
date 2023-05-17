---
layout: post
tags: post
date: 2020-05-22
title: Don't comment what your code is doing, comment the Why
description: Code Comments are a good idea. But we use a lot of comments that don't help. This explains the Comments bad reputation nowadays.
---

Code comments are a common topic of love/hate discussions.
It's particularly interesting to see developers shifting opinion while experience grows.

Code Comments are a good idea because we are writing them down to help others. Even to help the future self.
But we use a lot of comments that don't help. This explains the Comments bad reputation nowadays.

So, what can we do to improve our comments?

I use a simple rule: **Explain the Why, not the What.**

I see a lot of Comments that are explaining what the code is doing. That doesn't help.
The effort that we put to write a Comment must be invested refactoring the code ([this is a good starting point](https://gsferreira.com/archive/2019/10/a-simple-tip-to-improve-your-code-maintainability-decompose-if-statements-into-methods/)).
**When we need to describe the What is because the code isn't readable at all.**

It's also pretty common to have obvious Comments. All we have seen that _"// Get a Customer"_ comment in a _"GetCustomer"_ method.

<div style="width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/gF8vDz0XAUfIWx9jUW" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/memecandy-gF8vDz0XAUfIWx9jUW">via GIPHY</a></p>

Those comments don't bring value. They raise the cognitive load required to read and maintain the code.

So, the idea is to **let the code speak for himself**. We only write comments, when we need to explain Why we have done something.

It's useful to understand why a piece of code was written in a certain way.
Those Why comments can help us out to understand that there's a particular corner case, or the reason for the followed approach, or that, because of a bug (Link the bug from the comment), we need to do that.
Those are a few examples, but you get the point.

Our code must be self-describing, but sometimes, we need to explain the Why.

And remember: **don't Comment the code that you don't need anymore. Throw it away.** In case you need it, it will be at the source control.
