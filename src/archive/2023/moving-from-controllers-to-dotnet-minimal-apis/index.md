---
layout: post
tags: post
date: 2023-04-28
title: Moving from Controllers to .NET Minimal APIs
description: If you are wondering how to move your .NET MVC API Controllers to Minimal APIs, this blog post is for you.
featured_image: /images/archive/highlight/moving-from-controllers-to-dotnet-minimal-apis.png
---

https://www.youtube.com/watch?v=MuecFu7CCMQ

How can you refactor your API Controllers code to embrace [Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)?

With .NET's recent push towards more Minimal APIs, now is the perfect time to consider refactoring your Controllers for a Minimal API approach. In this blog post, we'll explore how to make this transition.

## Context

As the baseline for this refactoring, we will be using the [Clean Architecture Template](https://github.com/jasontaylordev/CleanArchitecture) by [Jason Taylor](https://jasontaylor.dev/).

We will refactor some of the controllers that you can find in the _WebUI_ project into Minimal APIs endpoints. We will not only do that, but we will also structure the project into a Feature Driven organization.

We will do this refactoring manually, without bringing tools or frameworks, so you can understand how it works under the wood. However, by the end, I will reference a Framework that might be useful.

## Refactoring Pre-conditions

Refactoring can be a daunting task, but having proper tests in place can provide peace of mind and confidence in your changes.

Ensure your tests cover the API to catch any regressions as you make the transition to Minimal APIs. **I would not start the refactoring without a safety net.**

## A Simple Case: Weather Controller

Let's begin our refactoring journey with a straightforward example: the Weather Controller.

The first step is to add a new directory `WeatherForecast`.
Inside, let's add a static class `GetEndpoint`.

The `GetEndpoint` class will have 2 methods. One for endpoint mapping and the other one to handle the request. Let's start with the Map.

```csharp
public static class GetEndpoint
{
    public static WebApplication MapGetWeatherForecastEndpoint(this WebApplication app)
    {
        //...
    }

}
```

To define the route, we take advantage of the existing conventions on the Controller. So the code will be like this:

```csharp
public static WebApplication MapGetWeatherForecastEndpoint(this WebApplication app)
{
    app.MapGet("api/WeatherForecast", GetAsync);
    return app;
}
```

For the Handle method, we need to review the Input and Output types.
Then, we copy and paste the code from the Controller.

```csharp
public static class GetEndpoint
{
    public static WebApplication MapGetWeatherForecastEndpoint(this WebApplication app)
    {
        app.MapGet("api/WeatherForecast", GetAsync);
        return app;
    }

    private static async Task<IEnumerable<ControllersToMinimalApis.Application.WeatherForecasts.Queries.GetWeatherForecasts.WeatherForecast>> GetAsync()
    {
        return await mediator.Send(new GetWeatherForecastsQuery());
    }
}
```

If the Controller has constructor parameters, the Minimal API endpoint needs method parameters ([see here](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/parameter-binding?view=aspnetcore-7.0#parameter-binding-with-dependency-injection)). The `ISender mediator` is one of those.

```csharp
public static class GetEndpoint
{
    public static WebApplication MapGetWeatherForecastEndpoint(this WebApplication app)
    {
        app.MapGet("api/WeatherForecast", GetAsync);
        return app;
    }

    private static async Task<IEnumerable<ControllersToMinimalApis.Application.WeatherForecasts.Queries.GetWeatherForecasts.WeatherForecast>> GetAsync(ISender mediator)
    {
        return await mediator.Send(new GetWeatherForecastsQuery());
    }
}
```

Now, go to `Program.cs` and call the map method.

```csharp
// ...
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

// HERE  👇
app.MapGetWeatherForecastEndpoint();

app.MapRazorPages();

app.MapFallbackToFile("index.html"); ;

app.Run();

```

Remove the old Controller, and run your tests/application.

## When a Controller Has Many Hats

Let's tackle a more complex case: the Todos Controller. This Controller has multiple routes for creating, retrieving, updating, and deleting todos. Let's see how to approach a case like this, replacing a single controller with many Minimal API endpoints.

Let's do this in a Feature Driven way. So, let's first create a folder. `TodoLists`. Inside it, let's create a `GetTodoList` folder. This will be the home of our Todo list endpoint.

Now, let's create a static class `Endpoint`. The process will be the same as we have done for the Weather Controller.

So, the migrated code will be:

```csharp
public static class Endpoint
{
    public static WebApplication MapGetTodoListEndpoint(this WebApplication app)
    {
        app.MapGet("api/TodoLists", GetAsync)
            .RequireAuthorization();
        return app;
    }

    private static async Task<TodosVm> GetAsync(ISender mediator)
    {
        return await mediator.Send(new GetTodosQuery());
    }
}
```

The difference is that you will find an `Authorization` Attribute on the Controller. To apply that, you to call the `RequireAuthorization` method on the Mapping.

```csharp
app.MapGet("api/TodoLists", GetAsync)
    .RequireAuthorization();
```

And it's done.

Let's do one more. Let's take a look into the Update.

On the Update Action, you see that the result might be a Bad Request, Not Found, or OK. That's why the return type is `ActionResult`. While on the Minimal API Endpoint, we need to return `IResult`. We do it using methods like `Results.BadRequest` or `Results.NotFound`.

```csharp
public static class Endpoint
{
    public static WebApplication MapUpdateTodoListEndpoint(this WebApplication app)
    {
        app.MapPut("api/TodoLists/{id:int}", UpdateAsync)
            .RequireAuthorization();
        return app;
    }

    private static async Task<IResult> UpdateAsync(ISender mediator, int id, UpdateTodoListCommand command)
    {
        if (id != command.Id)
        {
            return Results.BadRequest();
        }

        await mediator.Send(command);

        return Results.NoContent();
    }
}
```

Now, call the mapping method on `Program.cs`, remove the old Controller, and voilá.

## A Helpful Tool

If you have been holding to API Controllers due to the convention-based approach, and you don't want to do this "tidying" by hand, you can use [FastEndpoints](https://fast-endpoints.com/). FastEndpoints is a framework that will simplify your work and nudge you in the right direction.

## Summary

Embracing Minimal APIs in .NET can lead to more streamlined, efficient code. If you are looking for those performance gains, I hope this example helps you understand how to approach refactoring. And with tools like Fast Endpoints, transitioning to Minimal APIs can be even more accessible.

Keep it Simple 🌱
