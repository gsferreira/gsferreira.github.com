---
layout: post
tags: post
date: 2019-04-10
title: Logging gRPC requests using Serilog
description: Using an Interceptor to log gRPC requests in .net.
category: .net, .net Core, gRPC, Serilog
---

Using a Middleware to log Api Requests in ASP.NET Core is a no brainer.

If you have given a try to [gRPC](https://grpc.io/), probably you want to follow the same technique and you will wish that the experience was the same.

I've faced this challenge, in order to log the requests to my RPC services and I've been looking for a solution where:

- I can use [Serilog](https://serilog.net/) to log the requests
- I know all the requests made to my services
- I know how long each request takes to respond
- I know the response status
- I can correlate each log entry using a Correlation ID

To accomplish that in gRPC, I took advantage of an **Interceptor**.

Using an interceptor, you can intercept the invocation of GRPC methods and intercept Unary calls (Request/Response) or Streaming communication.

In this example, we will be using a **Unary Interceptor**.

_This example has been done on top of gRPC HelloWorld sample in version 1.19.0_

## Step 1: Install Serilog

Start by download the Sample code from gRPC. You can find the instructions [here](https://grpc.io/docs/quickstart/csharp.html).

Install in the GreeterServer the serilog package `Install-Package Serilog.Sinks.Console -Version 3.1.1`.

I'm using the Console Sink for demonstration proposes. You can easily find tons of sinks like File, Seq, Application Insights, Datadog, etc.

To enable Serilog, create the logger at the beginning of the GreeterServer _Main_.

```csharp
public static void Main(string[] args)
{
  Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();
  (...)
}
```

## Step 2: Create the Interceptor

In the GreeterServer project create the _RequestLoggerInterceptor_.

```csharp
using Grpc.Core;
using Grpc.Core.Interceptors;
using Serilog;
using System.Diagnostics;
using System.Threading.Tasks;

namespace GreeterServer
{
  public class RequestLoggerInterceptor : Interceptor
  {
    private const string MessageTemplate =
      "{RequestMethod} responded {StatusCode} in {Elapsed:0.0000} ms";

    public override async Task<TResponse> UnaryServerHandler<TRequest, TResponse>(TRequest request, ServerCallContext context, UnaryServerMethod<TRequest, TResponse> continuation)
    {
      var sw = Stopwatch.StartNew();

      var response = await base.UnaryServerHandler(request, context, continuation);

      sw.Stop();
      Log.Logger.Information(MessageTemplate,
            context.Method,
            context.Status.StatusCode,
            sw.Elapsed.TotalMilliseconds);

      return response;
    }
  }
}
```

This interceptor is just logging the Status Code for each request and the time used to complete the execution.

## Step 3: Apply interceptor to the service

To take effect, you need to bind the interceptor to the Service you want. To do that, go to the _Program.cs_ and configure the Server service binding to use the interceptor for the Greeter service.

```csharp
using Grpc.Core.Interceptors;
(...)
Server server = new Server
{
  Services = { Greeter.BindService(new GreeterImpl()).Intercept(new RequestLoggerInterceptor()) },
    Ports = { new ServerPort("localhost", Port, ServerCredentials.Insecure) }
};
```

The Intercept method is an extension method, so don't forget to use _Grpc.Core.Interceptors_ namespace.

If you run the samples now, you will see this as a result.

![Log entry](/images/logging-grpc-requests-using-serilog-simple-log-line.png)

## Step 4: Add Correlation ID

If you have multiple services being part of the execution of a particular request, most probably you would take advantage of having a Correlation ID to track the execution of a given request in every service. If you don't have one, I highly recommend you to do it.

In this example, we will be sending the Correlation ID as an gRPC request header and change the Interceptor to add it to every log line.

Let's start by add the Correlation ID header to the RPC request done by _GreeterClient_.

```csharp
var reply = client.SayHello(new HelloRequest { Name = user }, new Metadata()
{
  new Metadata.Entry("X-Correlation-Id", Guid.NewGuid().ToString())
});
```

_In this example, I'm generating a Guid just for demo purposes._

In the interceptor, access to the Correlation ID and push it to Serilog as a property. In this way, every single log entry on that context will have the Correlation Id property available.

```csharp
using Grpc.Core;
using Grpc.Core.Interceptors;
using Serilog;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace GreeterServer
{
  public class RequestLoggerInterceptor : Interceptor
  {
    private const string MessageTemplate =
      "{RequestMethod} responded {StatusCode} in {Elapsed:0.0000} ms";

    public override async Task<TResponse> UnaryServerHandler<TRequest, TResponse>(TRequest request,
      ServerCallContext context, UnaryServerMethod<TRequest, TResponse> continuation)
    {
      var sw = Stopwatch.StartNew();

      var correlationId = context.RequestHeaders
            .FirstOrDefault(h => h.Key.Equals("X-Correlation-Id", StringComparison.OrdinalIgnoreCase))?.Value;
      using (Serilog.Context.LogContext.PushProperty("CorrelationID", correlationId))
      {
        var response = await base.UnaryServerHandler(request, context, continuation);

        sw.Stop();
        Log.Logger.Information(MessageTemplate,
              context.Method,
              context.Status.StatusCode,
              sw.Elapsed.TotalMilliseconds);

        return response;
      }
    }
  }
}
```

To complete the work, we need to configure Serilog to use the Properties pushed to the context.

Go back to the _GreeterServer Program_ and change the logger configuration to have a template where you use the Correlation ID and configure the log enrichment with the context properties.

```csharp
Log.Logger = new LoggerConfiguration()
        .Enrich.FromLogContext()
        .WriteTo.Console(outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level}] [{CorrelationID}] {Message}{NewLine}{Exception}")
        .CreateLogger();
```

## Step 5: Profit!

In this tutorial, we created a simple gRPC interceptor. Now you have a request log with status codes and timings.

![Log entry with Correlation ID](/images/logging-grpc-requests-using-serilog-simple-log-line-with-correlation-id.png)

Go ahead and give it a try.
