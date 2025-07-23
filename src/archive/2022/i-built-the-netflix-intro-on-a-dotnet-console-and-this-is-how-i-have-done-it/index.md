---
layout: post
tags: post
date: 2022-11-10
title: I Built the Netflix Intro on a .NET Console, and this is how I've done it
description: Recreate Netflix intro in .NET Console - Spectre.Console animations, SkiaSharp GIF processing, and terminal graphics programming.
featured_image: /images/archive/dotnet/netflix-intro-dotnet-console.png
---

I've recreated the Netflix Intro on a .NET Console. 🤯

And I will explain to you how.

## 🧐 Why do it?

I've watched a video of a [Kevin Parry](https://www.youtube.com/c/kevinparry) [recreating the Netflix Intro using yarn](https://www.youtube.com/watch?v=M1qj21eBzNc), and I asked myself: _Would I be able to do it with .NET on a Terminal?_

Will I be using it in production? The answer is No.
But it's a fun challenge, and I was curious like a cat 🐱.

## 🏔 The challenge

How can I build an animation using visuals and audio on a **Terminal that looks like the Netflix Intro**?

So, I decided to split the problem in two.

1.  How to display an animation.
2.  How to play sound at the same time.

## 🖥 How to display the animation

These days, when I think about a good terminal experience and .NET, I think about [Spectre.Console](https://spectreconsole.net/). So, that was where I headed.

Spectre has a [canvas image](https://spectreconsole.net/widgets/canvas-image), and that made me think about GIFs. Spectre Image Canvas will not display a moving GIF, but a GIF isn't much more than a sequence of images. So, can I do the same?

There's a cool library part of the [mono project](https://www.mono-project.com/), [SkiaSharp](https://github.com/mono/SkiaSharp), that can access the metadata of an image. After exploring the samples on GitHub, I realized that SkiaSharp extracts GIF frames and frame duration.

Now, the question was: _Now that I have the Frames, how can I display them in movement?_ I don't want to render frame after frame. They need to render in the same place, the same square, and the same coordinates.

The good news is that Spectre.Console has a [Live Display](https://spectreconsole.net/live/live-display) widget.

The **Live Display can update components in place**, so it is perfect for the job.

### 👨‍🎨 Animation in practice

Now that we have a strategy, the first step is to get a Netflix Intro GIF. A quick google search will do that for me.

Having the GIF, I bring it into a simple .NET Console application. Make sure that the GIF is copied to the output directory.

Install `Spectre.Console`, `SkiaSharp`, and I'm ready to go.

```bash
dotnet add package Spectre.Console
dotnet add package SkiaSharp
```

The following code will get the frames, iterate through them, and display them on the Terminal.

```csharp
using SkiaSharp;
using Spectre.Console;

await AnsiConsole.Live(Text.Empty)
    .StartAsync(async ctx =>
    {
        var stream = new SKManagedStream(
            new FileStream("netflix.gif", FileMode.Open), true);
        var codec = SKCodec.Create(stream);
        var frames = codec.FrameInfo;

        var info = codec.Info;
        var bitmap = new SKBitmap(info);

        for (var frame = 0; frame < frames.Length; frame++)
        {
            var opts = new SKCodecOptions(frame);
            if (codec?.GetPixels(info, bitmap.GetPixels(), opts) != SKCodecResult.Success) continue;

            using var memStream = new MemoryStream();
            using var wStream = new SKManagedWStream(memStream);
            bitmap.Encode(wStream, SKEncodedImageFormat.Jpeg, 100);
            memStream.Position = 0;
            var data = memStream.ToArray();

            var canvasImage = new CanvasImage(data).MaxWidth(100);
            ctx.UpdateTarget(canvasImage);

            var duration = frames[frame].Duration;
            if (duration <= 0)
                duration = 100;
            await Task.Delay(duration);

        }

    });
```

## 🎧 How to trigger sound

The visual animation without that famous _"Tuduuuummmmmmmmm"_ doesn't have the same feeling.

Unfortunately, **there's no easy way of triggering it since .NET Core**.

_It's important to say that I was building it on macOS. The solution I will implement may not be the same on Windows, but the approach would be._

Since I couldn't rely on .NET to play the sound, **I decided to trigger a process using an application that could do it**. On macOS, I can run `afplay` with the path to an audio file, and it will play.

```bash
afplay netflix.mp3
```

### 🎶 Sound in practice

Once again, the first step is getting the Netflix Intro audio. Nothing that a Google Search can't resolve.

Download the audio file to the project folder and make sure it is copied to the output directory.

To start the process, I decided to use [CliWrap](https://github.com/Tyrrrz/CliWrap), a cool open-source project that simplifies the process.

With CliWrap, it's as simple as 👇

```csharp
Cli
    .Wrap("afplay")
    .WithArguments("netflix.mp3")
    .ExecuteAsync();
```

Now that I have a way to play it, I just need to decide how.

Since I'm going through each frame, one option it's to start it when the first frame is rendered.

So, let's do it.

```csharp
using CliWrap;
using SkiaSharp;
using Spectre.Console;

await AnsiConsole.Live(Text.Empty)
    .StartAsync(async ctx =>
    {
        var stream = new SKManagedStream(
            new FileStream("netflix.gif", FileMode.Open), true);
        var codec = SKCodec.Create(stream);
        var frames = codec.FrameInfo;

        var info = codec.Info;
        var bitmap = new SKBitmap(info);

        for (var frame = 0; frame < frames.Length; frame++)
        {
            var opts = new SKCodecOptions(frame);
            if (codec?.GetPixels(info, bitmap.GetPixels(), opts) != SKCodecResult.Success) continue;

            using var memStream = new MemoryStream();
            using var wStream = new SKManagedWStream(memStream);
            bitmap.Encode(wStream, SKEncodedImageFormat.Jpeg, 100);
            memStream.Position = 0;
            var data = memStream.ToArray();

            var canvasImage = new CanvasImage(data).MaxWidth(100);
            ctx.UpdateTarget(canvasImage);

            if (frame is 0)
                _ = Task.Run(() => Play("netflix.mp3"));

            var duration = frames[frame].Duration;
            if (duration <= 0)
                duration = 100;
            await Task.Delay(duration);

        }

    });


static Task Play(string filename) =>
    Cli
        .Wrap("afplay")
        .WithArguments(filename)
        .ExecuteAsync();
```

As you can see, the Play method will be invoked only on the first frame. I don't `await` for the task because I want them running side by side.

Now, it's time to run it.

![Netflix Intro on a .NET Console](/images/archive/dotnet/netflix-intro-dotnet-console.png)

If you are curious about the result, and you want to see it in action, I have a video here 👇

https://www.youtube.com/watch?v=fgm2I8aSDNg

Let me know what you think about it. Follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira), and let's keep in touch.

Just keep things Simple 🌱
