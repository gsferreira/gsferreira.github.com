---
layout: post
tags: post
date: 2023-12-13
title: A BETTER Way to Kafka Event-Driven Applications with C#
description: Build better C# Kafka event-driven applications with KafkaFlow - simplified patterns, middleware, and maintainable architecture.
featured_image: /images/archive/highlight/a-better-way-to-kafka-event-driven-applications-with-csharp.png
---

https://youtu.be/4e18DZkf-m0?si=QMgwWgQFKFZqRbD3

Building event-driven applications on top of Apache Kafka can be hard.
Using the [.NET client library by Confluent](https://github.com/confluentinc/confluent-kafka-dotnet) can give a lot of work.

There are many patterns in this type of application and I want to show you a framework that will help you build your event-driven applications on top of Apache Kafka in a simple and maintainable way.

The framework that I want to show you is [KafkaFlow](https://github.com/farfetch/kafkaflow) which is an Open-Source project developed by [FARFETCH](https://farfetch.com/).

KafkaFlow will help us simplify the process of building event-driven applications on Apache Kafka in a straightforward and maintainable manner.

## Introduction to KafkaFlow

KafkaFlow is built on top of the Confluent Kafka client, providing a set of features to enhance the development of event-driven applications. These features simplify working with the Confluent client library, making your development process more efficient and maintainable.

### Key Features of KafkaFlow

Before diving into the code, let's explore some of the key features offered by KafkaFlow, as outlined in the documentation:

- **Dependency Injection:** KafkaFlow allows you to define the configuration of your relationship with Kafka through dependency injection, streamlining the setup process.
- **Middleware:** KafkaFlow introduces the concept of middleware, offering a way to apply serialization and other processing logic when publishing or consuming messages.
- **Batch Consume:** A useful feature for consuming messages in batches, allowing efficient processing and reducing the overhead of handling individual messages.
- **Multithreaded Consumer:** KafkaFlow supports multithreaded consumers, enabling parallel processing and scalability within a single application instance.
- **Management API and Dashboard:** KafkaFlow provides a management API and a dashboard for monitoring and managing your Kafka-based applications.

Now, let's dive into a practical example to see how KafkaFlow can be applied to build a simple event-driven application.

## Building a Task Management Application

In this example, we'll create a task management application with a REST API that will produce messages and two consumer applications for handling statistics and notifications.

_**Note:** This is not an extensive tutorial. We will focus on how to use KafkaFlow._

### Setting Up KafkaFlow

To get started, create a simple ASP.NET API with an endpoint to create tasks.

You can find here how to do it using [Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis).

```csharp
// Map endpoint
app.MapPost("/add", RequestHandler.HandleAsync);

// Request
public record AddTaskRequest(string Title, string? Description, DateOnly? DueDate);

// Handler
public static class RequestHandler
{
    public static async Task<IResult> HandleAsync(
        AddTaskRequest request, CancellationToken cancellationToken)
    {
        // TODO
        return Results.Accepted();
    }
}
```

Now, let's move on to produce a new Kafka message when that endpoint is invoked.

To get started, install the KafkaFlow NuGet packages.

```bash
dotnet add package KafkaFlow --version 3.0.1
dotnet add package KafkaFlow.LogHandler.Microsoft --version 3.0.1
dotnet add package KafkaFlow.Microsoft.DependencyInjection --version 3.0.1
dotnet add package KafkaFlow.Serializer.JsonCore --version 3.0.1
```

Configure KafkaFlow through dependency injection, defining the Kafka cluster's brokers and the topic to be used.

```csharp
// Program.cs (or Startup.cs)
builder.Services.AddKafka(
    kafka => kafka
        .AddCluster(cluster=>
        {
            const string topicName = "tasks";
            cluster
                .WithBrokers(new[] { "localhost:9092" })
                .CreateTopicIfNotExists(topicName, 3, 3)
                .AddProducer(
                    "publish-task",
                    producer => producer
                        .DefaultTopic(topicName)
                        .AddMiddlewares(middlewares=>
                            middlewares
                                .AddSerializer<JsonCoreSerializer>()));
        })
);
```

In this configuration, we've defined a Kafka cluster with a producer named "publish-task". We are also defining the target topic and using `System.Text.Json` to serialize the message.

### Implementing the Task API (Producer)

Next, let's update our API endpoint for producing task messages. This API will act as the producer, publishing messages to the Kafka topic.

```csharp
// RequestHandler.cs
public static class RequestHandler
{
    public static async Task<IResult> HandleAsync(
        IProducerAccessor producerAccessor,
        AddTaskRequest request, CancellationToken cancellationToken)
    {
        var producer = producerAccessor.GetProducer("publish-task");

        await producer.ProduceAsync(
            null,
            request
        );

        return Results.Accepted();
    }
}
```

In this example, the `RequestHandler` uses the KafkaFlow `IProducerAccessor` to get the configured producer by name and then publish messages to the Kafka topic when a new task is added.

### Implementing a Notifications Consumer

Start by creating a simple console application.

Now, install KafkaFlow packages.

```bash
dotnet add package KafkaFlow --version 3.0.1
dotnet add package KafkaFlow.Extensions.Hosting --version 3.0.1
dotnet add package KafkaFlow.LogHandler.Microsoft --version 3.0.1
dotnet add package KafkaFlow.Microsoft.DependencyInjection --version 3.0.1
dotnet add package KafkaFlow.Serializer.JsonCore --version 3.0.1
dotnet add package KafkaFlow.TypedHandler --version 3.0.1

dotnet add package Microsoft.Extensions.Logging.Console
```

Now, let's add a reference to the Tasks API, so we can share the message contract.

```xml
<ItemGroup>
	<ProjectReference Include="..\TaskApi\TaskApi.csproj" />
</ItemGroup>
```

Let's start by defining the boilerplate of our `Program.cs`.

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

const string topicName = "tasks";
var services = new ServiceCollection();

services.AddLogging(configure => configure.AddConsole());

// TODO - KafkaFlow configuration

Console.WriteLine("Press key to exit");
Console.ReadKey();
```

Now we can configure the consumer.

```csharp
services.AddKafkaFlowHostedService(
    kafka => kafka
        .UseMicrosoftLog()
        .AddCluster(cluster =>
        {
            cluster
                .WithBrokers(new[] { "localhost:9092" })
                .AddConsumer(consumer =>
                    consumer
                        .Topic(topicName)
                        .WithGroupId("notifications")
                        .WithBufferSize(100)
                        .WithWorkersCount(3)
                        .WithAutoOffsetReset(KafkaFlow.AutoOffsetReset.Earliest)
                        .AddMiddlewares(middlewares => middlewares
                            .AddDeserializer<JsonCoreDeserializer>()
                            .AddTypedHandlers(handlers =>
                                handlers.AddHandler<AddTaskHandler>()
                            )
                        )
                );
        })
);
```

Notice that in this example we are using the method `AddKafkaFlowHostedService`. This will register a hosted service for us.

One interesting part of it is the concept of Middlewares. KafkaFlow uses Middlewares as a kind of Chain of Responsibility. Each Middleware can handle, transform or delegate a message. In this case, we are first transforming the message by deserializing it, and then we forward it to a Typed Handler middleware. If you are familiar with MediatR, you automatically know what Typed Handlers are. The middleware will try to find a Handler capable of handling that message type.

That takes us to the next step. Creating the handler. So, create a new class and implement the `IMessageHandler` interface.

```csharp
// AddTaskHandler.cs
using KafkaFlow;
using KafkaFlow.TypedHandler;
using Microsoft.Extensions.Logging;

public class AddTaskHandler : IMessageHandler<AddTaskRequest>
{
    private readonly ILogger<AddTaskHandler> _logger;

    public AddTaskHandler(ILogger<AddTaskHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(IMessageContext context, AddTaskRequest message)
    {
        if (message.DueDate.HasValue)
            _logger.LogInformation("New Task {Title} scheduled to {DueDate}",
                message.Title,
                message.DueDate);

        return Task.CompletedTask;
    }
}
```

The `Handle` method is invoked whenever a message received is deserialized to the type `AddTaskRequest`.

### Running the Application

To run the application, build the service provider, create a bus, and start the bus.

```csharp
// Program.cs

// after adding KafkaFlow configuration...
var provider = services.BuildServiceProvider();
var bus = provider.CreateKafkaBus();

await bus.StartAsync();

Console.WriteLine("Press key to exit");
Console.ReadKey();
```

This code ensures that the KafkaFlow message bus is started, allowing the application to send and receive messages.

### Implementing a Statistics Consumer

I want to show you one more KafkaFlow feature.
So, create a new console application for Statistics. Add the same packages you added to the Notifications application. And update the `Program.cs` with the following example.

```csharp
using KafkaFlow;
using KafkaFlow.Serializer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

const string topicName = "tasks";
var services = new ServiceCollection();

services.AddLogging(configure => configure.AddConsole());

services.AddKafkaFlowHostedService(
    kafka => kafka
        .UseMicrosoftLog()
        .AddCluster(cluster =>
        {
            cluster
                .WithBrokers(new[] { "localhost:9092" })
                .AddConsumer(consumer =>
                    consumer
                        .Topic(topicName)
                        .WithGroupId("statistics")
                        .WithBufferSize(100)
                        .WithWorkersCount(3)
                        .WithAutoOffsetReset(KafkaFlow.AutoOffsetReset.Earliest)
                        .AddMiddlewares(middlewares => middlewares
                            .AddDeserializer<JsonCoreDeserializer>()
                            // TODO
                        )
                );
        })
);

var provider = services.BuildServiceProvider();

var bus = provider.CreateKafkaBus();
await bus.StartAsync();

Console.WriteLine("Press key to exit");
Console.ReadKey();
```

#### Implementing a Batch Consumer

Now, let's take a look into other interesting Feature. Batch consuming.
In many use cases, it's worth processing messages in batch to optimize the system.

KafkaFlow gives you an easy way to do that through a middleware.

Go ahead and install the BatchConsume package.

```bash
dotnet add package KafkaFlow.BatchConsume --version 3.0.1
```

Now, let's go back to the `Program.cs` and right after the `AddDeserializer` middleware, we will configure batching.

```csharp
.AddBatching(100, TimeSpan.FromSeconds(5))
.Add<StatisticsMiddleware>()
```

You do it by configuring the batch size and the maximum time to wait. Now, KafkaFlow will forward to the next middleware, the `StatisticsMiddleware` a batch of messages, every 5 seconds or every time the batch has 100 messages.

Once you have that, you can process the batch at once.

```csharp
using KafkaFlow;
using KafkaFlow.BatchConsume;

public class StatisticsMiddleware: IMessageMiddleware
{
    private static int _total = 0;
    public Task Invoke(IMessageContext context, MiddlewareDelegate next)
    {
        var batch = context.GetMessagesBatch();

        _total += batch.Count;

        Console.WriteLine($"Current Total: {_total}");
        return Task.CompletedTask;
    }
}
```

Now we can run our applications and send an HTTP request to the Tasks API, adding tasks to the system. Monitor the console output of the consumers (notifications and statistics) to observe the processing of messages.

## Conclusion

In this tutorial, we explored the KafkaFlow framework to simplify the development of event-driven applications on Apache Kafka. We have seen how simple it is to configure it through the fluent API.

We have also seen how to take advantage of some advanced features like batching.
Consider exploring additional features of KafkaFlow, such as the Administration Dashboard and API. As you delve deeper into KafkaFlow, you'll find it to be a valuable tool for building robust and efficient event-driven applications.

Remember to check the KafkaFlow documentation for more in-depth information on its features and capabilities.
