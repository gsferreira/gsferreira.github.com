---
layout: post
tags: post
date: 2018-01-08

title: JSON Patch Builder Online
---

Do you know the JSON Patch format? The [RFC6902](https://tools.ietf.org/html/rfc6902) defines the structure to express a list of operations to apply over a JSON Document.
This format is designed to be the payload of an HTTP PATCH method.

The format isn't difficult, you can easily understand the rules and build it manually. But, I confess that sometimes I struggle with it, specially when I'm testing a PATCH to a complex object.
So... **[I built a Tool to help me.](https://json-patch-builder-online.github.io/)**

![JSON Patch Builder Online](/images/json-patch-builder-online.png)

**[JSON Patch Builder Online](https://json-patch-builder-online.github.io/)** is a simple and Open Source tool that you can use to calculate the JSON Patch needed to transform a resource/entity in the resource that you want.

To accomplish that, I used [JSON-Patch](https://github.com/Starcounter-Jack/JSON-Patch), a Javascript library, to calculate the Patch and [BULMA CSS](https://bulma.io/) to have a good looking tool.
I recommend that you go check them.

If you have something that you want to see in the **[JSON Patch Builder Online](https://json-patch-builder-online.github.io/)**, feel free to open an [Issue](https://github.com/json-patch-builder-online/json-patch-builder-online.github.io/issues) or [Contribute](https://github.com/json-patch-builder-online/json-patch-builder-online.github.io/).

Links:

- [Github](https://github.com/json-patch-builder-online/json-patch-builder-online.github.io/)
- [JSON Patch Builder Online](https://json-patch-builder-online.github.io/)

I hope that this helps you.
