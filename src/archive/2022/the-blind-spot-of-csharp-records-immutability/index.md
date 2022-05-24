---
layout: post
tags: post
date: 2022-05-24
title: The Blind Spot of C# Records Immutability
description: The excitement with Records immutability, has some blind spots. It's easy to fall into a trap and break the desired immutability. Nevertheless, there's a simple rule that can bring a light on potential problems.
featured_image: /images/archive/csharp/record-with-mutable-collection.png
---

Have you been using [Records in C#](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record)?

Do you use them for immutability?

Are you sure they are immutable?

Do you use Lists?

So, let me tell you that **you may have some unexpected mutable ones**.

![Record with mutable collection](/images/archive/csharp/record-with-mutable-collection.png)

Good news! It’s not your fault.

## The promised immutability in one line

Before you keep reading, let me address the elephant in the room. You may be thinking: _"Guilherme, immutability in .NET is a lie"_.

Let me tell you, my friend, that's a different discussion.

If you don’t value the way .NET addresses immutability, you can stop reading here. This post is not for you.

If you are reading this line, thanks for not leaving the boat. I promise you that **there’s value in Immutable data structures in one line**. How can you not love it? 😍

Besides the people that stop reading two paragraphs above, I only know one person who doesn’t make a big deal about it. It’s my daughter. She’s 5.

## A simple rule

They told us that Records would be simple. But **Records require an extra level of attention**. What wouldn’t be a problem if our attention wasn’t devoted to Twitter or Reddit.

You know that the way you declare them can make them mutable. But, once you master it, it doesn't stop there.

![Tweet / Records Immutability](/images/archive/tweets/records-immutability.png)

_[(here)](https://twitter.com/gsferreira/status/1467045497441595393?s=20&t=2ELu4AZwZnuIV_qBwjZEcw)_

The question stands. How can you fulfil the prophecy of immutable data structures in one line?

You can do it with a simple rule. 👇

**_Record Properties must be a Primitive, a Record or a Read-only/Immutable collection to preserve immutability._**

Simple! Isn’t it? Not as simple as knowing where to click to Google search. But simpler than fixing a bug on a Friday afternoon.

Keep an eye on mutable properties, and it will be fine.

## A rule in practice

Let’s see this thing in action?

The idea is simple. You avoid mutable collections and classes with public modifiers as record properties.

Take a look at the following Record.

```csharp
public record Album(string Title, string Artist, List<Song> Songs);

var songs = new List<Song> { new("Hold On", 265) };
var album = new Album("Down the Way", "Angus & Julia Stone", songs);

album.Songs.Add(new Song("Black Crow", 230));

album.Songs.Count // 2
```

As you can see, you can set the collection 😱

How can we refactor this into an immutable record?

It’s simple, put a Read-Only or Immutable Array in action.

**Read-Only**

```csharp
public record Album(string Title, string Artist, IReadOnlyCollection<Song> Songs);

var songs = new ReadOnlyCollection<Song>(new[] { new Song("Hold On", 265) });
var album = new Album("Down the Way", "Angus & Julia Stone", songs);

album.Songs.Add(new Song("Black Crow", 230)); // ❌
// You can't even doing it 👆
```

**ImmutableArray**

```csharp
public record Album(string Title, string Artist, ImmutableArray<Song> Songs);

var songs = new[] { new Song("Hold On", 265) }.ToImmutableArray();
var album = new Album("Down the Way", "Angus & Julia Stone", songs);

album.Songs.Add(new Song("Black Crow", 230));

album.Songs.Length // 1
```

## Putting it in action

It may look like common sense, but it's easy to go undercover.

Now that you know the blind spot, it’s time to take action.

Do you have Records in place? Go check them to see if:

- Are you using Lists or Arrays as properties?
- Are you using types with public modifiers as properties?

Swap them with an Immutable Array, Read-Only Collection or Record.

After that, you just need to do one more important thing. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch. 😉
