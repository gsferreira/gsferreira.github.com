---
layout: post
tags: post
date: 2021-11-24
title: Uploading files with ASP.NET Minimal APIs
description: How to map an endpoint to upload files with ASP.NET Minimal APIs.
featured_image: /images/archive/highlight/uploading-files-with-aspnet-minimal-apis.png
---

With the .net 6 release, I was extremely excited to play with **[Minimal APIs](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0)**.

One of the first things that I've done was to move an existing project to .net 6 and convert my Controllers into a Minimal API.

I've found the process easy, but **I was surprised when the tests for an Upload endpoint failed**.

My implementation after converting into Minimal API Endpoint was this. 👇

```csharp
app.MapPost("/upload",
    async Task<IResult>(IFormFile request) =>
    {
        if (request.Length == 0)
            return Results.BadRequest();

        await using var stream = request.OpenReadStream();

        var reader = new StreamReader(stream);
        var text = await reader.ReadToEndAsync();

        return Results.Ok(text);
    });
```

And the test this. 👇

```csharp
await using var application = new Application();
using var client = application.CreateClient();

using var formData = new MultipartFormDataContent();
await using var file = File.OpenRead("text.txt");
var streamContent = new StreamContent(file);
formData.Add(streamContent, "file", "text.txt");

var response = await client.PostAsync("/upload",
    formData);

response.StatusCode.Should().Be(HttpStatusCode.OK);
var data = await response.Content.ReadAsStringAsync();
data.Should().Be("\"Hello World!\"");
```

The expected _200 OK_ status code was now a _415 Unsupported Media Type_ 🤔

That was strange. My first thought was that I was missing to define the content type accepted by that endpoint.

```csharp
.Accepts<IFormFile>("multipart/form-data");
```

I realized I was stupid by thinking that since the code above is just about adding OpenAPI Metadata. 😅

Then, finally, I got it. Minimal APIs will try to bind attributes with the assumption that content is JSON.

## So, how do I handle it?

I had to **receive the HttpRequest request as an argument**.

Then, I was able to read the Form and look for files.

```csharp
app.MapPost("/upload",
    async Task<IResult>(HttpRequest request) =>
    {
        if (!request.HasFormContentType)
            return Results.BadRequest();

        var form = await request.ReadFormAsync();
        var formFile = form.Files["file"];

        if (formFile is null || formFile.Length == 0)
            return Results.BadRequest();

        await using var stream = formFile.OpenReadStream();

        var reader = new StreamReader(stream);
        var text = await reader.ReadToEndAsync();

        return Results.Ok(text);
    });
```

In the end, it requires a lit bit of extra effort, but it's not a big deal. Maybe in a future version, we may have a simple way of accomplishing it.

I hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
